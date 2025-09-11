import { configureStore } from '@reduxjs/toolkit'
import anecdotes from './reducers/anecdoteSlice'
import filter from './reducers/filterSlice'
import notification from './reducers/notificationSlice'

const store = configureStore({
  reducer: { anecdotes, filter, notification },
})

export default store
