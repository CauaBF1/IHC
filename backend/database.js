import Database from 'better-sqlite3';

const db = new Database('chatbot.db');

// db.prepare('DROP TABLE IF EXISTS user_csv_data').run();
// db.prepare('DROP TABLE IF EXISTS chat_history').run();
// db.prepare('DROP TABLE IF EXISTS user_profile').run();
// Cria tabelas se não existirem
db.prepare(`
  CREATE TABLE IF NOT EXISTS user_profile (
    user_id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT
  );
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    message TEXT,
    response TEXT,
    chat_type TEXT DEFAULT 'general',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`).run();

// 📊 Nova tabela para dados CSV convertidos
db.prepare(`
  CREATE TABLE IF NOT EXISTS user_csv_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    file_type TEXT NOT NULL,
    json_content TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS diary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`).run();

try {
  db.prepare(`ALTER TABLE chat_history ADD COLUMN chat_type TEXT DEFAULT 'general'`).run();
  console.log('✅ Coluna chat_type adicionada com sucesso!');
} catch (err) {
  if (!err.message.includes('duplicate column name')) {
    console.error('Erro ao adicionar coluna chat_type:', err);
  }
}

export default db;
