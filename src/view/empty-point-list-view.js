import AbstractView from '../framework/view/abstract-view';
import { NoPointMessages } from '../const/const';

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
