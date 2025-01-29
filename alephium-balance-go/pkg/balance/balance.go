package balance

import (
	"encoding/json"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"os"
)

// AlephiumBalance represents the balance checker for Alephium addresses
type AlephiumBalance struct {
	nodeURL string
	apiKey  string
}

// NewAlephiumBalance creates a new instance of AlephiumBalance
func NewAlephiumBalance(url string) (*AlephiumBalance, error) {
	if url == "" {
		url = "https://node.mainnet.alephium.org"
	}

	// Check if testnet URL is provided from env
	testnetURL := os.Getenv("ALEPHIUM_TESTNET_NODE_HOST")
	if testnetURL != "" && url == testnetURL {
		url = "https://node.testnet.alephium.org"
	}

	return &AlephiumBalance{
		nodeURL: url,
	}, nil
}

// GetNodeURL returns the node URL being used
func (a *AlephiumBalance) GetNodeURL() string {
	return a.nodeURL
}

// AddressInfo represents the response from the Alephium node
type AddressBalance struct {
	Balance string `json:"balance"`
}

// GetBalance retrieves the ALPH balance for a given address
func (a *AlephiumBalance) GetBalance(address string) (string, error) {
	// Create request
	url := fmt.Sprintf("%s/addresses/%s/balance", a.nodeURL, address)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	if a.apiKey != "" {
		req.Header.Set("X-API-KEY", a.apiKey)
	}

	// Make request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to get balance: %w", err)
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("failed to get balance: %s", string(body))
	}

	// Parse response
	var balance AddressBalance
	if err := json.NewDecoder(resp.Body).Decode(&balance); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	// Convert balance from nanoALPH to ALPH
	balanceInt := new(big.Int)
	balanceInt.SetString(balance.Balance, 10)

	divisor := new(big.Int)
	divisor.Exp(big.NewInt(10), big.NewInt(18), nil)

	wholePart := new(big.Int)
	decimalPart := new(big.Int)
	wholePart.DivMod(balanceInt, divisor, decimalPart)

	if decimalPart.Cmp(big.NewInt(0)) == 0 {
		return wholePart.String(), nil
	}

	// Format decimal part with proper padding
	decimalStr := fmt.Sprintf("%018s", decimalPart.String())
	decimalStr = trimTrailingZeros(decimalStr)

	return fmt.Sprintf("%s.%s", wholePart.String(), decimalStr), nil
}

func trimTrailingZeros(s string) string {
	for i := len(s) - 1; i >= 0; i-- {
		if s[i] != '0' {
			return s[:i+1]
		}
	}
	return ""
}
