#!/bin/bash
cd /home/kavia/workspace/code-generation/unified-e-commerce-platform-186146-186155/frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

