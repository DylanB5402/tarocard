const pug = require('pug')

class TemplateEngine {
  constructor () {
    this.generateProfile = pug.compileFile('templates/pug/profile.pug')
    this.generateEditPage = pug.compileFile('templates/pug/edit.pug')
    this.generateFriendProfile = pug.compileFile('templates/pug/friendsProfile.pug')
    this.generateFriendProfileRequest = pug.compileFile('templates/pug/friendsProfileRequest.pug')
    this.generateFriendProfilePending = pug.compileFile('templates/pug/friendProfilePending.pug')
    this.generateFriendProfileCurrent = pug.compileFile('templates/pug/friendsProfileCurrent.pug')
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

  getFriendProfile (profileUsername, profileDisplayName, profileBio, numberFriends, numberCards, friendUserID) {
    return this.generateFriendProfile({
      username: profileUsername,
      displayName: profileDisplayName,
      bio: profileBio,
      numFriends: numberFriends,
      numCards: numberCards,
      frienduid: friendUserID
    })
  }

  getFriendProfileRequest (profileUsername, profileDisplayName, profileBio, numberFriends, numberCards, friendUserID) {
    return this.generateFriendProfileRequest({
      username: profileUsername,
      displayName: profileDisplayName,
      bio: profileBio,
      numFriends: numberFriends,
      numCards: numberCards,
      frienduid: friendUserID
    })
  }

  getFriendProfilePending (profileUsername, profileDisplayName, profileBio, numberFriends, numberCards, friendUserID) {
    return this.generateFriendProfilePending({
      username: profileUsername,
      displayName: profileDisplayName,
      bio: profileBio,
      numFriends: numberFriends,
      numCards: numberCards,
      frienduid: friendUserID
    })
  }

  getFriendProfileCurrent (profileUsername, profileDisplayName, profileBio, numberFriends, numberCards, friendUserID) {
    return this.generateFriendProfileCurrent({
      username: profileUsername,
      displayName: profileDisplayName,
      bio: profileBio,
      numFriends: numberFriends,
      numCards: numberCards,
      frienduid: friendUserID
    })
  }
}

module.exports = { TemplateEngine }
