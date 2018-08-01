const {
  createNamespace,
  getNamespace,
} = require('cls-hooked');

module.exports = class CLSNodeContext {
  constructor(namespace = 'zipkin') {
    this.session = getNamespace(namespace) || createNamespace(namespace);
    const defaultContext = this.session.createContext();
    this.session.enter(defaultContext);
  }

  setContext(ctx) {
    this.session.set('zipkin', ctx);
  }

  getContext() {
    const currentCtx = this.session.get('zipkin');
    if (currentCtx != null) {
      return currentCtx;
    }
    return null; // explicitly return null (not undefined)
  }

  scoped(callable) {
    let result;
    this.session.run(() => {
      result = callable();
    });
    return result;
  }

  letContext(ctx, callable) {
    return this.scoped(() => {
      this.setContext(ctx);
      return callable();
    });
  }
};
