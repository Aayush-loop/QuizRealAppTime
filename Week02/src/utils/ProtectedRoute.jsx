import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';


const ProtectedRoute = ({ element }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    // Show a loading indicator while authentication is being checked
    if (loading) {
        return <Loading />;
    }
    // If authenticated, render the passed element. Otherwise, redirect to the login page
    return isAuthenticated ? element : (
        toast.error('Unauthorized : Please login'),
        <Navigate to="/login" />
    );
};

export default ProtectedRoute;
