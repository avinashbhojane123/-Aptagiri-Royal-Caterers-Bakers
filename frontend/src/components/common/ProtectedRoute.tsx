import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
        <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }}></div>
        <p style={{ color: 'var(--color-text-muted)', fontWeight: '500' }}>Loading user session...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page but save current location to return to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Not an admin, redirect to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
