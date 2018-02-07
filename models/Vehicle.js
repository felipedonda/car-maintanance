const mongoose = require('mongoose')
const joi = require('joi')
const joigoose = require('joigoose')(mongoose)

const joiVehicleSchema = joi.object().keys({
    id: joi.string().guid().required(),
    name: joi.string().min(3).max(10).required(),
    make: joi.string().min(0).max(255).required(),
    model: joi.string().min(0).max(255).required(),
    year: joi.string().required(),
    vin: joi.string().min(0).max(255).required(),
}).meta({ _id: false })

const vehicleSchema = new mongoose.Schema(joigoose.convert(joiVehicleSchema));

vehicleSchema.statics.validate = function(obj) {
    const result = joi.validate(obj,joiVehicleSchema)
    result.fail = result.error === null? false:true
    return result
}

mongoose.model('Vehicle',vehicleSchema)