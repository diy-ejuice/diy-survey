import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Survey from 'survey-react';

import Surveys from 'data/surveys';
import SurveySelector from 'components/SurveySelector/SurveySelector';
import { actions as appActions } from 'reducers/application';
import { getSelectedSurvey, getSurveys } from 'selectors/application';

export class SurveyPage extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      submitSurvey: PropTypes.func.isRequired,
      loadSurvey: PropTypes.func.isRequired,
      loadSurveys: PropTypes.func.isRequired
    }).isRequired,
    selectedSurvey: PropTypes.object,
    surveys: PropTypes.arrayOf(PropTypes.object)
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
    this.surveys = [];
    this.onComplete = this.onComplete.bind(this);
  }

  async componentDidMount() {
    const { actions } = this.props;

    this.surveys = await Promise.all(
      Surveys.filter(survey => !survey.visible).map(
        async survey => new Survey.Model(await import(`data/${survey.id}.json`))
      )
    );

    actions.loadSurveys();
  }

  onComplete(model) {
    const { actions } = this.props;
    const { isCompleted, cookieName, valuesHash } = model;

    if (!isCompleted || !valuesHash) {
      return;
    }

    actions.submitSurvey(cookieName, valuesHash);
  }

  get survey() {
    const { selectedSurvey } = this.props;

    if (!selectedSurvey) {
      return null;
    }

    const surveyModel = this.surveys.find(
      survey => survey.cookieName === selectedSurvey?.id
    );

    if (!surveyModel) {
      return null;
    }

    return (
      <Survey.Survey
        css={this.css}
        model={surveyModel}
        onComplete={this.onComplete}
      />
    );
  }

  render() {
    return (
      <Container>
        <Helmet title="Active Polls" />
        <Row>
          <Col>
            <h1>Active Polls</h1>
            <SurveySelector showVisible={false} />
            {this.survey}
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  surveys: getSurveys(state),
  selectedSurvey: getSelectedSurvey(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(appActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyPage);
