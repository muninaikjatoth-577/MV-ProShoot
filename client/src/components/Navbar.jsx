import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Camera, Calendar, Sparkles, User, ShieldCheck, LogOut, Lock } from 'lucide-react';

export default function Navbar({ onOpenClientAuth, onOpenAdminAuth, onOpenMyBookings, onOpenAdmin }) {
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(8, 7, 18, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '14px 28px',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.6)',
            }}
          >
            <Camera size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: '800',
                  letterSpacing: '-0.02em',
                }}
              >
                MV <span className="gradient-text-primary">PROSHOOT</span>
              </span>
              <span
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  background: 'rgba(236, 72, 153, 0.15)',
                  color: '#f472b6',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  fontWeight: '700',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                }}
              >
                3D Studio Bay
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Real-Time High Production Slot Reservation
            </p>
          </div>
        </div>

        {/* Live WebSocket Indicator & Nav Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '22px',
          }}
        >
          {/* Live Sync Status */}
          <div
            className="glass-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              fontSize: '12px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isConnected ? '#10b981' : '#f59e0b',
                boxShadow: isConnected ? '0 0 10px #10b981' : '0 0 10px #f59e0b',
              }}
            />
            <span style={{ color: isConnected ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
              {isConnected ? 'Real-Time Sync Active' : 'Connecting to Server...'}
            </span>
          </div>

          <a
            href="#slots"
            style={{
              color: 'var(--text-main)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Calendar size={15} color="#8b5cf6" />
            Book Slots
          </a>

          <a
            href="#services"
            style={{
              color: 'var(--text-main)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={15} color="#ec4899" />
            Packages
          </a>
        </nav>

        {/* Auth / Profile Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user.role === 'admin' ? (
                <button
                  onClick={onOpenAdmin}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(245, 158, 11, 0.5)',
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2))',
                    color: '#fde047',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <ShieldCheck size={16} color="#f59e0b" />
                  Admin Dashboard
                </button>
              ) : (
                <button
                  onClick={onOpenMyBookings}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '13px' }}
                >
                  <Calendar size={15} color="#06b6d4" />
                  My Bookings
                </button>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <User size={14} color="#a78bfa" />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{user.name}</span>
                <span
                  style={{
                    fontSize: '10px',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    backgroundColor: user.role === 'admin' ? '#f59e0b' : '#7c3aed',
                    color: '#fff',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                  }}
                >
                  {user.role}
                </span>
              </div>

              <button
                onClick={logout}
                title="Sign out"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            /* Dedicated Separate Login Buttons */
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Client Login Button */}
              <button
                onClick={onOpenClientAuth}
                className="btn-primary"
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                }}
              >
                <User size={15} />
                Client Login
              </button>

              {/* Admin Portal Button */}
              <button
                onClick={onOpenAdminAuth}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(245, 158, 11, 0.5)',
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: '#fbbf24',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <ShieldCheck size={16} color="#f59e0b" />
                Admin Portal
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
