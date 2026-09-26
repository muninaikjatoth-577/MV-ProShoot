import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, Clock, Video, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiUrl } from '../utils/api';

export default function UserDashboardModal({ isOpen, onClose }) {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && token) {
      setLoading(true);
      fetch(apiUrl('/api/slots/my-bookings'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setBookings(data.data);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '32px',
          position: 'relative',
          background: '#0d0c20',
          border: '1px solid rgba(6, 182, 212, 0.4)',
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
          <X size={22} />
        </button>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06b6d4', fontSize: '13px', fontWeight: 600 }}>
            <Calendar size={16} />
            <span>MY STUDIO RESERVATIONS</span>
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
            Booked Shoot Sessions
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            All verified studio sessions booked under {user?.name} ({user?.email})
          </p>
        </div>

        {/* List of bookings */}
        <div style={{ overflowY: 'auto', paddingRight: '6px', flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading your reservations...
            </div>
          ) : bookings.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: '1px dashed rgba(255, 255, 255, 0.1)',
              }}
            >
              <AlertCircle size={32} color="#64748b" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: 600 }}>No reservations found</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                You haven't reserved any studio slots yet. Browse available slots and book your shoot!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bookings.map((b) => (
                <div
                  key={b._id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '13px',
                        color: '#a78bfa',
                        background: 'rgba(124, 58, 237, 0.15)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                      }}
                    >
                      {b.bookingReference}
                    </span>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#34d399',
                        background: 'rgba(16, 185, 129, 0.15)',
                        padding: '3px 10px',
                        borderRadius: '99px',
                      }}
                    >
                      <CheckCircle2 size={13} />
                      {b.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
                    {b.service?.title || 'Studio Production'}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '16px',
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="#ec4899" />
                      <span>{b.slot?.date}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="#8b5cf6" />
                      <span>
                        {b.slot?.startTime} - {b.slot?.endTime}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Video size={14} color="#06b6d4" />
                      <span>{b.slot?.studioBay}</span>
                    </div>
                  </div>

                  {b.clientDetails?.shootTheme && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#e2e8f0',
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        marginBottom: '12px',
                      }}
                    >
                      <strong style={{ color: '#c084fc' }}>Theme:</strong> {b.clientDetails.shootTheme}
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      paddingTop: '10px',
                    }}
                  >
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      Booked on {new Date(b.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#38bdf8' }}>
                      ₹{b.totalAmount?.toLocaleString('en-IN')} (Paid)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
