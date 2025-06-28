import { BookModel } from "../models/BookModel"


export default defineEventHandler((event) => {
  const query = getQuery(event)
  const limit = parseInt(query.limit) || 10
  const page = parseInt(query.page) || 1
  const offset = (page - 1) * limit

  const total = BookModel.counts()
  const books = BookModel.findAllBooks(limit, offset)

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: books,
  }
})
