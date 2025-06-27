import axios from 'axios';

export const API_BASE_URL = "http://localhost:5000"; // Change this to your backend URL/port if different 

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  
  verifyEmail: async (token: string) => {
    const response = await api.post('/api/auth/verify-email', { token });
    return response.data;
  },
  
  resendVerification: async (email: string) => {
    const response = await api.post('/api/auth/resend-verification', { email });
    return response.data;
  },
  
  forgotPassword: async (email: string) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },
  
  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/api/auth/reset-password', { token, password });
    return response.data;
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/api/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },
  
  updateProfile: async (userData: any) => {
    const response = await api.put('/api/users/profile', userData);
    return response.data;
  },
  
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/api/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getWallet: async () => {
    const response = await api.get('/api/users/wallet');
    return response.data;
  },
  
  getTransactions: async () => {
    const response = await api.get('/api/users/transactions');
    return response.data;
  },
  
  deposit: async (amount: number, currency: string) => {
    const response = await api.post('/api/users/wallet/deposit', { amount, currency });
    return response.data;
  },
  
  withdraw: async (amount: number, currency: string) => {
    const response = await api.post('/api/users/wallet/withdraw', { amount, currency });
    return response.data;
  },
};

// Tournament API
export const tournamentAPI = {
  getAllTournaments: async () => {
    const response = await api.get('/api/users/tournaments');
    return response.data;
  },
  
  getTournamentById: async (id: string) => {
    const response = await api.get(`/api/users/tournaments/${id}`);
    return response.data;
  },
  
  registerForTournament: async (tournamentId: string) => {
    const response = await api.post(`/api/users/tournaments/${tournamentId}/register`);
    return response.data;
  },
  
  unregisterFromTournament: async (tournamentId: string) => {
    const response = await api.delete(`/api/users/tournaments/${tournamentId}/register`);
    return response.data;
  },
  
  getTournamentRegistrations: async (tournamentId: string) => {
    const response = await api.get(`/api/users/tournaments/${tournamentId}/players`);
    return response.data;
  },
  
  getHandHistory: async (tournamentId?: string, limit = 50, offset = 0) => {
    const params = new URLSearchParams();
    if (tournamentId) params.append('tournamentId', tournamentId);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    const response = await api.get(`/api/admin/tournaments/hand-history?${params}`);
    return response.data;
  },
};

// Cash Games API
export const cashGamesAPI = {
  getCashGames: async () => {
    const response = await api.get('/api/cash-games');
    return response.data;
  },
  
  joinCashGame: async (gameId: string, buyIn: number) => {
    const response = await api.post(`/api/cash-games/${gameId}/join`, { buyIn });
    return response.data;
  },
  
  leaveCashGame: async (gameId: string) => {
    const response = await api.post(`/api/cash-games/${gameId}/leave`);
    return response.data;
  },
};

export default api; 