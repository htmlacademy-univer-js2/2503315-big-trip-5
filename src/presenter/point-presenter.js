import PointView from '../view/point-view.js';
import PointEditorView from '../view/point-editor-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { MODE } from '../const/points-const.js';

export default class PointPresenter {
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
    const prevPointItem = this.#pointItem;
    const prevEditForm = this.#editForm;
    this.#pointItem = new PointView({point,
      onRollButtonClick: () => {
        this.#replacePointToEditForm();
        document.addEventListener('keydown', this.#onEscKeydown);
      },
      onFavoriteButtonClick: () => this.#handleDataChange({...point, isFavorite: !this.#pointItem.isFavorite})
    });

    this.#editForm = new PointEditorView({point,
      onSubmitClick: () => this.#pointSubmitHandler(),
      onRollButtonClick: () => {
        this.#replaceEditFormToPoint();
        document.removeEventListener('keydown', this.#onEscKeydown);
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
