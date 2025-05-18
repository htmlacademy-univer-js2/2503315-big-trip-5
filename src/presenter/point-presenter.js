import PointView from '../view/point-view.js';
import PointEditorView from '../view/point-editor-view.js';
import { render, replace, remove } from '../framework/render.js';
import { Mode, UserAction, UpdateType } from '../const/const.js';

export default class PointPresenter {
  #point = null;
  #pointListComponent = null;
  #editFormComponent = null;
  #pointComponent = null;
  #handlePointChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;
  #typeOffers = null;
  #allOffers = null;
  #allDestinations = null;

  constructor({ pointListComponent, typeOffers, allOffers, allDestinations, handlePointChange, handleModeChange }) {
    this.#pointListComponent = pointListComponent;
    this.#typeOffers = typeOffers;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handlePointChange = handlePointChange;
    this.#handleModeChange = handleModeChange;
  }

  init(point) {
    this.#point = point;
    const prevPointItem = this.#pointComponent;
    const prevEditForm = this.#editFormComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      destinations: this.#allDestinations,
      offers: this.#allOffers,
      handleRollButtonClick: this.#handleRollButtonClick.bind(this),
      handleFavoriteButtonClick: this.#handleFavoriteButtonClick
    });

    this.#editFormComponent = new PointEditorView({
      point: this.#point,
      typeOffers: this.#typeOffers,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,

      handleFormSubmit: this.#handleFormSubmit.bind(this),
      handleDeleteButtonClick: this.#handleDeleteButtonClick,
      handleEditRollUp: this.#replaceEditFormToPoint.bind(this)
    });

    if (!prevPointItem || !prevEditForm) {
      render(this.#pointComponent, this.#pointListComponent.element);
      return;
    }

    if (this.#pointListComponent.element.contains(prevPointItem.element)) {
      replace(this.#pointComponent, prevPointItem);
    }

    if (this.#pointListComponent.element.contains(prevEditForm.element)) {
      replace(this.#editFormComponent, prevEditForm);
    }

    remove(prevPointItem);
    remove(prevEditForm);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditFormToPoint();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }
    this.#editFormComponent.shake(this.#editFormComponent.updateElement({ isDisabled: false, isSaving: false, isDeleting: false }));
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.updateElement({ isDisabled: true, isSaving: true });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.updateElement({ isDisabled: true, isDeleting: true });
    }
  }

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#onEscKeydown);
    }
  };

  #replacePointToEditForm() {
    replace(this.#editFormComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToPoint() {
    this.#editFormComponent.reset(this.#point);
    document.removeEventListener('keydown', this.#onEscKeydown);
    replace(this.#pointComponent, this.#editFormComponent);
    this.#mode = Mode.DEFAULT;
  }

  #handleRollButtonClick = () => {
    this.#replacePointToEditForm();
    document.addEventListener('keydown', this.#onEscKeydown);
  };

  #handleFormSubmit = async (update) => {
    await this.#handlePointChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update
    );
    if (update.isSaving) {
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#onEscKeydown);
    }
  };

  #handleFavoriteButtonClick = (point) => {
    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...point, isFavorite: !point.isFavorite}
    );
  };

  #handleDeleteButtonClick = (point) => {
    this.#handlePointChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };
}
