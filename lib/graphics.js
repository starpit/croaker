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

const chart = require('./chart'),
      { addRow, init: initTable } = require('./table'),
      viewName = 'Load Tester'

/**
 * Initialize the UI
 *
 */
exports.initUI = ({noTable=false, container=document.createElement('div')}={}) => {
    const chart = document.createElement('div')

    container.style.flex = 1
    container.style.display = 'flex'
    container.style.flexDirection = 'column'

    container.appendChild(chart)
    chart.style.flex = 3
    chart.style.marginTop = '2em'

    const graphics = { container, chart }

    if (!noTable) {
        graphics.table = initTable(container)   // initialize the table dom
    }

    return graphics
}

/**
  * Form the response to the REPL
  *
  */
exports.response = (graphics, { testName, defaultMode='last', label='Last Run'}) => {
    setTimeout(() => chart.init(graphics), 650)

    ui.addNameToSidecarHeader(document.getElementById('sidecar'), viewName, testName)

    return {
        type: 'custom',
        graphics: graphics,
        content: graphics.container,
        modes: [
            { mode: 'last', label, defaultMode: defaultMode==='last', command: () => 'croak last', echo: true, noHistory: false },
            { mode: 'history', defaultMode: defaultMode==='history', command: () => 'croak history', echo: true, noHistory: false }
        ]
    }
}
