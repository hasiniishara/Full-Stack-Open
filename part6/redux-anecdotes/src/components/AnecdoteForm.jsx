import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteSlice'
import { setNotification } from '../reducers/notificationSlice'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const onSubmit = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value.trim()
    if (!content) return
    dispatch(createAnecdote(content))                      
    dispatch(setNotification(`new anecdote '${content}'`, 5))
    e.target.reset()
  }

  return (
    <form onSubmit={onSubmit}>
      <div><input name="anecdote" placeholder="your new anecdote" /></div>
      <button type="submit">create</button>
    </form>
  )
}
export default AnecdoteForm
