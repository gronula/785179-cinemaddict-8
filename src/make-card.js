export default (properties) => `
<article class="film-card  ${properties.hasControls ? `` : `film-card--no-controls`}">
  <h3 class="film-card__title">${properties.title}</h3>
  <p class="film-card__rating">${properties.rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${properties.year}</span>
    <span class="film-card__duration">${properties.duration}</span>
    <span class="film-card__genre">${properties.genre}</span>
  </p>
  <img src="./images/posters/${properties.posterFile}" alt="" class="film-card__poster">
  ${properties.hasControls ? `<p class="film-card__description">${properties.description}</p>` : ``}
  <button class="film-card__comments">${properties.commentsAmount} comments</button>

  ${properties.hasControls ? `
  <form class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
  </form>` : ``}
</article>`;
