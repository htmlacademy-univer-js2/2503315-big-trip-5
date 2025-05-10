import PointView from '../view/point-view.js';
import PointEditorView from '../view/point-editor-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { MODE } from '../const/points-const.js';
import { getAllOffersByType, getAllOffers } from '../mock/offer.js';
import { getAllDestinations } from '../mock/destination.js';

export default class PointPresenter {
  #point = null;
  #pointListComponent = null;
  #editForm = null;
  #pointItem = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = MODE.DEFAULT;

  constructor(pointListComponent, updatePoints, updateMode) {
    this.#pointListComponent = pointListComponent;
    this.#handleDataChange = updatePoints;
    this.#handleModeChange = updateMode;
  }

  init(point) {
    this.#point = point;
    const prevPointItem = this.#pointItem;
    const prevEditForm = this.#editForm;

    this.#pointItem = new PointView({point: this.#point,
      onRollButtonClick: () => {
        this.#replacePointToEditForm();
        document.addEventListener('keydown', this.#onEscKeydown);
      },
      onFavoriteButtonClick: () => this.#handleDataChange({...point, isFavorite: !point.isFavorite})
    });

    this.#editForm = new PointEditorView({
      point: this.#point,
      typeOffers: getAllOffersByType(point.eventType),
      pointDestination: point.destination,
      allOffers: getAllOffers(),
      allDestinations: getAllDestinations(),
      onFormSubmit: () => {
        this.#editForm.reset(this.#point);
        this.#pointSubmitHandler();
      },
      onEditRollUp: () => {
        this.#editForm.reset(this.#point);
        this.#replaceEditFormToPoint();
      }
    });

    if (!prevPointItem || !prevEditForm) {
      render(this.#pointItem, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
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
    if (this.#mode !== MODE.DEFAULT) {
      this.#editForm.reset(this.#point);
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
      this.#editForm.reset(this.#point);
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#onEscKeydown);
    }
  };

  #replacePointToEditForm() {
    replace(this.#editForm, this.#pointItem);
    this.#handleModeChange();
    this.#mode = MODE.EDITING;
  }

  #replaceEditFormToPoint() {
    replace(this.#pointItem, this.#editForm);
    this.#mode = MODE.DEFAULT;
  }

  #pointSubmitHandler() {
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#onEscKeydown);
  }
}
