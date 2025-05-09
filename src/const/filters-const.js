import { isActualPoint, isFuturePoint, isExpiredPoint } from '../utils/utils.js';

const FILTER_TYPES = {
  EVERYTHING: 'everything',
  PRESENT: 'present',
  PAST: 'past',
  FUTURE: 'future'
};

const filter = {
  [FILTER_TYPES.EVERYTHING]: (points) => points,
  [FILTER_TYPES.PRESENT]: (points) => points.filter((point) => isActualPoint(point.startDatetime, point.endDatetime)),
  [FILTER_TYPES.PAST]: (points) => points.filter((point) => isExpiredPoint(point.endDatetime)),
  [FILTER_TYPES.FUTURE]: (points) => points.filter((point) => isFuturePoint(point.startDatetime)),
};

const SORT_TYPES = {
  DAY: 'day',
  PRICE: 'price',
  TIME: 'time'
};

export {filter, SORT_TYPES};
