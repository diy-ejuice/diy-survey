import { createSelector } from 'reselect';

export const getApplication = state => state.application;

export const getSurveys = createSelector(
  getApplication,
  application => application.surveys
);

export const getSelectedSurvey = createSelector(
  getApplication,
  application => application.selectedSurvey
);
