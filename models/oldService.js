const mongoose = require('mongoose')
const joi = require('joi')
const joigoose = require('joigoose')(mongoose)
const guid = require('guid')

// defining joi schema
const joiServiceSchema = joi.object().keys({
  _id: joi.string().guid(),
  name: joi.string().min(3).max(10).required(),
  description: joi.string().max(255).required(),
  vehicle_slug: joi.string().required()
})

// convert joi schema to mongoose schema
const serviceSchema = new mongoose.Schema(joigoose.convert(joiServiceSchema))

// configuring mongoose schema unique fields
serviceSchema.set({'_id.required': 'true'})
serviceSchema.set({'_id.unique': 'true'})
serviceSchema.set({'vehicle_slug.unique': 'true'})

// config relationships and custom 'foreign keys'
serviceSchema.virtual('vehicle', {
  ref: 'Vehicle',
  localField: 'vehicle_slug',
  foreignField: 'slug',
  justOne: true
})

// joi validation method
serviceSchema.statics.validate = function (obj) {
  const result = joi.validate(obj, joiServiceSchema)
  result.fail = result.error !== null
  return result
}

// mongoose pre validation hook to create slug or id if necessary
serviceSchema.pre('validate', (next) => {
  if (!this._id) {
    this._id = guid.create()
  }
})

mongoose.model('Service', serviceSchema)

serviceSchema.set({'service.ref': 'Service'})
