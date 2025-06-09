import { useState } from 'react'

const Header = ({text }) => <h2>{text}</h2>
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
const Static = ({text }) => <h2>{text}</h2>

const StatisticLine = ({text, value}) => (
  <table>
    <tbody>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </tbody>
  </table>
)

const History = (props) => {

  let total = props.goodHis + props.neutralHis + props.badHis
  let average = (props.goodHis + props.neutralHis + props.badHis)/3
  let positive = ((props.goodHis)/(props.goodHis + props.neutralHis + props.badHis))*100
  
  if(total > 0 ){
    return(
    <div>
      <StatisticLine text= "good" value = {props.goodHis}/>
      <StatisticLine text= "neutral" value = {props.neutralHis}/>
      <StatisticLine text= "bad" value = {props.badHis}/>
      <StatisticLine text= "average" value = {average}/>
      <StatisticLine text= "positive" value = {positive + '%'}/>
    </div>
  )
  }else {
    return(
    <div>
      <h4>no feedback given</h4>
    </div>
  )
  }
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
    setNeutral(0)
    console.log("neutral", neutral)
  }

  const handleBadClick = () => {
    setBad(bad-1)
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