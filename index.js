/*
    * pegar o json enviado pela request
    * passar pelo joi para validar
    * caso validação falhe responde com status code de malformated request
    * caso de certo insere no mongo
    * retornar id criado
    * quando id for igual, alterar (opcional)
*/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('morgan')
const { validateVehicles } = require('./validator')

//  defining schema

const app = express()

//  initializing logger
app.use(logger('dev'),
  cors(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true })
)

app.get('/', (req, res) => res.json('Hello World!'))

//  ### VEHICLES CONTROLLER ###

//  # POST
app.post('/vehicles', (req, res) => {
  console.log(req.body)
  const validation = validateVehicles(req.body)
  if (validation.fail) {
    res.status(422)
    return res.json({message: 'Invalid vehicle parameters!', error: validation.error.details[0].message})
  }
  res.json({id: req.body.id})
})

//  # GET
app.get('/vehicles', (req, res) => {
  res.json({message: 'Hello World!'})
})

app.listen(80, () => console.log('car-maintenance listening on port 80!'))
