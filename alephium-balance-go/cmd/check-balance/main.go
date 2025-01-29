package main

import (
	"fmt"
	"os"
	"github.com/joho/godotenv"
	"path/filepath"
	"github.com/alephium/alephium-balance-go/pkg/balance"
)

func main() {
	// Load .env file from project root
	projectRoot := filepath.Join(filepath.Dir(os.Args[0]), "../..")
	if err := godotenv.Load(filepath.Join(projectRoot, ".env")); err != nil {
		fmt.Fprintf(os.Stderr, "Warning: Error loading .env file: %v\n", err)
	}

	// Check if address is provided as argument or in environment
	var address string
	if len(os.Args) > 1 {
		address = os.Args[1]
	} else {
		address = os.Getenv("TEST_ADDRESS")
	}

	if address == "" {
		fmt.Fprintf(os.Stderr, "Usage: %s <alephium-address>\n", os.Args[0])
		fmt.Fprintf(os.Stderr, "Example: %s 1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH\n", os.Args[0])
		os.Exit(1)
	}

	// Get node URL from environment or use default
	nodeURL := os.Getenv("ALEPHIUM_NODE_HOST")
	if nodeURL == "" {
		nodeURL = "https://node.mainnet.alephium.org"
	}

	// Create balance checker
	checker := balance.NewAlephiumBalance(nodeURL)

	// Get balance
	result, err := checker.GetBalance(address)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	// Print balance
	fmt.Printf("%s ALPH\n", result)
}
