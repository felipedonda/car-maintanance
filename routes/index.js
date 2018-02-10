const express = require('express')
const router = express.Router()
const vehicles = require('./vehicles')
const services = require('./services')
const maintenances = require('./maintenances')

router.use('/vehicles', vehicles)
router.use('/vehicles', services)
router.use('/maintenances', maintenances)
module.exports = router
