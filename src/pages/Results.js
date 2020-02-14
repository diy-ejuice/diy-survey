import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container, Row, Col, FormControl, Spinner } from 'react-bootstrap';
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

    this.state = {
      selectedQuestion: '',
      questions: []
    };
    this.handleSurveySelectorChange = this.handleSurveySelectorChange.bind(
      this
    );
    this.handleQuestionSelectorChange = this.handleQuestionSelectorChange.bind(
      this
    );
  }

  componentDidMount() {
    const { actions } = this.props;

    actions.loadSurveys();
  }

  async handleSurveySelectorChange(event) {
    const { actions } = this.props;
    const {
      target: { value }
    } = event;

    if (!value) {
      return;
    }

    actions.loadSurvey(value);

    const { default: jsonData } = await import(`data/${value}.json`);

    if (!jsonData?.pages?.length) {
      return;
    }

    const questions = jsonData.pages[0].elements.map(element => ({
      id: element.name,
      name: element.title
    }));

    this.setState({
      questions,
      selectedQuestion: questions.length ? questions[0].id : ''
    });
  }

  handleQuestionSelectorChange(event) {
    const {
      target: { value }
    } = event;

    if (!value) {
      return;
    }

    this.setState({ selectedQuestion: value });
  }

  get surveySelector() {
    const { surveys } = this.props;

    if (!Array.isArray(surveys) || !surveys.length) {
      return (
        <Col md={12} className="text-center">
          <h5>Loading Surveys&hellip;</h5>
          <Spinner animation="border" />
        </Col>
      );
    }

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
        onChange={this.handleSurveySelectorChange}
        className="mb-2"
      >
        <option value="">Select a survey</option>
        {mappedSurveys}
      </FormControl>
    );
  }

  get questionSelector() {
    const { questions, selectedQuestion } = this.state;
    const { selectedSurvey } = this.props;

    if (!selectedSurvey) {
      return null;
    }

    return (
      <FormControl
        as="select"
        value={selectedQuestion}
        onChange={this.handleQuestionSelectorChange}
        className="mb-2"
      >
        {questions.map(question => (
          <option value={question.id} key={question.name}>
            {question.name}
          </option>
        ))}
      </FormControl>
    );
  }

  get chart() {
    const { selectedQuestion } = this.state;
    const { selectedSurvey } = this.props;

    if (!selectedSurvey || !selectedQuestion) {
      return null;
    }

    return (
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={selectedSurvey.answers[selectedQuestion]}>
          <XAxis
            dataKey="flavor"
            tick={<AngledTick />}
            height={100}
            interval={0}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <CartesianGrid strokeDasharray="2 4" />
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
            {this.surveySelector}
            {this.questionSelector}
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
