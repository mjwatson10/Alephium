# Alephium Balance Checker

A simple library to check ALPH balances on the Alephium blockchain. Available in both TypeScript and Go implementations.

## Repository Structure

This repository contains two implementations:

1. TypeScript Implementation (`/alephium-balance/`)
   - Library for checking ALPH balances
   - CLI tool for quick balance checks
   - Comprehensive test suite

2. Go Implementation (`/alephium-balance-go/`)
   - Go package for checking ALPH balances
   - Compiled binary for command-line usage
   - Clean package structure with tests

## Requirements

### TypeScript Version
- Node.js >= 18.20.6
- npm >= 10.8.2

To update Node.js, you can:
1. Visit [Node.js official website](https://nodejs.org/)
2. Or use nvm (Node Version Manager):
   ```bash
   nvm install 18.20.6
   nvm use 18.20.6
   ```

### Go Version
- Go >= 1.20

## Configuration

Create a `.env` file in the root directory with the following structure:

```bash
# Alephium Node Configuration
ALEPHIUM_NODE_HOST=https://node.mainnet.alephium.org

# Optional: API key for private node access
# ALEPHIUM_API_KEY=your_api_key_here

# Test Configuration
TEST_ADDRESS=1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH
```

Available environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| ALEPHIUM_NODE_HOST | Alephium node URL | https://node.mainnet.alephium.org |
| ALEPHIUM_API_KEY | API key for private node access (only needed if you're running your own node) | Not required for public node |
| TEST_ADDRESS | Default address for testing | Optional |

Note: The API key is only required if you're running your own private Alephium node. When using the public mainnet node (`node.mainnet.alephium.org`), no API key is needed.

## Installation

Clone the repository:

```bash
git clone https://github.com/mjwatson10/Alephium.git
cd Alephium
```

### TypeScript Setup
```bash
cd alephium-balance
npm install
```

### Go Setup
```bash
cd alephium-balance-go
go build ./cmd/check-balance
```

## Usage

### TypeScript Library
```typescript
import { AlephiumBalance } from './src'

// Initialize with environment variables
const alephium = new AlephiumBalance(
  process.env.ALEPHIUM_NODE_HOST,
  process.env.ALEPHIUM_API_KEY
)

// Get balance
async function checkBalance() {
  try {
    const balance = await alephium.getBalance('your-alephium-address')
    console.log(`Balance: ${balance} ALPH`)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### TypeScript CLI
```bash
# Build the project
npm run build

# Check balance (using command line argument)
node dist/scripts/check-balance.js 1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH

# Or use TEST_ADDRESS from .env
node dist/scripts/check-balance.js
```

### Go CLI
```bash
# Check balance (using command line argument)
./check-balance 1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH

# Or use TEST_ADDRESS from .env
./check-balance
```

### Go Library
```go
package main

import (
    "fmt"
    "os"
    "github.com/joho/godotenv"
    "github.com/alephium/alephium-balance-go/pkg/balance"
)

func main() {
    // Load .env file
    godotenv.Load()

    // Create balance checker with environment variables
    checker := balance.NewAlephiumBalance(os.Getenv("ALEPHIUM_NODE_HOST"))
    
    // Set API key if available
    if apiKey := os.Getenv("ALEPHIUM_API_KEY"); apiKey != "" {
        checker.SetAPIKey(apiKey)
    }

    // Get balance
    balance, err := checker.GetBalance("your-alephium-address")
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error: %v\n", err)
        os.Exit(1)
    }
    fmt.Printf("Balance: %s ALPH\n", balance)
}
```

## Development

### Running Tests

TypeScript tests:
```bash
cd alephium-balance
npm test
```

Go tests:
```bash
cd alephium-balance-go
go test ./...
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

MIT License - see the [LICENSE](LICENSE) file for details
