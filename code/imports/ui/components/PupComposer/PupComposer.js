import React from 'react';
import { Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import './PupComposer.scss';

class PupComposer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pupLengthRemaining: 140 };
    this.setPupLengthRemaining = this.setPupLengthRemaining.bind(this);
    this.postPup = this.postPup.bind(this);
  }

  setPupLengthRemaining(event) {
    this.setState({ pupLengthRemaining: (140 - event.target.value.length) });
  }

  postPup() {
    const pup = this.pup.value;

    if (pup.trim().length === 0) {
      Bert.alert('Make sure to say something!', 'warning');
      return;
    }

    if (pup.length > 140) {
      Bert.alert('Shorten this up a bit before posting.', 'warning');
      return;
    }

    Meteor.call('pups.insert', { pup }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.pup.value = '';
      }
    });
  }

  render() {
    const lengthRemaining = this.state.pupLengthRemaining;
    const isValid = lengthRemaining < 140 && lengthRemaining >= 0;

    return (<div className="PupComposer">
      <textarea
        ref={pup => (this.pup = pup)} // eslint-disable-line
        onKeyUp={this.setPupLengthRemaining}
        placeholder="What's going on?"
      />
      <div className="Button-with-count">
        <Button
          disabled={!isValid}
          bsStyle="success"
          onClick={this.postPup}
        >Post Pup</Button>
        <span className={lengthRemaining < 0 ? 'invalid-length' : ''}>{lengthRemaining}</span>
      </div>
    </div>);
  }
}

PupComposer.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default PupComposer;
