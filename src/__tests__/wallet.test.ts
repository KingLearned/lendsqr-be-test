import WalletService from '../services/walletService';
import DB from '../config/db';

jest.mock('../config/db', () => {
  const dbFn = jest.fn();
  return {
    __esModule: true,
    default: dbFn,
  };
});

// jest.mock('../config/DB');

// Wallet Unit Test
describe('WalletService - Handle Wallet Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fundUserWallet', () => {
    it('should fund user wallet and return new balance', async () => {
      const userId = 1;
      const amount = 5000;

      const incrementMock = jest.fn();
      const selectMock = jest.fn().mockReturnValue({
        first: jest.fn().mockResolvedValue({ balance: 15000 }),
      });

      (DB as unknown as jest.Mock).mockImplementation((table: string) => {
        if (table === 'wallets') {
          return {
            where: jest.fn().mockReturnValue({
              increment: incrementMock,
              select: selectMock,
            }),
          };
        }

        if (table === 'transactions') {
          return {
            insert: jest.fn().mockResolvedValue(undefined),
          };
        }

        return {};
      });

      const result = await WalletService.fundUserWallet(userId, amount);

      expect(incrementMock).toHaveBeenCalledWith('balance', amount);
      expect(result).toEqual({ balance: 15000 });
    });

    it('should throw error for zero or negative amount', async () => {
      await expect(WalletService.fundUserWallet(1, 0)).rejects.toThrow('Amount must be greater than 0');
    });

  });

  describe('withdrawFunds', () => {
    it('should withdraw funds if balance is sufficient', async () => {
      const userId = 1;
      const amount = 1000;

      const wallet = { balance: 5000 };

      const decrementMock = jest.fn().mockResolvedValue(undefined);
      const insertMock = jest.fn().mockResolvedValue(undefined);

      (DB as unknown as jest.Mock).mockImplementation((table: string) => {
        if (table === 'wallets') {
          return {
            where: jest.fn().mockReturnValue({
              first: jest.fn().mockResolvedValue(wallet),
              decrement: decrementMock,
            }),
          };
        }

        if (table === 'transactions') {
          return {
            insert: insertMock,
          };
        }

        return {};
      });

      const result = await WalletService.withdrawFunds(userId, amount);
      expect(decrementMock).toHaveBeenCalledWith('balance', amount);
      expect(insertMock).toHaveBeenCalledWith({
        sender_id: userId,
        receiver_id: null,
        amount,
        type: 'withdraw',
      });
      expect(result).toEqual({ message: 'Withdrawal successful', amount: 'NGN1,000' });
    });

    it('should throw error for insufficient balance', async () => {
      (DB as unknown as jest.Mock).mockImplementation(() => ({
        where: jest.fn(() => ({
          first: jest.fn().mockResolvedValue({ balance: 0 }),
        })),
      }));

      await expect(WalletService.withdrawFunds(1, 1000)).rejects.toThrow('Insufficient balance');
    });

    it('should throw error if amount is <= 0', async () => {
      await expect(WalletService.withdrawFunds(1, 0)).rejects.toThrow('Amount must be greater than 0');
    });

  });
});