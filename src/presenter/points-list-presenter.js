import PointPresenter from './point-presenter.js';
import PointCreationPresenter from './point-creation-presenter.js';
import SortView from '../view/sort-view.js';
import EmptyPointListView from '../view/empty-point-list-view.js';
import LoadingView from '../view/loading-view.js';
import ErrorView from '../view/error-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { sortByDay, sortByPrice, sortByTime, filter, getAllOffersByType } from '../utils/utils.js';
import { SortType, UpdateType, UserAction, NEW_POINT } from '../const/const.js';

export default class PointsListPresenter {
  #pointListComponent = null;
  #emptyPointListComponent = null;
  #loadingComponent = new LoadingView();
  #errorComponent = new ErrorView();
  #pointPresenters = new Map();
  #pointCreationPresenter = null;
  #sortComponent = null;
  #eventsContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #filterType = null;
  #currentSortType = null;
  #isLoading = true;
  #addButton = document.querySelector('.trip-main__event-add-btn');

  constructor({ eventsContainer, pointListComponent, pointsModel, filterModel }) {
    this.#eventsContainer = eventsContainer;
    this.#pointListComponent = pointListComponent;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#pointsModel.addObserver(this.#handleModelChange);
    this.#filterModel.addObserver(this.#handleModelChange);

    this.#pointCreationPresenter = new PointCreationPresenter({
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel,
      addButton: this.#addButton,
      pointListComponent: this.#pointListComponent,
      point: NEW_POINT,
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

  async init() {
    this.#onSortChange(SortType.DAY);
  }

  #renderPointList(isFilterTypeChanged = false) {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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
      typeOffers: getAllOffersByType(this.offers, point.type),
      allOffers: this.offers,
      allDestinations: this.destinations,
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

  #renderLoading() {
    render(this.#loadingComponent, this.#eventsContainer, RenderPosition.BEFOREEND);
  }

  #renderError() {
    render(this.#errorComponent, this.#eventsContainer, RenderPosition.BEFOREEND);
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
    this.#pointsModel.points.updatePoint(updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#pointCreationPresenter.destroy();
  };

  #handleUserAction = async (actionType, updateType, update) => {
    const presenter = this.#pointPresenters.get(update.id);

    try {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          await this.#pointsModel.updatePoint(updateType, update);
          break;
        case UserAction.ADD_POINT:
          await this.#pointsModel.addPoint(updateType, update);
          break;
        case UserAction.DELETE_POINT:
          await this.#pointsModel.deletePoint(updateType, update);
          break;
      }
    } catch {
      if (actionType === UserAction.ADD_POINT) {
        this.#pointCreationPresenter.setAborting();
      } else {
        presenter.setAborting();
      }
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);

        if (update.isLoadingFailed) {
          this.#renderError();
        } else {
          this.#renderPointList();
        }
    }
  };
}
