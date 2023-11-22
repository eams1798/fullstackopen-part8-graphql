import { gql } from "@apollo/client";

export const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  title
  published
  author {
    name
    born
  }
  genres
  id
}`;

export const AUTHOR_DETAILS = gql`
fragment AuthorDetails on Author {
  name
  born
  bookCount
  id
}`;