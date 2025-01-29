import { AlephiumBalance } from '../src'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '../../.env' })

async function main() {
  const address = process.argv[2] || process.env.TEST_ADDRESS
  if (!address) {
    console.error('Please provide an Alephium address')
    process.exit(1)
  }

  try {
    // Connect to mainnet node using environment variables
    const nodeUrl = process.env.ALEPHIUM_NODE_HOST || 'https://node.mainnet.alephium.org'
    
    const balance = new AlephiumBalance(nodeUrl)
    const result = await balance.getBalance(address)
    console.log(`Balance: ${result} ALPH`)
  } catch (error: any) {
    const errorMessage = error && error.message ? error.message : String(error)
    console.error(`Error: ${errorMessage}`)
    process.exit(1)
  }
}

main()
