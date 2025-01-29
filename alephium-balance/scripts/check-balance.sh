#!/bin/bash

# Check if an address was provided
if [ -z "$1" ]; then
    echo "Usage: $0 <alephium-address>"
    echo "Example: $0 1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH"
    exit 1
fi

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Run the TypeScript script with ts-node and capture its output
balance=$(node -r ts-node/register "$SCRIPT_DIR/check-balance.ts" "$1")
exit_code=$?

if [ $exit_code -eq 0 ]; then
    echo "$balance ALPH"
else
    echo "Failed to get balance"
    exit $exit_code
fi
