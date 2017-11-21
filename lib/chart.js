/*
 * Copyright 2017 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { transparent } = require('./util'),
      parseDuration = require('parse-duration'),
//      { colors } = require('../themes/green-purple')
{ colors } = require('../themes/ggplot2')
//      { colors } = require('../themes/chartjs')

exports.init = (graphics, options={}) => {
    if (graphics.chart === undefined) {
        // then we weren't asked to make a chart
        return
    }

    if (typeof Chart === 'undefined') {
        ui.injectScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.bundle.min.js')

        return setTimeout(() => exports.init(graphics, options), 100)
    }

    const canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d'),
          { fontFamily, bar, area, areaStroke=area, areaBorderWidth=4, border, borderWidth = 1, chart:chartStyle } = colors(ctx)

    ctx.canvas.width = '100%'
    graphics.chart.appendChild(canvas)

    if (chartStyle && chartStyle.backgroundColor) {
        graphics.container.style.background = chartStyle.backgroundColor;
    }

    const timeFormat = 'MM/DD/YYYY HH:mm',
          type = 'line', fill = false, yAxisID = 'latency', pointRadius = 0, lineTension = 0
    var chartData = {
        labels: [ ],
        datasets: [
            { type, fill, label: '99% Latency', data: [], borderColor: bar.latency99.border, backgroundColor: bar.latency99.bg, borderWidth, pointRadius, yAxisID, lineTension, borderDash: [4,2], pointBackgroundColor: 'transparent' },
            { type, fill, label: 'Median Latency', data: [], borderColor: bar.latency50.border, backgroundColor: bar.latency50.bg, borderWidth, pointRadius, yAxisID, lineTension },
            { type, fill: '+1', label: 'skip', data: [], borderColor: bar.latency25.border, backgroundColor: bar.latency25.bg, borderWidth, pointRadius, yAxisID, lineTension },
            { type, fill: '-1', label: '25-75% Latency Range', data: [], borderColor: bar.latency75.border, backgroundColor: bar.latency75.bg, borderWidth, pointRadius, yAxisID, lineTension },
            { type, fill: '+1', label: 'skip', data: [], borderColor: bar.latencyMinMax.border, backgroundColor: bar.latencyMinMax.bg, borderWidth, pointRadius, yAxisID, lineTension },
            { type, fill: '-1', label: 'Min-Max Latency Range', data: [], borderColor: bar.latencyMinMax.border, backgroundColor: bar.latencyMinMax.bg, borderWidth, pointRadius, yAxisID, lineTension },
            { type, fill, label: 'Requests per Second', data: [], backgroundColor: 'transparent', borderColor: area, yAxisID: 'rps', borderWidth, pointRadius, pointStyle: 'rectRot', pointBackgroundColor: area, lineTension },
            { type, fill: '+1', label: 'skip', data: [], backgroundColor: transparent(area,0.025), borderColor: 'transparent', yAxisID: 'rps', borderWidth, pointRadius, lineTension },
            { type, fill: '-1', label: 'skip', data: [], backgroundColor: transparent(area,0.025), borderColor: 'transparent', yAxisID: 'rps', borderWidth, pointRadius, lineTension }
        ]
    }

    const gridLines =  { zeroLineWidth: 3, zeroLineColor: '#4C4C4C', drawTicks: false, color: '#D8D8D8' },
          gridLinesTransparent = Object.assign({}, gridLines, { color: 'transparent' }),
          ticks = { beginAtZero: true, padding: 10, fontStyle: 'bold' }

    const chart = graphics.container.chart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            /*title: {
                display: true,
                text: 'Load Test Results'
            },*/
            tooltips: {
                mode: 'index',
                intersect: true,
                titleFontFamily: fontFamily,
                bodyFontFamily: fontFamily,
                footerFontFamily: fontFamily
            },
            legend: {
                reverse: true,
                labels: {
                    fontFamily,
                    usePointStyle: true,
                    filter: (item, data) => {
                        return item.text !== 'skip'
                    }
                }
            },
            scales: {
		xAxes: [{
		    type: 'time',
		    display: true,
                    //stacked: true,
                    ticks: {
                        fontFamily,
                        padding: 10,
                        maxTicksLimit: 4
                    },
                    gridLines: gridLinesTransparent,
                    maxBarThickness: 30,
		    time: {
			format: timeFormat
			// round: 'day'
		    },
                    scaleLabel: {
                        display: true,
                        fontStyle: 'bold',
                        fontFamily,
                        fontSize: 13,
                        labelString: 'Time'
                    }
		}],
                yAxes: [
                    { id: 'rps', position: 'left', type: 'linear', scaleLabel: { display: true, fontStyle: 'bold', fontFamily, fontSize: 13, labelString: 'Requests per Second' }, ticks, gridLines },
                    { id: 'latency', position: 'right', type: 'linear', scaleLabel: { display: true, fontStyle: 'bold', fontFamily, fontSize: 13, labelString: 'Latency' }, ticks, gridLines: gridLinesTransparent }
                ]
	    }
        }
    })

    const labels = chart.data.labels,
          l99 = chart.data.datasets[0].data,
          l50 = chart.data.datasets[1].data,
          l25 = chart.data.datasets[2].data,
          l75 = chart.data.datasets[3].data,
          lmin = chart.data.datasets[4].data,
          lmax = chart.data.datasets[5].data,
          rps = chart.data.datasets[chart.data.datasets.length - 3].data,
          rpsmin = chart.data.datasets[chart.data.datasets.length - 2].data
          rpsmax = chart.data.datasets[chart.data.datasets.length - 1].data

    const filler = (offset=0) => {
        labels.push(new Date().getTime() + offset)
        lmin.push(null)
        l25.push(null)
        l50.push(null)
        l75.push(null)
        l99.push(null)
        lmax.push(null)
        rps.push(null)
        rpsmin.push(null)
        rpsmax.push(null)
    }
    //filler()
    //filler(10000)
    //chart.update()

    const right = document.querySelector('#sidecar .header-right-bits .custom-header-content'),
          label = document.createElement('div'),
          max = document.createElement('div')
    ui.removeAllDomChildren(right)
    right.appendChild(label)
    right.appendChild(max)
    max.classList.add('kind')
    max.style.marginTop = 0
    label.classList.add('deemphasize')
    label.innerText = 'max rps'
    label.title = 'Maximum requests per second achieved during this run'

    let currentMax
    const updateMax = rps => {
        if (!currentMax || rps > currentMax) {
            max.innerText = ~~rps
            currentMax = rps
        }
    }

    if (!options.noListen) {
        //
        // register as a listener for load test updates, for the chart
        //
        const listener = eventBus.on('/croak/iter', row => {
            const {N:nThreads, requestsPerSec, rpsMin, rpsMax, latency25, latency50, latency75, latency90, latency99, latencyMax, latencyMin} = row

            try {
                const N = labels.length - 1
                //labels[N] = new Date().getTime()
                //l50[N] = parseDuration(latency50)
                //l99[N] = parseDuration(latency99)
                //lmax[N] = parseDuration(latencyMax)
                //rps[N] = requestsPerSec
                labels.push(row.timestamp)
                lmin.push(parseDuration(latencyMin))
                l25.push(parseDuration(latency25))
                l50.push(parseDuration(latency50))
                l75.push(parseDuration(latency75))
                l99.push(parseDuration(latency99))
                lmax.push(parseDuration(latencyMax))
                rps.push(requestsPerSec)
                //rpsmin.push(rpsMin * nThreads)
                //rpsmax.push(rpsMax * nThreads)

                //filler(10000)

                updateMax(requestsPerSec)

                //if (N > 0) {
                chart.update()
                //}
            } catch (err) {
                console.error(err)
            }
        })
    }

    return graphics.container.chart
}

