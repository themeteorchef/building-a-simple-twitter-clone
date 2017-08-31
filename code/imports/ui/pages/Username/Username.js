import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import Pups from '../../../api/Pups/Pups';
import PupsList from '../../components/Pups/Pups';
import Loading from '../../components/Loading/Loading';

import './Username.scss';

class Username extends React.Component {
  constructor(props) {
    super(props);
    this.state = { following: false };
    this.handleFollowUnfollow = this.handleFollowUnfollow.bind(this);
    this.renderFollowButton = this.renderFollowButton.bind(this);
  }

  componentDidMount() {
    const { match: { params: { username } } } = this.props;
    Meteor.call('users.checkFollower', username, (error, following) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.setState({ following });
      }
    });
  }

  handleFollowUnfollow() {
    const { match: { params: { username } } } = this.props;
    Meteor.call('users.followUnfollow', username, (error, following) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.setState({ following });
      }
    });
  }

  renderFollowButton() {
    const { following } = this.state;
    return (<Button
      bsStyle={following ? 'danger' : 'default'}
      onClick={this.handleFollowUnfollow}
    >{following ? 'Unfollow' : 'Follow'}</Button>);
  }

  render() {
    const { loading, username, pups, isCurrentUser } = this.props;
    return !loading ? (<div className="Username">
      <header className="clearfix">
        <h4 className="pull-left">@{username}</h4>
        <span className="pull-right">{!isCurrentUser ? this.renderFollowButton() : ''}</span>
      </header>
      <PupsList pups={pups} />
    </div>) : <Loading />;
  }
}

Username.defaultProps = {
  pups: [],
};

Username.propTypes = {
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  pups: PropTypes.array,
  isCurrentUser: PropTypes.bool.isRequired,
};

export default createContainer(({ match }) => {
  const username = match.params.username;
  const subscription = Meteor.subscribe('pups.username', username);
  const user = Meteor.user();

  return {
    loading: !subscription.ready(),
    username,
    pups: Pups.find().fetch(),
    isCurrentUser: (user && user.username === username),
  };
}, Username);
