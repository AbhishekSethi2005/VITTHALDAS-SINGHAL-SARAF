const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('CRITICAL ERROR: MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      console.log(`\n🔄 [Database] Connecting to MongoDB Atlas (Attempt ${attempts}/${maxAttempts})...`);
      
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,
      });

      console.log(`\n✨ [Database] Connection Established Successfully!`);
      console.log(`📌 Host: ${conn.connection.host}`);
      console.log(`📦 Database: ${conn.connection.name}\n`);
      return conn;
    } catch (error) {
      console.error(`❌ [Database] Connection failed: ${error.message}`);
      if (attempts < maxAttempts) {
        console.log(`🕒 Retrying in 5 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        console.error('\n💥 CRITICAL ERROR: Maximum database reconnection attempts reached. Exiting.');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
