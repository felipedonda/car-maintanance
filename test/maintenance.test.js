/* global describe, it */
const mongoose = require('mongoose')
require('../models/Maintenance')
const Maintenance = mongoose.model('Maintenance')
const { expect } = require('chai')

/*
id [type: uuid, mandatory: true]
status [type: string, mandatory: true]
started_at [type: date, mandatory: true]
finished_at [type: date, mandatory: true]
*/

describe('maintenance', () => {
  const currentDate = new Date()
  const laterDate = new Date()
  laterDate.setDate(currentDate.getDate() + 2)

  const goodMaintenance = {
    _id: '76c6c967-31e4-4ef4-9207-2d7f1fc6405a',
    status: 'Closed',
    started_at: '2018-02-10T09:01:32.154Z',
    finished_at: '2018-04-10T09:01:32.154Z'
  }

  it('should validate object is right', () => {
    expect(Maintenance.validate(goodMaintenance).fail).to.equal(false)
  })

  // ### ID

  it('should validate id is invalid', () => {
    const badMaintenance = Object.assign({}, goodMaintenance, {
      id: 2
    })
    expect(Maintenance.validate(badMaintenance).fail).to.equal(true)
  })

  // ### STATUS

  it('should validate status is null', () => {
    const badMaintenance = Object.assign({}, goodMaintenance, {
      status: null
    })
    expect(Maintenance.validate(badMaintenance).fail).to.equal(true)
  })

  // ### STARTED AT

  it('should validate started_at is null', () => {
    const badMaintenance = Object.assign({}, goodMaintenance, {
      started_at: null
    })
    expect(Maintenance.validate(badMaintenance).fail).to.equal(true)
  })

  // ### FINISHED AT

  it('should validate finished_at is later than started_at', () => {
    const badMaintenance = Object.assign({}, goodMaintenance, {
      started_at: laterDate,
      finished_at: currentDate
    })
    expect(Maintenance.validate(badMaintenance).fail).to.equal(true)
  })

  it('should validate finished_at is null', () => {
    const badMaintenance = Object.assign({}, goodMaintenance, {
      finished_at: null
    })
    expect(Maintenance.validate(badMaintenance).fail).to.equal(true)
  })

  // ### VEHICLE

  it('should validate vehicle_slug is null', () => {
    const badMaintenance = Object.assign({}, goodMaintenance, {
      vehicle_slug: null
    })
    expect(Maintenance.validate(badMaintenance).fail).to.equal(true)
  })
})
