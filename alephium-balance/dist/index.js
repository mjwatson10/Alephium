"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlephiumBalance = void 0;
const web3_1 = require("@alephium/web3");
class AlephiumBalance {
    constructor(nodeUrl = 'https://node-mainnet.alephium.org', apiKey) {
        this.nodeProvider = new web3_1.NodeProvider(nodeUrl, apiKey);
        web3_1.web3.setCurrentNodeProvider(nodeUrl);
    }
    /**
     * Get the ALPH balance of an address
     * @param address The Alephium address to check
     * @returns Promise with the balance in ALPH (as a string)
     */
    async getBalance(address) {
        try {
            const addressInfo = await this.nodeProvider.addresses.getAddressesAddressBalance(address);
            // Convert balance from smallest unit (nanoALPH) to ALPH (1 ALPH = 10^18 nanoALPH)
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
        }
        catch (error) {
            throw new Error(`Failed to get balance for address ${address}: ${error}`);
        }
    }
}
exports.AlephiumBalance = AlephiumBalance;
