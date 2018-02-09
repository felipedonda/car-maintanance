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
    description: 'lorem ipsum',
    vehicle_slug: '02e64a43-39d4-4f8c-ae05-473560169e97'
  }

  it('should validate object is right', () => {
    expect(Service.validate(goodService).fail).to.equal(false)
  })

  // ### ID

  it('should validate id is invalid', () => {
    const badService = Object.assign({}, goodService, {
      id: 2
    })
    expect(Service.validate(badService).fail).to.equal(true)
  })

  // ### NAME

  it('should validate name is invalid', () => {
    const badService = Object.assign({}, goodService, {
      name: 'fo'
    })
    expect(Service.validate(badService).fail).to.equal(true)
  })

  it('should validate name is null', () => {
    const badService = Object.assign({}, goodService, {
      name: null
    })
    expect(Service.validate(badService).fail).to.equal(true)
  })

  // ### DESCRIPTION

  it('should validate description is invalid', () => {
    const badService = Object.assign({}, goodService, {
      description: bigString256
    })
    expect(Service.validate(badService).fail).to.equal(true)
  })

  // ### VEHICLE

  it('should validate vehicle_slug is null', () => {
    const badService = Object.assign({}, goodService, {
      vehicle_slug: null
    })
    expect(Service.validate(badService).fail).to.equal(true)
  })
})
