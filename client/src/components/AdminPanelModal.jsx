import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  X,
  ShieldCheck,
  Plus,
  Calendar,
  Clock,
  Video,
  CheckCircle,
  Phone,
  Mail,
  User,
  Sparkles,
  Flame,
  Radio,
  FileText,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function AdminPanelModal({ isOpen, onClose }) {
  const { token, user } = useAuth();
  const { socket } = useSocket();
  const [activeTab, setActiveTab] = useState('bookings');
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [latestLiveAlert, setLatestLiveAlert] = useState(null);

  // New slot form state
  const [newSlot, setNewSlot] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    studioBay: 'Studio Stage A (Neon & Cyber)',
    priceMultiplier: 1.0,
  });
  const [creatingSlot, setCreatingSlot] = useState(false);
  const [slotCreatedMsg, setSlotCreatedMsg] = useState('');

  // Fetch all studio bookings on mount / open
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/slots/admin/all-bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAllBookings(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token && user?.role === 'admin') {
      fetchBookings();
    }
  }, [isOpen, token, user]);

  // Real-time socket listener for incoming client bookings!
  useEffect(() => {
    if (!socket) return;

    const handleNewBooking = (newBooking) => {
      console.log('[Admin Bay] Real-Time Booking Received:', newBooking);
      // Prepend to top of list
      setAllBookings((prev) => [newBooking, ...prev]);

      // Set live alert banner
      setLatestLiveAlert({
        clientName: newBooking.clientDetails?.fullName || newBooking.user?.name || 'New Client',
        theme: newBooking.clientDetails?.shootTheme || 'Custom Shoot',
        stage: newBooking.slot?.studioBay || 'Main Stage',
        time: `${newBooking.slot?.startTime} - ${newBooking.slot?.endTime}`,
        date: newBooking.slot?.date,
        ref: newBooking.bookingReference,
      });

      // Auto-clear alert banner after 12 seconds
      setTimeout(() => setLatestLiveAlert(null), 12000);
    };

    socket.on('booking:new', handleNewBooking);

    return () => {
      socket.off('booking:new', handleNewBooking);
    };
  }, [socket]);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setCreatingSlot(true);
    setSlotCreatedMsg('');

    try {
      const res = await fetch('/api/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSlot),
      });

      const data = await res.json();
      if (data.success) {
        setSlotCreatedMsg('New real-time studio slot published to all users! 🚀');
        setTimeout(() => setSlotCreatedMsg(''), 4000);
      } else {
        alert(data.message || 'Failed to create slot');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingSlot(false);
    }
  };

  if (!isOpen || user?.role !== 'admin') return null;

  return (
    <div className="modal-overlay">
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '30px',
          position: 'relative',
          background: '#0c0a1e',
          border: '1.5px solid rgba(245, 158, 11, 0.6)',
          boxShadow: '0 25px 70px rgba(245, 158, 11, 0.25)',
        }}
      >
        {/* Close Button */}
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

        {/* Header Bar */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(245, 158, 11, 0.5)',
                }}
              >
                <ShieldCheck size={22} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '800' }}>
                  MV Director Command Center
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#fde047' }}>
                  <span className="live-pulse" style={{ backgroundColor: '#f59e0b' }} />
                  <span>Real-Time Client Booking Stream Active</span>
                </div>
              </div>
            </div>

            <button
              onClick={fetchBookings}
              className="glass-pill"
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                color: '#fff',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              🔄 Refresh List
            </button>
          </div>
        </div>

        {/* Live Incoming Alert Banner */}
        {latestLiveAlert && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(245, 158, 11, 0.25))',
              border: '1.5px solid #10b981',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              animation: 'pulse 2s infinite',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Flame size={24} color="#f59e0b" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>
                  🚨 NEW LIVE BOOKING: {latestLiveAlert.clientName}
                </div>
                <div style={{ fontSize: '12px', color: '#d1fae5' }}>
                  Reserved {latestLiveAlert.stage} on {latestLiveAlert.date} ({latestLiveAlert.time}) • Theme: {latestLiveAlert.theme}
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(16, 185, 129, 0.3)',
                color: '#6ee7b7',
                fontWeight: 700,
              }}
            >
              REF: {latestLiveAlert.ref}
            </span>
          </div>
        )}

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13px',
              color: '#fff',
              background: activeTab === 'bookings'
                ? 'linear-gradient(135deg, #7c3aed, #ec4899)'
                : 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FileText size={16} />
            Client Bookings Dossier ({allBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('createSlot')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13px',
              color: '#fff',
              background: activeTab === 'createSlot'
                ? 'linear-gradient(135deg, #f59e0b, #ec4899)'
                : 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Plus size={16} />
            Publish Studio Slot
          </button>
        </div>

        {/* Tab 1: Detailed Client Bookings List */}
        {activeTab === 'bookings' && (
          <div style={{ overflowY: 'auto', paddingRight: '8px', flex: 1 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Loading real-time client booking dossier...
              </div>
            ) : allBookings.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '50px 20px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                }}
              >
                <AlertCircle size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 600 }}>No client bookings recorded yet</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  When clients reserve a stage on the platform, their details will appear here instantly!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {allBookings.map((b, idx) => {
                  const clientName = b.clientDetails?.fullName || b.user?.name || 'Anonymous Client';
                  const clientEmail = b.clientDetails?.email || b.user?.email || 'N/A';
                  const clientPhone = b.clientDetails?.phone || b.user?.phone || 'N/A';
                  const shootTheme = b.clientDetails?.shootTheme || 'Standard MV Session';
                  const specialRequests = b.clientDetails?.specialRequests;

                  return (
                    <div
                      key={b._id || idx}
                      style={{
                        background: 'linear-gradient(180deg, rgba(25, 22, 54, 0.7) 0%, rgba(16, 14, 38, 0.8) 100%)',
                        border: idx === 0 && latestLiveAlert
                          ? '2px solid #10b981'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '14px',
                        padding: '22px',
                        boxShadow: idx === 0 && latestLiveAlert ? '0 0 25px rgba(16, 185, 129, 0.3)' : 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {/* Top Bar: Reference & Status */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '14px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                          paddingBottom: '10px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              color: '#fbbf24',
                              fontSize: '14px',
                              background: 'rgba(245, 158, 11, 0.15)',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                            }}
                          >
                            {b.bookingReference}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                            Booked on {new Date(b.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              padding: '3px 10px',
                              borderRadius: '99px',
                              backgroundColor: 'rgba(16, 185, 129, 0.2)',
                              color: '#34d399',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                            }}
                          >
                            <CheckCircle size={12} />
                            {b.status || 'CONFIRMED'}
                          </span>
                          <span
                            style={{
                              fontSize: '15px',
                              fontWeight: 800,
                              color: '#38bdf8',
                            }}
                          >
                            ₹{b.totalAmount?.toLocaleString('en-IN')} (Paid)
                          </span>
                        </div>
                      </div>

                      {/* Client Dossier Information Grid */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                          gap: '16px',
                          marginBottom: '16px',
                        }}
                      >
                        {/* Client Identity Box */}
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            padding: '14px',
                            borderRadius: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                          }}
                        >
                          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#c084fc', fontWeight: 700, marginBottom: '8px' }}>
                            CLIENT CONTACT DOSSIER
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                            {clientName}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                            <a
                              href={`mailto:${clientEmail}`}
                              style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <Mail size={14} color="#a78bfa" />
                              <span>{clientEmail}</span>
                            </a>
                            <a
                              href={`tel:${clientPhone}`}
                              style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <Phone size={14} color="#06b6d4" />
                              <span>{clientPhone}</span>
                            </a>
                          </div>
                        </div>

                        {/* Stage & Time Details */}
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            padding: '14px',
                            borderRadius: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                          }}
                        >
                          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700, marginBottom: '8px' }}>
                            STAGE & TIME RESERVATION
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                            {b.service?.title || 'Custom Studio Shoot'}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: '#94a3b8' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Calendar size={14} color="#ec4899" />
                              <span>Date: <strong>{b.slot?.date}</strong></span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Clock size={14} color="#8b5cf6" />
                              <span>Time: <strong>{b.slot?.startTime} - {b.slot?.endTime}</strong></span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Video size={14} color="#06b6d4" />
                              <span>Bay: <strong>{b.slot?.studioBay}</strong></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Creative Direction & Special Requests */}
                      <div
                        style={{
                          background: 'rgba(139, 92, 246, 0.08)',
                          border: '1px solid rgba(139, 92, 246, 0.25)',
                          borderRadius: '10px',
                          padding: '12px 16px',
                          marginBottom: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#d8b4fe', marginBottom: '4px' }}>
                          <Sparkles size={14} color="#c084fc" />
                          <span>CREATIVE THEME & DIRECTION:</span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#f8fafc', fontWeight: 600 }}>
                          {shootTheme}
                        </div>

                        {specialRequests && (
                          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '13px', color: '#e2e8f0' }}>
                            <strong style={{ color: '#f59e0b' }}>Special Requests / Props:</strong> {specialRequests}
                          </div>
                        )}
                      </div>

                      {/* Admin Direct Actions */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <a
                          href={`tel:${clientPhone}`}
                          className="btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '12px', textDecoration: 'none' }}
                        >
                          <Phone size={13} color="#06b6d4" />
                          Call Client
                        </a>

                        <a
                          href={`mailto:${clientEmail}?subject=MV%20ProShoot%20Studio%20Booking%20Confirmation%20(${b.bookingReference})`}
                          className="btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '12px', textDecoration: 'none' }}
                        >
                          <Mail size={13} color="#a78bfa" />
                          Email Dispatch
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Create Slot */}
        {activeTab === 'createSlot' && (
          <form onSubmit={handleCreateSlot} style={{ overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
            {slotCreatedMsg && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  color: '#34d399',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '13px',
                }}
              >
                {slotCreatedMsg}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Slot Date
                </label>
                <input
                  type="date"
                  required
                  value={newSlot.date}
                  onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Studio Stage Bay
                </label>
                <select
                  value={newSlot.studioBay}
                  onChange={(e) => setNewSlot({ ...newSlot, studioBay: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#13112c',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                  }}
                >
                  <option value="Studio Stage A (Neon & Cyber)">Studio Stage A (Neon & Cyber)</option>
                  <option value="Studio Stage B (High-Key Gold)">Studio Stage B (High-Key Gold)</option>
                  <option value="Studio Stage C (Cinematic MV Deck)">Studio Stage C (Cinematic MV Deck)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Start Time
                </label>
                <input
                  type="text"
                  required
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  placeholder="e.g. 03:00 PM"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  End Time
                </label>
                <input
                  type="text"
                  required
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  placeholder="e.g. 04:30 PM"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Price Multiplier (1.0 = standard, 1.25 = peak hour)
              </label>
              <input
                type="number"
                step="0.05"
                min="1.0"
                max="2.5"
                value={newSlot.priceMultiplier}
                onChange={(e) => setNewSlot({ ...newSlot, priceMultiplier: parseFloat(e.target.value) || 1.0 })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={creatingSlot}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '14px' }}
            >
              {creatingSlot ? 'Publishing Stage Slot...' : 'Publish Real-Time Slot'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
