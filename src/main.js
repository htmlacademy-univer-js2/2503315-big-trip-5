import MainPresenter from './presenter/main-presenter';
import PointsModel from './model/points-model.js';

const eventContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');
const pointsModel = new PointsModel();

new MainPresenter(filtersContainer, eventContainer, pointsModel).init();
