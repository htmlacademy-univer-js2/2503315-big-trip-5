import AbstractView from '../framework/view/abstract-view.js';

function createFilterTemplate(filters) {
  return `<div class="trip-main__trip-controls  trip-controls">
            <div class="trip-controls__filters">
              <h2 class="visually-hidden">Filter events</h2>
              <form class="trip-filters" action="#" method="get">

                ${filters.map((filter) => `<div class="trip-filters__filter">
                  <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.type}"
                  ${filter.count === 0 ? 'disabled' : ''} ${filter.type === 'everything' ? 'checked' : ''}>
                  <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}</label>
                </div>`).join('')}

                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>
            </div>
          </div>`;
}

export default class FilterView extends AbstractView {
  #filters = null;

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
