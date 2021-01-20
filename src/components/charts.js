import React, {Component} from 'react';
import Chart from "chart.js"

class Charts extends Component {

    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }

    componentDidUpdate() {
        this.myChart.data.labels = this.props.data.map(d => d.time);
        this.myChart.data.datasets[0].data = this.props.data.map(d => d.value);
        this.myChart.update();
    }

    componentDidMount() {
        this.myChart = new Chart(this.chartRef.current, {
            type: 'line',
            options: {
                scales: {
                    xAxes: [
                        {
                            ticks: {
                                min: 1
                            }
                        }
                    ],
                    yAxes: [
                        {
                            ticks: {
                                min: 0,
                                max: this.props.max
                            }
                        }
                    ]
                }
            },
            data: {
                labels: this.props.data.map(d => d.index),
                datasets: [{
                    label: this.props.title,
                    data: this.props.data.map(d => d.NCP),
                    fill: 'none',
                    backgroundColor: this.props.color,
                    pointRadius: 2,
                    borderColor: this.props.color,
                    borderWidth: 1,
                    lineTension: 0
                }]
            }
        });
    }

    render() {
        return <canvas ref={this.chartRef}/>;
    }
}

export default Charts;
