import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
query ($genre: String) {
  allBooks (
    genre: $genre
  ) {
    title
    published
    author {
      name
    }
    id
    genres
  }
}`

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
    id
  }
}`

export const ALL_GENRES = gql`
query {
  allGenres
}
`

export const ME = gql`
query {
  me {
    username
    favoriteGenre
  }
}`