'use strict'

const _ = require('lodash'),
  Env = require('dotenv').config(),
  Confidence = require('confidence'),
  ToBoolean = require('to-boolean')

const pack = require('./package')

const config = {
  $meta: 'This file defines all configuration for project.',
  name: pack.name,
  version: pack.version,
  description: pack.description,
  api_base_path: '/api/v1',
  api_key: 'pc6N3T8RXDgFLcd9YRykSustCAauilqO3P1/oqVpME1+shnqpAPPJpioWmt1Bdk9a0nftnjRf+ibIH/RsM5ZDJfAESkONsWeQufL99bukjvvIe+RfHUFlombq8f+BTGzLqlxauFH0xCPM7JTX8RmLxRZ5V7/GV3O1qUFf72oJopK73ShwvMr1AYMrXkSUGpLapvJnZ6Jl8acQ9dWWd0BSldvqLRkwnLHJepY+mYkjKA1cSEsi8FGbSivxWFNLDLyiXa/SRKdJa68cXAASc7UdzUynXqcG7jQ7+bj75+U30N8dW3POzwvqDCUQhbuykg2g3tt4uoBJ8/fCZV/oRYAcA==',
  api_secret: 'T5gS4M4p+B6y68MT8FegENz2A4vxPeFQE7vunnK0DL92gKm3JPEB1Dga212NwA12Mt1C+G6jZgNTSR0ClHBhUne7WyPgDS3bDUjJXXZzoEzolilSd480jakrX5XkEHkhQ4eqcQY2j/ISj704LLN3ithOc81GIDA+Zw6jR64B6AmKXyC2AqlO06aV4xbYQevR5dkqZsJPYhxoBJRTisEDcm2f4XkkgoxcqcLULKuS3HpXCiWwRGtfFH+1xGoHD24ncG1h1gP9uU9GmfaMJuUpPt0RFoRD3sbrs+htRK8helVfqv/N9vogTIkakhEUgAg3AVjOfnnx8NSJ1YXBjsWSTQ==',
  app: {
    host: process.env.APP_HOST || 'https://staging.umana.co',
    port: process.env.APP_PORT || 3028,
    secure: process.env.APP_HTTPS || false,
  },
  db: {
    name: 'umana'
  },
  logger: {
    options: {
      console: ToBoolean(_.defaultTo(process.env.LOGGER_DEBUG, true))
    }
  }
}

const store = new Confidence.Store(config),
  criteria = {
    env: process.env.APP_ENV
  }

module.exports = {
  get: key => store.get(key, criteria),
  meta: key => store.meta(key, criteria)
}