import { AlephiumBalance } from '../src'

async function main() {
  const address = process.argv[2]
  if (!address) {
    console.error('Please provide an Alephium address')
    process.exit(1)
  }

  try {
    // Connect to mainnet node
    const nodeUrl = 'https://node.mainnet.alephium.org'
    
    const balance = new AlephiumBalance(nodeUrl)
    const result = await balance.getBalance(address)
    // Output debug information
    console.log(`Raw balance: ${result}`)
    // Output the actual balance
    process.stdout.write(result)
  } catch (error: any) {
    const errorMessage = error && error.message ? error.message : String(error)
    console.error(`Error: ${errorMessage}`)
    process.exit(1)
  }
}

main().catch((error: any) => {
  const errorMessage = error && error.message ? error.message : String(error)
  console.error(`Fatal error: ${errorMessage}`)
  process.exit(1)
})
