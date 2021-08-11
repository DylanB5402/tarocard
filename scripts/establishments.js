require('dotenv').config()
const Database = require('better-sqlite3')
const yelp = require('yelp-fusion')

const client = yelp.client(process.env.YELP_API_KEY)
const config = require('../app/config.json').yelp
const categories = require('./categories.json')

const establishmentsDatabase = require('../app/models/database/establishments_database')
const establishmentsDb = new establishmentsDatabase.EstablishmentsDatabase()
establishmentsDb.resetDb()

const tags = config.tags
let obtainedCategories = []

console.log(tags)

tags.forEach((tag) => {
  console.log(`Searching Categories For Entries In ${config.parent} Containing The Value ${tag}`)
  categories.forEach((category) => {
    if (category.alias.includes(tag) && category.parents.includes(config.parent)) {
      console.log(`Found Applicable Tag: ${category.alias}`)
      if (!obtainedCategories.includes(category.alias)) obtainedCategories.push(category.alias)
    }
  })
})

console.log(`Performing Yelp Search On: [${obtainedCategories}]`)

// Recursive search
let search = (categories, idx, location, offset, rate, added) => {
  client.search({
    categories: categories[idx],
    location: location,
    limit: 50,
    offset: offset,
    sort_by: 'best_match'
  }).then(response => {
    console.log(`Looking at: [${categories[idx]}]`)

    response.jsonBody.businesses.forEach((business) => {
      let establishment = {
        id: business.id,
        name: business.name,
        alias: business.alias,
  
        phone: business.phone,
        display_phone: business.display_phone,
  
        review_count: business.review_count,
        rating: business.rating,
  
        address1: business.location.address1,
        address2: business.location.address2,
        address3: business.location.address3,
        city: business.location.city,
        zip_code: business.location.zip_code,
        country: business.location.country,
        state: business.location.state,
  
        price: business.price,
        img: business.image_url
      }
  
      if (!establishmentsDb.isExist(business.id)) {
        establishmentsDb.addEstablishment(establishment)
        console.log(`Establishment: id(${establishment.id}) name(${establishment.name}) added to database`)
        added++
      } else {
        establishmentsDb.editEstablishment(establishment.id, establishment)
        console.log(`Establishment: id(${establishment.id}) name(${establishment.name}) edited in database`)
      }
    })

    // https://www.yelp.com/developers/documentation/v3/business_search
    // Max 1000 results from offset, timeout to avoid rate-limit
    if (offset+50 < response.jsonBody.total && offset < 1000) {
      setTimeout(function(){search(categories, idx, location, offset+50, rate, added)}, rate)
    } else {
      // Move to the next category
      if (idx < categories.length-1) {
        setTimeout(function(){search(categories, idx+1, location, 0, rate, added)}, rate)
      } else {
        // Finished
        console.log(`Search Completed, ${added} Entries Added To Database`)
      }
    }
  }).catch(e => {
    console.log(e)
  })
}

// Run Recursive Function
if (obtainedCategories.length > 0) {
  search(obtainedCategories, 0, config.location, 0, config.rate, 0)
}

