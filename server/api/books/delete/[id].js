import { BookModel } from "~/server/api/models/BookModel"

export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  const bookId = parseInt(id)
  
  if (isNaN(bookId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid book ID format'
    })
  }

 
  const existingBook = await BookModel.findBookById(bookId)
  if (!existingBook) {
    throw createError({
      statusCode: 404, 
      statusMessage: `Book with ID ${bookId} not found`
    })
  }

  try {
    BookModel.deleteBook(bookId)

  return {
    success: true,
    message: 'Book deleted successfully',
    updatedId: bookId
  }
    
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update book status',
      data: error
    })
  }
})