#!/usr/bin/env node

import { AlephiumBalance } from '../src/alephiumBalance-class.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env file in project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

async function main() {
  // Get address from command line arguments
  const address = process.argv[2];
  if (!address) {
    console.error('Please provide an Alephium address as an argument');
    console.error('Example: npm run check-balance 1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH');
    process.exit(1);
  }

  // Create balance checker with default or testnet URL
  const nodeURL = process.env.ALEPHIUM_TESTNET_NODE_HOST || process.env.ALEPHIUM_NODE_HOST;
  const balance = new AlephiumBalance(nodeURL);

  try {
    // Get balance for address
    const result = await balance.getBalance(address);
    console.log(`${result} ALPH`);
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
