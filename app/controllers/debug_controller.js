const uploadFile = require('../models/upload_file')
const drinksDatabase = require('../models/database/drinks_database')
const tagsDatabase = require('../models/database/tags_database')

const upload = new uploadFile.UploadFile()
const drinksDB = new drinksDatabase.DrinksDatabase()
const tagsDB = new tagsDatabase.TagsDatabase()

const config = require('../config.json')

exports.home = (req, res) => {
  // console.log(req)
  if (req.session.loggedin !== true) {
    res.send('please log in')
  } else {
    res.send('Hello ' + req.session.email)
  }
}

exports.connect = (req, res) => {
  res.send('connected')
}

exports.signout = (req, res) => {
  req.session.email = undefined
  req.session.loggedin = false
  req.session.uid = -1
  res.redirect('/')
}

/// DEBUG - UPLOAD IMAGES ///

exports.upload = (req, res) => {
  const uploadId = req.params.uploadId
  upload.uploadFile(req, res, req.params.uploadType, (path) => {
    switch (req.params.uploadType) {
      case config.upload.dir.avatarImage:

        break
      case config.upload.dir.bannerImage:

        break
      case config.upload.dir.drinksImage:
        if (drinksDB.isExist(uploadId)) {
          const currentPath = drinksDB.getDrink(uploadId).drink_img
          if (drinksDB.addImage(uploadId, path)) {
            upload.deleteFile(currentPath)
          }
        }
        res.send('drinks updated')
        break
      case config.upload.dir.tagsImage:
        if (tagsDB.isExist(uploadId)) {
          const currentPath = tagsDB.getTag(uploadId).tag_img
          if (tagsDB.addImage(uploadId, path)) {
            upload.deleteFile(currentPath)
          }
        }
        res.send('tags updated')
        break
      default:
        res.send('uh oh, something went wrong')
    }
  })
}

exports.drinks = (req, res) => {
  res.send(drinksDB.toString())
}

exports.drinksImages = (req, res) => {
  const img1 = drinksDB.getDrink(1).drink_img
  const img2 = drinksDB.getDrink(2).drink_img
  const img3 = drinksDB.getDrink(3).drink_img
  res.send(`<img src="${img1}"><img src="${img2}"><img src="${img3}">`)
}

exports.drinksReset = (req, res) => {
  drinksDB.resetDb()
  drinksDB.addDrink('drink1')
  drinksDB.addDrink('drink2')
  drinksDB.addDrink('drink3')

  res.send(drinksDB.toString())
}
