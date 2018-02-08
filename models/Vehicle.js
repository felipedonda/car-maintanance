const mongoose = require('mongoose')
const joi = require('joi')
const joigoose = require('joigoose')(mongoose)

const joiVehicleSchema = joi.object().keys({
  _id: joi.string().guid(),
  name: joi.string().min(3).max(10).required(),
  make: joi.string().min(0).max(255).required(),
  model: joi.string().min(0).max(255).required(),
  year: joi.string().required(),
  vin: joi.string().min(0).max(255).required()
})

const vehicleSchema = new mongoose.Schema(joigoose.convert(joiVehicleSchema))

vehicleSchema.statics.validate = function (obj) {
  const result = joi.validate(obj, joiVehicleSchema)
  result.fail = result.error !== null
  return result
}

mongoose.model('Vehicle', vehicleSchema)
