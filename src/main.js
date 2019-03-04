import getNavItemMarkup from './make-nav-item';
import getCardMarkup from './make-card';

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

const CardProperty = {
  TITLES: [
    `The Assassination Of Jessie James By The Coward Robert Ford`,
    `Incredibles 2`
  ],
  GENRES: [
    `Action`,
    `Adventure`,
    `Comedy`,
    `Drama`,
    `Horror`
  ],
  POSTER_FILES: [
    `three-friends.jpg`,
    `moonrise.jpg`,
    `fuga-da-new-york.jpg`,
    `blue-blazes.jpg`,
    `accused.jpg`,
    `blackmail.jpg`
  ],
  DESCRIPTIONS: [
    `A priest with a haunted past and a novice on the threshold of her final vows are sent by the Vatican to investigate the death of a young nun in Romania and confront a malevolent force in the form of a demonic nun.`,
    `A priests Romania and confront a malevolent force in the form of a demonic nun.`
  ]
};

const mainNav = document.querySelector(`.main-navigation`);
const filmsList = document.querySelector(`.films-list  .films-list__container`);
const filmsListsExtra = document.querySelectorAll(`.films-list--extra  .films-list__container`);

const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
const getRandomFloat = (min, max) => Math.random() * (max - min) + min;
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

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

  for (let i = 0; i < cardsNumber; i++) {
    const properties = {};
    properties.hasControls = hasControls;
    properties.title = getRandomElement(CardProperty.TITLES);
    properties.rating = getRandomFloat(0, 10).toFixed(1);
    properties.year = getRandomInteger(1900, 2018);
    properties.duration = `${getRandomInteger(1, 3)}h&nbsp;${getRandomInteger(0, 59)}m`;
    properties.genre = getRandomElement(CardProperty.GENRES);
    properties.posterFile = getRandomElement(CardProperty.POSTER_FILES);
    properties.commentsAmount = getRandomInteger(0, 500);
    properties.description = getRandomElement(CardProperty.DESCRIPTIONS);

    container.innerHTML += getCardMarkup(properties);
  }
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
