# How to Start MongoDB on Windows

MongoDB needs to be running before you can seed the database. Here are the options:

## Option 1: MongoDB as a Windows Service (Recommended)

If MongoDB is installed as a Windows service:

1. **Open Services Manager:**
   - Press `Win + R`, type `services.msc`, press Enter
   - OR search for "Services" in the Start menu

2. **Find MongoDB Service:**
   - Look for "MongoDB" or "MongoDB Server" in the list
   - Common names: `MongoDB`, `MongoDB Server`, `MongoDB Database Server`

3. **Start the Service:**
   - Right-click on the MongoDB service
   - Click "Start"
   - Wait for status to change to "Running"

## Option 2: Start MongoDB Manually

If MongoDB is installed but not as a service:

1. **Open Command Prompt or PowerShell as Administrator**

2. **Navigate to MongoDB bin directory:**
   ```powershell
   cd "C:\Program Files\MongoDB\Server\[version]\bin"
   ```
   Replace `[version]` with your MongoDB version (e.g., `7.0`, `6.0`)

3. **Start MongoDB:**
   ```powershell
   mongod --dbpath "C:\data\db"
   ```
   Note: You may need to create the `C:\data\db` directory first if it doesn't exist.

## Option 3: Using MongoDB Compass

If you have MongoDB Compass installed:

1. Open MongoDB Compass
2. It will automatically start MongoDB if it's configured to do so
3. Or use Compass to connect to your MongoDB instance

## Option 4: MongoDB Atlas (Cloud)

If you're using MongoDB Atlas (cloud database):

1. **No need to start anything locally** - Atlas runs in the cloud
2. **Make sure your connection string is in `.env` file:**
   - Open `tracker-backend/.env`
   - Add or update: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dental-practice-manager`
   - Replace with your actual Atlas connection string

## Verify MongoDB is Running

After starting MongoDB, verify it's running:

```powershell
Test-NetConnection -ComputerName localhost -Port 27017
```

You should see `TcpTestSucceeded : True`

## Quick Test

Try connecting with MongoDB shell:
```powershell
mongosh
```

If it connects successfully, MongoDB is running!

## Troubleshooting

### "MongoDB service not found"
- MongoDB might not be installed
- Download from: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (free tier available)

### "Port 27017 already in use"
- Another MongoDB instance might be running
- Check Task Manager for `mongod.exe` processes
- Or change the port in MongoDB configuration

### "Access denied" errors
- Run Command Prompt/PowerShell as Administrator
- Or check MongoDB data directory permissions

## After Starting MongoDB

Once MongoDB is running, you can seed the database:

```powershell
cd tracker-backend
npm run seed:mock
```
