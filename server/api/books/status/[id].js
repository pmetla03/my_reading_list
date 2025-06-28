import { BookModel } from "~/server/api/models/BookModel"

export default defineEventHandler(async (event) => {
  // 1. Validate and parse ID
  const { id } = event.context.params
  const bookId = parseInt(id)
  
  if (isNaN(bookId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid book ID format'
    })
  }

  // 2. Check book existence
  const existingBook = await BookModel.findBookById(bookId)
  if (!existingBook) {
    throw createError({
      statusCode: 404, 
      statusMessage: `Book with ID ${bookId} not found`
    })
  }

  // 3. Validate request body
  const body = await readBody(event);
  console.log("body",body)
  const { isRead } = body
  console.log("isReady",isRead)
  if (typeof isRead !== 'boolean') {
    throw createError({
      statusCode: 400,
      statusMessage: 'isRead must be a boolean value'
    })
  }

  // 4. Update book status
  try {
    await BookModel.updateIsReady(bookId, isRead)
    
    return {
      success: true,
      message: `Book marked as ${isRead ? 'read' : 'unread'}`,
      data: {
        id: bookId,
        isRead
      }
    }
    
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update book status',
      data: error
    })
  }
})