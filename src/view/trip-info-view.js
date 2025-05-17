import { SortType } from '../const/const';
import AbstractView from '../framework/view/abstract-view';
import { sort, getRouteDates, getRoute, getRoutePrice } from '../utils/utils';

function createTripInfoTemplate(points, destinations, offers) {
  const routeDates = getRouteDates(points);
  const route = getRoute(points, destinations);
  const routePrice = getRoutePrice(points, offers);

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${route}</h1>

              <p class="trip-info__dates">${routeDates[0]}&nbsp;&mdash;&nbsp;${routeDates[1]}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${routePrice}</span>
            </p>
          </section>`;
}

export default class TripInfoView extends AbstractView {
  #points = null;
  #pointsModel = null;

  constructor({ pointsModel }) {
    super();
    this.#pointsModel = pointsModel;
    this.#points = sort[SortType.DAY](pointsModel.points);
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#pointsModel.destinations, this.#pointsModel.offers);
  }
}
