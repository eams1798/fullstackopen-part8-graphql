export interface Author {
    name: string,
    id: string,
    born?: number,
    bookCount?: number
  }
  
  export interface Book {
    title: string,
    published: number,
    author: string,
    id: string,
    genres: string[]
  }