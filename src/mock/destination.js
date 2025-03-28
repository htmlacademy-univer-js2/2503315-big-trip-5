import {getRandomArrayElement, getRandomInteger} from '../utils/utils.js';
import {CITIES, DESCRIPTIONS} from '../const.js';

const MIN_DESCRIPTION_COUNT = 1;
const MAX_DESCRIPTION_COUNT = 5;
const MIN_PICTURE_COUNT = 1;
const MAX_PICTURE_COUNT = 5;

const getRandomDestination = () => ({
  description: Array.from({length: getRandomInteger(MIN_DESCRIPTION_COUNT, MAX_DESCRIPTION_COUNT)}, () => getRandomArrayElement(DESCRIPTIONS)).join(' '),
  city: getRandomArrayElement(CITIES),
  pictures: Array.from({length: getRandomInteger(MIN_PICTURE_COUNT, MAX_PICTURE_COUNT)}, () => `https://loremflickr.com/248/152?random=${getRandomInteger(1, 1000)}`),
});

export {getRandomDestination};
