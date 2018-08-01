
## simple feign 工具
集成eureka，zipkins等功能  

### 安装
依赖[js-eureka-client-springcloud](https://github.com/fatshaw/js-eureka-springcloud)

```
npm install js-feign
```

## sails中使用

1. 初始化
```
// util/zipkin.js

const feign = require('js-feign');

const {zipkin, tracer, zipkinRequest} = feign('http://zipkin.com')

module.exports = { zipkin, tracer, zipkinRequest };

```

2. http中间件  

```
config/http.js

const {
  zipkin,
} = require('util/zipkin.js');


module.exports.http = {
  middleware: {
    order: [
      'cookieParser',
      'session',
      'bodyParser',
      'requestLogger',
      'zipkinMiddleware'
      'compress',
      'poweredBy',
      'router',
      'www',
      'favicon',
    ],
    zipkinMiddleware,
  },
};

```


3.远程调用  
集成eureka,随机负载均衡，没有做重试操作

```
//service/xxxService.js
const {
  zipkinRequest,
} = require('util/zipkin.js');

const {
  xxxServiceConf,
} = config;

/* 
  xxxServiceConf.name：eureka中注册的服务名称
  anixxxServiceConfuServiceConf.url: 如果本地开发，服务没有注册eureka，可以不走eureka访问，通过url访问
  eg. xxxServiceConf.name=xxx-service-app-dev
      xxxServiceConf.url=http://eureka.com/api/xxx-service-app-dev
*/ 
const request = zipkinRequest(xxxServiceConf.name, xxxServiceConf.url);

// request的使用和普通axio相同，如
const { data } = await request.post('/v1/diagnose',{
  content,
  isVip,
});

```
