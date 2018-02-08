const mongoose = require('mongoose')
require('../models/Vehicle')
const Vehicle = mongoose.model('Vehicle')
const { expect } = require('chai')

/*
id [type: uuid, mandatory: true]
name [type: string, mandatory: true, min-size: 3, max-size: 10]
make [type: string, mandatory: true, min-size: 0, max-size: 255]
model [type: string, mandatory: true, min-size: 0, max-size: 255]
year [type: string, mandatory: true]
vin [type: string, mandatory: true, min-size: 0, max-size: 255]
*/

describe('vehicles', () => {
  const bigString256 = (new Array(257)).toString()

  const goodVehicle = {
    _id: '02e64a43-39d4-4f8c-ae05-473560169e97',
    name: 'foo',
    make: 'lorem ipsum',
    model: 'lorem ipsum',
    year: '9999',
    vin: 'lorem ipsum'
  }

  it('should validate object is right', () => {
    expect(Vehicle.validate(goodVehicle).fail).to.equal(false)
  })

  // ### ID

  it('should validate id is wrong', () => {
    const wrongVehicle = Object.assign({}, goodVehicle, {
      id: 2
    })
    expect(Vehicle.validate(wrongVehicle).fail).to.equal(true)
  })

  // ### NAME

  it('should validate name is wrong', () => {
    const wrongVehicle = Object.assign({}, goodVehicle, {
      name: 'fo'
    })
    expect(Vehicle.validate(wrongVehicle).fail).to.equal(true)
  })

  it('should validate name is null', () => {
    const wrongVehicle = Object.assign({}, goodVehicle, {
      name: null
    })
    expect(Vehicle.validate(wrongVehicle).fail).to.equal(true)
  })

  // ### MAKE

  it('should validate make is wrong', () => {
    const wrongVehicle = Object.assign({}, goodVehicle, {
      make: bigString256
    })
    expect(Vehicle.validate(wrongVehicle).fail).to.equal(true)
  })

  it('should validate make is null', () => {
    const wrongVehicle = Object.assign({}, goodVehicle, {
      make: null
    })
    expect(Vehicle.validate(wrongVehicle).fail).to.equal(true)
  })

  // ### MODEL

  it('should validate model is wrong', () => {
    const wrongVehicle = Object.assign({}, goodVehicle, {
      model: bigString256
    })
    expect(Vehicle.validate(wrongVehicle).fail).to.equal(true)
  })

  it('should validate model is null', () => {
    const wrongVehicle = Object.assign({}, goodVehicle, {
      model: null
    })
    expect(Vehicle.validate(wrongVehicle).fail).to.equal(true)
  })

  // ### YEAR

  it('should validate year is null', () => {
    const wrongVehicle = Object.assign({}, goodVehicle, {
      year: null
    })
    expect(Vehicle.validate(wrongVehicle).fail).to.equal(true)
  })

  // ### VIN

  it('should validate vin is wrong', () => {
    const wrongVehicle = Object.assign({}, goodVehicle, {
      vin: bigString256
    })
    expect(Vehicle.validate(wrongVehicle).fail).to.equal(true)
  })

  it('should validate vin is null', () => {
    const wrongVehicle = Object.assign({}, goodVehicle, {
      vin: null
    })
    expect(Vehicle.validate(wrongVehicle).fail).to.equal(true)
  })
})
