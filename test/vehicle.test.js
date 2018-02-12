/* global describe, it */
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

slug [type: string, mandatory: true]
*/

describe('vehicles', () => {
  const bigString256 = (new Array(257)).toString()

  const goodVehicle = {
    _id: '02e64a43-39d4-4f8c-ae05-473560169e97',
    name: 'foo',
    make: 'lorem',
    model: 'ipsum',
    year: '2000',
    vin: '1FD8X3G64DEA72527',
    slug: 'lorem-ipsum-2000-foo'
  }
  //  Disclaimer: vin randomly generated, any resemblance is mere coincidence

  it('should validate if the object is right', () => {
    expect(Vehicle.validate(goodVehicle).fail).to.equal(false)
  })

  // ### ID

  it('should validate if the id is invalid', () => {
    const badVehicle = Object.assign({}, goodVehicle, {
      id: 2
    })
    expect(Vehicle.validate(badVehicle).fail).to.equal(true)
  })

  // ### NAME

  it('should validate if the name is invalid', () => {
    const badVehicle = Object.assign({}, goodVehicle, {
      name: 'fo'
    })
    expect(Vehicle.validate(badVehicle).fail).to.equal(true)
  })

  it('should validate if the name is null', () => {
    const badVehicle = Object.assign({}, goodVehicle, {
      name: null
    })
    expect(Vehicle.validate(badVehicle).fail).to.equal(true)
  })

  // ### MAKE

  it('should validate if the make is invalid', () => {
    const badVehicle = Object.assign({}, goodVehicle, {
      make: bigString256
    })
    expect(Vehicle.validate(badVehicle).fail).to.equal(true)
  })

  it('should validate if the make is null', () => {
    const badVehicle = Object.assign({}, goodVehicle, {
      make: null
    })
    expect(Vehicle.validate(badVehicle).fail).to.equal(true)
  })

  // ### MODEL

  it('should validate if the model is invalid', () => {
    const badVehicle = Object.assign({}, goodVehicle, {
      model: bigString256
    })
    expect(Vehicle.validate(badVehicle).fail).to.equal(true)
  })

  it('should validate if the model is null', () => {
    const badVehicle = Object.assign({}, goodVehicle, {
      model: null
    })
    expect(Vehicle.validate(badVehicle).fail).to.equal(true)
  })

  // ### YEAR

  it('should validate if the year is null', () => {
    const badVehicle = Object.assign({}, goodVehicle, {
      year: null
    })
    expect(Vehicle.validate(badVehicle).fail).to.equal(true)
  })

  // ### VIN

  it('should validate if the vin is invalid', () => {
    const badVehicle = Object.assign({}, goodVehicle, {
      vin: bigString256
    })
    expect(Vehicle.validate(badVehicle).fail).to.equal(true)
  })

  it('should validate if the vin is null', () => {
    const badVehicle = Object.assign({}, goodVehicle, {
      vin: null
    })
    expect(Vehicle.validate(badVehicle).fail).to.equal(true)
  })
})
