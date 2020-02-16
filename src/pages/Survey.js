import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Survey from 'survey-react';

import SurveyJson from 'data/fotw-2020-02-11';

import { actions as appActions } from 'reducers/application';

export class SurveyPage extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      submitSurvey: PropTypes.func.isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);

    this.css = {
      radiogroup: {
        root: 'form-group',
        controlLabel: 'form-check-label',
        item: 'form-check',
        itemControl: 'form-check-input',
        error: {
          root: 'alert alert-danger'
        }
      },
      navigationButton: 'btn btn-success mt-2'
    };
    this.model = new Survey.Model(JSON.stringify(SurveyJson));
    this.onComplete = this.onComplete.bind(this);
  }

  onComplete(model) {
    const { actions } = this.props;
    const { isCompleted, cookieName, valuesHash } = model;

    if (!isCompleted || !valuesHash) {
      return;
    }

    actions.submitSurvey(cookieName, valuesHash);
  }

  render() {
    return (
      <Container>
        <Helmet title="Current Poll" />
        <Row>
          <Col>
            <h1>Current Poll</h1>
            <Survey.Survey
              css={this.css}
              model={this.model}
              onComplete={this.onComplete}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(appActions, dispatch)
});

export default connect(null, mapDispatchToProps)(SurveyPage);
