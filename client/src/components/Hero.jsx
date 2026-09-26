import React from 'react';
import { ArrowRight, Flame, Shield, Clock, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        zIndex: 10,
        padding: '80px 24px 60px',
        maxWidth: '1280px',
        margin: '0 auto',
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '680px' }}>
        {/* Top Announcement Pill */}
        <div
          className="glass-pill"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 18px',
            marginBottom: '24px',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            background: 'rgba(139, 92, 246, 0.1)',
          }}
        >
          <span className="live-pulse" />
          <span
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#d8b4fe',
              letterSpacing: '0.04em',
            }}
          >
            NEXT-GEN VIRTUAL & PHYSICAL PRODUCTION STAGE
          </span>
        </div>

        {/* Hero Title */}
        <h1
          style={{
            fontSize: 'clamp(36px, 5.5vw, 68px)',
            fontWeight: '900',
            lineHeight: '1.08',
            marginBottom: '22px',
          }}
        >
          Cinematic Visuals. <br />
          <span className="gradient-text-primary">Instant Real-Time</span> <br />
          Slot Booking.
        </h1>

        <p
          style={{
            fontSize: '17px',
            lineHeight: '1.6',
            color: 'var(--text-muted)',
            marginBottom: '36px',
            maxWidth: '560px',
          }}
        >
          Experience MV ProShoot’s premier high-key and cyberpunk stages. Book your exact studio bay in real-time with instant 3-minute lock protection to eliminate double bookings.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <a
            href="#slots"
            className="btn-primary"
            style={{ fontSize: '16px', padding: '14px 30px' }}
          >
            <Zap size={18} fill="#ffffff" />
            Book Live Studio Slot
            <ArrowRight size={18} />
          </a>

          <a
            href="#services"
            className="btn-secondary"
            style={{ fontSize: '16px', padding: '14px 26px' }}
          >
            Explore Shoot Packages
          </a>
        </div>

        {/* Feature Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '18px',
            marginTop: '48px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={18} color="#10b981" />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>Live Sync</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Zero conflicts</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(236, 72, 153, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Flame size={18} color="#ec4899" />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>6K Raw Rigs</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Cinema glass</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={18} color="#06b6d4" />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>JWT Secure</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Verified auth</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
