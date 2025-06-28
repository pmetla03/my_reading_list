import { BookModel } from "../models/BookModel";


export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, author } = body
  console.log("Received data:", body); // Debug log

  if (!title || !author) {
    throw createError({ statusCode: 400, statusMessage: 'Title and author are required' })
  }

  const id = BookModel.createBook({ title, author })
  return { success: true,message: 'Book added successfully',id }
})
