import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/CreateBlog'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { Notification } from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>{
      const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Error in blog creation.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleBlogCreation = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog))
      
      setSuccessMessage(`A new blog "${createdBlog.title}" by ${createdBlog.author} created successfully!`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (exception) {
      const message =
        exception.response?.data?.error ||
        exception.response?.data ||
        'Error creating blog'

      setErrorMessage(message)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const updateLikes = async (id, updatedBlog) => {
  try {
    const returnedBlog = await blogService.updateUserLikes(id, updatedBlog)

    const updatedBlogs = blogs.map(b => b.id === id ? returnedBlog : b).sort((a, b) => b.likes - a.likes)

    setBlogs(updatedBlogs)
    setSuccessMessage('Likes updated successfully!')
    setTimeout(() => setSuccessMessage(null), 5000)
  } catch (error) {
    setErrorMessage('Error updating likes')
    setTimeout(() => setErrorMessage(null), 5000)
  }
}

const deleteBlogs = async (id, title) => {
  const confirmDelete = window.confirm(`Do you really want to delete "${title}"?`)
  if (!confirmDelete) return

  try {
    await blogService.deleteUserBlog(id)
    setBlogs(blogs.filter(b => b.id !== id))
    setSuccessMessage(`Blog "${title}" deleted successfully!`)
    setTimeout(() => setSuccessMessage(null), 5000)
  } catch (error) {
    setErrorMessage('Error deleting blog')
    setTimeout(() => setErrorMessage(null), 5000)
  }
}

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  

  const blogComp = () => (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleUpdateLikes={updateLikes} handleDeleteBlog={deleteBlogs} currentUser={user}/>
      )}
    </div>
  )

  return (
    <div>
      {user === null ?
        loginForm() :
        <div>
          <h2>blogs</h2>
          <Notification message={successMessage || errorMessage} type={errorMessage ? 'error' : 'success'}/>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>logout</button>
          <h2>create new</h2>
          <Togglable buttonLabel='Create new'>
            <BlogForm handleBlogSubmit={handleBlogCreation}/>
          </Togglable>
          {blogComp()}
      </div>
      }
    </div>
  )
}

export default App