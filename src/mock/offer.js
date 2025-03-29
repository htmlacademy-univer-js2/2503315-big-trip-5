import {getRandomArrayElement, getRandomInteger} from '../utils/utils.js';
import { EVENT_TYPES, OFFERS } from '../const/points-const.js';

const MIN_PRICE = 10;
const MAX_PRICE = 1000;
function getRandomOffer() {
  return {
    type: getRandomArrayElement(EVENT_TYPES),
    title: getRandomArrayElement(OFFERS),
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
  };
}

export { getRandomOffer };
