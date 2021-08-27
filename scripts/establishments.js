require('dotenv').config()
const yelp = require('yelp-fusion')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const client = yelp.client(process.env.YELP_API_KEY)
const config = require('../app/config.json').yelp
const categories = require('./categories.json')

const establishmentsDatabase = require('../app/models/database/establishments_database')
const establishmentsDb = new establishmentsDatabase.EstablishmentsDatabase()

const categoryFilter = (useParent) => {
  const obtainedCategories = []
  const tags = config.tags

  if (useParent) {
    console.log(`Searching Categories For Entries In ${config.parent}`)
    categories.forEach((category) => {
      if (category.parents.includes(config.parent)) {
        console.log(`Found Applicable Tag: ${category.alias}`)
        if (!obtainedCategories.includes(category.alias)) obtainedCategories.push(category.alias)
      }
    })
  } else {
    tags.forEach((tag) => {
      console.log(`Searching Categories For Entries In ${config.parent} Containing The Value ${tag}`)
      categories.forEach((category) => {
        if (category.alias.includes(tag) && category.parents.includes(config.parent)) {
          console.log(`Found Applicable Tag: ${category.alias}`)
          if (!obtainedCategories.includes(category.alias)) obtainedCategories.push(category.alias)
        }
      })
    })
  }

  return obtainedCategories
}

// Recursive search
const search = (categories, idx, location, offset, rate, added) => {
  client.search({
    categories: categories[idx],
    location: location,
    limit: 50,
    offset: offset,
    sort_by: 'best_match'
  }).then(response => {
    console.log(`Looking at: [${categories[idx]}]`)

    response.jsonBody.businesses.forEach((business) => {
      const establishment = {
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

      if (establishmentsDb.isExist(business.id)) {
        establishmentsDb.editEstablishment(establishment.id, establishment)
        console.log(`Establishment: id(${establishment.id}) name(${establishment.name}) edited in database`)
      }

      if (!establishmentsDb.nameExists(establishment.name)) {
        establishmentsDb.addEstablishment(establishment)
        console.log(`Establishment: id(${establishment.id}) name(${establishment.name}) added to database`)
        added++
      }
    })

    // https://www.yelp.com/developers/documentation/v3/business_search
    // Max 1000 results from offset, timeout to avoid rate-limit
    if (offset + 50 < response.jsonBody.total && offset < 1000) {
      setTimeout(function () { search(categories, idx, location, offset + 50, rate, added) }, rate)
    } else {
      // Move to the next category
      if (idx < categories.length - 1) {
        setTimeout(function () { search(categories, idx + 1, location, 0, rate, added) }, rate)
      } else {
        // Finished
        console.log(`Search Completed, ${added} Entries Added To Database`)
        return process.exit()
      }
    }
  }).catch(e => {
    console.log(e)
  })
}

const run = () => {
  if (process.env.YELP_API_KEY === undefined) {
    console.log('Error: Undefined YELP_API_KEY')
    console.log('---PLEASE FOLLOW THESE STEPS---')
    console.log('Create a .env file in the root directory')
    console.log('Add this text into the .env file:')
    console.log('YELP_API_KEY=(YOUR API KEY HERE)')
    console.log('You can obtain an api key through yelp developer portal')
    return process.exit()
  }

  console.log('---Resetting Esablishments DB---')
  establishmentsDb.resetDb()

  console.log('---Obtaining User Input---')
  console.log('Please Choose A Search Method:')
  console.log(`[1]: Search for establishments under specified tags ${config.tags} in config.json (under parent directory ${config.parent})`)
  console.log(`[2]: Search for all establishments under tags in parent directory ${config.parent}`)
  console.log('[3]: Use Default Setting')
  readline.question('Would you like to search for? [1/2/3]: ', resp => {
    let useParent = config.useParent
    switch (parseInt(resp)) {
      case 1:
        console.log('Option 1 Selected...')
        useParent = false
        break
      case 2:
        console.log('Option 2 Selected...')
        useParent = true
        break
      default:
        console.log('Using Default Parameters...')
        useParent = config.useParent
        break
    }

    const obtainedCategories = categoryFilter(useParent)
    // Run Recursive Function
    if (obtainedCategories.length > 0) {
      console.log(`---Performing Yelp Search On: [${obtainedCategories}]---`)
      search(obtainedCategories, 0, config.location, 0, config.rate, 0)
    }
  })
}

run()
