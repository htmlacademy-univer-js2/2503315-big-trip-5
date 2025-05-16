import PointView from '../view/point-view.js';
import PointEditorView from '../view/point-editor-view.js';
import { render, replace, remove } from '../framework/render.js';
import { Mode, UserAction, UpdateType } from '../const/const.js';

export default class PointPresenter {
  #point = null;
  #pointListComponent = null;
  #editForm = null;
  #pointItem = null;
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
    const prevPointItem = this.#pointItem;
    const prevEditForm = this.#editForm;

    this.#pointItem = new PointView({
      point: this.#point,
      destinations: this.#allDestinations,
      offers: this.#allOffers,
      onRollButtonClick: this.#handleRollButtonClick.bind(this),
      onFavoriteButtonClick: this.#handleFavoriteButtonClick
    });

    this.#editForm = new PointEditorView({
      point: this.#point,
      typeOffers: this.#typeOffers,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,

      onFormSubmit: this.#handleFormSubmit.bind(this),
      onDeleteClick: this.#handleDeleteButtonClick,
      onEditRollUp: this.#replaceEditFormToPoint.bind(this)
    });

    if (!prevPointItem || !prevEditForm) {
      render(this.#pointItem, this.#pointListComponent.element);
      return;
    }

    if (this.#pointListComponent.element.contains(prevPointItem.element)) {
      replace(this.#pointItem, prevPointItem);
    }

    if (this.#pointListComponent.element.contains(prevEditForm.element)) {
      replace(this.#editForm, prevEditForm);
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
    remove(this.#pointItem);
    remove(this.#editForm);
  }

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#onEscKeydown);
    }
  };

  #replacePointToEditForm() {
    replace(this.#editForm, this.#pointItem);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToPoint() {
    this.#editForm.reset(this.#point);
    document.removeEventListener('keydown', this.#onEscKeydown);
    replace(this.#pointItem, this.#editForm);
    this.#mode = Mode.DEFAULT;
  }

  #handleRollButtonClick() {
    this.#replacePointToEditForm();
    document.addEventListener('keydown', this.#onEscKeydown);
  }

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

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointItem.shake();
      return;
    }
    this.#editForm.shake(this.#editForm.updateElement({ isDisabled: false, isSaving: false, isDeleting: false }));
  }
}
