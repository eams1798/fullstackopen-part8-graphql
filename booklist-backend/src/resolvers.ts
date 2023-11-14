import { Author, Resolvers } from "./types/resolvers_generated"
import { v4 as uuidv4 } from 'uuid';
import { GraphQLError } from "graphql";
import Books from "./models/Book"
import Authors from "./models/Author"
import User from "./models/User";
import jwt from "jsonwebtoken";

const resolvers: Resolvers = {
  Book: {
    title: (root, args) => root.title,
    published: (root, args) => root.published,
    author: (root, args) => root.author,
    id: (root, args) => root.id,
    genres: (root, args) => root.genres || []
  },
  Author: {
    name: (root, args) => root.name,
    born: (root, args) => root.born || null,
    id: (root, args) => root.id,
    bookCount: async (root, args) => await Books.countDocuments({ author: root.id })
  },
  Query: {
    bookCount: async () => await Books.countDocuments({}),
    authorCount: async (root, args) => await Authors.countDocuments({}),
    allBooks: async (root, args) => {
      const books = (await Books.find({})
                      .populate('author'))
                      .map((book) => ({ ...book.toObject(), author: (book.author as Author), id: book.id.toString() }))

      if (args.author && args.genre) {
        return books.filter((book) => (book.author as Author).name === args.author && book.genres.includes(args.genre!))
      } else if (args.author) {
        return books.filter((book) => (book.author as Author).name === args.author)
      } else if (args.genre) {
        return books.filter((book) => book.genres.includes(args.genre!))
      } else return books
      
    },
    allAuthors: async () => await Authors.find({}),
    allGenres: async () => {
      const books = await Books.find({})
      const genres = books.map((book) => book.genres).flat()

      return [...new Set(genres)]
    },
    me: async (root, args, context) => {
      return context.currentUser || null
    }
  },
  Mutation: {
    createUser: async (root, args) => {
      if (!args.username || !args.favoriteGenre) {
        throw new GraphQLError('Missing required fields', {
          extensions: {
            code: 'BAD_USER_INPUT',
            status: 400
          }
        })
      }
      try {
        const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
        const savedUser = await user.save()
        
        return savedUser
      } catch (error) {
        throw new GraphQLError('Failed to create user', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            status: 400,
            error
          }
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'sekret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET!) }
    },
    addBook: async (root, args, context) => {
      const asyncMethod = async () => {
        const currentUser = context.currentUser
        if (!currentUser) {
          throw new GraphQLError('Unauthenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              status: 401
            }
          })
        }

        if (!args.title || !args.author || !args.published) {
          throw new GraphQLError('Missing required fields', {
            extensions: {
              code: 'BAD_USER_INPUT',
              status: 400
            }
          })
        }

        const books = await Books.find({})
        const authors = await Authors.find({})
        const titleOfBooks = books.map((book) => book.title)

        if (titleOfBooks.includes(args.title)) {
          throw new GraphQLError('Book already exists', {
            extensions: {
              code: 'CONFLICT',
              status: 409,
              invalidArgs: args.title
            }
          })
        }

        if (!authors.find((author) => author.name === args.author)) {
          await Authors.create({ name: args.author })
        }

        const bookAuthor = await Authors.findOne({ name: args.author })

        const book = new Books({
          title: args.title,
          published: args.published,
          author: bookAuthor!._id,
          genres: args.genres
        })

        const newBook = await (await book.save()).populate('author')
        
        const reuturnedBook = {...newBook.toObject(), author: (newBook.author as Author), id: newBook.id.toString() }
        console.log("reuturnedBook", reuturnedBook);
        return reuturnedBook
      }

      const result = await asyncMethod()
      console.log('result', result);
      
      return result
    },
    editAuthor: (root, args, context) => {
      const asyncMethod = async () => {
        const currentUser = context.currentUser
        if (!currentUser) {
          throw new GraphQLError('Unauthenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              status: 401
            }
          })
        }
        

        if (!args.name) {
          throw new GraphQLError('Missing required fields', {
            extensions: {
              code: 'BAD_USER_INPUT',
              status: 400
            }
          })
        }
        
        const author = await Authors.findOne({ name: args.name })

        if (!author) {
          throw new GraphQLError('Author not found', {
            extensions: {
              code: 'NOT_FOUND',
              status: 404,
              invalidArgs: args.name
            }
          })
        }

        const updatedAuthor = await Authors.findOneAndUpdate({ name: args.name }, { born: args.setBornTo }, { new: true })
        console.log("updatedAuthor", updatedAuthor);
        
        return updatedAuthor
      }

      return asyncMethod()
    }
  }
}

export default resolvers