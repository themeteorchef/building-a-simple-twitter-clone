import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import Pups from '../../../api/Pups/Pups';
import PupsList from '../../components/Pups/Pups';
import Loading from '../../components/Loading/Loading';

class Username extends React.Component {
  constructor(props) {
    super(props);
    // this.thing = this.thing.bind(this);
  }

  render() {
    const { loading, pups } = this.props;
    return !loading ? (<div className="Username">
      <PupsList pups={pups} />
    </div>) : <Loading />;
  }
}

Username.defaultProps = {
  pups: [],
};

Username.propTypes = {
  loading: PropTypes.bool.isRequired,
  pups: PropTypes.array,
};

export default createContainer(({ match }) => {
  const username = match.params.username;
  const subscription = Meteor.subscribe('pups.username', username);

  return {
    loading: !subscription.ready(),
    pups: Pups.find().fetch(),
  };
}, Username);
