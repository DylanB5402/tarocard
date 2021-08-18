const pug = require('pug')

class TemplateEngine {
  constructor () {
    this.generateProfile = pug.compileFile('templates/pug/profile.pug')
    this.generateEditPage = pug.compileFile('templates/pug/edit.pug')
  }

  getUserProfile (profileUsername, profileDisplayName, profileBio, numberFriends, numberCards) {
    return this.generateProfile({
      username: profileUsername,
      displayName: profileDisplayName,
      bio: profileBio,
      numFriends: numberFriends,
      numCards: numberCards
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
