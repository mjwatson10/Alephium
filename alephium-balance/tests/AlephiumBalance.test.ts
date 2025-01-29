import { AlephiumBalance } from '../src/alephiumBalance-class';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

// Mock the NodeProvider
const mockGetBalance = jest.fn();
jest.mock('@alephium/web3', () => ({
  NodeProvider: jest.fn().mockImplementation((url) => ({
    addresses: {
      getAddressesAddressBalance: mockGetBalance
    }
  }))
}));

describe('AlephiumBalance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBalance', () => {
    const testAddress = '1B4nx1QZe4jfVmyhc1GVVgYufm6MSD1FA6HqEE9tbAMPP';

    it('should return balance in ALPH', async () => {
      const nanoAlphBalance = '1000000000000000000'; // 1 ALPH in nanoALPH
      mockGetBalance.mockResolvedValue({
        balance: nanoAlphBalance
      });

      const balance = new AlephiumBalance();
      const result = await balance.getBalance(testAddress);
      
      expect(result).toBe('1');
      expect(mockGetBalance).toHaveBeenCalledWith(testAddress);
    });

    it('should return testnet balance in ALPH', async () => {
      const nanoAlphBalance = '1000000000000000000'; // 1 ALPH in nanoALPH
      mockGetBalance.mockResolvedValue({
        balance: nanoAlphBalance
      });

      const balance = new AlephiumBalance(process.env.ALEPHIUM_TESTNET_NODE_HOST);
      const result = await balance.getBalance(testAddress);
      
      expect(result).toBe('1');
      expect(mockGetBalance).toHaveBeenCalledWith(testAddress);
    });

    it('should handle decimal balances', async () => {
      const nanoAlphBalance = '1500000000000000000'; // 1.5 ALPH in nanoALPH
      mockGetBalance.mockResolvedValue({
        balance: nanoAlphBalance
      });

      const balance = new AlephiumBalance();
      const result = await balance.getBalance(testAddress);
      
      expect(result).toBe('1.5');
      expect(mockGetBalance).toHaveBeenCalledWith(testAddress);
    });

    it('should handle invalid addresses', async () => {
      mockGetBalance.mockRejectedValue(new Error('Invalid address format'));

      const balance = new AlephiumBalance();
      
      await expect(balance.getBalance('invalid-address')).rejects.toThrow('Invalid address format');
    });

    it('should handle invalid addresses on testnet', async () => {
      mockGetBalance.mockRejectedValue(new Error('Invalid address format'));

      const balance = new AlephiumBalance(process.env.ALEPHIUM_TESTNET_NODE_HOST);
      
      await expect(balance.getBalance('invalid-address')).rejects.toThrow('Invalid address format');
    });
  });
});
