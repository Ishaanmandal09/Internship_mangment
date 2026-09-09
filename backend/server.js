const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const materialRoutes = require('./routes/materialRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const testRoutes = require('./routes/testRoutes');

app.use('/api/materials', materialRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/tests', testRoutes);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/internships', require('./routes/internshipRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Connect to MongoDB with caching for serverless environments (Vercel optimization)
let cachedDb = null;
async function connectDB() {
  if (cachedDb) return;
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  cachedDb = conn;
}
connectDB();

// EXPORT the app for Vercel serverless functions
module.exports = app;

// For local development compatibility
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running live on port ${PORT}`);
  });
}