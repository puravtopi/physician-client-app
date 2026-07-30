#!/usr/bin/env bash
set -euo pipefail

echo "Installing dependencies..."
npm install

echo "Building Angular app..."
npm run build

echo "Deploy build completed."
