const { Instrumentation } = require("zipkin");

const request = require("axios");
const eureka = require("js-eureka-client-springcloud");

class ZipkinRequest {
  constructor(tracer, remoteServiceName, defaultServiceUrl) {
    this.remoteServiceName = remoteServiceName;
    this.instrumentation = new Instrumentation.HttpClient({
      tracer,
      remoteServiceName: this.remoteServiceName
    });
    this.tracer = tracer;
    this.defaultServiceUrl = defaultServiceUrl;
  }

  _getUrlByServiceName() {
    const ips = eureka.getIpsByName(this.remoteServiceName);
    if (ips && ips.length > 0) {
      const index = Math.floor(Math.random() * ips.length);
      let url = ips[index].homePageUrl;
      if (url.charAt(url.length - 1) === "/") {
        url = url.substring(0, url.length - 1);
      }
      return url;
    }
    return this.defaultServiceUrl;
  }

  async get(path, options = {}) {
    return this.method(path, "GET", options);
  }

  async post(path, options) {
    return this.method(path, "POST", options);
  }

  async method(path, method, options) {
    return this.tracer.scoped(async () => {
      const url = `${this._getUrlByServiceName()}${path}`;
      const wrappedOptions = this.instrumentation.recordRequest(
        options,
        url,
        method
      );
      wrappedOptions.url = url;
      wrappedOptions.method = method;
      const traceId = this.tracer.id;

      try {
        const response = await request(wrappedOptions);
        this.instrumentation.recordResponse(traceId, response.status);
        return response;
      } catch (error) {
        this.instrumentation.recordError(traceId, error);
        throw error;
      }
    });
  }
}

module.exports = tracer => {
  return (remoteServiceName, defaultServiceUrl) => {
    return new ZipkinRequest(tracer, remoteServiceName, defaultServiceUrl);
  };
};
