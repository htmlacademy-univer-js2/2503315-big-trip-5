import {getRandomArrayElement, getRandomInteger, getRandomDates} from '../utils/utils.js';
import { EVENT_TYPES } from '../const/points-const.js';
import { getRandomDestination } from './destination.js';
import { getRandomOffer } from './offer.js';
import { nanoid } from 'nanoid';

const MIN_PRICE = 1000;
const MAX_PRICE = 3000;
const OFFERS_MIN_COUNT = 1;
const OFFERS_MAX_COUNT = 5;

export const getRandomPoint = () => {
  const dates = getRandomDates();

  return {
    id: nanoid(),
    eventType: getRandomArrayElement(EVENT_TYPES),
    destination: getRandomDestination(),
    startDatetime: dates[0],
    endDatetime: dates[1],
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    offers: Array.from({ length: getRandomInteger(OFFERS_MIN_COUNT, OFFERS_MAX_COUNT) }, getRandomOffer),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
