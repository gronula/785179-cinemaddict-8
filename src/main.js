import getFilterData from './filter-data';
import Filter from './filter';
import Card from './card';
import Popup from './popup';
import getStatisticChart from './statistic';
import API from './api';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;
const FILTERS_NUMBER = 5;

const mainNav = document.querySelector(`.main-navigation`);
const filmsList = document.querySelector(`.films-list  .films-list__container`);
const filmsListsExtra = document.querySelectorAll(`.films-list--extra  .films-list__container`);

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const renderFilterElements = (filters, container) => {
  container.innerHTML = ``;

  const fragment = document.createDocumentFragment();

  for (const filter of filters) {
    const filterComponent = new Filter(filter);
    const filterElement = filterComponent.render();
    let statisticChart;

    const filterTasks = (cards, filterName) => {
      switch (filterName) {
        case `all`: return cards;
        case `watchlist`: return cards.filter((it) => it.userDetails.watchlist);
        case `history`: return cards.filter((it) => it.userDetails.alreadyWatched);
        case `favorites`: return cards.filter((it) => it.userDetails.favorite);

        default: return cards;
      }
    };

    filterComponent.onFilter = (target, name) => {
      const filmsContainer = document.querySelector(`.films`);
      const statisticContainer = document.querySelector(`.statistic`);
      const currentFilter = container.querySelector(`.main-navigation__item--active`);
      currentFilter.classList.remove(`main-navigation__item--active`);
      target.classList.add(`main-navigation__item--active`);

      if (name === `stats`) {
        filmsContainer.classList.add(`visually-hidden`);
        statisticContainer.classList.remove(`visually-hidden`);

        if (statisticChart) {
          statisticChart.destroy();
        }
        statisticChart = getStatisticChart(allCards);
      } else {
        const filteredTasks = filterTasks(allCards, name.toLowerCase()).splice(0, 5);
        renderCards(filteredTasks, filmsList);
        filmsContainer.classList.remove(`visually-hidden`);
        statisticContainer.classList.add(`visually-hidden`);
      }
    };

    fragment.appendChild(filterElement);
  }

  container.appendChild(fragment);
};

const renderCards = (cards, container, hasControls = true) => {
  container.innerHTML = ``;

  const fragment = document.createDocumentFragment();

  for (const card of cards) {
    card.hasControls = hasControls;
    const cardComponent = new Card(card);
    const popupComponent = new Popup(card);

    let cardElement = cardComponent.render();
    let popupElement;

    cardComponent.onClick = () => {
      popupElement = popupComponent.render();
      document.body.appendChild(popupComponent.element);
    };

    const updateComponent = (newObject) => {
      Object.assign(card.userDetails, newObject);

      api.updateTask({id: card.id, data: card.toRAW()})
        .then((newCard) => {
          cardComponent.update(newCard);
          popupComponent.update(newCard);
        });
    };

    cardComponent.onAddToWatchList = updateComponent;
    cardComponent.onMarkAsWatched = updateComponent;
    cardComponent.onMarkAsFavorite = updateComponent;

    popupComponent.onClose = (newObject) => {
      Object.assign(card.userDetails, newObject);

      api.updateTask({id: card.id, data: card.toRAW()})
        .then((newCard) => {
          cardComponent.update(newCard);
          const updatedCardElement = cardComponent.render();
          container.replaceChild(updatedCardElement, cardElement);
          cardElement = updatedCardElement;
          popupComponent.unrender();
        });
    };

    popupComponent.onRating = (evt, newObject) => {
      Object.assign(card.userDetails, newObject);

      const ratingContainer = popupElement.querySelector(`.film-details__user-rating-score`);
      const ratingButtons = popupElement.querySelectorAll(`.film-details__user-rating-input`);

      api.updateTask({id: card.id, data: card.toRAW()})
        .then((newCard) => {
          popupComponent.update(newCard);
          ratingButtons.forEach((it) => {
            it.disabled = false;
          });

          const userRating = popupElement.querySelector(`.film-details__user-rating`);
          userRating.textContent = `Your rate ${evt.target.value}`;
        }).catch(() => {
          ratingButtons.forEach((it) => {
            it.disabled = false;
          });
          evt.target.nextElementSibling.style.backgroundColor = `red`;
          popupComponent.shake(ratingContainer);
        });
    };
    popupComponent.onComment = (newObject, newComment) => {
      Object.assign(card.userDetails, newObject);

      const emoji = popupElement.querySelector(`.film-details__add-emoji`);
      const commentTextarea = popupElement.querySelector(`.film-details__comment-input`);

      api.updateTask({id: card.id, data: card.toRAW()})
        .then((newCard) => {
          popupComponent.update(newCard);
          const commentsList = popupElement.querySelector(`.film-details__comments-list`);
          commentsList.appendChild(newComment);
          commentTextarea.value = ``;
          commentTextarea.disabled = false;
          emoji.disabled = false;

          const commentsAmount = popupElement.querySelector(`.film-details__comments-count`);
          commentsAmount.textContent = Number(commentsAmount.textContent) + 1;
        }).catch(() => {
          emoji.disabled = false;
          commentTextarea.disabled = false;
          commentTextarea.style.borderColor = `red`;
          popupComponent.shake(commentTextarea);
        });
    };

    fragment.appendChild(cardElement);
  }

  container.appendChild(fragment);
};

const filters = new Array(FILTERS_NUMBER).fill().map((_it, i) => getFilterData(i));
let allCards;

renderFilterElements(filters, mainNav);

api.getTasks()
  .then((cards) => {
    allCards = cards;
    const mainCards = cards.slice().splice(0, 5);
    const topRatedCards = cards.slice().sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).splice(0, 2);
    const mostCommentedCards = cards.slice().sort((a, b) => b.comments.length - a.comments.length).splice(0, 2);

    renderCards(mainCards, filmsList);
    renderCards(topRatedCards, filmsListsExtra[0], false);
    renderCards(mostCommentedCards, filmsListsExtra[1], false);
  });
