# Alephium Balance Checker (Go)

A simple command-line tool to check the balance of an Alephium address.

## Requirements

- Go 1.16 or higher

## Installation

```bash
go install github.com/alephium/alephium-balance-go/cmd/check-balance@latest
```

Or clone the repository and build manually:

```bash
git clone https://github.com/alephium/alephium-balance-go.git
cd alephium-balance-go
go build ./cmd/check-balance
```

## Usage

```bash
./check-balance <alephium-address>
```

Example:
```bash
./check-balance 1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH
```

## Features

- Connects to Alephium mainnet node
- Converts nanoALPH to ALPH with proper decimal formatting
- Simple and easy to use command-line interface
- Error handling for invalid addresses and network issues

## Library Usage

You can also use the balance checker as a library in your Go code:

```go
package main

import (
    "fmt"
    "github.com/alephium/alephium-balance-go/pkg/balance"
)

func main() {
    checker := balance.NewAlephiumBalance("https://node.mainnet.alephium.org")
    balance, err := checker.GetBalance("1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH")
    if err != nil {
        panic(err)
    }
    fmt.Printf("Balance: %s ALPH\n", balance)
}
```
