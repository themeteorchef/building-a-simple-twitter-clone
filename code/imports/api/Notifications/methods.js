import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Notifications from './Notifications';

Meteor.methods({
  'notifications.markAsRead': function notificationsMarkAsRead(notificationId) {
    check(notificationId, String);
    return Notifications.update({
      recipient: this.userId,
      _id: notificationId,
    }, { $set: { read: true } });
  },
});
