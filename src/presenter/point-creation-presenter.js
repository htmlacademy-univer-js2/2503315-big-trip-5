import PointEditorView from '../view/point-editor-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType, FilterType } from '../const/const.js';
import { getAllOffersByType } from '../utils/utils.js';

export default class PointCreationPresenter {
  #pointListComponent = null;
  #pointEditComponent = null;
  #filterModel = null;
  #pointsModel = null;
  #addButton = null;
  #point = null;
  #handleDataChange = null;
  #handleModeChange = null;

  constructor({ filterModel, pointsModel, addButton, pointListComponent, point, handleDataChange, handleModeChange }) {
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#addButton = addButton;
    this.#pointListComponent = pointListComponent;
    this.#point = point;
    this.#handleDataChange = handleDataChange;
    this.#handleModeChange = handleModeChange;

    this.#addButton.addEventListener('click', this.#handleAddButtonClick);
  }

  init() {
    this.#pointEditComponent = new PointEditorView({
      point: this.#point,
      typeOffers: getAllOffersByType(this.#pointsModel.offers, this.#point.type),
      allOffers: this.#pointsModel.offers,
      allDestinations: this.#pointsModel.destinations,
      onFormSubmit: this.#handleFormSubmit.bind(this),
      onDeleteClick: this.destroy
    });

    this.#pointEditComponent.updateElement({ isPointCreation: true });
    render(this.#pointEditComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  }

  setAborting() {
    this.#pointEditComponent.shake(this.#pointEditComponent.updateElement({ isSaving: false, isDisabled: false }));
  }

  setSaving() {
    this.#pointEditComponent.updateElement({isSaving: true, isDisabled: true });
  }

  destroy = () => {
    remove(this.#pointEditComponent);
    this.#addButton.disabled = false;
  };

  #handleAddButtonClick = () => {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#handleModeChange();
    document.addEventListener('keydown', this.#onEscKeydown);
    this.init();
    this.#addButton.disabled = true;
  };

  #handleFormSubmit = (update) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      update
    );
    if (update.isSaving) {
      this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      document.removeEventListener('keydown', this.#onEscKeydown);
      this.destroy();
    }
  };

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#filterModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);
      this.destroy();
      document.removeEventListener('keydown', this.#onEscKeydown);
    }
  };
}
