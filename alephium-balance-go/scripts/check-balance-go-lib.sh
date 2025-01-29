#!/bin/bash

# Function to print usage
print_usage() {
    echo "Usage: $0 <alephium-address>"
    echo "Example: $0 1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH"
    exit 1
}

# Check if an address was provided
if [ -z "$1" ]; then
    print_usage
fi

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Check if the Go binary exists, if not build it
if [ ! -f "$PROJECT_ROOT/check-balance" ]; then
    echo "Building check-balance binary..."
    cd "$PROJECT_ROOT" && go build ./cmd/check-balance
    if [ $? -ne 0 ]; then
        echo "Failed to build check-balance binary"
        exit 1
    fi
fi

# Run the balance check
balance=$("$PROJECT_ROOT/check-balance" "$1")
exit_code=$?

if [ $exit_code -eq 0 ]; then
    echo "$balance"
else
    echo "Failed to get balance: $balance"
    exit $exit_code
fi
