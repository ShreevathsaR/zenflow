import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error.message);
      } else {
        setIsAuthenticated(!!data.session);
      }
      
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    // Optionally, render a loading spinner or some placeholder while checking session
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoutes;
