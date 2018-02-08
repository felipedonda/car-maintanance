const mongoose = require('mongoose')
const joi = require('joi')
const joigoose = require('joigoose')(mongoose)

const joiserviceSchema = joi.object().keys({
  _id: joi.string().guid(),
  name: joi.string().min(3).max(10).required(),
  description: joi.string().min(0).max(255).required(),
  vehicle: joi.string().min(0).max(255).required()
})

const serviceSchema = new mongoose.Schema(joigoose.convert(joiserviceSchema))

serviceSchema.set({'vehicle.ref': 'Vehicle'})

serviceSchema.statics.validate = function (obj) {
  const result = joi.validate(obj, joiserviceSchema)
  result.fail = result.error !== null
  return result
}

mongoose.model('Service', serviceSchema)
