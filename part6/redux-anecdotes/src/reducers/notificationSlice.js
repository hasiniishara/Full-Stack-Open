import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    set(_state, action) {
      return action.payload
    },
    clear() {
      return ''
    },
  },
})

export const { set, clear } = notificationSlice.actions

export const setNotification = (text, seconds = 5) => {
  return (dispatch) => {
    dispatch(set(text))
    setTimeout(() => {
      dispatch(clear())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
