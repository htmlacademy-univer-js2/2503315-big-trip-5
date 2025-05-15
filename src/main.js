import PointsListPresenter from './presenter/points-list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointListView from './view/point-list-view.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const eventsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const pointListComponent = new PointListView();

const pointListPresenter = new PointsListPresenter({
  eventsContainer: eventsContainer,
  pointListComponent: pointListComponent,
  pointsModel: pointsModel,
  filterModel: filterModel
});

const filterPresenter = new FilterPresenter({
  filtersContainer: filtersContainer,
  filterModel: filterModel,
  pointsModel: pointsModel
});

pointListPresenter.init();
filterPresenter.init();
