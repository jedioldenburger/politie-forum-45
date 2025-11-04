#!/bin/bash
# Setup cron job for 30-minute automated workflow
# This runs: NU.nl Extract → Process → Rewrite → Publish → Crime Map → Sitemaps

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_PATH=$(which python3)
LOG_DIR="$SCRIPT_DIR/logs"

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

echo "🤖 Setting up 30-minute cron automation for Politie Forum"
echo "=================================================="
echo ""
echo "Script location: $SCRIPT_DIR/news-rip.py"
echo "Python path: $PYTHON_PATH"
echo "Log directory: $LOG_DIR"
echo ""

# Create the cron job command
CRON_CMD="*/30 * * * * cd $SCRIPT_DIR && $PYTHON_PATH news-rip.py --quick-workflow >> $LOG_DIR/quick-workflow-\$(date +\%Y\%m\%d).log 2>&1"

echo "Cron command to be added:"
echo "$CRON_CMD"
echo ""

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "news-rip.py --quick-workflow"; then
    echo "⚠️  Cron job already exists!"
    echo ""
    echo "Current crontab:"
    crontab -l | grep "news-rip.py"
    echo ""
    read -p "Do you want to replace it? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled. No changes made."
        exit 0
    fi
    # Remove old cron job
    crontab -l 2>/dev/null | grep -v "news-rip.py --quick-workflow" | crontab -
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -

echo ""
echo "✅ Cron job successfully added!"
echo ""
echo "📋 Current crontab:"
crontab -l | grep "news-rip.py"
echo ""
echo "⏰ Schedule: Every 30 minutes"
echo "📝 Logs: $LOG_DIR/quick-workflow-YYYYMMDD.log"
echo ""
echo "Workflow steps (options 8→9→16→17→18→19):"
echo "  1. Extract NU.nl articles (option 8)"
echo "  2. Process for full content (option 9)"
echo "  3. AI rewrite + publish (option 16)"
echo "  4. Publish remaining to /news (option 17)"
echo "  5. Sync to Crime Map (option 18)"
echo "  6. Generate sitemaps (option 19)"
echo ""
echo "🚀 Automation is now running every 30 minutes!"
echo "📊 Check logs at: $LOG_DIR/"
echo ""
echo "To view the cron job: crontab -l"
echo "To remove the cron job: crontab -e (then delete the line)"
echo "To view logs: tail -f $LOG_DIR/quick-workflow-\$(date +%Y%m%d).log"
