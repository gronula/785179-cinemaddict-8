import Component from "./component";
import moment from 'moment';

export default class Card extends Component {
  constructor({hasControls, title, rating, userRating, releaseDate, duration, genre, posterFile, comments, description, isWatchlistAdded, isWatched, isFavourite}) {
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
    this._isWatchlistAdded = isWatchlistAdded;
    this._isWatched = isWatched;
    this._isFavourite = isFavourite;

    this._element = null;
    this._onClick = null;
    this._commentsClickHandler = this._commentsClickHandler.bind(this);
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

  set onClick(fn) {
    this._onClick = fn;
  }

  createListeners() {
    const comments = this._element.querySelector(`.film-card__comments`);
    comments.addEventListener(`click`, this._commentsClickHandler);
  }

  update(data) {
    this._userRating = data.userRating;
    this._comments = data.comments;
    this._isWatchlistAdded = data.isWatchlistAdded;
    this._isWatched = data.isWatched;
    this._isFavourite = data.isFavourite;
  }
}
