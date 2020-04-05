import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container, Row, Col, FormControl } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { bindActionCreators } from 'redux';

import AngledTick from 'components/AngledTick/AngledTick';
import SurveySelector from 'components/SurveySelector/SurveySelector';
import { actions as appActions } from 'reducers/application';
import { getSurveys, getSelectedSurvey } from 'selectors/application';

export class Results extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      loadSurveys: PropTypes.func.isRequired,
      loadSurvey: PropTypes.func.isRequired
    }).isRequired,
    surveys: PropTypes.arrayOf(PropTypes.object),
    match: PropTypes.object,
    selectedSurvey: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedQuestion: '',
      questions: []
    };
    this.handleSurveyChange = this.handleSurveyChange.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);

    if (props.match) {
      const { id } = props.match.params;

      if (id) {
        this.props.actions.loadSurvey(id);
      }
    }
  }

  componentDidMount() {
    const { actions } = this.props;

    actions.loadSurveys();
  }

  async componentDidUpdate(prevProps) {
    const { selectedSurvey: previousSurvey } = prevProps;
    const { selectedSurvey } = this.props;

    if (!previousSurvey || previousSurvey.id !== selectedSurvey?.id) {
      try {
        const jsonData = await import(`data/${selectedSurvey.id}.json`);

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
      } catch {
        return;
      }
    }
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

  handleQuestionChange(event) {
    const {
      target: { value }
    } = event;

    if (!value) {
      return;
    }

    this.setState({ selectedQuestion: value });
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
        onChange={this.handleQuestionChange}
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
        <Helmet title="Poll Results" />
        <Row>
          <Col>
            <h1>Poll Results</h1>
            <SurveySelector
              showVisible={true}
              onChange={this.handleSurveyChange}
            />
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
