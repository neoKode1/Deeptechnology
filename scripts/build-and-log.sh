#!/bin/bash
cd /Users/babypegasus/Desktop/prototypes/deeptech
npx next build > /tmp/deeptech-build.log 2>&1
echo "EXIT:$?" >> /tmp/deeptech-build.log

