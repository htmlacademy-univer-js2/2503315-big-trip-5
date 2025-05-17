import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getFullDate, capitalizeWord, getDestinationById, getOfferById } from '../utils/utils.js';
import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createFormEditorTemplate(state, allDestinations, allOffers, typeOffers) {
  const {type, destination, dateFrom, dateTo, basePrice, offers, isSaving, isDeleting, isDisabled} = state;

  const pointDestination = getDestinationById(allDestinations, destination);
  const pointOffers = typeOffers.map((item) => getOfferById(allOffers, item));
  const eventTypes = Array.from(allOffers.map((item) => item.type));

  const isValid = getFullDate(dateFrom) !== 'Invalid Date';
  const fullStartDate = isValid ? getFullDate(dateFrom) : '';
  const fullEndDate = isValid ? getFullDate(dateTo) : '';

  const deleteText = isDeleting ? 'Deleting...' : 'Delete';
  const saveText = isSaving ? 'Saving...' : 'Save';

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        ${eventTypes.map((item) => `<div class="event__type-item">
                          <input id="event-type-${item.toLowerCase()}-1" class="event__${item.toLowerCase()}-input ${isDisabled ? 'disabled' : ''} visually-hidden" type="radio" name="event-type" value="${item.toLowerCase()}">
                          <label class="event__type-label  event__type-label--${item.toLowerCase()}" for="event-type-${item.toLowerCase()}-1">${capitalizeWord(item)}</label>
                        </div>`).join('')}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                    ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" ${isDisabled ? 'disabled' : ''} name="event-destination" value="${he.encode(pointDestination ? pointDestination.name : '')}" list="destination-list-1" required>
                    <datalist id="destination-list-1">
                      ${allDestinations.map((city) => `<option value="${city.name}"></option>`).join('')}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" ${isDisabled ? 'disabled' : ''} value="${fullStartDate}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" ${isDisabled ? 'disabled' : ''} value="${fullEndDate}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" ${isDisabled ? 'disabled' : ''} value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${saveText}</button>
                  <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${deleteText}</button>
                  ${isValid ? `<button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>` : ''}
                </header>
                <section class="event__details">
                  ${pointOffers.length > 0 ? `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                    ${pointOffers.map((offer) => `<div class="event__offer-selector">
                      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.toLowerCase()}" type="checkbox" value="${offer.id}" name="event-offer-${offer.title.toLowerCase()}" ${offers.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                      <label class="event__offer-label" for="event-offer-${offer.title.toLowerCase()}">
                        <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`).join('')}
                    </div>
                  </section>` : ''}

                  ${pointDestination && (pointDestination.description !== '' || pointDestination.pictures.length) > 0 ? `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${pointDestination.description}</p>
                    <div class="event__photos-container event__photos-tape">
                      ${pointDestination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}">`).join('')}
                    </div>
                  </section>` : ''}
                </section>
              </form>
            </li>`;
}

export default class PointEditorView extends AbstractStatefulView {
  #initialPoint = null;
  #typeOffers = null;
  #allOffers = null;
  #allDestinations = [];
  #handleFormSubmit = null;
  #handleEditRollUp = null;
  #handleEditDelete = null;
  #datePickerStart = null;
  #datePickerEnd = null;

  constructor({point, typeOffers, allOffers, allDestinations, onFormSubmit, onDeleteClick, onEditRollUp = null}) {
    super();
    this.#initialPoint = point;
    this.#typeOffers = typeOffers;
    this._setState(PointEditorView.parsePointToState(point, point.destination));
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditDelete = onDeleteClick;
    this.#handleEditRollUp = onEditRollUp;
    this._restoreHandlers();
  }

  get template() {
    return createFormEditorTemplate(this._state, this.#allDestinations, this.#allOffers, this.#typeOffers);
  }

  reset = (point) => this.updateElement(point);

  _restoreHandlers() {
    if (this.#handleEditRollUp) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editRollUpHandler);
    }

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#editDeleteHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeListChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);

    const typeOffers = this.element.querySelectorAll('.event__offer-checkbox');
    typeOffers.forEach((offer) => offer.addEventListener('change', this.#offersChangeHandler));
    this.#setDatePickerStart();
    this.#setDatePickerEnd();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this._state);
  };

  #editDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditDelete(this.#initialPoint);
  };

  #editRollUpHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditRollUp();
  };

  #typeListChangeHandler = (evt) => {
    evt.preventDefault();
    const targetType = evt.target.value;
    const typeOffers = this.#allOffers.find((item) => item.type === targetType).offers.map((offer) => offer.id);
    this.#typeOffers = typeOffers;
    this.updateElement({
      type: targetType,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const targetDestination = evt.target.value;
    const newDestination = this.#allDestinations.find((item) => item.name === targetDestination);
    if (newDestination) {
      this.updateElement({
        destination: newDestination.id
      });
    } else {
      evt.target.value = '';
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    evt.target.value = Number(evt.target.value.replace(/[^0-9]/g, ''));
    const newPrice = Number(evt.target.value);
    this._setState({
      basePrice: newPrice
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate
    });
    this.#datePickerEnd.set('minDate', this._state.dateFrom);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate
    });
    this.#datePickerStart.set('maxDate', this._state.dateTo);
  };

  #offersChangeHandler = (evt) => {
    const offers = this._state.offers;
    const checkedOffers = offers.includes(evt.target.value)
      ? offers.filter((offerId) => offerId !== evt.target.value)
      : [...offers, evt.target.value];
    this._setState({ offers: checkedOffers });
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

  static parsePointToState(point, pointDestination) {
    return {
      ...point,
      destination: pointDestination
    };
  }
}
