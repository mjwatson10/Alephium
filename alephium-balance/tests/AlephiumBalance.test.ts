import { AlephiumBalance } from '../src/alephiumBalance-class';
import { NodeProvider } from '@alephium/web3';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../../.env' });

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
    process.env.ALEPHIUM_TESTNET_NODE_HOST = 'testnet-url';
  });

  describe('constructor', () => {
    it('should initialize with default mainnet URL', () => {
      const balance = new AlephiumBalance();
      expect(NodeProvider).toHaveBeenCalledWith('https://node.mainnet.alephium.org');
    });

    it('should initialize with custom URL', () => {
      const customUrl = 'http://localhost:22973';
      const balance = new AlephiumBalance(customUrl);
      expect(NodeProvider).toHaveBeenCalledWith(customUrl);
    });

    it('should initialize with testnet URL from env', () => {
      const testnetUrl = process.env.ALEPHIUM_TESTNET_NODE_HOST;
      const balance = new AlephiumBalance(testnetUrl);
      expect(NodeProvider).toHaveBeenCalledWith('https://node.testnet.alephium.org');
    });
  });

  describe('getBalance', () => {
    const testAddress = process.env.TEST_ADDRESS || '1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH';

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

    it('should handle API errors', async () => {
      mockGetBalance.mockRejectedValue(new Error('API Error'));

      const balance = new AlephiumBalance();
      
      await expect(balance.getBalance(testAddress)).rejects.toThrow('API Error');
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
