package main

import (
	"fmt"
	"os"

	"github.com/alephium/alephium-balance-go/pkg/balance"
)

func main() {
	// Check if address is provided
	if len(os.Args) != 2 {
		fmt.Fprintf(os.Stderr, "Usage: %s <alephium-address>\n", os.Args[0])
		fmt.Fprintf(os.Stderr, "Example: %s 1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH\n", os.Args[0])
		os.Exit(1)
	}

	address := os.Args[1]
	nodeURL := "https://node.mainnet.alephium.org"

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
