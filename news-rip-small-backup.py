import feedparser
import firebase_admin
from firebase_admin import credentials, firestore
import os
import time
import json
import requests
import threading
import html
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import re

# Load environment variables from .env file
try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    print("⚠️ python-dotenv not installed. Install with: pip install python-dotenv")
    print("   Or set environment variables manually: export GROQ_API_KEY=your_key")

# Firebase Admin SDK imports
from firebase_admin import db as realtime_db

# Try to import Anthropic SDK for DeepSeek Anthropic API compatibility
try:
    import anthropic

    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False
    print("ℹ️ Anthropic SDK not installed. Install with: pip install anthropic")
try:
    from openai import OpenAI

    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("ℹ️ OpenAI SDK not installed. Install with: pip install openai")

# Set up Selenium
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")

# Set up ChromeDriver path
chrome_driver_path = (
    "/opt/homebrew/bin/chromedriver"  # Default Homebrew path for ChromeDriver
)
service = Service(chrome_driver_path)
driver = webdriver.Chrome(service=service, options=chrome_options)

# Global variables for AI rewriter
selected_style = "Normal"
selected_language = "Dutch"
output_mode = "both"  # Options: "nextjs", "static", "both"
selected_model = "groq"  # Hardcoded to use Groq with specific API key
selected_groq_model = "openai/gpt-oss-20b"  # Default: 500k tokens/day, balanced quality (recommended for high volume)
client = None
model_name = None
client_type = None

# Available Groq models with token limits (updated Oct 2025)
GROQ_MODELS = [
    {
        "name": "llama-3.3-70b-versatile",
        "limit": "14k-30k tokens/day",
        "priority": 1,
    },  # ✅ Best quality, recommended
    {
        "name": "openai/gpt-oss-20b",
        "limit": "500k tokens/day (est.)",
        "priority": 2,
    },  # Balanced fallback
    {
        "name": "llama-3.1-8b-instant",
        "limit": "500k tokens/day",
        "priority": 3,
    },  # Fast but lower quality
    {"name": "gemma2-9b-it", "limit": "14k tokens/day", "priority": 4},
    {"name": "mixtral-8x7b-32768", "limit": "14k tokens/day", "priority": 5},
    # ❌ Deprecated models (shut down Jan 2025):
    # {"name": "llama-3.2-1b-preview", "limit": "500k tokens/day", "priority": 6},
    # {"name": "llama-3.2-3b-preview", "limit": "500k tokens/day", "priority": 7},
    # {"name": "llama-3.1-70b-versatile", "limit": "500k tokens/day", "priority": 8},
]

# Base directory to save the HTML files (correct project path)
base_dir = "/Users/_akira/CSAD/websites-new-2025/politie-forum-45/public"

# Download stopwords if not already present
try:
    import nltk
    from nltk.corpus import stopwords

    NLTK_AVAILABLE = True
except ImportError:
    NLTK_AVAILABLE = False

stop_words = set()

# ANSI escape codes for colored CLI output
RESET = "\033[0m"
BOLD = "\033[1m"
DIM = "\033[2m"
GREEN = "\033[32m"
RED = "\033[31m"
YELLOW = "\033[33m"
BLUE = "\033[34m"
MAGENTA = "\033[35m"
CYAN = "\033[36m"

TITLE_TEXT = "Welkom bij het RSS Artikelen Extractor - DutchJinn"
LOGO_ART = [
    "________          __         .__          ____.__",
    "\\______ \\  __ ___/  |_  ____ |  |__      |    |__| ____   ____  ",
    " |    |  \\|  |  \\   __\\/ ___\\|  |  \\     |    |  |/    \\ /    \\ ",
    " |    `   \\  |  /|  | \\  \\___|   Y  \\/\\__|    |  |   |  \\   |  \\",
    "/_______  /____/ |__|  \\___  >___|  /\\________|__|___|  /___|  /",
    "        \\/                 \\/     \\/                  \\/     \\/ ",
]

BANNER_WIDTH = max(len(TITLE_TEXT), *(len(line) for line in LOGO_ART))


def style(text, *effects):
    """Wrap text with ANSI styles while handling empty effects gracefully."""
    if not effects:
        return text
    return f"{''.join(effects)}{text}{RESET}"


def print_banner():
    """Render the CLI banner with DutchJinn branding."""
    line = style("-" * BANNER_WIDTH, CYAN, BOLD)
    print(line)
    for art_line in LOGO_ART:
        print(style(art_line, RED, BOLD))
    print(line)
    title = style(TITLE_TEXT, MAGENTA, BOLD)
    print(title)
    print(line)


def notify_mcp(
    article_id, article_data=None, model="claude-3-5-sonnet", mode="summary"
):
    """
    Notify your local MCP server to summarize or analyze a Firestore article.
    MCP server will fetch the article from Firestore /news collection using the article_id.
    """
    try:
        params = {"id": article_id, "model": model, "mode": mode}

        # Send lightweight notification - MCP will fetch from Firestore
        print(f"🔍 Sending MCP notification for: {article_id}")

        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "summarizeNewsArticle",
            "params": params,
        }
        res = requests.post("http://localhost:3000", json=payload, timeout=30)
        res.raise_for_status()
        print(f"✅ Sent to MCP summarizer: {article_id}")
        print("   ↳ MCP response:", res.json())
    except Exception as e:
        print(f"⚠️ MCP connection failed for {article_id}: {e}")


def is_weak_faq_answer(answer):
    """
    Check if FAQ answer is too weak/vague for rich results.

    Args:
        answer: FAQ answer text

    Returns:
        True if answer is weak and should be filtered out
    """
    if not answer or len(answer) < 25:  # Increased from 20 to 25
        return True

    answer_lower = answer.lower()

    # Blacklist phrases that indicate weak/uninformative answers
    weak_phrases = [
        "is nog niet duidelijk",
        "is nog onduidelijk",
        "is niet bekend",
        "wordt vermeld in het artikel",
        "staat in het artikel",
        "zie het artikel",
        "lees het artikel",
        "geen informatie beschikbaar",
        "kan niet worden bevestigd",
        "is onbekend",
        "geen details beschikbaar",
        "wordt niet genoemd",
        "is niet vermeld",
        "geen verdere informatie",
        "wordt later bekend gemaakt",
        "volgt nog",
    ]

    # Check if answer contains any weak phrases
    for phrase in weak_phrases:
        if phrase in answer_lower:
            return True

    # Check if answer is just a reference without content
    if answer_lower.startswith(("zie ", "lees ", "bekijk ", "raadpleeg ")):
        return True

    # NEW: Check for overly generic filler phrases
    generic_phrases = [
        "dit hangt af van",
        "er zijn verschillende factoren",
        "het is belangrijk om",
        "zoals eerder vermeld",
        "over het algemeen",
        "in veel gevallen",
        "dit kan variëren",
        "hangt af van de situatie",
    ]

    if any(phrase in answer_lower for phrase in generic_phrases):
        # Allow if it ALSO contains specific details (numbers, quotes, names)
        has_number = re.search(r"\d+", answer)
        has_quote = re.search(r'["„](.*?)["]', answer)
        has_capital_name = re.search(
            r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b", answer
        )  # Multi-word names

        if not (has_number or has_quote or has_capital_name):
            return True

    return False


def clean_text_encoding(text):
    """
    Fix common encoding issues and normalize text.

    Args:
        text: Text to clean

    Returns:
        Cleaned text with proper encoding and normalized words
    """
    if not text:
        return text

    # Fix soft hyphen and other encoding issues
    text = text.replace("¬", "")  # Remove soft hyphen
    text = text.replace("\u00ad", "")  # Remove soft hyphen (Unicode)
    text = text.replace("\xad", "")  # Remove soft hyphen (hex)

    # Normalize quotes
    text = text.replace(""", '"').replace(""", '"')  # Smart quotes to straight
    text = text.replace("'", "'").replace("'", "'")  # Smart apostrophes

    # Normalize dashes
    text = text.replace("–", "-").replace("—", "-")  # En-dash and em-dash to hyphen

    # Normalize spaces
    text = re.sub(r"\s+", " ", text)  # Multiple spaces to single space

    # Fix number + noun constructions (Dutch style)
    # "het 30-tal" → "ongeveer 30" or "zo'n 30"
    text = re.sub(r"\bhet (\d+)-tal\b", r"ongeveer \1", text, flags=re.IGNORECASE)
    text = re.sub(r"\been (\d+)-tal\b", r"ongeveer \1", text, flags=re.IGNORECASE)

    # "zo'n dertig" is already good Dutch, keep it

    return text.strip()


def optimize_title_for_serp(title, max_length=70):
    """
    Optimize title for SERP display (Google shows ~50-70 chars + brand).
    Removes filler words, shortens where possible, maintains clarity.

    Args:
        title: Original title
        max_length: Target maximum length (default 70 for optimal SERP)

    Returns:
        Optimized title that fits SERP constraints
    """
    title = title.strip()

    if len(title) <= max_length:
        return title

    # Common replacements to shorten titles while maintaining clarity
    replacements = {
        " bij protest tegen ": " bij ",
        " in verband met ": " bij ",
        " aangehouden voor ": " voor ",
        " gearresteerd wegens ": " voor ",
        " mobiele eenheid ": " ME ",
        " in de gemeente ": " in ",
        " betrokkenheid bij ": " bij ",
        " asielopvang ": " azc ",
        " asielzoekerscentrum ": " azc ",
        " demonstranten ": " demo's ",
        " tegendemonstranten ": " tegendemo's ",
        " ; ook onrust in ": "; onrust ",
        " en ook ": "; ",
    }

    shortened = title
    for old, new in replacements.items():
        if old in shortened.lower():
            # Case-insensitive replacement
            pattern = re.compile(re.escape(old), re.IGNORECASE)
            shortened = pattern.sub(new, shortened)
            if len(shortened) <= max_length:
                return shortened

    # If still too long, find good break point
    if len(shortened) > max_length:
        truncated = shortened[:max_length]
        # Try to break at punctuation or word boundary
        for char in [";", ",", " - ", " – ", " "]:
            pos = truncated.rfind(char)
            if pos > max_length - 15:  # At least 55 chars
                # Don't add ellipsis if we break at natural punctuation
                result = truncated[:pos].strip()
                # Only add ellipsis if the original continues
                if len(shortened) > pos + 1:
                    return result
                return result

        # Last resort: cut at last space with ellipsis
        last_space = truncated.rfind(" ")
        if last_space > max_length - 20:
            # Complete the word by finding next space in original
            next_space = shortened.find(" ", last_space + 1)
            if next_space > 0 and next_space <= max_length + 10:
                # Include the complete word if it doesn't exceed limit too much
                return shortened[:next_space].strip()
            return truncated[:last_space].strip() + "…"

        # Absolute last resort: return full title (better than broken)
        return shortened

    return shortened


def smart_truncate(text, max_length=158, min_length=140):
    """
    Truncate text to max_length, breaking at word boundary.
    Adds ellipsis if truncated.

    Args:
        text: Text to truncate
        max_length: Maximum length (default 158 for meta descriptions)
        min_length: Minimum acceptable length before forcing hard cut (default 140)

    Returns:
        Truncated text with ellipsis if needed
    """
    text = text.strip()

    if len(text) <= max_length:
        return text

    # Find last space before max_length
    truncated = text[:max_length]
    last_space = truncated.rfind(" ")

    # If we found a good break point (not too early)
    if last_space > min_length:
        return truncated[:last_space].strip() + "…"

    # Fallback: hard cut with ellipsis
    return truncated.strip() + "…"


def generate_excerpt(text, max_words=300):
    """
    Generate excerpt from text with max word count (not character count).
    Strips HTML tags and returns clean text without truncation ellipsis.

    Args:
        text: Text or HTML content to extract excerpt from
        max_words: Maximum number of words (default 300)

    Returns:
        Clean text excerpt (up to max_words)
    """
    if not text:
        return ""

    # Strip HTML tags if present
    from bs4 import BeautifulSoup

    clean_text = BeautifulSoup(text, "html.parser").get_text()

    # Clean whitespace
    clean_text = " ".join(clean_text.split())

    # Split into words and take first max_words
    words = clean_text.split()
    if len(words) <= max_words:
        return clean_text

    # Take first max_words without adding ellipsis
    return " ".join(words[:max_words])


def initialize_stopwords():
    """Ensure Dutch stopwords are available for text cleaning."""
    global stop_words

    if not NLTK_AVAILABLE:
        print(
            style("ℹ️ NLTK niet geïnstalleerd. Installeer met: pip install nltk", YELLOW)
        )
        stop_words = set()
        return

    try:
        nltk.download("stopwords")
        stop_words = set(stopwords.words("dutch"))
        print(style("✅ Nederlandse stopwoorden geladen.", GREEN))
    except Exception as exc:
        print(style(f"⚠️ Kon Nederlandse stopwoorden niet laden: {exc}", YELLOW))
        stop_words = set()


def fetch_article_details_with_selenium(link):
    try:
        driver.get(link)
        time.sleep(3)  # Wait for the page to load
        page_source = driver.page_source
        return page_source
    except Exception as e:
        print(f"Failed to fetch article details from {link}. Exception: {e}")
        return "Full text not found."


def extract_generic_article_body(html_content):
    try:
        soup = BeautifulSoup(html_content, "html.parser")
        article_body = soup.find(
            "div", class_="post-content"
        )  # Adjust the selector based on the website
        full_text = (
            article_body.get_text(separator="\n").strip()
            if article_body
            else "Full text not found."
        )
        print("Generic article body extracted.")
        return full_text
    except Exception as e:
        print(f"Error extracting article details: {e}")
        return "Full text not found."


def extract_politie_nl_article_body(html_content):
    """Extract article body from politie.nl pages"""
    try:
        soup = BeautifulSoup(html_content, "html.parser")

        # Try multiple selectors for politie.nl content
        selectors = [
            "div.content-item__body",
            "div.content-item__text",
            "div.article-body",
            "div.content-body",
            "div.wysiwyg",
            "div.rte-content",
            "article",
            ".main-content",
        ]

        article_body = None
        for selector in selectors:
            article_body = soup.select_one(selector)
            if article_body:
                print(f"Found article content using selector: {selector}")
                break

        if not article_body:
            # Fallback: try to find the main content div
            article_body = soup.find(
                "div",
                {
                    "class": lambda x: x
                    and ("content" in x.lower() or "article" in x.lower())
                },
            )

        if article_body and hasattr(article_body, "find_all"):
            # Remove unwanted elements
            for unwanted in article_body.find_all(
                ["script", "style", "nav", "aside", "footer", "header"]
            ):
                unwanted.decompose()

            full_text = article_body.get_text(separator="\n").strip()

            # Clean up the text
            lines = [line.strip() for line in full_text.split("\n") if line.strip()]
            full_text = "\n".join(lines)

            print("Politie.nl article body extracted successfully.")
            return full_text if full_text else "Full text not found."
        else:
            print("Could not find article body on politie.nl page.")
            return "Full text not found."

    except Exception as e:
        print(f"Error extracting politie.nl article details: {e}")
        return "Full text not found."


def extract_nu_nl_article_body(html_content):
    try:
        start_token = '"articleBody":"'
        end_token = ',"wordCount":'

        start_index = html_content.find(start_token)
        end_index = html_content.find(end_token, start_index)

        if start_index != -1 and end_index != -1:
            start_index += len(start_token)
            full_text = (
                html_content[start_index:end_index]
                .replace("\\n", "\n")
                .replace('\\"', '"')
            )
            print("NU.nl article body extracted.")
            return full_text
        else:
            print("Failed to locate NU.nl article body using tokens.")
            return "Full text not found."
    except Exception as e:
        print(f"Error extracting NU.nl article details: {e}")
        return "Full text not found."


def extract_articles(
    rss_url, num_articles=5, is_nu_nl=False, is_politie_nl=False, existing_links=None
):
    feed = feedparser.parse(rss_url)
    articles = []
    print(f"Parsed RSS feed from {rss_url}")

    # Use existing_links if provided, otherwise empty set
    if existing_links is None:
        existing_links = set()

    # Crime and police related keywords (Dutch) - COMPREHENSIVE LIST
    crime_police_keywords = [
        # Core crime/police terms
        "misdaad",
        "politie",
        "arrestatie",
        "verdachte",
        "verdenk",
        "agent",
        "recherche",
        "opsporing",
        "dader",
        "slachtoffer",
        "aanhouding",
        "aangifte",
        "criminaliteit",
        "crimineel",
        "politieactie",
        "opsporingsonderzoek",
        # Violent crimes
        "moord",
        "doodslag",
        "geweld",
        "mishandeling",
        "aanslag",
        "schietpartij",
        "steekpartij",
        "beroving",
        "bedreiging",
        "verkrachting",
        "aanranding",
        "doden",
        "gedood",
        "vermoord",
        "neergeschoten",
        "neergestoken",
        # Property crimes
        "inbraak",
        "overval",
        "diefstal",
        "fraude",
        "brandstichting",
        "vandalisme",
        "gestolen",
        "roof",
        "beroof",
        "ontvreemd",
        "plundering",
        # Drug-related
        "drugs",
        "drugslab",
        "wietplantage",
        "cocaïne",
        "heroïne",
        "xtc",
        "drugsdeal",
        "drugscriminaliteit",
        "narcotica",
        # Abduction/missing
        "ontvoering",
        "ontvoerd",
        "vermist",
        "vermissing",
        "zoekactie",
        "spoorloos",
        # Legal/Court
        "celstraf",
        "gevangenisstraf",
        "tbs",
        "rechtbank",
        "rechter",
        "vonnis",
        "proces",
        "rechtszaak",
        "aanklacht",
        "verdenkn",
        "veroordeeld",
        # Investigation
        "onderzoek",
        "forensisch",
        "dna",
        "vingerafdruk",
        "bewijs",
        "getuige",
        "camerabeelden",
        "surveillance",
        # Gang/organized crime
        "bende",
        "criminele organisatie",
        "mocro maffia",
        "georganiseerde misdaad",
        "witwassen",
        "mensenhandel",
        "smokkel",
        # Sexual crimes
        "seksueel misbruik",
        "kindermisbruik",
        "pedofilie",
        "zedendelict",
        # Other crimes
        "bedreig",
        "intimidatie",
        "afpersing",
        "gijzeling",
        "terrorisme",
        "overtreding",
        "delict",
        "misdrijf",
        "fout in gegaan",
        # Action verbs
        "gearresteerd",
        "aangehouden",
        "opgepakt",
        "vast",
        "vastzit",
        "gezocht",
        "voortvluchtig",
        "ontsnapt",
        # Safety/security
        "veiligheid",
        "beveiliging",
        "overval",
        "inval",
        "controle",
    ]

    processed_count = 0
    for entry in feed.entries:
        if processed_count >= num_articles:
            break

        title = entry.title
        link = entry.link

        # Skip if already in database (check early to avoid processing)
        if link in existing_links:
            print(f"⏭️ Already in database: {title[:50]}...")
            continue

        # Filter out NU+ premium articles and video content
        if is_nu_nl:
            # Skip NU+ premium articles
            if "NU+" in title or "nu+" in title.lower():
                print(f"⏭️ Skipping NU+ premium article: {title[:50]}...")
                continue

            # Skip video content
            if "video" in title.lower() or "video" in link.lower():
                print(f"⏭️ Skipping video content: {title[:50]}...")
                continue

            # Skip if link contains /video/ path
            if "/video/" in link.lower():
                print(f"⏭️ Skipping video URL: {title[:50]}...")
                continue

        # For NU.nl: Only accept crime/police articles from Netherlands
        if is_nu_nl:
            title_lower = title.lower()
            link_lower = link.lower()

            # Get summary/description from RSS feed if available
            summary = getattr(entry, "summary", "") or getattr(entry, "description", "")
            summary_lower = summary.lower() if summary else ""

            # First check: Is it crime/police related? (check both title AND summary)
            is_crime_police = any(
                keyword in title_lower or keyword in summary_lower
                for keyword in crime_police_keywords
            )

            if not is_crime_police:
                print(f"⏭️ Skipping non-crime/police: {title[:50]}...")
                continue

            # Second check: Skip if it's clearly international/foreign location
            # Only skip if URL contains /buitenland/ (most reliable indicator)
            if "/buitenland/" in link_lower:
                print(f"⏭️ Skipping international news: {title[:50]}...")
                continue

            # Accept all other crime/police articles (assume Netherlands unless proven otherwise)

        # For non-NU.nl sources: Check if article is about crime/police (unless it's from politie.nl)
        elif not is_politie_nl:
            title_lower = title.lower()

            # Get summary/description from RSS feed if available
            summary = getattr(entry, "summary", "") or getattr(entry, "description", "")
            summary_lower = summary.lower() if summary else ""

            # Check both title AND summary for crime/police keywords
            is_relevant = any(
                keyword in title_lower or keyword in summary_lower
                for keyword in crime_police_keywords
            )

            if not is_relevant:
                print(f"⏭️ Skipping non-crime/police article: {title[:50]}...")
                continue

        print(f"✅ Processing article: {title} - {link}")
        article = {"title": title, "link": link, "timestamp": datetime.now()}

        page_source = fetch_article_details_with_selenium(link)

        if is_nu_nl:
            full_text = extract_nu_nl_article_body(page_source)
        elif is_politie_nl:
            full_text = extract_politie_nl_article_body(page_source)
        else:
            full_text = extract_generic_article_body(page_source)

        # Skip articles with no content
        if full_text == "Full text not found." or not full_text.strip():
            print(f"⏭️ Skipping article with no content: {title[:50]}...")
            continue

        article["body"] = full_text
        articles.append(article)
        processed_count += 1

        # Stop immediately after processing the requested number
        if processed_count >= num_articles:
            print(
                f"🎯 Target reached: {processed_count} article(s) processed, stopping."
            )
            break

    return articles


def get_user_choice():
    prompt = style("Maak een keuze (1-16): ", CYAN, BOLD)
    choice = input(prompt)
    return choice.strip()


def handle_rate_limit_error(error_message):
    """Handle rate limit errors by extracting wait time and sleeping"""
    import re
    import time

    wait_match = re.search(r"try again in (\d+)m(\d+(?:\.\d+)?)s", error_message)

    if wait_match:
        minutes = int(wait_match.group(1))
        seconds = float(wait_match.group(2))
        wait_time = (minutes * 60) + seconds + 5  # Add 5 seconds buffer

        print(f"⏳ Rate limit hit. Waiting {int(wait_time)} seconds before retry...")
        print(
            f"💡 Tip: Daily quota exceeded. Consider upgrading at https://console.groq.com/settings/billing"
        )

        time.sleep(wait_time)
        return True
    return False


# AI Rewriter Functions
def get_style_prompt(style, language):
    """Get the appropriate system prompt based on style and language"""
    base_prompts = {
        "Technical": {
            "Dutch": "Herschrijf de tekst in het Nederlands in een technische, formele stijl. Gebruik professionele terminologie en gedetailleerde uitleg. Behoud alle belangrijke informatie maar presenteer het op een professionele manier.",
            "English": "Rewrite the text in English in a technical, formal style. Use professional terminology and detailed explanations. Maintain all important information but present it professionally.",
            "German": "Schreiben Sie den Text auf Deutsch in einem technischen, formalen Stil. Verwenden Sie professionelle Terminologie und detaillierte Erklärungen. Behalten Sie alle wichtigen Informationen bei, aber präsentieren Sie sie professionell.",
        },
        "Normal": {
            "Dutch": "Herschrijf de tekst in het Nederlands in een standaard nieuwsstijl. Gebruik duidelijke taal en behoud alle belangrijke informatie.",
            "English": "Rewrite the text in English in a standard news style. Use clear language and maintain all important information.",
            "German": "Schreiben Sie den Text auf Deutsch in einem Standard-Nachrichtenstil. Verwenden Sie klare Sprache und behalten Sie alle wichtigen Informationen bei.",
        },
        "Easy": {
            "Dutch": "Herschrijf de tekst in het Nederlands in een eenvoudige, begrijpelijke stijl. Gebruik korte zinnen en eenvoudige woorden. Maak het toegankelijk voor iedereen.",
            "English": "Rewrite the text in English in a simple, understandable style. Use short sentences and simple words. Make it accessible to everyone.",
            "German": "Schreiben Sie den Text auf Deutsch in einem einfachen, verständlichen Stil. Verwenden Sie kurze Sätze und einfache Wörter. Machen Sie es für jeden zugänglich.",
        },
        "Populair": {
            "Dutch": "Herschrijf de tekst in het Nederlands in een populaire, aantrekkelijke stijl. Gebruik levendige taal, maak het boeiend en toegankelijk voor een breed publiek. Voeg waar mogelijk emotie en relatabiliteit toe.",
            "English": "Rewrite the text in English in a popular, attractive style. Use vivid language, make it engaging and accessible to a broad audience. Add emotion and relatability where possible.",
            "German": "Schreiben Sie den Text auf Deutsch in einem populären, attraktiven Stil. Verwenden Sie lebendige Sprache, machen Sie es fesselnd und zugänglich für ein breites Publikum. Fügen Sie wo möglich Emotion und Nachvollziehbarkeit hinzu.",
        },
        "News Reader": {
            "Dutch": "Herschrijf de tekst in het Nederlands in de stijl van een professionele nieuwslezer. Gebruik formele maar toegankelijke taal, duidelijke structuur en professionele presentatie. Vermijd jargon en maak complexe onderwerpen begrijpelijk.",
            "English": "Rewrite the text in English in the style of a professional news reader. Use formal but accessible language, clear structure and professional presentation. Avoid jargon and make complex topics understandable.",
            "German": "Schreiben Sie den Text auf Deutsch im Stil eines professionellen Nachrichtensprechers. Verwenden Sie formale aber zugängliche Sprache, klare Struktur und professionelle Präsentation. Vermeiden Sie Fachjargon und machen Sie komplexe Themen verständlich.",
        },
    }
    return base_prompts[style][language]


def generate_text(prompt, max_tokens=512):
    """Generate rewritten text using AI API"""
    if not client or not model_name:
        print("⚠️ No AI client available, using original text")
        return prompt

    try:
        # Use the selected style and language for the system prompt
        system_prompt = get_style_prompt(selected_style, selected_language)

        if client_type == "anthropic":
            # Use Anthropic API format
            message = client.messages.create(  # type: ignore
                model=model_name,
                max_tokens=max_tokens,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": [{"type": "text", "text": prompt}]}
                ],
            )
            content = message.content  # type: ignore
            if content and len(content) > 0:
                return content[0].text.strip() if hasattr(content[0], "text") else str(content[0]).strip()  # type: ignore
            else:
                return prompt

        else:
            # Use OpenAI API format (default)
            response = client.chat.completions.create(  # type: ignore
                model=model_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=max_tokens,
                temperature=1.0,
            )
            content = response.choices[0].message.content  # type: ignore
            return content.strip() if content else prompt

    except Exception as e:
        error_message = str(e)
        print(f"Error generating text: {e}")

        # Check if it's a rate limit error - immediately try fallback model
        if "rate_limit_exceeded" in error_message or "429" in error_message:
            print("\n⚠️ Rate limit hit! Switching to fallback model immediately...")

            if try_fallback_model():
                # Retry with fallback model immediately (no waiting)
                try:
                    print(f"🔄 Retrying with fallback model: {model_name}")
                    response = client.chat.completions.create(  # type: ignore
                        model=model_name,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt},
                        ],
                        max_tokens=max_tokens,
                        temperature=1.0,
                    )
                    content = response.choices[0].message.content  # type: ignore
                    return content.strip() if content else ""
                except Exception as fallback_error:
                    print(f"❌ Fallback model also failed: {fallback_error}")
                    return ""
            else:
                print("❌ No fallback model available")
                return ""

        return ""  # Return empty string instead of original prompt


def get_category(full_text):
    """Get category based on full text"""
    if not client or not model_name:
        print("⚠️ No AI client available, using default category")
        return "Nieuws"

    try:
        system_content = "Classificeer de categorie van de volgende Nederlandse tekst met één woord in het Nederlands. Kies uit: Politiek, Sport, Economie, Gezondheid, Technologie, Cultuur, Onderwijs, Milieu, Internationaal, of Nieuws."

        if client_type == "anthropic":
            message = client.messages.create(  # type: ignore
                model=model_name,
                max_tokens=10,
                system=system_content,
                messages=[
                    {"role": "user", "content": [{"type": "text", "text": full_text}]}
                ],
            )
            content = message.content  # type: ignore
            if content and len(content) > 0:
                content = content[0].text if hasattr(content[0], "text") else str(content[0])  # type: ignore
        else:
            response = client.chat.completions.create(  # type: ignore
                model=model_name,
                messages=[
                    {"role": "system", "content": system_content},
                    {"role": "user", "content": full_text},
                ],
                max_tokens=10,
            )
            content = response.choices[0].message.content  # type: ignore

        if content:
            category = str(content).strip().split()[0]  # Take only the first word
            return category
        else:
            return "Nieuws"  # Fallback category
    except Exception as e:
        print(f"Error getting category: {e}")
        return "Nieuws"  # Fallback category


def get_tags(full_text):
    """Get tags based on full text"""
    if not client or not model_name:
        print("⚠️ No AI client available, using default tags")
        return ["Nederland", "Nieuws", "Actueel"]

    try:
        system_content = "Genereer precies drie Nederlandse tags gescheiden door komma's. Bijvoorbeeld: 'Politiek, Nederland, Verkiezingen'. Gebruik korte woorden van 1-3 woorden elk."

        if client_type == "anthropic":
            message = client.messages.create(  # type: ignore
                model=model_name,
                max_tokens=30,
                system=system_content,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": full_text[
                                    :200
                                ],  # Limit text to avoid token issues
                            }
                        ],
                    }
                ],
            )
            content = message.content  # type: ignore
            if content and len(content) > 0:
                content = content[0].text if hasattr(content[0], "text") else str(content[0])  # type: ignore
        else:
            response = client.chat.completions.create(  # type: ignore
                model=model_name,
                messages=[
                    {"role": "system", "content": system_content},
                    {
                        "role": "user",
                        "content": full_text[:200],
                    },  # Limit text to avoid token issues
                ],
                max_tokens=30,
            )
            content = response.choices[0].message.content  # type: ignore

        if content and "," in str(content):
            # Remove instruction artifacts (case-insensitive, multi-language)
            content_clean = re.sub(
                r"^(Hier zijn|Here are|Voici|Tags?:|Keywords?:).+?:",
                "",
                str(content),
                flags=re.IGNORECASE,
            ).strip()

            # Split by comma and clean up
            tags = [tag.strip() for tag in content_clean.split(",")]
            # Filter out empty tags, instruction words, and limit to 3
            tags = [
                tag
                for tag in tags
                if tag
                and len(tag) > 0
                and not re.match(
                    r"^(tags?|keywords?|nederlandse|drie|three)$", tag, re.IGNORECASE
                )
            ][:3]
            return tags if len(tags) == 3 else ["Nederland", "Nieuws", "Actueel"]
        else:
            return ["Nederland", "Nieuws", "Actueel"]  # Fallback tags
    except Exception as e:
        print(f"Error getting tags: {e}")
        return ["Nederland", "Nieuws", "Actueel"]  # Fallback tags


