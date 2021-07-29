/**
 * @fileoverview upload_images
 * @package multer, uuidv4, path, fs
 */


const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const config = require('../config.json')

/** A class that manages the uploading of files. */
class UploadFile {
  constructor () {
    fs.readdirSync(path.join(`uploads`), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory()).map(dirent => dirent.name)
      .forEach(type => {
      fs.readdirSync(path.join(`uploads/${type}`)).forEach(dirs => {
        //custom limits: https://github.com/expressjs/multer#limits
        let storage = multer.diskStorage({
          destination: function (req, file, cb) {
            cb(null, path.join(`uploads/${type}/${dirs}`))
          },
          filename: function (req, file, cb) {
            cb(null, uuidv4().toUpperCase() + path.extname(file.originalname))
          }
        })

        this[`${dirs}`] = {}
        this[`${dirs}`].upload = multer({ storage: storage })
        this[`${dirs}`].type = type
        // console.log(this[`${dirs}`])
      });
    });
  }

  uploadFile (src, file, req, res) {
    if (src in this) {
      // file is the name attribute of <file> element in the form
      let upload = this[`${src}`].upload.single(file)

      upload(req, res, (err) => {
        if (!this.checkFileType(req.file, this[`${src}`].type)) {
          fs.unlinkSync(req.file.path)
          return null
        }
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return null
        } else if (err) {
          // An unknown error occurred when uploading.
          return null
        }

        return req.file.path
      }) 
    }
    return null
  }

  checkFileType (file, type) {
    // Allowed extensions
    const filetypes = new RegExp(config[`allowed-ext-${type}`], 'i')

    // Check extension
    const ext = filetypes.test(path.extname(file.originalname).toLowerCase());

    // Check mime
    const mime = filetypes.test(file.mimetype);

    if(mime && ext){
      return true
    } else {
      return false
    }
  }
}

module.exports = { UploadFile }
