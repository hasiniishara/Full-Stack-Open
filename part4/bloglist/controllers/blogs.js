const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes, userId } = request.body

  const user = request.user
  
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response)  => {

  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'unauthorized deletion' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()

})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const { likes } = request.body

  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.likes = likes
  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter