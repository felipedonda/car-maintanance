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
    status: 'Started',
    started_at: '2018-02-10T09:01:32.154Z',
    finished_at: '2018-04-10T09:01:32.154Z'
  }

  it('should validate when Maintenace is all good', () => {
    expect(Maintenance.validate(goodMaintenance).fail).to.equal(false)
  })

  // ### ID

  it('should validate if the id is invalid', () => {
    const badMaintenance = Object.assign({}, goodMaintenance, {
      id: 2
    })
    expect(Maintenance.validate(badMaintenance).fail).to.equal(true)
  })

  // ### STATUS

  it('should validate if the status is null', () => {
    const badMaintenance = Object.assign({}, goodMaintenance, {
      status: null
    })
    expect(Maintenance.validate(badMaintenance).fail).to.equal(true)
  })

  it('should validate if the status is finished', () => {
    const badMaintenance = Object.assign({}, goodMaintenance, {
      status: 'FiNiShEd'
    })
    const maintenance = new Maintenance(badMaintenance)
    expect(maintenance.isFinished()).to.equal(true)
  })

  it('should not validate if the status is finished', () => {
    const maintenance = new Maintenance(goodMaintenance)
    expect(maintenance.isFinished()).to.equal(false)
  })

  // ### STARTED AT

  it('should validate if the started_at is null', () => {
    const badMaintenance = Object.assign({}, goodMaintenance, {
      started_at: null
    })
    expect(Maintenance.validate(badMaintenance).fail).to.equal(true)
  })

  // ### FINISHED AT

  it('should validate if the finished_at is later than started_at', () => {
    const badMaintenance = Object.assign({}, goodMaintenance, {
      started_at: laterDate,
      finished_at: currentDate
    })
    const maintenance = new Maintenance(badMaintenance)
    expect(maintenance.validateDates()).to.equal(false)
  })

  it('should not validate if the finished_at is ealier than started_at', () => {
    const badMaintenance = Object.assign({}, goodMaintenance, {
      started_at: currentDate,
      finished_at: laterDate
    })
    const maintenance = new Maintenance(badMaintenance)
    expect(maintenance.validateDates()).to.equal(true)
  })

  it('should validate if the finished_at is null', () => {
    const badMaintenance = Object.assign({}, goodMaintenance, {
      finished_at: null
    })
    expect(Maintenance.validate(badMaintenance).fail).to.equal(true)
  })

  // ### VEHICLE

  it('should validate if the vehicle_slug is null', () => {
    const badMaintenance = Object.assign({}, goodMaintenance, {
      vehicle_slug: null
    })
    expect(Maintenance.validate(badMaintenance).fail).to.equal(true)
  })
})
