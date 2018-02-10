const autocannon = require('autocannon')

const VehiclesGet = autocannon({
  url: 'http://localhost/vehicles',
  connections: 1,
  amount: 600,
  duration: 2
})

const VehiclesPost = autocannon({
  url: 'http://localhost',
  connections: 300,
  amount: 1200,
  duration: 2,
  requests: [
    {
      method: 'POST',
      path: '/vehicles',
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(
        {
          name: (Math.random() * Math.pow(10, 10)).toFixed(0),
          make: (Math.random() * Math.pow(10, 16)).toFixed(0).repeat(16).substring(0, 255),
          model: (Math.random() * Math.pow(10, 16)).toFixed(0).repeat(16).substring(0, 255),
          year: (Math.random() * Math.pow(10, 4)).toFixed(0),
          vin: (Math.random() * Math.pow(10, 16)).toFixed(0).repeat(16).substring(0, 255)
        }
      )
    }
  ]
})

process.once('SIGINT', () => {
  VehiclesGet.stop()
})

autocannon.track(VehiclesPost)
// autocannon.track(VehiclesGet)
