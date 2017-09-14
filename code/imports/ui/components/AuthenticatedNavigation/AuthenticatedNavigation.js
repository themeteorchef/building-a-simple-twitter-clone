import React from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const AuthenticatedNavigation = ({ username, name, notifications }) => (
  <div>
    <Nav>
      <LinkContainer to={`/${username}`}>
        <NavItem eventKey={1} href={`/${username}`}>@{username}</NavItem>
      </LinkContainer>
      <LinkContainer to="/notifications">
        <NavItem eventKey={2} href="/notifications">
          Notifications {notifications > 0 ? <span className="badge">{notifications}</span> : ''}
        </NavItem>
      </LinkContainer>
    </Nav>
    <Nav pullRight>
      <NavDropdown eventKey={3} title={name} id="user-nav-dropdown">
        <LinkContainer to="/profile">
          <NavItem eventKey={3.1} href="/profile">Profile</NavItem>
        </LinkContainer>
        <MenuItem divider />
        <MenuItem eventKey={3.2} onClick={() => Meteor.logout()}>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </div>
);

AuthenticatedNavigation.propTypes = {
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  notifications: PropTypes.number.isRequired,
};

export default AuthenticatedNavigation;
