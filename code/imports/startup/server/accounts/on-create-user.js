import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  const userToCreate = user;
  if (options.profile) userToCreate.profile = options.profile;
  userToCreate.followers = []; // Followers will be added removed from Meteor user object directly.
  return userToCreate;
});
