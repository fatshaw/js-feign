const CLSNodeContext = require('./zipkin-cls')

const {
  Tracer,
  BatchRecorder,
  ConsoleRecorder,
  jsonEncoder: {JSON_V2}
} = require('zipkin')

const {
  HttpLogger
} = require('zipkin-transport-http')

class ZipkinTracer {
  constructor(url, localServiceName) {
    let recorder
    if (url) {
      recorder = new BatchRecorder({
        logger: new HttpLogger({
          endpoint: `${url}/api/v2/spans`,
          jsonEncoder: JSON_V2,
          httpInterval: 30000,
        })
      });
    } else {
      recorder = new ConsoleRecorder();
    }

    this.tracer = new Tracer({
      ctxImpl: new CLSNodeContext(),
      recorder,
      localServiceName,
    })
  }
}

module.exports = {
  ZipkinTracer
}
