const express = require('express')
const router = express.Router()
const vehicles = require('./vehicles')
const services = require('./services')

router.use('/vehicles', vehicles)
router.use('/vehicles', services)

module.exports = router
