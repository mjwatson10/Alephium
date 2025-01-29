# Alephium Balance Checker

A simple tool to check Alephium wallet balances, implemented in both TypeScript and Go.

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

## Environment Setup

Create a `.env` file in the root directory with the following content:

```env
# Alephium Node Configuration
ALEPHIUM_NODE_HOST=https://node.mainnet.alephium.org

# Alephium Node testnet Configuration
ALEPHIUM_TESTNET_NODE_HOST=https://node.testnet.alephium.org
```

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

## Installation

### TypeScript Version
```bash
cd alephium-balance
npm install
npm run build
```

### Go Version
```bash
cd alephium-balance-go
go build ./cmd/check-balance
```


## Usage

### TypeScript CLI

There are two ways to check balances using the TypeScript version:

1. Using the shell script (recommended):
```bash
cd alephium-balance
chmod +x scripts/check-balance.sh
./scripts/check-balance.sh 1B4nx1QZe4jfVmyhc1GVVgYufm6MSD1FA6HqEE9tbAMPP
```

### Go CLI

There are two ways to check balances using the Go version:

1. Using the library script (recommended):
```bash
cd alephium-balance-go
chmod +x scripts/check-balance-go-lib.sh
./scripts/check-balance-go-lib.sh 1B4nx1QZe4jfVmyhc1GVVgYufm6MSD1FA6HqEE9tbAMPP
```
This script will automatically build the binary if it doesn't exist and handle any errors gracefully.

2. Using the binary directly:
```bash
cd alephium-balance-go
./check-balance 1B4nx1QZe4jfVmyhc1GVVgYufm6MSD1FA6HqEE9tbAMPP
```


## Running Tests

### TypeScript Tests
```bash
cd alephium-balance
npm test
```

### Go Tests
```bash
cd alephium-balance-go
go test
```

## License

MIT License - see the [LICENSE](LICENSE) file for details
