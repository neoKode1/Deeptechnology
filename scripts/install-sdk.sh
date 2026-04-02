#!/bin/bash
cd /Users/babypegasus/Desktop/prototypes/deeptech
npm install @anthropic-ai/sdk 2>&1
echo "---INSTALL DONE---"
ls node_modules/@anthropic-ai/sdk/package.json 2>/dev/null && echo "SDK_OK" || echo "SDK_FAIL"

