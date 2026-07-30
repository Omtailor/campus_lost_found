const { Router } = require('express');
const pool = require('../db');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = Router();

const VALID_CATEGORIES = ['electronics', 'documents', 'clothing', 'accessories', 'bags', 'books', 'keys', 'other'];

router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { report_kind, category, description } = req.body;
    const student_id = req.user.userId;

    if (!report_kind || !['lost', 'found'].includes(report_kind)) {
      return res.status(400).json({ error: 'report_kind must be "lost" or "found"' });
    }

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: `category must be one of: ${VALID_CATEGORIES.join(', ')}` });
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({ error: 'description is required' });
    }

    if (report_kind === 'lost' && !req.file) {
      return res.status(400).json({ error: 'Image is required for lost item reports' });
    }

    const image_url = req.file ? req.file.filename : null;

    let handover_note = null;
    if (report_kind === 'found') {
      const [userRows] = await pool.query('SELECT name FROM users WHERE id = ?', [student_id]);
      if (userRows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      handover_note = `${userRows[0].name} submitted this item to the admin office`;
    }

    const year = new Date().getFullYear();
    const prefix = report_kind === 'lost' ? 'LST' : 'FND';

    const [seqRows] = await pool.query(
      'SELECT MAX(CAST(RIGHT(unique_code, 4) AS UNSIGNED)) AS max_seq FROM reports WHERE report_kind = ? AND YEAR(created_at) = ?',
      [report_kind, year],
    );

    const nextSeq = (seqRows[0].max_seq || 0) + 1;
    const unique_code = `${prefix}-${year}-${String(nextSeq).padStart(4, '0')}`;

    const [result] = await pool.query(
      `INSERT INTO reports (unique_code, student_id, report_kind, category, description, image_url, handover_note, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [unique_code, student_id, report_kind, category, description.trim(), image_url, handover_note],
    );

    const [newReport] = await pool.query('SELECT * FROM reports WHERE id = ?', [result.insertId]);

    res.status(201).json(newReport[0]);
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds 5MB limit' });
    }
    if (err.message && err.message.startsWith('Only ')) {
      return res.status(400).json({ error: err.message });
    }
    console.error('Create report error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/mine', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM reports WHERE student_id = ? ORDER BY created_at DESC',
      [req.user.userId],
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error('Get my reports error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const { status, report_kind, limit, offset } = req.query;

    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (report_kind) {
      conditions.push('report_kind = ?');
      params.push(report_kind);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const queryLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const queryOffset = Math.max(parseInt(offset, 10) || 0, 0);

    const sql = `
      SELECT unique_code, report_kind, category, description, image_url, handover_note, status, created_at
      FROM reports
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(sql, [...params, queryLimit, queryOffset]);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Get reports error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;