import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { timeago } from '@cleverbeagle/dates';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import './Pup.scss';

class Pup extends React.Component {
  parsePup(pup) {
    return pup
    .replace(/#(\S+)/g, '<a href="/hashtag/$1">#$1</a>')
    .replace(/@(\S+)/g, '<a href="/$1">@$1</a>');
  }

  handleDeletePup(pupId) {
    Meteor.call('pups.remove', pupId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
    });
  }

  render() {
    const { user, pup } = this.props;
    return pup && user ? (<div className="Pup">
      <p className="Pup-user clearfix">
        <strong>{user.profile.name.first} {user.profile.name.last}</strong>
        <Link to={`/${user.username}`}>@{user.username}</Link>
        <span><Link to={`/pups/${pup._id}`}>{timeago(pup.createdAt)}</Link></span>
      </p>
      <p className="Pup-message" dangerouslySetInnerHTML={{ __html: this.parsePup(pup.pup) }} />
      {pup.userId === Meteor.userId() ?
        <Button
          role="button"
          className="Pup-delete"
          onClick={() => this.handleDeletePup(pup._id)}
          bsStyle="link"
        >Delete</Button> : ''}
    </div>) : <div />;
  }
}

Pup.defaultProps = {
  user: {},
};

Pup.propTypes = {
  user: PropTypes.object,
  pup: PropTypes.object.isRequired,
};

export default createContainer(({ pup }) => ({
  user: Meteor.users.findOne(pup && pup.userId),
}), Pup);
