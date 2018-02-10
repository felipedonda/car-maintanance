const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Service = mongoose.model('Service')
const Vehicle = mongoose.model('Vehicle')
const isProduction = process.env.NODE_ENV === 'production'

//  # POST
router.post('/:vehicle_slug/services', (req, res) => {
  const vehicleSlug = req.params.vehicle_slug

  //  finding on db
  Vehicle.findOne({slug: vehicleSlug}, (err, vehicle) => {
    if (err) {
      if (!isProduction) { console.log(err) }
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }

    if (!vehicle) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    //  validating
    const validation = Service.validate(req.body)
    if (validation.fail) {
      return res.status(422).json({ message: 'Invalid service parameters!', error: validation.error.details[0].message })
    }

    //  saving on db
    const service = new Service(Object.assign({}, req.body, {vehicle_slug: vehicleSlug}))
    service.save((err, obj) => {
      if (err) {
        if (!isProduction) { console.log(err) }
        return res.status(500).json({ message: 'Error saving service.' })
      }
      return res.status(200).json({ message: 'Service saved sucessfully.', _id: obj._id, slug: obj.slug })
    })
  })
})

//  # GET
router.get('/:vehicle_slug/services', (req, res) => {
  const vehicleSlug = req.params.vehicle_slug

  //  finding on db
  Vehicle.findOne({slug: vehicleSlug}, (err, vehicle) => {
    if (err) {
      if (!isProduction) { console.log(err) }
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }

    if (!vehicle) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    //  finding on db
    Service.find({vehicle_slug: vehicleSlug}, (err, list) => {
      if (err) {
        if (!isProduction) { console.log(err) }
        return res.status(500).json({ message: 'Error getting services.' })
      }
      return res.json(list)
    })
  })
})

//  # GET
router.get('/:vehicle_slug/services/:id', (req, res) => {
  const vehicleSlug = req.params.vehicle_slug
  const id = req.params.id

  //  finding on db
  Vehicle.findOne({slug: vehicleSlug}, (err, vehicle) => {
    if (err) {
      if (!isProduction) { console.log(err) }
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }

    if (!vehicle) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    //  finding on db
    Service.findOne({
      $and: [ {vehicle_slug: vehicleSlug}, {_id: id} ]
    }, (err, list) => {
      if (err) {
        if (!isProduction) { console.log(err) }
        return res.status(500).json({ message: 'Error getting services.' })
      }
      return res.json(list)
    })
  })
})

//  # PUT
router.put('/:vehicle_slug/services/:id', (req, res) => {
  const vehicleSlug = req.params.vehicle_slug
  const id = req.params.id

  //  finding on db
  Vehicle.findOne({slug: vehicleSlug}, (err, vehicle) => {
    if (err) {
      if (!isProduction) { console.log(err) }
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }

    if (!vehicle) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    //  finding on db
    Service.findOne({_id: id}, (err, service) => {
      if (err) {
        if (!isProduction) { console.log(err) }
        return res.status(500).json({ message: 'Error getting service.' })
      }

      if (!service) {
        return res.status(404).json({ message: 'No such service.' })
      }

      //  validating
      const goodService = {
        _id: '76c6c967-31e4-4ef4-9207-2d7f1fc6405a',
        name: 'foo',
        description: 'lorem ipsum',
        vehicle_slug: '02e64a43-39d4-4f8c-ae05-473560169e97'
      }

      //  Disclaimer: vin randomly generated, any resemblance is mere coincidence
      const validation = Service.validate(Object.assign(
        {},
        goodService,
        req.body
      ))
      if (validation.fail) {
        return res.status(422).json({ message: 'Invalid service parameters!', error: validation.error.details[0].message })
      }

      // assigning new values to object
      Object.assign(service, req.body)

      //  saving to db
      service.save((err, obj) => {
        if (err) {
          if (!isProduction) { console.log(err) }
          return res.status(500).json({ message: 'Error saving service.' })
        }
        return res.status(200).json({ message: 'Service saved sucessfully.', id: obj.id, slug: obj.slug })
      })
    })
  })
})

//  # DELETE
router.delete('/:vehicle_slug/services/:id', (req, res) => {
  const vehicleSlug = req.params.vehicle_slug
  const id = req.params.id

  //  finding on db
  Vehicle.findOne({slug: vehicleSlug}, (err, vehicle) => {
    if (err) {
      if (!isProduction) { console.log(err) }
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }

    if (!vehicle) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    //  finding on db
    Service.findOne({_id: id}, (err, service) => {
      if (err) {
        if (!isProduction) { console.log(err) }
        return res.status(500).json({ message: 'Error getting service.' })
      }
      if (!service) {
        return res.status(404).json({ message: 'No such service.' })
      }

      // removing from db
      service.remove((err, obj) => {
        if (err) {
          if (!isProduction) { console.log(err) }
          return res.status(500).json({ message: 'Error deleting service.' })
        }
        return res.status(200).json({ message: 'Service deleted sucessfully.', id: obj.id })
      })
    })
  })
})

module.exports = router
