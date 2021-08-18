const uploadFile = require('../models/upload_file')

const upload = new uploadFile.UploadFile()

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
