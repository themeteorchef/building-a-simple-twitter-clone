import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import { Counts } from 'meteor/tmeasday:publish-counts';
import Pups from '../../../api/Pups/Pups';
import PupComposer from '../../components/PupComposer/PupComposer';
import PupsList from '../../components/Pups/Pups';
import Loading from '../../components/Loading/Loading';

import './Hashtag.scss';

class Hashtag extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        const currentLimit = this.props.requestedPups.get();
        if (currentLimit < this.props.totalPups) this.props.requestedPups.set(currentLimit + 25);
      }
    });
  }

  render() {
    const { loading, hashtag, pups } = this.props;
    return (
      <div className="Hashtag">
        <header className="clearfix">
          <h4>Pups mentioning #{hashtag}</h4>
        </header>
        <PupsList pups={pups} />
        {loading ? <Loading /> : ''}
      </div>
    );
  }
}

Hashtag.defaultProps = {
  pups: [],
};

Hashtag.propTypes = {
  loading: PropTypes.bool.isRequired,
  pups: PropTypes.array,
  requestedPups: PropTypes.object.isRequired,
  totalPups: PropTypes.number.isRequired,
  hashtag: PropTypes.string.isRequired,
};

const requestedPups = new ReactiveVar(25);

export default createContainer(({ match }) => {
  const hashtag = match.params.hashtag;
  const subscription = Meteor.subscribe('pups.hashtag', hashtag, requestedPups.get());

  return {
    loading: !subscription.ready(),
    hashtag,
    requestedPups,
    totalPups: Counts.get('Pups.hashtag'),
    pups: Pups.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, Hashtag);
