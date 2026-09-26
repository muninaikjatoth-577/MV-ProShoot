import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Clock, IndianRupee, Video, ArrowRight } from 'lucide-react';

export default function ServicesSection({ onSelectService, selectedServiceId }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setServices(data.data);
        }
      })
      .catch((err) => console.error('Error fetching services:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="services"
      style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '70px 24px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <div
          className="glass-pill"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            marginBottom: '16px',
            color: '#c084fc',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <Sparkles size={15} />
          <span>BESPOKE PRODUCTION PACKAGES</span>
        </div>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', marginBottom: '14px' }}>
          Crafted for <span className="gradient-text-primary">Music Videos & Stills</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '15px' }}>
          Every session includes master lighting technicians, state-of-the-art camera rigs, sound playback, and high-speed tethered preview.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Loading bespoke studio services...
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
          }}
        >
          {services.map((svc) => {
            const isSelected = selectedServiceId === svc._id;
            return (
              <div
                key={svc._id}
                className="glass-panel"
                style={{
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isSelected ? '2px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected
                    ? 'linear-gradient(180deg, rgba(35, 28, 77, 0.8) 0%, rgba(20, 18, 48, 0.9) 100%)'
                    : 'var(--bg-card)',
                  transform: isSelected ? 'translateY(-4px)' : 'none',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        fontWeight: '700',
                        letterSpacing: '0.08em',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(236, 72, 153, 0.15)',
                        color: '#f472b6',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                      }}
                    >
                      {svc.badge || svc.category}
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Clock size={14} color="#06b6d4" />
                      <span>{svc.durationMinutes} mins</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '10px' }}>
                    {svc.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--text-muted)',
                      lineHeight: '1.5',
                      marginBottom: '22px',
                    }}
                  >
                    {svc.description}
                  </p>

                  {/* Feature Checkmarks */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' }}>
                    {svc.features?.map((feat, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '13px',
                          color: '#e2e8f0',
                        }}
                      >
                        <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      Session Rate
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff' }}>
                      ₹{svc.price?.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectService(svc)}
                    className={isSelected ? 'btn-primary' : 'btn-secondary'}
                    style={{ padding: '10px 18px', fontSize: '13px' }}
                  >
                    {isSelected ? 'Selected' : 'Select Package'}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
