import { useEffect, useRef, useState } from 'react'
import { Book, MyUser, NotifProperties } from './interfaces'
import Authors from './components/Authors'
import Books, { IBooksRef } from './components/Books'
import NewBook from './components/NewBook'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED } from './utils/gql/subscriptions'
import { ALL_AUTHORS, ALL_BOOKS, ALL_GENRES } from './utils/gql/queries'
import { updateCache } from './utils/updateCache'

const App = () => {
  const client = useApolloClient()
  const [token, setToken] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<MyUser | null>(null)
  const [page, setPage] = useState<string>('authors')
  const [notification, setNotification] = useState<NotifProperties>({ type: '', message: '' })

  const BooksRef = useRef<IBooksRef>(null)

  const onAddBook = () => {
    setPage('books')
    BooksRef.current!.setGenre(undefined)
  }

  const onUpdateAuthor = () => {
    setPage('authors')
  }

  const onLogin = () => {
    setPage('authors')
  }

  const logout = () => {
    setToken('')
    setCurrentUser(null)
    localStorage.clear()
    client.resetStore()
    setPage('login')
  }

  useSubscription<{ bookAdded: Book }>(
    BOOK_ADDED, {
      onData: ({ data }) => {
        const addedBook = data.data!.bookAdded
        updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
        updateCache(client.cache, { query: ALL_BOOKS, variables: { genre: addedBook.genres[0] } }, addedBook)
        updateCache(client.cache, { query: ALL_AUTHORS }, addedBook.author)
        updateCache(client.cache, { query: ALL_GENRES }, addedBook.genres)
      }
    }
  )

  useEffect(() => {
    const token = localStorage.getItem('booklist-user-token')
    const user = localStorage.getItem('booklist-user')
    if (token && user && user !== 'undefined') {
      setToken(token)
      setCurrentUser(JSON.parse(user))
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
        setUser={setCurrentUser}
        setNotification={setNotification}
        onLogin={onLogin} />

      <Authors
        show={page === 'authors'}
        onUpdateAuthor={onUpdateAuthor}
        setNotification={setNotification}
        token={token} />

      <Books
        show={page === 'books'}
        user={currentUser}
        ref={BooksRef} />

      <NewBook
        show={page === 'new book'}
        onAddBook={onAddBook}
        setNotification={setNotification} />
    </div>
  )
}

export default App