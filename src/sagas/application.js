import axios from 'axios';
import { all, call, takeLatest, put } from 'redux-saga/effects';

import { actions, types } from 'reducers/application';

function* submitSurveyWorker({ answers, id }) {
  try {
    yield call(axios.post, `${API_URL}/survey`, {
      answers,
      id
    });
  } catch (error) {
    // eslint-disable-next-line
    console.error(error);
  }
}

function* loadSurveyWorker({ id }) {
  try {
    const { status, data } = yield call(axios.get, `${API_URL}/survey/${id}`);

    if (status !== 200) {
      throw new Error(`Failed to fetch data for survey ${id}`);
    } else if (!Array.isArray(data) || !data.length) {
      throw new Error(`Got a non-array response for survey ${id}`);
    }

    const counts = {};

    for (const result of data) {
      for (const [question, answer] of Object.entries(result)) {
        if (!counts[question]) {
          counts[question] = {};
        }

        if (!counts[question][answer]) {
          counts[question][answer] = 0;
        }

        counts[question][answer]++;
      }
    }

    const answers = {};

    for (const [question, results] of Object.entries(counts)) {
      answers[question] = Object.entries(results).map(([flavor, count]) => ({
        flavor,
        count
      }));

      answers[question].sort((a, b) => (a.count < b.count ? 1 : -1));
    }

    yield put(actions.loadSurveySuccess(id, answers));
  } catch (error) {
    // eslint-disable-next-line
    console.error(error);
  }
}

function* loadSurveysWorker() {
  try {
    const { status, data } = yield call(axios.get, `${API_URL}/surveys`);

    if (status !== 200) {
      throw new Error(`Failed to fetch survey list`);
    }

    data.sort((a, b) => b.surveyId.localeCompare(a.surveyId));

    yield put(actions.loadSurveysSuccess(data));
  } catch (error) {
    // eslint-disable-next-line
    console.error(error);
  }
}

export const workers = {
  loadSurveyWorker,
  loadSurveysWorker,
  submitSurveyWorker
};

function* loadSurveyWatcher() {
  yield takeLatest(types.LOAD_SURVEY, loadSurveyWorker);
}

function* loadSurveysWatcher() {
  yield takeLatest(types.LOAD_SURVEYS, loadSurveysWorker);
}

function* submitSurveyWatcher() {
  yield takeLatest(types.SUBMIT_SURVEY, submitSurveyWorker);
}

export const watchers = {
  loadSurveyWatcher,
  loadSurveysWatcher,
  submitSurveyWatcher
};

export default function* saga() {
  yield all(Object.values(watchers).map(watcher => watcher()));
}
