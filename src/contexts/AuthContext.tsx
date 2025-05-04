
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Auth, Usuario, LoginFormData } from '@/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Mock de usuários
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'senha123',
    nome: 'Administrador',
  },
  {
    id: '2',
    email: 'tecnico@example.com',
    password: 'senha123',
    nome: 'Técnico',
  },
];

interface AuthContextType {
  auth: Auth;
  login: (data: LoginFormData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const initialAuth: Auth = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<Auth>(() => {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth) : initialAuth;
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  // Mock do processo de login - Na implementação real, isso seria uma chamada à API
  const login = async (data: LoginFormData): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulando um delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = MOCK_USERS.find(
        u => u.email === data.email && u.password === data.password
      );
      
      if (!user) {
        toast.error('Email ou senha inválidos');
        return false;
      }
      
      const { password, ...userWithoutPassword } = user;
      
      setAuth({
        isAuthenticated: true,
        user: userWithoutPassword as Usuario,
        token: 'mock-jwt-token',
      });
      
      toast.success(`Bem-vindo, ${userWithoutPassword.nome}!`);
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro ao fazer login. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    setAuth(initialAuth);
    navigate('/login');
  };
  
  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
