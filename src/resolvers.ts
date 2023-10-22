import { Resolvers } from "./types/resolvers_generated"
import { Author, Book } from "./types"
import { v4 as uuidv4 } from 'uuid';
import { GraphQLError } from "graphql";

let authors: Author[] = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

let books: Book[] = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

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
    bookCount: (root, args) => {
      return books.filter((book) => {
        return book.author === root.name
      }).length || 0
    }
  },
  Query: {
    bookCount: () => books.length,
    allBooks: (root, args) => {
      return books.filter((book) => {
        if (args.author && args.genre) {
          return book.author === args.author && book.genres.includes(args.genre!);
        } else if (args.author) {
          return book.author === args.author;
        } else if (args.genre) {
          return book.genres.includes(args.genre!);
        }
        return true;
      });
    },
    authorCount: (root, args) => authors.length,
    allAuthors: () => authors
  },
  Mutation: {
    addBook: (root, args) => {
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
      const book = {
        title: args.title,
        published: args.published,
        author: args.author,
        id: uuidv4(),
        genres: args.genres
      }
      books.push(book)
      if (!authors.find((author) => author.name === args.author)) {
        authors.push({
          name: args.author,
          id: uuidv4(),
        })
      }
      return book
    },
    editAuthor: (root, args) => {
      const author = authors.find((author) => author.name === args.name)
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'NOT_FOUND',
            status: 404,
            invalidArgs: args.name
          }
        })
      }
      const auhorIndex = authors.findIndex((author) => author.name === args.name)
      authors[auhorIndex].born = args.setBornTo
      return author
    }
  }
}

export default resolvers