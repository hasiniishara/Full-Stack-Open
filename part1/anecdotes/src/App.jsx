import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
const Vote = ({text, votes}) => <p>{text} {votes}</p>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [totalVotes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const handleBtnClick = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }
  
   const handleVoteBtnClick = () => {
    const updatedVotes = [...totalVotes]
    updatedVotes[selected] += 1
    setVotes(updatedVotes)
  }

  const maxVotes = Math.max(...totalVotes)
  const topIndex = totalVotes.indexOf(maxVotes)

  return (
    <div>
      <p>{anecdotes[selected]}</p>
      <Vote text = "has" votes= {totalVotes[selected]+ ' votes'}/>
      <Button onClick={handleVoteBtnClick} text='vote' />
      <Button onClick={handleBtnClick} text='next anecdote' />
      <h2>Anecdote with most votes</h2>
      {maxVotes > 0 ? (
        <div>
          <p>{anecdotes[topIndex]}</p>
          <Vote text = "has" votes={totalVotes[topIndex]+ ' votes'} />
        </div>
      ) : (
        <p>No votes yet</p>
      )}
    </div>
  )
}

export default App