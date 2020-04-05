import { buildActions } from 'utils';

export const types = buildActions('application', [
  'INIT_APP',
  'LOAD_SURVEY_SUCCESS',
  'LOAD_SURVEY',
  'LOAD_SURVEYS_SUCCESS',
  'LOAD_SURVEYS',
  'SELECT_SURVEY',
  'SUBMIT_SURVEY'
]);

const initApp = () => ({
  type: types.INIT_APP
});

const submitSurvey = (id, answers) => ({
  type: types.SUBMIT_SURVEY,
  answers,
  id
});

const selectSurvey = id => ({
  type: types.SELECT_SURVEY,
  id
});

const loadSurvey = id => ({
  type: types.LOAD_SURVEY,
  id
});

const loadSurveySuccess = (id, answers) => ({
  type: types.LOAD_SURVEY_SUCCESS,
  id,
  answers
});

const loadSurveys = () => ({
  type: types.LOAD_SURVEYS
});

const loadSurveysSuccess = surveys => ({
  type: types.LOAD_SURVEYS_SUCCESS,
  surveys
});

export const actions = {
  initApp,
  loadSurvey,
  loadSurveys,
  loadSurveysSuccess,
  loadSurveySuccess,
  selectSurvey,
  submitSurvey
};

export const initialState = {
  surveys: [],
  selectedSurvey: null
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.SELECT_SURVEY:
      return {
        ...state,
        selectedSurvey: {
          id: action.id,
          answers: []
        }
      };
    case types.LOAD_SURVEY_SUCCESS:
      return {
        ...state,
        selectedSurvey: {
          id: action.id,
          answers: action.answers
        }
      };
    case types.LOAD_SURVEYS_SUCCESS:
      return {
        ...state,
        surveys: action.surveys
      };
    default:
      return state;
  }
};
