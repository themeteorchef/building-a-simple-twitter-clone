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
  handleDeletePup(pupId) {
    Meteor.call('pups.remove', pupId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
    });
  }

  setAtMentionsAndHashtags(pup) {
    return pup
    .replace(/@([a-zA-Z1-9]+)/g, '<a href="/$1">@$1</a>') // @mentions
    .replace(/#([a-zA-Z1-9]+)/g, '<a href="/hashtag/$1">#$1</a>'); // #hashtags
  }

  render() {
    const { user, pup } = this.props;
    return pup && user && user.profile ? (<div className="Pup">
      <p className="Pup-user clearfix">
        <strong>{user.profile.name.first} {user.profile.name.last}</strong>
        <Link to={`/${user.username}`}>@{user.username}</Link>
        <span><Link to={`/pups/${pup._id}`}>{timeago(pup.createdAt)}</Link></span>
      </p>
      <p
        className="Pup-message"
        dangerouslySetInnerHTML={{ __html: this.setAtMentionsAndHashtags(pup.pup) }}
      />
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
