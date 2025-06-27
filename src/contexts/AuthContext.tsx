import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from "@/utils/api";

// In a real app, you would define these types based on your API response
// and likely move them to a central types file.
export interface User {
  id: string;
  username: string;
  firstName: string;
  country: string;
  email: string;
  role: 'player' | 'admin' | 'staff';
  walletBalance: number;
  registeredTournamentIds: string[];
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  updateUser: (data: Partial<Pick<User, 'firstName' | 'country'>>) => Promise<void>;
  updateWalletBalance: (amount: number) => Promise<void>;
  updateAvatar: (avatarFile: File) => Promise<void>;
  changePassword: (data: { currentPassword: string, newPassword: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const realAuthService = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
    return response.data;
  },
  register: async (data: any): Promise<any> => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, data);
    return response.data;
  },
  changePassword: async (data: { currentPassword: string, newPassword: string }, token: string): Promise<void> => {
    await axios.put(`${API_BASE_URL}/api/users/change-password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUserJSON = localStorage.getItem('authUser');
      if (storedToken && storedUserJSON) {
        const storedUser = JSON.parse(storedUserJSON) as User;
        
        // Ensure avatarUrl exists for users stored before this feature was added
        if (!storedUser.avatarUrl) {
          storedUser.avatarUrl = '/placeholder.svg';
          localStorage.setItem('authUser', JSON.stringify(storedUser));
        }

        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Failed to parse auth user from localStorage", error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('authUser');
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = useCallback((userData: any, userToken: string) => {
    const avatarUrl = userData.avatar ? `${API_BASE_URL}${userData.avatar}` : '/placeholder.svg';
    const clientUser: User = {
        id: userData.id,
        username: userData.username,
        firstName: userData.firstName,
        country: userData.country,
        email: userData.email,
        role: userData.role,
        walletBalance: parseFloat(userData.balance),
        registeredTournamentIds: [], // This seems to be missing from server response
        avatarUrl: avatarUrl
    };

    localStorage.setItem('authToken', userToken);
    localStorage.setItem('authUser', JSON.stringify(clientUser));
    setUser(clientUser);
    setToken(userToken);
    navigate('/dashboard');
  }, [navigate]);

  const login = useCallback(async (data: any) => {
    try {
      const { token, user } = await realAuthService.login(data.email, data.password);
      handleAuthSuccess(user, token);
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }, [handleAuthSuccess]);

  const register = useCallback(async (data: any) => {
    try {
      await realAuthService.register(data);
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }, []);

  const updateUser = useCallback(async (data: Partial<Pick<User, 'firstName' | 'country'>>) => {
    if (!token || !user) {
        throw new Error("You must be logged in to update your profile.");
    }
    
    try {
        const response = await axios.put(`${API_BASE_URL}/api/users/profile`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const updatedUserFromServer = response.data.user;

        const updatedUser: User = {
            ...user,
            firstName: updatedUserFromServer.firstName,
            country: updatedUserFromServer.country,
        };

        setUser(updatedUser);
        localStorage.setItem('authUser', JSON.stringify(updatedUser));
    } catch (error: any) {
        throw error.response?.data || error;
    }
  }, [token, user]);

  const updateWalletBalance = useCallback(async (amount: number) => {
    if (!user || !token) {
      throw new Error("You must be logged in to update your wallet.");
    }
    
    try {
      const endpoint = amount > 0 ? '/api/users/wallet/deposit' : '/api/users/wallet/withdraw';
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
        amount: Math.abs(amount),
        currency: 'USDT'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { newBalance } = response.data;
      const updatedUser = { ...user, walletBalance: parseFloat(newBalance) };
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }, [user, token]);

  const updateAvatar = useCallback(async (avatarFile: File) => {
    if (!token) {
      throw new Error("You must be logged in to update your avatar.");
    }

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await axios.put(`${API_BASE_URL}/api/users/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });

    const { avatar: newAvatarPath } = response.data;

    if (user) {
      const newAvatarUrl = newAvatarPath ? `${API_BASE_URL}${newAvatarPath}` : '/placeholder.svg';
      const updatedUser = { ...user, avatarUrl: newAvatarUrl };
      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
    }
  }, [token, user]);

  const changePassword = useCallback(async (data: { currentPassword: string, newPassword: string }) => {
    if (!user || !token) {
      throw new Error("You must be logged in to change your password.");
    }
    try {
      await realAuthService.changePassword(data, token);
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }, [user, token]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    setToken(null);
    navigate('/');
  }, [navigate]);

  const contextValue = useMemo(() => ({
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    updateUser,
    updateWalletBalance,
    updateAvatar,
    changePassword
  }), [
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    updateUser,
    updateWalletBalance,
    updateAvatar,
    changePassword
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
