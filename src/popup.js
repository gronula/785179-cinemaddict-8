import Component from "./component";
import createElement from './create-element';
import moment from 'moment';

const COMMENT_AUTHORS = [
  `Jon Snow`,
  `Daenerys Targaryen`,
  `Tyrion Lannister`,
  `Sansa Stark`,
];

const EMOJIES = {
  [`sleeping`]: `😴`,
  [`neutral-face`]: `😐`,
  [`grinning`]: `😀`,
};

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

export default class Popup extends Component {
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
    };

    this._state = {
    };
    this._commentDate = null;

    this._element = null;

    this._onClose = null;
    this._onComment = null;
    this._onRating = null;

    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._emojiListClickHandler = this._emojiListClickHandler.bind(this);
    this._commentCtrlEnterPressHandler = this._commentCtrlEnterPressHandler.bind(this);
    this._userRatingButtonsClickHandler = this._userRatingButtonsClickHandler.bind(this);
  }

  _processForm(formData) {
    const entry = {
      userRating: ``,
      watchlist: false,
      alreadyWatched: false,
      favorite: false,
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
    if (evt.key === `Enter` && evt.ctrlKey) {
      const emoji = this._element.querySelector(`.film-details__add-emoji`);
      const commentTextarea = this._element.querySelector(`.film-details__comment-input`);
      const newComment = {
        author: getRandomElement(COMMENT_AUTHORS),
        comment: commentTextarea.value.trim(),
        date: moment(),
        emotion: Object.keys(EMOJIES)[Object.values(EMOJIES).indexOf(emoji.previousElementSibling.textContent)],
      };

      this._comments.push(newComment);

      const newCommentMarkup = `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">${EMOJIES[newComment.emotion]}</span>
        <div>
          <p class="film-details__comment-text">${newComment.comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${newComment.author}</span>
            <span class="film-details__comment-day">${moment(newComment.date).fromNow()}</span>
          </p>
        </div>
      </li>`;

      const newCommentElement = createElement(newCommentMarkup);

      commentTextarea.style.borderColor = ``;
      commentTextarea.disabled = true;
      emoji.disabled = true;

      const formData = new FormData(this._element.querySelector(`.film-details__inner`));
      const newData = this._processForm(formData);

      if (typeof this._onComment === `function`) {
        this._onComment(newData, newCommentElement);
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
      const ratingButtons = this._element.querySelectorAll(`.film-details__user-rating-input`);
      const ratingButtonLabels = this._element.querySelectorAll(`.film-details__user-rating-label`);

      ratingButtons.forEach((it) => {
        it.disabled = true;
      });
      ratingButtonLabels.forEach((it) => {
        it.style.backgroundColor = ``;
      });

      const formData = new FormData(this._element.querySelector(`.film-details__inner`));
      const newData = this._processForm(formData);

      if (typeof this._onRating === `function`) {
        this._onRating(evt, newData);
      }

      this.update(newData);
    }
  }

  _partialUpdate() {
    const newElement = createElement(this.template);
    this._element.parentElement.replaceChild(newElement, this._element);
    this._element = newElement;
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
            <img class="film-details__poster-img" src="${this._filmInfo.poster}" alt="incredables-2">

            <p class="film-details__age">${this._filmInfo.ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._filmInfo.title}</h3>
                <p class="film-details__title-original">Original: ${this._filmInfo.alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${this._filmInfo.totalRating}</p>
                <p class="film-details__user-rating">Your rate ${this._userDetails.personalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${this._filmInfo.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${this._filmInfo.writers.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${this._filmInfo.actors.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${moment(this._filmInfo.release.date).format(`D MMMM Y`)} (USA)</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${this._filmInfo.runtime}m</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">USA</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  <span class="film-details__genre">${this._filmInfo.genre.join(`, `)}</span>
              </tr>
            </table>

            <p class="film-details__film-description">${this._filmInfo.description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._userDetails.watchlist ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._userDetails.alreadyWatched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._userDetails.favorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>

        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${this._comments.map((it) => `
            <li class="film-details__comment">
              <span class="film-details__comment-emoji">${EMOJIES[it.emotion]}</span>
              <div>
                <p class="film-details__comment-text">${it.comment}</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">${it.author}</span>
                  <span class="film-details__comment-day">${moment(it.date).fromNow()}</span>
                </p>
              </div>
            </li>`).join(``)}
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
            <span class="film-details__watched-status ${this._userDetails.alreadyWatched ? `film-details__watched-status--active` : ``}">${this._userDetails.alreadyWatched ? `Alredy watched` : `Will watch`}</span>
            <button class="film-details__watched-reset" type="button">undo</button>
          </div>

          <div class="film-details__user-score">
            <div class="film-details__user-rating-poster">
              <img src="${this._filmInfo.poster}" alt="film-poster" class="film-details__user-rating-img">
            </div>

            <section class="film-details__user-rating-inner">
              <h3 class="film-details__user-rating-title">${this._filmInfo.title}</h3>

              <p class="film-details__user-rating-feelings">How you feel it?</p>

              <div class="film-details__user-rating-score">
                ${new Array(9).fill(``).map((it, i) => `
                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden"
                    value="${i + 1}"
                    id="rating-${i + 1}"
                    ${Number(this._userDetails.personalRating) === i + 1 ? `checked` : ``}
                  >
                  <label class="film-details__user-rating-label" for="rating-${i + 1}">${i + 1}</label>`).join(``)}
              </div>
            </section>
          </div>
        </section>
      </form>
    </section>`;
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
    comment.addEventListener(`keydown`, this._commentCtrlEnterPressHandler);
    userRating.addEventListener(`click`, this._userRatingButtonsClickHandler);
  }

  removeListeners() {
    const closeButton = this._element.querySelector(`.film-details__close-btn`);
    const emojiList = this._element.querySelector(`.film-details__emoji-list`);
    const comment = this._element.querySelector(`.film-details__comment-input`);
    const userRating = this._element.querySelector(`.film-details__user-rating-score`);

    closeButton.removeEventListener(`click`, this._closeButtonClickHandler);
    emojiList.removeEventListener(`click`, this._emojiListClickHandler);
    comment.removeEventListener(`keydown`, this._commentCtrlEnterPressHandler);
    userRating.removeEventListener(`click`, this._userRatingButtonsClickHandler);
  }

  update(data) {
    this._userDetails.personalRating = data.userRating;
    this._userDetails.watchlist = data.watchlist;
    this._userDetails.alreadyWatched = data.alreadyWatched;
    this._userDetails.favorite = data.favorite;
  }

  shake(element) {
    const ANIMATION_TIMEOUT = 600;

    element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  static createMapper(target) {
    return {
      score: (value) => {
        target.userRating = value;
      },
      watchlist: () => {
        target.watchlist = true;
      },
      watched: () => {
        target.alreadyWatched = true;
      },
      favorite: () => {
        target.favorite = true;
      },
    };
  }
}
