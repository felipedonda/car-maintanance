const mongoose = require('mongoose')
const joi = require('joi')
const joigoose = require('joigoose')(mongoose)
const guid = require('guid')

// defining joi schema
const joiMaintenanceSchema = joi.object().keys({
  _id: joi.string().guid(),
  status: joi.string().required(),
  started_at: joi.date().iso().required(),
  finished_at: joi.date().iso().required()
})

// convert joi schema to mongoose schema
const maintenanceSchema = new mongoose.Schema(joigoose.convert(joiMaintenanceSchema))

// overriding joigoose schema configuration
maintenanceSchema.add({vehicle_slug: {type: String, required: true, index: true}})
maintenanceSchema.add({started_at: {type: Date, required: true}})

// joi validation method
maintenanceSchema.statics.validate = (obj) => {
  const result = joi.validate(obj, joiMaintenanceSchema)
  result.fail = result.error !== null
  return result
}

maintenanceSchema.methods.validateDates = function () {
  if (this.started_at > this.finished_at) {
    return false
  } else {
    return true
  }
}

maintenanceSchema.methods.isFinished = function () {
  if (this.status.toLowerCase() === 'finished') {
    return true
  } else {
    return false
  }
}

/*
// config relationships and custom 'foreign keys'
maintenanceSchema.virtual('vehicle', {
  ref: 'Vehicle',
  localField: 'vehicle_slug',
  foreignField: 'slug',
  justOne: true
})
*/

// mongoose pre validation hook to create slug or id if necessary

maintenanceSchema.pre('validate', function (next) {
  if (!this._id) {
    this._id = guid.create()
  }
  if (!this.validateDates()) {
    next(new Error('Value "started_at" later than "finished_at"'))
  }
  next()
})

mongoose.model('Maintenance', maintenanceSchema)
