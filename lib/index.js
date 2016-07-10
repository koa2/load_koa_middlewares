'use strict'

const debug = require('debug')('load_koa_middlewares')
const fs = require('fs')
const YAML = require('yamljs')
const middlewares = require('koa_middlewares_with_config')

module.exports = function (file) {
  let config_obj = {}
  let keys = []
  const type = require('./file_type')(file)

  debug(type)

  if (type === '.json' || type === '.js') {
    config_obj = require(file)
  } else if (type === '.yml' || type === '.yaml') {
    config_obj = YAML.load(file);
  } else {
    throw new Error('configuration only support .yaml .yml .json .js')
  }

  for(var key in config_obj){
    keys.push(key)
  }

  debug(config_obj)
  debug(keys)  
  
  return middlewares(keys, config_obj)
}

