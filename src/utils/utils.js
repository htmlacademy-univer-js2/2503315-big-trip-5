import { FilterType } from '../const/const';
import dayjs from 'dayjs';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
};

const capitalizeWord = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const getRandomDates = () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 10 * (Math.random() < 0.5 ? -1 : 1)));

  startDate.setHours(Math.floor(Math.random() * 24));
  startDate.setMinutes(Math.floor(Math.random() * 60));
  startDate.setSeconds(0);

  const daysDifference = Math.floor(Math.random() * 10);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + daysDifference + 1);

  endDate.setHours(Math.floor(Math.random() * 24));
  endDate.setMinutes(Math.floor(Math.random() * 60));

  return [startDate, endDate];
};

const getDateDifference = (date1, date2) => {
  const start = dayjs(date1);
  const end = dayjs(date2);
  let diff = Math.abs(end.diff(start, 'minute'));

  const days = Math.floor(diff / (24 * 60));
  diff -= days * 24 * 60;
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  if (days > 0) {
    return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  } else if (hours > 0) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  } else {
    return `${String(minutes).padStart(2, '0')}M`;
  }
};

const getTime = (date) => dayjs(date).format('HH:mm');

const getMonthAndDate = (date) => dayjs(date).format('MMM DD');

const getFullDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const isFuturePoint = (date) => dayjs().isBefore(date);

const isExpiredPoint = (date) => dayjs().isAfter(date);

const isActualPoint = (dateFrom, dateTo) => dayjs().isBefore(dateTo) && dayjs().isAfter(dateFrom);

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PRESENT]: (points) => points.filter((point) => isActualPoint(point.startDatetime, point.endDatetime)),
  [FilterType.PAST]: (points) => points.filter((point) => isExpiredPoint(point.endDatetime)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point.startDatetime)),
};

const updatePoint = (points, updatedPoint) => points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);

const sortByDay = (pointA, pointB) => dayjs(pointB.startDatetime).diff(dayjs(pointA.startDatetime));

const sortByTime = (pointA, pointB) => dayjs(pointB.endDatetime).diff(pointB.startDatetime) - dayjs(pointA.endDatetime).diff(pointA.startDatetime);

const sortByPrice = (pointA, pointB) => pointB.price - pointA.price;


export {
  getRandomArrayElement,
  getRandomInteger,
  capitalizeWord,
  getRandomDates,
  getTime,
  getMonthAndDate,
  getFullDate,
  getDateDifference,
  isFuturePoint,
  isActualPoint,
  isExpiredPoint,
  filter,
  updatePoint,
  sortByDay,
  sortByTime,
  sortByPrice};
