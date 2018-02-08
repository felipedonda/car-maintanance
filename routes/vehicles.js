const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Vehicle = mongoose.model('Vehicle')
const guid = require('guid')
const isProduction = process.env.NODE_ENV === 'production'

// used for PUT validation

//  # POST
router.post('/', (req, res) => {
  //  validating
  const validation = Vehicle.validate(req.body)
  if (validation.fail) {
    return res.status(422).json({ message: 'Invalid vehicle parameters!', error: validation.error.details[0].message })
  }

  const vehicle = new Vehicle(req.body)

  if (!vehicle._id) {
    vehicle._id = guid.create()
  }

  //  saving on db
  vehicle.save((err, obj) => {
    if (err) {
      const outerr = { message: 'Error saving vehicle.' }
      if (!isProduction) { outerr.error = err }
      return res.status(500).json(outerr)
    }
    return res.status(200).json({ message: 'Vehicle saved sucessfully.', _id: obj._id })
  })
})

//  # GET
router.get('/', (req, res) => {
  //  finding on db
  Vehicle.find((err, list) => {
    if (err) {
      const outerr = { message: 'Error getting vehicle.' }
      if (!isProduction) { outerr.error = err }
      return res.status(500).json(outerr)
    }
    return res.json(list)
  })
})

//  # GET
router.get('/:id', (req, res) => {
  const id = req.params.id

  //  finding on db
  Vehicle.findOne({_id: id}, (err, obj) => {
    if (err) {
      const outerr = { message: 'Error getting vehicle.' }
      if (!isProduction) { outerr.error = err }
      return res.status(500).json(outerr)
    }

    if (!obj) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    return res.json(obj)
  })
})

//  # PUT
router.put('/:id', (req, res) => {
  const id = req.params.id

  //  finding on db
  Vehicle.findOne({_id: id}, (err, vehicle) => {
    if (err) {
      const outerr = { message: 'Error getting vehicle.' }
      if (!isProduction) { outerr.error = err }
      return res.status(500).json(outerr)
    }

    if (!vehicle) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    //  validating
    const goodVehicle = {
      _id: '02e64a43-39d4-4f8c-ae05-473560169e97',
      name: 'foo',
      make: 'lorem ipsum',
      model: 'lorem ipsum',
      year: '9999',
      vin: 'lorem ipsum'
    }    
    const validation = Vehicle.validate(Object.assign({}, goodVehicle, req.body))
    if (validation.fail) {
      return res.status(422).json({ message: 'Invalid vehicle parameters!', error: validation.error.details[0].message })
    }

    // assigning new values to object
    Object.assign(vehicle, req.body)

    //  saving to db
    vehicle.save((err, obj) => {
      if (err) {
        const outerr = { message: 'Error saving vehicle.' }
        if (!isProduction) { outerr.error = err }
        return res.status(500).json(outerr)
      }
      return res.status(200).json({ message: 'Vehicle saved sucessfully.', id: obj.id })
    })
  })
})

//  # DELETE
router.delete('/:id', (req, res) => {
  const id = req.params.id

  //  finding on db
  Vehicle.findOne({_id: id}, (err, vehicle) => {
    if (err) {
      const outerr = { message: 'Error getting vehicle.' }
      if (!isProduction) { outerr.error = err }
      return res.status(500).json(outerr)
    }

    if (!vehicle) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    // removing from db
    vehicle.remove((err, obj) => {
      if (err) {
        const outerr = { message: 'Error deleting vehicle.' }
        if (!isProduction) { outerr.error = err }
        return res.status(500).json(outerr)
      }
      return res.status(200).json({ message: 'Vehicle deleted sucessfully.', id: obj.id })
    })
  })
})

module.exports = router
