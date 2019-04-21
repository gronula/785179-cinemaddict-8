import Component from "./component";

export default class Filter extends Component {
  constructor() {
    super();

    this._element = null;
    this._onSearch = null;

    this._searchFieldInputHandler = this._searchFieldInputHandler.bind(this);
  }

  _searchFieldInputHandler(evt) {
    return typeof this._onSearch === `function` && this._onSearch(evt);
  }

  get template() {
    return `
    <form class="header__search search">
      <input type="text" name="search" class="search__field" placeholder="Search" autocomplete="off">
      <button type="submit" class="visually-hidden">Search</button>
    </form>`;
  }

  set onSearch(fn) {
    this._onSearch = fn;
  }

  createListeners() {
    this._element.addEventListener(`input`, this._searchFieldInputHandler);
  }

  removeListeners() {
    this._element.removeEventListener(`input`, this._searchFieldInputHandler);
  }
}
