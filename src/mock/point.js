import { getRandomInteger, getRandomDates } from '../utils/utils.js';
import { getRandomDestinationId } from './destination.js';
import { getRandomOfferType, getAllOffersByType } from './offer.js';

const MIN_PRICE = 100;
const MAX_PRICE = 1000;

export const getRandomPoint = () => {
  const dates = getRandomDates();
  const offerType = getRandomOfferType();

  return {
    id: crypto.randomUUID(),
    eventType: offerType,
    destination: getRandomDestinationId(),
    startDatetime: dates[0],
    endDatetime: dates[1],
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    offers: getAllOffersByType(offerType),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
