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
    vote(state, action) {
      const id = action.payload
      const updated = state.map(a => a.id === id ? { ...a, votes: a.votes + 1 } : a)
      return sortByVotes(updated)
    }
  }
})

export const { setAll, append, vote } = anecdoteSlice.actions

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

export default anecdoteSlice.reducer
