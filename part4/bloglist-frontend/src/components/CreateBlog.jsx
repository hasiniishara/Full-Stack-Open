import { useState, useEffect } from 'react'

const BlogForm = ({ handleBlogSubmit }) => {

  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title,
      author,
      url
    }

    handleBlogSubmit(newBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title
          <input
          type="text"
          value={title}
          name="Title"
          onChange={event => setTitle(event.target.value)}
        />
      </div>
      <div>
        author
          <input
          type="text"
          value={author}
          name="Author"
          onChange={event => setAuthor(event.target.value)}
        />
      </div>
      <div>
        url
          <input
          type="text"
          value={url}
          name="Url"
          onChange={event => setUrl(event.target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>  
  )
}


  export default BlogForm