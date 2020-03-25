import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Header extends Component {
  render() {
    return (
      <Navbar bg="primary" variant="dark" className="mb-4">
        <Navbar.Brand as={Link} to="/">
          <FontAwesomeIcon icon="clipboard-list" fixedWidth /> DIY Survey
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/survey">
              Active Polls
            </Nav.Link>
            <Nav.Link as={Link} to="/results">
              View Results
            </Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Nav.Link
              href="https://reddit.com/r/DIY_eJuice"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={['fab', 'reddit-alien']} size="lg" />{' '}
              /r/DIY_eJuice
            </Nav.Link>
            <Nav.Link
              href="http://link.diyejuice.org/discord"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={['fab', 'discord']} size="lg" /> Discord
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
