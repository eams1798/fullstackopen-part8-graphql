import { Book, MyUser } from "../interfaces"
import { useQuery } from "@apollo/client"
import { ALL_BOOKS, ALL_GENRES, ME } from "../gql_utils/queries"
import { useEffect, useState } from "react";

interface IBooksProps {
  show: boolean
}

const Books = ({ show }: IBooksProps ) => {
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

  const resultMe = useQuery<{ me: MyUser | null }>(ME, {
    onError: (error) => {
      console.log(error)
    }
  })

  
  useEffect(() => {
    console.log(resultMe.data)
  }, [resultMe.data])

  if (!show) {
    return null
  }

  if (resultBooks.loading || resultGenres.loading || resultMe.loading) {
    return <div>loading...</div>
  }

  const books = resultBooks.data!.allBooks
  const genres = resultGenres.data!.allGenres
  const me = resultMe.data!.me


  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGenre(event.target.value || undefined);
  };

  return (
    <div>
      <h2>books</h2>

      <select onChange={handleGenreChange}>
        <option value="">All genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
        {me && (
          <option value={me.favoriteGenre}>Your favorite genre: {me.favoriteGenre}</option>
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
}

export default Books