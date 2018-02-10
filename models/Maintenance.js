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
maintenanceSchema.add({vehicle_slug: {type: [String], required: true}})
maintenanceSchema.add({started_at: {type: [Date], required: true}})

// joi validation method
maintenanceSchema.statics.validate = (obj) => {
  const result = joi.validate(obj, joiMaintenanceSchema)

  if (obj.started_at > obj.finished_at) {
    if (result.error) {
      result.error.details.push({message: 'Value "started_at" later than "finished_at"'})
    } else {
      result.error = {
        details: [{message: 'Value "started_at" later than "finished_at"'}]
      }
    }
  }

  result.fail = result.error !== null
  return result
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
  next()
})

mongoose.model('Maintenance', maintenanceSchema)
