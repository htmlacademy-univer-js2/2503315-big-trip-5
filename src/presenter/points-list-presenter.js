import PointPresenter from './point-presenter.js';
import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import PointListView from '../view/point-list-view.js';
import PointCreationView from '../view/point-creation-view.js';
import EmptyPointListView from '../view/empty-point-list-view.js';
import { render } from '../framework/render.js';
import { generateFilters } from '../mock/filters.js';
import { updatePoint } from '../utils/utils.js';

export default class PointsListPresenter {
  #pointListComponent = new PointListView();
  #filtersContainer = null;
  #eventsContainer = null;
  #pointsModel = null;
  #points = null;
  #filters = null;
  #pointPresenters = new Map();

  constructor({filtersContainer, eventsContainer, pointsModel}) {
    this.#filtersContainer = filtersContainer;
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;

    this.#points = pointsModel.points;
    this.#filters = generateFilters(this.#points);
  }

  init() {
    this.#renderPointList();
    this.#renderSort();
    this.#renderFilter();
    this.#renderPointCreation();
  }

  #renderPointList() {
    render(this.#pointListComponent, this.#eventsContainer);

    if (this.#points.length > 0) {
      this.#points.forEach((point) => this.#renderPoint(point));
    } else {
      this.#renderEmptyPointList();
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(this.#pointListComponent, this.#updatePoints, this.#updateMode);
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderEmptyPointList() {
    render(new EmptyPointListView(), this.#pointListComponent.element);
  }

  #renderSort() {
    render(new SortView(), this.#eventsContainer);
  }

  #renderFilter() {
    render(new FilterView({filters: this.#filters}), this.#filtersContainer);
  }

  #renderPointCreation() {
    render(new PointCreationView(), this.#pointListComponent.element);
  }

  #updatePoints = (updatedPoint) => {
    this.#points = updatePoint(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #updateMode = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
