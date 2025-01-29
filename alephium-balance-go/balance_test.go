package tests

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/alephium/alephium-balance-go/pkg/balance"
)

func TestGetBalance(t *testing.T) {
	const testAddress = "1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH"

	tests := []struct {
		name       string
		balance    string
		wantResult string
		wantErr    bool
		statusCode int
	}{
		{
			name:       "whole number balance",
			balance:    "1000000000000000000",
			wantResult: "1",
			statusCode: http.StatusOK,
		},
		{
			name:       "decimal balance",
			balance:    "1500000000000000000",
			wantResult: "1.5",
			statusCode: http.StatusOK,
		},
		{
			name:       "zero balance",
			balance:    "0",
			wantResult: "0",
			statusCode: http.StatusOK,
		},
		{
			name:       "large balance",
			balance:    "123456789000000000000",
			wantResult: "123.456789",
			statusCode: http.StatusOK,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(tt.statusCode)
				if tt.statusCode == http.StatusOK {
					response := struct {
						Balance string `json:"balance"`
					}{
						Balance: tt.balance,
					}
					json.NewEncoder(w).Encode(response)
				}
			}))
			defer server.Close()

			b, err := balance.NewAlephiumBalance(server.URL)
			if err != nil {
				t.Fatal(err)
			}

			got, err := b.GetBalance(testAddress)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetBalance() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.wantResult {
				t.Errorf("GetBalance() = %v, want %v", got, tt.wantResult)
			}
		})
	}
}

func TestGetBalanceInvalidAddress(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintln(w, "Invalid address format")
	}))
	defer server.Close()

	b, err := balance.NewAlephiumBalance(server.URL)
	if err != nil {
		t.Fatal(err)
	}

	_, err = b.GetBalance("invalid-address")
	if err == nil {
		t.Error("GetBalance() expected error for invalid address")
	}
}
