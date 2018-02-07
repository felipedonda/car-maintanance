/*
    * pegar o json enviado pela request
    * passar pelo joi para validar
    * caso validação falhe responde com status code de malformated request
    * caso de certo insere no mongo
    * retornar id criado
    * quando id for igual, alterar (opcional)
*/




//  configure app
const express = require('express')
const app = express()

// dependencies
const cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('morgan')
const mongoose = require('mongoose')

app.use(logger('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//  load models
require('./models/vehicle');

//  load routes
const routes = require('./routes')
app.use('/',routes)

app.listen(80, () => console.log('car-maintenance listening on port 80!'))
