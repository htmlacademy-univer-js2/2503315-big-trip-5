import PointPresenter from './point-presenter.js';
import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import PointListView from '../view/point-list-view.js';
import PointCreationView from '../view/point-creation-view.js';
import EmptyPointListView from '../view/empty-point-list-view.js';
import { render, remove } from '../framework/render.js';
import { generateFilters } from '../mock/filters.js';
import { updatePoint, sortByDay, sortByPrice, sortByTime } from '../utils/utils.js';
import { SORT_TYPES } from '../const/filters-const.js';

export default class PointsListPresenter {
  #pointListComponent = new PointListView();
  #sortComponent = null;
  #filtersContainer = null;
  #eventsContainer = null;
  #pointsModel = null;
  #points = null;
  #filters = null;
  #pointPresenters = new Map();
  #currentSortType = null;

  constructor({filtersContainer, eventsContainer, pointsModel}) {
    this.#filtersContainer = filtersContainer;
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;

    this.#points = pointsModel.points;
    this.#filters = generateFilters(this.#points);
  }

  init() {
    this.#onSortChange(SORT_TYPES.DAY);
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
    const pointPresenter = new PointPresenter(this.#pointListComponent, this.#updatePoints.bind(this), this.#updateMode.bind(this));
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderEmptyPointList() {
    render(new EmptyPointListView(), this.#pointListComponent.element);
  }

  #renderFilter() {
    render(new FilterView({filters: this.#filters}), this.#filtersContainer);
  }

  #renderPointCreation() {
    render(new PointCreationView(), this.#pointListComponent.element);
  }

  #renderSort() {
    if (this.#sortComponent !== null) {
      remove(this.#sortComponent);
    }
    this.#sortComponent = new SortView(this.#currentSortType, this.#onSortChange.bind(this));
    render(this.#sortComponent, this.#eventsContainer);
  }

  #onSortChange(sortType) {
    if (this.#currentSortType !== sortType) {
      this.#sortPoints(sortType);
      this.#renderSort();
      this.#clearPointList();
      this.#renderPointList();
    }
  }

  #sortPoints(sortType) {
    if (sortType === SORT_TYPES.TIME) {
      this.#points.sort(sortByTime);
    } else if (sortType === SORT_TYPES.PRICE) {
      this.#points.sort(sortByPrice);
    } else {
      this.#points.sort(sortByDay);
    }
    this.#currentSortType = sortType;
  }

  #clearPointList() {
    this.#pointPresenters.forEach((point) => point.destroy());
    this.#pointPresenters.clear();
  }


  #updatePoints = (updatedPoint) => {
    this.#points = updatePoint(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #updateMode = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
