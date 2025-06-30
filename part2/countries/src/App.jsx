import { useState, useEffect } from 'react'
import countryService from './services/countries'
import { CountryList } from './components/CountryList'

const App = () => {
  const [query, setQuery] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    countryService
      .getAll()
      .then(response => {
        setAllCountries(response)
      })
  }, [])

  useEffect(() => {
    if (query === '') {
      setFiltered([])
    } else {
      const matches = allCountries.filter(c =>
        c.name.common.toLowerCase().includes(query.toLowerCase())
      )
      setFiltered(matches)
    }
  }, [query, allCountries])

  const handleShowCountry = name => {
    const match = allCountries.find(c => c.name.common === name)
    setFiltered([match])
  }

  return (
    <div>
      <label>
        Find countries: <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>

      <CountryList countries={filtered} onShow={handleShowCountry} />
    </div>
  )
}

export default App
