require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Service = require('./models/Service');
const Slot = require('./models/Slot');
const Booking = require('./models/Booking');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seed] Connected to MongoDB Atlas...');

    // Clear old data
    await User.deleteMany();
    await Service.deleteMany();
    await Slot.deleteMany();
    await Booking.deleteMany();
    console.log('[Seed] Cleared existing records.');

    // 1. Create Default Users
    const admin = await User.create({
      name: 'MV Director (Admin)',
      email: 'admin@mvproshoot.com',
      password: 'password123',
      role: 'admin',
      phone: '+91 98765 43210',
    });

    const demoClient = await User.create({
      name: 'Rohan Sharma',
      email: 'client@mvproshoot.com',
      password: 'password123',
      role: 'user',
      phone: '+91 91234 56789',
    });

    console.log('[Seed] Created default users:');
    console.log('   Admin: admin@mvproshoot.com / password123');
    console.log('   Client: client@mvproshoot.com / password123');

    // 2. Create Shoot Services
    const services = await Service.insertMany([
      {
        title: 'Cinematic Music Video (MV) Shoot',
        category: 'Cinematic MV Shoot',
        description:
          'Full-scale 4K HDR production featuring dynamic gimbal camera work, custom cyber/neon lighting rigs, smoke FX, and sound-synced playback.',
        durationMinutes: 120,
        price: 24999,
        badge: 'Most Popular',
        features: [
          'Full Studio Stage A with custom lighting',
          'Sony FX6 / RED Komodo 6K recording',
          'Professional MV Director & Gaffer',
          'Real-time color grade monitor feed',
          'Raw footage + 3 edited teasers included',
        ],
      },
      {
        title: 'Editorial & Fashion Lookbook',
        category: 'Fashion & Editorial',
        description:
          'High-glamour lighting and artistic art direction designed for models, designers, and high-fashion agencies.',
        durationMinutes: 90,
        price: 14999,
        badge: 'High Key Glam',
        features: [
          'Stage B - High-Key Gold & Softbox Array',
          'Hair & Makeup dressing lounge access',
          '50 High-res master retouched shots',
          'Instant tethered iPad preview for team',
        ],
      },
      {
        title: 'Luxury Pre-Wedding & Couple Shoot',
        category: 'Wedding & Pre-Shoot',
        description:
          'Romantic storytelling with dramatic bokeh, soft ambient lanterns, floral backdrops, and cinematic couple portraits.',
        durationMinutes: 150,
        price: 28999,
        badge: 'Bestseller',
        features: [
          'Indoor & Ambient Outdoor Terrace Bay',
          'Drone fly-through indoor cinematic shots',
          'Complimentary teaser reel for Instagram',
          'Includes wardrobe change time',
        ],
      },
      {
        title: 'E-Commerce & High-End Product Shoot',
        category: 'Product & Commercial',
        description:
          'Pin-sharp 360 motorized turntable captures, macro jewelry lenses, and glossy reflective surfaces for brand campaigns.',
        durationMinutes: 60,
        price: 9999,
        badge: 'Commercial',
        features: [
          'Motorized 360-degree turntable',
          'Polarized zero-glare lighting',
          'Up to 15 product variants per session',
          'Transparent PNG + Clean background exports',
        ],
      },
      {
        title: 'Executive & Celebrity Studio Portrait',
        category: 'Studio Portrait',
        description:
          'Power portraits for CEOs, creators, founders, and actors with dramatic Rembrandt & rim lighting.',
        durationMinutes: 45,
        price: 6999,
        badge: 'Express',
        features: [
          '15 High-definition executive headshots',
          'Bespoke canvas backdrop textures',
          'Same-day digital delivery',
        ],
      },
    ]);

    console.log(`[Seed] Inserted ${services.length} studio services.`);

    // 3. Generate Slots for Today and Next 4 Days
    const timeSlots = [
      { start: '10:00 AM', end: '11:30 AM', bay: 'Studio Stage A (Neon & Cyber)' },
      { start: '12:00 PM', end: '01:30 PM', bay: 'Studio Stage B (High-Key Gold)' },
      { start: '02:30 PM', end: '04:00 PM', bay: 'Studio Stage C (Cinematic MV Deck)' },
      { start: '04:30 PM', end: '06:00 PM', bay: 'Studio Stage A (Neon & Cyber)' },
      { start: '06:30 PM', end: '08:00 PM', bay: 'Studio Stage C (Cinematic MV Deck)', multiplier: 1.15 },
      { start: '08:30 PM', end: '10:00 PM', bay: 'Studio Stage B (Midnight Ambient)', multiplier: 1.25 },
    ];

    const slotsToInsert = [];
    const today = new Date();

    for (let i = 0; i < 5; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      const dateStr = targetDate.toISOString().split('T')[0];

      timeSlots.forEach((t, idx) => {
        // Randomly set a few as booked/holding for demonstration
        let status = 'available';
        if (i === 0 && idx === 1) status = 'booked';
        if (i === 0 && idx === 3) status = 'holding';

        slotsToInsert.push({
          date: dateStr,
          startTime: t.start,
          endTime: t.end,
          studioBay: t.bay,
          allowedServices: [services[0]._id, services[1]._id, services[2]._id],
          status: status,
          priceMultiplier: t.multiplier || 1.0,
          heldBy:
            status === 'holding'
              ? {
                  userName: 'Priya K. (Holding)',
                  expiresAt: new Date(Date.now() + 2 * 60 * 1000),
                }
              : null,
        });
      });
    }

    const createdSlots = await Slot.insertMany(slotsToInsert);
    console.log(`[Seed] Generated ${createdSlots.length} real-time slots across 5 days.`);

    console.log('[Seed] Database initialization completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error populating database:', err);
    process.exit(1);
  }
};

seedData();
