import Observable from '../framework/observable.js';
import { FilterType } from '../const/const.js';

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter ? filter : this.#filter;
    this._notify(updateType, filter);
  }
}
