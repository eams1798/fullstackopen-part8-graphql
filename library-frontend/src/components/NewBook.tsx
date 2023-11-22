import { useMutation } from '@apollo/client'
import { ADD_BOOK } from '../utils/gql/mutations'
import { useState } from 'react'
import { AddBookResponse, AddBookVariables } from '../interfaces'

interface INewBookProps {
  show: boolean
  onAddBook: () => void
  setNotification: ({ type, message }: { type: string, message: string }) => void
}

const NewBook = ({ show, onAddBook, setNotification }: INewBookProps) => {
  const [title, setTitle] = useState<string>('')
  const [author, setAuthor] = useState<string>('')
  const [published, setPublished] = useState<string>('')
  const [genre, setGenre] = useState<string>('')
  const [genres, setGenres] = useState<string[]>([])

  const [createPerson] = useMutation<AddBookResponse, AddBookVariables>(ADD_BOOK, {
    onError: (error) => {
      console.log(error)
      setNotification({
        type: 'error',
        message: error.graphQLErrors[0].message
      })
    },
  })

  if (!show) {
    return null
  }

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    const result = await createPerson({
      variables: {
        title,
        author,
        published: Number(published),
        genres,
      },
    })

    if (!result.errors) {
      setNotification({
        type: 'success',
        message: `added ${title} by ${author}`
      })

      onAddBook()
      setTitle('')
      setPublished('')
      setAuthor('')
      setGenres([])
    }
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={(e) => void submit(e)}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook