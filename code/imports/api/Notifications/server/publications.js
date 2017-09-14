import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { _ } from 'meteor/underscore';
import Notifications from '../Notifications';
import Pups from '../../Pups/Pups';

Meteor.publish('notifications.userCount', function notificationsUser() {
  Counts.publish(
    this,
    'notifications.userCount',
    Notifications.find({ recipient: this.userId, read: false }),
  );
  return this.ready();
});

Meteor.publish('notifications.user', function notificationsUser() {
  const notifications = Notifications.find({ recipient: this.userId }, { sort: { createdAt: -1 } });
  const pupIds = notifications.fetch().map(notification => notification.metadata.pupId);
  const pups = Pups.find({ _id: { $in: pupIds } });

  return [
    notifications,
    pups,
    Meteor.users.find({ _id: { $in: _.pluck(pups.fetch(), 'userId') } }),
  ];
});
