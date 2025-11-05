#!/bin/bash
# Politie Forum Nederland - Crawl Accessibility Test
# Save as: check_crawlers.sh  →  chmod +x check_crawlers.sh

URLS=(
  "https://politie-forum.nl/robots.txt"
  "https://politie-forum.nl/sitemap.xml"
  "https://politie-forum.nl/news-sitemap.xml"
  "https://politie-forum.nl/feed.xml"
  "https://politie-forum.nl/atom.xml"
  "https://politie-forum.nl/news-feed.xml"
)

USER_AGENTS=(
  "Googlebot"
  "Bingbot"
  "Googlebot-News"
  "DuckDuckBot"
  "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)"
)

echo "==== Politie Forum Nederland Crawl Test ===="
for URL in "${URLS[@]}"; do
  echo ""
  echo "Checking: $URL"
  for AGENT in "${USER_AGENTS[@]}"; do
    CODE=$(curl -A "$AGENT" -o /dev/null -s -w "%{http_code}" "$URL")
    TYPE=$(curl -A "$AGENT" -sI "$URL" | grep -i "Content-Type")
    echo "  $AGENT → HTTP $CODE | $TYPE"
  done
done
echo "============================================"