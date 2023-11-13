import { useEffect, useState } from 'react'
import { NotifProperties } from './interfaces'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import { useApolloClient } from '@apollo/client'

const App = () => {
  const client = useApolloClient()
  const [token, setToken] = useState<string>('')
  const [page, setPage] = useState<string>('authors')
  const [notification, setNotification] = useState<NotifProperties>({ type: '', message: '' })

  const onAddBook = () => {
    setPage('books')
  }

  const onUpdateAuthor = () => {
    setPage('authors')
  }

  const onLogin = () => {
    setPage('authors')
  }

  const logout = () => {
    setToken('')
    localStorage.clear()
    client.resetStore()
    setPage('login')
  }

  useEffect(() => {
    const token = localStorage.getItem('booklist-user-token')
    if (token) {
      setToken(token)
    }
  }, [])

  return (
    <div>
      <Notification notification={notification} setNotification={setNotification} />

      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token?
          <button onClick={() => setPage('login')}>login</button>:
          <>
            <button onClick={() => setPage('new book')}>New book</button>
            <button onClick={logout}>logout</button>
          </>
        }
      </div>

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setNotification={setNotification}
        onLogin={onLogin} />

      <Authors
        show={page === 'authors'}
        onUpdateAuthor={onUpdateAuthor}
        setNotification={setNotification}
        token={token} />

      <Books
        show={page === 'books'} />

      <NewBook
        show={page === 'new book'}
        onAddBook={onAddBook}
        setNotification={setNotification} />
    </div>
  )
}

export default App