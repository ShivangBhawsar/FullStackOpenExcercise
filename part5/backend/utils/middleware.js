const jwt = require('jsonwebtoken')
const { request } = require('../app')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const tokenExtractor = (request, response, next) => {
  // code that extracts the token
  request.token = getTokenFrom(request)
  next()
}

const userExtractor = (request, response, next) => {
  request.user = jwt.verify(request.token, process.env.SECRET)
  if (!request.user.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  next()
}

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted data' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  }
  console.log(error.name)
  next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  errorHandler
}