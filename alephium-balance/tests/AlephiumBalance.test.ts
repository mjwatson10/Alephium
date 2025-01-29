import { AlephiumBalance } from '../src';
import { NodeProvider } from '@alephium/web3';

// Mock the NodeProvider
const mockGetBalance = jest.fn();
const mockNodeProvider = {
  addresses: {
    getAddressesAddressBalance: mockGetBalance
  }
};

jest.mock('@alephium/web3', () => ({
  NodeProvider: jest.fn().mockImplementation(() => mockNodeProvider)
}));

describe('AlephiumBalance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default mainnet URL', () => {
      const balance = new AlephiumBalance();
      expect(balance).toBeInstanceOf(AlephiumBalance);
      expect(NodeProvider).toHaveBeenCalledWith('https://mainnet-backend.alephium.org', undefined);
    });

    it('should initialize with custom URL and API key', () => {
      const customUrl = 'http://localhost:22973';
      const apiKey = 'test-api-key';
      const balance = new AlephiumBalance(customUrl, apiKey);
      expect(balance).toBeInstanceOf(AlephiumBalance);
      expect(NodeProvider).toHaveBeenCalledWith(customUrl, apiKey);
    });
  });

  describe('getBalance', () => {
    const testAddress = '1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH';

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

    it('should handle decimal balances', async () => {
      const nanoAlphBalance = '1500000000000000000'; // 1.5 ALPH in nanoALPH
      mockGetBalance.mockResolvedValue({
        balance: nanoAlphBalance
      });

      const balance = new AlephiumBalance();
      const result = await balance.getBalance(testAddress);
      
      expect(result).toBe('1.5');
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API request failed';
      mockGetBalance.mockRejectedValue(new Error(errorMessage));

      const balance = new AlephiumBalance();
      
      await expect(balance.getBalance(testAddress)).rejects.toThrow(errorMessage);
    });

    it('should handle invalid addresses', async () => {
      mockGetBalance.mockRejectedValue(new Error('Invalid address format'));

      const balance = new AlephiumBalance();
      
      await expect(balance.getBalance('invalid-address')).rejects.toThrow('Invalid address format');
    });
  });
});
