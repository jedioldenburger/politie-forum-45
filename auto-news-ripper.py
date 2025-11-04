#!/usr/bin/env python3
"""
Auto News Ripper - Verwerkt automatisch ALLEEN nieuwe artikelen
"""

import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the main news ripper functions
from importlib import import_module


def auto_process_new_articles():
    """Automatically process only NEW articles that are not in database"""

    print("🤖 AUTO NEWS RIPPER - Alleen Nieuwe Artikelen")
    print("=" * 50)

    # Simulate menu choices:
    # 3 = Set aantal artikelen
    # 11 = Extract Politie.nl (usually has fresh content)
    # 12 = Process articles
    # 10 = AI Rewriter
    # 13 = Exit

    commands = [
        "3",  # Set aantal
        "20",  # 20 articles (to search deeper)
        "11",  # Extract Politie.nl
        "12",  # Process them
        "10",  # AI Rewrite
        "13",  # Exit
    ]

    # Write commands to temp file
    with open("/tmp/auto_news_commands.txt", "w") as f:
        f.write("\n".join(commands))

    # Run news-rip.py with auto commands
    os.system(
        "source venv/bin/activate && python3 news-rip.py < /tmp/auto_news_commands.txt"
    )

    print("\n✅ Auto processing complete!")
    print("Check: public/forum/ for new static HTML pages")


if __name__ == "__main__":
    auto_process_new_articles()
