import SortView from '../view/sort-view';
import FilterView from '../view/filter-view';
import PointView from '../view/point-view';
import FormCreationView from '../view/form-creation-view';
import FormEditorView from '../view/form-editor-view';
import { render } from '../render';

export default class MainPresenter {
  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(new FormEditorView(), this.container);
    render(new FormCreationView(), this.container);
    render(new SortView(), this.container);
    render(new FilterView(), this.container);
    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.container);
    }
  }
}
