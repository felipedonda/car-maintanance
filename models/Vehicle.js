const mongoose = require('mongoose')
const joi = require('joi')
const joigoose = require('joigoose')(mongoose)
const guid = require('guid')
const Slug = require('slug')

// defining joi schema
const joiVehicleSchema = joi.object().keys({
  _id: joi.string().guid(),
  name: joi.string().min(3).max(10).required(),
  make: joi.string().max(255).required(),
  model: joi.string().max(255).required(),
  year: joi.string().required(),
  vin: joi.string().max(255).required(),
  slug: joi.string()
})

// convert joi schema to mongoose schema
const vehicleSchema = new mongoose.Schema(joigoose.convert(joiVehicleSchema))

// overriding joigoose schema configuration
vehicleSchema.add({slug: {type: String, unique: true, required: true, index: true}})

// joi validation method
vehicleSchema.statics.validate = (obj) => {
  const result = joi.validate(obj, joiVehicleSchema)
  result.fail = result.error !== null
  return result
}

// mongoose pre validation hook to create slug or id if necessary

vehicleSchema.pre('validate', function (next) {
  if (!this._id) {
    this._id = guid.create()
  }

  if (!this.slug) {
    this.slug = Slug(''.concat(this.name, '-', (Math.random() * Math.pow(36, 6) | 0).toString(36)).toLowerCase())
  }
  next()
})

mongoose.model('Vehicle', vehicleSchema)
