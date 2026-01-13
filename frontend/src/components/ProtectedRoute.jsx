import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        // Not logged in -> Redirect to Login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Logged in but wrong role -> Redirect based on actual role
        return <Navigate to={user.role === 'admin' ? '/admin/jobs' : '/jobs'} replace />;
    }

    // Authorized -> Render child routes
    return <Outlet />;
};

export default ProtectedRoute;