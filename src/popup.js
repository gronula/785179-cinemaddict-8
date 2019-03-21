import Component from "./component";
import createElement from './create-element';
import moment from 'moment';

export default class Popup extends Component {
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

    this._onClose = null;
    this._onComment = null;
    this._onRating = null;

    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._emojiListClickHandler = this._emojiListClickHandler.bind(this);
    this._commentCtrlEnterPressHandler = this._commentCtrlEnterPressHandler.bind(this);
    this._userRatingButtonsClickHandler = this._userRatingButtonsClickHandler.bind(this);
  }

  get template() {
    return `
    <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="images/posters/${this._posterFile}" alt="incredables-2">

            <p class="film-details__age">18+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._title}</h3>
                <p class="film-details__title-original">Original: Невероятная семейка</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${this._rating}</p>
                <p class="film-details__user-rating">Your rate ${this._userRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">Brad Bird</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">Brad Bird</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">Samuel L. Jackson, Catherine Keener, Sophia Bush</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${moment(this._releaseDate, `D MMMM Y hh:mm A`).format(`D MMMM Y`)} (USA)</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${this._duration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">USA</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  <span class="film-details__genre">${this._genre}</span>
              </tr>
            </table>

            <p class="film-details__film-description">${this._description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._isWatchlistAdded ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._isWatched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._isFavourite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>

        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${this._comments.length > 1 ? this._comments.map((it) => it).join(``) : `
            <li class="film-details__comment">
              <span class="film-details__comment-emoji">😴</span>
              <div>
                <p class="film-details__comment-text">So long-long story, boring!</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">Tim Macoveev</span>
                  <span class="film-details__comment-day">3 days ago</span>
                </p>
              </div>
            </li>`}
          </ul>

          <div class="film-details__new-comment">
            <div>
              <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
              <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
                <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning">
                <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
              </div>
            </div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
            </label>
          </div>
        </section>

        <section class="film-details__user-rating-wrap">
          <div class="film-details__user-rating-controls">
            <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
            <button class="film-details__watched-reset" type="button">undo</button>
          </div>

          <div class="film-details__user-score">
            <div class="film-details__user-rating-poster">
              <img src="images/posters/${this._posterFile}" alt="film-poster" class="film-details__user-rating-img">
            </div>

            <section class="film-details__user-rating-inner">
              <h3 class="film-details__user-rating-title">${this._title}</h3>

              <p class="film-details__user-rating-feelings">How you feel it?</p>

              <div class="film-details__user-rating-score">
                ${new Array(9).fill(``).map((it, i) => `
                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden"
                    value="${i + 1}"
                    id="rating-${i + 1}"
                    ${Number(this._userRating) === i + 1 ? `checked` : ``}
                  >
                  <label class="film-details__user-rating-label" for="rating-${i + 1}">${i + 1}</label>`).join(``)}
              </div>
            </section>
          </div>
        </section>
      </form>
    </section>`;
  }

  _processForm(formData) {
    const entry = {
      userRating: ``,
      comments: this._comments,
      isWatchlistAdded: false,
      isWatched: false,
      isFavourite: false,
    };

    const popupMapper = Popup.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;

      if (popupMapper[property]) {
        popupMapper[property](value);
      }
    }

    return entry;
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    const newData = this._processForm(formData);

    if (typeof this._onClose === `function`) {
      this._onClose(newData);
    }

    this.update(newData);
  }

  _commentCtrlEnterPressHandler(evt) {
    if (evt.keyCode === 10 && evt.ctrlKey) {
      const commentsList = this._element.querySelector(`.film-details__comments-list`);
      const emoji = this._element.querySelector(`.film-details__add-emoji-label`);
      const commentText = this._element.querySelector(`.film-details__comment-input`);

      if (commentText.value.trim()) {
        const newCommentMarkup = `
        <li class="film-details__comment">
          <span class="film-details__comment-emoji">${emoji.textContent}</span>
          <div>
            <p class="film-details__comment-text">${commentText.value.trim()}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">Tim Macoveev</span>
              <span class="film-details__comment-day">${Date.now()}</span>
            </p>
          </div>
        </li>`;
        commentsList.appendChild(createElement(newCommentMarkup));
        commentText.blur();
        commentText.value = ``;
        this._comments.push(newCommentMarkup);

        const commentsAmount = this._element.querySelector(`.film-details__comments-count`);
        commentsAmount.textContent = this._comments.length;
      }

      const formData = new FormData(this._element.querySelector(`.film-details__inner`));
      const newData = this._processForm(formData);

      if (typeof this._onSubmit === `function`) {
        this._onComment(newData);
      }

      this.update(newData);
    }
  }

  _emojiListClickHandler(evt) {
    if (evt.target.classList.contains(`film-details__emoji-label`)) {
      const commentEmoji = this._element.querySelector(`.film-details__add-emoji-label`);
      commentEmoji.textContent = evt.target.textContent;
    }
  }

  _userRatingButtonsClickHandler(evt) {
    if (evt.target.value) {
      const formData = new FormData(this._element.querySelector(`.film-details__inner`));
      const newData = this._processForm(formData);

      if (typeof this._onSubmit === `function`) {
        this._onRating(newData);
      }

      this.update(newData);

      const userRating = this._element.querySelector(`.film-details__user-rating`);
      userRating.textContent = `Your rate ${evt.target.value}`;
    }
  }

  _partialUpdate() {
    const newElement = createElement(this.template);
    this._element.parentElement.replaceChild(newElement, this._element);
    this._element = newElement;
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  set onComment(fn) {
    this._onComment = fn;
  }

  set onRating(fn) {
    this._onRating = fn;
  }

  createListeners() {
    const closeButton = this._element.querySelector(`.film-details__close-btn`);
    const emojiList = this._element.querySelector(`.film-details__emoji-list`);
    const comment = this._element.querySelector(`.film-details__comment-input`);
    const userRating = this._element.querySelector(`.film-details__user-rating-score`);

    closeButton.addEventListener(`click`, this._closeButtonClickHandler);
    emojiList.addEventListener(`click`, this._emojiListClickHandler);
    comment.addEventListener(`keypress`, this._commentCtrlEnterPressHandler);
    userRating.addEventListener(`click`, this._userRatingButtonsClickHandler);
  }

  removeListeners() {
    const closeButton = this._element.querySelector(`.film-details__close-btn`);
    const emojiList = this._element.querySelector(`.film-details__emoji-list`);
    const comment = this._element.querySelector(`.film-details__comment-input`);
    const userRating = this._element.querySelector(`.film-details__user-rating-score`);

    closeButton.removeEventListener(`click`, this._closeButtonClickHandler);
    emojiList.removeEventListener(`click`, this._emojiListClickHandler);
    comment.removeEventListener(`keypress`, this._commentCtrlEnterPressHandler);
    userRating.removeEventListener(`click`, this._userRatingButtonsClickHandler);
  }

  update(data) {
    this._userRating = data.userRating;
    this._comments = data.comments;
    this._isWatchlistAdded = data.isWatchlistAdded;
    this._isWatched = data.isWatched;
    this._isFavourite = data.isFavourite;
  }

  static createMapper(target) {
    return {
      score: (value) => {
        target.userRating = value;
      },
      watchlist: (value) => {
        target.isWatchlistAdded = value;
      },
      watched: (value) => {
        target.isWatched = value;
      },
      favorite: (value) => {
        target.isFavourite = value;
      },
    };
  }
}
