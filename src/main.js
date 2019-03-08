import getNavItemMarkup from './make-nav-item';
import getCardData from './card-data';
import Card from './card';
import Popup from './popup';

const NAV_ITEMS_NUMBER = 5;
const CARDS_NUMBER = 7;
const CARDS_EXTRA_NUMBER = 2;

const NAV_PROPERTIES = [
  {
    name: `all`,
    text: `All movies`
  },
  {
    name: `watchlist`,
    text: `Watchlist`
  },
  {
    name: `history`,
    text: `History`
  },
  {
    name: `favorites`,
    text: `Favorites`
  },
  {
    name: `stats`,
    text: `Stats`
  }
];

const mainNav = document.querySelector(`.main-navigation`);
const filmsList = document.querySelector(`.films-list  .films-list__container`);
const filmsListsExtra = document.querySelectorAll(`.films-list--extra  .films-list__container`);

const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const renderNavItems = (navItemsNumber) => {
  const randomActiveItemNumber = getRandomInteger(0, navItemsNumber - 1);

  for (let i = 0; i < navItemsNumber; i++) {
    const properties = {};
    properties.name = NAV_PROPERTIES[i].name;
    properties.isActive = i === randomActiveItemNumber ? 1 : 0;
    properties.isAdditional = i === navItemsNumber - 1 ? 1 : 0;
    properties.text = NAV_PROPERTIES[i].text;
    properties.hasCounter = i === 0 || properties.isAdditional ? 0 : 1;
    properties.amount = getRandomInteger(0, 10);

    mainNav.innerHTML += getNavItemMarkup(properties);
  }
};

const renderCards = (cardsNumber, container, hasControls = true) => {
  container.innerHTML = ``;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < cardsNumber; i++) {
    const data = getCardData(hasControls);

    const cardComponent = new Card(data);
    const popupComponent = new Popup(data);

    const card = cardComponent.render();

    cardComponent.onClick = () => {
      popupComponent.render();
      document.body.appendChild(popupComponent.element);
    };

    popupComponent.onClose = () => {
      document.body.removeChild(popupComponent.element);
      popupComponent.unrender();
    };

    fragment.appendChild(card);
  }

  container.appendChild(fragment);
};

renderNavItems(NAV_ITEMS_NUMBER);
renderCards(CARDS_NUMBER, filmsList);
filmsListsExtra.forEach((it) => renderCards(CARDS_EXTRA_NUMBER, it, false));

const navItems = mainNav.querySelectorAll(`.main-navigation__item`);
const navItemClickHandler = (evt) => {
  navItems.forEach((it) => it.classList.remove(`main-navigation__item--active`));
  evt.currentTarget.classList.add(`main-navigation__item--active`);

  const cardsNumber = getRandomInteger(1, 8);
  const cardsExtraNumber = getRandomInteger(1, 4);

  renderCards(cardsNumber, filmsList);
  filmsListsExtra.forEach((it) => renderCards(cardsExtraNumber, it, false));
};
navItems.forEach((it) => it.addEventListener(`click`, navItemClickHandler));
