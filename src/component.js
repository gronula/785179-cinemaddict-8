import createElement from './create-element';

export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._element = null;
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  createListeners() {}

  removeListeners() {}

  render() {
    const markup = this.template;
    this._element = createElement(markup);

    this.createListeners();

    return this._element;
  }

  unrender() {
    this.removeListeners();

    this._element = null;
  }

  update() {}
}
