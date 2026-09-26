import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, Phone, ShieldCheck, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, portalMode = 'client', onAdminLoginSuccess }) {
  const { login } = useAuth();
  const [currentPortal, setCurrentPortal] = useState(portalMode); // 'client' | 'admin'
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentPortal(portalMode);
    setError('');
    if (portalMode === 'admin') {
      setIsLogin(true);
    }
  }, [portalMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          portalType: currentPortal,
          role: currentPortal === 'admin' ? 'admin' : 'user',
        }),
      });

      const data = await res.json();
      if (data.success) {
        login(data.token, data.user);
        onClose();
        if (data.user.role === 'admin' && onAdminLoginSuccess) {
          onAdminLoginSuccess();
        }
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Unable to connect to authentication server');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    if (currentPortal === 'admin') {
      setIsLogin(true);
      setFormData({
        email: 'admin@mvproshoot.com',
        password: 'password123',
        name: '',
        phone: '',
        role: 'admin',
      });
    } else {
      setIsLogin(true);
      setFormData({
        email: 'client@mvproshoot.com',
        password: 'password123',
        name: '',
        phone: '',
        role: 'user',
      });
    }
  };

  const isAdminPortal = currentPortal === 'admin';

  return (
    <div className="modal-overlay">
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '32px',
          position: 'relative',
          background: isAdminPortal ? '#0f0a1c' : '#0c0a22',
          border: isAdminPortal
            ? '1.5px solid rgba(245, 158, 11, 0.6)'
            : '1.5px solid rgba(139, 92, 246, 0.5)',
          boxShadow: isAdminPortal
            ? '0 20px 60px rgba(245, 158, 11, 0.25)'
            : '0 20px 60px rgba(139, 92, 246, 0.25)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {/* Portal Type Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setCurrentPortal('client');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '9px',
              border: 'none',
              background: !isAdminPortal
                ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                : 'transparent',
              color: '#fff',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <User size={15} />
            Client Login
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentPortal('admin');
              setIsLogin(true);
              setError('');
            }}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '9px',
              border: 'none',
              background: isAdminPortal
                ? 'linear-gradient(135deg, #f59e0b, #ec4899)'
                : 'transparent',
              color: '#fff',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <ShieldCheck size={16} />
            Admin Portal
          </button>
        </div>

        {/* Portal Heading */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
              backgroundColor: isAdminPortal
                ? 'rgba(245, 158, 11, 0.15)'
                : 'rgba(124, 58, 237, 0.15)',
              color: isAdminPortal ? '#f59e0b' : '#c084fc',
              border: isAdminPortal
                ? '1px solid rgba(245, 158, 11, 0.3)'
                : '1px solid rgba(124, 58, 237, 0.3)',
            }}
          >
            {isAdminPortal ? 'Director & Staff Only' : 'Client Production Bay'}
          </div>

          <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
            {isAdminPortal
              ? 'Studio Director Login'
              : isLogin
              ? 'Sign In to Reserve Stages'
              : 'Create Client Account'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {isAdminPortal
              ? 'Inspect real-time bookings, manage slots, and oversee client shoot details.'
              : isLogin
              ? 'Reserve real-time slots and view past shoot receipts.'
              : 'Join MV ProShoot for instant studio slot confirmations.'}
          </p>
        </div>

        {/* Tabs for Client (Login vs Register) */}
        {!isAdminPortal && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '8px',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: isLogin ? '#fff' : 'var(--text-dim)',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                position: 'relative',
                paddingBottom: '4px',
              }}
            >
              Sign In
              {isLogin && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-9px',
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: '#8b5cf6',
                  }}
                />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: !isLogin ? '#fff' : 'var(--text-dim)',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                position: 'relative',
                paddingBottom: '4px',
              }}
            >
              Register New Client
              {!isLogin && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-9px',
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: '#8b5cf6',
                  }}
                />
              )}
            </button>
          </div>
        )}

        {/* 1-Click Demo Fill Badge */}
        <div style={{ marginBottom: '18px' }}>
          <button
            type="button"
            onClick={handleDemoFill}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              background: isAdminPortal
                ? 'rgba(245, 158, 11, 0.12)'
                : 'rgba(6, 182, 212, 0.12)',
              border: isAdminPortal
                ? '1px solid rgba(245, 158, 11, 0.35)'
                : '1px solid rgba(6, 182, 212, 0.35)',
              color: isAdminPortal ? '#fde68a' : '#67e8f9',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>
              ⚡ 1-Click Auto-Fill {isAdminPortal ? 'Demo Admin' : 'Demo Client'}
            </span>
            <span style={{ fontSize: '11px', opacity: 0.8 }}>
              {isAdminPortal ? 'admin@mvproshoot.com' : 'client@mvproshoot.com'}
            </span>
          </button>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && !isAdminPortal && (
            <>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={16}
                    color="#64748b"
                    style={{ position: 'absolute', top: '12px', left: '12px' }}
                  />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Yash Vardhan"
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone
                    size={16}
                    color="#64748b"
                    style={{ position: 'absolute', top: '12px', left: '12px' }}
                  />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              {isAdminPortal ? 'Director Email ID' : 'Client Email Address'}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                color="#64748b"
                style={{ position: 'absolute', top: '12px', left: '12px' }}
              />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={isAdminPortal ? 'admin@mvproshoot.com' : 'client@mvproshoot.com'}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                color="#64748b"
                style={{ position: 'absolute', top: '12px', left: '12px' }}
              />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              color: '#fff',
              background: isAdminPortal
                ? 'linear-gradient(135deg, #f59e0b, #ec4899)'
                : 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              boxShadow: isAdminPortal
                ? '0 4px 20px rgba(245, 158, 11, 0.4)'
                : '0 4px 20px rgba(139, 92, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading ? (
              'Authenticating...'
            ) : isAdminPortal ? (
              <>
                <ShieldCheck size={16} />
                Access Director Command Center
              </>
            ) : isLogin ? (
              <>
                <User size={16} />
                Sign In to Client Account
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Create Account & Book
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
