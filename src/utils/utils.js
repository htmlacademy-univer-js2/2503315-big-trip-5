import { FilterType, SortType } from '../const/const';
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

const getDayAndMonth = (date) => dayjs(date).format('D MMM');

const getFullDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const isFuturePoint = (date) => dayjs().isBefore(date);

const isExpiredPoint = (date) => dayjs().isAfter(date);

const isActualPoint = (dateFrom, dateTo) => dayjs().isBefore(dateTo) && dayjs().isAfter(dateFrom);

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PRESENT]: (points) => points.filter((point) => isActualPoint(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isExpiredPoint(point.dateTo)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point.dateFrom)),
};

const getDestinationById = (destinations, id) => destinations.find((item) => item.id === id);

const getOfferById = (offers, id) => {
  for (let i = 0; i < offers.length; i++) {
    const foundOffer = offers[i].offers.find((offer) => offer.id === id);
    if (foundOffer) {
      return foundOffer;
    }
  }
};

const getAllOffersByType = (allOffers, type) => allOffers.find((item) => item.type === type).offers.map((offer) => offer.id);

const sort = {
  [SortType.DAY]: (points) => points.sort((pointA, pointB) => dayjs(pointB.dateFrom).diff(dayjs(pointA.dateFrom))),
  [SortType.TIME]: (points) => points.sort((pointA, pointB) => dayjs(pointB.dateTo).diff(pointB.dateFrom) - dayjs(pointA.dateTo).diff(pointA.dateFrom)),
  [SortType.PRICE]: (points) => points.sort((pointA, pointB) => pointB.basePrice - pointA.basePrice)
};

const getRouteDates = (points) => [getDayAndMonth(points[points.length - 1].dateFrom), getDayAndMonth(points[0].dateTo)];

const getRoute = (points, destinations) => {
  const route = points.map((point) => getDestinationById(destinations, point.destination).name);
  return route.length < 4 ? route.join(' &mdash; ') : `${route[route.length - 1]} &mdash; ... &mdash; ${route[0]}`;
};

const getRoutePrice = (points, offers) => {
  const pointPrices = points.map((point) => Number(point.basePrice));
  const offersPrices = points.map((point) => point.offers.map((offer) => Number(getOfferById(offers, offer).price)));
  const basePrice = pointPrices.reduce((sum, price) => sum + price, 0);
  const additionalPrice = offersPrices.flat().reduce((sum, price) => sum + price, 0);
  return basePrice + additionalPrice;
};

export {
  getRandomArrayElement,
  getRandomInteger,
  capitalizeWord,
  getRandomDates,
  getTime,
  getMonthAndDate,
  getDayAndMonth,
  getFullDate,
  getDateDifference,
  isFuturePoint,
  isActualPoint,
  isExpiredPoint,
  filter,
  sort,
  getDestinationById,
  getOfferById,
  getAllOffersByType,
  getRouteDates,
  getRoute,
  getRoutePrice
};
