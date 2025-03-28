import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import PointView from '../view/point-view.js';
import PointListView from '../view/point-list-view.js';
import PointCreationView from '../view/point-creation-view.js';
import PointEditorView from '../view/point-editor-view.js';
import {render} from '../render.js';

export default class MainPresenter {
  pointListComponent = new PointListView();

  constructor(filtersContainer, eventsContainer, pointsModel) {
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.getPoints()];

    render(this.pointListComponent, this.eventsContainer);
    render(new PointEditorView({point: this.points[0]}), this.pointListComponent.getElement());
    render(new SortView(), this.eventsContainer);
    render(new FilterView(), this.filtersContainer);

    for (let i = 1; i < this.points.length; i++) {
      render(new PointView({point: this.points[i]}), this.pointListComponent.getElement());
    }

    render(new PointCreationView(), this.pointListComponent.getElement());
  }
}
