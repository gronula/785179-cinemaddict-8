const Data = {
  TITLE: [
    `The Assassination Of Jessie James By The Coward Robert Ford`,
    `Incredibles 2`,
    `Die hard`,
    `Some like it hot`,
    `Public Enemies`,
    `I Spy`,
    `Intouchables`,
    `Identity Thief`,
    `The Fast & Furious`,
    `The Other Guys`,
    `LOST`,
    `Cloverfield`,
    `Leon`,
    `American History X`,
    `The Sixth Sense`,
    `American Beauty`,
    `Rain Man`,
  ],
  GENRE: [
    `Action`,
    `Adventure`,
    `Comedy`,
    `Drama`,
    `Horror`,
  ],
  POSTER_FILE: [
    `accused.jpg`,
    `blackmail.jpg`,
    `blue-blazes.jpg`,
    `fuga-da-new-york.jpg`,
    `moonrise.jpg`,
    `three-friends.jpg`,
  ],
  DESCRIPTION: [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`,
  ]
};

const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
const getRandomFloat = (min, max) => Math.random() * (max - min) + min;
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const getRandomArray = (array) => {
  const randomLength = getRandomInteger(1, 3);
  const newArray = [];
  const copyArray = array.slice();

  for (let i = 0; i < randomLength; i++) {
    const randomElementIndex = getRandomInteger(0, copyArray.length - 1);
    const randomElement = copyArray.splice(randomElementIndex, 1)[0];
    newArray.push(randomElement);
  }

  return newArray;
};

export default (hasControls) => ({
  hasControls,
  title: getRandomElement(Data.TITLE),
  rating: getRandomFloat(0, 10).toFixed(1),
  year: getRandomInteger(1900, 2018),
  duration: `${getRandomInteger(1, 3)}h&nbsp;${getRandomInteger(0, 59)}m`,
  genre: getRandomElement(Data.GENRE),
  posterFile: getRandomElement(Data.POSTER_FILE),
  commentsAmount: getRandomInteger(0, 500),
  description: getRandomArray(Data.DESCRIPTION).join(` `),
  isWatchlistAdded: getRandomInteger(0, 1),
  isWatched: getRandomInteger(0, 1),
  isFavourite: getRandomInteger(0, 1),
});
