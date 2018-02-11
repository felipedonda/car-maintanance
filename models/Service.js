const mongoose = require('mongoose')
const joi = require('joi')
const joigoose = require('joigoose')(mongoose)
const guid = require('guid')

// defining joi schema
const joiServiceSchema = joi.object().keys({
  _id: joi.string().guid(),
  name: joi.string().min(3).max(10).required(),
  description: joi.string().max(255).allow(null).optional(),
  vehicle_slug: joi.string()
})

// convert joi schema to mongoose schema
const serviceSchema = new mongoose.Schema(joigoose.convert(joiServiceSchema))

// overriding joigoose schema configuration
serviceSchema.add({vehicle_slug: {type: String, required: true, index: true}})

// joi validation method
serviceSchema.statics.validate = (obj) => {
  const result = joi.validate(obj, joiServiceSchema)
  result.fail = result.error !== null
  return result
}

/*
//  config relationships and custom 'foreign keys'
serviceSchema.virtual('vehicle', {
  ref: 'Vehicle',
  localField: 'vehicle_slug',
  foreignField: 'slug',
  justOne: true
})
*/

// mongoose pre validation hook to create slug or id if necessary

serviceSchema.pre('validate', function (next) {
  if (!this._id) {
    this._id = guid.create()
  }
  next()
})

mongoose.model('Service', serviceSchema)
