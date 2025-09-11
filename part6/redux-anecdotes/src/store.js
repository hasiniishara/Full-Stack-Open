import { configureStore } from '@reduxjs/toolkit'
import anecdotesReducer from './reducers/anecdoteSlice'
import filterReducer from './reducers/filterSlice'
import notificationReducer from './reducers/notificationSlice'

const store = configureStore({
  reducer: {
    anecdotes: anecdotesReducer,
    filter: filterReducer,
    notification: notificationReducer,
  },
})

export default store
