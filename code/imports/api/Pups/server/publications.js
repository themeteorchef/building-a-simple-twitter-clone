import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Counts } from 'meteor/tmeasday:publish-counts';
import Pups from '../Pups';

Meteor.publish('pups.username', function pupsUsername(username, limit) {
  check(username, String);
  check(limit, Number);
  const user = Meteor.users.find({ username }, { fields: { username: 1, profile: 1 } });
  const userId = user.fetch()[0]._id;
  Counts.publish(this, `Pups.username.${username}`, Pups.find({ userId }), { noReady: true });

  return [
    user,
    Pups.find({
      userId,
    }, { limit: limit || 50, sort: { createdAt: -1 } }),
  ];
});

Meteor.publish('pups.feed', function pupsFollowing(limit) {
  check(limit, Number);
  const userIds = _.pluck(Meteor.users.find({ followers: { $in: [this.userId] } }).fetch(), '_id');
  userIds.push(this.userId); // Include this user's Pups as well.
  Counts.publish(this, 'Pups.feed', Pups.find({ userId: { $in: userIds } }), { noReady: true });

  return [
    Meteor.users.find({ _id: { $in: userIds } }, { fields: { profile: 1, username: 1 } }),
    Pups.find({
      userId: { $in: userIds },
    }, { limit: limit || 50, sort: { createdAt: -1 } }),
  ];
});

Meteor.publish('pups.hashtag', function pupsUsername(hashtag, limit) {
  check(hashtag, String);
  check(limit, Number);
  const hashtagRegex = new RegExp(`#${hashtag}`, 'i');
  const userIds = _.pluck(Pups.find({ pup: hashtagRegex }).fetch(), 'userId');
  Counts.publish(this, 'Pups.hashtag', Pups.find({ pup: hashtagRegex }), { noReady: true });

  return [
    Meteor.users.find({ _id: { $in: userIds } }, { fields: { profile: 1, username: 1 } }),
    Pups.find({
      pup: hashtagRegex,
    }, { limit: limit || 50, sort: { createdAt: -1 } }),
  ];
});

Meteor.publish('pups.pup', (pupId) => {
  check(pupId, String);
  const pup = Pups.find({ _id: pupId });
  return [
    pup,
    Meteor.users.find({ _id: pup.fetch()[0].userId }),
  ];
});
