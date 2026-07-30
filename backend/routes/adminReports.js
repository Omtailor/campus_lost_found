const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { status, report_kind, search, limit, offset } = req.query;

    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('r.status = ?');
      params.push(status);
    }
    if (report_kind) {
      conditions.push('r.report_kind = ?');
      params.push(report_kind);
    }
    if (search) {
      conditions.push('(r.description LIKE ? OR r.unique_code LIKE ? OR u.name LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const queryLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const queryOffset = Math.max(parseInt(offset, 10) || 0, 0);

    const sql = `
      SELECT r.*, u.name AS reporter_name, u.roll_no AS reporter_roll_no
      FROM reports r
      JOIN users u ON r.student_id = u.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(sql, [...params, queryLimit, queryOffset]);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Admin get reports error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query('SELECT * FROM reports WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const report = rows[0];

    if (report.status === 'resolved') {
      return res.status(400).json({ error: 'Report is already resolved' });
    }

    await pool.query(
      "UPDATE reports SET status = 'resolved', resolved_at = NOW() WHERE id = ?",
      [id],
    );

    const [updated] = await pool.query('SELECT * FROM reports WHERE id = ?', [id]);
    res.status(200).json(updated[0]);
  } catch (err) {
    console.error('Admin resolve report error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;