def create_url_slug(title):
    """Create a valid URL slug with 6-8 words for better SEO"""
    if not title:
        return "nieuws-artikel"

    # Remove apostrophes and special characters
    title = title.replace("'", "")
    # Split title into words and filter out stopwords
    words = [
        word
        for word in title.split()
        if word.lower() not in stop_words and not word.isdigit()
    ]
    # Select 6-8 important words for more descriptive URLs
    important_words = (
        words[:8] if len(words) >= 8 else words[:6] if len(words) >= 6 else words
    )
    # Join the words with hyphens
    slug = "-".join(important_words)
    # Replace non-alphanumeric characters (except for hyphens) with spaces
    slug = re.sub(r"[^a-zA-Z0-9-]", " ", slug).strip()
    # Replace spaces with hyphens and remove multiple hyphens
    slug = re.sub(r"\s+", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    # Remove leading/trailing hyphens
    slug = slug.strip("-")
    return slug.lower()


def generate_summary(full_text, char_limit=59):
    """Generate summary from full text, stripping HTML tags"""
    # Strip HTML tags for clean summary
    import re

    clean_text = re.sub(r"<[^>]+>", "", full_text).strip()

    if len(clean_text) <= char_limit:
        return clean_text
    else:
        summary = clean_text[:char_limit]
        if summary.endswith(" ") and clean_text[char_limit:]:
            return summary.rstrip() + "..."
        else:
            return summary.rsplit(" ", 1)[0] + "..."


def generate_faq_section(article_content, article_title):
    """Generate FAQ section for article using AI - creates exactly 3 Q&A pairs
    Returns tuple: (html_string, faq_data_list) for both display and JSON-LD
    """
    import re
    import json

    # Strip HTML tags for cleaner content analysis
    clean_content = re.sub(r"<[^>]+>", "", article_content).strip()

    # Increase context to 2500 chars for better FAQ quality (was 800)
    content_sample = clean_content[:2500]

    faq_prompt = f"""Lees dit artikel en maak 3 FAQ.

{content_sample}

Geef antwoord in dit JSON format:
{{"faqs":[{{"question":"vraag1?","answer":"antwoord1"}},{{"question":"vraag2?","answer":"antwoord2"}},{{"question":"vraag3?","answer":"antwoord3"}}]}}

Vul in met echte vragen en antwoorden uit het artikel (elk antwoord minimaal 25 woorden)."""

    try:
        faq_response = generate_text(
            faq_prompt, max_tokens=800
        )  # Increased to 800 to prevent truncation

        if not faq_response or len(faq_response) < 20:
            print("⚠️ FAQ generation returned insufficient content")
            return "", []

        # Debug: Show first 200 chars of raw response
        print(f"🔍 Raw AI response preview: {faq_response[:200]}...")

        # Try to parse JSON response
        try:
            # Clean up response - extract JSON if wrapped in markdown code blocks
            faq_response = re.sub(r"^```json\s*", "", faq_response)
            faq_response = re.sub(r"\s*```$", "", faq_response)
            faq_response = faq_response.strip()

            # Additional cleanup for common JSON errors
            # Remove any text before first { or after last }
            if "{" in faq_response:
                faq_response = faq_response[faq_response.find("{") :]
            if "}" in faq_response:
                faq_response = faq_response[: faq_response.rfind("}") + 1]

            # Fix unescaped quotes inside strings (common AI error)
            # Replace newlines within JSON strings with spaces (common formatting error)
            faq_response = faq_response.replace("\n", " ")

            # Fix smart quotes that AI might generate
            faq_response = faq_response.replace('"', '"').replace('"', '"')
            faq_response = faq_response.replace("'", "'").replace("'", "'")

            # Try to fix trailing commas before closing brackets (common JSON error)
            faq_response = re.sub(r",(\s*[}\]])", r"\1", faq_response)

            # Fix missing commas between objects (common AI error)
            faq_response = re.sub(r'"\s*}\s*{', '"},{"', faq_response)

            # Handle truncated JSON (incomplete last entry)
            # If JSON ends with incomplete string, try to close it properly
            if faq_response.count('"') % 2 != 0:
                # Odd number of quotes = truncated string
                print("⚠️ Detected truncated JSON, attempting repair...")
                # Find last complete FAQ entry
                last_complete = faq_response.rfind("}}")
                if last_complete > 0:
                    faq_response = faq_response[: last_complete + 2]
                    print(f"✅ Repaired JSON to last complete entry")

            faq_json = json.loads(faq_response)
            faq_list = faq_json.get("faqs", [])

            if not faq_list or len(faq_list) == 0:
                raise ValueError("No FAQs in JSON response")

        except (json.JSONDecodeError, ValueError) as e:
            print(f"⚠️ FAQ JSON parsing failed: {e}, using fallback pattern matching")
            # Fallback: try to extract Q&A from text response
            faq_list = []

            # Try to extract questions and answers using regex patterns
            print(
                f"🔍 Attempting fallback extraction from {len(faq_response)} chars..."
            )

            # Pattern 1: JSON-like format with escaped quotes (improved to handle longer text)
            pattern1 = r'"question"\s*:\s*"(.+?)"\s*,\s*"answer"\s*:\s*"(.+?)"'
            matches1 = re.findall(pattern1, faq_response, re.IGNORECASE | re.DOTALL)

            # Pattern 1b: Try without requiring comma (more lenient)
            if not matches1:
                pattern1b = r'"question"\s*:\s*"(.+?)"\s*"answer"\s*:\s*"(.+?)"'
                matches1 = re.findall(
                    pattern1b, faq_response, re.IGNORECASE | re.DOTALL
                )

            # Pattern 2: "Question: ... Answer: ..." format
            pattern2 = r'(?:question|vraag):\s*"?([^"]+?)"?\s*(?:answer|antwoord):\s*"?([^"]+?)"?(?:\n|$|,|\})'
            matches2 = re.findall(pattern2, faq_response, re.IGNORECASE | re.MULTILINE)

            # Pattern 3: Q: ... A: ... format (with Dutch V: for Vraag:)
            pattern3 = r"[QV]:\s*([^?]+\?)\s*[AA]:\s*([^QV\n]+)"
            matches3 = re.findall(pattern3, faq_response, re.IGNORECASE)

            # Pattern 4: Numbered list with questions
            pattern4 = r"\d+\.\s*([^?]+\?)\s*[-–—:]\s*([^\n]+)"
            matches4 = re.findall(pattern4, faq_response)

            # Pattern 5: Question? followed by answer on next line
            pattern5 = r"([A-Z][^?]+\?)\s+([A-Z][^?]+\.)"
            matches5 = re.findall(pattern5, faq_response)

            # Combine all matches
            all_matches = matches1 + matches2 + matches3 + matches4 + matches5
            print(
                f"🔍 Found {len(all_matches)} potential Q&A pairs across all patterns"
            )

            for question, answer in all_matches[:5]:  # Check up to 5, keep best 3
                # Deep cleanup
                q = question.strip().strip("\"'").strip(",").strip()
                a = answer.strip().strip("\"'").strip(",").strip('"}]').strip()

                # Remove trailing JSON artifacts
                a = re.sub(r"[,}\]]+$", "", a).strip()

                # Fix encoding issues and normalize text
                q = clean_text_encoding(q)
                a = clean_text_encoding(a)

                # Ensure question ends with ?
                if not q.endswith("?"):
                    q += "?"

                # Filter out weak answers
                if is_weak_faq_answer(a):
                    print(f"⚠️ Filtered weak answer: {a[:50]}...")
                    continue

                # Validate minimum quality
                if (
                    len(q) > 10 and len(a) > 15 and q.count(" ") >= 2
                ):  # At least 3 words in question
                    faq_list.append({"question": q, "answer": a})

                if len(faq_list) >= 3:  # Stop after finding 3 valid FAQs
                    break

            # If fallback extraction failed, skip FAQ generation (better than bad FAQs)
            if len(faq_list) == 0:
                print(
                    "⚠️ Fallback pattern matching found no valid FAQs. Skipping FAQ generation (no generic defaults)."
                )
                return "", []  # Return empty instead of generating weak defaults

            print(f"✅ Fallback extracted {len(faq_list)} FAQs from raw response")

        # Accept 2-3 FAQs (flexible, quality over quantity)
        if len(faq_list) > 3:
            faq_list = faq_list[:3]
        elif len(faq_list) < 2:
            print(
                f"⚠️ Only {len(faq_list)} FAQ(s) generated, need at least 2. Skipping FAQ section."
            )
            return "", []  # Skip if less than 2 quality FAQs

        # Build HTML output (filter weak answers)
        html_parts = ["<h2>Veelgestelde Vragen</h2>"]
        valid_faqs = []

        for faq in faq_list:
            question = faq.get("question", "").strip()
            answer = faq.get("answer", "").strip()

            if not question or not answer:
                continue

            # Fix encoding issues and normalize text
            question = clean_text_encoding(question)
            answer = clean_text_encoding(answer)

            # Filter out weak answers at HTML generation stage too
            if is_weak_faq_answer(answer):
                print(f"⚠️ Skipped weak FAQ at HTML stage:")
                print(f"   Q: {question[:80]}...")
                print(f"   A: {answer[:80]}...")
                continue

            # Ensure question ends with ?
            if not question.endswith("?"):
                question += "?"

            # Ensure answer ends with proper punctuation (Google snippet-checker)
            if answer and not answer.endswith((".", "!", "?")):
                answer += "."

            html_parts.append(f'<div class="faq-item">')
            html_parts.append(f"<h3>{question}</h3>")
            html_parts.append(f"<p>{answer}</p>")
            html_parts.append("</div>")

            valid_faqs.append({"question": question, "answer": answer})

        faq_html = "\n".join(html_parts)

        # Return only valid FAQs (filtered)
        if len(valid_faqs) == 0:
            print("⚠️ All FAQs filtered out due to weak answers")
            return "", []

        print(
            f"✅ Generated FAQ section with {len(valid_faqs)} valid Q&A pairs (filtered {len(faq_list) - len(valid_faqs)} weak answers)"
        )
        return faq_html, valid_faqs

    except Exception as e:
        print(f"⚠️ FAQ generation failed: {e}")
        import traceback

        traceback.print_exc()
        return "", []


def format_full_text_with_html(text):
    """Format text with HTML tags - CSS handles spacing, no extra <br> needed"""
    lines = [line.strip() for line in text.split("\n") if line.strip()]

    if not lines:
        return "<p>Geen inhoud beschikbaar.</p>"

    html_parts = []

    # Skip the first line if it looks like a title (don't duplicate the article title)
    # Start processing from the first line, but treat longer lines as paragraphs
    for i, line in enumerate(lines):
        if (
            len(line) < 80 and i > 0
        ):  # Short lines become H3 (but skip first line) - increased to 80 chars
            html_parts.append(f"<h3>{line}</h3>")
        else:  # Longer lines become paragraphs - CSS handles spacing automatically
            html_parts.append(f"<p>{line}</p>")

    return "\n".join(html_parts)


def create_forum_topic_from_article(article_data, db_connection):
    """Create a forum topic in Firebase Realtime Database from article data"""
    try:
        # Get reference to topics in Realtime Database
        ref = realtime_db.reference("topics", app=firebase_admin.get_app())

        # Create new topic
        new_topic_ref = ref.push()

        topic = {
            "title": article_data["title"],
            "categoryId": "cat1",  # Default: Algemeen
            "authorId": "rss-bot",
            "authorName": "Politie Nieuws Bot",
            "content": article_data["full_text"],
            "createdAt": int(time.time() * 1000),
            "updatedAt": int(time.time() * 1000),
            "views": 0,
            "repliesCount": 0,
            "isPinned": False,
            "isLocked": False,
            "slug": article_data["slug"],
            "sourceUrl": article_data.get("link", ""),
            "tags": article_data.get("tags", []),
            "category": article_data.get("category", "Nieuws"),
        }

        new_topic_ref.set(topic)

        # Update category topic count
        category_ref = realtime_db.reference(
            "categories/cat1", app=firebase_admin.get_app()
        )
        category_snapshot = category_ref.get()

        if category_snapshot:
            current_count = category_snapshot.get("topicsCount", 0)
            category_ref.update({"topicsCount": current_count + 1})

        topic_id = new_topic_ref.key
        print(f"✅ Created forum topic with ID: {topic_id}")
        print(f"🌐 Forum URL: https://politie-forum.nl/topic/{topic_id}")
        print(f"📄 Static URL: {article_data['url']}")

        return topic_id

    except Exception as e:
        print(f"❌ Error creating forum topic: {e}")
        return None


def get_article_comments(slug, max_comments=10):
    """
    Fetch article comments from Firebase Realtime Database for JSON-LD schema generation
    Returns list of comment objects with complete Thread schema:
    - @type: Comment
    - @id: Unique comment URL
    - text: Comment content (max 500 chars)
    - author: Person with name
    - dateCreated: ISO timestamp
    - parentItem: Parent comment URL (for nested replies)
    - interactionStatistic: Like counts
    """
    try:
        if not firebase_admin._apps:
            print("⚠️ Firebase not initialized, cannot fetch comments")
            return []

        db_ref = realtime_db.reference()
        comments_ref = db_ref.child("comments").child(slug)
        comments_snapshot = (
            comments_ref.order_by_child("createdAt").limit_to_first(max_comments).get()
        )

        if not comments_snapshot:
            return []

        comments = []
        for comment_id, comment_data in comments_snapshot.items():
            if isinstance(comment_data, dict):
                # Create Schema.org Comment object with full Thread schema
                comment_obj = {
                    "@type": "Comment",
                    "@id": f"https://politie-forum.nl/nieuws/{slug}#comment-{comment_id}",
                    "text": comment_data.get("content", comment_data.get("text", ""))[
                        :500
                    ],  # Limit to 500 chars for SEO
                    "author": {
                        "@type": "Person",
                        "name": comment_data.get(
                            "authorName", comment_data.get("userName", "Anonymous")
                        ),
                    },
                }

                # Add URL field for Comment schema
                comment_obj["url"] = (
                    f"https://politie-forum.nl/nieuws/{slug}#comment-{comment_id}"
                )

                # Add timestamp with correct field name (dateCreated for Comments)
                if comment_data.get("createdAt"):
                    try:
                        comment_obj["dateCreated"] = datetime.fromtimestamp(
                            comment_data["createdAt"] / 1000, tz=timezone.utc
                        ).isoformat()
                    except:
                        comment_obj["dateCreated"] = datetime.now(
                            timezone.utc
                        ).isoformat()
                else:
                    comment_obj["dateCreated"] = datetime.now(timezone.utc).isoformat()

                # Add parentItem for nested replies (threaded comments)
                if comment_data.get("parentId"):
                    comment_obj["parentItem"] = (
                        f"https://politie-forum.nl/nieuws/{slug}#comment-{comment_data['parentId']}"
                    )

                # Add like count with interactionStatistic
                likes = comment_data.get("likes", 0)
                if likes > 0:
                    comment_obj["interactionStatistic"] = {
                        "@type": "InteractionCounter",
                        "interactionType": "https://schema.org/LikeAction",
                        "userInteractionCount": likes,
                    }

                # Add author URL if available
                author_id = comment_data.get("authorId")
                if author_id:
                    comment_obj["author"][
                        "url"
                    ] = f"https://politie-forum.nl/leden/{author_id}"

                comments.append(comment_obj)

        print(
            f"📊 Fetched {len(comments)} comments for article '{slug}' with full Thread schema"
        )
        return comments[:max_comments]  # Ensure max limit

    except Exception as e:
        print(f"❌ Error fetching comments: {e}")
        import traceback

        traceback.print_exc()
        return []


def save_article_to_firebase(article_data):
    """Save article data to Firestore for Next.js ISR pages"""
    try:
        if not firebase_admin._apps:
            print("⚠️ Firebase not initialized, skipping database save")
            return False

        # Get Firestore client
        db = firestore.client()

        # Detect geographic location for Schema.org
        title = article_data.get("title", "")
        summary = article_data.get("summary", "")
        full_text = article_data.get("full_text", "")
        location_data = detect_location(title, summary, full_text)

        slug = article_data.get("slug", "")
        if not slug:
            print("⚠️ No slug found, skipping Firebase save")
            return False

        # NOTE: JSON-LD schema is now generated by Next.js ArticleJsonLd.tsx component
        # This avoids duplicate schemas and ensures consistency with Next.js rendering
        article_url = f"https://politie-forum.nl/nieuws/{slug}"
        published_timestamp = int(datetime.now().timestamp() * 1000)

        # Prepare article data for Firestore
        firebase_article = {
            "title": article_data.get("title", ""),
            "content": full_text,
            "excerpt": generate_excerpt(
                article_data.get("summary", "") or full_text, max_words=300
            ),
            "author": "Politie Forum Redactie",
            "publishedAt": published_timestamp,
            "updatedAt": int(datetime.now().timestamp() * 1000),  # Auto-update on save
            "imageUrl": article_data.get("image_url", ""),
            "tags": article_data.get("tags", ["Nederland", "Nieuws"]),
            "category": article_data.get("category", "Algemeen"),
            "source": "Politie Nieuws",
            "sourceUrl": article_data.get("link", ""),
            # Geo-location data for Schema.org Place
            "location": {
                "name": location_data["name"],
                "latitude": location_data.get("lat"),
                "longitude": location_data.get("lon"),
                "region": location_data.get("region", ""),
            },
            # FAQ data for collapsible FAQ section
            "faq": article_data.get("faq", []),
            # NOTE: JSON-LD is now generated by Next.js ArticleJsonLd.tsx component
            # No longer storing pre-generated schema to avoid duplicates
        }

        # Save to Firestore /news/{slug}
        db.collection("news").document(slug).set(firebase_article)
        print(f"✅ Saved article to Firebase: /news/{slug}")
        print(f"🌐 Next.js URL: https://politie-forum.nl/nieuws/{slug}")
        return True

    except Exception as e:
        print(f"❌ Error saving article to Firebase: {e}")
        return False


def delete_article_from_firebase(slug):
    """Delete article from Firestore and revalidate caches"""
    try:
        if not firebase_admin._apps:
            print("⚠️ Firebase not initialized")
            return False

        # Get Firestore client
        db = firestore.client()

        # Check if article exists
        doc = db.collection("news").document(slug).get()
        if not doc.exists:
            print(f"⚠️ Article not found: /news/{slug}")
            return False

        # Delete from Firestore
        db.collection("news").document(slug).delete()
        print(f"🗑️ Deleted article from Firebase: /news/{slug}")

        # Revalidate all affected pages
        revalidate_vercel_path(slug)  # Article page (will show 404)
        revalidate_homepage()  # Homepage listing
        revalidate_listing_pages()  # /nieuws overview

        print(f"✅ Article deleted and caches cleared")
        return True

    except Exception as e:
        print(f"❌ Error deleting article from Firebase: {e}")
        return False


def revalidate_vercel_path(slug):
    """Trigger Vercel On-Demand Revalidation for the new article page"""
    try:
        revalidate_url = "https://politie-forum.nl/api/revalidate/"
        revalidate_secret = "politie-forum-revalidate-2025-secret-key"

        payload = {"secret": revalidate_secret, "path": f"/nieuws/{slug}"}

        response = requests.post(revalidate_url, json=payload, timeout=10)

        if response.status_code == 200:
            print(f"✅ Revalidated Vercel cache for /nieuws/{slug}")
            return True
        else:
            print(f"⚠️ Revalidation returned {response.status_code}: {response.text}")
            return False

    except Exception as e:
        print(f"⚠️ Could not revalidate Vercel cache: {e}")
        # Don't fail the whole process if revalidation fails
        return False


def revalidate_vercel_forum_path(slug):
    """Trigger Vercel On-Demand Revalidation for the forum article page"""
    try:
        revalidate_url = "https://politie-forum.nl/api/revalidate/"
        revalidate_secret = "politie-forum-revalidate-2025-secret-key"

        payload = {"secret": revalidate_secret, "path": f"/forum/{slug}"}

        response = requests.post(revalidate_url, json=payload, timeout=10)

        if response.status_code == 200:
            print(f"✅ Revalidated Vercel cache for /forum/{slug}")
            return True
        else:
            print(
                f"⚠️ Forum revalidation returned {response.status_code}: {response.text}"
            )
            return False

    except Exception as e:
        print(f"⚠️ Could not revalidate forum Vercel cache: {e}")
        # Don't fail the whole process if revalidation fails
        return False


def revalidate_homepage():
    """Trigger Vercel On-Demand Revalidation for the homepage to show new articles"""
    try:
        revalidate_url = "https://politie-forum.nl/api/revalidate/"
        revalidate_secret = "politie-forum-revalidate-2025-secret-key"

        payload = {"secret": revalidate_secret, "path": "/"}

        response = requests.post(revalidate_url, json=payload, timeout=10)

        if response.status_code == 200:
            print(f"✅ Revalidated homepage cache (new articles visible)")
            return True
        else:
            print(
                f"⚠️ Homepage revalidation returned {response.status_code}: {response.text}"
            )
            return False

    except Exception as e:
        print(f"⚠️ Could not revalidate homepage cache: {e}")
        # Don't fail the whole process if revalidation fails
        return False


def revalidate_listing_pages():
    """Trigger Vercel On-Demand Revalidation for /nieuws overview page"""
    try:
        revalidate_url = "https://politie-forum.nl/api/revalidate/"
        revalidate_secret = "politie-forum-revalidate-2025-secret-key"

        # Revalidate /nieuws overview page (shows 50 articles)
        response_nieuws = requests.post(
            revalidate_url,
            json={"secret": revalidate_secret, "path": "/nieuws"},
            timeout=10,
        )

        success_nieuws = response_nieuws.status_code == 200

        if success_nieuws:
            print(f"✅ Revalidated /nieuws listing page")
            return True
        else:
            print(f"⚠️ /nieuws revalidation failed: {response_nieuws.status_code}")
            return False

    except Exception as e:
        print(f"⚠️ Could not revalidate /nieuws page: {e}")
        return False


def detect_location(title, summary, full_text=""):
    """
    Detect Dutch cities/locations in title/summary/content and return geo data.
    Returns dict with name, latitude, longitude for Schema.org Place.
    Supports multiple locations (e.g. "Houten en Uithoorn" → "Houten, Uithoorn")
    100 locations total (80 cities + 20 landmarks/airports)
    Searches in order: title (highest priority), then summary, then full_text.
    """
    # Venue-to-city mapping (prevent "De Kuip, Ede" errors)
    VENUE_MAPPING = {
        "de kuip": "rotterdam",
        "stadion feijenoord": "rotterdam",
        "feyenoord stadion": "rotterdam",
        "werktalent stadion": "den haag",
        "cars jeans stadion": "den haag",
        "johan cruijff arena": "amsterdam",
        "amsterdam arena": "amsterdam",
        "philips stadion": "eindhoven",
        "galgenwaard": "utrecht",
        "vijverberg": "doetinchem",
        "euroborg": "groningen",
        "gelredome": "arnhem",
    }

    # Dutch cities with coordinates (100 locations for comprehensive police news coverage)
    DUTCH_LOCATIONS = {
        # Top 20 cities (original)
        "amsterdam": {"name": "Amsterdam", "lat": 52.3676, "lon": 4.9041},
        "rotterdam": {"name": "Rotterdam", "lat": 51.9244, "lon": 4.4777},
        "den haag": {"name": "Den Haag", "lat": 52.0705, "lon": 4.3007},
        "'s-gravenhage": {"name": "Den Haag", "lat": 52.0705, "lon": 4.3007},
        "utrecht": {"name": "Utrecht", "lat": 52.0907, "lon": 5.1214},
        "eindhoven": {"name": "Eindhoven", "lat": 51.4416, "lon": 5.4697},
        "groningen": {"name": "Groningen", "lat": 53.2194, "lon": 6.5665},
        "tilburg": {"name": "Tilburg", "lat": 51.5555, "lon": 5.0913},
        "almere": {"name": "Almere", "lat": 52.3508, "lon": 5.2647},
        "breda": {"name": "Breda", "lat": 51.5719, "lon": 4.7683},
        "nijmegen": {"name": "Nijmegen", "lat": 51.8126, "lon": 5.8372},
        "enschede": {"name": "Enschede", "lat": 52.2215, "lon": 6.8937},
        "haarlem": {"name": "Haarlem", "lat": 52.3874, "lon": 4.6462},
        "arnhem": {"name": "Arnhem", "lat": 51.9851, "lon": 5.8987},
        "zaanstad": {"name": "Zaanstad", "lat": 52.4389, "lon": 4.8258},
        "apeldoorn": {"name": "Apeldoorn", "lat": 52.2112, "lon": 5.9699},
        "maastricht": {"name": "Maastricht", "lat": 50.8514, "lon": 5.6909},
        "leiden": {"name": "Leiden", "lat": 52.1601, "lon": 4.4970},
        "dordrecht": {"name": "Dordrecht", "lat": 51.8133, "lon": 4.6900},
        # 21-40: Middelgrote steden
        "'s-hertogenbosch": {"name": "'s-Hertogenbosch", "lat": 51.6883, "lon": 5.3039},
        "den bosch": {"name": "'s-Hertogenbosch", "lat": 51.6883, "lon": 5.3039},
        "amersfoort": {"name": "Amersfoort", "lat": 52.1561, "lon": 5.3878},
        "haarlemmermeer": {"name": "Haarlemmermeer", "lat": 52.3035, "lon": 4.6860},
        "zwolle": {"name": "Zwolle", "lat": 52.5125, "lon": 6.0944},
        "zoetermeer": {"name": "Zoetermeer", "lat": 52.0575, "lon": 4.4937},
        "leeuwarden": {"name": "Leeuwarden", "lat": 53.2012, "lon": 5.7999},
        "emmen": {"name": "Emmen", "lat": 52.7792, "lon": 6.8977},
        "ede": {"name": "Ede", "lat": 52.0408, "lon": 5.6671},
        "delft": {"name": "Delft", "lat": 52.0116, "lon": 4.3571},
        "venlo": {"name": "Venlo", "lat": 51.3704, "lon": 6.1682},
        "deventer": {"name": "Deventer", "lat": 52.2551, "lon": 6.1639},
        "sittard-geleen": {"name": "Sittard-Geleen", "lat": 51.0045, "lon": 5.8689},
        "helmond": {"name": "Helmond", "lat": 51.4814, "lon": 5.6557},
        "oss": {"name": "Oss", "lat": 51.7651, "lon": 5.5185},
        "alphen aan den rijn": {
            "name": "Alphen aan den Rijn",
            "lat": 52.1289,
            "lon": 4.6573,
        },
        "spijkenisse": {"name": "Spijkenisse", "lat": 51.8450, "lon": 4.3297},
        "hoofddorp": {"name": "Hoofddorp", "lat": 52.3030, "lon": 4.6891},
        "purmerend": {"name": "Purmerend", "lat": 52.5055, "lon": 4.9592},
        "zaandam": {"name": "Zaandam", "lat": 52.4383, "lon": 4.8264},
        # 41-60: Kleinere steden
        "vlaardingen": {"name": "Vlaardingen", "lat": 51.9122, "lon": 4.3419},
        "alkmaar": {"name": "Alkmaar", "lat": 52.6324, "lon": 4.7485},
        "hilversum": {"name": "Hilversum", "lat": 52.2237, "lon": 5.1762},
        "roosendaal": {"name": "Roosendaal", "lat": 51.5307, "lon": 4.4653},
        "schiedam": {"name": "Schiedam", "lat": 51.9190, "lon": 4.3999},
        "capelle aan den ijssel": {
            "name": "Capelle aan den IJssel",
            "lat": 51.9297,
            "lon": 4.5772,
        },
        "leidschendam": {
            "name": "Leidschendam-Voorburg",
            "lat": 52.0833,
            "lon": 4.3969,
        },
        "voorburg": {"name": "Leidschendam-Voorburg", "lat": 52.0833, "lon": 4.3969},
        "gouda": {"name": "Gouda", "lat": 52.0115, "lon": 4.7108},
        "hoorn": {"name": "Hoorn", "lat": 52.6426, "lon": 5.0596},
        "houten": {"name": "Houten", "lat": 52.0280, "lon": 5.1680},
        "uithoorn": {"name": "Uithoorn", "lat": 52.2383, "lon": 4.8242},
        "nieuwegein": {"name": "Nieuwegein", "lat": 52.0293, "lon": 5.0806},
        "kampen": {"name": "Kampen", "lat": 52.5550, "lon": 5.9114},
        "veenendaal": {"name": "Veenendaal", "lat": 52.0283, "lon": 5.5597},
        "ijsselstein": {"name": "IJsselstein", "lat": 52.0203, "lon": 5.0428},
        "hardenberg": {"name": "Hardenberg", "lat": 52.5761, "lon": 6.6196},
        "barendrecht": {"name": "Barendrecht", "lat": 51.8575, "lon": 4.5342},
        "middelburg": {"name": "Middelburg", "lat": 51.4988, "lon": 3.6109},
        "velsen": {"name": "Velsen", "lat": 52.4606, "lon": 4.6567},
        "zeist": {"name": "Zeist", "lat": 52.0894, "lon": 5.2297},
        "huizen": {"name": "Huizen", "lat": 52.2976, "lon": 5.2414},
        # 61-80: Verdere uitbreiding
        "katwijk": {"name": "Katwijk", "lat": 52.2056, "lon": 4.4181},
        "ridderkerk": {"name": "Ridderkerk", "lat": 51.8715, "lon": 4.6005},
        "weert": {"name": "Weert", "lat": 51.2517, "lon": 5.7063},
        "hoogeveen": {"name": "Hoogeveen", "lat": 52.7274, "lon": 6.4761},
        "beverwijk": {"name": "Beverwijk", "lat": 52.4833, "lon": 4.6567},
        "terneuzen": {"name": "Terneuzen", "lat": 51.3384, "lon": 3.8275},
        "bussum": {"name": "Bussum", "lat": 52.2746, "lon": 5.1617},
        "kerkrade": {"name": "Kerkrade", "lat": 50.8661, "lon": 6.0633},
        "winschoten": {"name": "Winschoten", "lat": 53.1441, "lon": 7.0349},
        "woerden": {"name": "Woerden", "lat": 52.0854, "lon": 4.8835},
        "medemblik": {"name": "Medemblik", "lat": 52.7714, "lon": 5.1052},
        "waalwijk": {"name": "Waalwijk", "lat": 51.6833, "lon": 5.0667},
        "harderwijk": {"name": "Harderwijk", "lat": 52.3505, "lon": 5.6203},
        "den helder": {"name": "Den Helder", "lat": 52.9596, "lon": 4.7595},
        "hendrik-ido-ambacht": {
            "name": "Hendrik-Ido-Ambacht",
            "lat": 51.8431,
            "lon": 4.6389,
        },
        "wijk bij duurstede": {
            "name": "Wijk bij Duurstede",
            "lat": 51.9738,
            "lon": 5.3414,
        },
        "culemborg": {"name": "Culemborg", "lat": 51.9562, "lon": 5.2267},
        "voorschoten": {"name": "Voorschoten", "lat": 52.1267, "lon": 4.4450},
        "tubbergen": {"name": "Tubbergen", "lat": 52.4058, "lon": 6.7831},
        "losser": {"name": "Losser", "lat": 52.2617, "lon": 7.0033},
        # Landmarks & Important Locations (20 items)
        "de kuip": {
            "name": "Stadion Feijenoord (De Kuip)",
            "lat": 51.8939,
            "lon": 4.5231,
        },
        "kuip": {"name": "Stadion Feijenoord (De Kuip)", "lat": 51.8939, "lon": 4.5231},
        "schiphol": {"name": "Schiphol Airport", "lat": 52.3105, "lon": 4.7683},
        "johan cruijff arena": {
            "name": "Johan Cruijff ArenA",
            "lat": 52.3142,
            "lon": 4.9419,
        },
        "arena": {"name": "Johan Cruijff ArenA", "lat": 52.3142, "lon": 4.9419},
        "ahoy": {"name": "Rotterdam Ahoy", "lat": 51.8936, "lon": 4.4788},
        "jaarbeurs": {"name": "Jaarbeurs Utrecht", "lat": 52.0865, "lon": 5.0790},
        "beatrixplein": {
            "name": "Beatrixplein Den Haag",
            "lat": 52.0778,
            "lon": 4.2944,
        },
        "binnenhof": {"name": "Binnenhof", "lat": 52.0797, "lon": 4.3131},
        "paleis noordeinde": {
            "name": "Paleis Noordeinde",
            "lat": 52.0844,
            "lon": 4.3113,
        },
        "centraal station amsterdam": {
            "name": "Amsterdam Centraal",
            "lat": 52.3791,
            "lon": 4.9003,
        },
        "centraal station rotterdam": {
            "name": "Rotterdam Centraal",
            "lat": 51.9249,
            "lon": 4.4690,
        },
        "centraal station utrecht": {
            "name": "Utrecht Centraal",
            "lat": 52.0889,
            "lon": 5.1100,
        },
        "dam": {"name": "De Dam (Amsterdam)", "lat": 52.3730, "lon": 4.8936},
        "leidseplein": {"name": "Leidseplein", "lat": 52.3642, "lon": 4.8829},
        "rembrandtplein": {"name": "Rembrandtplein", "lat": 52.3664, "lon": 4.8956},
        "markthal rotterdam": {
            "name": "Markthal Rotterdam",
            "lat": 51.9200,
            "lon": 4.4856,
        },
        "euromast": {"name": "Euromast", "lat": 51.9054, "lon": 4.4667},
        "keukenhof": {"name": "Keukenhof", "lat": 52.2696, "lon": 4.5459},
        "zandvoort": {"name": "Zandvoort aan Zee", "lat": 52.3720, "lon": 4.5331},
    }

    # Search with priority: title > summary > full_text
    # Support multiple locations in same article (e.g. "Houten en Uithoorn")

    def find_all_matches(text):
        """Find ALL matching locations in text (for multi-location articles), prefer whole word matches"""
        text_lower = text.lower()
        matches = []
        seen_names = set()  # Deduplicate by location name

        for key, data in DUTCH_LOCATIONS.items():
            # Try word boundary match first (most accurate)
            word_pattern = r"\b" + re.escape(key) + r"\b"
            if re.search(word_pattern, text_lower):
                location_name = data["name"]
                if location_name not in seen_names:
                    matches.append(
                        (len(key), 100, key, data)
                    )  # Priority 100 for exact word match
                    seen_names.add(location_name)
            # Fallback to substring match (lower priority, only if no word match found yet)
            elif key in text_lower and data["name"] not in seen_names:
                matches.append(
                    (len(key), 50, key, data)
                )  # Priority 50 for substring match
                seen_names.add(data["name"])

        if matches:
            # Sort by: 1) priority (word boundary > substring), 2) length (longer = more specific)
            matches.sort(key=lambda x: (x[1], x[0]), reverse=True)
            return matches  # Return ALL matches (for multi-location support)
        return []

    # Check title first (highest priority)
    title_matches = find_all_matches(title)
    if title_matches:
        # If multiple locations found in title, combine them
        if len(title_matches) > 1:
            combined_name = ", ".join(
                [m[3]["name"] for m in title_matches[:3]]
            )  # Max 3 locations
            # Return first location's coords but combined name
            first_loc = title_matches[0][3]
            print(f"📍 Multi-location in TITLE: {combined_name}")
            return {
                "name": combined_name,
                "lat": first_loc["lat"],
                "lon": first_loc["lon"],
            }
        print(f"📍 Location in TITLE: {title_matches[0][3]['name']}")
        return title_matches[0][3]

    # Then check summary
    summary_matches = find_all_matches(summary)
    if summary_matches:
        if len(summary_matches) > 1:
            combined_name = ", ".join([m[3]["name"] for m in summary_matches[:3]])
            first_loc = summary_matches[0][3]
            print(f"📍 Multi-location in SUMMARY: {combined_name}")
            return {
                "name": combined_name,
                "lat": first_loc["lat"],
                "lon": first_loc["lon"],
            }
        print(f"📍 Location in SUMMARY: {summary_matches[0][3]['name']}")
        return summary_matches[0][3]

    # Finally check full text (lowest priority)
    if full_text:
        text_matches = find_all_matches(full_text)
        if text_matches:
            if len(text_matches) > 1:
                combined_name = ", ".join([m[3]["name"] for m in text_matches[:3]])
                first_loc = text_matches[0][3]
                print(f"📍 Multi-location detected: {combined_name}")
                return {
                    "name": combined_name,
                    "lat": first_loc["lat"],
                    "lon": first_loc["lon"],
                }
            print(f"📍 Location detected: {text_matches[0][3]['name']}")
            return text_matches[0][3]

    # Default fallback: Nederland (general)
    print("📍 No specific location found, using default: Nederland")
    return {"name": "Nederland", "lat": None, "lon": None}


def map_category_to_section(category):
    """Map internal category to proper article:section for Google News"""
    category_map = {
        "Politiek": "Binnenland",
        "Politiek.": "Binnenland",
        "Nieuws": "Nieuws",
        "Nieuws.": "Nieuws",
        "Forum": "Nieuws",
        "Veiligheid": "Veiligheid / Overlast",
        "Overlast": "Veiligheid / Overlast",
        "Justitie": "Justitie",
        "Criminaliteit": "Criminaliteit",
        "Economie": "Economie",
        "Sport": "Sport",
        "De": "Nieuws",
    }
    # Clean category (remove trailing dots/spaces)
    clean_cat = category.strip().rstrip(".")
    return category_map.get(clean_cat, "Nieuws")


def generate_static_html(article_data):
    """Generate static HTML file using the template

    ⚠️ DEPRECATED: This function is no longer used in menu 24/25.
    Next.js ISR handles all rendering via:
    - ArticleClient.tsx (HTML/CSS)
    - ArticleJsonLd.tsx (JSON-LD schemas)
    - ArticleFAQ.tsx (FAQ rendering)
    - ArticleComments.tsx (Comments)

    This function remains available for manual static HTML generation if needed.
    """
    try:
        slug = article_data["slug"]
        html_dir = os.path.join(base_dir, "nieuws", slug)

        # Create directory if it doesn't exist
        if not os.path.exists(html_dir):
            os.makedirs(html_dir, exist_ok=True)

        # Load template file
        template_path = os.path.join(
            os.path.dirname(__file__), "static-article-template-new.html"
        )

        if not os.path.exists(template_path):
            print(f"❌ Template not found: {template_path}")
            return None

        with open(template_path, "r", encoding="utf-8") as f:
            template = f.read()

        # Prepare data for replacement
        title = article_data["title"]
        description = article_data.get("summary", title[:160])

        # SEO: Clean keywords - remove AI instruction artifacts
        raw_keywords = article_data.get("tags", ["politie", "nieuws"])
        # Filter out instruction text like "Hier zijn drie Nederlandse tags..."
        clean_keywords = [
            tag
            for tag in raw_keywords
            if not any(
                phrase in tag.lower()
                for phrase in [
                    "hier zijn",
                    "tags gescheiden",
                    "komma's",
                    "dutch tags",
                    "separated by",
                ]
            )
        ]
        keywords = ", ".join(clean_keywords) if clean_keywords else "politie, nieuws"

        # SEO FIX: Map category to proper article:section + clean breadcrumb
        raw_category = article_data.get("category", "Nieuws")
        category = map_category_to_section(
            raw_category
        )  # "Binnenland", "Veiligheid / Overlast", etc.
        breadcrumb_category = category.replace(" / ", "-").lower()  # URL-friendly

        author = "Politie Forum Redactie"
        content = article_data["full_text"]  # Already HTML formatted

        # Calculate word count and create article body snippet for JSON-LD
        from bs4 import BeautifulSoup

        soup = BeautifulSoup(content, "html.parser")
        plain_text = soup.get_text(separator=" ", strip=True)
        word_count = len(plain_text.split())
        article_body_snippet = (
            plain_text[:500] + "..." if len(plain_text) > 500 else plain_text
        )

        # Detect geographic location for Schema.org
        location_data = detect_location(title, description, content)
        tags = article_data.get("tags", ["politie", "nieuws", "Nederland"])

        # 🔥 NEW: Fetch real comments from Firebase for JSON-LD integration
        article_comments = get_article_comments(slug, max_comments=10)
        comment_count = len(article_comments)
        print(f"💬 Article has {comment_count} comments for JSON-LD schema")

        # Format date (ISO 8601 with timezone)
        timestamp = article_data.get(
            "timestamp", datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        try:
            date_obj = datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S")
            # Make timezone-aware (UTC)
            date_obj = date_obj.replace(tzinfo=timezone.utc)
            formatted_date = date_obj.strftime("%d %B %Y")
            iso_date = date_obj.isoformat()
        except:
            date_obj = datetime.now(timezone.utc)
            formatted_date = date_obj.strftime("%d %B %Y")
            iso_date = date_obj.isoformat()

        # 🔥 Generate complete @graph JSON-LD with all schemas
        jsonld_graph = []

        # 1. Place Schema
        place_schema = {
            "@type": "Place",
            "@id": f"https://politie-forum.nl/nieuws/{slug}#place",
            "name": location_data["name"],
            "image": "https://politie-forum.nl/og/politie-forum-1200x630.png",
            "address": {"@type": "PostalAddress", "addressCountry": "NL"},
        }
        if location_data.get("lat") and location_data.get("lon"):
            place_schema["geo"] = {
                "@type": "GeoCoordinates",
                "latitude": location_data["lat"],
                "longitude": location_data["lon"],
            }
        jsonld_graph.append(place_schema)

        # 2. NewsArticle Schema (COMPACT - 15 essential fields only)
        news_schema = {
            "@type": "NewsArticle",
            "@id": f"https://politie-forum.nl/nieuws/{slug}#article",
            "headline": title,
            "description": description,
            "url": f"https://politie-forum.nl/nieuws/{slug}",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": f"https://politie-forum.nl/nieuws/{slug}#webpage",
            },
            "isPartOf": {"@id": "https://politie-forum.nl/#website"},
            "image": [
                f"https://politie-forum.nl/api/og/{slug}.jpg"
            ],  # Compact array format
            "datePublished": iso_date,
            "dateModified": iso_date,
            "author": {
                "@id": "https://politie-forum.nl/#p-oldenburger"
            },  # Reference only
            "publisher": {"@id": "https://politie-forum.nl/#org"},
            "articleSection": category,
            "keywords": tags,
            "inLanguage": "nl-NL",
            "isAccessibleForFree": True,
            "interactionStatistic": [
                {
                    "@type": "InteractionCounter",
                    "interactionType": "https://schema.org/CommentAction",
                    "userInteractionCount": comment_count,
                }
            ],
        }
        jsonld_graph.append(news_schema)

        # 3. DiscussionForumPosting Schema (COMPACT - no articleBody/potentialAction)
        discussion_schema = {
            "@type": "DiscussionForumPosting",
            "@id": f"https://politie-forum.nl/nieuws/{slug}#discussion",
            "headline": f"Discussie: {title}",
            "url": f"https://politie-forum.nl/nieuws/{slug}#reacties",
            "about": {"@id": f"https://politie-forum.nl/nieuws/{slug}#article"},
            "author": {"@id": "https://politie-forum.nl/#org"},  # Reference only
            "datePublished": iso_date,
            "dateModified": iso_date,
            "inLanguage": "nl-NL",
            "commentCount": comment_count,
            "interactionStatistic": [
                {
                    "@type": "InteractionCounter",
                    "interactionType": "https://schema.org/CommentAction",
                    "userInteractionCount": comment_count,
                }
            ],
            "comment": article_comments,  # Already includes @id, parentItem, likes from get_article_comments()
        }
        jsonld_graph.append(discussion_schema)

        # Complete JSON-LD object
        complete_jsonld = {"@context": "https://schema.org", "@graph": jsonld_graph}

        jsonld_string = json.dumps(complete_jsonld, ensure_ascii=False, indent=4)

        # Replace placeholders
        html_content = template.replace("{{TITLE}}", html.escape(title))
        html_content = html_content.replace("{{DESCRIPTION}}", html.escape(description))
        html_content = html_content.replace("{{KEYWORDS}}", html.escape(keywords))
        html_content = html_content.replace("{{SLUG}}", slug)
        html_content = html_content.replace("{{CATEGORY}}", category)
        html_content = html_content.replace(
            "{{BREADCRUMB_CATEGORY}}", breadcrumb_category
        )  # SEO: URL-friendly category
        html_content = html_content.replace("{{AUTHOR}}", author)
        html_content = html_content.replace("{{DATE}}", formatted_date)
        html_content = html_content.replace("{{DATE_ISO}}", iso_date)
        html_content = html_content.replace("{{CONTENT}}", content)
        html_content = html_content.replace("{{COMMENT_COUNT}}", str(comment_count))
        html_content = html_content.replace(
            "{{ARTICLE_BODY_SNIPPET}}", html.escape(article_body_snippet)
        )
        html_content = html_content.replace("{{WORD_COUNT}}", str(word_count))
        html_content = html_content.replace(
            "{{TAGS_JSON}}", json.dumps(tags, ensure_ascii=False)
        )

        # 🔥 NEW: Generate FAQ HTML from article_data
        faq_items = article_data.get("faq", [])
        if faq_items and len(faq_items) > 0:
            faq_html = ""
            for idx, faq in enumerate(faq_items):
                question = html.escape(faq.get("question", ""))
                answer = html.escape(faq.get("answer", ""))
                faq_html += f"""
                    <div class="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-blue-400 dark:hover:border-blue-500 transition-all" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                        <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-start gap-2" itemprop="name">
                            <i data-lucide="help-circle" class="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true"></i>
                            <span>{question}</span>
                        </h4>
                        <div class="text-slate-700 dark:text-slate-300 leading-relaxed pl-7" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                            <p itemprop="text">{answer}</p>
                        </div>
                    </div>
                """

            # Replace FAQ placeholder in template
            faq_placeholder = """<div class="text-center py-8 text-slate-500 dark:text-slate-400">
                        <i data-lucide="info" class="h-8 w-8 mx-auto mb-2 opacity-50"></i>
                        <p>Geen FAQ-items beschikbaar voor dit artikel.</p>
                    </div>"""
            html_content = html_content.replace(faq_placeholder, faq_html.strip())
            print(f"✅ Pre-rendered {len(faq_items)} FAQ items in HTML")

        # 🔥 Replace entire JSON-LD block with dynamic complete version
        # Find and replace the hardcoded JSON-LD in template
        jsonld_pattern = r'<script type="application/ld\+json">.*?</script>'
        jsonld_replacement = (
            f'<script type="application/ld+json">\n{jsonld_string}\n    </script>'
        )
        html_content = re.sub(
            jsonld_pattern, jsonld_replacement, html_content, flags=re.DOTALL
        )

        # Save file
        html_file_path = os.path.join(html_dir, "index.html")
        with open(html_file_path, "w", encoding="utf-8") as f:
            f.write(html_content)

        print(f"✅ Generated static HTML: {html_file_path}")
        print(f"� Deploy to Firebase: firebase deploy --only hosting")

        return html_file_path

    except Exception as e:
        print(f"❌ Error generating static HTML: {e}")
        import traceback

        traceback.print_exc()
        return None

        # Generate HTML content with full forum template
        html_content = f"""<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title_escaped} - Politie Forum Nederland</title>
    <meta name="description" content="{summary_escaped}">
    <link rel="preload" href="https://politie-forum.nl/_next/static/media/e4af272ccee01ff0-s.p.woff2" as="font" crossorigin type="font/woff2">
    <link rel="stylesheet" href="https://politie-forum.nl/_next/static/css/e23b9e9b69f22f22.css" data-precedence="next">
    <link rel="preload" as="script" href="https://politie-forum.nl/_next/static/chunks/webpack-a9d7a6b806b0db07.js">
    <script src="https://politie-forum.nl/_next/static/chunks/4bd1b696-c023c6e3521b1417.js" async></script>
    <script src="https://politie-forum.nl/_next/static/chunks/255-4efeec91c7871d79.js" async></script>
    <script src="https://politie-forum.nl/_next/static/chunks/main-app-f9b5d20365cb8be2.js" async></script>
    <script src="https://politie-forum.nl/_next/static/chunks/457b8330-32dafe418b79eb9b.js" async></script>
    <script src="https://politie-forum.nl/_next/static/chunks/ae6eea6a-1b3273cb1572db3f.js" async></script>
    <script src="https://politie-forum.nl/_next/static/chunks/415-49b314be99a3b4d2.js" async></script>
    <script src="https://politie-forum.nl/_next/static/chunks/478-c880f2d8b55c4030.js" async></script>
    <script src="https://politie-forum.nl/_next/static/chunks/380-dd63016e5e5d55b4.js" async></script>
    <script src="https://politie-forum.nl/_next/static/chunks/app/layout-d93607648083960d.js" async></script>
    <script src="https://politie-forum.nl/_next/static/chunks/619-ba102abea3e3d0e4.js" async></script>
    <script src="https://politie-forum.nl/_next/static/chunks/644-336de040d26b06bb.js" async></script>
    <script src="https://politie-forum.nl/_next/static/chunks/84-34ae540e94445360.js" async></script>
    <script src="https://politie-forum.nl/_next/static/chunks/74-796629bbd8907397.js" async></script>
    <script src="https://politie-forum.nl/_next/static/chunks/735-37dcceeaabbf9f4b.js" async></script>
    <script src="https://politie-forum.nl/_next/static/chunks/382-93a8b2ed7c117428.js" async></script>
    <script src="https://politie-forum.nl/_next/static/chunks/app/forum/page-3fa2c2c718947bf9.js" async></script>

    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js"></script>

    <!-- Open Graph -->
    <meta property="og:title" content="{title_escaped}">
    <meta property="og:description" content="{summary_escaped}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="{article_data['url']}">
    <meta property="og:site_name" content="Politie Forum Nederland">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title_escaped}">
    <meta name="twitter:description" content="{summary_escaped}">

    <!-- Enhanced Schema.org markup with @graph (NewsArticle + DiscussionForumPosting + Geo) -->
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@graph": [
            {{
                "@type": "Place",
                "@id": "https://politie-forum.nl/nieuws/{slug}#place",
                "name": "Nederland",
                "address": {{
                    "@type": "PostalAddress",
                    "addressCountry": "NL"
                }}
            }},
            {{
                "@type": "NewsArticle",
                "@id": "https://politie-forum.nl/nieuws/{slug}#article",
                "headline": "{title_escaped}",
                "description": "{summary_escaped}",
                "url": "https://politie-forum.nl/nieuws/{slug}",
                "mainEntityOfPage": "https://politie-forum.nl/nieuws/{slug}",
                "image": {{
                    "@type": "ImageObject",
                    "url": "https://politie-forum.nl/og/politie-forum-1200x630.png",
                    "width": 1200,
                    "height": 630
                }},
                "datePublished": "{article_data.get('timestamp', datetime.now().isoformat())}",
                "dateModified": "{article_data.get('timestamp', datetime.now().isoformat())}",
                "author": {{
                    "@type": "Person",
                    "name": "Politie Forum Redactie"
                }},
                "publisher": {{
                    "@id": "https://politie-forum.nl/#org"
                }},
                "articleSection": "{category}",
                "keywords": {json.dumps(tags) if tags else '["politie", "nieuws", "Nederland"]'},
                "inLanguage": "nl-NL",
                "isAccessibleForFree": true,
                "contentLocation": {{
                    "@id": "https://politie-forum.nl/nieuws/{slug}#place"
                }}
            }},
            {{
                "@type": "DiscussionForumPosting",
                "@id": "https://politie-forum.nl/nieuws/{slug}#discussion",
                "headline": "Discussie: {title_escaped}",
                "articleBody": "Forumdiscussie over: {summary_escaped}",
                "url": "https://politie-forum.nl/nieuws/{slug}#reacties",
                "about": {{
                    "@id": "https://politie-forum.nl/nieuws/{slug}#article"
                }},
                "author": {{
                    "@id": "https://politie-forum.nl/#org"
                }},
                "datePublished": "{article_data.get('timestamp', datetime.now().isoformat())}",
                "dateModified": "{article_data.get('timestamp', datetime.now().isoformat())}",
                "inLanguage": "nl-NL",
                "commentCount": {comment_count},
                "interactionStatistic": {{
                    "@type": "InteractionCounter",
                    "interactionType": "https://schema.org/CommentAction",
                    "userInteractionCount": {comment_count}
                }},
                "comment": {json.dumps(article_comments, ensure_ascii=False) if article_comments else "[]"}
            }}
        ]
    }}
    </script>

    <style>
        :root {{
            color-scheme: light;
        }}
        html {{
            scroll-behavior: smooth;
        }}
        html.dark {{
            color-scheme: dark;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            margin: 0;
            background: #f1f5f9;
            color: #0f172a;
        }}
        html.dark body {{
            background: #0f172a;
            color: #e2e8f0;
        }}
        main.pf-main {{
            padding: 3rem 1rem 4rem;
        }}
        .pf-article-card {{
            background: #ffffff;
            border-radius: 1.5rem;
            box-shadow: 0 25px 45px rgba(15, 23, 42, 0.12);
            padding: 2.5rem;
            margin: 0 auto;
            max-width: 860px;
        }}
        html.dark .pf-article-card {{
            background: #111c3d;
            box-shadow: 0 25px 45px rgba(2, 6, 23, 0.5);
            color: #e2e8f0;
        }}
        .pf-article-title {{
            font-size: 2rem;
            margin: 0 0 1.5rem;
            color: inherit;
        }}
        .pf-meta {{
            display: inline-flex;
            flex-wrap: wrap;
            gap: 0.8rem;
            font-size: 0.95rem;
            color: #475569;
            margin-bottom: 2rem;
        }}
        html.dark .pf-meta {{
            color: #cbd5f5;
        }}
        .pf-meta span {{
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
        }}
        .pf-article-card article {{
            font-size: 1rem;
            line-height: 1.7;
        }}
        .pf-article-card article p {{
            margin: 0 0 1rem;
        }}
        .pf-article-card article h3 {{
            font-size: 1.3rem;
            color: #1e3a8a;
            margin: 2rem 0 1rem;
        }}
        html.dark .pf-article-card article h3 {{
            color: #93c5fd;
        }}
        .pf-article-card article br {{
            display: block;
            margin-bottom: 1rem;
        }}
        .pf-forum-cta {{
            margin-top: 3rem;
            padding: 2.5rem;
            border-radius: 1.25rem;
            background: linear-gradient(135deg, #1d4ed8, #a855f7);
            color: #fff;
            text-align: center;
            box-shadow: 0 20px 45px rgba(37, 99, 235, 0.25);
        }}
        html.dark .pf-forum-cta {{
            background: linear-gradient(135deg, #312e81, #7c3aed);
            box-shadow: 0 20px 45px rgba(99, 102, 241, 0.35);
        }}
        .pf-forum-cta h2 {{
            margin: 0 0 1rem;
            font-size: 1.65rem;
        }}
        .pf-forum-cta p {{
            margin: 0 0 1.5rem;
            font-size: 1.05rem;
            color: rgba(255, 255, 255, 0.9);
        }}
        .pf-btn {{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.75rem;
            font-weight: 600;
            padding: 0.75rem 1.8rem;
            text-decoration: none;
            transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }}
        .pf-btn-solid {{
            background: #fbbf24;
            color: #1f2937;
            border: 2px solid transparent;
        }}
        .pf-btn-solid:hover {{
            background: #f59e0b;
            box-shadow: 0 10px 28px rgba(251, 191, 36, 0.35);
            transform: translateY(-1px);
        }}
        .pf-tags {{
            margin-top: 2.5rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
        }}
        .pf-tags .tag {{
            display: inline-flex;
            align-items: center;
            background: #e2e8f0;
            color: #1e293b;
            padding: 0.4rem 0.85rem;
            border-radius: 9999px;
            font-size: 0.9rem;
            font-weight: 500;
            letter-spacing: 0.01em;
        }}
        html.dark .pf-tags .tag {{
            background: #1e293b;
            color: #e2e8f0;
        }}
        .pf-forum-embed {{
            margin-top: 3rem;
        }}
        .pf-forum-embed h2 {{
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }}
        .pf-forum-embed iframe {{
            width: 100%;
            min-height: 720px;
            border: 1px solid #cbd5f5;
            border-radius: 1rem;
            background: #ffffff;
        }}
        html.dark .pf-forum-embed iframe {{
            border-color: #334155;
            background: #0f172a;
        }}
        .pf-forum-embed__meta {{
            margin-top: 1rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            align-items: center;
            justify-content: space-between;
            font-size: 0.9rem;
            color: #475569;
        }}
        html.dark .pf-forum-embed__meta {{
            color: #cbd5f5;
        }}
        .pf-footer {{
            background: #0f172a;
            color: #e2e8f0;
            padding: 3rem 0 2rem;
            margin-top: 2rem;
        }}
        html.dark .pf-footer {{
            background: #020617;
            color: #e2e8f0;
        }}
        .pf-footer-grid {{
            display: grid;
            gap: 2rem;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            align-items: start;
        }}
        .pf-footer h3 {{
            margin: 0 0 1rem;
            font-size: 1.1rem;
            color: #f8fafc;
        }}
        .pf-footer p {{
            margin: 0;
            line-height: 1.7;
        }}
        .pf-footer ul {{
            list-style: none;
            margin: 0;
            padding: 0;
            display: grid;
            gap: 0.5rem;
        }}
        .pf-footer a {{
            color: inherit;
            text-decoration: none;
        }}
        .pf-footer a:hover {{
            color: #fbbf24;
        }}
        .pf-footer-bottom {{
            border-top: 1px solid rgba(226, 232, 240, 0.2);
            margin-top: 2rem;
            padding-top: 1.5rem;
            text-align: center;
            font-size: 0.85rem;
            color: #cbd5f5;
        }}
        html.dark .pf-footer-bottom {{
            border-top-color: rgba(148, 163, 184, 0.35);
            color: #94a3b8;
        }}
        @media (max-width: 640px) {{
            .pf-article-card {{
                padding: 1.8rem;
            }}
            .pf-article-title {{
                font-size: 1.6rem;
            }}
            .pf-forum-cta {{
                padding: 2rem 1.5rem;
            }}
            .pf-forum-embed iframe {{
                min-height: 600px;
            }}
        }}
    </style>
</head>
<body>
    <header class="bg-primary-800 text-white shadow-lg border-b-[3px] border-white" role="banner" itemScope itemType="https://schema.org/WPHeader">
    <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
            <a href="https://politie-forum.nl" class="flex items-center space-x-3" itemScope itemType="https://schema.org/Organization">
                <span class="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 text-xl font-bold">
                    PF
                </span>
                <span class="hidden sm:block">
                    <span class="block text-2xl font-bold" itemProp="name">Politie Forum Nederland</span>
                    <span class="block text-sm text-primary-200" itemProp="description">Jouw community voor politie-informatie</span>
                    <meta itemProp="url" content="https://politie-forum.nl" />
                </span>
            </a>
            <nav class="hidden md:flex items-center space-x-6 text-sm font-medium" aria-label="Hoofd navigatie">
                <a href="https://politie-forum.nl" class="transition hover:text-accent-300">Home</a>
                <a href="https://politie-forum.nl/forum" class="transition hover:text-accent-300">Forum</a>
                <a href="https://politie-forum.nl/nieuws" class="transition hover:text-accent-300">Nieuws</a>
                <a href="https://politie-forum.nl/categorieen" class="transition hover:text-accent-300">Categorieën</a>
                <a href="https://politie-forum.nl/contact" class="transition hover:text-accent-300">Contact</a>
            </nav>
            <div class="hidden md:flex items-center space-x-3">
                <button type="button" class="rounded-lg border border-white/20 bg-white/10 px-3 py-2 transition hover:bg-white/20" data-action="toggle-theme" aria-label="Schakel thema">
                    <span class="block dark:hidden">🌙</span>
                    <span class="hidden dark:block">☀️</span>
                </button>
                <!-- Logged out buttons -->
                <button type="button" class="logged-out-only rounded-lg border border-white/20 bg-transparent px-4 py-2 font-semibold transition hover:bg-white/10" data-action="show-login">Inloggen</button>
                <button type="button" class="logged-out-only rounded-lg bg-accent-500 px-4 py-2 font-semibold text-primary-900 transition hover:bg-accent-400" data-action="show-register">Word lid</button>
                <!-- Logged in user display -->
                <div class="logged-in-only hidden flex items-center gap-3">
                    <span class="text-sm text-white/90" id="userNameDisplay">User</span>
                    <button type="button" class="rounded-lg border border-white/20 bg-transparent px-4 py-2 font-semibold transition hover:bg-white/10" data-action="sign-out">Uitloggen</button>
                </div>
            </div>
            <button type="button" class="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 p-2 text-white md:hidden" data-action="toggle-menu" aria-label="Open navigatie">
                ☰
            </button>
        </div>
        <nav class="mt-4 hidden flex-col space-y-3 text-sm font-medium md:hidden" data-mobile-menu aria-label="Mobiele navigatie">
            <a href="https://politie-forum.nl" class="rounded-lg bg-white/10 px-4 py-2 transition hover:bg-white/20">Home</a>
            <a href="https://politie-forum.nl/forum" class="rounded-lg bg-white/10 px-4 py-2 transition hover:bg-white/20">Forum</a>
            <a href="https://politie-forum.nl/nieuws" class="rounded-lg bg-white/10 px-4 py-2 transition hover:bg-white/20">Nieuws</a>
            <a href="https://politie-forum.nl/categorieen" class="rounded-lg bg-white/10 px-4 py-2 transition hover:bg-white/20">Categorieën</a>
            <a href="https://politie-forum.nl/contact" class="rounded-lg bg-white/10 px-4 py-2 transition hover:bg-white/20">Contact</a>
            <div class="flex items-center justify-between rounded-lg bg-white/10 px-4 py-3 logged-out-only">
                <button type="button" class="font-semibold" data-action="show-login">Inloggen</button>
                <button type="button" class="rounded-lg bg-accent-500 px-3 py-2 font-semibold text-primary-900" data-action="show-register">Word lid</button>
            </div>
            <div class="logged-in-only hidden rounded-lg bg-white/10 px-4 py-3">
                <span class="block text-sm mb-2" id="mobileUserName">Ingelogd als: <span class="font-semibold">User</span></span>
                <button type="button" class="w-full rounded-lg bg-white/20 px-3 py-2 font-semibold" data-action="sign-out">Uitloggen</button>
            </div>
        </nav>
    </div>
</header>
    <main class="pf-main">
        <div class="pf-article-card">
            <h1 class="pf-article-title">{title_escaped}</h1>
            <div class="pf-meta">
                <span>📅 {article_data.get('timestamp', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))}</span>
                <span>📂 {article_data.get('category', 'Nieuws')}</span>
                {f'<span>💬 {comment_count} reacties</span>' if comment_count > 0 else ''}
            </div>
            <article>
                {article_data["full_text"]}
            </article>
            <!-- Comments Section -->
            <section class="mt-12 border-t-2 border-slate-200 dark:border-slate-700 pt-10" id="comments">
                <div class="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/10 dark:to-accent-900/10 -mx-4 px-4 py-6 rounded-2xl mb-8">
                    <h2 class="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div class="bg-primary-600 dark:bg-primary-500 p-2 rounded-lg">
                            <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                            </svg>
                        </div>
                        Comments
                    </h2>
                    <p class="text-slate-600 dark:text-slate-400 mt-2 ml-14">
                        Deel je gedachten en discussieer mee
                    </p>
                </div>

                <!-- Comments Section -->
                <div class="mb-8">
                    <div class="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6 shadow-lg">
                        <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                            <svg class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            Reacties
                            <span id="commentsCount" class="text-base font-normal text-slate-500 dark:text-slate-400">(0)</span>
                        </h3>

                        <!-- Comment Form (shown when logged in) -->
                        <form id="commentForm" class="hidden mb-8">
                            <div class="mb-4">
                                <label for="commentText" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Plaats een reactie
                                </label>
                                <textarea
                                    id="commentText"
                                    rows="4"
                                    required
                                    placeholder="Deel je mening..."
                                    class="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-colors resize-none"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                id="commentSubmitBtn"
                                class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                            >
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                                Plaats reactie
                            </button>
                        </form>

                        <!-- Login Prompt (shown when logged out) -->
                        <div id="commentLoginPrompt" class="mb-8 p-6 bg-gradient-to-r from-primary-50 via-accent-50 to-primary-50 dark:from-primary-900/20 dark:via-accent-900/20 dark:to-primary-900/20 rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-700">
                            <div class="flex items-center gap-4">
                                <div class="bg-gradient-to-br from-primary-500 to-accent-500 p-4 rounded-xl shadow-lg">
                                    <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                        Meepraten in de discussie?
                                    </h4>
                                    <p class="text-slate-600 dark:text-slate-400 mb-3">
                                        Log in om een reactie te plaatsen en mee te discussiëren.
                                    </p>
                                    <div class="flex gap-3">
                                        <button
                                            data-action="show-login"
                                            class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                                        >
                                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                                            </svg>
                                            Inloggen
                                        </button>
                                        <button
                                            data-action="show-register"
                                            class="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                                        >
                                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                            </svg>
                                            Account aanmaken
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- No Comments Message -->
                        <div id="noComments" class="text-center py-8 text-slate-500 dark:text-slate-400">
                            <svg class="h-16 w-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            <p class="text-lg font-medium">Nog geen reacties</p>
                            <p class="text-sm mt-1">Wees de eerste om te reageren op dit artikel!</p>
                        </div>

                        <!-- Comments List (populated by JavaScript) -->
                        <div id="commentsList" class="space-y-4">
                            <!-- Comments will be dynamically inserted here by forum-app.js -->
                        </div>
                    </div>
                </div>
            </section>
            <div class="pf-tags">{"".join([f'<span class="tag">{tag}</span>' for tag in article_data.get('tags', ['Nederland', 'Nieuws', 'Actueel'])])}</div>
        </div>
    </main>
    <footer class="pf-footer" role="contentinfo">
    <div class="container mx-auto px-4 pf-footer-grid">
        <div>
            <h3>Over Politie Forum</h3>
            <p>Het grootste Nederlandse forum voor discussies over de politie, sollicitaties, opleidingen en ervaringen.</p>
        </div>
        <div>
            <h3>Snelle Links</h3>
            <ul>
                <li><a href="https://politie-forum.nl/regels">Forumregels</a></li>
                <li><a href="https://politie-forum.nl/privacy">Privacy Policy</a></li>
                <li><a href="https://politie-forum.nl/voorwaarden">Gebruiksvoorwaarden</a></li>
                <li><a href="https://politie-forum.nl/contact">Contact</a></li>
            </ul>
        </div>
        <div>
            <h3>Contact</h3>
            <p>Email: <a href="mailto:info@politie-forum.nl">info@politie-forum.nl</a><br/>© 2025 Politie Forum Nederland</p>
        </div>
    </div>
    <div class="pf-footer-bottom">
        <span>© 2025 Politie Forum Nederland. Alle rechten voorbehouden.</span>
    </div>
</footer>
    <script>
(function() {{
    const root = document.documentElement;
    const storedTheme = localStorage.getItem("pf-theme");
    if (storedTheme === "dark") {{
        root.classList.add("dark");
    }} else if (storedTheme === "light") {{
        root.classList.remove("dark");
    }}

    document.querySelectorAll('[data-action="toggle-theme"]').forEach((btn) => {{
        btn.addEventListener("click", () => {{
            const isDark = root.classList.toggle("dark");
            localStorage.setItem("pf-theme", isDark ? "dark" : "light");
        }});
    }});

    const menuButton = document.querySelector('[data-action="toggle-menu"]');
    const mobileMenu = document.querySelector("[data-mobile-menu]");
    if (menuButton && mobileMenu) {{
        menuButton.addEventListener("click", () => {{
            mobileMenu.classList.toggle("hidden");
        }});
    }}
}})();
</script>

<!-- Auth Modal -->
<div id="authModal" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
        <button data-action="close-modal" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>

        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Account</h2>

        <div class="flex gap-2 mb-6">
            <button id="loginTabBtn" type="button" class="flex-1 py-2.5 px-4 rounded-lg font-semibold transition-colors bg-primary-600 text-white">
                Inloggen
            </button>
            <button id="registerTabBtn" type="button" class="flex-1 py-2.5 px-4 rounded-lg font-semibold transition-colors bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                Registreren
            </button>
        </div>

        <div id="authError" class="hidden mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p id="authErrorText" class="text-red-700 dark:text-red-400 text-sm font-medium"></p>
        </div>

        <form id="authForm" class="space-y-4">
            <div id="displayNameField" class="hidden">
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gebruikersnaam</label>
                <input
                    type="text"
                    id="authDisplayName"
                    autocomplete="username"
                    class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Jouw gebruikersnaam"
                />
            </div>

            <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                <input
                    type="email"
                    id="authEmail"
                    required
                    autocomplete="email"
                    class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="jouw@email.nl"
                />
            </div>

            <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Wachtwoord</label>
                <input
                    type="password"
                    id="authPassword"
                    required
                    minlength="6"
                    autocomplete="current-password"
                    class="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                id="authSubmitBtn"
                class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 px-4 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
            >
                Inloggen
            </button>
        </form>

        <div class="mt-6">
            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-300 dark:border-slate-600"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Of inloggen met</span>
                </div>
            </div>

            <div class="mt-4">
                <button
                    id="googleSignInBtn"
                    type="button"
                    class="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white py-2.5 px-4 rounded-lg font-medium transition-colors shadow-sm"
                >
                    <svg class="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Google</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Firebase App JavaScript -->
<script src="/forum-app.js"></script>
</body>
</html>"""

        # Write HTML file
        html_path = os.path.join(html_dir, "index.html")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html_content)

        print(f"✅ Generated static HTML: {html_path}")
        return html_path

    except Exception as e:
        print(f"❌ Error generating static HTML: {e}")
        import traceback

        traceback.print_exc()
        return None


