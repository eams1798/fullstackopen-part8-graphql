import { gql } from '@apollo/client'

export const ADD_BOOK = gql`
mutation addBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
  addBook(
    title: $title,
    published: $published,
    author: $author,
    genres: $genres,
  ) {
    title
    published
    author
    id
    genres
  }
}`

export const SET_BIRTH_YEAR = gql`
mutation setBirthYear ($name: String!, $setBornTo: Int!) {
  editAuthor(
    name: $name,
    setBornTo: $setBornTo
  ) {
    name
    born
    bookCount
    id
  }
}`