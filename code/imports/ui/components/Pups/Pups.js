import React from 'react';
import PropTypes from 'prop-types';
import Pup from '../Pup/Pup';

import './Pups.scss';

const Pups = ({ pups }) => (<div className="Pups">
  <ol>
    {pups.map(pup => (<li key={pup._id}><Pup pup={pup} /></li>))}
  </ol>
</div>);

Pups.propTypes = {
  pups: PropTypes.array.isRequired,
};

export default Pups;
