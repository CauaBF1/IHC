import db from './database.js';

try {
  const stmt = db.prepare('SELECT * FROM user_profile WHERE username = ? and password = ?');
  const user = stmt.get('testuser','test');
  console.log('Query result:', user);
} catch (err) {
  console.error('DB test error:', err.stack || err);
}
