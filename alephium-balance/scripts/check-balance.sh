#!/bin/bash

# Check if an address was provided
if [ -z "$1" ]; then
    echo "Usage: $0 <alephium-address>"
    echo "Example: $0 1B4nx1QZe4jfVmyhc1GVVgYufm6MSD1FA6HqEE9tbAMPP"
    exit 1
fi

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Run the compiled JavaScript script
balance=$(node "$PROJECT_ROOT/dist/scripts/check-balance.js" "$1")
exit_code=$?

if [ $exit_code -eq 0 ]; then
    echo "$balance"
else
    echo "Failed to get balance"
    exit $exit_code
fi
