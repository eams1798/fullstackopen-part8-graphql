import { useMutation } from "@apollo/client"
import { SET_BIRTH_YEAR } from "../utils/gql/mutations"
import { useRef, useState } from "react"
import { ALL_AUTHORS } from "../utils/gql/queries"
import { Author, SetBYResponse, SetBYVariables } from "../interfaces"

interface ISetAuthorBYProps {
  authors: Author[],
  onUpdateAuthor: () => void
  setNotification: ({ type, message }: { type: string, message: string }) => void
}

const SetAuthorBirthYear = ({ authors, onUpdateAuthor, setNotification }: ISetAuthorBYProps) => {
  const selectRef = useRef<HTMLSelectElement>(null)
  const [selectedValue, setSelectedValue] = useState<string>(authors[0]? authors[0].name : "")
  const [inputYear, setInputYear] = useState<string>("")
  const [setAuthorBirthYear] = useMutation<SetBYResponse, SetBYVariables>(SET_BIRTH_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      setNotification({
        type: 'error',
        message: error.graphQLErrors[0].message
      })
    },
  })

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = await setAuthorBirthYear({
      variables: {
        name: selectedValue,
        setBornTo: Number(inputYear)
      }
    })


    if (!result.errors) {
      onUpdateAuthor()
      setInputYear("")
    }
  }

  return (
    <div>
      <h2>Set BirthYear</h2>
      <form onSubmit={(e) => void handleSubmit(e)}>
        <select 
          name="authors" 
          id="authors" 
          ref={selectRef}
          onChange={handleSelectChange}
        >
          {authors.map((author) => (
            <option key={author.id} value={author.name}>{author.name}</option>
          ))}
        </select>
        <input type="tel" value={inputYear} onChange={(e) => setInputYear(e.target.value)}/>
        <input type="submit" value="Update author"/>
      </form>
    </div>
  )
}

export default SetAuthorBirthYear
