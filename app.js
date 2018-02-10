//  create the app
const express = require('express')
const app = express()

//  configure the app
const isProduction = process.env.NODE_ENV === 'production'
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

if (!isProduction) {
  const expressLogging = require('express-logging')
  const logger = require('logops')
  app.use(expressLogging(logger))
}

//  load models
require('./models/Vehicle')
require('./models/Service')

//  load routes
const routes = require('./routes')
app.use('/', routes)

//  connect to the database
const mongoose = require('mongoose')

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI)
} else {
  mongoose.connect('mongodb://localhost/car-maintenance-db')
  mongoose.set('debug', true)
}

//  initiate the app
app.listen(80, () => console.log('Application listening on port 80!'))
