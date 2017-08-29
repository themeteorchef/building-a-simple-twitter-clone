import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Pups from '../../../api/Pups/Pups';
import PupComposer from '../../components/PupComposer/PupComposer';
import PupsList from '../../components/Pups/Pups';
import Loading from '../../components/Loading/Loading';

import './Feed.scss';

const Feed = ({ loading, pups }) => (!loading ? (
  <div className="Feed">
    <PupComposer />
    <PupsList pups={pups} />
  </div>
) : <Loading />);

Feed.defaultProps = {
  pups: [],
};

Feed.propTypes = {
  loading: PropTypes.bool.isRequired,
  pups: PropTypes.array,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('pups.feed');

  return {
    loading: !subscription.ready(),
    pups: Pups.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, Feed);
