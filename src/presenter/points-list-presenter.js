import PointPresenter from './point-presenter.js';
import PointCreationPresenter from './point-creation-presenter.js';
import SortView from '../view/sort-view.js';
import EmptyPointListView from '../view/empty-point-list-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { updatePoint, sortByDay, sortByPrice, sortByTime, filter } from '../utils/utils.js';
import { SortType, UpdateType, UserAction, NEW_POINT } from '../const/const.js';
import { getAllOffers, getAllOffersByType } from '../mock/offer.js';
import { getAllDestinations } from '../mock/destination.js';

export default class PointsListPresenter {
  #pointListComponent = null;
  #emptyPointListComponent = null;
  #pointPresenters = new Map();
  #pointCreationPresenter = null;
  #sortComponent = null;
  #eventsContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #filterType = null;
  #currentSortType = null;
  #allOffers = getAllOffers();
  #allDestinations = getAllDestinations();

  constructor({ eventsContainer, pointListComponent, pointsModel, filterModel }) {
    this.#eventsContainer = eventsContainer;
    this.#pointListComponent = pointListComponent;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#pointsModel.addObserver(this.#handleModelChange);
    this.#filterModel.addObserver(this.#handleModelChange);

    this.#pointCreationPresenter = new PointCreationPresenter({
      filterModel: this.#filterModel,
      pointListComponent: this.#pointListComponent,
      point: NEW_POINT,
      typeOffers: getAllOffersByType(NEW_POINT.eventType),
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,

      handleDataChange: this.#handleUserAction.bind(this),
      handleModeChange: this.#handleModeChange.bind(this)
    });
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;

    switch (this.#currentSortType) {
      case SortType.PRICE:
        points.sort(sortByPrice);
        break;
      case SortType.TIME:
        points.sort(sortByTime);
        break;
      default:
        points.sort(sortByDay);
        break;
    }
    return filter[this.#filterType](points);
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  init() {
    this.#onSortChange(SortType.DAY);
  }

  #renderPointList(isFilterTypeChanged = false) {
    if (isFilterTypeChanged) {
      this.#currentSortType = 'day';
      this.#renderSort();
    }

    remove(this.#emptyPointListComponent);
    render(this.#pointListComponent, this.#eventsContainer);
    if (this.points.length > 0) {
      this.points.forEach((point) => this.#renderPoint(point));
    } else {
      this.#renderEmptyPointList();
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListComponent: this.#pointListComponent,
      typeOffers: getAllOffersByType(point.eventType),
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      handlePointChange: this.#handleUserAction.bind(this),
      handleModeChange: this.#handleModeChange.bind(this)
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderEmptyPointList() {
    this.#emptyPointListComponent = new EmptyPointListView({ filterType: this.#filterType });
    render(this.#emptyPointListComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
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
      this.#currentSortType = sortType;
      this.#renderSort();
      this.#clearPointList();
      this.#renderPointList();
    }
  }

  #clearPointList() {
    this.#pointPresenters.forEach((point) => point.destroy());
    this.#pointPresenters.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#pointsModel.points = updatePoint(this.points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#pointCreationPresenter.destroy();
  };

  #handleUserAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelChange = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(update.id).init(update);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderPointList();
        break;
      case UpdateType.MAJOR:
        this.#clearPointList();
        this.#renderPointList(true);
        break;
    }
  };
}
