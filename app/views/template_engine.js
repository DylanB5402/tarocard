const pug = require('pug')

class TemplateEngine {
  constructor () {
    this.generateProfile = pug.compileFile('templates/pug/profile_page_taro_cards.pug')
  }

  getUserProfile (profileUsername, profileDisplayName, profileBio) {
    return this.generateProfile({
      username: profileUsername,
      displayName: profileDisplayName,
      bio: profileBio
    })
  }
}

module.exports = { TemplateEngine }
