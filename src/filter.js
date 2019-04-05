import Component from "./component";

export default class Filter extends Component {
  constructor({orderNumber, name, text, amount}) {
    super();
    this._orderNumber = orderNumber;
    this._name = name;
    this._text = text;
    this._amount = amount;

    this._element = null;
    this._onFilter = null;

    this._filterItemClickHandler = this._filterItemClickHandler.bind(this);
  }

  _filterItemClickHandler(evt) {
    const target = evt.target;
    return typeof this._onFilter === `function` && this._onFilter(target, this._name);
  }

  get template() {
    return `
    <a href="#${this._name}" class="main-navigation__item ${this._orderNumber === 0 ? `main-navigation__item--active` : ``} ${this._name === `stats` ? `main-navigation__item--additional` : ``}">
      ${this._text}
      ${this._orderNumber !== 0 && this._name !== `stats` ? ` <span class="main-navigation__item-count">${this._amount}</span>` : ``}
    </a>`;
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  createListeners() {
    this._element.addEventListener(`click`, this._filterItemClickHandler);
  }

  removeListeners() {
    this._element.removeEventListener(`click`, this._filterItemClickHandler);
  }
}
