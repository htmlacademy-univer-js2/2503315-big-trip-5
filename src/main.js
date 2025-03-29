import MainPresenter from './presenter/main-presenter';
import PointsModel from './model/points-model.js';

const eventsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');

new MainPresenter({filtersContainer: filtersContainer, eventsContainer: eventsContainer, pointsModel: new PointsModel()}).init();
