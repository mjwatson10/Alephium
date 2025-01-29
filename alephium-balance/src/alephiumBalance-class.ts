import { NodeProvider } from '@alephium/web3';

export class AlephiumBalance {
  private readonly nodeProvider: NodeProvider;
  private static readonly DEFAULT_MAINNET_URL = process.env.ALEPHIUM_NODE_HOST ?? 'https://node.mainnet.alephium.org';

  constructor(url: string = AlephiumBalance.DEFAULT_MAINNET_URL) {
    // If testnet URL is provided, use testnet node
    const actualUrl = url === process.env.ALEPHIUM_TESTNET_NODE_HOST 
      ? process.env.ALEPHIUM_TESTNET_NODE_HOST
      : url;
    this.nodeProvider = new NodeProvider(actualUrl);
  }

  async getBalance(address: string): Promise<string> {
    try {
      const addressInfo = await this.nodeProvider.addresses.getAddressesAddressBalance(address);
      const balance = BigInt(addressInfo.balance);
      const divisor = BigInt(10 ** 18);
      const wholePart = balance / divisor;
      const decimalPart = balance % divisor;

      // If there's no decimal part, return just the whole part
      if (decimalPart === BigInt(0)) {
        return wholePart.toString();
      }

      // Format decimal part with proper padding and remove trailing zeros
      const decimalStr = decimalPart.toString().padStart(18, '0').replace(/0+$/, '');
      return `${wholePart}.${decimalStr}`;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  }
}