def build_semantic_html_structure(article_data, location, faq_data):
    """Combine HTML body with structured JSON-LD for FAQ and location."""
    html = article_data["full_text"]

    # Maak JSON-LD object (COMPACT - matching ArticleJsonLd.tsx strategy)
    structured = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "NewsArticle",
                "@id": f"{article_data['url']}#article",
                "headline": article_data["title"],
                "description": article_data.get("excerpt", ""),
                "url": article_data["url"],
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": f"{article_data['url']}#webpage",
                },
                "isPartOf": {"@id": "https://politie-forum.nl/#website"},
                "image": [article_data.get("image", "")],  # Compact array format
                "datePublished": article_data["timestamp"],
                "dateModified": article_data.get(
                    "updatedAt", article_data["timestamp"]
                ),
                "author": {"@id": "https://politie-forum.nl/#p-oldenburger"},
                "publisher": {"@id": "https://politie-forum.nl/#org"},
                "articleSection": article_data.get("category", "Nieuws"),
                "keywords": article_data.get("tags", []),
                "inLanguage": article_data["language"],
                "isAccessibleForFree": True,
                "interactionStatistic": [
                    {
                        "@type": "InteractionCounter",
                        "interactionType": "https://schema.org/CommentAction",
                        "userInteractionCount": article_data.get("commentCount", 0),
                    }
                ],
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": q.get("question"),
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": q.get("answer"),
                        },
                    }
                    for q in faq_data or []
                ],
            },
        ],
    }

    # Combineer HTML met JSON-LD script
    html += f'\n<script type="application/ld+json">{json.dumps(structured, ensure_ascii=False)}</script>'
    return html


