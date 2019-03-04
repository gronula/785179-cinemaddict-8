export default (data) => `
<article class="film-card  ${data.hasControls ? `` : `film-card--no-controls`}">
  <h3 class="film-card__title">${data.title}</h3>
  <p class="film-card__rating">${data.rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${data.year}</span>
    <span class="film-card__duration">${data.duration}</span>
    <span class="film-card__genre">${data.genre}</span>
  </p>
  <img src="./images/posters/${data.posterFile}" alt="" class="film-card__poster">
  ${data.hasControls ? `<p class="film-card__description">${data.description}</p>` : ``}
  <button class="film-card__comments">${data.commentsAmount} comments</button>

  ${data.hasControls ? `
  <form class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
  </form>` : ``}
</article>`;
