import seeder from '@cleverbeagle/seeder';
import faker from 'faker';
import { Meteor } from 'meteor/meteor';
import Pups from '../../api/Pups/Pups';

const pupsSeed = userId => ({
  collection: Pups,
  environments: ['development', 'staging'],
  noLimit: true,
  modelCount: 20,
  model(dataIndex) {
    return {
      userId,
      pup: `This is a test Pup #${dataIndex + 1} and #these #are #hashtags and @admin mentions.`,
    };
  },
});

seeder(Meteor.users, {
  environments: ['development', 'staging'],
  noLimit: false,
  data: [{
    username: 'admin',
    email: 'admin@admin.com',
    password: 'password',
    profile: {
      name: {
        first: 'Andy',
        last: 'Warhol',
      },
    },
    roles: ['admin'],
    data(userId) {
      return pupsSeed(userId);
    },
  }],
  modelCount: 5,
  model(index) {
    const userCount = index + 1;
    return {
      username: faker.internet.userName(),
      email: `user+${userCount}@test.com`,
      password: 'password',
      profile: {
        name: {
          first: faker.name.firstName(),
          last: faker.name.lastName(),
        },
      },
      roles: ['user'],
      data(userId) {
        return pupsSeed(userId);
      },
    };
  },
});
