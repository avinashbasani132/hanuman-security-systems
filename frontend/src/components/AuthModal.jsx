import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { showLoginModal, setShowLoginModal, login, signup, loginWithOTP, verifyOTP } = useAuth();
  
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
  const [step, setStep] = useState('phone_input'); // 'phone_input' | 'otp_input'
  
  // Form State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // For email auth

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (showLoginModal) {
      document.body.style.overflow = 'hidden';
      setError('');
      setSuccess('');
      setPhone('');
      setOtp('');
      setEmail('');
      setPassword('');
      setStep('phone_input');
      setAuthMethod('phone');
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showLoginModal]);

  if (!showLoginModal) return null;

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await loginWithOTP(phone);
      setSuccess('OTP sent successfully!');
      setStep('otp_input');
    } catch (err) {
      console.error(err);
      if (err.message && err.message.includes('not configured')) {
        setError('SMS Provider not configured in Supabase. Please use Email Login for now.');
      } else {
        setError(err.message || 'Failed to send OTP.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyOTP(phone, otp);
      setShowLoginModal(false);
    } catch (err) {
      setError(err.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        setShowLoginModal(false);
      } else {
        await signup(email, password);
        setSuccess('Account created! You can now log in.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const accentColor = '#ff4a00';

  return createPortal(
    <>
      <style>{`
        @keyframes authSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes authFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .auth-overlay { animation: authFadeIn 0.25s ease-out forwards; }
        .auth-box { animation: authSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>

      {/* OVERLAY */}
      <div className="auth-overlay" onClick={() => setShowLoginModal(false)} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
        zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem'
      }}>
        {/* MODAL */}
        <div className="auth-box" onClick={e => e.stopPropagation()} style={{
          background: '#fff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* HEADER */}
          <div style={{
            padding: '1.25rem 1.75rem',
            background: `linear-gradient(135deg, ${accentColor}12 0%, #fff 100%)`,
            borderBottom: '1px solid #f0f0f0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '11px',
                background: `${accentColor}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem',
              }}>
                {authMethod === 'phone' ? '📱' : '🔐'}
              </div>
              <div>
                <h2 style={{
                  margin: 0, fontSize: '1.2rem', fontWeight: 800,
                  color: '#0f172a', fontFamily: 'Outfit, sans-serif',
                }}>
                  {authMethod === 'phone' ? 'Login or Signup' : (isLogin ? 'Welcome Back' : 'Create Account')}
                </h2>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                  {authMethod === 'phone' 
                    ? 'Enter your mobile number to proceed' 
                    : (isLogin ? 'Log in to continue your secure checkout' : 'Sign up to track your orders')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                width: '34px', height: '34px', borderRadius: '50%',
                border: '1.5px solid #e5e7eb', background: '#fff',
                cursor: 'pointer', fontSize: '1.1rem', color: '#6b7280',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, lineHeight: 1,
              }}
            >×</button>
          </div>

          {/* FORM AREA */}
          <div style={{ padding: '2rem 1.75rem' }}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '0.75rem', borderRadius: '8px', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '0.75rem', borderRadius: '8px', color: '#166534', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                {success}
              </div>
            )}

            {authMethod === 'phone' ? (
              // PHONE AUTH FLOW
              <>
                {step === 'phone_input' ? (
                  <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Mobile Number
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{
                          padding: '0.75rem', borderRadius: '10px',
                          border: '1.5px solid #e5e7eb', fontSize: '0.9rem',
                          background: '#f3f4f6', color: '#4b5563', fontWeight: 600,
                          display: 'flex', alignItems: 'center'
                        }}>
                          +91
                        </div>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter your 10-digit number"
                          maxLength={10}
                          style={{
                            padding: '0.75rem 1rem', borderRadius: '10px',
                            border: '1.5px solid #e5e7eb', fontSize: '0.9rem',
                            outline: 'none', background: '#fafbfc', color: '#111827',
                            fontFamily: 'Outfit, sans-serif', flex: 1, boxSizing: 'border-box'
                          }}
                          onFocus={e => { e.target.style.borderColor = accentColor; e.target.style.background = '#fff'; }}
                          onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#fafbfc'; }}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || phone.length < 10}
                      style={{
                        width: '100%', marginTop: '0.5rem', padding: '0.85rem 1.5rem',
                        background: (loading || phone.length < 10) ? '#94a3b8' : `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
                        color: '#fff', border: 'none', borderRadius: '12px',
                        fontWeight: 800, fontSize: '0.95rem', cursor: (loading || phone.length < 10) ? 'not-allowed' : 'pointer',
                        boxShadow: (loading || phone.length < 10) ? 'none' : `0 6px 20px ${accentColor}40`,
                        fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s ease'
                      }}
                    >
                      {loading ? 'Sending OTP...' : 'Continue'}
                    </button>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center', lineHeight: 1.5 }}>
                      By continuing, you agree to Hanuman Enterprises' Conditions of Use and Privacy Notice.
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Enter OTP
                      </label>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#64748b' }}>
                        Sent to +91 {phone}. <button type="button" onClick={() => { setStep('phone_input'); setError(''); }} style={{ background: 'none', border: 'none', color: accentColor, fontWeight: 700, padding: 0, cursor: 'pointer', textDecoration: 'underline' }}>Change</button>
                      </p>
                      <input
                        type="text"
                        required
                        value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        style={{
                          padding: '0.75rem 1rem', borderRadius: '10px',
                          border: '1.5px solid #e5e7eb', fontSize: '1.1rem', letterSpacing: '0.2em',
                          outline: 'none', background: '#fafbfc', color: '#111827',
                          fontFamily: 'Outfit, sans-serif', width: '100%', boxSizing: 'border-box',
                          textAlign: 'center', fontWeight: 700
                        }}
                        onFocus={e => { e.target.style.borderColor = accentColor; e.target.style.background = '#fff'; }}
                        onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#fafbfc'; }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading || otp.length < 6}
                      style={{
                        width: '100%', marginTop: '0.5rem', padding: '0.85rem 1.5rem',
                        background: (loading || otp.length < 6) ? '#94a3b8' : `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
                        color: '#fff', border: 'none', borderRadius: '12px',
                        fontWeight: 800, fontSize: '0.95rem', cursor: (loading || otp.length < 6) ? 'not-allowed' : 'pointer',
                        boxShadow: (loading || otp.length < 6) ? 'none' : `0 6px 20px ${accentColor}40`,
                        fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s ease'
                      }}
                    >
                      {loading ? 'Verifying...' : 'Verify & Login'}
                    </button>
                  </form>
                )}
              </>
            ) : (
              // EMAIL AUTH FLOW (FALLBACK)
              <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    style={{
                      padding: '0.75rem 1rem', borderRadius: '10px',
                      border: '1.5px solid #e5e7eb', fontSize: '0.9rem',
                      outline: 'none', background: '#fafbfc', color: '#111827',
                      fontFamily: 'Outfit, sans-serif', width: '100%', boxSizing: 'border-box'
                    }}
                    onFocus={e => { e.target.style.borderColor = accentColor; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#fafbfc'; }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{
                      padding: '0.75rem 1rem', borderRadius: '10px',
                      border: '1.5px solid #e5e7eb', fontSize: '0.9rem',
                      outline: 'none', background: '#fafbfc', color: '#111827',
                      fontFamily: 'Outfit, sans-serif', width: '100%', boxSizing: 'border-box'
                    }}
                    onFocus={e => { e.target.style.borderColor = accentColor; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#fafbfc'; }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', marginTop: '0.5rem', padding: '0.85rem 1.5rem',
                    background: loading ? '#94a3b8' : `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
                    color: '#fff', border: 'none', borderRadius: '12px',
                    fontWeight: 800, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: loading ? 'none' : `0 6px 20px ${accentColor}40`,
                    fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s ease'
                  }}
                >
                  {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
                </button>
                <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    type="button"
                    onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                    style={{ background: 'none', border: 'none', color: accentColor, fontWeight: 700, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                  >
                    {isLogin ? 'Sign up here' : 'Log in here'}
                  </button>
                </div>
              </form>
            )}

            {/* TOGGLE AUTH METHOD */}
            <div style={{ marginTop: '2rem', position: 'relative', textAlign: 'center' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#e5e7eb' }}></div>
              <span style={{ position: 'relative', background: '#fff', padding: '0 1rem', fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>OR</span>
            </div>
            
            <button
              onClick={() => {
                setAuthMethod(authMethod === 'phone' ? 'email' : 'phone');
                setError('');
                setSuccess('');
              }}
              style={{
                width: '100%', marginTop: '1.5rem', padding: '0.75rem',
                background: '#fff', color: '#374151', border: '1px solid #d1d5db',
                borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              {authMethod === 'phone' ? 'Login with Email / Password' : 'Login with Mobile Number'}
            </button>

          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default AuthModal;
