import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Pups from '../Pups';
import unfurlUrls from '../../../modules/server/unfurl-urls';
import determineNotification from '../../../modules/server/determine-notification';

Meteor.methods({
  'pups.insert': function pupsInsert(pup) {
    check(pup, Object);
    const pupToInsert = pup;
    pupToInsert.userId = this.userId;
    return unfurlUrls(pupToInsert.pup)
    .then((metadata) => {
      if (metadata) pupToInsert.metadata = metadata;
      const pupId = Pups.insert(pupToInsert);
      determineNotification(Pups.findOne(pupId), Meteor.users.findOne(this.userId));
    })
    .catch((error) => {
      throw new Meteor.Error('500', `${error}`);
    });
  },
  'pups.repup': function pupsInsert(pupId) {
    check(pupId, String);
    const originalPup = Pups.findOne(pupId);

    if (originalPup) {
      const originalPupUser = Meteor.users.findOne({
        _id: originalPup.userId,
      }, { fields: { username: 1, profile: 1 } });

      return Pups.insert({
        userId: this.userId,
        // Strap in: if the user is repupping a repup, just use the original repup data.
        repup: originalPup.repup || {
          user: {
            username: originalPupUser.username,
            profile: originalPupUser.profile,
          },
          _id: originalPup._id,
          createdAt: originalPup.createdAt,
          pup: originalPup.pup,
          metadata: originalPup.metadata,
        },
      });
    }

    throw new Meteor.Error('500', 'A pup with that _id could not be found :(');
  },
  'pups.remove': function pupsInsert(pupId) {
    check(pupId, String);
    return Pups.remove(pupId);
  },
});
