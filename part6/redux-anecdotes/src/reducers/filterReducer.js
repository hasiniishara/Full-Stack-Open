const SET = 'filter/set'

export const setFilter = (value) => ({
  type: SET,
  data: { value },
})

const initialState = ''

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET:
      return action.data.value
    default:
      return state
  }
}

export default filterReducer
