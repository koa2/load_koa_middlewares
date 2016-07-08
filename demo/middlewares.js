'use strict'

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

module.exports = require('.')(['koa-favicon', 'koa-etag'], conf)
