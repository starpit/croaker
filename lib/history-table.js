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
      { replay } = require('./replay'),
      { initUI, response } = require('./graphics'),
      { insertRow, addCell, i18n } = require('./table')

exports.list = () => {
    const graphics = initUI(),
          resp = response(graphics, { testName: 'Historical', defaultMode: 'history' }),
          header = addCell(insertRow(resp.graphics.table))

    // table header row
    header('Test Name', { css: 'border-right' })
    header(i18n.requestsPerSec)
    header(i18n.latency50)
    header(i18n.latency99)
    header(i18n.latencyMax)

    // currently selected row, the first by default
    let selectedIdx
    const show = (run, row, idx) => () => {
        if (selectedIdx === undefined || idx !== selectedIdx) {
            repl.pexec(`croak show ${idx}`)
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
    all().forEach((run, idx) => {
        const row = insertRow(resp.graphics.table),
              cell = addCell(row, run)

        if (idx === 0) {
            // on open, show the default index in the chart view
            //show(run, row, idx)()
        }

        // find the max sample in this run, so we can display it in the table
        const { requestsPerSec, latency50, latency99, latencyMax } = run.dataset.reduce((max,row,ii) => {
            if (!max || row.requestsPerSec > max.requestsPerSec) {
                return row
            } else {
                return max
            }
        }, undefined)

        // the addCell impl requires that the fields be part of the data object...
        run.requestsPerSec = requestsPerSec
        run.latency50 = latency50
        run.latency99 = latency99
        run.latencyMax = latencyMax

        // now we can add the cells to the view
        cell('testName', { css: 'border-right' })
        cell('requestsPerSec', { css: 'bold' })
        cell('latency50')
        cell('latency99')
        cell('latencyMax')

        row.onclick = show(run, row, idx)
    })
    
    return resp
}