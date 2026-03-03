# Seed Mock Data Script

This script populates the database with realistic mock data for testing and demonstration purposes.

## What It Creates

- **30 Patients** with complete profiles (name, email, phone, address, insurance, etc.)
- **Appointments** distributed from 3 days before today to 5 days ahead (approximately 30-40 appointments)
- **Lab Work Entries** distributed across the same date range (approximately 15-20 entries)
- **Income/Revenue Entries** linked to completed appointments and delivered lab work

## Date Range

The script automatically calculates:
- **Start Date**: 3 days before today
- **End Date**: 5 days ahead from today

This gives you a total of **9 days** of data spanning past, present, and future.

## Prerequisites

1. **MongoDB must be running**
   - Local MongoDB: Make sure MongoDB service is started
   - MongoDB Atlas: Ensure your connection string in `.env` is correct

2. **Environment Variables**
   - Check `tracker-backend/.env` for `MONGODB_URI` or `MONGO_URI`
   - Default: `mongodb://localhost:27017/dental-practice-manager`

## Usage

### Option 1: Using npm script
```bash
cd tracker-backend
npm run seed:mock
```

### Option 2: Direct node command
```bash
cd tracker-backend
node scripts/seedMockData.js
```

## What Gets Created

### Patients
- Random names from a pool of common first/last names
- Unique email addresses
- Phone numbers, addresses, insurance information
- Mix of Active, Inactive, and New statuses

### Appointments
- Distributed across the 9-day range
- Various treatment types (Cleanings, Fillings, Root Canals, Crowns, etc.)
- Realistic time slots (8:00 AM - 5:30 PM)
- Status based on date:
  - **Past dates**: Mostly Completed, some Cancelled/No Show
  - **Today**: Scheduled, Confirmed, or In Progress
  - **Future dates**: Scheduled or Confirmed
- Costs ranging from $50 to $8000 depending on treatment type

### Lab Work
- Various types (Crown, Bridge, Denture, Veneer, Implant, etc.)
- Status based on date:
  - **Past dates**: Completed or Delivered
  - **Today/Future**: Pending or In Progress
- Lab names from a pool of realistic dental lab names
- Costs ranging from $200 to $3000

### Income/Revenue
- Automatically created for completed appointments
- Automatically created for delivered lab work
- Various payment methods (Cash, Credit Card, Insurance, etc.)
- Includes tax calculations (8%)
- Some entries have discounts applied

## Data Clearing

⚠️ **Warning**: The script clears ALL existing data before seeding:
- All patients
- All appointments
- All lab work
- All income entries

If you want to keep existing data, comment out the clearing section in the script.

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED ::1:27017
```
**Solution**: Make sure MongoDB is running
- Windows: Check Services or run `mongod`
- Mac/Linux: Run `sudo systemctl start mongod` or `brew services start mongodb-community`

### Duplicate Email Error
If you run the script multiple times without clearing, you may get duplicate email errors. The script clears data first, so this shouldn't happen unless you modify the clearing logic.

## Customization

You can modify the script to:
- Change the number of patients (currently 30)
- Adjust the date range (currently 3 days back, 5 days ahead)
- Modify treatment types, costs, or other data
- Change the distribution of appointments per day

## Example Output

```
✅ Connected to MongoDB
🗑️  Clearing existing data...
✅ Existing data cleared
📅 Date range: 3/1/2025 to 3/9/2025
👥 Creating patients...
✅ Created 30 patients
📅 Creating appointments...
✅ Created 38 appointments
🔬 Creating lab work entries...
✅ Created 18 lab work entries

📊 Seed Data Summary:
   Patients: 30
   Appointments: 38
   Lab Work Entries: 18
   Income Entries: $45,230.00
   Date Range: 3/1/2025 to 3/9/2025

✅ Seed data created successfully!
✅ Disconnected from MongoDB
```
