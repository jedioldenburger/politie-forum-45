import requests, xml.etree.ElementTree as ET
from datetime import datetime

urls = [
    "https://politie-forum.nl/robots.txt",
    "https://politie-forum.nl/sitemap.xml",
    "https://politie-forum.nl/news-sitemap.xml",
    "https://politie-forum.nl/feed.xml",
    "https://politie-forum.nl/atom.xml",
    "https://politie-forum.nl/news-feed.xml",
]

user_agents = [
    "Googlebot",
    "Bingbot",
    "Googlebot-News",
    "DuckDuckBot",
    "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
]


def validate_xml(content):
    """Check of XML geldig is en tel aantal items."""
    try:
        root = ET.fromstring(content)
        tag = root.tag
        count = (
            len(root.findall(".//url"))
            + len(root.findall(".//entry"))
            + len(root.findall(".//item"))
        )
        return True, tag, count
    except ET.ParseError:
        return False, "—", 0


def score(url, status, ctype, xml_ok, count):
    """
    Objectieve SEO-score:
    - HTTP 200 = +2
    - Correct Content-Type = +2
    - XML geldig = +3
    - Items aanwezig (>0) = +2, leeg = +1
    - Extra punt voor specifiek gedrag:
        - robots.txt zonder XML = +1 als bereikbaar
        - sitemap met >50 items = +1 extra
    """
    s = 0
    if status == 200:
        s += 2
    if "xml" in ctype or "text/plain" in ctype:
        s += 2
    if xml_ok:
        s += 3
    if count > 0:
        s += 2
        if count > 50:
            s += 1  # extra bonus voor grote sitemap
    else:
        s += 1

    if "robots.txt" in url and status == 200 and "text/plain" in ctype:
        s += 1  # robots is goed leesbaar

    return min(s, 10)


rows = []
for url in urls:
    for agent in user_agents:
        try:
            r = requests.get(url, headers={"User-Agent": agent}, timeout=10)
            ctype = r.headers.get("Content-Type", "unknown")
            xml_ok, tag, count = (False, "", 0)
            if "xml" in ctype and r.status_code == 200:
                xml_ok, tag, count = validate_xml(r.text)
            s = score(url, r.status_code, ctype, xml_ok, count)
            rows.append(
                (
                    url,
                    agent,
                    r.status_code,
                    ctype,
                    "✅" if xml_ok else "❌",
                    tag,
                    count,
                    s,
                )
            )
        except Exception as e:
            rows.append((url, agent, "ERR", str(e), "❌", "—", 0, 0))

# Gemiddelde score berekenen
avg = round(sum(s for *_, s in rows) / len(rows), 2)

# HTML rapport genereren
html = [
    "<html><head><meta charset='utf-8'><style>",
    "body{font-family:Arial;margin:40px;background:#fafafa;color:#222}",
    "table{border-collapse:collapse;width:100%}",
    "th,td{border:1px solid #ccc;padding:6px 10px;text-align:left}",
    "th{background:#003366;color:#fff}",
    ".ok{color:#060}.bad{color:#c00}",
    "</style><title>Crawl & XML Score Report</title></head><body>",
    f"<h1>Politie Forum NL – Objectieve SEO & XML Score Rapport</h1>",
    f"<h2>Gemiddelde SEO-score: <span style='color:{'#060' if avg>=8 else '#c00'}'>{avg}/10</span></h2>",
    f"<p>Datum: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>",
    "<table><tr><th>URL</th><th>User-Agent</th><th>HTTP</th><th>Content-Type</th><th>XML</th><th>Root</th><th>Items</th><th>SEO Score</th></tr>",
]

for url, agent, status, ctype, xml_ok, tag, count, s in rows:
    html.append(
        f"<tr><td>{url}</td><td>{agent}</td><td>{status}</td>"
        f"<td>{ctype}</td><td>{xml_ok}</td><td>{tag}</td><td>{count}</td>"
        f"<td style='font-weight:bold;color:{'#060' if s>=8 else '#c00'}'>{s}/10</td></tr>"
    )

html.append(
    "</table><p>Scorelogica: HTTP=2 + Type=2 + XML=3 + Items=2 (>0) of 1 (0 items) + extra punten voor robots of grote sitemap.</p></body></html>"
)

with open("crawl_report.html", "w", encoding="utf-8") as f:
    f.write("\n".join(html))
print("Rapport opgeslagen als crawl_report.html")
