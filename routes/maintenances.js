const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Maintenance = mongoose.model('Maintenance')
const Vehicle = mongoose.model('Vehicle')
const isProduction = process.env.NODE_ENV === 'production'

//  # POST
router.post('/:vehicle_slug', (req, res) => {
  const vehicleSlug = req.params.vehicle_slug

  //  finding on db
  Vehicle.count({slug: vehicleSlug}, (err, vehicle) => {
    if (err) {
      if (!isProduction) { console.log(err) }
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }

    if (vehicle === 0) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    //  validating
    const validation = Maintenance.validate(req.body)
    if (validation.fail) {
      return res.status(422).json({ message: 'Invalid maintenance parameters!', error: validation.error.details[0].message })
    }

    //  saving on db
    const maintenance = new Maintenance(Object.assign({}, req.body, {vehicle_slug: vehicleSlug}))
    maintenance.save((err, obj) => {
      if (err) {
        if (err.message === 'Value "started_at" later than "finished_at"') {
          return res.status(422).json({ message: 'Invalid maintenance parameters!', error: err.message })
        }
        if (!isProduction) { console.log(err) }
        return res.status(500).json({ message: 'Error saving maintenance.' })
      }
      return res.status(200).json({ message: 'Maintenance saved sucessfully.', _id: obj._id, slug: obj.slug })
    })
  })
})

//  # GET
router.get('/:vehicle_slug', (req, res) => {
  const vehicleSlug = req.params.vehicle_slug

  //  finding on db
  Vehicle.count({slug: vehicleSlug}, (err, vehicle) => {
    if (err) {
      if (!isProduction) { console.log(err) }
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }

    if (vehicle === 0) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    //  finding on db
    Maintenance.find({vehicle_slug: vehicleSlug}, (err, list) => {
      if (err) {
        if (!isProduction) { console.log(err) }
        return res.status(500).json({ message: 'Error getting maintenances.' })
      }
      return res.json(list)
    })
  })
})

//  # GET/ID
router.get('/:vehicle_slug/:id', (req, res) => {
  const vehicleSlug = req.params.vehicle_slug
  const id = req.params.id

  //  finding on db
  Vehicle.count({slug: vehicleSlug}, (err, vehicle) => {
    if (err) {
      if (!isProduction) { console.log(err) }
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }

    if (vehicle === 0) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    //  finding on db
    Maintenance.find({
      $and: [ {vehicle_slug: vehicleSlug}, {_id: id} ]
    }, null, {limit: 1}, (err, result) => {
      if (err) {
        if (!isProduction) { console.log(err) }
        return res.status(500).json({ message: 'Error getting maintenances.' })
      }

      if (!result.length) {
        return res.status(404).json({ message: 'No such maintenance.' })
      }

      const maintenance = result[0]

      return res.json(maintenance)
    })
  })
})

//  # PUT
router.put('/:vehicle_slug/:id', (req, res) => {
  const vehicleSlug = req.params.vehicle_slug
  const id = req.params.id

  //  finding on db
  Vehicle.count({slug: vehicleSlug}, (err, vehicle) => {
    if (err) {
      if (!isProduction) { console.log(err) }
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }

    if (vehicle === 0) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    //  finding on db
    Maintenance.find({_id: id}, null, {limit: 1}, (err, result) => {
      if (err) {
        if (!isProduction) { console.log(err) }
        return res.status(500).json({ message: 'Error getting maintenance.' })
      }

      if (!result.length) {
        return res.status(404).json({ message: 'No such maintenance.' })
      }

      const maintenance = result[0]

      if (maintenance.isFinished()) {
        return res.status(400).json({ message: 'Maintenance status is already finished, no updates are allowed.' })
      }

      //  validating
      const goodMaintenance = {
        _id: '76c6c967-31e4-4ef4-9207-2d7f1fc6405a',
        status: 'Open',
        started_at: '2018-02-10T09:01:32.154Z',
        finished_at: '2018-04-10T09:01:32.154Z'
      }

      //  Disclaimer: vin randomly generated, any resemblance is mere coincidence
      const validation = Maintenance.validate(Object.assign(
        {},
        goodMaintenance,
        req.body
      ))
      if (validation.fail) {
        return res.status(422).json({ message: 'Invalid maintenance parameters!', error: validation.error.details[0].message })
      }

      // assigning new values to object
      Object.assign(maintenance, req.body)

      //  saving to db
      maintenance.save((err, obj) => {
        if (err) {
          if (err.message === 'Value "started_at" later than "finished_at"') {
            return res.status(422).json({ message: 'Invalid maintenance parameters!', error: err.message })
          }
          if (!isProduction) { console.log(err) }
          return res.status(500).json({ message: 'Error saving maintenance.' })
        }
        return res.status(200).json({ message: 'Maintenance saved sucessfully.', id: obj.id })
      })
    })
  })
})

//  # DELETE
router.delete('/:vehicle_slug/:id', (req, res) => {
  const vehicleSlug = req.params.vehicle_slug
  const id = req.params.id

  //  finding on db
  Vehicle.count({slug: vehicleSlug}, (err, vehicle) => {
    if (err) {
      if (!isProduction) { console.log(err) }
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }

    if (vehicle === 0) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    //  finding on db
    Maintenance.find({_id: id}, null, { limit: 1 }, (err, result) => {
      if (err) {
        if (!isProduction) { console.log(err) }
        return res.status(500).json({ message: 'Error getting maintenance.' })
      }
      if (!result.length) {
        return res.status(404).json({ message: 'No such maintenance.' })
      }

      const maintenance = result[0]

      // removing from db
      maintenance.remove((err, obj) => {
        if (err) {
          if (!isProduction) { console.log(err) }
          return res.status(500).json({ message: 'Error deleting maintenance.' })
        }
        return res.status(200).json({ message: 'Maintenance deleted sucessfully.', id: obj.id })
      })
    })
  })
})

//  # GET | function: finish
router.get('/:vehicle_slug/:id/finish', (req, res) => {
  const vehicleSlug = req.params.vehicle_slug
  const id = req.params.id

  //  finding on db
  Vehicle.count({slug: vehicleSlug}, (err, vehicle) => {
    if (err) {
      if (!isProduction) { console.log(err) }
      return res.status(500).json({ message: 'Error getting vehicle.' })
    }

    if (vehicle === 0) {
      return res.status(404).json({ message: 'No such vehicle.' })
    }

    //  finding on db
    Maintenance.find({_id: id}, null, {limit: 1}, (err, result) => {
      if (err) {
        if (!isProduction) { console.log(err) }
        return res.status(500).json({ message: 'Error getting maintenance.' })
      }

      if (!result.length) {
        return res.status(404).json({ message: 'No such maintenance.' })
      }

      const maintenance = result[0]

      if (maintenance.isFinished()) {
        return res.status(400).json({ message: 'Maintenance status is already finished, no updates are allowed.' })
      }

      maintenance.status = 'Finished'

      //  saving to db
      maintenance.save((err, obj) => {
        if (err) {
          if (err.message === 'Value "started_at" later than "finished_at"') {
            return res.status(422).json({ message: 'Invalid maintenance parameters!', error: err.message })
          }
          if (!isProduction) { console.log(err) }
          return res.status(500).json({ message: 'Error saving maintenance.' })
        }
        return res.status(200).json({ message: 'Maintenance finished sucessfully.', id: obj.id })
      })
    })
  })
})

module.exports = router
