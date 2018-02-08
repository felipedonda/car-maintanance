/* global describe, it */
const mongoose = require('mongoose')
require('../models/Service')
const Vehicle = mongoose.model('Service')
const { expect } = require('chai')

/*
id [type: uuid, mandatory: true]
name [type: string, mandatory: true, min-size: 3, max-size: 10]
description [type: string, mandatory: false, min-size: 0, max-size: 255]
vehicle_id [type: uuid, mandatory: true]
*/

describe('service', () => {
  const bigString256 = (new Array(257)).toString()

  const goodService = {
    _id: '76c6c967-31e4-4ef4-9207-2d7f1fc6405a',
    name: 'foo',
    description: 'lorem ipsum',
    vehicle: '02e64a43-39d4-4f8c-ae05-473560169e97'
  }

  it('should validate object is right', () => {
    expect(Vehicle.validate(goodService).fail).to.equal(false)
  })

  // ### ID

  it('should validate id is invalid', () => {
    const badService = Object.assign({}, goodService, {
      id: 2
    })
    expect(Vehicle.validate(badService).fail).to.equal(true)
  })

  // ### NAME

  it('should validate name is invalid', () => {
    const badService = Object.assign({}, goodService, {
      name: 'fo'
    })
    expect(Vehicle.validate(badService).fail).to.equal(true)
  })

  it('should validate name is null', () => {
    const badService = Object.assign({}, goodService, {
      name: null
    })
    expect(Vehicle.validate(badService).fail).to.equal(true)
  })

  // ### DESCRIPTION

  it('should validate description is invalid', () => {
    const badService = Object.assign({}, goodService, {
      make: bigString256
    })
    expect(Vehicle.validate(badService).fail).to.equal(true)
  })

  it('should validate description is null', () => {
    const badService = Object.assign({}, goodService, {
      make: null
    })
    expect(Vehicle.validate(badService).fail).to.equal(true)
  })
  // ### DESCRIPTION

  it('should validate description is invalid', () => {
    const badService = Object.assign({}, goodService, {
      make: bigString256
    })
    expect(Vehicle.validate(badService).fail).to.equal(true)
  })

  // ### VEHICLE_ID

  it('should validate vehicle_id is invalid', () => {
    const badService = Object.assign({}, goodService, {
      id: 2
    })
    expect(Vehicle.validate(badService).fail).to.equal(true)
  })

  it('should validate vehicle_id is null', () => {
    const badService = Object.assign({}, goodService, {
      id: null
    })
    expect(Vehicle.validate(badService).fail).to.equal(true)
  })
})
