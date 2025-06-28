import { BookModel } from '~/server/api/models/BookModel'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params || {}
  const bookId = parseInt(id);

  if (isNaN(bookId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid book ID format',
    })
  }

  try {
    const existingBook = await BookModel.findBookById(bookId)

    if (!existingBook) {
      throw createError({
        statusCode: 404,
        statusMessage: `Book with ID ${bookId} not found`,
      })
    }

    return {
      success: true,
      message: 'Book fetched successfully',
      data: existingBook,
    }
  } catch (error) {
    console.error("Book fetch error:", error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch book',
    })
  }
})
