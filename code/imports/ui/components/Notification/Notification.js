import React from 'react';
import PropTypes from 'prop-types';
import { timeago } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import Pup from '../Pup/Pup';

class Notification extends React.Component {
  componentDidMount() {
    Meteor.call('notifications.markAsRead', this.props.notification._id, (error) => {
      if (error) console.warn(error);
    });
  }

  render() {
    const { notification: { date, message, pup } } = this.props;
    return (<div className="Notification">
      <header className="clearfix">
        <p
          className="Notification-message pull-left"
          dangerouslySetInnerHTML={{ __html: message }}
        />
        <p className="Notification-date pull-right">{timeago(date)}</p>
      </header>
      <Pup pup={pup} />
    </div>);
  }
}

Notification.propTypes = {
  notification: PropTypes.object.isRequired,
};

export default Notification;
