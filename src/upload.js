/**
 * @fileoverview upload_images
 * @package multer, uuidv4, path, fs
 */


const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

/** A class that manages the uploading of files. */
class Upload {
  constructor () {
    fs.readdirSync(path.join(__dirname, `/../uploads`)).forEach(dirs => {
      //custom limits: https://github.com/expressjs/multer#limits
      let storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, path.join(__dirname, `/../uploads/${dirs}`))
        },
        filename: function (req, file, cb) {
          cb(null, uuidv4().toUpperCase() + path.extname(file.originalname))
        }
      })

      this[`${dirs}`] = multer({ storage: storage })
      // console.log(this[`${dirs}`])
    });
  }

  uploadImage (src, file, req, res) {
    if (src in this) {
      // file is the name attribute of <file> element in the form
      let upload = this[`${src}`].single(file)

      upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return false
        } else if (err) {
          // An unknown error occurred when uploading.
          return false
        }

        return true
      })
    }
  }
}

module.exports = { Upload }
