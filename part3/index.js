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


app.post('/api/persons', (request, response, next)  => {
    const body = request.body
    const person = new Person({
      name: body.name,
      number: body.number || false,
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next)  => {
    Person.find({}).then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
    const numOfPersons = persons.length
    const date = new Date()
    
    const html = `
        <div>
            <p>Phonebook has info for ${numOfPersons} people</p>
            <p>${date}</p>
        </div>
    `
    response.send(html)
})

app.get('/api/persons/:id', (request, response, next)  => {
      Person.findById(request.params.id).then(person => {
        if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }  
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next)  => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body

  Person.findById(id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
