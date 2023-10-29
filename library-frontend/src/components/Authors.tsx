import { useQuery } from "@apollo/client"
import { Author } from "../interfaces"
import { ALL_AUTHORS } from "../gql_utils/queries"
import SetAuthorBirthYear from "./SetAuthorBirthYear"

interface INewBookProps {
  show: boolean
  onUpdateAuthor: () => void
}

const Authors = ({ show, onUpdateAuthor }: INewBookProps) => {
  const result = useQuery(ALL_AUTHORS)

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors: Author[] = result.data.allAuthors

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
      <SetAuthorBirthYear authors={authors} onUpdateAuthor={onUpdateAuthor} />
    </div>
  )
}

export default Authors