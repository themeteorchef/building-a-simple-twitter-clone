import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Slingshot } from 'meteor/edgee:slingshot';
import { Bert } from 'meteor/themeteorchef:bert';
import uploadToS3 from '../../../modules/upload-to-s3';
import Progress from '../Progress/Progress';

import './Uploader.scss';

class Uploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
      uploadProgress: 0,
    };

    this.calculateProgress = this.calculateProgress.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  calculateProgress() {
    this.uploadComputation = Tracker.autorun(() => {
      const uploadProgress = Math.round(this.upload.progress() * 100);
      if (!isNaN(uploadProgress)) this.setState({ uploadProgress });
    });
  }

  handleUpload(event) {
    this.upload = new Slingshot.Upload('Uploader');
    this.calculateProgress();
    const file = event.target.files[0];

    uploadToS3(this, file)
    .then((url) => {
      this.uploadComputation.stop();
      Meteor.call(this.props.method, { url, name: `${Meteor.userId()}_${file.name}` }, (error) => {
        if (error) {
          this.setState({ isUploading: false, uploadProgress: 0 });
          Bert.alert(error.reason, 'danger');
        }

        if (!error && this.state.uploadProgress === 100) {
          setTimeout(() => { this.setState({ isUploading: false, uploadProgress: 0 }); }, 500);
          Bert.alert('File uploaded!', 'success');
        }
      });
    })
    .catch((error) => {
      this.setState({ isUploading: false, uploadProgress: 0 });
      Bert.alert(error.reason, 'danger');
    });
  }

  render() {
    return (<div className="Uploader">
      {
        this.state.isUploading ?
          <Progress bottom={this.state.uploadProgress} top={100} /> :
          <div>
            <input
              onChange={this.handleUpload}
              type="file"
              name="Uploader"
            />
            <p><i className="fa fa-cloud-upload" /> <span>Click or Drop a Photo to Upload</span></p>
          </div>
      }
    </div>);
  }
}

Uploader.propTypes = {
  method: PropTypes.string.isRequired,
};

export default Uploader;
