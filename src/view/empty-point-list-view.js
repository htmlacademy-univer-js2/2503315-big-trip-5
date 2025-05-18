import AbstractView from '../framework/view/abstract-view.js';
import { NoPointMessages } from '../const/const.js';

function createEmptyPointListTemplate(filterType) {
  return `<p class="trip-events__msg">${NoPointMessages[filterType.toUpperCase()]}</p>`;
}

export default class EmptyPointListView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyPointListTemplate(this.#filterType.filterType);
  }
}
