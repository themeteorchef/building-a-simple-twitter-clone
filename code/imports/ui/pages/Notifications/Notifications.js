import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { createContainer } from 'meteor/react-meteor-data';
import Notification from '../../components/Notification/Notification';
import NotificationsCollection from '../../../api/Notifications/Notifications';
import Pups from '../../../api/Pups/Pups';

import './Notifications.scss';

const Notifications = ({ notifications }) => (
  <div className="Notifications">
    <ol>
      {notifications.map(notification =>
        <li key={notification._id}><Notification notification={notification} /></li>,
      )}
    </ol>
  </div>
);

Notifications.propTypes = {
  notifications: PropTypes.array.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('notifications.user');
  const notifications = _.sortBy(NotificationsCollection.find().fetch().map((notification) => {
    notification.pup = Pups.findOne({ _id: notification.metadata.pupId }); // eslint-disable-line
    return notification;
  }), 'date');

  return {
    loading: !subscription.ready(),
    notifications,
  };
}, Notifications);
