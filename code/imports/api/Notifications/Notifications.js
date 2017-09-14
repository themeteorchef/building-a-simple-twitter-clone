import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Notifications = new Mongo.Collection('Notifications');

Notifications.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Notifications.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const NotificationsSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['mention'],
    label: 'What type of notification is this?',
  },
  date: {
    type: String,
    label: 'The date this notification was triggered.',
    autoValue() { // eslint-disable-line
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  sender: {
    type: String,
    label: 'The ID of the user sending this notification.',
  },
  recipient: {
    type: String,
    label: 'The ID of the user receiving this notification.',
  },
  read: {
    type: Boolean,
    label: 'Has the user acknowledged this notification?',
    defaultValue: false,
  },
  message: {
    type: String,
    label: 'The message for this notification.',
  },
  metadata: {
    type: Object,
    label: 'Additional data about the notification.',
    blackbox: true,
  },
});

Notifications.attachSchema(NotificationsSchema);

export default Notifications;
