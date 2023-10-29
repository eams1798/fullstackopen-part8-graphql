import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const App = () => {
  const [page, setPage] = useState<string>('authors')

  const onAddBook = () => {
    setPage('books')
  }

  const onUpdateAuthor = () => {
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors show={page === 'authors'} onUpdateAuthor={onUpdateAuthor} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} onAddBook={onAddBook} />
    </div>
  )
}

export default App