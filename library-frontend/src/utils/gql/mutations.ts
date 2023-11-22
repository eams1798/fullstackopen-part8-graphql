import { gql } from '@apollo/client'
import { AUTHOR_DETAILS, BOOK_DETAILS } from './fragments'

export const ADD_BOOK = gql`
mutation addBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
  addBook(
    title: $title,
    published: $published,
    author: $author,
    genres: $genres,
  ) {
    ...BookDetails
  }
}
${BOOK_DETAILS}`

export const SET_BIRTH_YEAR = gql`
mutation setBirthYear ($name: String!, $setBornTo: Int!) {
  editAuthor(
    name: $name,
    setBornTo: $setBornTo
  ) {
    ...AuthorDetails
  }
}
${AUTHOR_DETAILS}`

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
    user {
      username
      favoriteGenre
    }
  }
}`