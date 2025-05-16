import { UpdateType } from '../const/const.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #destinations = [];
  #offers = [];
  #isLoading = true;

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get loading() {
    return this.#isLoading;
  }

  async init() {
    let isLoadingFailed = false;
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map((point) => this.#adaptToClient(point));
      this.#destinations = await this.#pointsApiService.destinations;
      this.#offers = await this.#pointsApiService.offers;
      this.#isLoading = false;
    } catch {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
      this.#isLoading = false;
      isLoadingFailed = true;
    }

    this._notify(UpdateType.INIT, { isLoadingFailed });
  }

  async updatePoint(updateType, update) {
    const index = this.points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1)
      ];
      this._notify(updateType, updatedPoint);
    } catch {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, point) {
    try {
      const response = this.#pointsApiService.addPoint(point);
      const update = this.#adaptToClient(response);
      this.#points = [
        update,
        ...this.#points
      ];
      this._notify(updateType, update);
    } catch {
      throw new Error('Can\'t add unexiscting point');
    }
  }

  async deletePoint(updateType, point) {
    await this.#pointsApiService.deletePoint(point);
    this.#points = this.#points.filter((item) => item.id !== point.id);
    this._notify(updateType, point);
  }

  #adaptToClient = (point) => {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  };
}
