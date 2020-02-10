'use strict'

/**
 * Import all api routes
 */

module.exports = [].concat(
  require('./main'),
  require('./user'),
  require('./company'),
  require('./job'),
  require('./academic_level')
)