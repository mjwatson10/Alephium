export declare class AlephiumBalance {
    private nodeProvider;
    constructor(nodeUrl?: string, apiKey?: string);
    /**
     * Get the ALPH balance of an address
     * @param address The Alephium address to check
     * @returns Promise with the balance in ALPH (as a string)
     */
    getBalance(address: string): Promise<string>;
}
