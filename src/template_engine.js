const pug = require('pug')

class TemplateEngine {
  constructor () {
    this.generateProfile = pug.compileFile('templates/pug/profile_page_taro_cards.pug')
  }

  getUserProfile (profile_username, profile_displayName, profile_bio) {
    return this.generateProfile({
      username: profile_username,
      displayName: profile_displayName,
      bio: profile_bio
    })
  }
}

module.exports = { TemplateEngine }
