import { AuthProvider } from 'react-admin';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

export const authProvider: AuthProvider = {
  login: ({ password }) => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_authenticated', 'true');
      console.log('Admin authentication successful');
      return Promise.resolve();
    }
    console.warn('Failed login attempt with password:', password);
    return Promise.reject(new Error('Invalid password'));
  },
  
  logout: () => {
    localStorage.removeItem('admin_authenticated');
    console.log('Admin logged out');
    return Promise.resolve();
  },
  
  checkError: (error) => {
    const status = error?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('admin_authenticated');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  
  checkAuth: () => {
    const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAuthenticated) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  
  getPermissions: () => Promise.resolve(),
  
  getIdentity: () => {
    return Promise.resolve({
      id: 'admin',
      fullName: 'Administrator',
    });
  },
};
