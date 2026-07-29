const { Router } = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const { signToken } = require('../utils/jwt');

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/signup', async (req, res) => {
  try {
    const { name, roll_no, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!roll_no || typeof roll_no !== 'string' || roll_no.trim().length === 0) {
      return res.status(400).json({ error: 'Roll number is required' });
    }
    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const [rows] = await pool.query(
      'SELECT id, email, roll_no FROM users WHERE email = ? OR roll_no = ?',
      [email, roll_no],
    );

    const emailMatch = rows.find((r) => r.email === email);
    if (emailMatch) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const rollMatch = rows.find((r) => r.roll_no === roll_no);
    if (rollMatch) {
      return res.status(409).json({ error: 'Roll number already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, roll_no, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), roll_no.trim(), email.trim(), password_hash, 'student'],
    );

    const userId = result.insertId;
    const token = signToken({ userId, role: 'student' });

    res.status(201).json({
      token,
      user: { id: userId, name: name.trim(), roll_no: roll_no.trim(), email: email.trim(), role: 'student' },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password || typeof password !== 'string' || password.length === 0) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const [rows] = await pool.query(
      'SELECT id, name, roll_no, email, password_hash, role FROM users WHERE email = ?',
      [email.trim()],
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken({ userId: user.id, role: user.role });

    res.status(200).json({
      token,
      user: { id: user.id, name: user.name, roll_no: user.roll_no, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;