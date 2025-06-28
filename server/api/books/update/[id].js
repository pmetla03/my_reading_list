import { BookModel } from "../../models/BookModel.js"


export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  const bookId = parseInt(id)

  if (!bookId) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid book ID' })
  }
  
  const existingBook = BookModel.findBookById(bookId)
  if (!existingBook) {
    throw createError({ statusCode: 404, statusMessage: 'Book not found' })
  }

  const body = await readBody(event)
  const { title, author, isReady } = body

  const bookToUpdate = {}

  if (title !== undefined) bookToUpdate.title = title
  if (author !== undefined) bookToUpdate.author = author
  if (isReady !== undefined) bookToUpdate.is_read = isReady ? 1 : 0

  if (Object.keys(bookToUpdate).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No fields to update' })
  }

  BookModel.updateBook(bookId, bookToUpdate)

  return {
    success: true,
    message: 'Book updated successfully',
    updatedId: bookId
  }
})
