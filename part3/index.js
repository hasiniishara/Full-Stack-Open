require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.post('/api/persons', (request, response)  =>{
    const body = request.body
    console.log(body)
    
    if (!body.name || !body.number) {
        return response.status(400).json({
        error: 'name or number is missing'
        })
    }

    const person = new Person({
      name: body.name,
      number: body.number || false,
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
})

app.get('/api/persons', (request, response)  =>{
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(person)
      })
    })
})

// app.get('/info', (request, response) =>{
//     const numOfPersons = persons.length
//     const date = new Date()
    
//     const html = `
//         <div>
//             <p>Phonebook has info for ${numOfPersons} people</p>
//             <p>${date}</p>
//         </div>
//     `
//     response.send(html)
// })

app.get('/api/persons/:id', (request, response)  =>{
      Person.findById(request.params.id).then(note => {
        response.json(note)
    })
})

// app.delete('/api/persons/:id', (request, response)  =>{
//     const id = request.params.id
//     persons = persons.filter(person => person.id !== id)
//     response.status(204).end()
// })

// app.put('/api/persons/:id', (request, response) => {
//   const id = request.params.id
//   const body = request.body

//   const index = persons.findIndex(p => p.id === id)
//   if (index === -1) {
//     return response.status(404).json({ error: 'Person not found' })
//   }

//   const updatedPerson = { ...persons[index], number: body.number }
//   persons[index] = updatedPerson
//   response.json(updatedPerson)
// })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
