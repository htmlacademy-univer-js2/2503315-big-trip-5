import PointsListPresenter from './presenter/points-list-presenter.js';
import PointsModel from './model/points-model.js';

const eventsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');

new PointsListPresenter({filtersContainer: filtersContainer, eventsContainer: eventsContainer, pointsModel: new PointsModel()}).init();
