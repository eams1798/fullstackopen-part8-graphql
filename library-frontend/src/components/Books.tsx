import { Book, MyUser } from "../interfaces"
import { useQuery } from "@apollo/client"
import { ALL_BOOKS, ALL_GENRES } from "../gql_utils/queries"
import { forwardRef, useImperativeHandle, useState } from "react";

interface IBooksProps {
  show: boolean
  user: MyUser | null
}

export interface IBooksRef {
  setGenre: (genre: string | undefined) => void
}

const Books = forwardRef<IBooksRef, IBooksProps>(({ show, user }, ref ) => {
  const [genre, setGenre] = useState<string | undefined>(undefined);

  const resultBooks = useQuery<{ allBooks: Book[] }>(ALL_BOOKS, {
    variables: {
      genre
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const resultGenres = useQuery<{ allGenres: string[] }>(ALL_GENRES, {
    onError: (error) => {
      console.log(error)
    }
  })

  useImperativeHandle(ref, () => ({
    setGenre
  }))

  if (!show) {
    return null
  }

  if (resultBooks.loading || resultGenres.loading) {
    return <div>loading...</div>
  }


  const books = resultBooks.data!.allBooks
  const genres = resultGenres.data!.allGenres

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGenre(event.target.value || undefined);
  };

  return (
    <div>
      <h2>books</h2>

      <select onChange={handleGenreChange} value={genre}>
        <option value="">All genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
        {user && (
          <option value={user.favoriteGenre}>Your favorite genre: {user.favoriteGenre}</option>
        )}
      </select>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

Books.displayName = "Books"

export default Books