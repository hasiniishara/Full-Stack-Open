import { useState } from 'react'

const Header = ({text }) => <h2>{text}</h2>
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
const Static = ({text }) => <h2>{text}</h2>
const History = (props) => {
  return(
    <div>
      <p>good {props.goodHis}</p>
      <p>neutral {props.neutralHis}</p>
      <p>bad {props.badHis}</p>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
    console.log("good", good)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    console.log("neutral", neutral)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    console.log("bad", bad)
  }

  return (
    <div>
      <Header text='give feedback' />
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />
      <Static text ='statistics'/>
      <History goodHis = {good} neutralHis = {neutral} badHis = {bad}/>
    </div>
  )
}

export default App