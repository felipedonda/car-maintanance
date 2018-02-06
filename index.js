/*
    * pegar o json enviado pela request
    * passar pelo joi para validar
    * caso validação falhe responde com status code de malformated request
    * caso de certo insere no mongo
    * retornar id criado
    * quando id for igual, alterar (opcional)
*/

//  requiring logger
const expressLogging = require('express-logging')
const logger = require('logops')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { validateVehicles } = require('./validator')


//  defining schema

const app = express()

//  initializing logger
app.use(expressLogging(logger),
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
    if(validation.fail){
        res.status(422)
        return res.json({message: "Invalid vehicle parameters!",error: validation.error.details[0].message})
    }
    res.json({message: "Vehicle successfully created!"})
})

//  # GET
// app.get('/vehicles', (req, res) => res.send('Hello World!'))

app.listen(80, () => console.log('car-maintenance listening on port 80!'))
