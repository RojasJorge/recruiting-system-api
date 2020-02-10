'use strict'

const Promise = require('bluebird')
const fs = require('fs')
const Path = require('path')
const helpers = require('../helpers')

const avatar_add = (r, conn, data) => {
  return new Promise((resolve) => {

    const type = data.media.split(';')[0].split('/')[1]
    let imageBase = ''
    let extension = ''

    switch (type) {
      case 'jpeg':
        imageBase = data.media.replace(/^data:image\/jpeg;base64,/, "")
        extension = 'jpg'
        break;
      case 'jpg':
        imageBase = data.media.replace(/^data:image\/jpg;base64,/, "")
        extension = 'jpg'
        break;
      case 'png':
        imageBase = data.media.replace(/^data:image\/png;base64,/, "")
        extension = 'png'
        break;
      default:
        return resolve({
          error: 'File extension not allowed.'
        })
    }

    const filePath = `${Path.join(__dirname, '../public')}/profiles/avatar/${data.entity_id}.${extension}`
    fs.writeFile(filePath, imageBase, 'base64', async err => {
      if (err) resolve({
        error: 'Server error, please try later'
      })

      /**
       * If file was writen
       * Then, update the avatar field on db
       */
      await helpers.system.avatar_updater(r, conn, {
        entity: data.entity_id,
        filename: `${data.entity_id}.${extension}`,
        module: data.module
      })

      resolve({
        success: 'Avatar uploaded successfully.'
      })
    })
  })
}

const avatar_get = (data) => {
  return new Promise((resolve) => {

    const {
      filename
    } = data

    let filePath = `profiles/avatar/default.png`
    if (filename) filePath = `profiles/avatar/${filename}`
    resolve(filePath)
  })
}

module.exports = {
  avatar_add,
  avatar_get
}