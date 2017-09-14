import React from 'react';
import PropTypes from 'prop-types';
import autolinker from 'autolinker';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { timeago } from '@cleverbeagle/dates';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Icon from '../Icon/Icon';

import './Pup.scss';

class Pup extends React.Component {
  constructor(props) {
    super(props);
    this.getPupMetadata = this.getPupMetadata.bind(this);
  }

  setAtMentionsAndHashtags(pup) {
    return pup
    .replace(/@([a-zA-Z1-9-_]+)/g, '<a href="/$1">@$1</a>') // @mentions
    .replace(/#([a-zA-Z1-9-_]+)/g, '<a href="/hashtag/$1">#$1</a>'); // #hashtags
  }

  getPupMetadata(pup, type) {
    const metadata = {
      image: pup.metadata['twitter:image:src'] || pup.metadata['og:image'],
      title: pup.metadata['twitter:title'] || pup.metadata['og:title'],
      description: pup.metadata['twitter:description'] || pup.metadata['og:description'],
    };

    return {
      image() {
        return metadata.image ? <img src={metadata.image} alt={metadata.title} /> : '';
      },
      title() { return metadata.title; },
      description() { return metadata.description; },
    }[type]();
  }

  handleRepup(_id) {
    if (confirm('Are you sure you want to repup this?')) {
      Meteor.call('pups.repup', _id, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Repuped!', 'success');
        }
      });
    }
  }

  handleDeletePup(pupId) {
    Meteor.call('pups.remove', pupId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
    });
  }

  renderPupHeader(user, pup) {
    return !pup.repup ? (<p className="Pup-user clearfix">
      <strong>{user.profile.name.first} {user.profile.name.last}</strong>
      <Link to={`/${user.username}`}>@{user.username}</Link>
      <span><Link to={`/pups/${pup._id}`}>{timeago(pup.createdAt)}</Link></span>
    </p>) : (<p className="Pup-user repuped-by clearfix">
      <Icon icon="refresh" /> {user.profile.name.first} {user.profile.name.last} repupped
    </p>);
  }

  renderPupBody(pup) {
    return !pup.repup ? (<p
      className="Pup-message"
      dangerouslySetInnerHTML={{ __html: autolinker.link(this.setAtMentionsAndHashtags(pup.pup)) }}
    />) : (<div className="Pup-repup-content">
      {this.renderPupHeader(pup.repup.user, pup.repup)}
      {this.renderPupBody(pup.repup)}
      {this.renderPupMetadata(pup.repup)}
    </div>);
  }

  renderPupMetadata(pup) {
    return pup.metadata ? <div className="Pup-metadata">
      {this.getPupMetadata(pup, 'image')}
      <header>
        <strong>{this.getPupMetadata(pup, 'title')}</strong>
        <p>{this.getPupMetadata(pup, 'description')}</p>
      </header>
    </div> : '';
  }

  render() {
    const { user, pup } = this.props;
    return pup && user && user.profile ? (<div className={`Pup ${pup.repup ? 'is-repup' : ''}`}>
      {this.renderPupHeader(user, pup)}
      {this.renderPupBody(pup)}
      {this.renderPupMetadata(pup)}
      {pup.userId === Meteor.userId() ?
        <Button
          role="button"
          className="Pup-delete"
          onClick={() => this.handleDeletePup(pup._id)}
          bsStyle="link"
        >Delete</Button> : ''}
      {pup.userId !== Meteor.userId() ?
        <Button
          role="button"
          className="Pup-repup"
          onClick={() => this.handleRepup(pup._id)}
          bsStyle="link"
        ><Icon icon="refresh" /> Repup</Button> : ''}
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
