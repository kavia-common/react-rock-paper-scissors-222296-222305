import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute - Wraps children and enforces that the user is authenticated.
 * If not authenticated, redirects to /login and preserves intended location in state.
 */
function ProtectedRoute({ children }) {
  const authed = isAuthenticated();
  const location = useLocation();

  if (!authed) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location?.pathname || '/' }}
      />
    );
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
