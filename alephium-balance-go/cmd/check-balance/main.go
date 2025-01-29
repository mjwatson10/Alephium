package main

import (
	"fmt"
	"os"

	"github.com/alephium/alephium-balance-go/pkg/balance"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		fmt.Printf("Warning: Error loading .env file: %v\n", err)
	}

	// Get address from command line arguments
	if len(os.Args) < 2 {
		fmt.Println("Please provide an Alephium address as an argument")
		os.Exit(1)
	}
	address := os.Args[1]

	// Create balance checker with default or testnet URL
	var nodeURL string
	if os.Getenv("ALEPHIUM_TESTNET_NODE_HOST") != "" {
		nodeURL = os.Getenv("ALEPHIUM_TESTNET_NODE_HOST")
	} else if os.Getenv("ALEPHIUM_NODE_HOST") != "" {
		nodeURL = os.Getenv("ALEPHIUM_NODE_HOST")
	}

	b, err := balance.NewAlephiumBalance(nodeURL)
	if err != nil {
		fmt.Printf("Error creating balance checker: %v\n", err)
		os.Exit(1)
	}

	// Get balance for address
	result, err := b.GetBalance(address)
	if err != nil {
		fmt.Printf("Error getting balance: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Balance for address %s: %s ALPH\n", address, result)
}
