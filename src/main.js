import MainPresenter from './presenter/main-presenter';

const container = document.querySelector('.trip-events');
new MainPresenter(container).init();
