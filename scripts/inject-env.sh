#!/bin/bash

# Default values
API_URL=${API_URL:-"https://mateusnavarro77.xyz/api/v1"}

# Update the placeholder in env.js
sed -i "s|API_URL_PLACEHOLDER|$API_URL|g" dist/projeto-cybersec-taskmanager-frontend/browser/assets/env.js

echo "Environment variables injected successfully: API_URL=$API_URL"
