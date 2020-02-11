import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container, Row, Col, FormControl } from 'react-bootstrap';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AngledTick from 'components/AngledTick/AngledTick';
import Surveys from 'data/surveys';
import { actions as appActions } from 'reducers/application';
import { getSurveys, getSelectedSurvey } from 'selectors/application';

export class Results extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      loadSurveys: PropTypes.func.isRequired,
      loadSurvey: PropTypes.func.isRequired
    }).isRequired,
    surveys: PropTypes.arrayOf(PropTypes.object),
    selectedSurvey: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.handleSelectorChange = this.handleSelectorChange.bind(this);
  }

  componentDidMount() {
    const { actions } = this.props;

    actions.loadSurveys();
  }

  handleSelectorChange(event) {
    const { actions } = this.props;
    const {
      target: { value }
    } = event;

    if (value) {
      actions.loadSurvey(value);
    }
  }

  get selector() {
    const { surveys } = this.props;

    const mappedSurveys = surveys.map(survey => {
      const { surveyId } = survey;
      const surveyMatch = Surveys.find(
        innerSurvey => innerSurvey.id === surveyId
      );

      if (!surveyMatch || !surveyMatch.visible) {
        return null;
      }

      return (
        <option value={surveyId} key={surveyId}>
          {surveyMatch?.name || surveyId}
        </option>
      );
    });

    return (
      <FormControl
        as="select"
        defaultValue=""
        onChange={this.handleSelectorChange}
        className="mb-2"
      >
        <option value="">Select a survey</option>
        {mappedSurveys}
      </FormControl>
    );
  }

  get chart() {
    const { selectedSurvey } = this.props;

    if (!selectedSurvey) {
      return null;
    }

    return (
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={selectedSurvey.answers}>
          <XAxis
            dataKey="flavor"
            tick={<AngledTick />}
            height={100}
            interval={0}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="count" fill="#4582ec" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1>Survey Results</h1>
            {this.selector}
            {this.chart}
          </Col>
        </Row>
      </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(Results);
