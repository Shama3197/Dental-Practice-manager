# Dental Practice Manager - Data Storage Locations

This document identifies all locations where your dental practice manager app stores data on your laptop.

## 📍 Main Project Directory

**Location:** `D:\dental-practice-manager\`

This is your root project folder containing all application code and data.

---

## 💾 Database Storage

### MongoDB Database
Your app uses MongoDB to store all patient data, appointments, treatments, lab work, etc.

**Default Local Database Location:**
- **Windows:** `C:\Program Files\MongoDB\Server\[version]\data\db\` (or custom location)
- **Database Name:** `dental-practice-manager` (default)
- **Connection String:** Check `tracker-backend\.env` file for `MONGODB_URI`

**To find your exact database location:**
1. Check `tracker-backend\.env` file for the `MONGODB_URI` value
2. If using MongoDB Atlas (cloud), data is stored remotely
3. If using local MongoDB, check MongoDB configuration files

**Configuration File:**
- `tracker-backend\.env` - Contains database connection string

---

## 📁 File Uploads Storage

### Local Uploads Directory
**Location:** `D:\dental-practice-manager\tracker-backend\uploads\`

This directory stores:
- Patient documents
- X-rays and images
- Treatment plan files
- Any files uploaded through the app

**Note:** Files may also be stored in Cloudinary (cloud storage) if configured. Check `tracker-backend\.env` for Cloudinary settings.

---

## 📦 Dependencies (Node Modules)

### Root Level
**Location:** `D:\dental-practice-manager\node_modules\`

### Backend Dependencies
**Location:** `D:\dental-practice-manager\tracker-backend\node_modules\`

### Frontend Dependencies
**Location:** `D:\dental-practice-manager\tracker-frontend\node_modules\`

**Note:** These can be safely deleted and reinstalled with `npm install`. They take up significant space but are not your application data.

---

## 🔧 Configuration Files

### Environment Variables (Sensitive Data)
- `D:\dental-practice-manager\tracker-backend\.env` - Backend configuration (database, API keys, etc.)
- `D:\dental-practice-manager\tracker-frontend\.env` - Frontend configuration

**⚠️ Important:** These files contain sensitive information and are excluded from git.

---

## 🏗️ Build Artifacts

### Frontend Build Output
**Location:** `D:\dental-practice-manager\tracker-frontend\dist\` (created when building for production)

**Note:** This directory is created only when you run `npm run build`. It can be safely deleted and regenerated.

---

## 📝 Application Code & Data

### Backend Code
- `D:\dental-practice-manager\tracker-backend\src\` - Main backend source code
- `D:\dental-practice-manager\tracker-backend\routes\` - API routes
- `D:\dental-practice-manager\tracker-backend\models\` - Database models
- `D:\dental-practice-manager\tracker-backend\controllers\` - Route controllers

### Frontend Code
- `D:\dental-practice-manager\tracker-frontend\src\` - React application source code
- `D:\dental-practice-manager\tracker-frontend\public\` - Static assets (images, icons)

### Test Files
- `D:\dental-practice-manager\test-*.js` - Test scripts in root directory
- `D:\dental-practice-manager\test-patient.json` - Test data

---

## 🗑️ Files/Folders NOT Related to Your App

### ❌ Can Be Removed:
1. **`D:\dental-practice-manager\Git\`** - This appears to be a Git installation folder, NOT part of your project
   - This is likely a misplacement and should not be in your project directory
   - Git should be installed system-wide, not in your project folder

### ✅ Keep These (Backup/Archive):
- `D:\dental-practice-manager\backend_auth_backup\` - Backup of authentication code
- `D:\dental-practice-manager\frontend_auth_backup\` - Backup of frontend auth code

---

## 📊 Summary of Data Locations

| Type | Location | Size | Can Delete? |
|------|----------|------|-------------|
| **Application Code** | `D:\dental-practice-manager\` (excluding node_modules) | Varies | ❌ No |
| **Database** | MongoDB (local or Atlas) | Varies | ❌ No - Contains all your data |
| **Uploaded Files** | `tracker-backend\uploads\` | Varies | ❌ No - Patient files |
| **Dependencies** | `node_modules\` (3 locations) | Large | ✅ Yes - Can reinstall |
| **Build Files** | `tracker-frontend\dist\` | Medium | ✅ Yes - Can rebuild |
| **Config Files** | `.env` files | Small | ❌ No - Required |
| **Git Folder** | `Git\` folder | Large | ✅ Yes - Not part of project |

---

## 🧹 Cleanup Recommendations

### Safe to Delete (can be regenerated):
1. **All `node_modules\` folders** - Reinstall with `npm run install:all`
2. **`tracker-frontend\dist\`** - Rebuild with `npm run build`
3. **`Git\` folder** - This shouldn't be in your project directory

### To Clean Up:
```bash
# Remove node_modules (saves significant space)
npm run clean

# Remove Git folder (if confirmed it's not needed)
# Manually delete: D:\dental-practice-manager\Git\
```

### ⚠️ NEVER Delete:
- `tracker-backend\uploads\` - Contains patient files
- `.env` files - Contains configuration
- `src\` directories - Your application code
- MongoDB database - Contains all your data

---

## 🔍 How to Find MongoDB Database Location

If using local MongoDB:

1. **Check MongoDB service:**
   ```powershell
   Get-Service MongoDB
   ```

2. **Check MongoDB config file:**
   - Usually at: `C:\Program Files\MongoDB\Server\[version]\bin\mongod.cfg`
   - Look for `storage.dbPath` setting

3. **Check your .env file:**
   ```bash
   # Open: tracker-backend\.env
   # Look for: MONGODB_URI=mongodb://localhost:27017/dental-practice-manager
   ```

---

## 📋 Quick Checklist

Before deleting anything, verify:
- [ ] MongoDB database location (check .env file)
- [ ] Uploaded files location (`tracker-backend\uploads\`)
- [ ] Backup any important data
- [ ] Confirm `Git\` folder is not needed
- [ ] Check if using Cloudinary (cloud storage) for files

---

**Last Updated:** Generated automatically
**Project Root:** `D:\dental-practice-manager\`
