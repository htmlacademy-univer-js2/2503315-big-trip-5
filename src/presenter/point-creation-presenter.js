import PointEditorView from '../view/point-editor-view';
import { render, remove, RenderPosition } from '../framework/render';
import { UserAction, UpdateType } from '../const/const';
import { getAllOffersByType } from '../utils/utils';

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

    render(this.#pointEditComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #handleAddButtonClick = () => {
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
    this.#filterModel.setFilter(UpdateType.MAJOR, 'everything');
    document.removeEventListener('keydown', this.#onEscKeydown);
    this.destroy();
  };

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
      document.removeEventListener('keydown', this.#onEscKeydown);
    }
  };

  destroy = () => {
    remove(this.#pointEditComponent);
    this.#addButton.disabled = false;
  };

  setAborting() {
    /*const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };*/

    this.#pointEditComponent.shake();
  }
}
