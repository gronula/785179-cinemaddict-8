import Component from "./component";
import moment from 'moment';

export default class Card extends Component {
  constructor({hasControls, id, comments, filmInfo, userDetails}) {
    super();

    this._hasControls = hasControls;
    this._id = id;
    this._comments = comments;
    this._filmInfo = {
      actors: filmInfo.actors,
      ageRating: filmInfo.ageRating,
      alternativeTitle: filmInfo.alternativeTitle,
      description: filmInfo.description,
      director: filmInfo.director,
      genre: filmInfo.genre,
      poster: filmInfo.poster,
      release: {
        date: filmInfo.release.date,
        releaseCountry: filmInfo.release.releaseCountry,
      },
      runtime: filmInfo.runtime,
      title: filmInfo.title,
      totalRating: filmInfo.totalRating,
      writers: filmInfo.writers,
    };
    this._userDetails = {
      watchlist: userDetails.watchlist,
      alreadyWatched: userDetails.alreadyWatched,
      favorite: userDetails.favorite,
      personalRating: userDetails.personalRating,
      watchingDate: userDetails.watchingDate,
      userName: userDetails.userName,
    };

    this._element = null;
    this._onClick = null;
    this._onAddToWatchList = null;
    this._onMarkAsWatched = null;
    this._onMarkAsFavorite = null;
    this._commentsClickHandler = this._commentsClickHandler.bind(this);
    this._addToWatchListButtonClickHandler = this._addToWatchListButtonClickHandler.bind(this);
    this._markAsWatchedButtonClickHandler = this._markAsWatchedButtonClickHandler.bind(this);
    this._markAsFavoriteButtonClickHandler = this._markAsFavoriteButtonClickHandler.bind(this);
  }

  get template() {
    return `
    <article class="film-card  ${this._hasControls ? `` : `film-card--no-controls`}">
      <h3 class="film-card__title">${this._filmInfo.title}</h3>
      <p class="film-card__rating">${this._filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__releaseDate">${moment(this._filmInfo.release.date).format(`D MMMM Y`)}</span>
        <span class="film-card__duration">${moment.utc(moment.duration(this._filmInfo.runtime, `m`).asMilliseconds()).format(`h:mm`)}</span>
        <span class="film-card__genre">${this._filmInfo.genre.join(`, `)}</span>
      </p>
      <img src="${this._filmInfo.poster}" alt="" class="film-card__poster">
      ${this._hasControls ? `<p class="film-card__description">${this._filmInfo.description}</p>` : ``}
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
    this._userDetails.watchlist = !this._userDetails.watchlist;

    if (typeof this._onAddToWatchList === `function`) {
      this._onAddToWatchList(this._userDetails);
    }
  }

  _markAsWatchedButtonClickHandler() {
    this._userDetails.alreadyWatched = !this._userDetails.alreadyWatched;

    if (typeof this._onMarkAsWatched === `function`) {
      this._onMarkAsWatched(this._userDetails);
    }
  }

  _markAsFavoriteButtonClickHandler() {
    this._userDetails.favorite = !this._userDetails.favorite;

    if (typeof this._onMarkAsFavorite === `function`) {
      this._onMarkAsFavorite(this._userDetails);
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
    this._userDetails.watchlist = data.userDetails.watchlist;
    this._userDetails.alreadyWatched = data.userDetails.alreadyWatched;
    this._userDetails.favorite = data.userDetails.favorite;
  }
}
