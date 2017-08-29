import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import Pups from '../Pups';

Meteor.publish('pups.username', function pupsUsername(username) {
  check(username, String);
  const user = Meteor.users.findOne({ username });
  return Pups.find({ userId: user._id }, { limit: 50, sort: { createdAt: -1 } });
});

Meteor.publish('pups.feed', function pupsFollowing() {
  const userIds = _.pluck(Meteor.users.find({ followers: { $in: [this.userId] } }).fetch(), '_id');
  userIds.push(this.userId); // Include this user's Pups as well.
  return [
    Meteor.users.find({ _id: { $in: userIds } }, { fields: { profile: 1, username: 1 } }),
    Pups.find({ userId: { $in: userIds } }, { limit: 50, sort: { createdAt: -1 } }),
  ];
});

Meteor.publish('pups.pup', function pupsPup(pupId) {
  check(pupId, String);
  return Pups.find({ _id: pupId });
});
