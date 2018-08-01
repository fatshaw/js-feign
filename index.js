const {
  ZipkinTracer
} = require('./zipkin-tracer')
const ZipkinRequest = require('./zipkin-request-native')
const {
  zipkinExpressMiddleware
} = require('./zipkin-middleware')
const {
  name
} = require(`${process.cwd()}/package.json`);

function getServiceName() {
  return `${name}-${process.env.NODE_ENV}`;
}

module.exports = ({ zipkinUrl }) => {
  const {
    tracer
  } = new ZipkinTracer(zipkinUrl, getServiceName());
  const zipkinRequest = ZipkinRequest(tracer)

  const zipkin = zipkinExpressMiddleware(tracer, getServiceName());
  const zipkinMiddleware = function (req, res, next) {
    if (req.path.includes('health')) {
      next();
    } else {
      zipkin(req, res, next);
    }
  }
  return {
    tracer,
    zipkinMiddleware,
    zipkinRequest
  }
}