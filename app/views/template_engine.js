const pug = require('pug')

class TemplateEngine {
  constructor () {
    this.generateProfile = pug.compileFile('templates/pug/profile_page_taro_cards.pug')
    this.generateEditPage = pug.compileFile('templates/pug/edit.pug')
  }

  getUserProfile (profileUsername, profileDisplayName, profileBio, numberFriends) {
    return this.generateProfile({
      username: profileUsername,
      displayName: profileDisplayName,
      bio: profileBio,
      numFriends: numberFriends
    })
  }

  getEditProfilePage (profileUsername, profileDisplayName, profileBio) {
    return this.generateEditPage({
      username: profileUsername,
      displayName: profileDisplayName,
      bio: profileBio
    })
  }
}

module.exports = { TemplateEngine }