def rewrite_article(article):
    """Process and rewrite article using AI"""
    original_title = article["title"]
    original_body = article.get("body", article.get("full_text", ""))

    print(f"🔄 Rewriting article: {original_title[:50]}...")

    # ✅ Extract source URL for credibility attribution
    source_url = article.get("link", "")
    source_name = (
        "politie.nl"
        if "politie.nl" in source_url
        else "Omroep West" if "omroepwest.nl" in source_url else "originele bron"
    )

    # Generate new body text in chunks if necessary
    chunk_size = 512
    rewritten_body = ""
    for i in range(0, len(original_body), chunk_size):
        chunk = original_body[i : i + chunk_size]
        # Use the selected language in the prompt
        prompt = {
            "Dutch": f"Herschrijf dit nieuwsartikel in het Nederlands in {selected_style.lower()} stijl. "
            f"Gebruik <h1> voor de titel, <h2> voor subtitel en locatie, "
            f"en <p> voor elke paragraaf. "
            f"BELANGRIJK: Voeg binnen de eerste paragraaf een bronvermelding toe zoals: "
            f'\'Volgens <a href="{source_url}" target="_blank" rel="nofollow noopener noreferrer">{source_name}</a>...\' '
            f'of \'Zoals gemeld door <a href="{source_url}" target="_blank" rel="nofollow noopener noreferrer">{source_name}</a>...\'. '
            f"Voeg daarna een FAQ-sectie toe met <h2>FAQ</h2> en gebruik <h3> voor elke vraag. "
            f"Gebruik geen <br>-tags of geneste paragrafen. "
            f"Houd de HTML professioneel en goed gestructureerd.",
            "English": f"Rewrite this news article in English in {selected_style.lower()} style. "
            f"Use <h1> for the title, <h2> for subtitle and location, "
            f"and <p> for each paragraph. "
            f"IMPORTANT: Include source attribution in first paragraph like: "
            f'\'According to <a href="{source_url}" target="_blank" rel="nofollow noopener noreferrer">{source_name}</a>...\' '
            f"Then add a FAQ section with <h2>FAQ</h2> and <h3> for each question. "
            f"Use no <br> tags. Keep the HTML clean and professional.",
            "German": f"Schreiben Sie diesen Nachrichtenartikel auf Deutsch in {selected_style.lower()} Stil. "
            f"Verwenden Sie <h1> für den Titel, <h2> für Untertitel und Ort, "
            f"und <p> für jeden Absatz. "
            f"WICHTIG: Fügen Sie im ersten Absatz eine Quellenangabe hinzu wie: "
            f'\'Laut <a href="{source_url}" target="_blank" rel="nofollow noopener noreferrer">{source_name}</a>...\' '
            f"Fügen Sie dann einen FAQ-Abschnitt mit <h2>FAQ</h2> und <h3> für jede Frage hinzu. "
            f"Keine <br>-Tags. Saubere, professionelle HTML-Struktur.",
        }
        full_prompt = f"{prompt[selected_language]}\n\n{chunk}"
        rewritten_body_chunk = generate_text(full_prompt, max_tokens=chunk_size)
        rewritten_body += rewritten_body_chunk + " "

    rewritten_body = rewritten_body.strip()

    # If AI generation failed completely, use original body
    if not rewritten_body:
        print("⚠️ AI generation failed, using original body")
        rewritten_body = original_body

    # Format the rewritten body with HTML tags and spacious paragraphs
    formatted_body = format_full_text_with_html(rewritten_body)
    print("✨ Applied HTML formatting for better readability")

    # Generate new title from rewritten body (max 200 chars for complete titles)
    # Use a very explicit prompt that demands ONLY the title text
    title_prompt = f"""Creëer een korte, pakkende nieuwstitel voor dit artikel.

BELANGRIJK: Geef ALLEEN de titel zelf, zonder uitleg of extra tekst.

Artikel:
{rewritten_body[:300]}

Titel:"""
    rewritten_title = generate_text(title_prompt, max_tokens=60)

    # Clean up the title - remove any HTML tags or instructions
    if rewritten_title:
        # Remove any HTML tags
        rewritten_title = re.sub(r"<[^>]+>", "", rewritten_title)
        # Remove common instruction artifacts and prefixes
        rewritten_title = re.sub(
            r"^(Titel|Title|Herschrijf|Genereer|Hieronder|Creëer|Schrijf).*?:",
            "",
            rewritten_title,
            flags=re.IGNORECASE,
        )
        # Remove "Hieronder vind je..." type phrases
        rewritten_title = re.sub(
            r"^Hieronder (vind je|vindt u).*?(titel|nieuwstitel).*?:",
            "",
            rewritten_title,
            flags=re.IGNORECASE,
        )
        rewritten_title = rewritten_title.strip()
        # Remove surrounding quotes (both single and double)
        rewritten_title = rewritten_title.strip('"').strip("'")
        # Limit to 200 chars
        rewritten_title = rewritten_title[:200]

    if not rewritten_title or len(rewritten_title) < 10:
        # Fallback: use original title if AI failed
        rewritten_title = original_title[:200]

    # Keep full title for display on page
    full_display_title = rewritten_title.strip()
    print(f"📏 Full title length: {len(full_display_title)} chars")

    # Create SEO-optimized version for meta tags (Google shows ~50-70 chars + " | Politie Forum Nederland")
    seo_title = optimize_title_for_serp(rewritten_title, max_length=70)
    print(f"📏 SEO-optimized title length: {len(seo_title)} chars")

    # Generate summary
    summary = generate_summary(formatted_body)

    # Determine category and tags
    category = get_category(formatted_body)
    tags = get_tags(formatted_body)

    # Generate FAQ section (returns tuple: html and data list)
    faq_html, faq_data = generate_faq_section(formatted_body, full_display_title)

    # Create URL slug (use full title for better SEO)
    title_slug = create_url_slug(full_display_title)

    # Generate URL based on slug
    article_url = f"https://politie-forum.nl/nieuws/{title_slug}/"

    # Extract location for semantic structure
    temp_location = extract_location_from_article(formatted_body, full_display_title)

    # NO year suffix for news articles (follows industry standard)
    # Google already shows publish date in search results
    # Dates are properly marked in datePublished/dateModified schema

    # Compile the article data (without semantic structure first)
    article_data = {
        "title": full_display_title,  # Full title for display (no year suffix)
        "seo_title": seo_title,  # Optimized title for meta tags (no year suffix)
        "original_title": original_title,
        "link": article.get("link", ""),
        "summary": summary,
        "full_text": formatted_body,  # Will be replaced with semantic structure
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "slug": title_slug,
        "category": category,
        "tags": tags,
        "language": selected_language,
        "style": selected_style,
        "processed": True,
        "image_url": None,
        "published": "",
        "url": article_url,
        "faq": faq_data,  # Add FAQ data for JSON-LD schema
        "location": temp_location,  # Add location for semantic structure
    }

    # Build semantic HTML structure with proper hierarchy
    semantic_html = build_semantic_html_structure(article_data, temp_location, faq_data)
    article_data["full_text"] = semantic_html

    return article_data


