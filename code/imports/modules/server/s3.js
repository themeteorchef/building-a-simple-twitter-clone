import s3PublicUrl from 'node-s3-public-url';
import { Meteor } from 'meteor/meteor';
import AWS from 'aws-sdk';

AWS.config = new AWS.Config();

AWS.config.accessKeyId = Meteor.settings.AWSAccessKeyId;
AWS.config.secretAccessKey = Meteor.settings.AWSSecretAccessKey;

const s3 = new AWS.S3();

export default {
  deleteFile(file, callback) {
    const sanitizedFileName = s3PublicUrl(file.name);
    const sanitizedUrl = file.url.replace(sanitizedFileName, file.name);

    s3.deleteObject({
      Bucket: 'tmc-pupper',
      Key: sanitizedUrl.replace('https://tmc-pupper.s3-us-west-2.amazonaws.com/', ''),
    }, Meteor.bindEnvironment((error) => {
      if (error) console.warn(error);
      if (!error && callback) callback(file.url);
    }));
  },
};
