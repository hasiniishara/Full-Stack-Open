const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => ({
  content: anecdote,
  id: getId(),
  votes: 0,
})

const initialState = anecdotesAtStart.map(asObject)

const sortByVotes = (arr) => [...arr].sort((a, b) => b.votes - a.votes)

const VOTE = 'anecdote/vote'
const CREATE = 'anecdote/create'

export const voteAnecdote = (id) => ({ type: VOTE, data: { id } })
export const createAnecdote = (content) => ({ type: CREATE, data: { content } })

const anecdoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case VOTE: {
      const id = action.data.id
      const updated = state.map(a =>
        a.id === id ? { ...a, votes: a.votes + 1 } : a
      )
      return sortByVotes(updated)
    }
    case CREATE: {
      const content = action.data.content
      const newAnecdote = { content, id: getId(), votes: 0 }
      return sortByVotes(state.concat(newAnecdote))
    }
    default:
      return sortByVotes(state)
  }
}

export default anecdoteReducer
