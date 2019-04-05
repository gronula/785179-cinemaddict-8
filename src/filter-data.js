const FILTERS = [
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

const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

export default (orderNumber) => ({
  orderNumber,
  name: FILTERS[orderNumber].name,
  text: FILTERS[orderNumber].text,
  amount: getRandomInteger(0, 10)
});
