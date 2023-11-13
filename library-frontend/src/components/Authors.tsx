import { useQuery } from "@apollo/client"
import { Author } from "../interfaces"
import { ALL_AUTHORS } from "../gql_utils/queries"
import SetAuthorBirthYear from "./SetAuthorBirthYear"

interface IAuthorsProps {
  show: boolean
  onUpdateAuthor: () => void
  setNotification: ({ type, message }: { type: string, message: string }) => void
  token: string
}

const Authors = ({ show, onUpdateAuthor, setNotification, token }: IAuthorsProps) => {
  const result = useQuery<{ allAuthors: Author[] }>(ALL_AUTHORS)

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data!.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token && <SetAuthorBirthYear authors={authors} onUpdateAuthor={onUpdateAuthor} setNotification={setNotification} />}
    </div>
  )
}

export default Authors