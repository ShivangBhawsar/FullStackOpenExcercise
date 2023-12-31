import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdoteService'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const noteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    increaseVote(state, action) {
      // console.log(state)
      // console.log(action)
      const id = action.payload
      const anecdoteToUpdate = state.find(n => n.id === id)
      const changedAnecdote = {
        ...anecdoteToUpdate,
        votes: anecdoteToUpdate.votes + 1
      }
      const result = state.map(note =>
        note.id !== id ? note : changedAnecdote
      )
      result.sort((a, b) => b.votes - a.votes);
      return result
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})

export const { increaseVote, setAnecdotes, appendAnecdote } = noteSlice.actions


export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const incrementVote = (anecdote) => { 
  return async dispatch => {
    await anecdoteService.update({...anecdote, votes: anecdote.votes+1}) 
    dispatch(increaseVote(anecdote.id))
  }
}

export default noteSlice.reducer