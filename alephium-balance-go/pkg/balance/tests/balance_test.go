package test

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/alephium/alephium-balance-go/pkg/balance"
)

func TestNewAlephiumBalance(t *testing.T) {
	tests := []struct {
		name     string
		nodeURL  string
		expected string
	}{
		{
			name:     "with mainnet URL",
			nodeURL:  "https://mainnet-backend.alephium.org",
			expected: "https://mainnet-backend.alephium.org",
		},
		{
			name:     "with local node URL",
			nodeURL:  "http://localhost:22973",
			expected: "http://localhost:22973",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			balance := balance.NewAlephiumBalance(tt.nodeURL)
			if balance.NodeURL != tt.expected {
				t.Errorf("NewAlephiumBalance() nodeURL = %v, want %v", balance.NodeURL, tt.expected)
			}
		})
	}
}

func TestGetBalance(t *testing.T) {
	testAddress := "1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH"

	tests := []struct {
		name           string
		address        string
		mockResponse   string
		mockStatusCode int
		expected       string
		expectError    bool
	}{
		{
			name:           "valid balance whole number",
			address:        testAddress,
			mockResponse:   `{"balance": "1000000000000000000"}`,
			mockStatusCode: http.StatusOK,
			expected:       "1",
			expectError:    false,
		},
		{
			name:           "valid balance with decimals",
			address:        testAddress,
			mockResponse:   `{"balance": "1500000000000000000"}`,
			mockStatusCode: http.StatusOK,
			expected:       "1.5",
			expectError:    false,
		},
		{
			name:           "invalid address",
			address:        "invalid-address",
			mockResponse:   `{"message": "Invalid address format"}`,
			mockStatusCode: http.StatusBadRequest,
			expected:       "",
			expectError:    true,
		},
		{
			name:           "server error",
			address:        testAddress,
			mockResponse:   `{"message": "Internal server error"}`,
			mockStatusCode: http.StatusInternalServerError,
			expected:       "",
			expectError:    true,
		},
		{
			name:           "invalid JSON response",
			address:        testAddress,
			mockResponse:   `invalid json`,
			mockStatusCode: http.StatusOK,
			expected:       "",
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Create a test server
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				// Check request method
				if r.Method != http.MethodGet {
					t.Errorf("Expected GET request, got %s", r.Method)
				}

				// Check request path
				expectedPath := fmt.Sprintf("/addresses/%s/balance", tt.address)
				if r.URL.Path != expectedPath {
					t.Errorf("Expected path %s, got %s", expectedPath, r.URL.Path)
				}

				// Send mock response
				w.WriteHeader(tt.mockStatusCode)
				w.Write([]byte(tt.mockResponse))
			}))
			defer server.Close()

			// Create AlephiumBalance instance with test server URL
			balance := balance.NewAlephiumBalance(server.URL)

			// Call GetBalance
			result, err := balance.GetBalance(tt.address)

			// Check error
			if tt.expectError && err == nil {
				t.Error("Expected error but got none")
			}
			if !tt.expectError && err != nil {
				t.Errorf("Unexpected error: %v", err)
			}

			// Check result
			if !tt.expectError && result != tt.expected {
				t.Errorf("GetBalance() = %v, want %v", result, tt.expected)
			}
		})
	}
}
