import { ApolloCache, DocumentNode } from "@apollo/client"
import { Author, Book } from "../interfaces"
import { QueryClass } from "../interfaces/query"

export const updateCache = (
  cache: ApolloCache<object>,
  query: { query: DocumentNode, variables?: { author?: string, genre?: string } },
  addedResource: Book | Author | string[]
  ): void => {
  const uniqByName = (type: string, a: Book[] | Author[]) => {
    const seen = new Set()
    if (type === 'book') {
      return (a as Book[]).filter((item) => {
        const k = item.title
        return seen.has(k) ? false : seen.add(k)
      })
    }
    if (type === 'author') {
      return (a as Author[]).filter((item) => {
        const k = item.name
        return seen.has(k) ? false : seen.add(k)
      })
    }
  }

  const queryName = (query.query as unknown as QueryClass).definitions[0].selectionSet.selections[0].name.value
  
  if (queryName === 'allBooks') {
    cache.updateQuery(query, ( data ) => {
      const currentBooks = (data?.allBooks) as Book[] || [];
      return {
        allBooks: uniqByName( 'book', currentBooks.concat(addedResource as Book)),
      }
    })
  } else if (queryName === 'allAuthors') {
    cache.updateQuery(query, ( data ) => {
      const currentAuthors = (data?.allAuthors) as Author[] || [];
      return {
        allAuthors: uniqByName( 'author', currentAuthors.concat(addedResource as Author)),
      }
    })
  } else if (queryName === 'allGenres') {
    cache.updateQuery(query, ( data ) => {
      const currentGenres = (data?.allGenres) as string[] || [];
      const genres = currentGenres.concat(addedResource as string[])
      return {
        allGenres: [...new Set(genres)],
      }
    })
  }
}