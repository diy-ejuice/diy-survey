import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  render() {
    return (
      <Container>
        <Helmet title="DIY Mixing Poll" />
        <Row>
          <Col>
            <h1>Welcome to the DIY Mixing Poll!</h1>
            <p>
              You can <Link to="/survey">take the current survey</Link> or{' '}
              <Link to="/results">view completed survey results</Link>.
            </p>
          </Col>
        </Row>
      </Container>
    );
  }
}
