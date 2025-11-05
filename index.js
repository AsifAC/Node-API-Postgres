require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const app = express()
const db = require('./queries')
const port = process.env.PORT || 3000

// Security middleware
app.use(helmet())

// CORS
app.use(cors())

// Request logging
app.use(morgan('combined'))

// Body parsing
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

// Health check endpoint
app.get('/health', async (request, response) => {
  try {
    const pool = require('pg').Pool
    const testPool = new pool({
      user: process.env.DB_USER || 'me',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'api',
      password: process.env.DB_PASSWORD || 'abc123',
      port: process.env.DB_PORT || 5432,
    })
    
    await testPool.query('SELECT 1')
    await testPool.end()
    
    response.status(200).json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    response.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})