const express = require('express')
const router = express.Router()
const vehicles = require('./vehicles')

router.use(function timeLog (req, res, next) {
    console.log('- Time: ', Date.now())
    next()
})

router.use('/vehicles',vehicles)

module.exports = router;