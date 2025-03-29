import AbstractView from '../framework/view/abstract-view';

function createEmptyPointListTemplate() {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}

export default class EmptyPointListView extends AbstractView {
  get template() {
    return createEmptyPointListTemplate();
  }
}
