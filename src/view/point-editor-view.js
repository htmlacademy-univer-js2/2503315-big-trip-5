import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getFullDate, capitalizeWord } from '../utils/utils.js';
import { getDestinationById } from '../mock/destination.js';
import { EVENT_TYPES, getOfferById } from '../mock/offer.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createFormEditorTemplate(state, allDestinations) {
  const {eventType, destination, startDatetime, endDatetime, price, typeOffers} = state;

  const destinationObject = getDestinationById(destination);
  const offersObject = typeOffers.map((id) => getOfferById(id));

  const fullStartDate = getFullDate(startDatetime);
  const fullEndDate = getFullDate(endDatetime);

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType.toLowerCase()}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        ${EVENT_TYPES.map((type) => `<div class="event__type-item">
                          <input id="event-type-${type.toLowerCase()}-1" class="event__${type.toLowerCase()}-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}">
                          <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${capitalizeWord(type)}</label>
                        </div>`).join('')}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-${destinationObject.id}">
                    ${eventType}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-${destinationObject.id}" type="text" name="event-destination" value="${destinationObject.name}" list="destination-list-${destinationObject.id}" required>
                    <datalist id="destination-list-${destinationObject.id}">
                      ${allDestinations.map((city) => `<option value="${city.name}"></option>`).join('')}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${fullStartDate}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${fullEndDate}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  ${offersObject.length > 0 ? `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                    ${offersObject.map((offer) => `<div class="event__offer-selector">
                      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.toLowerCase()}-1" type="checkbox" name="event-offer-${offer.title.toLowerCase()}">
                      <label class="event__offer-label" for="event-offer-${offer.title.toLowerCase()}-1">
                        <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`).join('')}
                    </div>
                  </section>` : ''}

                  ${destinationObject.description !== '' || destinationObject.pictures.length > 0 ? `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destinationObject.description}</p>
                    <div class="event__photos-container event__photos-tape">
                      ${destinationObject.pictures.map((picture) => `<img class="event__photo" src="${picture.src}">`).join('')}
                    </div>
                  </section>` : ''}
                </section>
              </form>
            </li>`;
}

export default class PointEditorView extends AbstractStatefulView {
  #initialPoint = null;
  #allOffers = null;
  #allDestinations = [];
  #handleFormSubmit = null;
  #handleEditRollUp = null;
  #datePickerStart = null;
  #datePickerEnd = null;

  constructor({point, typeOffers, pointDestination, allOffers, allDestinations, onFormSubmit, onEditRollUp}) {
    super();
    this.#initialPoint = point;
    this._setState(PointEditorView.parsePointToState(point, pointDestination, typeOffers));
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditRollUp = onEditRollUp;
    this._restoreHandlers();
  }

  get template() {
    return createFormEditorTemplate(this._state, this.#allDestinations);
  }

  reset = (point) => this.updateElement(point);

  removeElement() {
    super.removeElement();

    if (this.#datePickerStart) {
      this.#datePickerEnd.destroy();
      this.#datePickerStart = null;
    }

    if (this.#datePickerEnd) {
      this.#datePickerStart.destroy();
      this.#datePickerEnd = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editRollUpHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeListChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);

    this.#setDatePickerStart();
    this.#setDatePickerEnd();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #editRollUpHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditRollUp();
  };

  #typeListChangeHandler = (evt) => {
    evt.preventDefault();
    const targetType = evt.target.value;
    const typeOffers = this.#allOffers.find((item) => item.type === targetType).offers.map((offer) => offer.id);
    this.updateElement({
      eventType: targetType,
      typeOffers: typeOffers
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const targetDestination = evt.target.value;
    const newDestination = this.#allDestinations.find((item) => item.name === targetDestination);
    this.updateElement({
      destination: newDestination.id
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    const newPrice = evt.target.value;
    this._setState({
      basePrice: newPrice
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      startDatetime: userDate
    });
    this.#datePickerEnd.set('minDate', this._state.startDatetime);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      endDatetime: userDate
    });
    this.#datePickerStart.set('maxDate', this._state.endDatetime);
  };

  #setDatePickerStart() {
    this.#datePickerStart = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.startDatetime,
        onChange: this.#dateFromChangeHandler,
        maxDate: this._state.endDatetime
      }
    );
  }

  #setDatePickerEnd() {
    this.#datePickerEnd = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.endDatetime,
        onChange: this.#dateToChangeHandler,
        minDate: this._state.startDatetime
      }
    );
  }

  static parsePointToState(point, pointDestination, typeOffers) {
    return {
      ...point,
      destination: pointDestination,
      typeOffers
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    return point;
  }
}
