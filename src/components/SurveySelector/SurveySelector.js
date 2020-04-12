import { format, parseISO, startOfWeek } from 'date-fns';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormControl, Col, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';

import Surveys from 'data/surveys';
import { getSelectedSurvey, getSurveys } from 'selectors/application';

export class SurveySelector extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    showVisible: PropTypes.bool.isRequired,
    selectedSurvey: PropTypes.object,
    surveys: PropTypes.arrayOf(PropTypes.object)
  };

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

    const sorted = [...Surveys];

    sorted.sort((a, b) => b.id.substr(-10).localeCompare(a.id.substr(-10)));

    return sorted.map(survey => {
      if (survey.visible !== showVisible) {
        return null;
      }

      // use the last ten characters of the id as the date
      const surveyDate = format(
        startOfWeek(parseISO(survey.id.substr(-10))),
        'MMM do'
      );

      return (
        <option value={survey.id} key={survey.id}>
          {survey.name || survey.id} - Week of {surveyDate}
        </option>
      );
    });
  }

  render() {
    const { onChange, surveys, selectedSurvey } = this.props;

    if (!Array.isArray(surveys) || !surveys.length) {
      return this.surveysLoading;
    }

    return (
      <FormControl
        as="select"
        defaultValue={selectedSurvey?.id}
        onChange={onChange}
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

export default connect(mapStateToProps, null)(SurveySelector);
