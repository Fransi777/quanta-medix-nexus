
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { User } from '@/context/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: User['role'][];
  redirectTo?: string;
}

const AuthGuard = ({
  children,
  allowedRoles,
  redirectTo = '/login'
}: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      // If no user, redirect to login
      if (!user) {
        navigate(redirectTo);
        return;
      }

      // If roles are specified, check if user has allowed role
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to dashboard if authenticated but wrong role
        navigate('/dashboard');
        return;
      }
    }
  }, [user, isLoading, allowedRoles, navigate, redirectTo]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-t-quantum-vibrant-blue border-b-quantum-bright-purple border-r-quantum-glow-purple border-l-quantum-sky-blue rounded-full animate-spin" />
          <p className="text-quantum-text-paragraph text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If we're not loading and:
  // - There is no user and we're not on login page, guard will redirect
  // - User doesn't have the right role, guard will redirect
  // - Otherwise show children
  return <>{children}</>;
};

export default AuthGuard;
