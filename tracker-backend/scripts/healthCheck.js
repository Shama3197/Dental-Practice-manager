const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Backend Health Check\n');

async function checkMongoDB() {
  try {
    console.log('📊 Checking MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dental-practice-manager');
    console.log('✅ MongoDB connection successful');
    
    // Check if we can perform basic operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📋 Found ${collections.length} collections`);
    
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
}

async function checkEnvironment() {
  console.log('🔧 Checking environment variables...');
  
  const requiredVars = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET'
  ];
  
  const missing = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    console.error(`❌ Missing environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  return true;
}

async function runHealthCheck() {
  const envCheck = await checkEnvironment();
  const dbCheck = await checkMongoDB();
  
  console.log('\n📊 Health Check Summary:');
  console.log(`Environment Variables: ${envCheck ? '✅' : '❌'}`);
  console.log(`MongoDB Connection: ${dbCheck ? '✅' : '❌'}`);
  
  if (envCheck && dbCheck) {
    console.log('\n🎉 Backend is healthy!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Backend has issues. Please check the configuration.');
    process.exit(1);
  }
}

runHealthCheck().catch(err => {
  console.error('❌ Health check failed:', err);
  process.exit(1);
}); 