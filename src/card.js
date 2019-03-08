import createElement from './create-element';

export default class Card {
  constructor({title, rating, year, duration, genre, posterFile, commentsAmount, description, isWatchlistAdded, isWatched, isFavourite}) {
    this._title = title;
    this._rating = rating;
    this._year = year;
    this._duration = duration;
    this._genre = genre;
    this._posterFile = posterFile;
    this._commentsAmount = commentsAmount;
    this._description = description;
    this._isWatchlistAdded = isWatchlistAdded;
    this._isWatched = isWatched;
    this._isFavourite = isFavourite;

    this._element = null;
    this._onClick = null;
    this._commentsClickHandler = this._commentsClickHandler.bind(this);
  }

  _getTemplate(hasControls) {
    return `
    <article class="film-card  ${hasControls ? `` : `film-card--no-controls`}">
      <h3 class="film-card__title">${this._title}</h3>
      <p class="film-card__rating">${this._rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${this._year}</span>
        <span class="film-card__duration">${this._duration}</span>
        <span class="film-card__genre">${this._genre}</span>
      </p>
      <img src="./images/posters/${this._posterFile}" alt="" class="film-card__poster">
      ${hasControls ? `<p class="film-card__description">${this._description}</p>` : ``}
      <button class="film-card__comments">${this._commentsAmount} comments</button>

      ${hasControls ? `
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>` : ``}
    </article>`;
  }

  _commentsClickHandler(evt) {
    evt.preventDefault();
    return typeof this._onClick === `function` && this._onClick();
  }

  get element() {
    return this._element;
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  bind() {
    const comments = this._element.querySelector(`.film-card__comments`);
    comments.addEventListener(`click`, this._commentsClickHandler);
  }

  render(hasControls) {
    const markup = this._getTemplate(hasControls);
    this._element = createElement(markup);

    this.bind();

    return this._element;
  }
}
