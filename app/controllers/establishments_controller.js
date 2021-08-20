const establishmentsDatabase = require('../models/database/establishments_database')

const establishmentsDB = new establishmentsDatabase.EstablishmentsDatabase()

exports.getAllEstablishments = (req, res) => {
  res.json(establishmentsDB.searchEstablishment(''))
}

exports.searchEstablishments = (req, res) => {
  res.json(establishmentsDB.searchEstablishment(req.params.search))
}

exports.uniqueEstablishments = (req, res) => {
  res.json(establishmentsDB.getUniqueNames())
}

exports.getEstablishment = (req, res) => {
  res.json(establishmentsDB.getEstablishment(req.params.id))
}