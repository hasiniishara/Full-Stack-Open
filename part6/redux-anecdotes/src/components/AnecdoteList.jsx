import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdote)
  const filter = useSelector(state => state.filter)

  const visible = anecdotes.filter(a =>
    a.content.toLowerCase().includes(filter.toLowerCase())
  )

  const dispatch = useDispatch()
  const handleVote = (id) => dispatch(voteAnecdote(id))

  return (
    <div>
      {visible.map(a => (
        <div key={a.id} style={{ marginBottom: 8 }}>
          <div>{a.content}</div>
          <div>
            has {a.votes}{' '}
            <button onClick={() => handleVote(a.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
