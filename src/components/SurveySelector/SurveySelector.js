import { format, parseISO, startOfWeek } from 'date-fns';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormControl, Col, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Surveys from 'data/surveys';
import { actions as appActions } from 'reducers/application';
import { getSelectedSurvey, getSurveys } from 'selectors/application';

export class SurveySelector extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      loadSurvey: PropTypes.func.isRequired
    }).isRequired,
    showVisible: PropTypes.bool.isRequired,
    selectedSurvey: PropTypes.object,
    surveys: PropTypes.arrayOf(PropTypes.object)
  };

  constructor(props) {
    super(props);

    this.handleSurveyChange = this.handleSurveyChange.bind(this);
  }

  handleSurveyChange(event) {
    const { actions } = this.props;
    const {
      target: { value }
    } = event;

    if (!value) {
      return;
    }

    actions.loadSurvey(value);
  }

  get surveysLoading() {
    return (
      <Col md={12} className="text-center">
        <h5>Loading Surveys&hellip;</h5>
        <Spinner animation="border" />
      </Col>
    );
  }

  get options() {
    const { showVisible } = this.props;

    return this.props.surveys.map(survey => {
      const { surveyId } = survey;
      const surveyMatch = Surveys.find(
        innerSurvey => innerSurvey.id === surveyId
      );

      if (!surveyMatch || surveyMatch.visible !== showVisible) {
        return null;
      }

      // use the last ten characters of the id as the date
      const surveyDate = format(
        startOfWeek(parseISO(surveyId.substr(-10))),
        'MMM do'
      );

      return (
        <option value={surveyId} key={surveyId}>
          {surveyMatch.name || surveyId} - Week of {surveyDate}
        </option>
      );
    });
  }

  render() {
    const { surveys, selectedSurvey } = this.props;

    if (!Array.isArray(surveys) || !surveys.length) {
      return this.surveysLoading;
    }

    return (
      <FormControl
        as="select"
        defaultValue={selectedSurvey?.id}
        onChange={this.handleSurveyChange}
        className="mb-2"
      >
        <option value="">Select a survey</option>
        {this.options}
      </FormControl>
    );
  }
}

export const mapStateToProps = state => ({
  surveys: getSurveys(state),
  selectedSurvey: getSelectedSurvey(state)
});

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(appActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveySelector);
