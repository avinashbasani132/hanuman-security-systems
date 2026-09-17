import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (session) {
        setSession(session);
        setUser(session?.user || null);
      } else {
        // Check for mock user bypass
        const mockUser = localStorage.getItem('mock_user');
        if (mockUser) {
          const parsed = JSON.parse(mockUser);
          setSession({ user: parsed });
          setUser(parsed);
        }
      }
      setLoading(false);
    }).catch(() => {
      // If supabase is completely unconfigured
      const mockUser = localStorage.getItem('mock_user');
      if (mockUser) {
        const parsed = JSON.parse(mockUser);
        setSession({ user: parsed });
        setUser(parsed);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: subscriptionData } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setUser(session?.user || null);
      }
    });

    return () => {
      if (subscriptionData?.subscription) {
        subscriptionData.subscription.unsubscribe();
      }
    };
  }, []);

  const signup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const login = async (email, password) => {
    // Demo bypass
    if (email === 'admin@demo.com' && password === 'demo123') {
      const mockUser = { email: 'admin@demo.com', id: 'demo-admin-id' };
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setSession({ user: mockUser });
      return { user: mockUser };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    localStorage.removeItem('mock_user');
    setUser(null);
    setSession(null);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error(err);
    }
  };

  const loginWithOTP = async (phone) => {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });
    if (error) throw error;
    return data;
  };

  const verifyOTP = async (phone, token) => {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token,
      type: 'sms',
    });
    if (error) throw error;
    return data;
  };

  const value = {
    user,
    session,
    loading,
    signup,
    login,
    logout,
    loginWithOTP,
    verifyOTP,
    showLoginModal,
    setShowLoginModal
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
