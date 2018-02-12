const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Vehicle = mongoose.model('Vehicle')
const isProduction = process.env.NODE_ENV === 'production'

//  # POST
router.post('/', (req, res) => {
  //  validating
  const validation = Vehicle.validate(req.body)
  if (validation.fail) {
    return res.status(422).json({ message: 'Invalid vehicle parameters!', error: validation.error.details[0].message })
  }

  const vehicle = new Vehicle(req.body)

  //  saving on db
  vehicle.save((err, obj) => {
    if (err) {
      if (!isProduction) { console.log(err) }
      return res.status(500).json({ message: 'Error saving vehicle.' })
    }
    return res.status(200).json({ message: 'Vehicle saved sucessfully.', _id: obj._id, slug: obj.slug })
  })
})

//  # GET
router.get('/', (req, res) => {
  //  finding on db
  Vehicle.find((err, list) => {
    if (err) {
      if (!isProduction) { console.log(err) }
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }
    return res.json(list)
  })
})

//  # GET
router.get('/:id', (req, res) => {
  const id = req.params.id

  //  finding on db
  Vehicle.find({_id: id}, null, { limit: 1 }, (err, result) => {
    if (err) {
      if (!isProduction) { console.log(err) }
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }

    if (!result.length) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    const vehicle = result[0]

    return res.json(vehicle)
  })
})

//  # PUT
router.put('/:id', (req, res) => {
  const id = req.params.id

  //  finding on db
  Vehicle.findOne({_id: id}, (err, vehicle) => {
    if (err) {
      if (!isProduction) { console.log(err) }
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }

    if (!vehicle) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    //  validating
    const goodVehicle = {
      _id: '02e64a43-39d4-4f8c-ae05-473560169e97',
      name: 'foo',
      make: 'lorem',
      model: 'ipsum',
      year: '2000',
      vin: '1FD8X3G64DEA72527'
    }
    //  Disclaimer: vin randomly generated, any resemblance is mere coincidence
    const validation = Vehicle.validate(Object.assign(
      {},
      goodVehicle,
      req.body
    ))
    if (validation.fail) {
      return res.status(422).json({ message: 'Invalid vehicle parameters!', error: validation.error.details[0].message })
    }

    // assigning new values to object
    Object.assign(vehicle, req.body)

    //  saving to db
    vehicle.save((err, obj) => {
      if (err) {
        if (!isProduction) { console.log(err) }
        return res.status(500).json({ message: 'Error saving vehicle.' })
      }

      return res.status(200).json({ message: 'Vehicle saved sucessfully.', id: obj.id, slug: obj.slug })
    })
  })
})

//  # DELETE
router.delete('/:id', (req, res) => {
  const id = req.params.id

  //  finding on db
  Vehicle.findOne({_id: id}, (err, vehicle) => {
    if (err) {
      if (!isProduction) { console.log(err) }
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }
    if (!vehicle) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    // removing from db
    vehicle.remove((err, obj) => {
      if (err) {
        if (!isProduction) { console.log(err) }
        return res.status(500).json({ message: 'Error deleting vehicle.' })
      }
      return res.status(200).json({ message: 'Vehicle deleted sucessfully.', id: obj.id })
    })
  })
})

module.exports = router
