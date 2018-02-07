const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Vehicle = mongoose.model('Vehicle')

//  # POST
router.post('/', (req, res) => {
  //const vehicle = new Vehicle(req.body)
  const validation = Vehicle.validate(req.body)
  if (validation.fail) {
    res.status(422)
    return res.json({message: 'Invalid vehicle parameters!', error: validation.error.details[0].message})
  }
  res.json({id: req.body.id})
})
  
//  # GET
router.get('/', (req, res) => {
  console.log(req)
  console.log(res)
  res.json({message: 'Hello World!'})
})

module.exports = router;