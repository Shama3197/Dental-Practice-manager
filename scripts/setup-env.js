const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Dental Practice Manager environment...\n');

// Check Node.js version
const nodeVersion = process.version;
const requiredVersion = '18.0.0';
if (compareVersions(nodeVersion, requiredVersion) < 0) {
  console.error(`❌ Node.js version ${requiredVersion} or higher is required. Current version: ${nodeVersion}`);
  process.exit(1);
}
console.log(`✅ Node.js version: ${nodeVersion}`);

// Check if .env files exist and create them if needed
const backendEnvPath = path.join(__dirname, '../tracker-backend/.env');
const frontendEnvPath = path.join(__dirname, '../tracker-frontend/.env');

if (!fs.existsSync(backendEnvPath)) {
  console.log('📝 Creating backend .env file...');
  const backendEnvContent = `# Backend Environment Variables
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dental-practice-manager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=24h
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
`;
  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log('✅ Backend .env file created');
} else {
  console.log('✅ Backend .env file exists');
}

if (!fs.existsSync(frontendEnvPath)) {
  console.log('📝 Creating frontend .env file...');
  const frontendEnvContent = `# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Oryx
`;
  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ Frontend .env file created');
} else {
  console.log('✅ Frontend .env file exists');
}

// Check if directories exist
const requiredDirs = [
  'tracker-backend/scripts',
  'tracker-frontend/src/test'
];

requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

console.log('\n🎉 Environment setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Update the .env files with your actual configuration values');
console.log('2. Run "npm run install:all" to install all dependencies');
console.log('3. Run "npm run dev" to start both servers');
console.log('4. Run "npm run health-check" to verify everything is working');

function compareVersions(v1, v2) {
  const normalize = v => v.replace(/^v/, '').split('.').map(Number);
  const n1 = normalize(v1);
  const n2 = normalize(v2);
  
  for (let i = 0; i < Math.max(n1.length, n2.length); i++) {
    const num1 = n1[i] || 0;
    const num2 = n2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
} 