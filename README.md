# load_koa_middlewares

load koa 2.x middlewares from configuration

support 

- config.json
- config.yml 

[![NPM version](https://img.shields.io/npm/v/load_koa_middlewares.svg?style=flat-square)](https://www.npmjs.com/package/load_koa_middlewares)

## Install

```
$ npm i -S load_koa_middlewares
```

## Usages

- use file as config
- use obj as config

### use file as config

demo/app2.js

```
const Koa = require('koa');
const app = new Koa();
const path = require('path')

var load_koa_middlewares = require('..')

app.use((ctx, next) => {
  return next().then(() => {
    console.log('hello etag fresh= ' + ctx.fresh)
    if (ctx.fresh) {
      ctx.status = 304;
      ctx.body = null;
    }
  });
})

var config = path.join(__dirname, '../conf.yml')

app.use(load_koa_middlewares(config))

app.use((ctx, next)=>{
  console.log('hello etag fresh= ' + ctx.fresh)
  ctx.body = '<h1>hello etag</h1>'
  // ctx.etag = 'etaghaha';
  console.log('hello etag fresh= ' + ctx.fresh)
})

app.listen(3005);

```

prepare dependencies

```
    "koa": "^2.0.0",
    "koa-etag": "^3.0.0",
    "koa-favicon": "^2.0.0"
```

### use obj as config

demo/app1.js

```
const Koa = require('koa');
const app = new Koa();
const path = require('path')

var load_koa_middlewares = require('..')

app.use((ctx, next) => {
  return next().then(() => {
    console.log('hello etag fresh= ' + ctx.fresh)
    if (ctx.fresh) {
      ctx.status = 304;
      ctx.body = null;
    }
  });
})

var config = {
  "koa-favicon": {
    "path": "sss",
    "options": {
      "maxAge": 1
    }
  },
  "koa-etag":{
    
  }
}
// var config = path.join(__dirname, '../conf.yml')

app.use(load_koa_middlewares(config))

app.use((ctx, next)=>{
  console.log('hello etag fresh= ' + ctx.fresh)
  ctx.body = '<h1>hello etag</h1>'
  // ctx.etag = 'etaghaha';
  console.log('hello etag fresh= ' + ctx.fresh)
})

app.listen(3005);

```

## Configuration

support 

- config.js
- config.json
- config.yml 

### config.js

https://github.com/koa2/koa2-common/blob/master/conf.js

the most powerful configuration.

```
module.exports = { 
  "koa-compress":{
    filter: function (content_type) {
      return /text/i.test(content_type)
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
  },
  "koa-favicon": {
    "path": "sss",
    "options": {
      "maxAge": 1
    }
  },
  "koa-conditional-get":{
    
  },
  "koa-etag":{
    
  }
  
}
```

can be support all js as config

### config.json

```
{
  "koa-favicon": {
    "path": "sss",
    "options": {
      "maxAge": 1
    }
  },
  "koa-etag":{
    
  }
}
```

### config.yml

```
koa-favicon:
  path: "sss"
  options:
    maxAge: 1
koa-etag:
```

## Which project use me?

- https://github.com/koa2/koa2-common

## Similar Project

- https://github.com/krakenjs/kraken-js

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## 版本历史

- v1.0.3 支持文件和Object作为参数
- v1.0.0 初始化版本

## 欢迎fork和反馈

- write by `i5ting` shiren1118@126.com

如有建议或意见，请在issue提问或邮件

## License

this repo is released under the [MIT
License](http://www.opensource.org/licenses/MIT).

