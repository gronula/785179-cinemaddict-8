import moment from 'moment';

export default class ModelCard {
  constructor(data) {
    this.id = data.id;
    this.comments = data.comments.map((it) => {
      it.date = new Date(it.date);
      return it;
    });
    this.filmInfo = {
      actors: data[`film_info`][`actors`] || [],
      ageRating: data[`film_info`][`age_rating`],
      alternativeTitle: data[`film_info`][`alternative_title`] || ``,
      description: data[`film_info`][`description`] || ``,
      director: data[`film_info`][`director`] || ``,
      genre: data[`film_info`][`genre`] || [],
      poster: data[`film_info`][`poster`] || ``,
      release: {
        date: new Date(data[`film_info`][`release`][`date`]),
        releaseCountry: data[`film_info`][`release`][`release_country`] || ``,
      },
      runtime: data[`film_info`][`runtime`] || ``,
      title: data[`film_info`][`title`] || ``,
      totalRating: data[`film_info`][`total_rating`] || ``,
      writers: data[`film_info`][`writers`] || [],
    };
    this.userDetails = {
      alreadyWatched: Boolean(data[`user_details`][`already_watched`]),
      favorite: Boolean(data[`user_details`][`favorite`]),
      personalRating: data[`user_details`][`personal_rating`] || ``,
      watchingDate: data[`user_details`][`watching_date`] ? new Date(data[`user_details`][`watching_date`]) : null,
      watchlist: Boolean(data[`user_details`][`watchlist`]),
    };
  }

  toRAW() {
    return {
      [`id`]: this.id,
      [`comments`]: this.comments.map((it) => {
        it.date = Number(moment(it.date).format(`x`));
        return it;
      }),
      [`film_info`]: {
        [`actors`]: this.filmInfo.actors,
        [`age_rating`]: this.filmInfo.ageRating,
        [`alternative_title`]: this.filmInfo.alternativeTitle,
        [`description`]: this.filmInfo.description,
        [`director`]: this.filmInfo.director,
        [`genre`]: this.filmInfo.genre,
        [`poster`]: this.filmInfo.poster,
        [`release`]: {
          [`date`]: Number(moment(this.filmInfo.release.date).format(`x`)),
          [`release_country`]: this.filmInfo.release.releaseCountry,
        },
        [`runtime`]: this.filmInfo.runtime,
        [`title`]: this.filmInfo.title,
        [`total_rating`]: this.filmInfo.totalRating,
        [`writers`]: this.filmInfo.writers,
      },
      [`user_details`]: {
        [`already_watched`]: this.userDetails.alreadyWatched,
        [`favorite`]: this.userDetails.favorite,
        [`personal_rating`]: this.userDetails.personalRating,
        [`watching_date`]: this.userDetails.watchingDate ? Number(moment(this.userDetails.watchingDate).format(`x`)) : null,
        [`watchlist`]: this.userDetails.watchlist,
      }
    };
  }

  static parseCard(data) {
    return new ModelCard(data);
  }

  static parseCards(data) {
    return data.map(ModelCard.parseCard);
  }
}
