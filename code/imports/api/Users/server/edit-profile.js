/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';

let action;

const updateUser = (userId, { emailAddress, profile }) => {
  try {
    Meteor.users.update(userId, {
      $set: {
        'emails.0.address': emailAddress,
        'profile.name': profile.name,
        'profile.biography': profile.biography,
      },
    });
  } catch (exception) {
    action.reject(`[editProfile.updateUser] ${exception}`);
  }
};

const editProfile = ({ userId, profile }, promise) => {
  try {
    action = promise;
    updateUser(userId, profile);
    action.resolve();
  } catch (exception) {
    action.reject(`[editProfile.handler] ${exception}`);
  }
};

export default options =>
new Promise((resolve, reject) =>
editProfile(options, { resolve, reject }));
