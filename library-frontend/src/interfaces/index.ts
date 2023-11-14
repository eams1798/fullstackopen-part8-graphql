export interface MyUser {
  username: string
  favoriteGenre: string
}

export interface Author {
  name: string,
  id: string,
  born?: number,
  bookCount?: number
}

export interface Book {
  title: string,
  published: number,
  author: Author,
  id: string,
  genres: string[]
}

export interface LoginVariables {
  username: string;
  password: string;
}

export interface LoginResponse {
  login: {
    value: string;
    user: MyUser
  };
}

export interface AddBookVariables {
  title: string
  author: string
  published: number
  genres: string[]
}

export interface AddBookResponse {
  addBook: Book
}

export interface SetBYVariables {
  name: string
  setBornTo: number
}

export interface SetBYResponse {
  editAuthor: {
    name: string
    born: number
    bookCount: number
    id: string
  }
}

export interface NotifProperties {
  type: string
  message: string
}
