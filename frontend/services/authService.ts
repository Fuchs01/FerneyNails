import axios from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'administrateur' | 'gerant' | 'employe';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const { data } = await axios.post<AuthResponse>('/auth/login', credentials);
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
    }
    return data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Erreur de connexion' };
  }
};

export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  window.location.href = '/admin/login';
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  const user = localStorage.getItem('adminUser');
  return !!(token && user);
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('adminUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const hasPermission = (requiredRole: 'administrateur' | 'gerant' | 'employe'): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  const roleHierarchy = {
    administrateur: 3,
    gerant: 2,
    employe: 1
  };

  const userRoleLevel = roleHierarchy[user.role];
  const requiredRoleLevel = roleHierarchy[requiredRole];

  return userRoleLevel >= requiredRoleLevel;
};

export const canViewFullDashboard = (): boolean => {
  return hasPermission('gerant');
};

export const canManageEmployees = (): boolean => {
  return hasPermission('administrateur');
};

export const canManageSettings = (): boolean => {
  return hasPermission('administrateur');
};

export const canManageServices = (): boolean => {
  return hasPermission('gerant');
};

export const canManageClients = (): boolean => {
  return hasPermission('gerant');
};

export const canManageInvoices = (): boolean => {
  return hasPermission('gerant');
};

export const canManageLoyalty = (): boolean => {
  return hasPermission('gerant');
};