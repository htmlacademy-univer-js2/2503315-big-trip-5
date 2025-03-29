import { isActualPoint, isFuturePoint, isExpiredPoint } from '../utils/utils.js';

const FiltersPoint = {
  EVERYTHING: 'everything',
  PRESENT: 'present',
  PAST: 'past',
  FUTURE: 'future'
};

const filter = {
  [FiltersPoint.EVERYTHING]: (points) => points,
  [FiltersPoint.PRESENT]: (points) => points.filter((point) => isActualPoint(point.startDatetime, point.endDatetime)),
  [FiltersPoint.PAST]: (points) => points.filter((point) => isExpiredPoint(point.endDatetime)),
  [FiltersPoint.FUTURE]: (points) => points.filter((point) => isFuturePoint(point.startDatetime)),
};

export {FiltersPoint, filter};
