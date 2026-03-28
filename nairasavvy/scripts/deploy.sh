#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# NairaSavvy Manual Deploy Script
# Usage: bash scripts/deploy.sh
# Requires: VERCEL_TOKEN env variable set
# ─────────────────────────────────────────────────────────────────────────────

set -e  # Exit on any error

echo ""
echo "═══════════════════════════════════════════════"
echo "  NairaSavvy — Production Deploy"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "═══════════════════════════════════════════════"
echo ""

# ── 1. Check token ───────────────────────────────────────────────────────────
if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌  ERROR: VERCEL_TOKEN is not set."
  echo "    Run: export VERCEL_TOKEN=your_token_here"
  exit 1
fi
echo "✓  Token found"

# ── 2. Ensure we're in the right directory ───────────────────────────────────
if [ ! -f "package.json" ]; then
  echo "❌  ERROR: Not in the nairasavvy project directory."
  echo "    Run: cd /path/to/nairasavvy && bash scripts/deploy.sh"
  exit 1
fi
PROJECT_NAME=$(cat package.json | python3 -c "import json,sys; print(json.load(sys.stdin)['name'])")
echo "✓  Project: $PROJECT_NAME"

# ── 3. TypeScript check ──────────────────────────────────────────────────────
echo ""
echo "→  Running TypeScript check..."
npx tsc --noEmit
echo "✓  TypeScript: OK"

# ── 4. Build ─────────────────────────────────────────────────────────────────
echo ""
echo "→  Building..."
npm run build
echo "✓  Build: OK"

# ── 5. Deploy to production ──────────────────────────────────────────────────
echo ""
echo "→  Deploying to Vercel (production)..."

DEPLOY_OUTPUT=$(VERCEL_ORG_ID=team_9T8GlkyVrh47bTdRyP5ctH1Y \
  vercel --prod --yes --token "$VERCEL_TOKEN" 2>&1)

DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -E "https://" | tail -1)

# ── 6. Save URL and report ───────────────────────────────────────────────────
echo "$DEPLOY_URL" > .last-deploy-url

echo ""
echo "═══════════════════════════════════════════════"
echo "  ✅  DEPLOYED SUCCESSFULLY"
echo "  🌍  Live URL: $DEPLOY_URL"
echo "  ⏱   $(date '+%Y-%m-%d %H:%M:%S')"
echo "═══════════════════════════════════════════════"
echo ""
