import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { ReactiveVar } from 'meteor/reactive-var';
import { Counts } from 'meteor/tmeasday:publish-counts';
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

    window.addEventListener('scroll', () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        const currentLimit = this.props.requestedPups.get();
        if (currentLimit < this.props.totalPups) this.props.requestedPups.set(currentLimit + 25);
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
    const { loading, username, user, pups, isCurrentUser } = this.props;
    return (<div className="Username">
      <header className="clearfix">
        <div>
          <img src={user && user.profile && user.profile.photo.url} alt={username} />
          <div className="NameFollow">
            <h4 className="pull-left">@{username}</h4>
            <span className="pull-right">{!isCurrentUser ? this.renderFollowButton() : ''}</span>
          </div>
        </div>
        {user && user.profile && user.profile.biography ? <div className="UsernameBio">
          <p>{user && user.profile && user.profile.biography}</p>
        </div> : ''}
      </header>
      <PupsList pups={pups} />
      {loading ? <Loading /> : ''}
    </div>);
  }
}

Username.defaultProps = {
  pups: [],
};

Username.propTypes = {
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  pups: PropTypes.array,
  isCurrentUser: PropTypes.bool.isRequired,
  requestedPups: PropTypes.object.isRequired,
  totalPups: PropTypes.number.isRequired,
};

const requestedPups = new ReactiveVar(25);

export default createContainer(({ match }) => {
  const username = match.params.username;
  const subscription = Meteor.subscribe('pups.username', username, requestedPups.get());
  const user = Meteor.user();

  return {
    loading: !subscription.ready(),
    username,
    requestedPups,
    user,
    totalPups: Counts.get(`Pups.username.${username}`),
    pups: Pups.find({}, { sort: { createdAt: -1 } }).fetch(),
    isCurrentUser: (user && user.username === username),
  };
}, Username);
