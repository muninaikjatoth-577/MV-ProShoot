import React, { useState } from 'react';
import ThreeCanvas from './components/ThreeCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import SlotBookingSection from './components/SlotBookingSection';
import AuthModal from './components/AuthModal';
import UserDashboardModal from './components/UserDashboardModal';
import AdminPanelModal from './components/AdminPanelModal';
import { useAuth } from './context/AuthContext';
import { Camera, CheckCircle2, Shield, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authPortalMode, setAuthPortalMode] = useState('client'); // 'client' | 'admin'
  const [dashboardModalOpen, setDashboardModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [recentBooking, setRecentBooking] = useState(null);

  const handleOpenClientAuth = () => {
    setAuthPortalMode('client');
    setAuthModalOpen(true);
  };

  const handleOpenAdminAuth = () => {
    if (user?.role === 'admin') {
      setAdminModalOpen(true);
    } else {
      setAuthPortalMode('admin');
      setAuthModalOpen(true);
    }
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    const slotsEl = document.getElementById('slots');
    if (slotsEl) {
      slotsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingSuccess = (bookingData) => {
    setRecentBooking(bookingData);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Dynamic Ambient Palette Glows */}
      <div className="ambient-palette-bg">
        <div className="blob-1" />
        <div className="blob-2" />
        <div className="blob-3" />
      </div>

      {/* 3D WebGL Cinema Camera & Optical Lens Rig */}
      <ThreeCanvas />

      {/* Foreground Interactive Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar
          onOpenClientAuth={handleOpenClientAuth}
          onOpenAdminAuth={handleOpenAdminAuth}
          onOpenMyBookings={() => setDashboardModalOpen(true)}
          onOpenAdmin={() => setAdminModalOpen(true)}
        />

        {/* Recent Booking Alert */}
        {recentBooking && (
          <div
            style={{
              maxWidth: '960px',
              margin: '20px auto 0',
              padding: '0 24px',
            }}
          >
            <div
              className="glass-panel"
              style={{
                padding: '20px 24px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(124, 58, 237, 0.15))',
                borderColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <CheckCircle2 size={28} color="#10b981" />
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800 }}>
                    Reservation Confirmed! Reference: {recentBooking.booking?.bookingReference}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Your shoot is locked in MongoDB Atlas and dispatched to the Director Dashboard in real-time.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setRecentBooking(null);
                  setDashboardModalOpen(true);
                }}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                View My Reservation
              </button>
            </div>
          </div>
        )}

        <main>
          <Hero />

          <ServicesSection
            onSelectService={handleSelectService}
            selectedServiceId={selectedService?._id}
          />

          <SlotBookingSection
            selectedService={selectedService}
            onRequireAuth={handleOpenClientAuth}
            onBookingSuccess={handleBookingSuccess}
          />
        </main>

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(8, 7, 18, 0.85)',
            backdropFilter: 'blur(20px)',
            padding: '60px 24px 30px',
            marginTop: '80px',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '30px',
              }}
            >
              <div style={{ maxWidth: '380px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Camera size={18} color="#fff" />
                  </div>
                  <span style={{ fontSize: '20px', fontWeight: '800' }}>
                    MV <span className="gradient-text-primary">PROSHOOT</span>
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Ultra-production virtual and soundstage studio. Equipped with full 3D cinema camera preview, real-time socket reservation synchronization, and dual client & director access portals.
                </p>
              </div>

              <div>
                <h5 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px', color: '#c084fc' }}>
                  STUDIO STAGES
                </h5>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                  <li>Stage A — Cyberpunk & Neon Rig</li>
                  <li>Stage B — High-Key Gold & Softbox</li>
                  <li>Stage C — Cinematic MV Turntable</li>
                  <li>Stage D — Virtual LED Volume</li>
                </ul>
              </div>

              <div>
                <h5 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px', color: '#38bdf8' }}>
                  PORTAL ACCESS
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                  <button
                    onClick={handleOpenClientAuth}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: 0,
                    }}
                  >
                    Client Booking Portal &rarr;
                  </button>
                  <button
                    onClick={handleOpenAdminAuth}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#f59e0b',
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: 0,
                    }}
                  >
                    Director & Admin Command Bay &rarr;
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                fontSize: '13px',
                color: 'var(--text-dim)',
              }}
            >
              <span>© {new Date().getFullYear()} MV ProShoot. All rights reserved.</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                Crafted with <Heart size={14} color="#ec4899" fill="#ec4899" /> for high production visuals
              </span>
            </div>
          </div>
        </footer>

        {/* Dual Portal Auth Modal */}
        <AuthModal
          isOpen={authModalOpen}
          portalMode={authPortalMode}
          onClose={() => setAuthModalOpen(false)}
          onAdminLoginSuccess={() => setAdminModalOpen(true)}
        />

        {/* User Reservations Dossier */}
        <UserDashboardModal
          isOpen={dashboardModalOpen}
          onClose={() => setDashboardModalOpen(false)}
        />

        {/* Admin Command Bay with Live Booking Stream */}
        <AdminPanelModal
          isOpen={adminModalOpen}
          onClose={() => setAdminModalOpen(false)}
        />
      </div>
    </div>
  );
}
