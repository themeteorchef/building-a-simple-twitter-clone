import React from 'react';
import PropTypes from 'prop-types';
import Pup from '../Pup/Pup';

import './Pups.scss';

class Pups extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {};
    // this.thing = this.thing.bind(this);
  }

  render() {
    return (<div className="Pups">
      <ol>
        {this.props.pups.map(pup => (<li key={pup._id}><Pup pup={pup} /></li>))}
      </ol>
    </div>);
  }
}

Pups.propTypes = {
  pups: PropTypes.array.isRequired,
};

export default Pups;
