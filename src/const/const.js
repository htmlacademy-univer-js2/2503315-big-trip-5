import { getAllOffersByType } from '../mock/offer';

const FilterType = {
  EVERYTHING: 'everything',
  PRESENT: 'present',
  PAST: 'past',
  FUTURE: 'future'
};

const SortType = {
  DAY: 'day',
  PRICE: 'price',
  TIME: 'time'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

const NoPointMessages = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now'
};

const NEW_POINT = {
  id: crypto.randomUUID(),
  eventType: 'flight',
  destination: '',
  startDatetime: '',
  endDatetime: '',
  price: 0,
  offers: getAllOffersByType('flight'),
  isFavorite: false
};

export {FilterType, SortType, Mode, UserAction, UpdateType, NoPointMessages, NEW_POINT};
