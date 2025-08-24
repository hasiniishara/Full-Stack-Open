import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './CreateBlog'

test('shows author after expanding', async () => {
  const user = userEvent.setup()
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Hasini Test',
    url: 'http://example.com',
    likes: 0,
    user: { username: 'hasini' },
  }

  const mockUpdateLikes = vi.fn()

  render(<Blog blog={blog} handleUpdateLikes={mockUpdateLikes} />)

  expect(screen.queryByText('Hasini Test')).toBeNull()

  await user.click(screen.getByRole('button', { name: /view/i }))

  expect(screen.getByText('Hasini Test')).toBeInTheDocument()
  expect(screen.getByText('http://example.com')).toBeInTheDocument()
  expect(screen.getByText('likes 0')).toBeInTheDocument()

  const likeButton = screen.getByRole('button', { name: /like/i })

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockUpdateLikes).toHaveBeenCalledTimes(2)

})

test('submits correct details (no labels version)', async () => {
  const handleBlogSubmit = vi.fn()
  render(<BlogForm handleBlogSubmit={handleBlogSubmit} />)

  const user = userEvent.setup()

  const [titleInput, authorInput, urlInput] = screen.getAllByRole('textbox')
  await user.type(titleInput, 'My Test Title')
  await user.type(authorInput, 'Hasini Test')
  await user.type(urlInput, 'http://example.com')

  await user.click(screen.getByRole('button', { name: /create/i }))

  expect(handleBlogSubmit).toHaveBeenCalledWith({
    title: 'My Test Title',
    author: 'Hasini Test',
    url: 'http://example.com',
  })
})