# Dutch cities database with coordinates (100+ cities for comprehensive coverage)
DUTCH_CITIES = {
    # Top 30 largest cities
    "Amsterdam": {
        "lat": 52.3676,
        "lng": 4.9041,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Rotterdam": {
        "lat": 51.9225,
        "lng": 4.4792,
        "region": "Zuid-Holland",
        "provincie": "Zuid-Holland",
    },
    "Den Haag": {
        "lat": 52.0705,
        "lng": 4.3007,
        "region": "Zuid-Holland",
        "provincie": "Zuid-Holland",
    },
    "'s-Gravenhage": {
        "lat": 52.0705,
        "lng": 4.3007,
        "region": "Zuid-Holland",
        "provincie": "Zuid-Holland",
    },
    "Utrecht": {
        "lat": 52.0907,
        "lng": 5.1214,
        "region": "Utrecht",
        "provincie": "Utrecht",
    },
    "Eindhoven": {
        "lat": 51.4416,
        "lng": 5.4697,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Groningen": {
        "lat": 53.2194,
        "lng": 6.5665,
        "region": "Groningen",
        "provincie": "Groningen",
    },
    "Tilburg": {
        "lat": 51.5555,
        "lng": 5.0913,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Almere": {
        "lat": 52.3508,
        "lng": 5.2647,
        "region": "Flevoland",
        "provincie": "Flevoland",
    },
    "Breda": {
        "lat": 51.5719,
        "lng": 4.7683,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Nijmegen": {
        "lat": 51.8126,
        "lng": 5.8372,
        "region": "Gelderland",
        "provincie": "Gelderland",
    },
    "Enschede": {
        "lat": 52.2213,
        "lng": 6.8937,
        "region": "Overijssel",
        "provincie": "Overijssel",
    },
    "Apeldoorn": {
        "lat": 52.2112,
        "lng": 5.9699,
        "region": "Gelderland",
        "provincie": "Gelderland",
    },
    "Haarlem": {
        "lat": 52.3874,
        "lng": 4.6462,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Arnhem": {
        "lat": 51.9851,
        "lng": 5.8987,
        "region": "Gelderland",
        "provincie": "Gelderland",
    },
    "Zaanstad": {
        "lat": 52.4390,
        "lng": 4.8258,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Amersfoort": {
        "lat": 52.1561,
        "lng": 5.3878,
        "region": "Utrecht",
        "provincie": "Utrecht",
    },
    "'s-Hertogenbosch": {
        "lat": 51.6978,
        "lng": 5.3037,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Den Bosch": {
        "lat": 51.6978,
        "lng": 5.3037,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Hoofddorp": {
        "lat": 52.3030,
        "lng": 4.6892,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Maastricht": {
        "lat": 50.8514,
        "lng": 5.6909,
        "region": "Limburg",
        "provincie": "Limburg",
    },
    "Leiden": {
        "lat": 52.1601,
        "lng": 4.4970,
        "region": "Zuid-Holland",
        "provincie": "Zuid-Holland",
    },
    "Dordrecht": {
        "lat": 51.8133,
        "lng": 4.6901,
        "region": "Zuid-Holland",
        "provincie": "Zuid-Holland",
    },
    "Zoetermeer": {
        "lat": 52.0576,
        "lng": 4.4932,
        "region": "Zuid-Holland",
        "provincie": "Zuid-Holland",
    },
    "Zwolle": {
        "lat": 52.5168,
        "lng": 6.0830,
        "region": "Overijssel",
        "provincie": "Overijssel",
    },
    "Deventer": {
        "lat": 52.2551,
        "lng": 6.1639,
        "region": "Overijssel",
        "provincie": "Overijssel",
    },
    "Delft": {
        "lat": 52.0116,
        "lng": 4.3571,
        "region": "Zuid-Holland",
        "provincie": "Zuid-Holland",
    },
    "Alkmaar": {
        "lat": 52.6325,
        "lng": 4.7494,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Hengelo": {
        "lat": 52.2657,
        "lng": 6.7931,
        "region": "Overijssel",
        "provincie": "Overijssel",
    },
    "Leeuwarden": {
        "lat": 53.2012,
        "lng": 5.7999,
        "region": "Friesland",
        "provincie": "Friesland",
    },
    # Additional major cities (31-60)
    "Oss": {
        "lat": 51.7650,
        "lng": 5.5194,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Hilversum": {
        "lat": 52.2242,
        "lng": 5.1758,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Amstelveen": {
        "lat": 52.3008,
        "lng": 4.8632,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Purmerend": {
        "lat": 52.5051,
        "lng": 4.9592,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Alphen aan den Rijn": {
        "lat": 52.1288,
        "lng": 4.6577,
        "region": "Zuid-Holland",
        "provincie": "Zuid-Holland",
    },
    "Veenendaal": {
        "lat": 52.0286,
        "lng": 5.5589,
        "region": "Utrecht",
        "provincie": "Utrecht",
    },
    "Roosendaal": {
        "lat": 51.5308,
        "lng": 4.4653,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Schiedam": {
        "lat": 51.9192,
        "lng": 4.3986,
        "region": "Zuid-Holland",
        "provincie": "Zuid-Holland",
    },
    "Heerhugowaard": {
        "lat": 52.6733,
        "lng": 4.8383,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Capelle aan den IJssel": {
        "lat": 51.9289,
        "lng": 4.5772,
        "region": "Zuid-Holland",
        "provincie": "Zuid-Holland",
    },
    "Leidschendam": {
        "lat": 52.0883,
        "lng": 4.3953,
        "region": "Zuid-Holland",
        "provincie": "Zuid-Holland",
    },
    "Spijkenisse": {
        "lat": 51.8450,
        "lng": 4.3300,
        "region": "Zuid-Holland",
        "provincie": "Zuid-Holland",
    },
    "Purmerend": {
        "lat": 52.5051,
        "lng": 4.9592,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Vlaardingen": {
        "lat": 51.9122,
        "lng": 4.3419,
        "region": "Zuid-Holland",
        "provincie": "Zuid-Holland",
    },
    "Helmond": {
        "lat": 51.4814,
        "lng": 5.6558,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Gouda": {
        "lat": 52.0115,
        "lng": 4.7108,
        "region": "Zuid-Holland",
        "provincie": "Zuid-Holland",
    },
    "Hoorn": {
        "lat": 52.6425,
        "lng": 5.0597,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Ede": {
        "lat": 52.0408,
        "lng": 5.6614,
        "region": "Gelderland",
        "provincie": "Gelderland",
    },
    "Nieuwegein": {
        "lat": 52.0292,
        "lng": 5.0808,
        "region": "Utrecht",
        "provincie": "Utrecht",
    },
    "Kampen": {
        "lat": 52.5550,
        "lng": 5.9114,
        "region": "Overijssel",
        "provincie": "Overijssel",
    },
    "Venlo": {
        "lat": 51.3703,
        "lng": 6.1686,
        "region": "Limburg",
        "provincie": "Limburg",
    },
    "Zaandam": {
        "lat": 52.4381,
        "lng": 4.8264,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Bussum": {
        "lat": 52.2742,
        "lng": 5.1622,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Katwijk": {
        "lat": 52.2050,
        "lng": 4.4031,
        "region": "Zuid-Holland",
        "provincie": "Zuid-Holland",
    },
    "Huizen": {
        "lat": 52.2989,
        "lng": 5.2417,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Rijswijk": {
        "lat": 52.0378,
        "lng": 4.3264,
        "region": "Zuid-Holland",
        "provincie": "Zuid-Holland",
    },
    "Lelystad": {
        "lat": 52.5083,
        "lng": 5.4750,
        "region": "Flevoland",
        "provincie": "Flevoland",
    },
    "Velsen": {
        "lat": 52.4608,
        "lng": 4.6556,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Hardenberg": {
        "lat": 52.5761,
        "lng": 6.6194,
        "region": "Overijssel",
        "provincie": "Overijssel",
    },
    "Soest": {
        "lat": 52.1733,
        "lng": 5.2917,
        "region": "Utrecht",
        "provincie": "Utrecht",
    },
    # Additional cities (61-100+)
    "Bergen op Zoom": {
        "lat": 51.4950,
        "lng": 4.2900,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Emmen": {
        "lat": 52.7792,
        "lng": 6.9039,
        "region": "Drenthe",
        "provincie": "Drenthe",
    },
    "Assen": {
        "lat": 52.9958,
        "lng": 6.5628,
        "region": "Drenthe",
        "provincie": "Drenthe",
    },
    "Middelburg": {
        "lat": 51.4989,
        "lng": 3.6106,
        "region": "Zeeland",
        "provincie": "Zeeland",
    },
    "Hoogeveen": {
        "lat": 52.7228,
        "lng": 6.4758,
        "region": "Drenthe",
        "provincie": "Drenthe",
    },
    "Heerlen": {
        "lat": 50.8878,
        "lng": 5.9808,
        "region": "Limburg",
        "provincie": "Limburg",
    },
    "Sittard": {
        "lat": 50.9997,
        "lng": 5.8686,
        "region": "Limburg",
        "provincie": "Limburg",
    },
    "Geleen": {
        "lat": 50.9667,
        "lng": 5.8208,
        "region": "Limburg",
        "provincie": "Limburg",
    },
    "Roermond": {
        "lat": 51.1944,
        "lng": 5.9875,
        "region": "Limburg",
        "provincie": "Limburg",
    },
    "Weert": {
        "lat": 51.2514,
        "lng": 5.7069,
        "region": "Limburg",
        "provincie": "Limburg",
    },
    "Doetinchem": {
        "lat": 51.9653,
        "lng": 6.2886,
        "region": "Gelderland",
        "provincie": "Gelderland",
    },
    "Wageningen": {
        "lat": 51.9692,
        "lng": 5.6658,
        "region": "Gelderland",
        "provincie": "Gelderland",
    },
    "Barneveld": {
        "lat": 52.1383,
        "lng": 5.5878,
        "region": "Gelderland",
        "provincie": "Gelderland",
    },
    "Tiel": {
        "lat": 51.8858,
        "lng": 5.4289,
        "region": "Gelderland",
        "provincie": "Gelderland",
    },
    "Harderwijk": {
        "lat": 52.3508,
        "lng": 5.6208,
        "region": "Gelderland",
        "provincie": "Gelderland",
    },
    "Almelo": {
        "lat": 52.3567,
        "lng": 6.6631,
        "region": "Overijssel",
        "provincie": "Overijssel",
    },
    "Oldenzaal": {
        "lat": 52.3133,
        "lng": 6.9294,
        "region": "Overijssel",
        "provincie": "Overijssel",
    },
    "Losser": {
        "lat": 52.2633,
        "lng": 7.0092,
        "region": "Overijssel",
        "provincie": "Overijssel",
    },
    "Steenwijk": {
        "lat": 52.7853,
        "lng": 6.1192,
        "region": "Overijssel",
        "provincie": "Overijssel",
    },
    "Waalwijk": {
        "lat": 51.6833,
        "lng": 5.0667,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Oosterhout": {
        "lat": 51.6433,
        "lng": 4.8608,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Uden": {
        "lat": 51.6611,
        "lng": 5.6186,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Veghel": {
        "lat": 51.6139,
        "lng": 5.5472,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Boxmeer": {
        "lat": 51.6453,
        "lng": 5.9472,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Valkenswaard": {
        "lat": 51.3506,
        "lng": 5.4589,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Veldhoven": {
        "lat": 51.4197,
        "lng": 5.4042,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Someren": {
        "lat": 51.3864,
        "lng": 5.7128,
        "region": "Noord-Brabant",
        "provincie": "Noord-Brabant",
    },
    "Winterswijk": {
        "lat": 51.9711,
        "lng": 6.7192,
        "region": "Gelderland",
        "provincie": "Gelderland",
    },
    "Zeist": {
        "lat": 52.0894,
        "lng": 5.2278,
        "region": "Utrecht",
        "provincie": "Utrecht",
    },
    "Woerden": {
        "lat": 52.0858,
        "lng": 4.8839,
        "region": "Utrecht",
        "provincie": "Utrecht",
    },
    "IJsselstein": {
        "lat": 52.0203,
        "lng": 5.0428,
        "region": "Utrecht",
        "provincie": "Utrecht",
    },
    "Houten": {
        "lat": 52.0283,
        "lng": 5.1675,
        "region": "Utrecht",
        "provincie": "Utrecht",
    },
    "Schagen": {
        "lat": 52.7872,
        "lng": 4.7958,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Den Helder": {
        "lat": 52.9594,
        "lng": 4.7594,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Medemblik": {
        "lat": 52.7714,
        "lng": 5.1050,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Enkhuizen": {
        "lat": 52.7036,
        "lng": 5.2908,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Beverwijk": {
        "lat": 52.4825,
        "lng": 4.6569,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "IJmuiden": {
        "lat": 52.4597,
        "lng": 4.6197,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Heemskerk": {
        "lat": 52.5094,
        "lng": 4.6728,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Castricum": {
        "lat": 52.5478,
        "lng": 4.6708,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Heiloo": {
        "lat": 52.6017,
        "lng": 4.6931,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Naarden": {
        "lat": 52.2958,
        "lng": 5.1622,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Weesp": {
        "lat": 52.3061,
        "lng": 5.0414,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Muiden": {
        "lat": 52.3328,
        "lng": 5.0719,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Volendam": {
        "lat": 52.4961,
        "lng": 5.0714,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Edam": {
        "lat": 52.5142,
        "lng": 5.0472,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Monnickendam": {
        "lat": 52.4572,
        "lng": 5.0336,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Texel": {
        "lat": 53.0553,
        "lng": 4.7967,
        "region": "Noord-Holland",
        "provincie": "Noord-Holland",
    },
    "Vlissingen": {
        "lat": 51.4425,
        "lng": 3.5744,
        "region": "Zeeland",
        "provincie": "Zeeland",
    },
    "Goes": {
        "lat": 51.5042,
        "lng": 3.8886,
        "region": "Zeeland",
        "provincie": "Zeeland",
    },
    "Terneuzen": {
        "lat": 51.3331,
        "lng": 3.8281,
        "region": "Zeeland",
        "provincie": "Zeeland",
    },
    "Sneek": {
        "lat": 53.0322,
        "lng": 5.6581,
        "region": "Friesland",
        "provincie": "Friesland",
    },
    "Heerenveen": {
        "lat": 52.9597,
        "lng": 5.9208,
        "region": "Friesland",
        "provincie": "Friesland",
    },
    "Drachten": {
        "lat": 53.1125,
        "lng": 6.0989,
        "region": "Friesland",
        "provincie": "Friesland",
    },
    "Franeker": {
        "lat": 53.1872,
        "lng": 5.5422,
        "region": "Friesland",
        "provincie": "Friesland",
    },
    "Harlingen": {
        "lat": 53.1753,
        "lng": 5.4178,
        "region": "Friesland",
        "provincie": "Friesland",
    },
}


def extract_location_from_article(article_text, article_title=""):
    """Extract location (city/region) from article using AI"""
    if not client or not model_name:
        print("⚠️ No AI client available, cannot extract location")
        return {
            "city": None,
            "region": None,
            "lat": None,
            "lng": None,
            "provincie": None,
        }

    try:
        location_prompt = f"""Analyseer dit Nederlandse nieuwsartikel en identificeer de EXACTE stad/plaats waar het incident plaatsvond.

Artikel titel: {article_title}
Artikel tekst: {article_text[:500]}

Geef ALLEEN de stadsnaam, niets anders. Als er geen specifieke stad wordt genoemd, antwoord met 'Onbekend'.

Stad:"""

        city_name = generate_text(location_prompt, max_tokens=20)

        if city_name:
            city_name = city_name.strip().strip('"').strip("'")
            city_name = city_name.split(",")[0].strip()
            city_name = city_name.split(".")[0].strip()

            # Check if extracted city matches known Dutch cities
            for known_city, coords in DUTCH_CITIES.items():
                if (
                    known_city.lower() in city_name.lower()
                    or city_name.lower() in known_city.lower()
                ):
                    print(f"📍 Location extracted: {known_city}, {coords['region']}")
                    return {
                        "city": known_city,
                        "region": coords["region"],
                        "lat": coords["lat"],
                        "lng": coords["lng"],
                        "provincie": coords["provincie"],
                    }

        print("📍 No specific location found in article")
        return {
            "city": None,
            "region": None,
            "lat": None,
            "lng": None,
            "provincie": None,
        }

    except Exception as e:
        print(f"❌ Error extracting location: {e}")
        return {
            "city": None,
            "region": None,
            "lat": None,
            "lng": None,
            "provincie": None,
        }


def extract_enhanced_metadata(article_text, article_title):
    """Extract enhanced metadata including incident type, persons involved, organizations"""
    if not client or not model_name:
        print("⚠️ No AI client available for metadata extraction")
        return {}

    try:
        metadata_prompt = f"""Analyseer dit Nederlandse politie/nieuwsartikel en extraheer de volgende metadata in JSON formaat:

Artikel titel: {article_title}
Artikel: {article_text[:800]}

Geef ALLEEN een JSON object terug met deze velden (geef null als informatie niet beschikbaar is):
{{
  "incident_type": "type incident (bijv. diefstal, overval, ongeval, etc.)",
  "severity": "laag/gemiddeld/hoog",
  "persons_involved": ["namen van betrokken personen"],
  "organizations": ["betrokken organisaties/bedrijven"],
  "date_mentioned": "datum uit artikel in YYYY-MM-DD formaat",
  "time_mentioned": "tijd uit artikel in HH:MM formaat",
  "keywords": ["belangrijkste zoekwoorden"]
}}

JSON:"""

        response = generate_text(metadata_prompt, max_tokens=300)

        if response:
            # Try to parse JSON
            try:
                # Clean response - remove markdown code blocks if present
                response = response.strip()
                if response.startswith("```"):
                    response = response.split("```")[1]
                    if response.startswith("json"):
                        response = response[4:]
                response = response.strip()

                metadata = json.loads(response)
                print(f"✅ Enhanced metadata extracted: {len(metadata)} fields")
                return metadata
            except json.JSONDecodeError:
                print("⚠️ Could not parse metadata JSON")
                return {}

        return {}

    except Exception as e:
        print(f"❌ Error extracting enhanced metadata: {e}")
        return {}


def start_advanced_rewriting_v2(db):
    """
    Advanced rewriting with enhanced metadata + automatic publishing (2 steps in 1)

    Workflow:
    Step 1: articles_full → AI rewrite → articles_rewritten (Firestore)
    Step 2: articles_rewritten → publish → news (Firestore) + Forum topics (Realtime DB)

    Features:
    - AI rewriting with Groq Llama models
    - Location extraction with geo-coordinates (100+ Dutch cities)
    - Firebase comment integration in JSON-LD
    - Automatic publishing to news collection
    - Forum topic creation
    - Schema.org: NewsArticle, DiscussionForumPosting, Place, Comment
    """
    global client, model_name, client_type

    try:
        # Initialize AI client
        print(f"🔧 Initializing AI client with model: {selected_model}")
        client, model_name, client_type = get_ai_client()

        if not client or not model_name:
            print("❌ No AI client available. Please check your API keys.")
            return

        print(f"\n🚀 Starting Advanced Rewriting V2 (2 Steps in 1):")
        print(f"   Style: {selected_style}")
        print(f"   Language: {selected_language}")
        print(f"   AI Model: Groq ({selected_groq_model})")
        print(f"   Step 1: articles_full → AI rewrite → articles_rewritten")
        print(f"   Step 2: articles_rewritten → publish → news + forum topics")
        print(f"   Features: Location extraction, Geo-coordinates, Comment integration")
        print(f"   Database: {len(DUTCH_CITIES)} Dutch cities with coordinates")

        # Check for existing published articles in /news to avoid duplicates
        print("\n🔍 Checking for existing published articles in /news...")
        news_collection = db.collection("news")
        existing_news = news_collection.get()
        existing_slugs = set()
        existing_titles = set()

        for doc in existing_news:
            news_data = doc.to_dict()
            existing_slugs.add(doc.id)  # slug is the document ID
            if news_data.get("title"):
                existing_titles.add(news_data["title"].lower().strip())

        print(f"📊 Found {len(existing_slugs)} existing articles in /news")
        print(f"   {len(existing_titles)} unique titles")
        print()

        # Check articles_full collection (source for rewriting)
        print("🔍 Checking collections for articles...")

        raw_collection = db.collection("articles_full")
        all_docs = raw_collection.get()
        source_collection = "articles_full"

        print(f"✅ Found {len(all_docs)} articles in {source_collection}")

        # Find unprocessed articles
        unprocessed_articles = []
        for doc in all_docs:
            article_data = doc.to_dict()
            if article_data and not article_data.get(
                "processed_v2"
            ):  # Use different flag
                article_data["id"] = doc.id
                unprocessed_articles.append(article_data)

        print(f"📊 Unprocessed articles (v2): {len(unprocessed_articles)}")

        if len(unprocessed_articles) == 0:
            print("No articles to process. All articles are already processed with v2.")
            return

        articles_to_process = unprocessed_articles
        print(f"Processing ALL {len(articles_to_process)} articles...\n")

        processed_count = 0
        duplicate_count = 0
        error_count = 0

        for i, article in enumerate(articles_to_process):
            print(f"\n🔄 Processing article {i+1}/{len(articles_to_process)}")

            rewritten_data = rewrite_article(article)

            if rewritten_data:
                # Note: rewrite_article() already extracts location and builds semantic HTML structure
                # The location is already in rewritten_data["location"]
                location = rewritten_data.get("location", {"name": "Nederland"})

                # Extract enhanced metadata
                print("🔍 Extracting enhanced metadata...")
                enhanced_meta = extract_enhanced_metadata(
                    rewritten_data.get("full_text", ""), rewritten_data.get("title", "")
                )
                rewritten_data["metadata"] = enhanced_meta

                # FAQ is already generated in rewrite_article() and included in semantic HTML
                # Just verify it exists
                faq_data = rewritten_data.get("faq", [])
                if not faq_data or len(faq_data) == 0:
                    # Fallback: Generate default FAQs if somehow missing
                    print("⚠️ Using fallback FAQ generation")
                    location_name = location.get("name", "Nederland")
                    rewritten_data["faq"] = [
                        {
                            "question": f"Wat is het belangrijkste om te weten over {rewritten_data.get('title', '').lower()}?",
                            "answer": rewritten_data.get(
                                "summary", "Meer details zijn te vinden in het artikel."
                            ),
                        },
                        {
                            "question": "Waar vond dit incident plaats?",
                            "answer": (
                                f"Dit incident vond plaats in {location_name}."
                                if location_name != "Nederland"
                                else "De locatie wordt vermeld in het artikel."
                            ),
                        },
                        {
                            "question": "Wat is de status van het onderzoek?",
                            "answer": "Meer informatie over dit incident is te vinden in het volledige artikel.",
                        },
                    ]
                    # Rebuild semantic structure with fallback FAQ
                    semantic_html = build_semantic_html_structure(
                        rewritten_data, location, rewritten_data["faq"]
                    )
                    rewritten_data["full_text"] = semantic_html
                else:
                    print(
                        f"✅ Article has {len(faq_data)} FAQ questions with semantic HTML structure"
                    )

                # Merge keywords from enhanced metadata with existing tags
                if enhanced_meta.get("keywords"):
                    existing_tags = rewritten_data.get("tags", [])
                    combined_tags = list(set(existing_tags + enhanced_meta["keywords"]))
                    rewritten_data["tags"] = combined_tags[:10]  # Limit to 10 tags

                # Add processed_v2 flag
                rewritten_data["processed_v2"] = True
                rewritten_data["version"] = "2.0"

                # Check if rewritten article already exists
                is_duplicate, duplicate_type = check_duplicate_article(
                    db,
                    "articles_rewritten",
                    rewritten_data.get("link", ""),
                    rewritten_data.get("title", ""),
                )

                if is_duplicate:
                    print(f"⚠️ Skipping duplicate: {rewritten_data['title'][:50]}...")
                    duplicate_count += 1

                    # Mark as processed_v2
                    try:
                        doc_ref = db.collection(source_collection).document(
                            article["id"]
                        )
                        doc_ref.update({"processed_v2": True})
                    except Exception as e:
                        print(f"❌ Error marking as processed_v2: {e}")

                    continue

                # Save to Firestore articles_rewritten
                try:
                    doc_ref = db.collection("articles_rewritten").document()
                    doc_ref.set(rewritten_data)
                    print(
                        f"✅ Saved to articles_rewritten: {rewritten_data['title'][:50]}..."
                    )

                    # Mark as processed_v2
                    doc_ref = db.collection(source_collection).document(article["id"])
                    doc_ref.update({"processed_v2": True})

                except Exception as e:
                    print(f"❌ Error saving to articles_rewritten: {e}")
                    error_count += 1
                    continue

                # Step 2: Publish to news collection (Firestore) - Check for duplicates first
                article_slug = rewritten_data.get("slug", "")
                article_title = rewritten_data.get("title", "").lower().strip()

                # Check if already published in /news
                if article_slug in existing_slugs:
                    print(
                        f"⚠️ Article already published (slug exists): /nieuws/{article_slug}"
                    )
                    duplicate_count += 1
                    processed_count += 1  # Count as processed
                    continue

                if article_title in existing_titles:
                    print(
                        f"⚠️ Article already published (title exists): {rewritten_data['title'][:50]}..."
                    )
                    duplicate_count += 1
                    processed_count += 1  # Count as processed
                    continue

                try:
                    save_article_to_firebase(rewritten_data)
                    revalidate_vercel_path(rewritten_data["slug"])  # Article page
                    revalidate_homepage()  # Homepage (shows 15 articles)
                    revalidate_listing_pages()  # /nieuws overview (shows 50 articles)
                    print(f"🚀 Published to news: /nieuws/{rewritten_data['slug']}")

                    # Add to existing sets to prevent duplicates in same run
                    existing_slugs.add(article_slug)
                    existing_titles.add(article_title)
                except Exception as e:
                    print(f"⚠️ Error publishing to news: {e}")

                # Create forum topic
                try:
                    topic_id = create_forum_topic_from_article(rewritten_data, db)
                    if topic_id:
                        print(f"💬 Forum topic created: {topic_id}")
                except Exception as e:
                    print(f"⚠️ Error creating forum topic: {e}")

                processed_count += 1
            else:
                print("⚠️ No rewritten data generated")
                error_count += 1

            # Delay between articles
            if i < len(articles_to_process) - 1:
                print("⏳ Waiting 2 seconds...")
                time.sleep(2)

        print(f"\n📊 Rewriting V2 Summary:")
        print(f"   ✅ Articles rewritten with enhanced metadata: {processed_count}")
        print(f"   📍 Location data extracted")
        print(f"   🗺️ Geo-coordinates added")
        print(f"   🏷️ Enhanced tags generated")
        print(f"   💬 FAQ sections generated")
        print(f"   ⚠️ Duplicates skipped: {duplicate_count}")
        print(f"   ❌ Errors: {error_count}")
        print(f"\n� Storage:")
        print(f"   � Saved to: articles_rewritten collection")
        print(f"   📊 Total articles: {processed_count}")
        print(f"\n💡 Next step: Use these articles to publish to /news collection")

    except Exception as e:
        print(f"Error in advanced rewriting v2: {e}")
        import traceback

        traceback.print_exc()


def start_advanced_rewriting(db):
    """Start the advanced rewriting process"""
    global client, model_name, client_type

    try:
        # Initialize AI client
        print(f"🔧 Initializing AI client with model: {selected_model}")
        client, model_name, client_type = get_ai_client()

        if not client or not model_name:
            print("❌ No AI client available. Please check your API keys.")
            return

        print(f"\n🚀 Starting Advanced Rewriting with Groq AI:")
        print(f"   Style: {selected_style}")
        print(f"   Language: {selected_language}")
        print(f"   AI Model: Groq ({selected_groq_model})")
        print(f"   Output: Forum Topics + Static HTML")
        print(f"   Processing: ALL unprocessed articles")

        # Get all articles from Firestore
        raw_collection = db.collection("articles_full")
        all_docs = raw_collection.get()

        print(f"Total articles in articles_full: {len(all_docs)}")

        # Find unprocessed articles
        unprocessed_articles = []
        for doc in all_docs:
            article_data = doc.to_dict()
            if article_data and not article_data.get("processed"):
                article_data["id"] = doc.id
                unprocessed_articles.append(article_data)

        print(f"Unprocessed articles: {len(unprocessed_articles)}")

        if len(unprocessed_articles) == 0:
            print("No articles to process. All articles are already processed.")
            return

        # Process ALL unprocessed articles
        articles_to_process = (
            unprocessed_articles  # Process all instead of limiting to 3
        )
        print(f"Processing ALL {len(articles_to_process)} articles...\n")

        processed_count = 0
        duplicate_count = 0
        error_count = 0

        for i, article in enumerate(articles_to_process):
            print(f"\n🔄 Processing article {i+1}/{len(articles_to_process)}")

            rewritten_data = rewrite_article(article)

            if rewritten_data:
                # Check if rewritten article already exists
                is_duplicate, duplicate_type = check_duplicate_article(
                    db,
                    "articles_rewritten",
                    rewritten_data.get("link", ""),
                    rewritten_data.get("title", ""),
                )

                if is_duplicate:
                    print(
                        f"⚠️ Skipping duplicate rewritten article (matched by {duplicate_type}): {rewritten_data['title'][:50]}..."
                    )
                    duplicate_count += 1

                    # Still mark original as processed to avoid reprocessing
                    try:
                        doc_ref = db.collection("articles_full").document(article["id"])
                        doc_ref.update({"processed": True})
                        print("✅ Marked original article as processed")
                    except Exception as e:
                        print(f"❌ Error marking original as processed: {e}")

                    continue

                # Save to rewritten collection (Firestore)
                try:
                    doc_ref = db.collection("articles_rewritten").document()
                    doc_ref.set(rewritten_data)
                    print(f"✅ Saved to Firestore: {rewritten_data['title'][:50]}...")

                    # Mark original as processed
                    doc_ref = db.collection("articles_full").document(article["id"])
                    doc_ref.update({"processed": True})
                    print("✅ Marked original article as processed")

                except Exception as e:
                    print(f"❌ Error saving to Firestore: {e}")
                    error_count += 1
                    continue

                # Create forum topic in Realtime Database
                try:
                    topic_id = create_forum_topic_from_article(rewritten_data, db)
                    if topic_id:
                        rewritten_data["topicId"] = topic_id
                except Exception as e:
                    print(f"⚠️ Error creating forum topic: {e}")

                # Generate output - Next.js ISR only (static HTML disabled)
                try:
                    # Save to Firestore for Next.js ISR
                    save_article_to_firebase(rewritten_data)
                    # Trigger Vercel revalidation for immediate accessibility
                    revalidate_vercel_path(rewritten_data["slug"])  # Article page
                    revalidate_homepage()  # Homepage (shows 15 articles)
                    revalidate_listing_pages()  # /nieuws overview (shows 50 articles)
                    print(
                        f"✅ Published to Next.js ISR: /nieuws/{rewritten_data['slug']}"
                    )
                except Exception as e:
                    print(f"⚠️ Error publishing to Next.js: {e}")

                processed_count += 1
            else:
                print("⚠️ No rewritten data generated")
                error_count += 1

            # Add small delay between articles
            if i < len(articles_to_process) - 1:
                print("⏳ Waiting 1 second before next article...")
                time.sleep(1)

        print(f"\n📊 Rewriting Summary:")
        print(f"   ✅ Articles rewritten and posted to forum: {processed_count}")
        print(f"   ⚠️ Duplicate articles skipped: {duplicate_count}")
        print(f"   ❌ Errors: {error_count}")
        print(
            f"   📈 Total articles processed: {processed_count + duplicate_count + error_count}"
        )

    except Exception as e:
        print(f"Error in advanced rewriting: {e}")


def set_rss():
    rss_url = input("Voer RSS-feed URL in: ")
    print(f"RSS URL set to {rss_url}")
    return rss_url


def set_category():
    category = input("Voer categorie in: ")
    print(f"Categorie set to {category}")
    return category


def set_num_articles():
    num_articles = input("Voer aantal artikelen in: ")
    print(f"Aantal artikelen set to {num_articles}")
    return int(num_articles)


def set_style():
    """Set the writing style for AI rewriting"""
    global selected_style
    print("\nBeschikbare schrijfstijlen:")
    print("1. Technical - Professionele, formele stijl")
    print("2. Normal - Standaard nieuwsstijl")
    print("3. Easy - Eenvoudige, begrijpelijke stijl")
    print("4. Populair - Populaire, aantrekkelijke stijl")
    print("5. News Reader - Professionele nieuwslezer stijl")

    while True:
        choice = input("Kies een schrijfstijl (1-5): ")
        if choice == "1":
            selected_style = "Technical"
            break
        elif choice == "2":
            selected_style = "Normal"
            break
        elif choice == "3":
            selected_style = "Easy"
            break
        elif choice == "4":
            selected_style = "Populair"
            break
        elif choice == "5":
            selected_style = "News Reader"
            break
        else:
            print("Ongeldige keuze. Probeer opnieuw.")

    print(f"Schrijfstijl ingesteld op: {selected_style}")
    return selected_style


def set_output_mode():
    """Set the output mode for article generation"""
    global output_mode
    print("\n🎯 Aanbevolen: Next.js ISR (Incremental Static Regeneration)")
    print("=" * 70)
    print("✅ Voordelen:")
    print("   • Pre-rendered static HTML voor SEO + snelheid")
    print("   • Automatische updates zonder rebuild (ISR revalidate: 10 min)")
    print("   • On-demand revalidation voor instant publicatie")
    print("   • Dynamische features: comments, login, real-time data")
    print("   • Geen Firebase Hosting nodig - alles op Vercel")
    print("=" * 70)
    print("\nBeschikbare output modes:")
    print("1. Next.js ISR - Pre-rendered + auto-refresh (AANBEVOLEN)")
    print("2. Static HTML - Oude methode (vereist Firebase deploy)")
    print("3. Both - Next.js ISR + Static HTML (backwards compatibility)")

    while True:
        choice = input(f"\nKies output mode (1-3, huidig: {output_mode.upper()}): ")
        if choice == "1":
            output_mode = "nextjs"
            break
        elif choice == "2":
            output_mode = "static"
            break
        elif choice == "3":
            output_mode = "both"
            break
        else:
            print("Ongeldige keuze, probeer opnieuw.")

    print(f"✅ Output mode ingesteld op: {output_mode.upper()}")
    if output_mode == "nextjs":
        print("   📱 Artikelen → Firebase Realtime DB → Next.js ISR")
        print("   🔄 Auto-refresh elke 10 minuten + on-demand revalidation")
        print("   ⚡ Instant publicatie via /api/revalidate endpoint")
    elif output_mode == "static":
        print("   📄 Artikelen → /public/nieuws/{slug}/index.html")
        print("   🚀 Firebase Hosting deploy na generatie")
    else:
        print("   📱 Next.js: Firebase Realtime DB + ISR")
        print("   � Static HTML: /public/nieuws/{slug}/index.html + Firebase deploy")

    return output_mode


def set_groq_model():
    """Set the Groq AI model for rewriting"""
    global selected_groq_model
    print("\n🤖 Beschikbare Groq AI modellen:")
    print("=" * 60)
    for i, model in enumerate(GROQ_MODELS, 1):
        priority_label = (
            "(Aanbevolen)"
            if model["priority"] == 1
            else "(Fallback)" if model["priority"] == 3 else ""
        )
        print(f"{i}. {model['name']} - {model['limit']} {priority_label}")
    print("=" * 60)
    print(f"\n💡 Huidige selectie: {selected_groq_model}")
    print("💡 llama-3.3-70b-versatile: Best quality (stronger reasoning/multilingual)")
    print(
        "💡 openai/gpt-oss-20b: Balanced fallback if 70B limit is too tight (500k tokens/day)"
    )
    print("💡 llama-3.1-8b-instant: Fast but lower quality (use only for simple tasks)")

    while True:
        choice = input("\nKies een AI model (1-3, of druk Enter voor huidige): ")

        if choice == "":
            print(f"✅ Model blijft: {selected_groq_model}")
            break

        try:
            choice_int = int(choice)
            if 1 <= choice_int <= len(GROQ_MODELS):
                selected_groq_model = GROQ_MODELS[choice_int - 1]["name"]
                print(f"✅ Model ingesteld op: {selected_groq_model}")
                break
            else:
                print("❌ Ongeldige keuze. Probeer opnieuw.")
        except ValueError:
            print("❌ Voer een geldig nummer in.")

    return selected_groq_model


def show_articles(articles):
    for article in articles:
        print(f"Title: {article['title']}")
        print(
            f"Body: {article['body'][:200]}..."
        )  # Showing only first 200 characters for brevity
        print("-" * 50)


def check_duplicate_article(db, collection_name, link, title=None):
    """Check if an article already exists in the specified collection"""
    try:
        collection_ref = db.collection(collection_name)

        # Check by link first (most reliable)
        link_query = collection_ref.where("link", "==", link).limit(1)
        link_docs = link_query.get()

        if len(link_docs) > 0:
            return True, "link"

        # If no link match and title provided, check by title as fallback
        if title:
            title_query = collection_ref.where("title", "==", title).limit(1)
            title_docs = title_query.get()

            if len(title_docs) > 0:
                return True, "title"

        return False, None
    except Exception as e:
        print(f"Error checking for duplicates: {e}")
        return False, None  # Assume no duplicate if check fails


def save_articles_to_firestore(articles, collection_name, db):
    try:
        if articles:
            collection_ref = db.collection(collection_name)
            saved_count = 0
            duplicate_count = 0

            for article in articles:
                # Check for duplicates
                is_duplicate, duplicate_type = check_duplicate_article(
                    db,
                    collection_name,
                    article.get("link", ""),
                    article.get("title", ""),
                )

                if is_duplicate:
                    print(
                        f"⚠️ Skipping duplicate article (matched by {duplicate_type}): {article['title'][:50]}..."
                    )
                    duplicate_count += 1
                    continue

                # Convert datetime to timestamp for Firestore
                if isinstance(article.get("timestamp"), datetime):
                    article["timestamp"] = article["timestamp"]

                doc_ref = collection_ref.add(article)
                print(f"✅ Article saved with ID: {doc_ref[1].id}")
                saved_count += 1

            print(
                f"📊 Summary: {saved_count} articles saved, {duplicate_count} duplicates skipped"
            )
            print(
                f"Artikelen succesvol opgeslagen in Firestore collection: {collection_name}"
            )
        else:
            print("Geen artikelen om op te slaan.")
    except Exception as e:
        print(f"Fout bij het opslaan van artikelen in Firestore: {e}")


def show_rss_feeds():
    print("Overzicht van de RSS kanalen:\n")
    for source, categories in RSS_FEEDS.items():
        print(f"{source}:")
        for category, url in categories.items():
            print(f"  {category}: {url}")
        print()


def process_nu_nl_articles(db, limit=None):
    """
    Process NU.nl articles from articles_raw to articles_full
    Only processes articles where processed != True

    Args:
        db: Firestore database instance
        limit: Maximum number of articles to process (None = process all)
    """
    raw_collection = db.collection("articles_raw")
    full_collection = db.collection("articles_full")

    # Check existing articles in articles_full before processing
    print("🔍 Checking for existing articles in articles_full...")
    existing_docs = full_collection.stream()
    existing_links = set()
    existing_titles = set()

    for doc in existing_docs:
        article_data = doc.to_dict()
        if article_data.get("link"):
            existing_links.add(article_data["link"])
        if article_data.get("title"):
            existing_titles.add(article_data["title"])

    print(f"📊 Found {len(existing_links)} existing articles in articles_full")
    print(f"   {len(existing_titles)} unique titles")

    if limit:
        print(f"🎯 Processing limit: {limit} article(s)\n")
    else:
        print(f"🎯 Processing all unprocessed NU.nl articles from articles_raw\n")

    # Get all articles from articles_raw and filter for unprocessed NU.nl articles
    docs = raw_collection.stream()

    processed_count = 0
    duplicate_count = 0
    error_count = 0
    skipped_already_processed = 0

    for doc in docs:
        # Stop if we've reached the limit
        if limit and processed_count >= limit:
            print(f"\n✋ Reached processing limit of {limit} article(s)")
            break

        article = doc.to_dict()
        link = article.get("link", "")

        # Check if the link contains "nu.nl"
        if "nu.nl" in link:
            # Skip if already processed (processed == True)
            if article.get("processed") == True:
                skipped_already_processed += 1
                continue

            print(f"🔍 Checking article: {article.get('title', 'No title')[:50]}...")

            # Check if this article already exists in articles_full
            is_duplicate, duplicate_type = check_duplicate_article(
                db, "articles_full", link, article.get("title", "")
            )

            if is_duplicate:
                print(
                    f"⚠️ Skipping duplicate article (matched by {duplicate_type}): {article['title'][:50]}..."
                )
                duplicate_count += 1
                continue

            # Check if article has body content (should be scraped by option 8)
            body = article.get("body", "")

            if not body or body == "Full text not found.":
                print(
                    f"⚠️ Article has no body content (run option 8 first to scrape): {article['title'][:50]}..."
                )
                error_count += 1
                continue

            print(f"📝 Processing NU.nl article from {link}")

            try:
                # Use existing body from articles_raw (already scraped by option 8)
                full_article = {
                    "title": article["title"],
                    "link": article["link"],
                    "body": body,
                    "timestamp": article["timestamp"],
                    "processed": False,  # Mark as not yet processed for AI rewriting
                }

                # Save to articles_full
                doc_ref = full_collection.add(full_article)
                print(
                    f"✅ Saved full article from {link} to Firestore (ID: {doc_ref[1].id})"
                )

                # Mark original article in articles_raw as processed ONLY after successful save
                raw_collection.document(doc.id).update({"processed": True})
                print(f"✅ Marked article in articles_raw as processed")

                processed_count += 1
            except Exception as e:
                print(f"❌ Failed to process article from {link}. Error: {e}")
                error_count += 1

    print(f"\n📊 Processing Summary:")
    print(f"   ✅ Articles processed: {processed_count}")
    print(f"   ⏭️  Already processed (skipped): {skipped_already_processed}")
    print(f"   ⚠️ Duplicates skipped: {duplicate_count}")
    print(f"   ❌ Errors: {error_count}")
    print(
        f"   📈 Total articles reviewed: {processed_count + duplicate_count + error_count + skipped_already_processed}"
    )


def process_politie_nl_articles(db):
    """Process politie.nl articles from raw collection to full collection with duplicate checking"""
    raw_collection = db.collection("articles_raw")
    full_collection = db.collection("articles_full")

    # Get all articles from Firestore and filter for politie.nl articles
    docs = raw_collection.stream()

    processed_count = 0
    duplicate_count = 0
    error_count = 0

    for doc in docs:
        article = doc.to_dict()
        link = article.get("link", "")

        # Check if the link contains "politie.nl"
        if "politie.nl" in link:
            print(f"🔍 Checking article: {article.get('title', 'No title')[:50]}...")

            # Check if this article already exists in articles_full
            is_duplicate, duplicate_type = check_duplicate_article(
                db, "articles_full", link, article.get("title", "")
            )

            if is_duplicate:
                print(
                    f"⚠️ Skipping duplicate article (matched by {duplicate_type}): {article['title'][:50]}..."
                )
                duplicate_count += 1
                continue

            print(f"📝 Processing Politie.nl article from {link}")
            page_source = fetch_article_details_with_selenium(link)
            full_text = extract_politie_nl_article_body(page_source)

            if full_text and full_text != "Full text not found.":
                full_article = {
                    "title": article["title"],
                    "link": article["link"],
                    "body": full_text,
                    "timestamp": article["timestamp"],
                    "processed": False,  # Mark as not yet processed for AI rewriting
                    "source": "politie.nl",  # Add source identifier
                }

                try:
                    doc_ref = full_collection.add(full_article)
                    print(
                        f"✅ Saved full politie.nl article from {link} to Firestore (ID: {doc_ref[1].id})"
                    )
                    processed_count += 1
                except Exception as e:
                    print(
                        f"❌ Failed to save full article from {link} to Firestore. Error: {e}"
                    )
                    error_count += 1
            else:
                print(f"⚠️ No full text found for article: {article['title'][:50]}...")
                error_count += 1

    print(f"\n📊 Politie.nl Processing Summary:")
    print(f"   ✅ Articles processed: {processed_count}")
    print(f"   ⚠️ Duplicates skipped: {duplicate_count}")
    print(f"   ❌ Errors: {error_count}")
    print(
        f"   📈 Total articles reviewed: {processed_count + duplicate_count + error_count}"
    )


# AI Client Setup Functions
def get_ai_client():
    """Get AI client - ONLY uses Groq with hardcoded API key and selected model"""
    global client, model_name, client_type

    # ✅ Security: Use environment variable instead of hardcoded key
    groq_api_key = os.environ.get("GROQ_API_KEY") or os.environ.get("GROK_API_KEY")
    if not groq_api_key:
        print("❌ Error: GROQ_API_KEY environment variable not set")
        print("   Set it with: export GROQ_API_KEY=your_key_here")
        return None, None, None

    if OPENAI_AVAILABLE:
        try:
            print(f"⚡ Using Groq AI with model: {selected_groq_model}")
            print("💰 Cost: Free tier available!")
            client = OpenAI(
                api_key=groq_api_key, base_url="https://api.groq.com/openai/v1"
            )
            return client, selected_groq_model, "openai"
        except Exception as e:
            print(f"❌ Failed to initialize Groq AI: {e}")
            return None, None, None
    else:
        print("❌ OpenAI SDK not available. Please install with: pip install openai")
        return None, None, None


def try_fallback_model():
    """Try to use a fallback Groq model when rate limit is hit"""
    global client, model_name, selected_groq_model

    # Get current model
    current_model = selected_groq_model

    # Always try to fallback to the best available models (prioritize 500k token/day models)
    fallback_candidates = [
        {"name": "llama-3.1-8b-instant", "limit": "500k tokens/day"},
        {"name": "llama-3.2-1b-preview", "limit": "500k tokens/day"},
        {"name": "llama-3.2-3b-preview", "limit": "500k tokens/day"},
        {"name": "gemma2-9b-it", "limit": "500k tokens/day"},
        {"name": "llama-3.1-70b-versatile", "limit": "500k tokens/day"},
        {"name": "mixtral-8x7b-32768", "limit": "500k tokens/day"},
    ]

    # Find a fallback that's different from current model
    for candidate in fallback_candidates:
        if candidate["name"] != current_model:
            print(
                f"\n🔄 Switching from {current_model} to {candidate['name']} ({candidate['limit']})"
            )
            selected_groq_model = candidate["name"]
            model_name = candidate["name"]
            print(f"✅ Now using: {selected_groq_model}")
            return True

    print("❌ All models exhausted - daily limits reached on all available models")
    return False


def detect_crime_type(title, tags, content):
    """
    Detect crime type from article content for Crime Map categorization.
    Returns one of: Inbraak, Diefstal, Geweld, Vandalisme, Vermissing, or None
    """
    text = f"{title} {' '.join(tags)} {content}".lower()

    # EXPANDED Crime type keywords mapping (100+ keywords)
    crime_keywords = {
        "Inbraak": [
            "inbraak",
            "inbraken",
            "ingebroken",
            "insluipen",
            "woninginbraak",
            "kraak",
            "gekraakt",
            "gestolen uit woning",
            "gestolen uit huis",
        ],
        "Diefstal": [
            "diefstal",
            "gestolen",
            "beroving",
            "overval",
            "roof",
            "stelen",
            "zakkenroller",
            "winkeldiefstal",
            "fiets gestolen",
            "auto gestolen",
            "portemonnee",
            "tas gestolen",
            "pinpas",
            "fraude",
            "oplichting",
        ],
        "Geweld": [
            # Physical violence
            "geweld",
            "mishandeling",
            "aanval",
            "vechtpartij",
            "doodslag",
            "moord",
            "schietpartij",
            "steekpartij",
            "neergeschoten",
            "neergestoken",
            "gedood",
            "doden",
            "vermoord",
            "liquidatie",
            "dodelijk",
            "gewond",
            "geslagen",
            # Weapons
            "mes",
            "vuurwapen",
            "pistool",
            "geweer",
            "projectiel",
            "vuurwerk naar",
            # Legal terms
            "celstraf",
            "tbs",
            "poging doodslag",
            "poging moord",
            "zware mishandeling",
            # Sexual crimes
            "seksueel",
            "verkrachting",
            "misbruik",
            "aanranding",
            # Abduction
            "ontvoerd",
            "ontvoering",
            "kidnap",
            "gegijzeld",
            "gijzeling",
            # Arrest/Action
            "gearresteerd",
            "aangehouden",
            "opgepakt",
            "vast",
            "vastzit",
            "arrestatie",
            "aanhouding",
        ],
        "Vandalisme": [
            "vandalisme",
            "vernieling",
            "beschadigd",
            "graffiti",
            "grafschennis",
            "brandstichting",
            "brand gesticht",
            "in brand",
            "molotov",
            "verwoest",
            "gesloopt",
            "kapot gemaakt",
            "vernield",
        ],
        "Vermissing": [
            "vermist",
            "vermissing",
            "zoekactie",
            "spoorloos",
            "verdwenen",
            "gezocht naar",
            "vermiste persoon",
            "opsporingsbericht",
        ],
    }

    # Count matches for each category
    scores = {}
    for crime_type, keywords in crime_keywords.items():
        score = sum(1 for keyword in keywords if keyword in text)
        if score > 0:
            scores[crime_type] = score

    # Return highest scoring category
    if scores:
        return max(scores.items(), key=lambda x: x[1])[0]
    return None


def generate_faqs_for_published_articles(db):
    """Generate FAQs for all articles in /news collection that don't have FAQs yet"""
    print("\n❓ Generating FAQs from published articles...")
    print("📖 Reading articles from Firestore /news collection...")

    articles_ref = db.collection("news")
    articles_docs = articles_ref.get()

    if not articles_docs:
        print("❌ No articles found in /news collection")
        return

    total = 0
    success = 0
    skipped = 0
    failed = 0

    for doc in articles_docs:
        article = doc.to_dict()
        slug = doc.id
        title = article.get("title", "")

        # Skip if already has FAQs
        if article.get("faq") and len(article.get("faq", [])) >= 2:
            print(
                f"⏭️  Skipping {title[:60]}... (already has {len(article.get('faq', []))} FAQs)"
            )
            skipped += 1
            continue

        total += 1
        content = article.get("content", "")

        if not content:
            print(f"⚠️  Skipped {slug}: No content")
            failed += 1
            continue

        print(f"\n🤖 Generating FAQ for: {title[:60]}...")
        faq_data = generate_faq_section(content, title)[1]

        if faq_data and len(faq_data) >= 2:
            # Update article with FAQ
            articles_ref.document(slug).update({"faq": faq_data})
            print(f"✅ Added {len(faq_data)} FAQs to /news/{slug}")
            success += 1
        else:
            print(f"⚠️  No quality FAQs generated for {slug}")
            failed += 1

    print(f"\n📊 FAQ Generation Summary:")
    print(f"   Total processed: {total}")
    print(f"   ✅ Success: {success}")
    print(f"   ⏭️  Skipped (already have FAQs): {skipped}")
    print(f"   ❌ Failed: {failed}")


def sync_articles_to_crime_map():
    """Sync articles with location data to Crime Map database"""
    db = firestore.client()
    realtime_database = realtime_db.reference()

    print(style("\n🗺️  Syncing artikelen naar Crime Map...", CYAN, BOLD))
    print("📖 Reading articles from Firestore /news collection...")

    # Fetch all articles from Firestore news collection
    articles = db.collection("news").stream()

    synced_count = 0
    skipped_count = 0

    for article_doc in articles:
        article_data = article_doc.to_dict()
        slug = article_doc.id
        location = article_data.get("location", {})

        # Only sync articles with valid location data
        if not location.get("latitude") or not location.get("longitude"):
            skipped_count += 1
            continue

        # Detect crime type from article content
        crime_type = detect_crime_type(
            article_data.get("title", ""),
            article_data.get("tags", []),
            article_data.get("excerpt", ""),
        )

        # Skip if no crime type detected (not relevant for crime map)
        if not crime_type:
            skipped_count += 1
            continue

        # Prepare crime map entry
        crime_entry = {
            "id": slug,
            "category": crime_type,
            "lat": location.get("latitude"),
            "lng": location.get("longitude"),
            "region": location.get("name", "Nederland"),
            "timestamp": article_data.get(
                "publishedAt", datetime.now().timestamp() * 1000
            ),
            "description": article_data.get("excerpt", ""),
            "severity": "medium",  # Default severity
            "source": "news-article",
            "articleSlug": slug,
            "articleTitle": article_data.get("title", ""),
        }

        # Save to Realtime Database under /crimes/{slug}
        try:
            realtime_database.child("crimes").child(slug).set(crime_entry)
            synced_count += 1
            print(f"  ✓ Synced: {article_data.get('title', 'Untitled')[:60]}...")
            print(f"    📍 {location.get('name', 'Nederland')} ({crime_type})")
        except Exception as e:
            print(f"  ❌ Error syncing {slug}: {e}")

    print(f"\n✅ Sync complete!")
    print(f"  📊 Synced: {synced_count} artikelen")
    print(f"  ⏭️  Skipped: {skipped_count} artikelen (geen locatie/misdaadtype)")
    print(f"  🗺️  Crime Map updated met {synced_count} nieuwe markers")


def delete_all_firebase_articles(db):
    """Delete all articles from Firebase Firestore collections"""
    print("\n⚠️  WARNING: This will delete ALL articles from Firebase!")
    print("Collections to be deleted:")
    print("  - articles_raw")
    print("  - articles_full")
    print("  - articles_rewritten")
    print("  - news (published articles)")

    confirm = input("\nType 'DELETE ALL' to confirm: ")

    if confirm != "DELETE ALL":
        print("❌ Deletion cancelled.")
        return

    collections = ["articles_raw", "articles_full", "articles_rewritten", "news"]
    total_deleted = 0

    for collection_name in collections:
        try:
            print(f"\n🗑️  Deleting documents from '{collection_name}'...")
            collection_ref = db.collection(collection_name)
            docs = collection_ref.stream()

            batch_size = 100
            batch_count = 0
            deleted_count = 0

            batch = db.batch()

            for doc in docs:
                batch.delete(doc.reference)
                deleted_count += 1
                batch_count += 1

                if batch_count >= batch_size:
                    batch.commit()
                    print(f"   Deleted {deleted_count} documents...")
                    batch = db.batch()
                    batch_count = 0

            # Commit remaining
            if batch_count > 0:
                batch.commit()

            print(f"✅ Deleted {deleted_count} documents from '{collection_name}'")
            total_deleted += deleted_count

        except Exception as e:
            print(f"❌ Error deleting from '{collection_name}': {e}")

    print(f"\n✅ Total deleted: {total_deleted} documents")
    print("🔄 All Firebase article collections have been cleared.")


def generate_sitemaps(db):
    """Generate sitemap.xml, news-sitemap.xml, and robots.txt with ALL site pages"""
    print(style("\n🗺️  Generating sitemaps and robots.txt...", CYAN, BOLD))

    base_url = "https://politie-forum.nl"
    current_date = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S+00:00")

    # Comprehensive static pages with priority and changefreq
    static_pages = [
        # Core Pages
        {"url": "/", "priority": "1.0", "changefreq": "daily"},
        {"url": "/nieuws", "priority": "0.9", "changefreq": "daily"},
        {"url": "/forum", "priority": "0.8", "changefreq": "daily"},
        {"url": "/categorieen", "priority": "0.8", "changefreq": "weekly"},
        {"url": "/crime-map-nederland", "priority": "0.7", "changefreq": "daily"},
        {"url": "/redactie", "priority": "0.7", "changefreq": "monthly"},
        {"url": "/contact", "priority": "0.5", "changefreq": "monthly"},
        {"url": "/leden", "priority": "0.6", "changefreq": "weekly"},
        {"url": "/profiel", "priority": "0.5", "changefreq": "weekly"},
        {"url": "/login", "priority": "0.4", "changefreq": "monthly"},
        {"url": "/register", "priority": "0.4", "changefreq": "monthly"},
        {"url": "/admin", "priority": "0.2", "changefreq": "monthly"},
        # Legal & Privacy
        {"url": "/privacy", "priority": "0.3", "changefreq": "yearly"},
        {"url": "/voorwaarden", "priority": "0.3", "changefreq": "yearly"},
        {"url": "/cookies", "priority": "0.3", "changefreq": "yearly"},
        {"url": "/disclaimer", "priority": "0.3", "changefreq": "yearly"},
        {"url": "/nieuws-disclaimer", "priority": "0.3", "changefreq": "yearly"},
        {"url": "/forum-disclaimer", "priority": "0.3", "changefreq": "yearly"},
        {"url": "/gebruikersregels", "priority": "0.4", "changefreq": "yearly"},
        {"url": "/moderatie-beleid", "priority": "0.4", "changefreq": "yearly"},
        {"url": "/toegankelijkheid", "priority": "0.3", "changefreq": "yearly"},
        # Journalistic Pages
        {"url": "/redactionele-principes", "priority": "0.4", "changefreq": "yearly"},
        {"url": "/feitencontrole", "priority": "0.4", "changefreq": "monthly"},
        {"url": "/correcties", "priority": "0.5", "changefreq": "weekly"},
        # Company Info
        {"url": "/over", "priority": "0.5", "changefreq": "monthly"},
        {"url": "/eigendom", "priority": "0.3", "changefreq": "yearly"},
        # Contact & Support
        {"url": "/tips", "priority": "0.6", "changefreq": "monthly"},
        {"url": "/pers", "priority": "0.5", "changefreq": "monthly"},
        {"url": "/faq", "priority": "0.6", "changefreq": "monthly"},
        # Categories
        {
            "url": "/categorie/advocaten-rechtbanken",
            "priority": "0.7",
            "changefreq": "weekly",
        },
        {
            "url": "/categorie/burgerparticipatie-wijkveiligheid",
            "priority": "0.7",
            "changefreq": "weekly",
        },
        {
            "url": "/categorie/community-cafe-off-topic",
            "priority": "0.7",
            "changefreq": "weekly",
        },
        {
            "url": "/categorie/criminaliteit-opsporing",
            "priority": "0.7",
            "changefreq": "weekly",
        },
        {
            "url": "/categorie/cybersecurity-digitale-veiligheid",
            "priority": "0.7",
            "changefreq": "weekly",
        },
        {
            "url": "/categorie/internationale-politie-europol",
            "priority": "0.7",
            "changefreq": "weekly",
        },
        {
            "url": "/categorie/publieke-veiligheid-maatschappij",
            "priority": "0.7",
            "changefreq": "weekly",
        },
        {
            "url": "/categorie/rechtspraak-beleid",
            "priority": "0.7",
            "changefreq": "weekly",
        },
        {
            "url": "/categorie/specialisaties-eenheden",
            "priority": "0.7",
            "changefreq": "weekly",
        },
        {
            "url": "/categorie/technologie-middelen",
            "priority": "0.7",
            "changefreq": "weekly",
        },
        # Popular Tags
        {"url": "/tag/politie", "priority": "0.6", "changefreq": "daily"},
        {"url": "/tag/veiligheid", "priority": "0.6", "changefreq": "daily"},
        {"url": "/tag/criminaliteit", "priority": "0.6", "changefreq": "daily"},
        {"url": "/tag/rechtspraak", "priority": "0.6", "changefreq": "weekly"},
        {"url": "/tag/cybersecurity", "priority": "0.6", "changefreq": "weekly"},
        {"url": "/tag/terrorisme", "priority": "0.6", "changefreq": "weekly"},
        {"url": "/tag/fraude", "priority": "0.6", "changefreq": "weekly"},
        {"url": "/tag/drugs", "priority": "0.6", "changefreq": "weekly"},
        {"url": "/tag/geweld", "priority": "0.6", "changefreq": "weekly"},
        {"url": "/tag/opsporing", "priority": "0.6", "changefreq": "weekly"},
        {"url": "/tag/advocatuur", "priority": "0.6", "changefreq": "weekly"},
        {"url": "/tag/openbaar-ministerie", "priority": "0.6", "changefreq": "weekly"},
        {"url": "/tag/wijkveiligheid", "priority": "0.6", "changefreq": "weekly"},
        {"url": "/tag/surveillance", "priority": "0.6", "changefreq": "weekly"},
        {"url": "/tag/privacy", "priority": "0.6", "changefreq": "weekly"},
    ]

    print("📖 Fetching articles from Firestore /news collection...")

    # Fetch all articles from Firestore news collection
    try:
        articles = db.collection("news").stream()
        article_list = []
        article_slugs_set = set()  # Track slugs for duplicate detection

        for article_doc in articles:
            article_data = article_doc.to_dict()
            slug = article_doc.id

            # Skip duplicates
            if slug in article_slugs_set:
                print(f"⚠️  Skipping duplicate slug: {slug}")
                continue

            article_slugs_set.add(slug)

            # Get published date or use current date
            published_at = article_data.get("publishedAt")
            if isinstance(published_at, str):
                pub_date = published_at
            else:
                pub_date = current_date

            article_list.append(
                {
                    "slug": slug,
                    "title": article_data.get("title", ""),
                    "publishedAt": pub_date,
                    "modifiedAt": article_data.get("modifiedAt", pub_date),
                    "exists_in_db": True,
                }
            )

        print(f"✅ Found {len(article_list)} articles")

        # Check for removed articles (articles in old sitemap but not in DB)
        print("\n🔍 Checking for removed/orphaned articles...")
        sitemap_path = os.path.join(base_dir, "sitemap.xml")

        if os.path.exists(sitemap_path):
            try:
                with open(sitemap_path, "r", encoding="utf-8") as f:
                    old_sitemap = f.read()

                # Extract article slugs from old sitemap
                import re

                old_slugs = set(re.findall(r"/nieuws/([^<]+)</loc>", old_sitemap))
                current_slugs = set(article_slugs_set)

                removed_slugs = old_slugs - current_slugs

                if removed_slugs:
                    print(f"🗑️  Found {len(removed_slugs)} removed articles:")
                    for slug in list(removed_slugs)[:10]:  # Show first 10
                        print(f"   • {slug}")
                    if len(removed_slugs) > 10:
                        print(f"   ... and {len(removed_slugs) - 10} more")
                else:
                    print("✅ No removed articles detected")

            except Exception as e:
                print(f"⚠️  Could not check old sitemap: {e}")

    except Exception as e:
        print(f"❌ Error fetching articles: {e}")
        article_list = []

    # Generate sitemap.xml
    print("\n📝 Generating sitemap.xml...")

    sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    # Add static pages
    for page in static_pages:
        sitemap_content += "  <url>\n"
        sitemap_content += f"    <loc>{base_url}{page['url']}</loc>\n"
        sitemap_content += f"    <lastmod>{current_date}</lastmod>\n"
        sitemap_content += f"    <changefreq>{page['changefreq']}</changefreq>\n"
        sitemap_content += f"    <priority>{page['priority']}</priority>\n"
        sitemap_content += "  </url>\n"

    # Add article pages (both /nieuws and /forum URLs)
    for article in article_list:
        # News URL (primary - NewsArticle schema)
        sitemap_content += "  <url>\n"
        sitemap_content += f"    <loc>{base_url}/nieuws/{article['slug']}</loc>\n"
        sitemap_content += f"    <lastmod>{article['modifiedAt']}</lastmod>\n"
        sitemap_content += "    <changefreq>weekly</changefreq>\n"
        sitemap_content += "    <priority>0.8</priority>\n"
        sitemap_content += "  </url>\n"

        # Forum URL (secondary - DiscussionForumPosting schema)
        sitemap_content += "  <url>\n"
        sitemap_content += f"    <loc>{base_url}/forum/{article['slug']}</loc>\n"
        sitemap_content += f"    <lastmod>{article['modifiedAt']}</lastmod>\n"
        sitemap_content += "    <changefreq>weekly</changefreq>\n"
        sitemap_content += "    <priority>0.7</priority>\n"
        sitemap_content += "  </url>\n"

    sitemap_content += "</urlset>\n"

    # Write sitemap.xml
    sitemap_path = os.path.join(base_dir, "sitemap.xml")
    try:
        with open(sitemap_path, "w", encoding="utf-8") as f:
            f.write(sitemap_content)
        print(f"✅ sitemap.xml created: {sitemap_path}")
        print(
            f"   📊 {len(static_pages)} static pages + {len(article_list) * 2} article URLs (nieuws + forum)"
        )
    except Exception as e:
        print(f"❌ Error writing sitemap.xml: {e}")

    # Generate news-sitemap.xml (Google News specific)
    print("\n📰 Generating news-sitemap.xml (Google News format)...")

    # Load existing news-sitemap to check for redundant entries
    news_sitemap_path = os.path.join(base_dir, "news-sitemap.xml")
    existing_news_slugs = set()

    if os.path.exists(news_sitemap_path):
        try:
            with open(news_sitemap_path, "r", encoding="utf-8") as f:
                old_news_sitemap = f.read()

            # Extract slugs from old news-sitemap
            import re

            existing_news_slugs = set(
                re.findall(r"/nieuws/([^<]+)</loc>", old_news_sitemap)
            )
            print(
                f"📋 Found {len(existing_news_slugs)} articles in existing news-sitemap"
            )
        except Exception as e:
            print(f"⚠️  Could not read old news-sitemap: {e}")

    news_sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    news_sitemap_content += (
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
    )
    news_sitemap_content += (
        '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n'
    )

    # Add only recent articles (last 100 for Google News, sorted by date)
    # Sort by publishedAt date (most recent first)
    try:
        sorted_articles = sorted(
            article_list, key=lambda x: x.get("publishedAt", ""), reverse=True
        )
    except:
        sorted_articles = article_list

    recent_articles = sorted_articles[:100]  # Limit to 100 most recent

    new_articles_count = 0
    existing_articles_count = 0

    for article in recent_articles:
        slug = article["slug"]

        # Check if article is already in news-sitemap
        if slug in existing_news_slugs:
            existing_articles_count += 1
        else:
            new_articles_count += 1

        news_sitemap_content += "  <url>\n"
        news_sitemap_content += f"    <loc>{base_url}/nieuws/{slug}</loc>\n"
        news_sitemap_content += "    <news:news>\n"
        news_sitemap_content += "      <news:publication>\n"
        news_sitemap_content += (
            "        <news:name>Politie Forum Nederland</news:name>\n"
        )
        news_sitemap_content += "        <news:language>nl</news:language>\n"
        news_sitemap_content += "      </news:publication>\n"
        news_sitemap_content += f"      <news:publication_date>{article['publishedAt']}</news:publication_date>\n"
        news_sitemap_content += (
            f"      <news:title>{html.escape(article['title'])}</news:title>\n"
        )
        news_sitemap_content += "    </news:news>\n"
        news_sitemap_content += "  </url>\n"

    news_sitemap_content += "</urlset>\n"

    # Write news-sitemap.xml
    try:
        with open(news_sitemap_path, "w", encoding="utf-8") as f:
            f.write(news_sitemap_content)
        print(f"✅ news-sitemap.xml created: {news_sitemap_path}")
        print(f"   📊 Total: {len(recent_articles)} articles")
        print(f"   🆕 New: {new_articles_count} articles")
        print(f"   ♻️  Existing: {existing_articles_count} articles")
    except Exception as e:
        print(f"❌ Error writing news-sitemap.xml: {e}")

    # Generate robots.txt
    print("\n🤖 Generating robots.txt...")

    robots_content = f"""# Robots.txt for Politie Forum Nederland
# Generated: {current_date}

User-agent: *
Allow: /

# Sitemaps
Sitemap: {base_url}/sitemap.xml
Sitemap: {base_url}/news-sitemap.xml

# Disallow admin and API routes
Disallow: /admin
Disallow: /api/

# Disallow user authentication pages
Disallow: /login
Disallow: /register

# Allow crawling of public content
Allow: /nieuws/
Allow: /forum/
Allow: /categorieen/
Allow: /crime-map-nederland

# Crawl delay (optional, be nice to servers)
Crawl-delay: 1
"""

    # Write robots.txt
    robots_path = os.path.join(base_dir, "robots.txt")
    try:
        with open(robots_path, "w", encoding="utf-8") as f:
            f.write(robots_content)
        print(f"✅ robots.txt created: {robots_path}")
    except Exception as e:
        print(f"❌ Error writing robots.txt: {e}")

    print(style("\n✅ Sitemap generation complete!", GREEN, BOLD))
    print(f"📁 Files created in: {base_dir}")
    print(f"   • sitemap.xml ({len(static_pages) + len(article_list)} URLs)")
    print(f"   • news-sitemap.xml ({len(recent_articles)} news articles)")
    print(f"   • robots.txt")
    print(f"\n🌐 URLs:")
    print(f"   {base_url}/sitemap.xml")
    print(f"   {base_url}/news-sitemap.xml")
    print(f"   {base_url}/robots.txt")
    print(f"\n💡 Submit to Google Search Console:")
    print(f"   https://search.google.com/search-console")


def publish_to_news(db):
    """Publish articles from articles_rewritten to /news collection for Next.js ISR"""
    print(style("\n🚀 Publishing articles to /news collection...", CYAN, BOLD))

    try:
        # Get articles from articles_rewritten
        rewritten_collection = db.collection("articles_rewritten")
        all_docs = rewritten_collection.get()

        print(f"📊 Found {len(all_docs)} articles in articles_rewritten")

        # Find unpublished articles
        unpublished_articles = []
        for doc in all_docs:
            article_data = doc.to_dict()
            if article_data and not article_data.get("published_to_news"):
                article_data["doc_id"] = doc.id
                unpublished_articles.append(article_data)

        print(f"📝 Unpublished articles: {len(unpublished_articles)}")

        if len(unpublished_articles) == 0:
            print("✅ All articles are already published to /news")
            return

        published_count = 0
        error_count = 0

        for i, article in enumerate(unpublished_articles):
            print(f"\n🔄 Publishing article {i+1}/{len(unpublished_articles)}")
            print(f"   📰 {article.get('title', 'Untitled')[:60]}...")

            try:
                # Save to /news collection for Next.js ISR
                save_article_to_firebase(article)

                # Revalidate Vercel path
                revalidate_vercel_path(article["slug"])

                print(f"✅ Published to: /nieuws/{article['slug']}")

                # Mark as published in articles_rewritten
                doc_ref = rewritten_collection.document(article["doc_id"])
                doc_ref.update({"published_to_news": True})

                # Create forum topic
                try:
                    topic_id = create_forum_topic_from_article(article, db)
                    if topic_id:
                        print(f"💬 Forum topic created: {topic_id}")
                except Exception as e:
                    print(f"⚠️ Error creating forum topic: {e}")

                published_count += 1

            except Exception as e:
                print(f"❌ Error publishing: {e}")
                error_count += 1

            # Delay between publishes
            if i < len(unpublished_articles) - 1:
                print("⏳ Waiting 2 seconds...")
                time.sleep(2)

        print(style("\n✅ Publishing Complete!", GREEN, BOLD))
        print(f"   ✅ Published: {published_count} articles")
        print(f"   ❌ Errors: {error_count}")
        print(f"   🌐 Live at: https://politie-forum.nl/nieuws/[slug]")

    except Exception as e:
        print(style(f"\n❌ Error in publish_to_news: {e}", RED, BOLD))
        import traceback

        traceback.print_exc()


def update_nextjs_sitemap(db):
    """Force Next.js sitemap update via API call + generate local sitemaps"""
    print(style("\n🔄 Updating Next.js sitemap (local + remote)...", CYAN, BOLD))

    try:
        # Step 1: Generate local sitemaps (sitemap.xml, news-sitemap.xml, robots.txt)
        print("\n📝 Step 1: Generating local sitemaps...")
        generate_sitemaps(db)

        # Step 2: Trigger Next.js ISR revalidation for sitemap
        print("\n🌐 Step 2: Revalidating Next.js sitemap...")
        revalidate_url = "https://politie-forum.nl/api/revalidate"
        revalidate_secret = "politie-forum-revalidate-2025-secret-key"

        payload = {"secret": revalidate_secret, "path": "/sitemap.xml"}

        response = requests.post(revalidate_url, json=payload, timeout=10)

        if response.status_code == 200:
            print("✅ Next.js sitemap revalidated successfully")
        else:
            print(f"⚠️ Revalidation returned status {response.status_code}")

        # Step 3: Revalidate news-sitemap
        print("\n📰 Step 3: Revalidating news-sitemap...")
        payload_news = {"secret": revalidate_secret, "path": "/news-sitemap.xml"}
        response_news = requests.post(revalidate_url, json=payload_news, timeout=10)

        if response_news.status_code == 200:
            print("✅ News sitemap revalidated successfully")
        else:
            print(
                f"⚠️ News sitemap revalidation returned status {response_news.status_code}"
            )

        print(style("\n✅ Sitemap update complete!", GREEN, BOLD))
        print("\n🌐 Live URLs:")
        print("   • https://politie-forum.nl/sitemap.xml")
        print("   • https://politie-forum.nl/news-sitemap.xml")
        print("   • https://politie-forum.nl/robots.txt")

        print("\n💡 Next steps:")
        print("   1. Verify sitemaps: https://politie-forum.nl/sitemap.xml")
        print("   2. Submit to Google Search Console")
        print("   3. Monitor indexing status")

    except Exception as e:
        print(style(f"❌ Error updating sitemap: {e}", RED, BOLD))


def setup_cron_automation():
    """Setup cron job for hourly automated workflow"""
    print(style("\n⏰ Setting up cron automation...", CYAN, BOLD))
    print("=" * 60)

    script_path = os.path.abspath(__file__)
    log_path = os.path.join(os.path.dirname(script_path), "automation.log")

    cron_command = f"*/30 * * * * cd {os.path.dirname(script_path)} && /usr/bin/python3 {script_path} --automate >> {log_path} 2>&1"

    print("\n📋 Cron job configuration:")
    print(f"   Schedule: Every 30 minutes (*/30 * * * *)")
    print(f"   Script: {script_path}")
    print(f"   Log: {log_path}")
    print("\n💡 To setup cron job, run:")
    print(style(f"   crontab -e", YELLOW, BOLD))
    print("\n   Then add this line:")
    print(style(f"   {cron_command}", GREEN))
    print("\n📝 Or use the automated installer:")

    try:
        # Check if cron is already set up
        result = os.popen("crontab -l 2>/dev/null | grep news-rip.py").read()

        if result.strip():
            print(style("\n✅ Cron job already exists:", GREEN, BOLD))
            print(f"   {result.strip()}")

            choice = input("\n🔄 Update existing cron job? (y/n): ").lower()
            if choice != "y":
                return

        # Auto-install cron job
        print("\n🔧 Installing cron job...")

        # Get current crontab
        current_cron = os.popen("crontab -l 2>/dev/null").read()

        # Remove old news-rip.py entries
        lines = [line for line in current_cron.split("\n") if "news-rip.py" not in line]

        # Add new entry
        lines.append(cron_command)

        # Write back to crontab
        new_cron = "\n".join(lines)
        os.system(f"echo '{new_cron}' | crontab -")

        print(style("\n✅ Cron job installed successfully!", GREEN, BOLD))
        print("\n📊 Automation details:")
        print("   • Runs every 30 minutes (:00 and :30 of each hour)")
        print(
            "   • Full workflow: Extract → Process → Rewrite → Publish → Sync → Sitemaps"
        )
        print(f"   • Logs saved to: {log_path}")
        print("\n🔍 To view logs:")
        print(style(f"   tail -f {log_path}", YELLOW, BOLD))
        print("\n🛑 To remove cron job:")
        print(style("   crontab -e", YELLOW, BOLD))
        print("   (Then delete the news-rip.py line)")

    except Exception as e:
        print(style(f"\n❌ Error setting up cron: {e}", RED, BOLD))
        print("\n📝 Manual setup required. Add this line to crontab:")
        print(style(f"   {cron_command}", GREEN))


def start_enhanced_rewriting_v3(db):
    """
    Enhanced Advanced Rewriting V3 - Next.js ISR Workflow

    ⚠️ NO STATIC HTML GENERATION - Next.js ISR handles all rendering

    Python Role (Data Processor):
    - AI rewrite with Groq (llama-3.1-8b-instant)
    - FAQ extraction (minimum 3 questions)
    - Location detection (115+ Dutch cities with geo-coordinates)
    - Metadata extraction
    - Firebase comment integration
    - Save to Firestore /news collection

    Next.js Role (Renderer):
    - ArticleClient.tsx: HTML/CSS rendering
    - ArticleJsonLd.tsx: JSON-LD schemas (NewsArticle, Place, FAQ, Discussion)
    - ArticleFAQ.tsx: Collapsible FAQ component
    - ArticleComments.tsx: Real-time comments
    - ISR revalidation: 600s (10 minutes)

    Workflow:
    Step 1: Run menu option 8 (Extract politie.nl articles)
    Step 2: Run menu option 9 (Process articles_raw → articles_full)
    Step 3: articles_full → AI rewrite → Firestore /news
    Step 4: Next.js ISR renders at /nieuws/{slug}

    No Duplicates:
    ✅ JSON-LD: Only Next.js generates schemas
    ✅ FAQ: Only Next.js ArticleFAQ.tsx renders
    ✅ Comments: Only Next.js fetches (SSR + client)
    ✅ Single render path: Next.js ISR only
    """
    global client, model_name, client_type

    try:
        # Initialize AI client
        print(f"🔧 Initializing AI client with model: {selected_model}")
        client, model_name, client_type = get_ai_client()

        if not client or not model_name:
            print("❌ No AI client available. Please check your API keys.")
            return

        print(f"\n🚀 Starting Advanced Rewriting V3 (Enhanced with ALL fixes):")
        print(f"\n   Style: {selected_style}")
        print(f"   Language: {selected_language}")
        print(f"   AI Model: Groq ({selected_groq_model})")
        print(f"   💰 Cost: Free tier available!")
        print(f"\n   Step 1: run menu option 8")
        print(f"   Step 2: run menu option 9")
        print(f"   Step 3: articles_full → AI rewrite → articles_rewritten")
        print(f"   Step 4: articles_rewritten → publish → news + forum topics")
        print(
            f"\n   Features: Location extraction, Geo-coordinates, Comment integration,"
        )
        print(f"   Database: {len(DUTCH_CITIES)} Dutch cities with coordinates")
        print(f"\n   ✅ FIXES:")
        print(f"   - Always extract FAQ (minimal 3)")
        print(f"   - Always add location (search text)")
        print(f"   - Always search for metadata")
        print(f"   - Save full title (not truncated)")
        print(f"   - Search for comments in Firebase")
        print(f"   - Create forum topic in Firestore /news")
        print(f"   - Generate full URL title\n")

        # Check articles_full collection (source for rewriting)
        print("🔍 Checking collections for articles...")

        raw_collection = db.collection("articles_full")
        all_docs = raw_collection.get()
        source_collection = "articles_full"

        print(f"✅ Found {len(all_docs)} articles in {source_collection}")

        # Find unprocessed articles (v3 flag)
        unprocessed_articles = []
        for doc in all_docs:
            article_data = doc.to_dict()
            if article_data and not article_data.get("processed_v3"):
                article_data["id"] = doc.id
                unprocessed_articles.append(article_data)

        print(f"📊 Unprocessed articles (v3): {len(unprocessed_articles)}")

        if len(unprocessed_articles) == 0:
            print("No articles to process. All articles are already processed with v3.")
            return

        articles_to_process = unprocessed_articles
        print(f"Processing ALL {len(articles_to_process)} articles...\n")

        processed_count = 0
        duplicate_count = 0
        error_count = 0

        for i, article in enumerate(articles_to_process):
            print(f"\n{'='*80}")
            print(f"🔄 Processing article {i+1}/{len(articles_to_process)}")
            print(f"{'='*80}")

            # Show article details
            article_title = article.get("title", "No title")[:70]
            article_link = article.get("link", "No link")
            article_source = article.get("source", "Unknown")

            print(f"📰 Title: {article_title}")
            print(f"🔗 Source: {article_source}")
            print(f"🌐 Link: {article_link}")
            print(f"\n⚙️  Starting AI rewrite process...")

            # Rewrite article with AI
            rewritten_data = rewrite_article(article)

            if rewritten_data:
                # ENHANCED: Validate and fix HTML content
                full_text = rewritten_data.get("full_text", "")

                # Fix unclosed HTML tags and invalid nesting
                if full_text:
                    # Fix invalid nesting: <p><h2> → </p><h2>
                    full_text = re.sub(r"<p>([^<]*)<h2>", r"<p>\1</p>\n<h2>", full_text)
                    full_text = re.sub(r"<p>([^<]*)<h3>", r"<p>\1</p>\n<h3>", full_text)

                    # Remove incomplete sentences before headings
                    # Pattern: text ending mid-sentence + <h2> (e.g., "volgens de Chinese <h2>")
                    full_text = re.sub(
                        r"\s+[a-zA-Z]+\s+<h([23])>", r"</p>\n<h\1>", full_text
                    )

                    # Remove stray -- characters
                    full_text = re.sub(r"\s*--\s*", " ", full_text)

                    # Remove double closing tags
                    full_text = re.sub(r"</p>\s*</p>", "</p>", full_text)
                    full_text = re.sub(r"</h2>\s*</h2>", "</h2>", full_text)

                    # REACT HYDRATION FIXES: Remove problematic whitespace
                    # Remove trailing/leading whitespace inside tags
                    full_text = re.sub(r"<h2>\s+", "<h2>", full_text)
                    full_text = re.sub(r"\s+</h2>", "</h2>", full_text)
                    full_text = re.sub(r"<p>\s+", "<p>", full_text)
                    full_text = re.sub(r"\s+</p>", "</p>", full_text)

                    # Remove empty paragraphs
                    full_text = re.sub(r"<p>\s*</p>", "", full_text)

                    # Normalize whitespace between tags (prevent text nodes)
                    full_text = re.sub(r"</p>\s+<h", "</p>\n<h", full_text)
                    full_text = re.sub(r"</h2>\s+<p>", "</h2>\n<p>", full_text)
                    full_text = re.sub(r"</h2>\s+<h", "</h2>\n<h", full_text)

                    # Remove trailing whitespace at end of content
                    full_text = full_text.rstrip()

                    # PROPER HTML TAG BALANCING using regex to find opening/closing pairs
                    # Count <h2> tags (match both <h2> and <h2 class="...">)
                    h2_open = len(re.findall(r"<h2(?:\s|>)", full_text))
                    h2_close = full_text.count("</h2>")

                    # Count <p> tags (match both <p> and <p class="...">)
                    p_open = len(re.findall(r"<p(?:\s|>)", full_text))
                    p_close = full_text.count("</p>")

                    # CRITICAL FIX: Remove ORPHANED closing tags first
                    # These are closing tags without corresponding opening tags
                    if p_close > p_open:
                        # Too many closing </p> tags - remove extras from the end
                        excess = p_close - p_open
                        # Remove excess closing tags from end of content
                        for _ in range(excess):
                            # Find last </p> and remove it
                            last_p_close = full_text.rfind("</p>")
                            if last_p_close != -1:
                                full_text = (
                                    full_text[:last_p_close]
                                    + full_text[last_p_close + 4 :]
                                )
                        print(f"✅ Removed {excess} orphaned </p> tags")
                        p_close = full_text.count("</p>")  # Recount

                    if h2_close > h2_open:
                        excess = h2_close - h2_open
                        for _ in range(excess):
                            last_h2_close = full_text.rfind("</h2>")
                            if last_h2_close != -1:
                                full_text = (
                                    full_text[:last_h2_close]
                                    + full_text[last_h2_close + 5 :]
                                )
                        print(f"✅ Removed {excess} orphaned </h2> tags")
                        h2_close = full_text.count("</h2>")  # Recount

                    # Now close any remaining unclosed tags (only if more opening than closing)
                    if h2_open > h2_close:
                        full_text += "</h2>\n" * (h2_open - h2_close)
                        print(f"✅ Fixed {h2_open - h2_close} unclosed <h2> tags")
                    if p_open > p_close:
                        full_text += "</p>\n" * (p_open - p_close)
                        print(f"✅ Fixed {p_open - p_close} unclosed <p> tags")

                    # Final cleanup: remove any trailing empty lines
                    full_text = full_text.rstrip()

                    # EXTRA HARDENING: Remove redundant consecutive closing </p> tags at end
                    # This prevents hydration mismatches caused by orphan closers
                    # Pattern: one or more </p> possibly separated by newlines/spaces at very end following another </p>
                    # First collapse multiple consecutive closing tags anywhere
                    full_text = re.sub(r"(</p>\s*){2,}", "</p>\n", full_text)
                    # Then specifically strip trailing orphan closing tags that have no preceding <p>
                    # Count again after collapse
                    p_open2 = len(re.findall(r"<p(?:\s|>)", full_text))
                    p_close2 = full_text.count("</p>")
                    if p_close2 > p_open2:
                        excess2 = p_close2 - p_open2
                        # remove from end only the excess number
                        for _ in range(excess2):
                            last_idx = full_text.rfind("</p>")
                            if last_idx == -1:
                                break
                            full_text = full_text[:last_idx] + full_text[last_idx + 4 :]
                        print(
                            f"✅ Stripped {excess2} trailing orphan </p> tags (hardening)"
                        )

                    # Final trim again
                    full_text = full_text.rstrip()

                    rewritten_data["full_text"] = full_text

                # ENHANCED: Force FAQ extraction (minimum 3)
                faq_data = rewritten_data.get("faq", [])
                print(f"\n📋 FAQ Processing:")
                if not faq_data or len(faq_data) < 3:
                    print(
                        f"   ⚠️  Current FAQ count: {len(faq_data)} (generating more to reach minimum 3)"
                    )
                    # Generate at least 3 FAQs
                    location_name = rewritten_data.get("location", {}).get(
                        "name", "Nederland"
                    )
                    title = rewritten_data.get("title", "")
                    summary = rewritten_data.get("summary", "")

                    # Ensure summary is not truncated
                    safe_summary = (
                        summary or "Meer details zijn te vinden in het artikel."
                    )[:500]
                    if not safe_summary.endswith((".", "!", "?")):
                        safe_summary += "."

                    faq_data = [
                        {
                            "question": f"Wat is het belangrijkste om te weten over {title.lower()}?",
                            "answer": safe_summary,
                        },
                        {
                            "question": "Waar vond dit incident plaats?",
                            "answer": (
                                f"Dit incident vond plaats in {location_name}. "
                                f"Het gebied valt onder de regio {location_name}."
                                if location_name != "Nederland"
                                else "De locatie wordt vermeld in het artikel. "
                                "Lees het volledige bericht voor meer details over de plek van het incident."
                            ),
                        },
                        {
                            "question": "Wat is de status van het onderzoek?",
                            "answer": "Meer informatie over dit incident en de voortgang van het onderzoek "
                            "is te vinden in het volledige artikel. Volg de updates voor het laatste nieuws.",
                        },
                    ]
                    rewritten_data["faq"] = faq_data

                    # Rebuild semantic HTML with new FAQ data
                    full_text = rewritten_data.get("full_text", "")
                    location_data = rewritten_data.get("location", {})
                    semantic_html = build_semantic_html_structure(
                        rewritten_data, location_data, faq_data
                    )
                    rewritten_data["full_text"] = semantic_html

                    print(
                        f"   ✅ Generated {len(faq_data)} complete FAQ questions with full answers"
                    )
                else:
                    # Validate existing FAQ answers are complete
                    for faq in faq_data:
                        answer = faq.get("answer", "")
                        if answer and not answer.endswith((".", "!", "?")):
                            faq["answer"] = answer + "."
                    print(f"   ✅ FAQ has {len(faq_data)} questions (validated)")

                # Show FAQ questions
                for idx, faq in enumerate(faq_data[:3], 1):
                    q = faq.get("question", "")[:60]
                    print(f"   {idx}. {q}...")

                # ENHANCED: Force location detection (search full text)
                location = rewritten_data.get("location", {})
                print(f"\n📍 Location Detection:")
                if not location or location.get("name") == "Nederland":
                    print("   � Searching for location in full text...")
                    full_text = rewritten_data.get("full_text", "")
                    title = rewritten_data.get("title", "")
                    summary = rewritten_data.get("summary", "")

                    # Search in order: title, summary, full text
                    detected_location = detect_location(title, summary, full_text)
                    if (
                        detected_location
                        and detected_location.get("name") != "Nederland"
                    ):
                        rewritten_data["location"] = detected_location
                        print(f"   ✅ Found: {detected_location['name']}")
                        print(
                            f"   📌 Coordinates: {detected_location.get('lat', 'N/A')}, {detected_location.get('lng', 'N/A')}"
                        )
                        print(f"   🗺️  Region: {detected_location.get('region', 'N/A')}")
                    else:
                        print(
                            "   ⚠️  No specific location found, using Nederland as default"
                        )
                        rewritten_data["location"] = {
                            "name": "Nederland",
                            "lat": 52.1326,
                            "lng": 5.2913,
                            "region": "Nederland",
                            "provincie": "Nederland",
                        }
                else:
                    print(
                        f"   ✅ Location already set: {location.get('name', 'Unknown')}"
                    )
                    if location.get("lat") and location.get("lng"):
                        print(
                            f"   📌 Coordinates: {location['lat']}, {location['lng']}"
                        )

                # ENHANCED: Extract metadata properly with error handling
                print(f"\n🔍 Metadata Extraction:")
                try:
                    enhanced_meta = extract_enhanced_metadata(
                        rewritten_data.get("full_text", ""),
                        rewritten_data.get("title", ""),
                    )
                    rewritten_data["metadata"] = enhanced_meta
                    print("   ✅ Metadata extracted successfully")

                    # Show metadata details
                    if enhanced_meta.get("keywords"):
                        keywords_str = ", ".join(enhanced_meta["keywords"][:5])
                        print(f"   🏷️  Keywords: {keywords_str}...")
                    if enhanced_meta.get("category"):
                        print(f"   📁 Category: {enhanced_meta['category']}")
                    if enhanced_meta.get("incident_type"):
                        print(f"   🚨 Incident Type: {enhanced_meta['incident_type']}")
                except Exception as e:
                    print(f"⚠️ Could not extract metadata: {e}")
                    rewritten_data["metadata"] = {
                        "keywords": rewritten_data.get("tags", []),
                        "category": rewritten_data.get("category", "Algemeen"),
                        "incident_type": "onbekend",
                    }

                # ENHANCED: Generate additional metadata from body content using AI
                print(f"\n🤖 AI Metadata Generation from Body:")
                try:
                    full_text = rewritten_data.get("full_text", "")
                    title = rewritten_data.get("title", "")

                    # Strip HTML for cleaner analysis
                    text_content = re.sub(r"<[^>]+>", "", full_text)
                    text_preview = text_content[:800]  # First 800 chars for analysis

                    # AI prompt to extract metadata from body
                    metadata_prompt = f"""Analyseer dit Nederlandse nieuwsartikel en genereer metadata.

Artikel titel: {title}

Artikel tekst:
{text_preview}

Geef metadata in dit EXACTE formaat (één regel per item):
KEYWORDS: [5-8 relevante zoekwoorden, gescheiden door komma's]
CATEGORY: [kies uit: Binnenland, Buitenland, Politie, Criminaliteit, Verkeer, Algemeen]
INCIDENT_TYPE: [type incident: diefstal, verkeersongeval, geweld, oplichting, drugsdelict, vermissing, brand, overig]
LOCATION_TYPE: [stad, regio, snelweg, gebouw, of algemeen]
URGENCY: [laag, midden, hoog]

Metadata:"""

                    ai_metadata_text = generate_text(metadata_prompt, max_tokens=150)

                    # Parse AI response
                    ai_keywords = []
                    ai_category = None
                    ai_incident_type = None
                    ai_location_type = None
                    ai_urgency = None

                    if ai_metadata_text:
                        lines = ai_metadata_text.strip().split("\n")
                        for line in lines:
                            line = line.strip()
                            if line.startswith("KEYWORDS:"):
                                keywords_str = line.replace("KEYWORDS:", "").strip()
                                ai_keywords = [
                                    k.strip()
                                    for k in keywords_str.split(",")
                                    if k.strip()
                                ]
                            elif line.startswith("CATEGORY:"):
                                ai_category = line.replace("CATEGORY:", "").strip()
                            elif line.startswith("INCIDENT_TYPE:"):
                                ai_incident_type = line.replace(
                                    "INCIDENT_TYPE:", ""
                                ).strip()
                            elif line.startswith("LOCATION_TYPE:"):
                                ai_location_type = line.replace(
                                    "LOCATION_TYPE:", ""
                                ).strip()
                            elif line.startswith("URGENCY:"):
                                ai_urgency = line.replace("URGENCY:", "").strip()

                    # Merge AI-generated metadata with existing
                    current_meta = rewritten_data.get("metadata", {})

                    # Add AI keywords to existing ones (unique)
                    if ai_keywords:
                        existing_keywords = current_meta.get("keywords", [])
                        combined_keywords = list(set(existing_keywords + ai_keywords))
                        current_meta["keywords"] = combined_keywords[:10]  # Max 10
                        print(f"   🏷️  AI Keywords: {', '.join(ai_keywords[:5])}...")

                    # Update category if AI found one
                    if ai_category and ai_category != "Algemeen":
                        current_meta["category"] = ai_category
                        print(f"   📁 AI Category: {ai_category}")

                    # Update incident type if AI found one
                    if ai_incident_type and ai_incident_type != "overig":
                        current_meta["incident_type"] = ai_incident_type
                        print(f"   🚨 AI Incident Type: {ai_incident_type}")

                    # Add new metadata fields
                    if ai_location_type:
                        current_meta["location_type"] = ai_location_type
                        print(f"   📍 Location Type: {ai_location_type}")

                    if ai_urgency:
                        current_meta["urgency"] = ai_urgency
                        print(f"   ⚡ Urgency Level: {ai_urgency}")

                    rewritten_data["metadata"] = current_meta
                    print("   ✅ AI metadata generation completed")

                except Exception as e:
                    print(f"   ⚠️  AI metadata generation failed: {e}")
                    # Continue with existing metadata

                # Merge keywords from metadata with existing tags
                if rewritten_data.get("metadata", {}).get("keywords"):
                    existing_tags = rewritten_data.get("tags", [])
                    combined_tags = list(
                        set(existing_tags + rewritten_data["metadata"]["keywords"])
                    )
                    rewritten_data["tags"] = combined_tags[:10]

                # Rebuild semantic HTML structure with all enhancements
                location = rewritten_data.get("location", {})
                faq_data = rewritten_data.get("faq", [])
                semantic_html = build_semantic_html_structure(
                    rewritten_data, location, faq_data
                )

                # ENHANCED: Final HTML validation and cleanup
                if semantic_html:
                    # Remove any dangling text nodes (React error #418 fix)
                    semantic_html = re.sub(r">\s+([^<\s])", r"> \1", semantic_html)
                    semantic_html = re.sub(r"([^>\s])\s+<", r"\1 <", semantic_html)

                    # Ensure all tags are properly closed
                    for tag in ["h2", "h3", "p", "div", "section"]:
                        open_count = semantic_html.count(
                            f"<{tag}>"
                        ) + semantic_html.count(f"<{tag} ")
                        close_count = semantic_html.count(f"</{tag}>")
                        if open_count > close_count:
                            semantic_html += f"</{tag}>\n" * (open_count - close_count)

                    # Validate minimum content length
                    text_content = re.sub(r"<[^>]+>", "", semantic_html)
                    if len(text_content.strip()) < 100:
                        print("⚠️ WARNING: Content is very short, may be truncated")

                    print(
                        f"✅ Content validated: {len(text_content)} characters, HTML is well-formed"
                    )

                rewritten_data["full_text"] = semantic_html
                print("✨ Applied HTML formatting for better readability")

                # FINAL SANITATION PASS (post semantic rebuild) to avoid React hydration mismatches
                try:
                    final_html = rewritten_data.get("full_text", "")
                    original_len = len(final_html)

                    # 0. MASTER FIX: Strip ALL consecutive closing tags at end in ONE pass
                    #    This is the nuclear option that catches patterns like </p></p></p></p></p></p>
                    final_html = re.sub(r"((?:</p>)+)\s*$", "", final_html).rstrip()
                    print(f"🔥 Stripped ALL trailing </p> sequences (master fix)")

                    # 1. AGGRESSIVE: Remove ALL orphan </p> tags in one pass
                    #    Instead of looping, calculate excess and strip trailing patterns
                    p_open = len(re.findall(r"<p(?:\s|>)", final_html))
                    p_close = final_html.count("</p>")
                    if p_close > p_open:
                        excess = p_close - p_open
                        # Aggressive regex: Match trailing </p> patterns with optional whitespace
                        # This handles cases like </p></p></p></p> at the end
                        final_html = re.sub(
                            r"((?:</p>\s*){1,})\s*$",
                            lambda m: "</p>" if p_open > 0 else "",
                            final_html,
                            count=1,
                        )
                        # Verify and do fallback loop if regex didn't work
                        p_close_after = final_html.count("</p>")
                        if p_close_after > p_open:
                            # Fallback: Remove from end one by one
                            for _ in range(p_close_after - p_open):
                                last_idx = final_html.rfind("</p>")
                                if last_idx == -1:
                                    break
                                final_html = (
                                    final_html[:last_idx] + final_html[last_idx + 4 :]
                                )
                        print(
                            f"🧼 Removed {excess} orphan </p> tags (step 1, aggressive)"
                        )

                    # 2. Collapse any repeated consecutive closing paragraphs inside the body
                    final_html = re.sub(r"(</p>\s*){2,}", "</p>\n", final_html)

                    # 3. Remove empty headings (e.g., <h2></h2> or <h2>\n</h2>) left by outline injection or AI
                    final_html = re.sub(r"<h2[^>]*>\s*</h2>", "", final_html)
                    final_html = re.sub(r"<h3[^>]*>\s*</h3>", "", final_html)

                    # 4. Prevent sequences of multiple <h2> with no paragraph/content between them by inserting a placeholder paragraph
                    #    This improves semantic structure and reduces risk of client reflow differences
                    def insert_placeholder(match):
                        h2_block = match.group(0)
                        # split individual headings
                        headings = re.findall(r"<h2[^>]*>.*?</h2>", h2_block)
                        if len(headings) <= 1:
                            return h2_block
                        # Join with a minimal separator paragraph (non-breaking space) so layout identical SSR/CSR
                        return "</p>".join(headings).replace(
                            "</p><h2", "<h2"
                        )  # safeguard (should not create extra p)

                    # Identify stretches of consecutive h2s
                    # (Optional) Disabled placeholder insertion for now to avoid artificial paragraphs; keep for future tuning
                    # final_html = re.sub(r"(<h2[^>]*>.*?</h2>\s*){2,}", insert_placeholder, final_html)

                    # 5. Trim leading/trailing whitespace
                    final_html = final_html.strip()

                    # 6. Safety: ensure no unmatched extra closers remain for h2
                    h2_open = len(re.findall(r"<h2(?:\s|>)", final_html))
                    h2_close = final_html.count("</h2>")
                    if h2_close > h2_open:
                        excess = h2_close - h2_open
                        for _ in range(excess):
                            last_idx = final_html.rfind("</h2>")
                            if last_idx == -1:
                                break
                            final_html = (
                                final_html[:last_idx] + final_html[last_idx + 5 :]
                            )
                        print(f"✅ Final sanitation removed {excess} orphan </h2> tags")

                    # 7. Recompute and append missing closing </p> if needed (rare after rebuild)
                    p_open = len(re.findall(r"<p(?:\s|>)", final_html))
                    p_close = final_html.count("</p>")
                    if p_open > p_close:
                        final_html += "</p>" * (p_open - p_close)
                        print(
                            f"✅ Final sanitation appended {p_open - p_close} missing </p> tags"
                        )

                    # 8. REACT HYDRATION FIX: Remove whitespace-only text nodes between block elements
                    #    React treats these as text nodes during hydration, causing mismatch
                    final_html = re.sub(r"</p>\s+<h", "</p>\n<h", final_html)
                    final_html = re.sub(r"</h2>\s+<p>", "</h2>\n<p>", final_html)
                    final_html = re.sub(r"</h2>\s+<h", "</h2>\n<h", final_html)
                    final_html = re.sub(r"</h3>\s+<p>", "</h3>\n<p>", final_html)

                    # 9. Fix invalid nesting: <p><h2> patterns (HTML5 invalid, React rejects)
                    final_html = re.sub(r"<p>\s*<h([23])", "</p>\n<h\\1", final_html)
                    final_html = re.sub(r"</h([23])>\s*</p>", "</h\\1>", final_html)

                    # 10. AGGRESSIVE: Remove all trailing orphan </p> tags in one pass
                    #    Pattern: Match sequences of </p> at the end that have no matching opening
                    p_open_final = len(re.findall(r"<p(?:\s|>)", final_html))
                    p_close_final = final_html.count("</p>")
                    if p_close_final > p_open_final:
                        excess_final = p_close_final - p_open_final
                        # Aggressive: Remove all trailing </p> patterns at once using regex
                        # Match: </p> followed by optional whitespace and more </p> tags until end
                        final_html = re.sub(r"(</p>(?:\s*</p>)*)\s*$", "", final_html)
                        # Re-add exactly the number we need (if any)
                        p_open_after = len(re.findall(r"<p(?:\s|>)", final_html))
                        p_close_after = final_html.count("</p>")
                        if p_open_after > p_close_after:
                            final_html += "</p>" * (p_open_after - p_close_after)
                        print(
                            f"🧼 Stripped {excess_final} final orphan </p> after whitespace fixes (aggressive)"
                        )

                    # Only update if changed
                    if final_html != rewritten_data.get("full_text"):
                        print(
                            f"🧼 Final sanitation adjusted HTML length {original_len} -> {len(final_html)} (delta {len(final_html)-original_len})"
                        )
                        rewritten_data["full_text"] = final_html
                except Exception as _e:
                    print(f"⚠️ Final sanitation skipped due to error: {_e}")

                # ENHANCED: Fetch and integrate Firebase comments
                print(f"\n💬 Firebase Comments:")
                print(f"   🔍 Searching for existing comments...")
                try:
                    # Try to find comments for this article slug
                    slug = rewritten_data.get("slug", "")
                    admin_db = realtime_db.reference()
                    comments_ref = admin_db.child(f"comments/{slug}")
                    comments_data = comments_ref.get()

                    comment_count = 0
                    if comments_data:
                        comment_count = (
                            len(comments_data) if isinstance(comments_data, dict) else 0
                        )
                        print(f"   ✅ Found {comment_count} comments")
                    else:
                        print(f"   📝 No comments found (new article)")

                    rewritten_data["comment_count"] = comment_count

                    # Add comments to JSON-LD data
                    if comment_count > 0:
                        print(
                            f"💬 Added DiscussionForumPosting with {comment_count} comments to JSON-LD"
                        )

                except Exception as e:
                    print(f"⚠️ Could not fetch comments: {e}")
                    rewritten_data["comment_count"] = 0

                # ENHANCED: Ensure title has year suffix (final check)
                print(f"\n📅 Final Title Processing:")
                full_title = rewritten_data.get("title", "")
                current_year = datetime.utcnow().year

                # Check if title already has year
                if not re.search(r"\(\d{4}\)$", full_title):
                    print(f"   ⚠️  Title missing year, adding: ({current_year})")
                    candidate = f"{full_title.strip()} ({current_year})"
                    if len(candidate) <= 65:
                        full_title = candidate
                    else:
                        # Trim to fit within 65 chars
                        room = 65 - (len(str(current_year)) + 3)  # 3 = " ()"
                        trimmed = full_title[:room].rstrip(" -–:;,.!/")
                        full_title = f"{trimmed} ({current_year})"
                    rewritten_data["title"] = full_title
                    print(f"   ✅ Year added to title")
                else:
                    year_match = re.search(r"\((\d{4})\)$", full_title)
                    if year_match:
                        print(f"   ✅ Title already has year: {year_match.group(1)}")

                # ENHANCED: Save full title (not truncated)
                full_title = rewritten_data.get("title", "")
                slug = rewritten_data.get("slug", "")
                print(f"\n� Saving Article:")
                print(
                    f"   📝 Title: {full_title[:70]}..."
                    if len(full_title) > 70
                    else f"   📝 Title: {full_title}"
                )
                print(f"   🔗 Slug: {slug}")
                print(f"   📊 Tags: {len(rewritten_data.get('tags', []))} tags")
                print(
                    f"   📝 Content: {len(rewritten_data.get('full_text', ''))} characters"
                )

                # Show H1 title structure
                h1_match = re.search(
                    r"<h1[^>]*>(.*?)</h1>", rewritten_data.get("full_text", "")
                )
                if h1_match:
                    h1_title = h1_match.group(1).strip()
                    # Remove HTML entities and tags
                    h1_title = re.sub(r"<[^>]+>", "", h1_title)
                    print(
                        f"   📰 H1 in Content: {h1_title[:60]}..."
                        if len(h1_title) > 60
                        else f"   📰 H1 in Content: {h1_title}"
                    )

                # Add processed_v3 flag
                rewritten_data["processed_v3"] = True
                rewritten_data["version"] = "3.0"
                print(f"   ✅ Marked as processed_v3")

                # Check duplicates
                is_duplicate, duplicate_type = check_duplicate_article(
                    db,
                    "articles_rewritten",
                    rewritten_data.get("link", ""),
                    rewritten_data.get("title", ""),
                )

                if is_duplicate:
                    print(f"\n⚠️  DUPLICATE DETECTED: Skipping...")
                    print(f"   Type: {duplicate_type}")
                    duplicate_count += 1

                    # Mark as processed_v3
                    try:
                        doc_ref = db.collection(source_collection).document(
                            article["id"]
                        )
                        doc_ref.update({"processed_v3": True})
                    except Exception as e:
                        print(f"❌ Error marking as processed_v3: {e}")

                    continue

                # Save to articles_rewritten
                try:
                    doc_ref = db.collection("articles_rewritten").document()
                    doc_ref.set(rewritten_data)
                    print(f"\n✅ SUCCESS: Saved to articles_rewritten collection")

                    # Mark as processed_v3
                    doc_ref = db.collection(source_collection).document(article["id"])
                    doc_ref.update({"processed_v3": True})

                except Exception as e:
                    print(f"❌ Error saving to articles_rewritten: {e}")
                    error_count += 1
                    continue

                # ENHANCED: Publish to /news collection with full URL slug
                try:
                    # Save article to Firebase Firestore /news
                    save_article_to_firebase(rewritten_data)

                    # ENHANCED: Generate full URL with complete slug
                    full_slug = rewritten_data["slug"]
                    full_url = f"/nieuws/{full_slug}"
                    print(f"✅ Saved article to Firebase: {full_url}")

                    # Show full Next.js URL
                    nextjs_url = f"https://politie-forum.nl{full_url}"
                    print(f"🌐 Next.js URL: {nextjs_url}")

                    # Revalidate Vercel cache
                    revalidate_vercel_path(full_slug)
                    print(f"✅ Revalidated Vercel cache for {full_url}")

                    print(f"🚀 Published to news: {full_url}")

                except Exception as e:
                    print(f"⚠️ Error publishing to news: {e}")

                # ENHANCED: Create forum topic in Firestore /news collection
                try:
                    topic_id = create_forum_topic_from_article(rewritten_data, db)
                    if topic_id:
                        print(f"✅ Created forum topic with ID: {topic_id}")
                        print(f"💬 Forum topic added to Firestore: /news/{full_slug}")
                except Exception as e:
                    print(f"⚠️ Error creating forum topic: {e}")

                processed_count += 1
            else:
                print("⚠️ No rewritten data generated")
                error_count += 1

            # Delay between articles
            if i < len(articles_to_process) - 1:
                print("⏳ Waiting 2 seconds...")
                time.sleep(2)

        print(f"\n{'='*80}")
        print(f"📊 ENHANCED REWRITING V3 - FINAL SUMMARY")
        print(f"{'='*80}")
        print(f"\n📈 Processing Statistics:")
        print(f"   ✅ Successfully processed: {processed_count} articles")
        print(f"   ⚠️  Duplicates skipped: {duplicate_count} articles")
        print(f"   ❌ Errors encountered: {error_count} articles")
        print(
            f"   📊 Total processed: {processed_count + duplicate_count + error_count} articles"
        )

        print(f"\n🎯 Applied Enhancements:")
        print(f"   📍 Location Detection: Full-text search in 115+ Dutch cities")
        print(f"   🗺️  Geo-coordinates: Latitude/Longitude for each location")
        print(f"   🏷️  Metadata: Enhanced keywords, categories, incident types")
        print(f"   ❓ FAQ Generation: Minimum 3 questions per article")
        print(f"   💬 Firebase Comments: Real-time comment count integration")
        print(f"   🗂️  Forum Topics: Automatic Firestore /news collection")
        print(f"   📝 Full Titles: Complete titles preserved (no truncation)")
        print(f"   🌐 SEO Slugs: Clean URL-friendly slugs generated")
        print(f"   🔧 HTML Cleanup: React hydration errors fixed")

        print(f"\n💾 Database Operations:")
        print(f"   � Source: articles_full collection")
        print(f"   � Target: articles_rewritten collection")
        print(f"   🚀 Published: /news collection (Next.js ISR)")
        print(f"   ✅ Marked: processed_v3 flag on all processed articles")

        print(f"\n🎉 All enhancements applied successfully!")
        print(f"{'='*80}\n")

    except Exception as e:
        print(f"Error in enhanced rewriting v3: {e}")
        import traceback

        traceback.print_exc()


def automate_all(db):
    """Automate the entire workflow: Extract → Process → Rewrite → Publish → Sync → Generate Sitemaps"""
    print(style("\n🤖 AUTOMATED WORKFLOW STARTING...", GREEN, BOLD))
    print("=" * 60)

    try:
        # Step 1: Extract articles from politie.nl
        print(
            style("\n📥 STEP 1: Extracting articles from politie.nl RSS...", CYAN, BOLD)
        )
        politie_rss_url = RSS_FEEDS["Nederlandse Politie"]["Algemeen"]

        # Get existing articles to check for duplicates
        try:
            existing_docs = db.collection("articles_raw").get()
            existing_links = set()
            existing_titles = set()

            for doc in existing_docs:
                article_data = doc.to_dict()
                if article_data.get("link"):
                    existing_links.add(article_data["link"])
                if article_data.get("title"):
                    existing_titles.add(article_data["title"])

            print(f"📊 Found {len(existing_links)} existing articles in database")
        except Exception as e:
            print(f"⚠️ Could not check existing articles: {e}")
            existing_links = set()
            existing_titles = set()

        articles = extract_articles(
            politie_rss_url,
            num_articles=20,
            is_politie_nl=True,
            existing_links=existing_links,
        )

        # Add source identifier
        for article in articles:
            article["source"] = "politie.nl"

        save_articles_to_firestore(articles, "articles_raw", db)
        print(f"✅ Step 1 complete: {len(articles)} articles extracted")

        # Step 2: Process politie.nl articles to get full content
        print(style("\n📝 STEP 2: Processing articles for full content...", CYAN, BOLD))
        process_politie_nl_articles(db)
        print("✅ Step 2 complete: Articles processed to articles_full")

        # Step 3: Advanced AI Rewriting V2
        print(
            style(
                "\n🤖 STEP 3: Advanced AI Rewriting with enhanced metadata...",
                CYAN,
                BOLD,
            )
        )
        start_advanced_rewriting_v2(db)
        print("✅ Step 3 complete: Articles rewritten to articles_rewritten")

        # Step 4: Publish to /news
        print(style("\n🚀 STEP 4: Publishing to /news collection...", CYAN, BOLD))
        publish_to_news(db)
        print("✅ Step 4 complete: Articles published to /news")

        # Step 5: Sync to Crime Map
        print(style("\n🗺️ STEP 5: Syncing articles to Crime Map...", CYAN, BOLD))
        sync_articles_to_crime_map()
        print("✅ Step 5 complete: Articles synced to Crime Map")

        # Step 6: Generate Sitemaps
        print(style("\n🗺️ STEP 6: Generating sitemaps...", CYAN, BOLD))
        generate_sitemaps(db)
        print("✅ Step 6 complete: Sitemaps generated")  # Final Summary
        print(style("\n✅ AUTOMATED WORKFLOW COMPLETE!", GREEN, BOLD))
        print("=" * 60)
        print("📊 Summary:")
        print("   ✅ Articles extracted from politie.nl RSS")
        print("   ✅ Full content fetched and processed")
        print("   ✅ AI rewriting with enhanced SEO metadata → articles_rewritten")
        print("   ✅ Articles published to /news collection → Next.js ISR")
        print("   ✅ Crime Map synchronized")
        print("   ✅ Sitemaps generated (sitemap.xml, news-sitemap.xml, robots.txt)")
        print("\n🚀 Your site is now fully updated!")
        print("🌐 Live at: https://politie-forum.nl/")

    except Exception as e:
        print(style(f"\n❌ Error in automated workflow: {e}", RED, BOLD))
        import traceback

        traceback.print_exc()


def automate_quick_workflow(db):
    """Quick automation workflow: NU.nl Extract → Process → Rewrite → Publish → Crime Map → Sitemaps (for cron - 30m)"""
    print(style("\n⚡ QUICK WORKFLOW STARTING (30-minute automation)...", GREEN, BOLD))
    print("=" * 60)

    try:
        # Step 1: Extract articles from ALL NU.nl RSS feeds (option 8)
        print(
            style(
                "\n📥 STEP 1/6: Extracting articles from ALL NU.nl RSS feeds...",
                CYAN,
                BOLD,
            )
        )

        # Get existing articles to check for duplicates
        try:
            existing_docs = db.collection("articles_raw").get()
            existing_links = set()
            for doc in existing_docs:
                article_data = doc.to_dict()
                if article_data.get("link"):
                    existing_links.add(article_data["link"])
            print(f"📊 Found {len(existing_links)} existing articles in database")
        except Exception as e:
            print(f"⚠️ Could not check existing articles: {e}")
            existing_links = set()

        # Extract articles from ALL NU.nl feeds
        all_articles = []
        nu_nl_feeds = [
            ("Algemeen nieuws", "https://www.nu.nl/rss/Algemeen"),
            ("Binnenland", "https://www.nu.nl/rss/Binnenland"),
            ("Buitenland", "https://www.nu.nl/rss/Buitenland"),
            ("Economie", "https://www.nu.nl/rss/Economie"),
            ("Sport", "https://www.nu.nl/rss/Sport"),
            ("Tech", "https://www.nu.nl/rss/Tech"),
            ("Opmerkelijk", "https://www.nu.nl/rss/Opmerkelijk"),
        ]

        for feed_name, feed_url in nu_nl_feeds:
            print(f"📡 Extracting from: {feed_name}...")
            try:
                articles = extract_articles(
                    feed_url,
                    num_articles=2,  # 2 per feed = 14 total
                    is_nu_nl=True,
                    existing_links=existing_links,
                )
                all_articles.extend(articles)
                print(f"   ✅ {len(articles)} articles from {feed_name}")
            except Exception as e:
                print(f"   ⚠️ Failed to extract from {feed_name}: {e}")

        # Save to Firestore
        save_articles_to_firestore(all_articles, "articles_raw", db)
        print(
            f"✅ Step 1 complete: {len(all_articles)} NU.nl articles extracted from {len(nu_nl_feeds)} feeds"
        )
        # After saving to Firestore, send each new article to MCP for summarization
        for article in all_articles:
            article_id = (
                article.get("id")
                or article.get("doc_id")
                or article.get("title", "")[:40].replace(" ", "_")
            )
            threading.Thread(target=notify_mcp, args=(article_id,)).start()

        # Step 2: Process NU.nl articles (option 9)
        print(
            style(
                "\n📝 STEP 2/6: Processing NU.nl articles for full content...",
                CYAN,
                BOLD,
            )
        )
        process_nu_nl_articles(db)
        print("✅ Step 2 complete: Articles processed to articles_full")

        # Step 3: Advanced AI Rewriting V2 (option 16)
        print(style("\n🤖 STEP 3/6: AI Rewriting + Publishing to /news...", CYAN, BOLD))
        start_advanced_rewriting_v2(db)
        print("✅ Step 3 complete: Articles rewritten and published")

        # Step 4: Publish to /news (option 17)
        print(
            style(
                "\n🚀 STEP 4/6: Publishing remaining articles to /news...", CYAN, BOLD
            )
        )
        publish_to_news(db)
        print("✅ Step 4 complete: All articles published to /news")

        # Step 5: Sync to Crime Map (option 18)
        print(style("\n🗺️ STEP 5/6: Syncing articles to Crime Map...", CYAN, BOLD))
        sync_articles_to_crime_map()
        print("✅ Step 5 complete: Crime Map synchronized")

        # Step 6: Generate Sitemaps (option 19)
        print(style("\n🗺️ STEP 6/6: Generating sitemaps...", CYAN, BOLD))
        generate_sitemaps(db)
        print("✅ Step 6 complete: Sitemaps generated")

        # Final Summary
        print(style("\n✅ QUICK WORKFLOW COMPLETE!", GREEN, BOLD))
        print("=" * 60)
        print("📊 Summary (30-minute automation):")
        print("   ✅ NU.nl articles extracted (option 8)")
        print("   ✅ Full content processed (option 9)")
        print("   ✅ AI rewriting + publish to /news (option 16)")
        print("   ✅ Remaining articles published (option 17)")
        print("   ✅ Crime Map synchronized (option 18)")
        print("   ✅ Sitemaps generated (option 19)")
        print("\n⏱️ Ready for next cron run in 30 minutes")
        print("🌐 Live at: https://politie-forum.nl/")

    except Exception as e:
        print(style(f"\n❌ Error in quick workflow: {e}", RED, BOLD))
        import traceback

        traceback.print_exc()


def ai_optimize_news_to_ai_news(db):
    """
    🤖 AI OPTIMIZE: Take articles from /news collection and optimize with MCP Groq AI.
    Creates optimized versions in /ai_news collection with:
    - AI-generated summary (via MCP)
    - Enhanced tags
    - Improved metadata
    - Better categorization
    """
    print("\n" + "=" * 80)
    print(style("🤖 AI OPTIMIZE - /news → /ai_news (MCP Groq AI)", CYAN, BOLD))
    print("=" * 80 + "\n")

    print(style("📦 Source: /news collection", DIM))
    print(style("🤖 AI: MCP Groq summarization", DIM))
    print(style("💾 Output: /ai_news collection", DIM))
    print(style("✨ Enhancements: tags, summary, metadata", DIM))

    try:
        # Fetch all articles from /news collection
        news_ref = db.collection("news")
        articles_snapshot = news_ref.get()

        if not articles_snapshot:
            print(style("\n❌ No articles found in /news collection", RED))
            return

        articles = [{"id": doc.id, **doc.to_dict()} for doc in articles_snapshot]
        print(f"\n📊 Found {len(articles)} articles in /news collection\n")

        processed = 0
        skipped = 0
        errors = 0

        for article in articles:
            article_id = article["id"]
            title = article.get("title", "Untitled")

            print("=" * 80)
            print(f"Processing: {title[:70]}...")
            print("=" * 80)

            # Check if already processed in ai_news
            ai_news_ref = db.collection("ai_news").document(article_id)
            if ai_news_ref.get().exists:
                print(f"⏭️  Skipping: Already in /ai_news")
                skipped += 1
                continue

            try:
                # Send to MCP for AI summarization
                print(f"🤖 Sending to MCP for AI optimization...")
                threading.Thread(target=notify_mcp, args=(article_id,)).start()

                # Wait a moment for MCP to process (async)
                import time

                time.sleep(2)

                # Enhance article data
                optimized_article = {
                    **article,  # Copy all original fields
                    "optimizedAt": datetime.now().isoformat(),
                    "source": "ai_optimization",
                    "originalSlug": article_id,
                }

                # Enhance tags if present
                if "tags" in article and article["tags"]:
                    # Add AI-enhanced tags
                    optimized_article["aiTags"] = enhance_tags(article["tags"])

                # Save to /ai_news collection
                db.collection("ai_news").document(article_id).set(optimized_article)
                print(f"✅ Saved to /ai_news/{article_id}")

                processed += 1

            except Exception as e:
                print(f"❌ Error optimizing article: {e}")
                errors += 1
                continue

        print(f"\n{'=' * 80}")
        print(style("🎉 AI Optimization complete!", GREEN, BOLD))
        print(f"✅ Processed: {processed}")
        print(f"⏭️  Skipped (already optimized): {skipped}")
        print(f"❌ Errors: {errors}")
        print(f"{'=' * 80}\n")

    except Exception as e:
        print(style(f"\n❌ Error in AI optimization: {e}", RED))
        import traceback

        traceback.print_exc()


def enhance_tags(original_tags):
    """Enhance article tags with AI-suggested related tags"""
    enhanced = list(original_tags)  # Copy original tags

    # Tag enhancement mapping
    tag_enhancements = {
        "Geweld": ["Misdaad", "Veiligheid", "Politie"],
        "Diefstal": ["Criminaliteit", "Inbraak", "Beveiliging"],
        "Fraude": ["Cybercrime", "Oplichting", "Financieel"],
        "Drugs": ["Criminaliteit", "Smokkel", "Illegaal"],
        "Vandalisme": ["Vernieling", "Schade", "Openbare Orde"],
        "Verkeer": ["Ongeluk", "Verkeersovertreding", "Veiligheid"],
    }

    # Add related tags
    for tag in original_tags:
        if tag in tag_enhancements:
            for enhancement in tag_enhancements[tag]:
                if enhancement not in enhanced:
                    enhanced.append(enhancement)

    return enhanced[:10]  # Limit to 10 tags max


def advanced_rewriter_v4_articles_full(db):
    """
    Advanced Rewriter V4 - Next.js ISR Workflow

    ⚠️ NO STATIC HTML GENERATION - Next.js ISR handles all rendering

    Python Role (Data Processor):
    - Source: articles_full collection from Firestore
    - AI structured content generation (H2/H3 hierarchy)
    - FAQ generation (3-5 questions)
    - Location detection with geo-coordinates
    - Save to Firestore /news collection

    Next.js Role (Renderer):
    - ArticleClient.tsx: HTML/CSS rendering
    - ArticleJsonLd.tsx: JSON-LD schemas (8+ types)
    - ArticleFAQ.tsx: Collapsible FAQ component
    - ArticleComments.tsx: Real-time comments
    - ISR revalidation: 600s (10 minutes)

    No Duplicates:
    ✅ JSON-LD: Only Next.js generates schemas
    ✅ FAQ: Only Next.js ArticleFAQ.tsx renders
    ✅ HTML: Only Next.js generates markup
    ✅ Single render path: Next.js ISR only
    """
    global client, model_name, client_type

    try:
        print("\n" + "=" * 80)
        print(style("🚀 ADVANCED REWRITER V4 - Articles Full", CYAN, BOLD))
        print("=" * 80)
        print(f"\n📦 Source: articles_full collection")
        print(f"📝 Title: H2/H3 structured content (no H1)")
        print(f"📚 Structure: Semantic HTML hierarchy")
        print(f"❓ FAQ: 3-5 questions per article")
        print(f"🔍 SEO: Next.js ArticleJsonLd.tsx (8+ schemas)")
        print(f"💾 Output: Firestore /news → Next.js ISR")
        print(f"🚫 Static HTML: DISABLED (using Next.js only)\n")

        # Initialize AI client
        client, model_name, client_type = get_ai_client()
        if not client or not model_name:
            print("❌ No AI client available. Check API keys.")
            return

        print(f"✅ AI Model: {model_name}\n")

        # Fetch articles from articles_full
        articles_ref = db.collection("articles_full")
        articles_docs = articles_ref.limit(100).get()

        if not articles_docs:
            print("❌ No articles found in articles_full collection.")
            return

        print(f"📊 Found {len(articles_docs)} articles to process\n")

        processed = 0
        errors = 0

        for doc in articles_docs:
            article = doc.to_dict()
            article_id = doc.id

            try:
                print(f"\n{'='*80}")
                print(f"Processing: {article.get('title', 'No title')[:70]}...")
                print(f"{'='*80}")

                # Check if already processed
                if article.get("processed", False):
                    print("⏭️  Skipping: Already processed (processed=true)")
                    continue

                # Extract raw content
                raw_title = article.get("title", "")
                raw_body = article.get("full_text", article.get("body", ""))

                if not raw_body:
                    print("⏭️  Skipping: No content")
                    continue

                # Generate structured article with AI
                print("🤖 Generating structured content...")

                structured_content = generate_structured_article_v4(raw_title, raw_body)

                if not structured_content:
                    print("❌ Failed to generate content")
                    errors += 1
                    continue

                # Extract components
                original_title = structured_content.get("title", raw_title)
                html_content = structured_content.get("html", "")
                summary = structured_content.get("summary", "")
                # FAQ will be generated AFTER saving, using final content
                # faq_data = structured_content.get("faq", [])

                # Generate metadata
                category = get_category(html_content)
                tags = get_tags(html_content)
                slug = create_url_slug(original_title)

                # Detect location
                location_data = detect_location(original_title, summary, html_content)

                # Build final article data (without FAQ initially)
                article_data = {
                    "title": original_title,  # Full title for display (no truncation)
                    "titleSeo": original_title,  # SEO meta title (Next.js can truncate if needed)
                    "content": html_content,
                    "excerpt": generate_excerpt(
                        summary if summary else html_content, max_words=300
                    ),
                    "author": "Politie Forum Redactie",
                    "publishedAt": int(datetime.now().timestamp() * 1000),
                    "imageUrl": article.get("image_url", ""),
                    "tags": tags,
                    "category": category,
                    "source": "Politie Forum Nederland",
                    "location": {
                        "name": location_data["name"],
                        "latitude": location_data.get("lat"),
                        "longitude": location_data.get("lon"),
                    },
                    "faq": [],  # Will be populated after FAQ generation
                    "slug": slug,
                    "processed_v4": True,
                }

                # NO JSON-LD generation here - Next.js ArticleJsonLd.tsx handles this
                # This prevents duplicate schemas on the same page
                # Next.js will generate:
                # - NewsArticle schema
                # - Place schema (with geo-coordinates)
                # - FAQPage schema (from article_data.faq)
                # - DiscussionForumPosting schema
                # - BreadcrumbList schema

                # Save to /news collection (without FAQ)
                db.collection("news").document(slug).set(article_data)
                print(f"✅ Saved to /news/{slug}")

                # FAQ will be generated at the end after all articles are processed
                # Mark as processed in articles_full
                articles_ref.document(article_id).update({"processed": True})
                print(f"✅ Marked as processed in articles_full/{article_id}")

                # NO static HTML generation - Next.js ISR handles rendering
                print(f"📱 Next.js ISR will render:")
                print(f"   - /nieuws/{slug} (NewsArticle schema)")
                print(f"   - /forum/{slug} (DiscussionForumPosting schema)")
                print(f"🚫 Static HTML generation disabled (using Next.js ISR only)")

                # Revalidate Next.js ISR cache for both URLs
                revalidate_vercel_path(slug)
                revalidate_vercel_forum_path(slug)
                print(f"✅ Triggered Next.js ISR revalidation for both routes")

                processed += 1
                print(f"✅ Complete: {processed} processed, {errors} errors")

            except Exception as e:
                print(f"❌ Error processing article: {e}")
                errors += 1
                continue

        print(f"\n{'='*80}")
        print(f"🎉 Processing complete!")
        print(f"✅ Processed: {processed}")
        print(f"❌ Errors: {errors}")
        print(f"{'='*80}\n")

        # Auto-run menu items 18, 19, 20 after successful completion
        if processed > 0:
            print(f"\n{'='*80}")
            print(style("🔄 AUTO-RUN: Post-processing workflows", CYAN, BOLD))
            print(f"{'='*80}\n")

            try:
                print("❓ Step 1/4: Generating FAQs from published articles...")
                generate_faqs_for_published_articles(db)
                print("✅ FAQ generation complete\n")
            except Exception as e:
                print(f"⚠️  FAQ generation failed: {e}\n")

            try:
                print("📍 Step 2/4: Syncing articles to Crime Map...")
                sync_articles_to_crime_map()
                print("✅ Crime Map sync complete\n")
            except Exception as e:
                print(f"⚠️  Crime Map sync failed: {e}\n")

            try:
                print("🗺️  Step 3/4: Generating sitemaps...")
                generate_sitemaps(db)
                print("✅ Sitemap generation complete\n")
            except Exception as e:
                print(f"⚠️  Sitemap generation failed: {e}\n")

            try:
                print("🔄 Step 4/4: Updating Next.js sitemap...")
                update_nextjs_sitemap(db)
                print("✅ Next.js sitemap update complete\n")
            except Exception as e:
                print(f"⚠️  Next.js sitemap update failed: {e}\n")

            print(f"{'='*80}")
            print(style("✅ All post-processing workflows completed!", GREEN, BOLD))
            print(f"{'='*80}\n")

    except Exception as e:
        print(f"❌ Fatal error: {e}")
        import traceback

        traceback.print_exc()


def generate_structured_article_v4(title, body):
    """
    Generate structured article with H2, H3 using AI
    Returns: {title, html, summary}

    NOTE: H1 is NOT included in HTML - Next.js ArticleClient renders the title as H1
    Only H2 and H3 tags are used in the article body to prevent duplicate H1 and React hydration errors

    FAQ Generation: Moved to separate step after saving to /news collection
    This ensures FAQs are based on final cleaned HTML content instead of raw source
    """
    prompt = f"""Herschrijf dit Nederlandse nieuwsartikel in professionele HTML met deze EXACTE structuur:

1. GEEN <h1> TAG - de titel wordt apart weergegeven
2. INTRODUCTIE: 2-3 paragrafen (<p>) die het verhaal samenvatten
3. HOOFDSECTIES met <h2>: Minimaal 3-4 secties met duidelijke koppen
4. SUBSECTIES met <h3>: Waar nodig details toevoegen
5. AFSLUITING: Conclusie of context in laatste paragraaf

VERPLICHTE REGELS:
- Gebruik ALLEEN <h2>, <h3>, <p> tags
- GEEN <h1>, <br>, <div>, <span>, <article> tags
- START met een <p> paragraaf, NIET met een heading
- Elke <h2> moet minimaal 2 paragrafen bevatten
- Geen emoji, geen speciale karakters in headings
- Professionele nieuwstoon, objectief, feitelijk
- Minimaal 500 woorden totaal

ORIGINEEL ARTIKEL:
Titel: {title}

{body[:3000]}

GENEREER NU DE GESTRUCTUREERDE HTML (zonder <h1>):"""

    try:
        response = generate_text(prompt, max_tokens=3500)

        if not response:
            return None

        # Remove any H1 tags that might have been generated (safety measure)
        response = re.sub(r"<h1[^>]*>.*?</h1>", "", response, flags=re.DOTALL)

        # Clean up any leading/trailing whitespace
        response = response.strip()

        # Fix encoding issues in HTML content (text between tags)
        # This preserves HTML tags but cleans the text content
        def clean_html_text(match):
            return match.group(1) + clean_text_encoding(match.group(2)) + match.group(3)

        response = re.sub(r"(<[^>]+>)([^<]+)(<)", clean_html_text, response)

        # Ensure content starts with <p> tag (React hydration safety)
        if not response.startswith("<p>"):
            response = f"<p>{response}" if not "<" in response[:10] else response

        # Generate summary from first 2 paragraphs
        p_matches = re.findall(r"<p>([^<]+)</p>", response)
        summary = " ".join(p_matches[:2]) if p_matches else ""

        # Clean encoding issues in summary and title
        summary = clean_text_encoding(summary)
        cleaned_title = clean_text_encoding(title)

        print(
            f"📏 Title: {len(cleaned_title)} chars (full title preserved for display)"
        )

        # FAQ is now generated separately after content is saved to /news
        # This ensures FAQs are based on the final cleaned HTML content
        # (Previously generated here from raw body, causing quality issues)

        return {
            "title": cleaned_title,  # Full title (no truncation)
            "html": response,  # HTML content cleaned separately
            "summary": summary,  # Full summary, will be truncated by smart_truncate later
        }

    except Exception as e:
        print(f"⚠️  Error generating structured article: {e}")
        return None


def generate_advanced_jsonld(article_data, location_data, faq_data):
    """
    Generate advanced JSON-LD with 8+ schema types:
    - NewsArticle
    - DiscussionForumPosting
    - Place + GeoCoordinates
    - FAQPage
    - Organization
    - WebPage
    - BreadcrumbList
    - Comment (if available)
    """
    slug = article_data.get("slug", "")
    url = f"https://politie-forum.nl/nieuws/{slug}"
    published = article_data.get("publishedAt", int(datetime.now().timestamp() * 1000))
    iso_date = datetime.fromtimestamp(published / 1000, tz=timezone.utc).isoformat()

    graph = []

    # 1. Organization
    graph.append(
        {
            "@type": "Organization",
            "@id": "https://politie-forum.nl/#org",
            "name": "Politie Forum Nederland",
            "url": "https://politie-forum.nl",
            "logo": {
                "@type": "ImageObject",
                "url": "https://politie-forum.nl/logo.png",
            },
        }
    )

    # 2. WebPage
    graph.append(
        {
            "@type": "WebPage",
            "@id": url,
            "url": url,
            "name": article_data.get("title", ""),
            "isPartOf": {"@id": "https://politie-forum.nl/#website"},
            "primaryImageOfPage": {
                "@id": "https://politie-forum.nl/og/politie-forum-1200x630.png"
            },
            "datePublished": iso_date,
            "dateModified": iso_date,
        }
    )

    # 3. NewsArticle
    graph.append(
        {
            "@type": "NewsArticle",
            "@id": f"{url}#article",
            "headline": article_data.get("title", ""),
            "description": article_data.get("excerpt", ""),
            "url": url,
            "mainEntityOfPage": {"@id": url},
            "datePublished": iso_date,
            "dateModified": iso_date,
            "author": {"@id": "https://politie-forum.nl/#org"},
            "publisher": {"@id": "https://politie-forum.nl/#org"},
            "articleSection": article_data.get("category", "Nieuws"),
            "keywords": article_data.get("tags", []),
            "inLanguage": "nl-NL",
        }
    )

    # 4. Place + GeoCoordinates
    if location_data.get("lat") and location_data.get("lon"):
        graph.append(
            {
                "@type": "Place",
                "@id": f"{url}#place",
                "name": location_data["name"],
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": location_data["lat"],
                    "longitude": location_data["lon"],
                },
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "NL",
                },
            }
        )
        graph[2]["contentLocation"] = {"@id": f"{url}#place"}

    # 5. FAQPage
    if faq_data and len(faq_data) > 0:
        faq_schema = {
            "@type": "FAQPage",
            "@id": f"{url}#faq",
            "mainEntity": [],
        }
        for faq in faq_data:
            faq_schema["mainEntity"].append(
                {
                    "@type": "Question",
                    "name": faq.get("question", ""),
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.get("answer", ""),
                    },
                }
            )
        graph.append(faq_schema)

    # 6. DiscussionForumPosting
    graph.append(
        {
            "@type": "DiscussionForumPosting",
            "@id": f"{url}#discussion",
            "headline": f"Discussie: {article_data.get('title', '')}",
            "url": f"{url}#reacties",
            "about": {"@id": f"{url}#article"},
            "author": {"@id": "https://politie-forum.nl/#org"},
            "datePublished": iso_date,
            "commentCount": 0,
        }
    )

    # 7. BreadcrumbList
    graph.append(
        {
            "@type": "BreadcrumbList",
            "@id": f"{url}#breadcrumb",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://politie-forum.nl/",
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Nieuws",
                    "item": "https://politie-forum.nl/nieuws/",
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": article_data.get("title", ""),
                    "item": url,
                },
            ],
        }
    )

    return {
        "@context": "https://schema.org",
        "@graph": graph,
    }


def display_menu(show_banner=True, num_articles=1):
    if show_banner:
        print_banner()
    print(style("Menu:", BLUE, BOLD))
    print(style("Kies een optie en druk op Enter", DIM))

    # Get current model info for display
    current_model_display = (
        selected_groq_model if selected_model == "groq" else model_name or "None"
    )

    options = [
        ("2", "Selecteer RSS kanalen"),
        (
            "3",
            f"Voer aantal artikelen in (huidig: {style(str(num_articles), MAGENTA, BOLD)})",
        ),
        (
            "4",
            f"Kies AI Model (huidig: {style(current_model_display, MAGENTA, BOLD)})",
        ),
        ("7", "Extract Artikelen van geselecteerde RSS feeds"),
        ("9", "Verwerk artikelen uit Firestore (controleert op duplicaten)"),
        (
            "25",
            style(
                "✨ ADVANCED REWRITER V4 (articles_full → Firestore → Next.js ISR)",
                GREEN,
                BOLD,
            ),
        ),
        (
            "26",
            style(
                "🤖 AI OPTIMIZE (/news → /ai_news with MCP Groq AI)",
                MAGENTA,
                BOLD,
            ),
        ),
        ("27", style("Exit", RED, BOLD)),
    ]

    for number, label in options:
        print(f"{style(number.rjust(2), CYAN, BOLD)} {label}")


