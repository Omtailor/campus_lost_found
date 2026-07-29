const pool = require('../db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const admins = [
  {
    name: 'System Administrator',
    roll_no: 'ADMIN001',
    email: 'admin1@campus.edu',
    password: 'Admin@123',
  },
  {
    name: 'Secondary Admin',
    roll_no: 'ADMIN002',
    email: 'admin2@campus.edu',
    password: 'Admin@123',
  },
];

async function seed() {
  const results = [];

  for (const admin of admins) {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [admin.email]);

    if (rows.length > 0) {
      console.log(`SKIP  ${admin.email} — user already exists`);
      results.push({ email: admin.email, action: 'skipped' });
      continue;
    }

    const password_hash = await bcrypt.hash(admin.password, SALT_ROUNDS);
    await pool.query(
      'INSERT INTO users (name, roll_no, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [admin.name, admin.roll_no, admin.email, password_hash, 'admin'],
    );

    console.log(`OK    ${admin.email} — inserted`);
    results.push({ email: admin.email, action: 'inserted' });
  }

  const inserted = results.filter((r) => r.action === 'inserted').length;
  const skipped = results.filter((r) => r.action === 'skipped').length;
  console.log(`\nDone. ${inserted} inserted, ${skipped} skipped.`);

  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});