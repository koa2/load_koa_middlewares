# 如何编写声明式的Koa 2.x中间件

## 痛点

比如https://github.com/koajs/favicon/tree/v2.x

```
const Koa = require('koa');
const favicon = require('koa-favicon');
const app = new Koa();

app.use(favicon(__dirname + '/public/favicon.ico'));
```


### API

#### favicon(path, [options])

Returns a middleware serving the favicon found on the given `path`.

##### options

- `maxAge` cache-control max-age directive in ms, defaulting to 1 day.



> 如果非常多的中间件。。。。就会又臭又长

## 更好的解决方式

把参数变成配置，改成声明式的，不是就非常简单了么？

比如定义 config.json

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

然后app.js

```
const Koa = require('koa');
const app = new Koa();
const path = require('path')
const load_koa_middlewares = require('load_koa_middlewares')

const config = path.join(__dirname, '../conf.yml')

app.use(load_koa_middlewares(config))


app.listen(3005);

```

这样是不是可以非常简单的实现，无论你有多少中间件，写到配置文件里就好了

## 如何实现load_koa_middlewares呢？

1. 如何把参数，变成json配置，即调用函数使用配置，而不是使用参数
1. 调用模块（node module）函数使用配置，而不是使用参数
1. 把Koa 2.x的多个中间件合并，然后app.use，这样才比较方便，即load Koa 2.x middlewares with config
1. 简化koa_middlewares_with_config，直接读取配置文件就好，更简单点

### 调用函数使用配置，而不是使用参数

比如favicon函数

```
function favicon(path, options){
  console.log('favicon = ' + JSON.stringify(arguments));
  console.log('favicon path= ' + path)
  console.dir(options)

  return JSON.stringify(arguments)
}
```

参数是`path, options`

调用的时候

```
favicon('./s.ico')

favicon('./s.ico', {
  
})
```

无论如何，第一个参数是path，第二个参数是options。

那问题就简单了

```
favicon.apply(null, ['./s.ico'])

favicon.apply(null, ['./s.ico', {

}])
```

剩下的就是正则处理的事儿。见https://github.com/i5ting/call_with_config/tree/v2

关于api设计

> call_with_config(key, config, cumtomKey)

- key = module name or local module
- config for param
- if cumtomKey exist, load config from config[cumtomKey]

```
var call_with_config = require('.')

var r = call_with_config('./favicon', {
  './favicon':{
    'path': 'sss'
  },
  'empty-favicon':{
    
  }
}, 'empty-favicon');

console.dir(r.toString())
```

'./favicon'是key，如果有自定义的key，那么就从config[‘empty-favicon’]里加载

or

```
var call_with_config = require('.')

var r = call_with_config('koa-favicon', {
  'koa-favicon':{
    'path': 'sss',
    'options': {
      'maxAge': 1
    }
  }
});

console.dir(r.toString())

```

'koa-favicon'是key，如果没有自定义的key，那么就从config[key]里加载

这样就可以非常灵活了。


### 调用模块（node module）函数使用配置，而不是使用参数


```
var conf = {
  'koa-favicon': {
    'path': 'sss',
    'options': {
      'maxAge': 1
    }
  },
  'koa-etag':{
    
  }
}


var call_module_with_config = require('call_module_with_config')

// call('./favicon', conf, true)

call_module_with_config(['koa-favicon', 'koa-etag'], conf)
```

模块如'koa-favicon', 'koa-etag'，如果要是一个，内部会自动转成数据。

核心逻辑还是上面的call_with_config模块。

这样做的好处是把模块和配置结合在一起了。可以随意组合


### 把Koa 2.x的多个中间件合并，然后app.use，这样才比较方便

解决了函数和模块与配置的关系，剩下的就是如何和koa 2.x结合。

koa的中间件基本都是独立模块，独立模块和配置之间已经在上一步解决了。

```
app.use([a,b])
```

koa中的use支持单个或多个中间件，为了简便，把我们加载的多个中间件的结果转成一个中间件，这样用的人才更简单。

这其实是koa-compose的用途。

所以这里主要是集成compose模块

```
const debug = require('debug')('koa_middlewares_with_config')
const compose = require('koa-compose')
const call_module_with_config = require('call_module_with_config')

module.exports = function (arr, conf) {
  var middlewares = call_module_with_config(arr, conf)
  debug('middlewares = %s' + middlewares)
  return compose(middlewares)
}
```

用法如下

```
var conf = {
  'koa-favicon': {
    'path': 'sss',
    'options': {
      'maxAge': 1
    }
  },
  'koa-etag':{
    
  }
}

var middlewares = require('koa_middlewares_with_config')(['koa-favicon', 'koa-etag'], conf)

app.use(middlewares)
```

可是你不觉得，这样写起来还是太麻烦么？明明['koa-favicon', 'koa-etag']里的内容在配置里都有，为什么还要再写一遍呢？还容易出错，是不是傻？

### 简化koa_middlewares_with_config，直接读取配置文件就好，更简单点

通过读取配置文件（json或yml），找出配置的keys，即

```
var conf = {
  'koa-favicon': {
    'path': 'sss',
    'options': {
      'maxAge': 1
    }
  },
  'koa-etag':{
    
  }
}

```

keys = ['koa-favicon', 'koa-etag']

剩下不就是

```
var keys = ['koa-favicon', 'koa-etag']
var middlewares = require('koa_middlewares_with_config')(keys, conf)

app.use(middlewares)
```

这样就可以推导出

config.json 

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

具体用法

```
var load_koa_middlewares = require('load_koa_middlewares')

var config = path.join(__dirname, '../conf.json')

app.use(load_koa_middlewares(config))
```

这样就是最终用法

- load_koa_middlewares(config)返回的compose的koa 2.x中间件
- 然后app.use即可，至于use位置可以按需定制
- 其他一切中间件都在配置文件里

有木有觉得有点意思了么？

其实配置还是有很多，比如yaml，toml等，这里yaml可以非常转成json对象，所以集成yaml就是几分钟的事儿

```
config_obj = YAML.load(file);
```

至此就完成了所有设计。

## 总结

中间件定义

```
 favicon(path, [options])
```

- 参数必须一致，path和options必须一样
- 配置的key必须模块名称，比如koa-favicon

这样是有点也是缺点。还好的是目前的koa的插件写的还好，命名等都比较规范，大家自己写插件的时候也尽量规范就好。

这里举例只是加载某些中间件，那么能不能分组，在app.js里随处use呢？大家自己发挥吧。
