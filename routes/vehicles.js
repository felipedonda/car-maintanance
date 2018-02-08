const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Vehicle = mongoose.model('Vehicle')

//  # POST
router.post('/', (req, res) => {
  const validation = Vehicle.validate(req.body)
  if (validation.fail) {
    return res.status(422).json({ message: 'Invalid vehicle parameters!', error: validation.error.details[0].message })
  }

  vehicle = new Vehicle({
    id: req.body.id,
    name: req.body.name,
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    vin: req.body.vin
  })

  vehicle.save((err, obj) =>{
    if(err) {
      return res.status(500).json({ message: 'Error saving vehicle.' })
    }
    return res.status(200).json({ message: 'Vehicle saved sucessfully.', id: obj.id })
  })
})

//  # GET
router.get('/', (req, res) => {
  Vehicle.find( (err, list) => {
      if(err) {
        return res.status(500).json({ message: 'Error getting vehicles.' })
      }
      return res.json(list)
  })
})

//  # GET
router.get('/:id', (req, res) => {
  const id = req.params.id
  
  Vehicle.findOne({id: id}, (err, obj) => {
    if(err) {
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }

    if(!obj) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    return res.json(obj)
  })
})


//  # PUT
router.put('/:id', (req, res) => {
  const id = req.params.id
  
  Vehicle.findOne({id: id}, (err, vehicle) => {
    if(err) {
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }

    if(!vehicle) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    Object.assign(vehicle, req.body)

    //  to do validation

    vehicle.save((err, obj) =>{
      if(err) {
        return res.status(500).json({ message: 'Error saving vehicle.' })
      }
      return res.status(200).json({ message: 'Vehicle saved sucessfully.', id: obj.id })
    })
  })
})

//  # DELETE
router.delete('/:id', (req, res) => {
  const id = req.params.id
  
  Vehicle.findOne({id: id}, (err, vehicle) => {
    if(err) {
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }

    if(!vehicle) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    vehicle.remove((err, obj) => {
      if(err) {
        return res.status(500).json({ message: 'Error deleting vehicle.' })
      }
      return res.status(200).json({ message: 'Vehicle deleted sucessfully.', id: obj.id })
    })
  })
})

module.exports = router