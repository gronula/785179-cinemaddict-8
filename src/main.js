import getFilterData from './filter-data';
import Filter from './filter';
import getCardData from './card-data';
import Card from './card';
import Popup from './popup';
import getStatisticChart from './statistic';

const FILTERS_NUMBER = 5;
const CARDS_NUMBER = 7;

const mainNav = document.querySelector(`.main-navigation`);
const filmsList = document.querySelector(`.films-list  .films-list__container`);
const filmsListsExtra = document.querySelectorAll(`.films-list--extra  .films-list__container`);

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
        case `watchlist`: return cards.filter((it) => it.isWatchlistAdded);
        case `history`: return cards.filter((it) => it.isWatched);
        case `favorites`: return cards.filter((it) => it.isFavorite);

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
        statisticChart = getStatisticChart(mainCards);
      } else {
        const filteredTasks = filterTasks(mainCards, name.toLowerCase());
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

    const updateComponent = (newObject) => {
      Object.assign(card, newObject);

      cardComponent.update(card);
      popupComponent.update(card);
    };

    cardComponent.onClick = () => {
      popupComponent.render();
      document.body.appendChild(popupComponent.element);
    };

    cardComponent.onAddToWatchList = updateComponent;
    cardComponent.onMarkAsWatched = updateComponent;
    cardComponent.onMarkAsFavorite = updateComponent;

    popupComponent.onClose = (newObject) => {
      Object.assign(card, newObject);

      cardComponent.update(card);
      const updatedCardElement = cardComponent.render();
      container.replaceChild(updatedCardElement, cardElement);
      cardElement = updatedCardElement;
      popupComponent.unrender();
    };

    popupComponent.onRating = updateComponent;
    popupComponent.onComment = updateComponent;

    fragment.appendChild(cardElement);
  }

  container.appendChild(fragment);
};

const filters = new Array(FILTERS_NUMBER).fill().map((_it, i) => getFilterData(i));
const mainCards = new Array(CARDS_NUMBER).fill().map(() => getCardData());
const topRatedCards = mainCards.slice().sort((a, b) => b.rating - a.rating).splice(0, 2);
const mostCommentedCards = mainCards.slice().sort((a, b) => b.comments.length - a.comments.length).splice(0, 2);

renderFilterElements(filters, mainNav);
renderCards(mainCards, filmsList);
renderCards(topRatedCards, filmsListsExtra[0], false);
renderCards(mostCommentedCards, filmsListsExtra[1], false);
