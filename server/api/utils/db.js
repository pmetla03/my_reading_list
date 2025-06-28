import Database from 'better-sqlite3'

// Open (or create) the SQLite database file
const db = new Database('readingManagement.sqlite')

// Create 'books' table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0  -- 0 = false, 1 = true
  )
`)

export default db