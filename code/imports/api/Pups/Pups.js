import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Pups = new Mongo.Collection('Pups');

Pups.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Pups.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const PupsSchema = new SimpleSchema({
  userId: {
    type: String,
    label: 'The ID of the user that created this pup.',
  },
  createdAt: {
    type: String,
    label: 'The date this pup was posted.',
    autoValue() { // eslint-disable-line
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  pup: {
    type: String,
    label: 'The pup.',
    max: 140,
    min: 1,
  },
});

Pups.attachSchema(PupsSchema);

export default Pups;
