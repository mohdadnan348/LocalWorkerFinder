const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const connectDB = require('./db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Provider.deleteMany();
    await Service.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();

    console.log('Data cleared...');

    // Hash password function
    const hashPassword = async (pwd) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(pwd, salt);
    };

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: await hashPassword('admin123'),
      phone: '9999999999',
      role: 'admin',
      address: 'Admin Office',
    });

    // Create Customers
    const customer1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: await hashPassword('customer123'),
      phone: '9876543210',
      role: 'customer',
      address: '123, MG Road, Mumbai',
    });

    const customer2 = await User.create({
      name: 'Priya Singh',
      email: 'priya@example.com',
      password: await hashPassword('customer123'),
      phone: '9876543211',
      role: 'customer',
      address: '456, Park Street, Delhi',
    });

    // Create Providers
    const providerUser1 = await User.create({
      name: 'Rajesh Plumber',
      email: 'rajesh@example.com',
      password: await hashPassword('provider123'),
      phone: '9988776655',
      role: 'provider',
      address: 'A-12, Sector 15, Noida',
    });

    const provider1 = await Provider.create({
      userId: providerUser1._id,
      skills: ['Pipe Repair', 'Leakage Fix', 'Water Heater Installation'],
      experience: '8 years',
      location: 'Noida',
      description: 'Expert plumber with 8+ years experience. Quick service.',
      availability: {
        monday: { start: '09:00', end: '18:00' },
        tuesday: { start: '09:00', end: '18:00' },
        wednesday: { start: '09:00', end: '18:00' },
        thursday: { start: '09:00', end: '18:00' },
        friday: { start: '09:00', end: '18:00' },
        saturday: { start: '10:00', end: '16:00' },
        sunday: { start: '', end: '' },
      },
    });

    const providerUser2 = await User.create({
      name: 'Sunil Electrician',
      email: 'sunil@example.com',
      password: await hashPassword('provider123'),
      phone: '9988776644',
      role: 'provider',
      address: 'B-45, Sector 62, Gurgaon',
    });

    const provider2 = await Provider.create({
      userId: providerUser2._id,
      skills: ['Wiring', 'Fan Repair', 'Switch Installation', 'Inverter Service'],
      experience: '5 years',
      location: 'Gurgaon',
      description: 'Licensed electrician, fast and reliable.',
      availability: {
        monday: { start: '10:00', end: '20:00' },
        tuesday: { start: '10:00', end: '20:00' },
        wednesday: { start: '10:00', end: '20:00' },
        thursday: { start: '10:00', end: '20:00' },
        friday: { start: '10:00', end: '20:00' },
        saturday: { start: '09:00', end: '14:00' },
        sunday: { start: '', end: '' },
      },
    });

    // Create Services
    const service1 = await Service.create({
      providerId: provider1._id,
      name: 'Pipe Leakage Repair',
      category: 'Plumber',
      description: 'Fix any type of pipe leakage in kitchen/bathroom.',
      price: 499,
      duration: '1 hour',
      location: 'Noida',
    });

    const service2 = await Service.create({
      providerId: provider1._id,
      name: 'Water Heater Installation',
      category: 'Plumber',
      description: 'Install geyser/water heater with warranty.',
      price: 799,
      duration: '2 hours',
      location: 'Noida',
    });

    const service3 = await Service.create({
      providerId: provider2._id,
      name: 'Complete Home Wiring',
      category: 'Electrician',
      description: 'Full home wiring, switch boards, and fittings.',
      price: 1499,
      duration: '4 hours',
      location: 'Gurgaon',
    });

    const service4 = await Service.create({
      providerId: provider2._id,
      name: 'Fan / Light Repair',
      category: 'Electrician',
      description: 'Repair ceiling fans, lights, and switches.',
      price: 299,
      duration: '30 mins',
      location: 'Gurgaon',
    });

    // Create Bookings
    const booking1 = await Booking.create({
      userId: customer1._id,
      providerId: provider1._id,
      serviceId: service1._id,
      date: new Date('2026-04-10'),
      time: '11:00 AM',
      address: '123, MG Road, Mumbai',
      status: 'completed',
      totalAmount: 499,
    });

    const booking2 = await Booking.create({
      userId: customer2._id,
      providerId: provider2._id,
      serviceId: service3._id,
      date: new Date('2026-04-12'),
      time: '2:00 PM',
      address: '456, Park Street, Delhi',
      status: 'pending',
      totalAmount: 1499,
    });

    // Create Review for completed booking
    await Review.create({
      userId: customer1._id,
      providerId: provider1._id,
      bookingId: booking1._id,
      rating: 5,
      comment: 'Excellent work! Very professional.',
    });

    // Update provider ratings
    const reviews = await Review.find({ providerId: provider1._id });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Provider.findByIdAndUpdate(provider1._id, { rating: avgRating.toFixed(1), totalEarnings: 499 });

    console.log('Sample data inserted successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();