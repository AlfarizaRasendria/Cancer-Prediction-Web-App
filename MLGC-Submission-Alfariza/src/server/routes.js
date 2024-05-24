const { postPredictHandler, getPredictHistoriesHandler } = require('./handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 1000000,
      }
    }
  },
  {
    path:'/predict/histories',
    method:'GET',
    handler:getPredictHistoriesHandler,
  }
]

module.exports = routes;