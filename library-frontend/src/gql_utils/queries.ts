import { gql } from '@apollo/client'
import { AUTHOR_DETAILS, BOOK_DETAILS } from './fragments'

export const ALL_BOOKS = gql`
query ($genre: String) {
  allBooks (
    genre: $genre
  ) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    ...AuthorDetails
  }
}
${AUTHOR_DETAILS}`

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