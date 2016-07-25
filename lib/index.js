'use strict'

const debug = require('debug')('load_koa_middlewares')
const fs = require('fs')
const YAML = require('yamljs')
const middlewares = require('koa_middlewares_with_config')

module.exports = function (file_or_config) {
  let config_obj = {}
  let keys = []

  if (typeof file_or_config === 'object') {
    config_obj = file_or_config
  } else {
    const type = require('./file_type')(file_or_config)

    debug(type)
    
    if (type === '.json' || type === '.js') {
      config_obj = require(file_or_config)
    } else if (type === '.yml' || type === '.yaml') {
      config_obj = YAML.load(file_or_config);
    } else {
      throw new Error('configuration only support .yaml .yml .json .js')
    }
  }
  
  for(var key in config_obj){
    keys.push(key)
  }

  debug(config_obj)
  debug(keys)  
  
  return middlewares(keys, config_obj)
}

