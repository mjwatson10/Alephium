import { NodeProvider } from '@alephium/web3';

export class AlephiumBalance {
  private nodeProvider: NodeProvider;

  constructor(url: string = 'https://mainnet-backend.alephium.org', apiKey?: string) {
    this.nodeProvider = new NodeProvider(url, apiKey);
  }

  async getBalance(address: string): Promise<string> {
    try {
      const addressInfo = await this.nodeProvider.addresses.getAddressesAddressBalance(address);
      const balanceBigInt = BigInt(addressInfo.balance);
      const wholePart = balanceBigInt / BigInt(10 ** 18);
      const decimalPart = balanceBigInt % BigInt(10 ** 18);
      
      if (decimalPart === BigInt(0)) {
        return wholePart.toString();
      }
      
      // Convert decimal part to string and pad with leading zeros
      let decimalStr = decimalPart.toString().padStart(18, '0');
      // Remove trailing zeros
      decimalStr = decimalStr.replace(/0+$/, '');
      
      return `${wholePart}.${decimalStr}`;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  }
}
