import getNavItem from './make-nav-item';
import getCard from './make-card';

const NAV_NAMES = [
  `all`,
  `watchlist`,
  `history`,
  `favorites`,
  `stats`
];

const NAV_TEXTS = [
  `All movies`,
  `Watchlist`,
  `History`,
  `Favorites`,
  `Stats`
];

const CARDS_NUMBER = 7;
const CARDS_EXTRA_NUMBER = 2;

const TITLES = [
  `The Assassination Of Jessie James By The Coward Robert Ford`,
  `Incredibles 2`
];

const GENRES = [
  `Action`,
  `Adventure`,
  `Comedy`,
  `Drama`,
  `Horror`
];

const POSTER_FILES = [
  `three-friends.jpg`,
  `moonrise.jpg`,
  `fuga-da-new-york.jpg`,
  `blue-blazes.jpg`,
  `accused.jpg`,
  `blackmail.jpg`
];

const DESCRIPTIONS = [
  `A priest with a haunted past and a novice on the threshold of her final vows are sent by the Vatican to investigate the death of a young nun in Romania and confront a malevolent force in the form of a demonic nun.`,
  `A priests Romania and confront a malevolent force in the form of a demonic nun.`
];

const mainNav = document.querySelector(`.main-navigation`);
const filmsList = document.querySelector(`.films-list  .films-list__container`);
const filmsListsExtra = document.querySelectorAll(`.films-list--extra  .films-list__container`);

const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
const getRandomFloat = (min, max) => Math.random() * (max - min) + min;
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const renderNavItems = () => {
  const randomActiveItemNumber = getRandomInteger(0, NAV_NAMES.length - 1);

  for (let i = 0; i < NAV_NAMES.length; i++) {
    const name = NAV_NAMES[i];
    const isActive = i === randomActiveItemNumber ? 1 : 0;
    const isAdditional = i === NAV_NAMES.length - 1 ? 1 : 0;
    const textContent = NAV_TEXTS[i];
    const hasCounter = i === 0 || isAdditional ? 0 : 1;
    const amount = getRandomInteger(0, 10);

    mainNav.innerHTML += getNavItem(name, isActive, isAdditional, textContent, hasCounter, amount);
  }
};

const renderCards = (cardsNumber, container, hasControls = true) => {
  container.innerHTML = ``;

  for (let i = 0; i < cardsNumber; i++) {
    const title = getRandomElement(TITLES);
    const rating = getRandomFloat(0, 10).toFixed(1);
    const year = getRandomInteger(1900, 2018);
    const duration = `${getRandomInteger(1, 3)}h&nbsp;${getRandomInteger(0, 59)}m`;
    const genre = getRandomElement(GENRES);
    const posterFile = getRandomElement(POSTER_FILES);
    const commentsAmount = getRandomInteger(0, 500);
    const description = getRandomElement(DESCRIPTIONS);

    container.innerHTML += getCard(title, rating, year, duration, genre, posterFile, description, commentsAmount, hasControls);
  }
};

renderNavItems();
renderCards(CARDS_NUMBER, filmsList);
filmsListsExtra.forEach((it) => renderCards(CARDS_EXTRA_NUMBER, it, false));

const navItems = mainNav.querySelectorAll(`.main-navigation__item`);
const navItemClickHandler = (evt) => {
  navItems.forEach((it) => it.classList.remove(`main-navigation__item--active`));
  evt.target.classList.add(`main-navigation__item--active`);

  const cardsNumber = getRandomInteger(1, 8);
  const cardsExtraNumber = getRandomInteger(1, 4);

  renderCards(cardsNumber, filmsList);
  filmsListsExtra.forEach((it) => renderCards(cardsExtraNumber, it, false));
};
navItems.forEach((it) => it.addEventListener(`click`, navItemClickHandler));
