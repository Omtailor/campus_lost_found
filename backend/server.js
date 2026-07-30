require('dotenv').config();

const express = require('express');
const db = require('./db');
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const adminReportRoutes = require('./routes/adminReports');
const { authenticate } = require('./middleware/auth');
const { requireAdmin } = require('./middleware/requireAdmin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin/reports', authenticate, requireAdmin, adminReportRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.json({ status: 'ok', db: 'error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
