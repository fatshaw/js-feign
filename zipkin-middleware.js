const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware

const zipkinExpressMiddleware = (tracer, serviceName) => {
  return zipkinMiddleware({
    tracer,
    serviceName
  })
}

module.exports = {
  zipkinExpressMiddleware
}