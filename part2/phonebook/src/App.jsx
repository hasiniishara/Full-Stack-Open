import axios from 'axios'
import personService from './services/persons'
import { useState, useEffect } from 'react'
import { Persons, PersonForm, Filter } from "./components/PhoneBook"
import { Notification } from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setfilterName] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const addPerson = (event) =>{
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)
    let isDuplicate = false

    persons.forEach((item, index) => {
      if(item.name === newName){
        isDuplicate = true
      }
    });

    if(isDuplicate){
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setSuccessMessage(
              `${existingPerson.name}'s number is updated successfully!`
            )
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(
              `Person '${existingPerson.name}' was already removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
        })
      }
    }else{
      const personObject = {
        name: newName,
        number: newNumber,
        id: String(persons.length + 1)
      }
      personService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(personObject))
          setSuccessMessage(
              `Added '${personObject.name}`
          )
          setTimeout(() => {
              setSuccessMessage(null)
          }, 5000)
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id,name) =>{
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }   
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
      <Notification message={successMessage || errorMessage} type={errorMessage ? 'error' : 'success'}/>
      <Filter filterName={filterName} handleFilterChange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App