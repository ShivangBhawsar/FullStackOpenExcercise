import { createSlice } from '@reduxjs/toolkit'

const notificationReducer = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        giveNotification(state, action) {
            return action.payload
        },
        clearNotification() {
            return ''
        }
    }
})

export const { giveNotification, clearNotification } = notificationReducer.actions

export const setNotification = (content, time) => {
    return async dispatch => {
      dispatch(giveNotification(content))
      setTimeout(() => {
        dispatch(clearNotification())
      }, time*1000)
    }
  }

export default notificationReducer.reducer