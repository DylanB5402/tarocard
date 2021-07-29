const uploadFile = require('../models/upload_file')

const upload = new uploadFile.UploadFile()

exports.upload = (req, res) => {
  let filePath = upload.uploadFile(req.params.uploadType, req.params.uploadType, req, res)
  if (filePath !== null) {
    res.json(req.params)
  } else {
    res.send("uh oh, something went wrong")
  }
}