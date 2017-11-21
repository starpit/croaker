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

const { all } = require('./history'),
      { prettyUrl } = require('./util'),
      { replay } = require('./replay'),
      { initUI, response } = require('./graphics'),
      { insertRow, addCell, i18n } = require('./table')

exports.list = wsk => () => wsk.apiHost.get().then(apiHost => {
    const graphics = initUI( { noChart: true }),
          resp = response(graphics, { testName: 'Historical', defaultMode: 'history', apiHost })

    // currently selected row, the first by default
    let selectedIdx
    const show = (run, row, idx) => () => {
        if (selectedIdx === undefined || idx !== selectedIdx) {
            /*selectedIdx = idx
            ui.removeAllDomChildren(graphics.chart)
            replay(run, undefined, { noTable: true })

            const current = row.parentNode.querySelector('.selected-row')
            if (current) {
                current.classList.remove('selected-row')
            }
            row.classList.add('selected-row')
            console.error('@@@', row)*/
        }
    }

    // for each historic run...
    const showAll = () => {
        ui.removeAllDomChildren(resp.graphics.table)

        // table header row
        const header = addCell(insertRow(resp.graphics.table))
        header('API Host')
        header('Test Name', { css: 'border-right' })
        header(i18n.requestsPerSec)
        header(i18n.latency50)
        header(i18n.latency99)
        header(i18n.latencyMax)

        all().forEach((run, idx) => {
            const row = insertRow(resp.graphics.table),
                  cell = addCell(row, run)

            if (idx === 0) {
                // on open, show the default index in the chart view
                //show(run, row, idx)()
            }

            // find the max sample in this run, so we can display it in the table
            const { requestsPerSec: maxRPS } = run.dataset.reduce((max,row) => {
                if (!max || row.requestsPerSec > max.requestsPerSec) {
                    return row
                } else {
                    return max
                }
            }, undefined)
            const { requestsPerSec, latency50, latency99, latencyMax } = run.dataset.find(row => row.requestsPerSec >= 0.8 * maxRPS)
            //const { requestsPerSec, latency50, latency99, latencyMax } = run.dataset.find(row => row.requestsPerSec === maxRPS)

            // the addCell impl requires that the fields be part of the data object...
            run.requestsPerSec = requestsPerSec
            run.latency50 = latency50
            run.latency99 = latency99
            run.latencyMax = latencyMax

            // now we can add the cells to the view
            cell('apiHost', { formatter: prettyUrl })
            cell('testName', { css: 'border-right' })
            cell('requestsPerSec', { css: 'bold' })
            cell('latency50')
            cell('latency99')
            cell('latencyMax')

            row.onclick = () => {
                const container = graphics.container,
                      command = `croak show ${idx}`,
                      highlightThis = undefined,
                      returnTo = undefined
                return ui.pictureInPicture(command, highlightThis, container, returnTo)(event)
            }
        })
    }
    showAll()
    eventBus.on('/croak/history/delete', showAll)
    
    return resp
})