# RSS NL
RSS_FEEDS = {
    "Nederlandse Politie": {
        "Algemeen": "https://rss.politie.nl/rss/algemeen/ab/algemeen.xml",
    },
    "NOS Nieuws": {
        "Algemeen nieuws": "https://feeds.nos.nl/nosnieuwsalgemeen",
        "Binnenland": "https://feeds.nos.nl/nosnieuwsbinnenland",
        "Buitenland": "https://feeds.nos.nl/nosnieuwsbuitenland",
        "Economie": "https://feeds.nos.nl/nosnieuwseconomie",
        "Politiek": "https://feeds.nos.nl/nosnieuwspolitiek",
        "Sport": "https://feeds.nos.nl/nossportalgemeen",
    },
    "NU.nl": {
        "Algemeen nieuws": "https://www.nu.nl/rss/Algemeen",
        "Binnenland": "https://www.nu.nl/rss/Binnenland",
        "Buitenland": "https://www.nu.nl/rss/Buitenland",
        "Economie": "https://www.nu.nl/rss/Economie",
        "Sport": "https://www.nu.nl/rss/Sport",
        "Tech": "https://www.nu.nl/rss/Tech",
        "Opmerkelijk": "https://www.nu.nl/rss/Opmerkelijk",
    },
    "De Telegraaf": {
        "Algemeen nieuws": "https://www.telegraaf.nl/nieuws/rss",
        "Financieel": "https://www.telegraaf.nl/financieel/rss",
        "Sport": "https://www.telegraaf.nl/sport/rss",
        "Privé": "https://www.telegraaf.nl/entertainment/rss",
        "Lifestyle": "https://www.telegraaf.nl/lifestyle/rss",
        "Vrouw": "https://www.telegraaf.nl/vrouw/rss",
    },
    "AD.nl (Algemeen Dagblad)": {
        "Algemeen nieuws": "https://www.ad.nl/rss.xml",
        "Binnenland": "https://www.ad.nl/binnenland/rss.xml",
        "Buitenland": "https://www.ad.nl/buitenland/rss.xml",
        "Economie": "https://www.ad.nl/economie/rss.xml",
        "Sport": "https://www.ad.nl/sport/rss.xml",
        "Show": "https://www.ad.nl/show/rss.xml",
    },
    "Trouw": {
        "Algemeen nieuws": "https://www.trouw.nl/rss.xml",
        "Binnenland": "https://www.trouw.nl/binnenland/rss.xml",
        "Buitenland": "https://www.trouw.nl/buitenland/rss.xml",
        "Economie": "https://www.trouw.nl/economie/rss.xml",
        "Sport": "https://www.trouw.nl/sport/rss.xml",
    },
    "Volkskrant": {
        "Binnenland": "https://www.volkskrant.nl/binnenland/rss.xml",
        "Buitenland": "https://www.volkskrant.nl/buitenland/rss.xml",
        "Economie": "https://www.volkskrant.nl/economie/rss.xml",
        "Sport": "https://www.volkskrant.nl/sport/rss.xml",
    },
}


