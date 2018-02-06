const joi = require('joi')

const validateVehicles = vehicle => {
    const schema = joi.object().keys({
        id: joi.string().guid().required(),
        name: joi.string().min(3).max(10).required(),
        make: joi.string().min(0).max(255).required(),
        model: joi.string().min(0).max(255).required(),
        year: joi.string().required(),
        vin: joi.string().min(0).max(255).required(),
    })
    const result = joi.validate(vehicle,schema)
    result.fail = result.error === null? false:true
    return result
}

module.exports.validateVehicles = validateVehicles