/* global chrome */
import React, {Component} from 'react';
import './App.css';
import Chart from 'chart.js'


// var ctx = document.getElementById('donutChart')
// const data = []
// const labels = []

// var myChart = new Chart(ctx, {
//   type: 'doughnut',
//   data: data,
//   labels: labels
// })

class App extends Component {
  constructor() {
    super()
    this.state = {
      sitesVisitedToday: {},
      data: [],
      labels: []
    }

    this.chartEl = null;
    this.chart = null
  }

  componentDidMount() {
    this.chartEl = document.getElementById('donutChart').getContext('2d');

    chrome.storage.sync.get('sitesVisitedToday', ({sitesVisitedToday}) => {
      const newData = [], newLabels = []

      Object
        .entries(sitesVisitedToday)
        .map(([site, duration]) => ({site, duration}))
        .sort((a, b) => b.duration < a.duration ? -1 : 1)
        .forEach(({site, duration}) => {
          newLabels.push(site)
          newData.push(duration.toFixed(2))
        });

      this.chart = new Chart(this.chartEl, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: newData.slice(0, 10),
            backgroundColor: [
              '#C0392B',
              '#D35400',
              '#E67E22',
              '#F1C40F',
              '#2ECC71',
              '#27AE60',
              '#16A085',
              '#1ABC9C',
              '#3498DB',
              '#9B59B6'
            ]
          }],
          labels: newLabels.slice(0, 10)
        },
      })

      this.setState({
        sitesVisitedToday,
        data: newData,
        labels: newLabels
      })

    })
  }
  render() {
    // console.log('in render')
    // console.log(this.state)

    return (
      <div className="App" style={{width: 500, height: 500}}>
        <h2>Top 10 sites visited today by minutes spent</h2>
        <canvas id="donutChart" width="400" height="400"></canvas>
      </div>
    )
  }
}

export default App;



// const data = {
//   mozilla: 100,
//   poopButt: 200,
// }
// const shit = Object
//   .entries(data)
//   .map(([site, duration]) => ({ site, duration }))
//   .sort((a, b) => b.duration < a.duration ? -1 : 1)

// console.log(shit)