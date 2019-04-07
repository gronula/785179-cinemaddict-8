export default class ModelTask {
  constructor(data) {
    this.id = data[`id`];
    this.comments = data.comments.map((it) => {
      it.date = new Date(it.date);
      return it;
    });
    this.filmInfo = {
      actors: data[`film_info`][`actors`] || [],
      ageRating: data[`film_info`][`age_rating`] || ``,
      alternativeTitle: data[`film_info`][`alternative_title`] || ``,
      description: data[`film_info`][`description`] || ``,
      director: data[`film_info`][`director`] || ``,
      genre: data[`film_info`][`genre`] || [],
      poster: data[`film_info`][`poster`] || ``,
      release: {
        date: new Date(data[`film_info`].release[`date`]),
        releaseCountry: data[`film_info`].release[`release_country`] || ``,
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
      watchingDate: new Date(data[`user_details`][`watching_date`]),
      watchlist: Boolean(data[`user_details`][`watchlist`]),
    };
  }

  toRAW() {
    return {
      [`id`]: this.id,
      [`comments`]: this.comments,
      [`film_info`]: this.filmInfo,
      [`user_details`]: this.userDetails,
    };
  }

  static parseTask(data) {
    return new ModelTask(data);
  }

  static parseTasks(data) {
    return data.map(ModelTask.parseTask);
  }
}
