import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserAddress } from '../types';
import { INITIAL_USER } from '../data/mockData';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  role: 'customer' | 'admin';
  isAuthenticated: boolean;
  login: (email?: string, asRole?: 'customer' | 'admin') => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addAddress: (address: Omit<UserAddress, 'id'>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  switchRole: (role: 'customer' | 'admin') => void;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'forgot' | 'otp';
  openAuthModal: (tab?: 'login' | 'register' | 'forgot' | 'otp') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('boka_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot' | 'otp'>('login');
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      localStorage.setItem('boka_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('boka_user');
    }
  }, [user]);

  const login = async (email?: string, asRole: 'customer' | 'admin' = 'customer') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email || 'shahdilendrabikram@gmail.com', role: asRole })
      });
      const data = res && typeof res.json === 'function' ? await res.json() : null;
      if (data && data.user) {
        setUser(data.user);
        showToast(`Welcome back, ${data.user.name}! (${asRole === 'admin' ? 'Admin Access' : 'Customer'})`, 'success');
        setIsAuthModalOpen(false);
      }
    } catch {
      // Fallback in-memory
      const fallbackUser: User = {
        ...INITIAL_USER,
        role: asRole,
        name: asRole === 'admin' ? 'Ruptha Bazzar Admin' : (email?.split('@')[0] || 'Dilendra Shah'),
        email: email || (asRole === 'admin' ? 'admin@rupthabazzar.com' : 'shahdilendrabikram@gmail.com')
      };
      setUser(fallbackUser);
      showToast(`Logged in successfully as ${asRole}`, 'success');
      setIsAuthModalOpen(false);
    }
  };

  const register = async (name: string, email: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      const data = res && typeof res.json === 'function' ? await res.json() : null;
      if (data && data.user) {
        setUser(data.user);
        showToast('Account created successfully! 200 Reward Points added.', 'success', 'Welcome to Ruptha Bazzar');
        setIsAuthModalOpen(false);
      }
    } catch {
      const newUser: User = {
        ...INITIAL_USER,
        id: `usr-${Date.now()}`,
        name,
        email,
        rewardPoints: 200,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUser(newUser);
      showToast('Account created successfully! 200 Reward Points credited.', 'success');
      setIsAuthModalOpen(false);
    }
  };

  const logout = () => {
    setUser(null);
    showToast('Signed out of your account.', 'info');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    try {
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch {
      // local update persisted
    }
    showToast('Profile updated successfully', 'success');
  };

  const addAddress = async (addrData: Omit<UserAddress, 'id'>) => {
    if (!user) return;
    const newAddress: UserAddress = {
      ...addrData,
      id: `addr-${Date.now()}`
    };
    let updatedAddresses = [...user.addresses];
    if (newAddress.isDefault || updatedAddresses.length === 0) {
      newAddress.isDefault = true;
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newAddress);
    setUser({ ...user, addresses: updatedAddresses });
    showToast('Address added to your address book', 'success');
  };

  const deleteAddress = async (id: string) => {
    if (!user) return;
    const updatedAddresses = user.addresses.filter(a => a.id !== id);
    if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.isDefault)) {
      updatedAddresses[0].isDefault = true;
    }
    setUser({ ...user, addresses: updatedAddresses });
    showToast('Address removed', 'info');
  };

  const setDefaultAddress = async (id: string) => {
    if (!user) return;
    const updatedAddresses = user.addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setUser({ ...user, addresses: updatedAddresses });
    showToast('Default delivery address updated', 'success');
  };

  const switchRole = (newRole: 'customer' | 'admin') => {
    if (user) {
      setUser({ ...user, role: newRole });
      showToast(`Switched mode to: ${newRole.toUpperCase()}`, 'info');
    }
  };

  const openAuthModal = (tab: 'login' | 'register' | 'forgot' | 'otp' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'customer',
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        switchRole,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
