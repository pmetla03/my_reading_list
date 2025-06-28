import db from "../utils/db"


export class BookModel {
  static findAllBooks(limit = 10, offset = 0) {
    const stmt = db.prepare(`SELECT * FROM books LIMIT ? OFFSET ?`)
    return stmt.all(limit, offset)
  }

  static counts() {
    const stmt = db.prepare(`SELECT COUNT(*) as count FROM books`)
    return stmt.get().count
  }

  static createBook(book) {
    const stmt = db.prepare(`INSERT INTO books (title, author) VALUES (?, ?)`)
    const result = stmt.run(book.title, book.author)
    return result.lastInsertRowid
  }

  static findBookById(id) {
    const stmt = db.prepare(`SELECT * FROM books WHERE id = ?`)
    return stmt.get(id)
  }

  static deleteBook(id) {
    db.prepare(`DELETE FROM books WHERE id = ?`).run(id)
  }

  static updateBook(id, book) {
    const fields = []
    const values = []

    if (book.title !== undefined) {
      fields.push(`title = ?`)
      values.push(book.title)
    }
    if (book.author !== undefined) {
      fields.push(`author = ?`)
      values.push(book.author)
    }
     if (book.is_read !== undefined) {
      fields.push(`is_read = ?`)
      values.push(book.is_read)
    }

    if (fields.length > 0) {
      values.push(id)
      const query = `UPDATE books SET ${fields.join(', ')} WHERE id = ?`
      db.prepare(query).run(...values)
    }
  }
  static updateIsReady(id, isReady) {
  const stmt = db.prepare(`UPDATE books SET is_read = ? WHERE id = ?`)
  // Store boolean as 0 or 1
  stmt.run(isReady ? 1 : 0, id)
}
}
