import moment from 'moment';

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
const getRandomBoolean = () => Math.floor(Math.random() * 2) === 1 ? true : false;
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

const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export default () => ({
  title: getRandomElement(Data.TITLE),
  rating: getRandomFloat(0, 10).toFixed(1),
  userRating: getRandomInteger(1, 9),
  releaseDate: moment(getRandomDate(new Date(1900, 0, 1), new Date())).format(`D MMMM Y hh:mm A`),
  duration: moment.utc(moment.duration({hours: getRandomInteger(1, 3), minutes: getRandomInteger(0, 59)}).asMilliseconds()).format(`h[h]mm[m]`),
  genre: getRandomElement(Data.GENRE),
  posterFile: getRandomElement(Data.POSTER_FILE),
  comments: [`
  <li class="film-details__comment">
    <span class="film-details__comment-emoji">😴</span>
    <div>
      <p class="film-details__comment-text">So long-long story, boring!</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">Tim Macoveev</span>
        <span class="film-details__comment-day">3 days ago</span>
      </p>
    </div>
  </li>`],
  description: getRandomArray(Data.DESCRIPTION).join(` `),
  isWatchlistAdded: getRandomBoolean(),
  isWatched: getRandomBoolean(),
  isFavorite: getRandomBoolean(),
});
