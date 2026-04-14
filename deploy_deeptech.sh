#!/bin/bash
set -e
export PATH="/Users/babypegasus/.nvm/versions/node/v22.18.0/bin:$PATH"
cd /Users/babypegasus/Desktop/prototypes/deeptech
git status --short
git add -A
git commit -m "Humanoid hero: Neo_nimbus.png; Unitree: local G1 photo; card+hero photos taller"
git push origin main
npx vercel --prod 2>&1 | grep -E "Production:|Build Completed|Error" | head -5
echo "ALL_DONE"
