const uploadFile = require('../models/upload_file')
const upload = new uploadFile.UploadFile()

const userDatabase = require('../models/database/user_database')
const userDB = new userDatabase.UserDatabase()
const drinksDatabase = require('../models/database/drinks_database')
const drinksDB = new drinksDatabase.DrinksDatabase()
const tagsDatabase = require('../models/database/tags_database')
const tagsDB = new tagsDatabase.TagsDatabase()


exports.uploadWithId = (req, res) => {
  if (!req.session.loggedin) {
    return false
  }

  const uploadId = req.params.uploadId
  upload.uploadFile(req, res, req.params.uploadType, (path) => {
    switch (req.params.uploadType) {
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

exports.upload = (req, res) => {
  if (!req.session.loggedin) {
    return false
  }

  upload.uploadFile(req, res, req.params.uploadType, (path) => {
    switch (req.params.uploadType) {
      case config.upload.dir.avatarImage:
        userDB.addProfilePicturePathByUID(path, req.session.uid)
        break
      case config.upload.dir.bannerImage:
        userDB.addBannerPathByUID(path, req.session.uid)
        break
      default:
        res.send('uh oh, something went wrong')
    }
  })
}
