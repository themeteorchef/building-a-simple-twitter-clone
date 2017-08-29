import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Pups from './Pups';

Meteor.methods({
  'pups.insert': function pupsInsert(pup) {
    check(pup, Object);
    const pupToInsert = pup;
    pupToInsert.userId = this.userId;
    return Pups.insert(pupToInsert);
  },
  'pups.remove': function pupsInsert(pupId) {
    check(pupId, String);
    return Pups.remove(pupId);
  },
});
