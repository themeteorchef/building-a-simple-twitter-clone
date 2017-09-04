import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';

Slingshot.fileRestrictions('Uploader', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg', 'image/gif', 'image/svg+xml'],
  maxSize: 3 * 1024 * 1024, // 1MB limit (use null for unlimited)
});

Slingshot.createDirective('Uploader', Slingshot.S3Storage, {
  bucket: 'tmc-pupper',
  acl: 'public-read',
  region: 'us-west-2',
  authorize() {
    if (!this.userId) throw new Meteor.Error('need-login', 'You need to be logged in to upload files!');
    return true;
  },
  key(file) {
    return `${this.userId}_${file.name}`;
  },
});
