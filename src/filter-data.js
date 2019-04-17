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

export default (orderNumber) => ({
  orderNumber,
  name: FILTERS[orderNumber].name,
  text: FILTERS[orderNumber].text,
});
