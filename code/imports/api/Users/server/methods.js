import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import editProfile from './edit-profile';
import rateLimit from '../../../modules/rate-limit';

Meteor.methods({
  'users.sendVerificationEmail': function usersResendVerification() {
    return Accounts.sendVerificationEmail(this.userId);
  },
  'users.editProfile': function usersEditProfile(profile) {
    check(profile, {
      emailAddress: String,
      profile: {
        name: {
          first: String,
          last: String,
        },
      },
    });

    return editProfile({ userId: this.userId, profile })
    .then(response => response)
    .catch((exception) => {
      throw new Meteor.Error('500', exception);
    });
  },
  'users.checkFollower': function usersCheckFollower(username) {
    check(username, String);
    return !!Meteor.users.findOne({ username, followers: { $in: [this.userId] } });
  },
  'users.followUnfollow': function usersFollowUnfollow(username) {
    check(username, String);
    const alreadyFollowing = Meteor.users.findOne({ username, followers: { $in: [this.userId] } });

    if (alreadyFollowing) {
      Meteor.users.update({ username }, { $pull: { followers: this.userId } });
      return false;
    }

    Meteor.users.update({ username }, { $addToSet: { followers: this.userId } });
    return true;
  },
});

rateLimit({
  methods: [
    'users.sendVerificationEmail',
    'users.editProfile',
    'users.followUnfollow',
  ],
  limit: 5,
  timeRange: 1000,
});
