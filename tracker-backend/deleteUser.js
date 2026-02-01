const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path if needed

require('dotenv').config();

const deleteUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for user deletion.');

    const emailToDelete = 'shamasreeram@gmail.com'; // The email that caused the conflict
    const result = await User.deleteOne({ email: emailToDelete });

    if (result.deletedCount === 1) {
      console.log(`User with email ${emailToDelete} deleted successfully.`);
    } else {
      console.log(`User with email ${emailToDelete} not found or not deleted.`);
    }

    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  } catch (error) {
    console.error('Error deleting user:', error.message);
    process.exit(1);
  }
};

deleteUser(); 