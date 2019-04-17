import getFilterData from './filter-data';
import Filter from './filter';
import Card from './card';
import Popup from './popup';
import getStatisticChart from './statistic';
import API from './api';

const COMMENT_AUTHORS = [
  `Jon Snow`,
  `Daenerys Targaryen`,
  `Tyrion Lannister`,
  `Sansa Stark`,
];

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;
const CARDS_NUMBER = 5;
const CARDS_EXTRA_NUMBER = 2;
const FILTERS_NUMBER = 5;

const mainNav = document.querySelector(`.main-navigation`);
const filmsList = document.querySelector(`.films-list  .films-list__container`);
const filmsListsExtra = document.querySelectorAll(`.films-list--extra  .films-list__container`);
const showMoreButton = document.querySelector(`.films-list__show-more`);

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const userName = getRandomElement(COMMENT_AUTHORS);

const getFilters = (cards, filteredShownCardsNumber = CARDS_NUMBER, activeFilterNumber = 0) => {
  const filtersAmount = {
    watchlist: 0,
    history: 0,
    favorites: 0
  };

  for (const card of cards) {
    filtersAmount.watchlist = card.userDetails.watchlist ? filtersAmount.watchlist + 1 : filtersAmount.watchlist;
    filtersAmount.history = card.userDetails.alreadyWatched ? filtersAmount.history + 1 : filtersAmount.history;
    filtersAmount.favorites = card.userDetails.favorite ? filtersAmount.favorites + 1 : filtersAmount.favorites;
  }

  if (!filters) {
    filters = new Array(FILTERS_NUMBER).fill().map((_it, i) => getFilterData(i));
  }

  filters.forEach((it, i) => {
    it.activeFilterNumber = activeFilterNumber;
    it.amount = filtersAmount[it.name] || 0;

    if (i === activeFilterNumber) {
      it.filteredShownCardsNumber = filteredShownCardsNumber;
    } else {
      it.filteredShownCardsNumber = it.filteredShownCardsNumber ? it.filteredShownCardsNumber : CARDS_NUMBER;
    }
  });

  return filters;
};

const filterCards = (cards, filterName) => {
  switch (filterName) {
    case `all`: return cards;
    case `watchlist`: return cards.filter((it) => it.userDetails.watchlist);
    case `history`: return cards.filter((it) => it.userDetails.alreadyWatched);
    case `favorites`: return cards.filter((it) => it.userDetails.favorite);

    default: return cards;
  }
};

