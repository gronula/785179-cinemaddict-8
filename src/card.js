import Component from "./component";
import moment from 'moment';

export default class Card extends Component {
  constructor({hasControls, title, rating, userRating, releaseDate, duration, genre, posterFile, comments, description, isWatchlistAdded, isWatched, isFavorite}) {
    super();
    this._hasControls = hasControls;
    this._title = title;
    this._rating = rating;
    this._userRating = userRating;
    this._releaseDate = releaseDate;
    this._duration = duration;
    this._genre = genre;
    this._posterFile = posterFile;
    this._comments = comments;
    this._description = description;
    this._state = {
      isWatchlistAdded,
      isWatched,
      isFavorite
    };

    this._element = null;
    this._onClick = null;
    this._onAddToWatchList = null;
    this._onMarkAsWatched = null;
    this._commentsClickHandler = this._commentsClickHandler.bind(this);
    this._addToWatchListButtonClickHandler = this._addToWatchListButtonClickHandler.bind(this);
    this._markAsWatchedButtonClickHandler = this._markAsWatchedButtonClickHandler.bind(this);
    this._markAsFavoriteButtonClickHandler = this._markAsFavoriteButtonClickHandler.bind(this);
  }

  get template() {
    return `
    <article class="film-card  ${this._hasControls ? `` : `film-card--no-controls`}">
      <h3 class="film-card__title">${this._title}</h3>
      <p class="film-card__rating">${this._rating}</p>
      <p class="film-card__info">
        <span class="film-card__releaseDate">${moment(this._releaseDate, `D MMMM Y hh:mm A`).format(`D MMMM Y`)}</span>
        <span class="film-card__duration">${this._duration}</span>
        <span class="film-card__genre">${this._genre}</span>
      </p>
      <img src="./images/posters/${this._posterFile}" alt="" class="film-card__poster">
      ${this._hasControls ? `<p class="film-card__description">${this._description}</p>` : ``}
      <button class="film-card__comments">${this._comments.length} comments</button>

      ${this._hasControls ? `
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite" type="button">Mark as favorite</button>
      </form>` : ``}
    </article>`;
  }

  _commentsClickHandler(evt) {
    evt.preventDefault();
    return typeof this._onClick === `function` && this._onClick();
  }

  _addToWatchListButtonClickHandler() {
    this._state.isWatchlistAdded = !this._state.isWatchlistAdded;

    if (typeof this._onAddToWatchList === `function`) {
      this._onAddToWatchList(this._state);
    }
  }

  _markAsWatchedButtonClickHandler() {
    this._state.isWatched = !this._state.isWatched;

    if (typeof this._onMarkAsWatched === `function`) {
      this._onMarkAsWatched(this._state);
    }
  }

  _markAsFavoriteButtonClickHandler() {
    this._state.isFavorite = !this._state.isFavorite;

    if (typeof this._onMarkAsFavorite === `function`) {
      this._onMarkAsFavorite(this._state);
    }
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  set onAddToWatchList(fn) {
    this._onAddToWatchList = fn;
  }

  set onMarkAsWatched(fn) {
    this._onMarkAsWatched = fn;
  }

  set onMarkAsFavorite(fn) {
    this._onMarkAsFavorite = fn;
  }

  createListeners() {
    const comments = this._element.querySelector(`.film-card__comments`);
    const addToWatchListButton = this._element.querySelector(`.film-card__controls-item--add-to-watchlist`);
    const markAsWatchedButton = this._element.querySelector(`.film-card__controls-item--mark-as-watched`);
    const markAsFavoriteButton = this._element.querySelector(`.film-card__controls-item--favorite`);

    comments.addEventListener(`click`, this._commentsClickHandler);

    if (this._hasControls) {
      addToWatchListButton.addEventListener(`click`, this._addToWatchListButtonClickHandler);
      markAsWatchedButton.addEventListener(`click`, this._markAsWatchedButtonClickHandler);
      markAsFavoriteButton.addEventListener(`click`, this._markAsFavoriteButtonClickHandler);
    }
  }

  update(data) {
    this._state.isWatchlistAdded = data.isWatchlistAdded;
    this._state.isWatched = data.isWatched;
    this._state.isFavorite = data.isFavorite;
  }
}
