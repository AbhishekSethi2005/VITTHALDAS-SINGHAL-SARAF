require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const adminEmail = 'admin@vss.com';
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin user already exists. Updating role to admin...');
      admin.role = 'admin';
      admin.password = 'admin123'; // It will be hashed on save
      await admin.save();
      console.log('Admin user updated successfully.');
    } else {
      console.log('Creating new admin user...');
      admin = await User.create({
        name: 'VSS Admin',
        email: adminEmail,
        phone: '9876543210',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created successfully.');
    }

    console.log('Admin Login Details:');
    console.log('Email: admin@vss.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
