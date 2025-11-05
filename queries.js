require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER || 'me',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'api',
  password: process.env.DB_PASSWORD || 'abc123',
  port: process.env.DB_PORT || 5432,
})
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message })
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = Number.parseInt(request.params.id, 10)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message })
    }
    if (results.rows.length === 0) {
      return response.status(404).json({ error: 'User not found' })
    }
    response.status(200).json(results.rows[0])
  })
}

const createUser = (request, response) => {
  const { name, email } = request.body

  // Input validation
  if (!name || !email) {
    return response.status(400).json({ error: 'Name and email are required' })
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return response.status(400).json({ error: 'Invalid email format' })
  }

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id', [name, email], (error, results) => {
    if (error) {
      // Handle duplicate email error
      if (error.code === '23505') {
        return response.status(409).json({ error: 'Email already exists' })
      }
      return response.status(500).json({ error: error.message })
    }
    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })
}

const updateUser = (request, response) => {
  const id = Number.parseInt(request.params.id, 10)
  const { name, email } = request.body

  // Input validation
  if (!name || !email) {
    return response.status(400).json({ error: 'Name and email are required' })
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return response.status(400).json({ error: 'Invalid email format' })
  }

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
    [name, email, id],
    (error, results) => {
      if (error) {
        // Handle duplicate email error
        if (error.code === '23505') {
          return response.status(409).json({ error: 'Email already exists' })
        }
        return response.status(500).json({ error: error.message })
      }
      if (results.rows.length === 0) {
        return response.status(404).json({ error: 'User not found' })
      }
      response.status(200).json(results.rows[0])
    }
  )
}

const deleteUser = (request, response) => {
  const id = Number.parseInt(request.params.id, 10)

  pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: error.message })
    }
    if (results.rows.length === 0) {
      return response.status(404).json({ error: 'User not found' })
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}