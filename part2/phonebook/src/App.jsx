import axios from 'axios'
import { useState, useEffect } from 'react'
import { Persons, PersonForm, Filter } from "./components/PhoneBook"

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setfilterName] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) =>{
    event.preventDefault()
    let isDuplicate = false

    persons.forEach((item, index) => {
      if(item.name === newName){
        isDuplicate = true
      }
    });

    if(isDuplicate){
      window.alert(`${newName} is already added to phonebook`)
    }else{
      const personObject = {
        name: newName,
        number: newNumber,
        id: String(persons.length + 1)
      }
      setPersons(persons.concat(personObject))
    }
    
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) =>{
    setNewName(event.target.value)
  }

   const handleNumberChange = (event) =>{
    setNewNumber(event.target.value)
  }

   const handleFilterChange = (event) =>{
    setfilterName(event.target.value)
    setShowAll(event.target.value === '')
  }

  const personsToShow = showAll ? persons : persons.filter((person) => person.name.toLowerCase().includes(filterName.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterName={filterName} handleFilterChange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow}/>
    </div>
  )
}

export default App