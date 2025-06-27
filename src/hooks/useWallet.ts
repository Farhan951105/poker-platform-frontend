import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';

export interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'buyin' | 'prize' | 'refund' | 'adjust';
  amount: string;
  currency: 'USDT' | 'USDC' | 'BTC' | 'ETH';
  status: 'pending' | 'confirmed' | 'failed';
  provider: 'stripe' | 'oxapay' | 'system';
  createdAt: string;
  ref?: string;
}

export interface WalletHistory {
  transactions: Transaction[];
  total: number;
}

export const useWallet = () => {
  const [history, setHistory] = useState<WalletHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const getWalletHistory = async (limit = 20, offset = 0) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/wallet/history`, {
        params: { limit, offset },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistory(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load wallet history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getWalletHistory();
  }, [token]);

  return {
    history,
    isLoading,
    error,
    getWalletHistory,
  };
}; 