export const Filter = ({ filterName, handleFilterChange }) => (
    <div> filter shown with  <input value={filterName} onChange={handleFilterChange}/></div>
)

export const PersonForm = ({ addPerson, newName, newNumber, handleNameChange, handleNumberChange }) => (
    <form onSubmit={addPerson}>
        <div> name:  <input value={newName} onChange={handleNameChange}/></div>
        <div> number:  <input value={newNumber} onChange={handleNumberChange}/></div>
        <div><button type="submit">add</button></div>
    </form>
)

export const Persons = ({ personsToShow }) => {
    return(
        <ul>
            {personsToShow.map((person) => (
            <li key={person.id}> {person.name} {person.number}</li>
            ))}
        </ul>
    )
}