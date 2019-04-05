import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

const getChartData = (cards) => {
  const statistics = {
    genres: {
      name: [],
      amount: []
    },
    totalWatched: 0,
    totalDuration: ``
  };
  cards.forEach((it) => {
    if (it.isWatched) {
      if (statistics.genres.name.indexOf(it.genre) === -1) {
        statistics.genres.name.push(it.genre);
        statistics.genres.amount.push(1);
      } else {
        statistics.genres.amount[statistics.genres.name.indexOf(it.genre)]++;
      }
      statistics.totalWatched++;

      const filmDuration = it.duration.slice(0, -1).split(`h`);
      statistics.totalDuration = moment.duration(statistics.totalDuration).add({hours: filmDuration[0], minutes: filmDuration[1]});
    }
  });
  return statistics;
};

export default (cards) => {
  const chartData = getChartData(cards);

  const statisticCtx = document.querySelector(`.statistic__chart`);
  const BAR_HEIGHT = 50;
  statisticCtx.height = BAR_HEIGHT * chartData.genres.name.length;

  const totalWatched = document.querySelector(`.statistic__text-item:nth-of-type(1)  .statistic__item-text`);
  const totalDuration = document.querySelector(`.statistic__text-item:nth-of-type(2)  .statistic__item-text`);
  const totalGenre = document.querySelector(`.statistic__text-item:nth-of-type(3)  .statistic__item-text`);

  totalWatched.innerHTML = `${chartData.totalWatched} <span class="statistic__item-description">movies</span>`;
  totalDuration.innerHTML = `${moment.duration(chartData.totalDuration).get(`h`)} <span class="statistic__item-description">h</span> ${moment.duration(chartData.totalDuration).get(`m`)} <span class="statistic__item-description">m</span>`;
  totalGenre.innerHTML = `${chartData.genres.name[chartData.genres.amount.indexOf(Math.max(...chartData.genres.amount))]}`;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartData.genres.name,
      datasets: [{
        data: chartData.genres.amount,
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