const renderFilterElements = (filters, container) => {
  container.innerHTML = ``;

  const fragment = document.createDocumentFragment();

  for (const filter of filters) {
    const filterComponent = new Filter(filter);
    const filterElement = filterComponent.render();

    filterComponent.onFilter = (target, name) => {
      const openedPopup = document.querySelector(`.film-details`);
      if (openedPopup) {
        return;
      }

      const filmsContainer = document.querySelector(`.films`);
      const statisticContainer = document.querySelector(`.statistic`);
      const currentFilter = container.querySelector(`.main-navigation__item--active`);
      currentFilter.classList.remove(`main-navigation__item--active`);
      target.classList.add(`main-navigation__item--active`);

      if (name === `stats`) {
        if (statisticChart) {
          statisticChart.destroy();
        }

        statisticChart = getStatisticChart(allCards);

        filmsContainer.classList.add(`visually-hidden`);
        statisticContainer.classList.remove(`visually-hidden`);
      } else {
        filteredCards = filterCards(allCards, name.toLowerCase());
        const filteredShownCards = filteredCards.slice().splice(0, filter.filteredShownCardsNumber);
        showMoreButton.style.display = filteredCards.length > filteredShownCards.length ? `` : `none`;
        renderCards(filteredShownCards, filmsList);
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
    card.userDetails.userName = userName;
    const cardComponent = new Card(card);
    const popupComponent = new Popup(card);

    let cardElement = cardComponent.render();
    let popupElement;

    cardComponent.onClick = () => {
      const openedPopup = document.querySelector(`.film-details`);
      if (openedPopup) {
        return;
      }

      popupElement = popupComponent.render();
      document.body.appendChild(popupComponent.element);
    };

    const updateFilters = () => {
      const filterItems = Array.from(document.querySelectorAll(`.main-navigation__item`));
      const activeFilter = document.querySelector(`.main-navigation__item--active`);
      for (let i = 0; i < filterItems.length; i++) {
        if (filterItems[i] === activeFilter) {
          renderFilterElements(getFilters(allCards, filters[i].filteredShownCardsNumber, i), mainNav);
        }
      }
    };

    const updateComponent = (newObject) => {
      const openedPopup = document.querySelector(`.film-details`);
      if (openedPopup) {
        return;
      }

      Object.assign(card.userDetails, newObject);

      api.updateCard({id: card.id, data: card.toRAW()})
        .then((newCard) => {
          cardComponent.update(newCard);
          popupComponent.update(newCard);
          updateFilters();
        });
    };

    cardComponent.onAddToWatchList = updateComponent;
    cardComponent.onMarkAsWatched = updateComponent;
    cardComponent.onMarkAsFavorite = updateComponent;

    popupComponent.onEscPress = (evt, newObject) => {
      if (evt.key === `Escape`) {
        evt.preventDefault();
        Object.assign(card.userDetails, newObject);

        api.updateCard({id: card.id, data: card.toRAW()})
          .then((newCard) => {
            updateFilters();
            cardComponent.update(newCard);
            const updatedCardElement = cardComponent.render();
            container.replaceChild(updatedCardElement, cardElement);
            cardElement = updatedCardElement;
            popupComponent.unrender();
          });
      }
    };
    popupComponent.onClose = (newObject, closeButton) => {
      closeButton.disabled = true;
      Object.assign(card.userDetails, newObject);

      api.updateCard({id: card.id, data: card.toRAW()})
        .then((newCard) => {
          updateFilters();
          cardComponent.update(newCard);
          const updatedCardElement = cardComponent.render();
          container.replaceChild(updatedCardElement, cardElement);
          cardElement = updatedCardElement;
          popupComponent.unrender();
          closeButton.disabled = false;
        });
    };
    popupComponent.onRating = (evt, newObject) => {
      Object.assign(card.userDetails, newObject);

      const ratingContainer = popupElement.querySelector(`.film-details__user-rating-score`);
      const ratingButtons = popupElement.querySelectorAll(`.film-details__user-rating-input`);

      api.updateCard({id: card.id, data: card.toRAW()})
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

      api.updateCard({id: card.id, data: card.toRAW()})
        .then((newCard) => {
          popupComponent.update(newCard);
          const commentsList = popupElement.querySelector(`.film-details__comments-list`);
          commentsList.appendChild(newComment);
          commentTextarea.value = ``;
          commentTextarea.disabled = false;
          emoji.disabled = false;

          const commentsAmount = popupElement.querySelector(`.film-details__comments-count`);
          commentsAmount.textContent = Number(commentsAmount.textContent) + 1;

          const commentStatus = popupElement.querySelector(`.film-details__watched-status`);
          const commentUndoButton = popupElement.querySelector(`.film-details__watched-reset`);
          commentStatus.innerHTML = `Comment added`;
          commentStatus.classList.add(`film-details__watched-status--active`);
          commentUndoButton.classList.remove(`visually-hidden`);
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

let allCards;
let mainCards;
let filters;
let filteredCards;
let statisticChart;

api.getCards()
  .then((cards) => {
    allCards = cards;
    mainCards = allCards.slice().splice(0, CARDS_NUMBER);
    const topRatedCards = cards.slice().sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).splice(0, CARDS_EXTRA_NUMBER);
    const mostCommentedCards = cards.slice().sort((a, b) => b.comments.length - a.comments.length).splice(0, CARDS_EXTRA_NUMBER);

    renderCards(mainCards, filmsList);
    renderCards(topRatedCards, filmsListsExtra[0], false);
    renderCards(mostCommentedCards, filmsListsExtra[1], false);

    renderFilterElements(getFilters(allCards), mainNav);
  });

showMoreButton.addEventListener(`click`, () => {
  const currentFilter = document.querySelector(`.main-navigation__item--active`);
  const currentFilterName = currentFilter.href.split(`#`)[1];

  filteredCards = filterCards(allCards, currentFilterName);

  for (const filter of filters) {
    if (filter.name === currentFilterName) {
      filter.filteredShownCardsNumber += CARDS_NUMBER;

      const filteredShownCards = filteredCards.slice().splice(0, filter.filteredShownCardsNumber);

      renderCards(filteredShownCards, filmsList);
      showMoreButton.style.display = filteredCards.length > filteredShownCards.length ? `` : `none`;

      break;
    }
  }

});
