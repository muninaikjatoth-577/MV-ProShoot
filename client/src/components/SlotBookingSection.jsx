import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  Video,
  ShieldAlert,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Lock,
  ArrowRight,
  Layers,
  ChevronRight,
  X,
} from 'lucide-react';
import { apiUrl } from '../utils/api';

export default function SlotBookingSection({
  selectedService,
  onRequireAuth,
  onBookingSuccess,
}) {
  const { user, token } = useAuth();
  const { socket } = useSocket();

  // Current selected date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBay, setSelectedBay] = useState('ALL');

  // Holding & Booking state
  const [heldSlot, setHeldSlot] = useState(null);
  const [holdTimeLeft, setHoldTimeLeft] = useState(180); // 3 minutes in seconds
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  // Form details
  const [clientDetails, setClientDetails] = useState({
    fullName: '',
    phone: '',
    email: '',
    shootTheme: 'Cinematic Cyberpunk & Neon',
    specialRequests: '',
  });

  // Pre-fill form when user logs in
  useEffect(() => {
    if (user) {
      setClientDetails((prev) => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  // Fetch slots for current selected date
  const fetchSlots = async (date) => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/slots?date=${date}`));
      const data = await res.json();
      if (data.success) {
        setSlots(data.data);
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(selectedDate);

    if (socket) {
      socket.emit('join:date', selectedDate);
    }

    return () => {
      if (socket) {
        socket.emit('leave:date', selectedDate);
      }
    };
  }, [selectedDate, socket]);

  // Real-time socket updates for slots
  useEffect(() => {
    if (!socket) return;

    const handleSlotUpdated = (update) => {
      // If the slot is on the currently viewed date, update state in-place
      setSlots((prevSlots) =>
        prevSlots.map((slot) => {
          if (slot._id === update.slotId) {
            return {
              ...slot,
              status: update.status,
              heldBy: update.heldBy || slot.heldBy,
            };
          }
          return slot;
        })
      );
    };

    const handleSlotCreated = (newSlot) => {
      if (newSlot.date === selectedDate) {
        setSlots((prev) => [...prev, newSlot]);
      }
    };

    socket.on('slot:updated', handleSlotUpdated);
    socket.on('slot:created', handleSlotCreated);

    return () => {
      socket.off('slot:updated', handleSlotUpdated);
      socket.off('slot:created', handleSlotCreated);
    };
  }, [socket, selectedDate]);

  // Hold Countdown Timer
  useEffect(() => {
    if (!heldSlot) return;

    setHoldTimeLeft(180);
    const interval = setInterval(() => {
      setHoldTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleReleaseSlot(heldSlot._id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [heldSlot]);

  // Request to hold slot
  const handleHoldSlot = async (slot) => {
    if (!user) {
      onRequireAuth();
      return;
    }

    try {
      const res = await fetch(apiUrl(`/api/slots/${slot._id}/hold`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        setHeldSlot(data.data);
        setBookingModalOpen(true);
      } else {
        alert(data.message || 'Slot could not be held.');
      }
    } catch (err) {
      console.error('Error holding slot:', err);
      alert('Error connecting to slot reservation server.');
    }
  };

  // Release held slot
  const handleReleaseSlot = async (slotId) => {
    try {
      await fetch(apiUrl(`/api/slots/${slotId}/release`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setHeldSlot(null);
      setBookingModalOpen(false);
    } catch (err) {
      console.error('Error releasing slot:', err);
    }
  };

  // Confirm Final Booking
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!heldSlot) return;

    if (!selectedService) {
      alert('Please select a shoot package first from the Shoot Packages section!');
      return;
    }

    setBookingSubmitting(true);
    try {
      const res = await fetch(apiUrl(`/api/slots/${heldSlot._id}/book`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: selectedService._id,
          clientDetails,
          shootTheme: clientDetails.shootTheme,
          specialRequests: clientDetails.specialRequests,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Confetti Celebration!
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#7c3aed', '#ec4899', '#06b6d4', '#f59e0b'],
        });

        setHeldSlot(null);
        setBookingModalOpen(false);
        if (onBookingSuccess) {
          onBookingSuccess(data.data);
        }
      } else {
        alert(data.message || 'Booking failed.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to complete booking.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  // Generate 5 calendar date buttons
  const dateOptions = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateKey = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dateKey, dayName, formattedDate };
  });

  // Filter slots by studio bay
  const filteredSlots = slots.filter((slot) => {
    if (selectedBay === 'ALL') return true;
    return slot.studioBay.includes(selectedBay);
  });

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section
      id="slots"
      style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '70px 24px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div
          className="glass-pill"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            marginBottom: '16px',
            color: '#38bdf8',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <Clock size={15} />
          <span>SOCKET.IO REAL-TIME SCHEDULING</span>
        </div>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', marginBottom: '14px' }}>
          Live Studio <span className="gradient-text-primary">Bay Reservation</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '15px' }}>
          Select your shooting date and time slot. When you click reserve, a 3-minute temporary lock holds the slot in real-time across all online users.
        </p>
      </div>

      {/* Selected Package Banner */}
      {selectedService ? (
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            marginBottom: '32px',
            borderColor: 'rgba(139, 92, 246, 0.5)',
            background: 'rgba(124, 58, 237, 0.12)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#c084fc', textTransform: 'uppercase', fontWeight: 700 }}>
                Selected Package
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>{selectedService.title}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Duration / Cost</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#38bdf8' }}>
                {selectedService.durationMinutes}m • ₹{selectedService.price?.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="glass-panel"
          style={{
            padding: '14px 22px',
            marginBottom: '30px',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            background: 'rgba(245, 158, 11, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fde68a', fontSize: '14px' }}>
            <AlertCircle size={18} color="#f59e0b" />
            <span>No package selected yet. Choose a package below or from Shoot Packages.</span>
          </div>
          <a href="#services" style={{ color: '#f59e0b', fontSize: '13px', fontWeight: 600 }}>
            Browse Packages &rarr;
          </a>
        </div>
      )}

      {/* Date Picker Bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '16px',
          marginBottom: '24px',
        }}
      >
        {dateOptions.map((item) => {
          const isSelected = selectedDate === item.dateKey;
          return (
            <button
              key={item.dateKey}
              onClick={() => setSelectedDate(item.dateKey)}
              style={{
                flex: '1 0 140px',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.9), rgba(236, 72, 153, 0.8))'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isSelected
                  ? '1px solid rgba(255, 255, 255, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 10px 25px rgba(124, 58, 237, 0.4)' : 'none',
              }}
            >
              <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', fontWeight: 600 }}>
                {item.dayName}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '4px' }}>
                {item.formattedDate}
              </div>
            </button>
          );
        })}
      </div>

      {/* Studio Bay Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { key: 'ALL', label: 'All Studio Stages' },
          { key: 'Stage A', label: 'Stage A (Neon & Cyber)' },
          { key: 'Stage B', label: 'Stage B (High-Key Gold)' },
          { key: 'Stage C', label: 'Stage C (Cinematic Deck)' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedBay(tab.key)}
            className="glass-pill"
            style={{
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              color: selectedBay === tab.key ? '#fff' : 'var(--text-muted)',
              background:
                selectedBay === tab.key
                  ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                  : 'rgba(255, 255, 255, 0.05)',
              border: selectedBay === tab.key ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Real-Time Slots Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
          Syncing real-time stage slots...
        </div>
      ) : filteredSlots.length === 0 ? (
        <div
          className="glass-panel"
          style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}
        >
          <Layers size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <h3>No slots scheduled for this stage on {selectedDate}</h3>
          <p style={{ fontSize: '14px', marginTop: '6px' }}>
            Check back or switch dates using the date selector above.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredSlots.map((slot) => {
            const isAvailable = slot.status === 'available';
            const isHolding = slot.status === 'holding';
            const isBooked = slot.status === 'booked';
            const isBlocked = slot.status === 'blocked';

            return (
              <div
                key={slot._id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isHolding
                    ? '1.5px solid #f59e0b'
                    : isAvailable
                    ? '1.5px solid rgba(16, 185, 129, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  background: isHolding
                    ? 'rgba(245, 158, 11, 0.06)'
                    : isBooked
                    ? 'rgba(15, 13, 30, 0.5)'
                    : 'var(--bg-card)',
                  opacity: isBooked || isBlocked ? 0.65 : 1,
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                    }}
                  >
                    {/* Status Pill */}
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: '99px',
                        backgroundColor: isAvailable
                          ? 'rgba(16, 185, 129, 0.15)'
                          : isHolding
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(239, 68, 68, 0.15)',
                        color: isAvailable ? '#34d399' : isHolding ? '#fbbf24' : '#f87171',
                        border: isAvailable
                          ? '1px solid rgba(16, 185, 129, 0.3)'
                          : isHolding
                          ? '1px solid rgba(245, 158, 11, 0.3)'
                          : '1px solid rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      {isAvailable && <span className="live-pulse" />}
                      {isHolding && <Clock size={12} />}
                      {isBooked && <Lock size={12} />}
                      {isAvailable
                        ? 'Available'
                        : isHolding
                        ? 'Holding Live'
                        : isBooked
                        ? 'Booked'
                        : 'Blocked'}
                    </span>

                    {/* Price Multiplier */}
                    {slot.priceMultiplier > 1 && (
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#f59e0b',
                          background: 'rgba(245, 158, 11, 0.1)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 600,
                        }}
                      >
                        Peak Hour ({slot.priceMultiplier}x)
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '22px',
                      fontWeight: '800',
                      marginBottom: '8px',
                    }}
                  >
                    <Clock size={20} color="#8b5cf6" />
                    <span>
                      {slot.startTime} – {slot.endTime}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '16px',
                    }}
                  >
                    <Video size={15} color="#ec4899" />
                    <span>{slot.studioBay}</span>
                  </div>

                  {isHolding && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#fbbf24',
                        background: 'rgba(245, 158, 11, 0.1)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                      }}
                    >
                      Held by {slot.heldBy?.userName || 'Another Client'} (In Checkout)
                    </div>
                  )}
                </div>

                {/* Booking Trigger Button */}
                <div style={{ marginTop: '14px' }}>
                  {isAvailable && (
                    <button
                      onClick={() => handleHoldSlot(slot)}
                      className="btn-primary"
                      style={{ width: '100%', padding: '12px', fontSize: '14px' }}
                    >
                      <Lock size={15} />
                      Hold & Reserve Slot
                    </button>
                  )}

                  {isHolding && (
                    <button
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '13px',
                        background: 'rgba(245, 158, 11, 0.2)',
                        color: '#fde68a',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Clock size={15} />
                      Currently Held
                    </button>
                  )}

                  {(isBooked || isBlocked) && (
                    <button
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '13px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        color: 'var(--text-dim)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Lock size={14} />
                      Slot Unavailable
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Real-time Hold & Booking Drawer/Modal */}
      {bookingModalOpen && heldSlot && (
        <div className="modal-overlay">
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '32px',
              position: 'relative',
              background: '#0e0c22',
              border: '1px solid rgba(139, 92, 246, 0.5)',
            }}
          >
            {/* Close / Release button */}
            <button
              onClick={() => handleReleaseSlot(heldSlot._id)}
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

            {/* Lock Timer Alert */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(236, 72, 153, 0.15))',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '12px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#f59e0b" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#fde68a' }}>
                  Slot Held Exclusively For You
                </span>
              </div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#fbbf24',
                  fontFamily: 'monospace',
                }}
              >
                {formatTimer(holdTimeLeft)}
              </div>
            </div>

            <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
              Confirm Studio Reservation
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              {heldSlot.studioBay} • {heldSlot.date} ({heldSlot.startTime} - {heldSlot.endTime})
            </p>

            {/* Package Summary */}
            {selectedService && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#c084fc', textTransform: 'uppercase', fontWeight: 700 }}>
                    Selected Shoot Type
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>{selectedService.title}</div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8' }}>
                  ₹{(selectedService.price * (heldSlot.priceMultiplier || 1)).toLocaleString('en-IN')}
                </div>
              </div>
            )}

            {/* Booking Form */}
            <form onSubmit={handleConfirmBooking}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Client Name
                  </label>
                  <input
                    type="text"
                    required
                    value={clientDetails.fullName}
                    onChange={(e) => setClientDetails({ ...clientDetails, fullName: e.target.value })}
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
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientDetails.phone}
                    onChange={(e) => setClientDetails({ ...clientDetails, phone: e.target.value })}
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

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Shoot Theme / Creative Direction
                </label>
                <input
                  type="text"
                  value={clientDetails.shootTheme}
                  onChange={(e) => setClientDetails({ ...clientDetails, shootTheme: e.target.value })}
                  placeholder="e.g., Cyberpunk MV, Golden Hour Soft Glow, High Fashion Lookbook"
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

              <div style={{ marginBottom: '22px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Special Lighting or Prop Requests
                </label>
                <textarea
                  rows={2}
                  value={clientDetails.specialRequests}
                  onChange={(e) => setClientDetails({ ...clientDetails, specialRequests: e.target.value })}
                  placeholder="e.g. Smoke machine, 360 turntable, sound engineer required"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => handleReleaseSlot(heldSlot._id)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel Hold
                </button>

                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="btn-primary"
                  style={{ flex: 2 }}
                >
                  {bookingSubmitting ? 'Confirming Reservation...' : 'Complete Studio Booking'}
                  <CheckCircle size={17} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
