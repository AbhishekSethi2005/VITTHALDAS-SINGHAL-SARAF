const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // DNS override may be restricted in sandboxed or serverless environments
}

const mongoose = require('mongoose');

let isConnecting = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return isConnecting;
  }

  if (!process.env.MONGODB_URI) {
    const errorMsg = 'MONGODB_URI is not defined in environment variables.';
    console.error(`[Database] Error: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  // In serverless, single attempt with short timeout to prevent function timeouts
  const isServerless = !!process.env.VERCEL;
  const maxAttempts = isServerless ? 1 : 5;
  let attempts = 0;

  isConnecting = (async () => {
    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`\n🔄 [Database] Connecting to MongoDB Atlas (Attempt ${attempts}/${maxAttempts})...`);
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
          serverSelectionTimeoutMS: 5000,
        });

        console.log(`\n✨ [Database] Connection Established Successfully!`);
        console.log(`📌 Host: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}\n`);
        return conn;
      } catch (error) {
        console.error(`❌ [Database] Connection failed: ${error.message}`);
        if (attempts < maxAttempts) {
          console.log(`🕒 Retrying in 2 seconds...`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          console.error('[Database] Maximum database connection attempts reached.');
          throw error;
        }
      }
    }
  })().finally(() => {
    isConnecting = null;
  });

  return isConnecting;
};

module.exports = connectDB;
