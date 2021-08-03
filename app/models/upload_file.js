/**
 * @fileoverview upload_images
 * @package multer, uuidv4, path, fs
 */

const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const fs = require('fs')
const config = require('../config.json').upload

/** A class that manages the uploading of files. */
class UploadFile {
  constructor () {
    fs.readdirSync(path.join(`${config.expressStaticDir}/${config.uploadPath}`),
      { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory()).map(dirent => dirent.name)
      .forEach(type => {
        fs.readdirSync(path.join(`${config.expressStaticDir}/${config.uploadPath}/${type}`))
          .forEach(dirs => {
          // custom limits: https://github.com/expressjs/multer#limits
            const storage = multer.diskStorage({
              destination: function (req, file, cb) {
                cb(null, path.join(`${config.expressStaticDir}/${config.uploadPath}/${type}/${dirs}`))
              },
              filename: function (req, file, cb) {
                cb(null, uuidv4().toUpperCase() + path.extname(file.originalname))
              }
            })

            this[`${dirs}`] = {}
            this[`${dirs}`].upload = multer({ storage: storage })
            this[`${dirs}`].type = type
            // console.log(this[`${dirs}`])
          })
      })
  }

  /**
     *
     * @param {*} req http request
     * @param {*} res http response
     * @param {String} type upload type
     * @return {callback} function which adds image src to db
     */
  uploadFile (req, res, type, callback) {
    if (type in this) {
      const upload = this[`${type}`].upload.single(config.formFileName)

      upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return null
        } else if (err) {
          // An unknown error occurred when uploading.
          return null
        }

        // Check File Extension
        if (!this.checkFileType(req.file, this[`${type}`].type)) {
          fs.unlinkSync(req.file.path)
          return null
        } else if (!fs.existsSync(req.file.path)) {
          // Make sure the file has been created
          return null
        } else {
          // Obtain path without static (for purposes of website display)
          const relativePath = req.file.path.substring(
            req.file.path.indexOf(config.expressStaticDir) + config.expressStaticDir.length)

          console.log(relativePath)
          return callback(relativePath)
        }
      })
    }
  }

  /**
     *
     * @param {String} path the path stored in the db
     */
  deleteFile (path) {
    if (path.length > 0 && fs.existsSync(`${config.expressStaticDir}/${path}`)) {
      fs.unlinkSync(`${config.expressStaticDir}/${path}`)
    }
  }

  /**
     *
     * @param {String} file the path of the file (given from multer req.file)
     * @param {String} type the type of file that we are uploading (images, text)
     * @return {Boolean} true if the file is the correct type, false if not
     */
  checkFileType (file, type) {
    // Allowed extensions
    const typeFormatted = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    const filetypes = new RegExp(config[`allowedExt${typeFormatted}`], 'i')

    // Check extension
    const ext = filetypes.test(path.extname(file.originalname).toLowerCase())

    // Check mime
    const mime = filetypes.test(file.mimetype)

    if (mime && ext) {
      return true
    } else {
      return false
    }
  }
}

module.exports = { UploadFile }
