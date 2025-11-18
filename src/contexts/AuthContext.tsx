import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('smoothire_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock validation
    const mockUser = { email, id: Math.random().toString(36).substring(7) };
    
    setUser(mockUser);
    localStorage.setItem('smoothire_user', JSON.stringify(mockUser));
    return {};
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smoothire_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
