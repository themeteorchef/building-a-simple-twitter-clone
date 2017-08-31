import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import Pups from '../Pups';

Meteor.publish('pups.username', (username) => {
  check(username, String);
  const user = Meteor.users.find({ username }, { fields: { username: 1, profile: 1 } });
  return [
    user,
    Pups.find({ userId: user.fetch()[0]._id }, { limit: 50, sort: { createdAt: -1 } }),
  ];
});

Meteor.publish('pups.feed', function pupsFollowing() {
  const userIds = _.pluck(Meteor.users.find({ followers: { $in: [this.userId] } }).fetch(), '_id');
  userIds.push(this.userId); // Include this user's Pups as well.
  return [
    Meteor.users.find({ _id: { $in: userIds } }, { fields: { profile: 1, username: 1 } }),
    Pups.find({ userId: { $in: userIds } }, { limit: 50, sort: { createdAt: -1 } }),
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
