import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material'; // Material UI spinner

/**
 * RoleProtectedRoute – v6 compatible wrapper.
 * Renders the provided component only when the authenticated user's role
 * is included in the allowedRoles list. Shows a loading spinner while the
 * auth state is being resolved. Otherwise redirects to home.
 */
const RoleProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const auth = useSelector((state) => state.auth);
  const { user, loading } = auth;

  // Loading state while auth info is being fetched
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <CircularProgress />
      </div>
    );
  }

  const role = user?.role?.name || '';
  const isAllowed = allowedRoles.includes(role);

  return isAllowed ? <Component {...rest} /> : <Navigate to="/" replace />;
};

export default RoleProtectedRoute;
