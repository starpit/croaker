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

const parseDuration = require('parse-duration'),
      prettyPrintDuration = require('pretty-ms')

exports.i18n = {
    requestsPerSec: 'Requests Per Second',
    latency50: 'p50 Latency',
    latency90: 'p90 Latency',
    latency99: 'p99 Latency',
    latencyMax: 'Max Latency'
}

/** latency formatter, using wrk's output */
const formatter = x => prettyPrintDuration(~~parseDuration(x))

exports.addCell = (row, rowData) => (field, {css, formatter = x=>x}={}) => {
    const cell = document.createElement('span')
    row.appendChild(cell)

    if (rowData) {
        // then this is a normal data row
        cell.innerText = formatter(rowData[field])
    } else {
        // otherwise, we're adding the header row
        cell.innerText = exports.i18n[field] || field
        cell.style.fontFamily = 'var(--font-sans-serif)'
    }

    if (css) {
        cell.className = css
    }
}

/**
 * Insert a row in the given table
 *
 */
exports.insertRow = table => {
    const row = document.createElement('div'),
          rowInner = document.createElement('div')

    row.classList.add('entity')
    rowInner.classList.add('entity-attributes')
    table.appendChild(row)
    row.appendChild(rowInner)

    return rowInner
}

/**
 * Add a row to the table
 *
 */
exports.addRow = ({table}) => rowData => {
    const addCell = exports.addCell(exports.insertRow(table), rowData)

    addCell('requestsPerSec', { css: 'bold border-right', formatter: x=>~~x })
    addCell('latency50', {formatter})
    addCell('latency90', {formatter})
    addCell('latency99', {formatter})
    addCell('latencyMax', {formatter})
}

/**
 * Create a table view
 *
 */
exports.init = container => {
    const tableOuter = document.createElement('div'),
          table = document.createElement('div')

    tableOuter.style.flex = 2
    tableOuter.style.marginTop = '1em'
    tableOuter.style.display = 'flex'
    tableOuter.style.justifyContent = 'center'
    tableOuter.style.fontFamily = 'var(--font-monospace)'
    tableOuter.style.overflowY = 'auto'
    tableOuter.classList.add('result-table')
    tableOuter.classList.add('result-vertical')
    table.classList.add('repl-result')
    table.style.width = '100%'
    table.style.borderLeft = 'none'
    table.style.borderRight = 'none'

    container.appendChild(tableOuter)
    tableOuter.appendChild(table)

    return table
}