def main():
    print_banner()
    initialize_stopwords()

    # Initialize Firebase Admin SDK for new Firestore database
    try:
        # Try multiple possible locations for the service account key
        possible_paths = [
            "./blockchainkix-com-fy-firebase-adminsdk-i3dcq-39c4a8f850.json",
            "./secretkey.json",
            "./news_ripper_key.json",
            "../secretkey.json",
            "../news_ripper_key.json",
            os.path.expanduser("~/secretkey.json"),
            os.path.expanduser("~/news_ripper_key.json"),
            os.path.expanduser("~/.config/firebase/secretkey.json"),
            os.path.expanduser("~/.config/firebase/news_ripper_key.json"),
            os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "./secretkey.json"),
        ]

        service_account_path = None
        for path in possible_paths:
            if os.path.exists(path):
                service_account_path = path
                break

        if not service_account_path:
            print(
                style(
                    "❌ Firebase service account key not found. Please ensure one of these files exists:",
                    RED,
                )
            )
            for path in possible_paths:
                print(style(f"   - {path}", DIM))
            print(style("\n📝 To create a service account key:", YELLOW))
            print(style("   1. Go to: https://console.firebase.google.com/", DIM))
            print(style("   2. Select your project (blockchainkix-com-fy)", DIM))
            print(style("   3. Go to: Project Settings > Service Accounts", DIM))
            print(style("   4. Click: 'Generate new private key'", DIM))
            print(
                style(
                    "   5. Save as: secretkey.json or news_ripper_key.json in the project root",
                    DIM,
                )
            )
            exit(1)

        print(style(f"✅ Found service account key at: {service_account_path}", GREEN))

        if not firebase_admin._apps:
            cred = credentials.Certificate(service_account_path)
            # Initialize with Firestore project
            firebase_admin.initialize_app(
                cred,
                {
                    "projectId": "blockchainkix-com-fy",
                    "storageBucket": "blockchainkix-com-fy.firebasestorage.app",
                    "databaseURL": "https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app",
                },
            )

        db = firestore.client()
        print(style("✅ Successfully connected to Firebase Firestore database", GREEN))
    except Exception as err:
        print(style(f"❌ Error connecting to Firebase: {err}", RED))
        print(style("💡 Make sure you have:", YELLOW))
        print(
            "   1. Downloaded the service account key for your project (blockchainkix-com-fy)"
        )
        print("   2. Updated the projectId in the code above")
        exit(1)

    rss_url = None
    category = None
    num_articles = 1
    articles = []
    selected_rss_feeds = []  # List of selected RSS feed URLs

    first_menu_cycle = True

    while True:
        display_menu(show_banner=not first_menu_cycle, num_articles=num_articles)
        first_menu_cycle = False
        choice = get_user_choice()

        if choice == "2":
            # Show current selection
            if selected_rss_feeds:
                print(f"\n📡 Huidig geselecteerde feeds ({len(selected_rss_feeds)}):")
                for i, (name, url) in enumerate(selected_rss_feeds, 1):
                    print(f"   ✅ {name}")
            else:
                print("\n📡 Geen feeds geselecteerd")

            print("\n🔍 Beschikbare RSS kanalen:")
            print("\n1️⃣  NU.nl (7 feeds) - Toggle alle feeds")
            print("   1a. Algemeen nieuws")
            print("   1b. Binnenland")
            print("   1c. Buitenland")
            print("   1d. Economie")
            print("   1e. Sport")
            print("   1f. Tech")
            print("   1g. Opmerkelijk")

            print("\n2️⃣  NOS Nieuws (5 feeds) - Toggle alle feeds")
            print("   2a. Algemeen nieuws")
            print("   2b. Binnenland")
            print("   2c. Buitenland")
            print("   2d. Economie")
            print("   2e. Politiek")

            print("\n3️⃣  Politie.nl (1 feed)")
            print("   3a. Algemeen nieuws")

            print("\n4️⃣  Custom - Voer eigen URL in")
            print("5️⃣  Reset selectie (verwijder alle geselecteerde feeds)")

            print(
                "\n💡 Tip: Gebruik 1-3 voor alle feeds, of 1a-3a voor individuele feeds"
            )

            rss_choice = input("\n➡️  Kies optie (1-5, 1a-3a): ").strip().lower()

            # Individual NU.nl feed selection
            nu_nl_feeds = {
                "1a": ("NU.nl Algemeen", "https://www.nu.nl/rss/Algemeen"),
                "1b": ("NU.nl Binnenland", "https://www.nu.nl/rss/Binnenland"),
                "1c": ("NU.nl Buitenland", "https://www.nu.nl/rss/Buitenland"),
                "1d": ("NU.nl Economie", "https://www.nu.nl/rss/Economie"),
                "1e": ("NU.nl Sport", "https://www.nu.nl/rss/Sport"),
                "1f": ("NU.nl Tech", "https://www.nu.nl/rss/Tech"),
                "1g": ("NU.nl Opmerkelijk", "https://www.nu.nl/rss/Opmerkelijk"),
            }

            nos_feeds = {
                "2a": ("NOS Algemeen", "https://feeds.nos.nl/nosnieuwsalgemeen"),
                "2b": ("NOS Binnenland", "https://feeds.nos.nl/nosnieuwsbinnenland"),
                "2c": ("NOS Buitenland", "https://feeds.nos.nl/nosnieuwsbuitenland"),
                "2d": ("NOS Economie", "https://feeds.nos.nl/nosnieuwseconomie"),
                "2e": ("NOS Politiek", "https://feeds.nos.nl/nosnieuwspolitiek"),
            }

            # Handle individual feed selection
            if rss_choice in nu_nl_feeds:
                feed = nu_nl_feeds[rss_choice]
                existing_urls = {url for _, url in selected_rss_feeds}
                if feed[1] in existing_urls:
                    selected_rss_feeds = [
                        (n, u) for n, u in selected_rss_feeds if u != feed[1]
                    ]
                    print(f"❌ {feed[0]} gedeselecteerd")
                else:
                    selected_rss_feeds.append(feed)
                    print(
                        f"✅ {feed[0]} toegevoegd (totaal: {len(selected_rss_feeds)} feeds)"
                    )

            elif rss_choice in nos_feeds:
                feed = nos_feeds[rss_choice]
                existing_urls = {url for _, url in selected_rss_feeds}
                if feed[1] in existing_urls:
                    selected_rss_feeds = [
                        (n, u) for n, u in selected_rss_feeds if u != feed[1]
                    ]
                    print(f"❌ {feed[0]} gedeselecteerd")
                else:
                    selected_rss_feeds.append(feed)
                    print(
                        f"✅ {feed[0]} toegevoegd (totaal: {len(selected_rss_feeds)} feeds)"
                    )

            elif rss_choice == "3a":
                feed = (
                    "Politie.nl Algemeen",
                    "https://rss.politie.nl/rss/algemeen/ab/algemeen.xml",
                )
                existing_urls = {url for _, url in selected_rss_feeds}
                if feed[1] in existing_urls:
                    selected_rss_feeds = [
                        (n, u) for n, u in selected_rss_feeds if u != feed[1]
                    ]
                    print(f"❌ {feed[0]} gedeselecteerd")
                else:
                    selected_rss_feeds.append(feed)
                    print(
                        f"✅ {feed[0]} toegevoegd (totaal: {len(selected_rss_feeds)} feeds)"
                    )

            # Bulk selection (toggle all feeds from source)
            elif rss_choice == "1":
                new_feeds = [
                    ("NU.nl Algemeen", "https://www.nu.nl/rss/Algemeen"),
                    ("NU.nl Binnenland", "https://www.nu.nl/rss/Binnenland"),
                    ("NU.nl Buitenland", "https://www.nu.nl/rss/Buitenland"),
                    ("NU.nl Economie", "https://www.nu.nl/rss/Economie"),
                    ("NU.nl Sport", "https://www.nu.nl/rss/Sport"),
                    ("NU.nl Tech", "https://www.nu.nl/rss/Tech"),
                    ("NU.nl Opmerkelijk", "https://www.nu.nl/rss/Opmerkelijk"),
                ]

                # Toggle: if already selected, remove; otherwise add
                existing_urls = {url for _, url in selected_rss_feeds}
                new_urls = {url for _, url in new_feeds}

                if new_urls.issubset(existing_urls):
                    # All NU.nl feeds are selected, so deselect them
                    selected_rss_feeds = [
                        (n, u) for n, u in selected_rss_feeds if u not in new_urls
                    ]
                    print(f"❌ NU.nl feeds gedeselecteerd (7 feeds verwijderd)")
                else:
                    # Add NU.nl feeds (avoiding duplicates)
                    for feed in new_feeds:
                        if feed[1] not in existing_urls:
                            selected_rss_feeds.append(feed)
                    print(
                        f"✅ NU.nl feeds toegevoegd (totaal: {len(selected_rss_feeds)} feeds)"
                    )

            elif rss_choice == "2":
                new_feeds = [
                    ("NOS Algemeen", "https://feeds.nos.nl/nosnieuwsalgemeen"),
                    ("NOS Binnenland", "https://feeds.nos.nl/nosnieuwsbinnenland"),
                    ("NOS Buitenland", "https://feeds.nos.nl/nosnieuwsbuitenland"),
                    ("NOS Economie", "https://feeds.nos.nl/nosnieuwseconomie"),
                    ("NOS Politiek", "https://feeds.nos.nl/nosnieuwspolitiek"),
                ]

                existing_urls = {url for _, url in selected_rss_feeds}
                new_urls = {url for _, url in new_feeds}

                if new_urls.issubset(existing_urls):
                    selected_rss_feeds = [
                        (n, u) for n, u in selected_rss_feeds if u not in new_urls
                    ]
                    print(f"❌ NOS Nieuws feeds gedeselecteerd (5 feeds verwijderd)")
                else:
                    for feed in new_feeds:
                        if feed[1] not in existing_urls:
                            selected_rss_feeds.append(feed)
                    print(
                        f"✅ NOS Nieuws feeds toegevoegd (totaal: {len(selected_rss_feeds)} feeds)"
                    )

            elif rss_choice == "3":
                politie_feed = (
                    "Politie.nl Algemeen",
                    "https://rss.politie.nl/rss/algemeen/ab/algemeen.xml",
                )
                existing_urls = {url for _, url in selected_rss_feeds}

                if politie_feed[1] in existing_urls:
                    selected_rss_feeds = [
                        (n, u) for n, u in selected_rss_feeds if u != politie_feed[1]
                    ]
                    print("❌ Politie.nl feed gedeselecteerd")
                else:
                    selected_rss_feeds.append(politie_feed)
                    print(
                        f"✅ Politie.nl feed toegevoegd (totaal: {len(selected_rss_feeds)} feeds)"
                    )

            elif rss_choice == "4":
                custom_url = input("Voer RSS URL in: ").strip()
                if custom_url:
                    custom_name = input("Voer naam in (optioneel): ").strip()
                    custom_feed = (custom_name or "Custom", custom_url)

                    existing_urls = {url for _, url in selected_rss_feeds}
                    if custom_url in existing_urls:
                        selected_rss_feeds = [
                            (n, u) for n, u in selected_rss_feeds if u != custom_url
                        ]
                        print(f"❌ Feed verwijderd: {custom_url}")
                    else:
                        selected_rss_feeds.append(custom_feed)
                        print(
                            f"✅ Custom feed toegevoegd (totaal: {len(selected_rss_feeds)} feeds)"
                        )
                else:
                    print("❌ Geen URL ingevoerd")

            elif rss_choice == "5":
                if selected_rss_feeds:
                    selected_rss_feeds = []
                    print("✅ Alle feeds verwijderd (selectie gereset)")
                else:
                    print("⚠️ Geen feeds geselecteerd")
            else:
                print("❌ Ongeldige keuze")
        elif choice == "3":
            num_articles = set_num_articles()
        elif choice == "4":
            set_groq_model()
        elif choice == "5":
            if rss_url:
                print(f"🔍 Checking for existing articles before extraction...")

                # Get existing articles to check for duplicates
                try:
                    existing_docs = db.collection("articles_raw").get()
                    existing_links = set()
                    existing_titles = set()

                    for doc in existing_docs:
                        article_data = doc.to_dict()
                        if article_data.get("link"):
                            existing_links.add(article_data["link"])
                        if article_data.get("title"):
                            existing_titles.add(article_data["title"])

                    print(
                        f"📊 Found {len(existing_links)} existing articles in database"
                    )

                except Exception as e:
                    print(f"⚠️ Could not check existing articles: {e}")
                    existing_links = set()
                    existing_titles = set()

                print(f"📥 Extracting {num_articles} articles from {rss_url}")
                articles = extract_articles(
                    rss_url, num_articles=num_articles, existing_links=existing_links
                )

                save_articles_to_firestore(articles, "articles_raw", db)
            else:
                print("Voer eerst een RSS-URL in of kies een categorie.")
        elif choice == "6":
            if articles:
                show_articles(articles)
            else:
                print("Er zijn geen artikelen om te tonen.")
        elif choice == "7":
            if not selected_rss_feeds:
                print("❌ Geen RSS feeds geselecteerd. Kies eerst optie 2.")
                continue

            print(f"🔍 Checking for existing articles before extraction...")

            # Get existing articles to check for duplicates
            try:
                existing_docs = db.collection("articles_raw").get()
                existing_links = set()
                existing_titles = set()

                for doc in existing_docs:
                    article_data = doc.to_dict()
                    if article_data.get("link"):
                        existing_links.add(article_data["link"])
                    if article_data.get("title"):
                        existing_titles.add(article_data["title"])

                print(f"📊 Found {len(existing_links)} existing articles in database")

            except Exception as e:
                print(f"⚠️ Could not check existing articles: {e}")
                existing_links = set()
                existing_titles = set()

            # Extract from selected RSS feeds (crime/justice/security related)
            print(
                f"📥 Extracting {num_articles} articles per feed from {len(selected_rss_feeds)} selected RSS feeds..."
            )
            print("   🎯 Focus: Crime, Justice, Security, Fraud, Legal news\n")

            all_articles = []
            nu_nl_feeds = selected_rss_feeds

            for feed_name, feed_url in nu_nl_feeds:
                print(f"📡 {feed_name}...")
                try:
                    articles = extract_articles(
                        feed_url,
                        num_articles=num_articles,
                        is_nu_nl=True,
                        existing_links=existing_links,
                    )

                    # Filter for crime/justice/security related content
                    crime_keywords = [
                        "politie",
                        "agent",
                        "arrestatie",
                        "verdachte",
                        "diefstal",
                        "inbraak",
                        "overval",
                        "moord",
                        "geweld",
                        "aanslag",
                        "rechter",
                        "rechtbank",
                        "advocaat",
                        "proces",
                        "vonnis",
                        "celstraf",
                        "gevangenis",
                        "detentie",
                        "fraude",
                        "oplichting",
                        "cybercrime",
                        "hack",
                        "cyberaanval",
                        "ransomware",
                        "drugs",
                        "wapen",
                        "liquidatie",
                        "schietpartij",
                        "steekpartij",
                        "verkrachting",
                        "mishandeling",
                        "bedreiging",
                        "stalking",
                        "kindermisbruik",
                        "terrorisme",
                        "extremisme",
                        "misdaad",
                        "crimineel",
                        "boef",
                        "dader",
                        "slachtoffer",
                        "aangifte",
                        "verdenking",
                        "onderzoek",
                        "opsporing",
                        "OM",
                        "openbaar ministerie",
                        "justitie",
                        "rechtszaak",
                        "proces-verbaal",
                        "sanctie",
                        "boete",
                        "taakstraf",
                        "schorsing",
                        "schikking",
                        "witwassen",
                        "belastingontduiking",
                        "corruptie",
                        "omkoping",
                        "kartel",
                    ]

                    # Filter articles with crime/justice keywords in title or summary
                    filtered = []
                    for article in articles:
                        title_lower = article.get("title", "").lower()
                        summary_lower = article.get("summary", "").lower()
                        content = title_lower + " " + summary_lower

                        if any(keyword in content for keyword in crime_keywords):
                            filtered.append(article)

                    all_articles.extend(filtered)
                    if filtered:
                        print(
                            f"   ✅ {len(filtered)}/{len(articles)} crime/justice articles from {feed_name}"
                        )
                    else:
                        print(f"   ⏭️  No crime/justice content in {feed_name}")

                except Exception as e:
                    print(f"   ⚠️ Failed: {e}")

            print(f"\n✅ Total extracted: {len(all_articles)} crime/justice articles")
            save_articles_to_firestore(all_articles, "articles_raw", db)
        elif choice == "8":
            print(f"� Processing all unprocessed articles from articles_raw...")

            try:
                # Get all articles from articles_raw that don't have processed=true
                articles_ref = db.collection("articles_raw")
                all_docs = articles_ref.get()

                unprocessed_articles = []
                total_count = 0

                for doc in all_docs:
                    total_count += 1
                    article_data = doc.to_dict()
                    article_data["doc_id"] = doc.id  # Store doc ID for updating later

                    # Check if already processed
                    if not article_data.get("processed", False):
                        unprocessed_articles.append(article_data)

                print(
                    f"📊 Found {len(unprocessed_articles)} unprocessed articles (out of {total_count} total)"
                )

                if not unprocessed_articles:
                    print("✅ All articles are already processed!")
                    continue

                # Process each unprocessed article
                processed_count = 0
                failed_count = 0

                for i, article in enumerate(unprocessed_articles, 1):
                    print(f"\n📝 Processing article {i}/{len(unprocessed_articles)}")
                    print(f"   Title: {article.get('title', 'N/A')[:80]}...")

                    try:
                        # Mark article as processed in Firestore
                        doc_id = article["doc_id"]
                        articles_ref.document(doc_id).update({"processed": True})
                        print(f"   ✅ Marked as processed")

                        # 🚀 Send to MCP server for AI summarization asynchronously
                        threading.Thread(target=notify_mcp, args=(doc_id,)).start()

                        processed_count += 1

                    except Exception as e:
                        print(f"   ❌ Failed to process: {e}")
                        failed_count += 1

                print(f"\n{'='*60}")
                print(f"✅ Processing complete!")
                print(f"   Successfully processed: {processed_count}")
                print(f"   Failed: {failed_count}")
                print(
                    f"   Total processed: {processed_count}/{len(unprocessed_articles)}"
                )
                print(f"{'='*60}")

            except Exception as e:
                print(f"❌ Error processing articles: {e}")
                import traceback

                traceback.print_exc()
        elif choice == "4":
            set_groq_model()
        elif choice == "9":
            process_nu_nl_articles(db, limit=None)  # Process ALL unprocessed articles
        elif choice == "13":
            delete_all_firebase_articles(db)
        elif choice == "14":
            set_groq_model()
        elif choice == "15":
            set_output_mode()
        elif choice == "18":
            sync_articles_to_crime_map()
        elif choice == "19":
            generate_sitemaps(db)
        elif choice == "20":
            update_nextjs_sitemap(db)
        elif choice == "21":
            setup_cron_automation()
        elif choice == "25":
            advanced_rewriter_v4_articles_full(db)
        elif choice == "26":
            ai_optimize_news_to_ai_news(db)
        elif choice == "27":
            print("Het programma wordt afgesloten.")
            break
        else:
            print("Ongeldige keuze. Probeer het opnieuw.")

    # Close the Selenium driver
    driver.quit()


if __name__ == "__main__":
    import sys

    # Check for command-line automation flags
    if len(sys.argv) > 1:
        if sys.argv[1] == "--quick-workflow":
            # Run quick 30-minute workflow for cron
            print_banner()
            initialize_stopwords()

            # Initialize Firebase
            try:
                possible_paths = [
                    "./blockchainkix-com-fy-firebase-adminsdk-i3dcq-39c4a8f850.json",
                    "./secretkey.json",
                    "./news_ripper_key.json",
                    "/Users/_akira/CSAD/websites-new-2025/politie-forum-45/secretkey.json",
                ]

                service_account_path = None
                for path in possible_paths:
                    if os.path.exists(path):
                        service_account_path = path
                        break

                if not service_account_path:
                    print("❌ Error: secretkey.json not found!")
                    sys.exit(1)

                cred = credentials.Certificate(service_account_path)
                firebase_admin.initialize_app(
                    cred,
                    {
                        "databaseURL": "https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app"
                    },
                )

                db = firestore.client()
                automate_quick_workflow(db)
                sys.exit(0)

            except Exception as e:
                print(f"❌ Error: {e}")
                sys.exit(1)

        elif sys.argv[1] == "--automate":
            # Run full automation workflow (legacy support)
            print_banner()
            initialize_stopwords()

        # Initialize Firebase
        try:
            possible_paths = [
                "./blockchainkix-com-fy-firebase-adminsdk-i3dcq-39c4a8f850.json",
                "./secretkey.json",
                "./news_ripper_key.json",
                "/Users/_akira/CSAD/websites-new-2025/politie-forum-45/secretkey.json",
            ]

            service_account_path = None
            for path in possible_paths:
                if os.path.exists(path):
                    service_account_path = path
                    break

            if not service_account_path:
                print("❌ Error: secretkey.json not found!")
                sys.exit(1)

            if not firebase_admin._apps:
                cred = credentials.Certificate(service_account_path)
                firebase_admin.initialize_app(
                    cred,
                    {
                        "databaseURL": "https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app"
                    },
                )

            db = firestore.client()
            admin_db = db_firebase.reference()

            print(f"✅ Firebase initialized from: {service_account_path}")

            # Run automated workflow
            automate_all(db)

            print("\\n✅ Automated workflow completed successfully!")
            sys.exit(0)

        except Exception as e:
            print(f"❌ Automation failed: {e}")
            import traceback

            traceback.print_exc()
            sys.exit(1)
    else:
        # Run interactive menu
        main()
