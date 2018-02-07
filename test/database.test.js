const mongoose = require('mongoose')
const isProduction = process.env.NODE_ENV === 'production'

describe('database', () => {
  it('should sucessfully connect', (done) => {
    if(isProduction){
        mongoose.connect(process.env.MONGODB_URI,done)
    } else {
        mongoose.connect('mongodb://localhost/car-maintenance-db',done)
    }
  })
})
