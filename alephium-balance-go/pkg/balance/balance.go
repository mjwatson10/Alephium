package balance

import (
	"encoding/json"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"strings"
)

// AlephiumBalance represents the balance checker for Alephium addresses
type AlephiumBalance struct {
	NodeURL string
}

// AddressInfo represents the response from the Alephium node
type AddressInfo struct {
	Balance string `json:"balance"`
}

// NewAlephiumBalance creates a new instance of AlephiumBalance
func NewAlephiumBalance(nodeURL string) *AlephiumBalance {
	return &AlephiumBalance{
		NodeURL: nodeURL,
	}
}

// GetBalance retrieves the ALPH balance for a given address
func (a *AlephiumBalance) GetBalance(address string) (string, error) {
	// Build the URL
	url := fmt.Sprintf("%s/addresses/%s/balance", a.NodeURL, address)

	// Make the request
	resp, err := http.Get(url)
	if err != nil {
		return "", fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	// Check if response is successful
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
	}

	// Parse the response
	var info AddressInfo
	if err := json.Unmarshal(body, &info); err != nil {
		return "", fmt.Errorf("failed to parse response: %w", err)
	}

	// Convert balance from nanoALPH to ALPH
	balance := new(big.Int)
	balance.SetString(info.Balance, 10)

	// 1 ALPH = 10^18 nanoALPH
	divisor := new(big.Int).Exp(big.NewInt(10), big.NewInt(18), nil)
	
	// Calculate whole and decimal parts
	wholePart := new(big.Int)
	decimalPart := new(big.Int)
	wholePart.DivMod(balance, divisor, decimalPart)

	// If there's no decimal part, return just the whole part
	if decimalPart.Cmp(big.NewInt(0)) == 0 {
		return wholePart.String(), nil
	}

	// Format decimal part with proper padding and remove trailing zeros
	decimalStr := fmt.Sprintf("%018s", decimalPart.String())
	decimalStr = strings.TrimRight(decimalStr, "0")

	return fmt.Sprintf("%s.%s", wholePart.String(), decimalStr), nil
}
