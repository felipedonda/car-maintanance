/* global describe, it */
const mongoose = require('mongoose')
require('../models/Service')
const Service = mongoose.model('Service')
const { expect } = require('chai')

/*
id [type: uuid, mandatory: true]
name [type: string, mandatory: true, min-size: 3, max-size: 10]
description [type: string, mandatory: false, min-size: 0, max-size: 255]
*/

describe('service', () => {
  const bigString256 = (new Array(257)).toString()

  const goodService = {
    _id: '76c6c967-31e4-4ef4-9207-2d7f1fc6405a',
    name: 'foo',
    description: 'lorem ipsum'
  }

  it('should validate if the object is right', () => {
    expect(Service.validate(goodService).fail).to.equal(false)
  })

  // ### ID

  it('should validate if the id is invalid', () => {
    const badService = Object.assign({}, goodService, {
      id: 2
    })
    expect(Service.validate(badService).fail).to.equal(true)
  })

  // ### NAME

  it('should validate if the name is invalid', () => {
    const badService = Object.assign({}, goodService, {
      name: 'fo'
    })
    expect(Service.validate(badService).fail).to.equal(true)
  })

  it('should validate if the name is null', () => {
    const badService = Object.assign({}, goodService, {
      name: null
    })
    expect(Service.validate(badService).fail).to.equal(true)
  })

  // ### DESCRIPTION

  it('should validate if the description is invalid', () => {
    const badService = Object.assign({}, goodService, {
      description: bigString256
    })
    expect(Service.validate(badService).fail).to.equal(true)
  })

  it('should not validate if the description is null', () => {
    const badService = Object.assign({}, goodService, {
      description: null
    })
    expect(Service.validate(badService).fail).to.equal(false)
  })

  // ### VEHICLE

  it('should validate if the vehicle_slug is null', () => {
    const badService = Object.assign({}, goodService, {
      vehicle_slug: null
    })
    expect(Service.validate(badService).fail).to.equal(true)
  })
})
