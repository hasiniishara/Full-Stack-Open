import { useState } from 'react'

const Blog = ({ blog, handleUpdateLikes, handleDeleteBlog, currentUser }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const updateLikes = () => {
  const updatedBlog = {
    user: typeof blog.user === 'object' ? blog.user.id || blog.user._id : blog.user,
    likes: blog.likes + 1,
    author: blog.author,
    title: blog.title,
    url: blog.url
  }
  handleUpdateLikes(blog.id, updatedBlog)
}

const deleteBlogs = () => {
  handleDeleteBlog(blog.id, blog.title)
}

  return (
    <div style={blogStyle}>
      <p>
        {blog.title}{' '}
        <button onClick={toggleDetails}>
          {detailsVisible ? 'Hide' : 'View'}
        </button>
      </p>

      {detailsVisible && (
        <div>
          <p>{blog.url}</p>
          <p>{blog.author}</p>
          <p>likes {blog.likes}
            <button onClick={updateLikes}>like</button>
          </p>
          {currentUser && blog.user && blog.user.username === currentUser.username && (
            <button onClick={() => deleteBlogs(blog.id, blog.title)} style={{ backgroundColor: 'red', color: 'white' }}>
              delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
