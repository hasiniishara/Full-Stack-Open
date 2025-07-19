const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((fav, blog) => {
    return blog.likes > fav.likes ? blog : fav
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = {}

  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  let topAuthor = null
  let maxBlogs = 0

  for (const author in counts) {
    if (counts[author] > maxBlogs) {
      topAuthor = author
      maxBlogs = counts[author]
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesPerAuthor = {}

  blogs.forEach(blog => {
    likesPerAuthor[blog.author] = (likesPerAuthor[blog.author] || 0) + blog.likes
  })

  let topAuthor = null
  let maxLikes = 0

  for (const author in likesPerAuthor) {
    if (likesPerAuthor[author] > maxLikes) {
      topAuthor = author
      maxLikes = likesPerAuthor[author]
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes
  }
}



module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}