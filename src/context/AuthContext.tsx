import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

interface AuthContextData {
  signed: boolean;
  user: any | null;
  loading: boolean;
  signIn(token: string): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storedToken = await AsyncStorage.getItem('@Auth:token');
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          setUser(decoded);
        } catch (error) {
          await AsyncStorage.removeItem('@Auth:token');
        }
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = async (token: string) => {
    await AsyncStorage.setItem('@Auth:token', token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('@Auth:token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
