#!/bin/bash
cd /Users/babypegasus/Desktop/prototypes/deeptech

echo "=== GIT STATUS ==="
git status --short

echo ""
echo "=== STAGING ==="
git add -A
git status --short

echo ""
echo "=== COMMITTING ==="
git commit -m "Add order tracking page with fulfillment timeline and AI chat widget

- Create /orders/[id] page with orange-to-green progress timeline
- Add Deep Tech Concierge chat widget powered by Claude
- Add /api/chat endpoint with customer-facing system prompt
- Add fulfillment stages to QuoteStatus type
- Update checkout success page to link to order tracking
- Fix apostrophe syntax error in chat route"

echo ""
echo "=== PUSHING ==="
git push origin main

echo ""
echo "=== DONE ==="

