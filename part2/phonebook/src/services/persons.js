import axios from 'axios'
const baseUrl = 'https://phonebook-18ok.onrender.com/api/persons'

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
    return response.data
}

const create = async newObject => {
  const request = axios.post(baseUrl, newObject)
  const response = await request
    return response.data
}

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

const update = async (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  const response = await request
    return response.data
}

export default { getAll, create, deletePerson, update }