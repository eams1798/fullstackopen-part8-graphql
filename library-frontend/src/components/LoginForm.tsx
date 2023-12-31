/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from "@apollo/client"
import { useState, useEffect } from "react"
import { LOGIN } from "../utils/gql/mutations"
import { LoginResponse, LoginVariables, MyUser } from "../interfaces"

interface ILoginFormProps {
  show: boolean
  setNotification: ({ type, message }: { type: string, message: string }) => void
  setToken: (token: string) => void
  setUser: (user: MyUser | null) => void
  onLogin: () => void
}

const LoginForm = ({ show, setNotification, setToken, setUser, onLogin }: ILoginFormProps) => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [login, result] = useMutation<LoginResponse, LoginVariables>(LOGIN, {
    onError: (error) => {
      setNotification({
        type: 'error',
        message: error.graphQLErrors[0].message
      })
    },
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      const user = result.data.login.user
      setToken(token)
      setUser(user)
      localStorage.setItem('booklist-user-token', token)
      localStorage.setItem('booklist-user', JSON.stringify(user))
      setNotification({
        type: 'success',
        message: `welcome ${username}`
      })
    }
  }, [result.data])

  if (!show) {
    return null
  }

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    const result = await login({ variables: { username, password } })

    if (!result.errors) {
      setUsername('')
      setPassword('')
      onLogin()
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label htmlFor="username">username:</label>
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}>
        </input>
        <label htmlFor="password">password:</label>
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}>
        </input>
        <button type="submit">login</button>  
      </form>
    </div>
  )
}

export default LoginForm