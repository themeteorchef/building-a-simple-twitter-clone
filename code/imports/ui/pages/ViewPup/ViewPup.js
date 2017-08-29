import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Pups from '../../../api/Pups/Pups';
import Pup from '../../components/Pup/Pup';

const ViewPup = ({ pup }) => (
  <div className="ViewPup">
    <Pup pup={pup} />
  </div>
);

ViewPup.propTypes = {
  pup: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const pupId = match.params._id;
  Meteor.subscribe('pups.pup', pupId);
  return {
    pup: Pups.findOne(pupId),
  };
}, ViewPup);
