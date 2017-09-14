import { Meteor } from 'meteor/meteor';
import Notifications from '../../api/Notifications/Notifications';

const sendNotification = (userToNotify, { _id, username }, pupId) =>
Notifications.insert({
  type: 'mention',
  sender: _id,
  recipient: userToNotify._id,
  message: `<a href="/${username}">@${username}</a> mentioned you in a Pup`,
  metadata: {
    pupId,
  },
});

const getUserFromUsername = username => Meteor.users.findOne({ username });

const sendNotifications = (usernames, triggeringUser, pupId) => {
  const sanitizedUsernames = usernames.map(username => username.replace('@', ''));
  sanitizedUsernames.forEach((username) => {
    const userToNotify = getUserFromUsername(username);
    if (userToNotify) sendNotification(userToNotify, triggeringUser, pupId);
  });
};

const getAtMentions = ({ pup }) => pup.match(/@([a-zA-Z1-9-_]+)/g);

export default (pup, triggeringUser) => {
  const mentions = getAtMentions(pup);
  if (mentions.length > 0) sendNotifications(mentions, triggeringUser, pup._id);
};
