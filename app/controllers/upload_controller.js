const uploadFile = require('../models/upload_file')

const upload = new uploadFile.UploadFile()

exports.upload = (req, res) => {
  upload.uploadImage(req.params.uploadType, req.params.uploadType, req, res)
  res.json(req.params)
}