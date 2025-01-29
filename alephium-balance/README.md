# Alephium Balance Checker

A simple library to check ALPH balances on the Alephium blockchain.

## Requirements

- Node.js >= 18.20.6
- npm >= 10.8.2

To update Node.js, you can:
1. Visit [Node.js official website](https://nodejs.org/)
2. Or use nvm (Node Version Manager):
   ```bash
   nvm install 18.20.6
   nvm use 18.20.6
   ```

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/alephium-balance.git
cd alephium-balance
npm install
```

## Usage

```typescript
import { AlephiumBalance } from './src'

// Initialize with mainnet node
const alephium = new AlephiumBalance('https://node.mainnet.alephium.org')

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

## Command Line Usage

The package includes a command-line script to check balances:

```bash
./scripts/check-balance.sh <alephium-address>
```

Example:
```bash
./scripts/check-balance.sh 1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH
```

## Features

- Connects to Alephium mainnet node
- Converts nanoALPH to ALPH with proper decimal formatting
- Handles both whole number and decimal balances
- Provides both library and command-line interfaces
- Includes detailed error handling and reporting

## Development

1. Make sure you have Node.js >= 18.20.6
2. Clone this repository
3. Run `npm install`
4. Make your changes
5. Run tests with `npm test`

## License

ISC
