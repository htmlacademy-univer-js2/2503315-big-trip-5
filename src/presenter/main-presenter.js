import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import PointView from '../view/point-view.js';
import PointListView from '../view/point-list-view.js';
import PointCreationView from '../view/point-creation-view.js';
import PointEditorView from '../view/point-editor-view.js';
import EmptyPointListView from '../view/empty-point-list-view.js';
import { render, replace } from '../framework/render.js';
import { generateFilters } from '../mock/filters.js';

export default class MainPresenter {
  #pointListComponent = new PointListView();
  #filtersContainer = null;
  #eventsContainer = null;
  #pointsModel = null;
  #points = null;
  #filters = null;

  constructor({filtersContainer, eventsContainer, pointsModel}) {
    this.#filtersContainer = filtersContainer;
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = this.#pointsModel.points;
    this.#filters = generateFilters(this.#points);

    render(this.#pointListComponent, this.#eventsContainer);
    render(new SortView(), this.#eventsContainer);
    render(new FilterView({filters: this.#filters}), this.#filtersContainer);

    if (this.#points.length > 0) {
      this.#points.forEach((point) => this.#renderPoint(point));
    } else {
      render(new EmptyPointListView(), this.#pointListComponent.element);
    }


    render(new PointCreationView(), this.#pointListComponent.element);
  }

  #renderPoint(point) {
    const onEscKeydown = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeydown);
      }
    };

    const editForm = new PointEditorView({point,
      onSubmitClick: () => {
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeydown);
      },
      onRollButtonClick: () => {
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeydown);
      }
    });

    const pointItem = new PointView({point,
      onRollButtonClick: () => {
        replacePointToEditForm();
        document.addEventListener('keydown', onEscKeydown);
      }
    });

    function replacePointToEditForm() {
      replace(editForm, pointItem);
    }

    function replaceEditFormToPoint() {
      replace(pointItem, editForm);
    }

    render(pointItem, this.#pointListComponent.element);
  }
}
