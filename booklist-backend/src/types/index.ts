import Mongoose from "mongoose"

export interface Author {
  name: string,
  id: string,
  born?: number,
  bookCount?: number
}

export interface Book {
  title: string,
  published: number,
  author: Mongoose.Types.ObjectId | Author,
  id: string,
  genres: string[]
}

export interface User {
  username: string,
  favoriteGenre: string,
  id: string
  /* passwordHash: string */
}

export interface Token {
  value: string
  user: User
}

export interface Context {
  [key: string]: any
}
