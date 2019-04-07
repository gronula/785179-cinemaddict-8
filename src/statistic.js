import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

const getChartData = (cards) => {
  const statistics = {
    genres: [],
    totalWatched: 0,
    totalDuration: ``
  };

  let genres = {};

  cards.forEach((it) => {
    if (it.userDetails.alreadyWatched) {
      it.filmInfo.genre.forEach((el) => {
        genres[el] = genres[el] ? genres[el] + 1 : 1;
      });

      statistics.totalWatched++;

      const filmDuration = moment.duration(it.filmInfo.runtime, `m`);
      statistics.totalDuration = moment.duration(statistics.totalDuration).add(filmDuration);
    }
  });

  genres = {
    name: Object.keys(genres),
    amount: Object.values(genres),
  };

  genres.amount.forEach((it, i) => {
    statistics.genres.push({
      name: genres.name[i],
      amount: it
    });
  });

  statistics.genres.sort((a, b) => b.amount - a.amount);

  return statistics;
};

export default (cards) => {
  const chartData = getChartData(cards);

  const statisticCtx = document.querySelector(`.statistic__chart`);
  const BAR_HEIGHT = 50;
  statisticCtx.height = BAR_HEIGHT * chartData.genres.length;

  const totalWatched = document.querySelector(`.statistic__text-item:nth-of-type(1)  .statistic__item-text`);
  const totalDuration = document.querySelector(`.statistic__text-item:nth-of-type(2)  .statistic__item-text`);
  const totalGenre = document.querySelector(`.statistic__text-item:nth-of-type(3)  .statistic__item-text`);

  totalWatched.innerHTML = `${chartData.totalWatched} <span class="statistic__item-description">movies</span>`;
  totalDuration.innerHTML = `${moment.duration(chartData.totalDuration).get(`d`) * 24 + moment.duration(chartData.totalDuration).get(`h`)} <span class="statistic__item-description">h</span> ${moment.duration(chartData.totalDuration).get(`m`)} <span class="statistic__item-description">m</span>`;
  totalGenre.innerHTML = `${chartData.genres[0].name}`;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartData.genres.map((it) => it.name),
      datasets: [{
        data: chartData.genres.map((it) => it.amount),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};
