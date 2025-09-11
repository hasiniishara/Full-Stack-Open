import { createSlice } from '@reduxjs/toolkit'
import * as api from '../services/anecdotes'

const sortByVotes = (arr) => [...arr].sort((a, b) => b.votes - a.votes)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAll(_state, action) {
      return sortByVotes(action.payload)
    },
    append(state, action) {
      return sortByVotes([...state, action.payload])
    },
    updateOne(state, action) {
      const updated = action.payload
      const next = state.map(a => (a.id === updated.id ? updated : a))
      return sortByVotes(next)
    },
  },
})

export const { setAll, append, updateOne } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const data = await api.getAll()
    dispatch(setAll(data))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const created = await api.createNew(content)
    dispatch(append(created))
  }
}

export const voteAnecdote = (anecdote) => {
  return async (dispatch) => {
    const updated = await api.update(anecdote.id, {
      ...anecdote,
      votes: anecdote.votes + 1,
    })
    dispatch(updateOne(updated))
  }
}

export default anecdoteSlice.reducer
