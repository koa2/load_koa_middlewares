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

## Configuration

support 

- config.json
- config.yml 

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