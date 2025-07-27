import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const request = await axios.post(baseUrl, credentials)
  const response = await request
    return response.data
}

export default { login }