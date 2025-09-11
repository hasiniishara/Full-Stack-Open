import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteSlice'
import { setNotification } from '../reducers/notificationSlice'

const AnecdoteList = () => {
  const anecdotes = useSelector(s => s.anecdotes)
  const filter = useSelector(s => s.filter)
  const visible = anecdotes.filter(a =>
    a.content.toLowerCase().includes(filter.toLowerCase())
  )

  const dispatch = useDispatch()
  const handleVote = (anec) => {
    dispatch(voteAnecdote(anec))                             
    dispatch(setNotification(`you voted '${anec.content}'`, 10)) 
  }

  return (
    <div>
      {visible.map(a => (
        <div key={a.id} style={{ marginBottom: 8 }}>
          <div>{a.content}</div>
          <div>
            has {a.votes}{' '}
            <button onClick={() => handleVote(a)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}
export default AnecdoteList
