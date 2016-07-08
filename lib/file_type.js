var fs = require('fs')
var path = require('path')

module.exports = function (f) {
  if (!fs.existsSync(f)){
    throw new Error('config file not exist: ' + f)
  }
  
  return path.extname(f)
}