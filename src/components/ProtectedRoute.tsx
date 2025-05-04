
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { auth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      toast.error('Você precisa fazer login para acessar esta página');
    }
  }, [auth.isAuthenticated]);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
