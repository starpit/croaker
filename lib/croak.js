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

const { lt } = require('./lt'),
      { addRow } = require('./table'),
      { initUI, response } = require('./graphics'),
      history = require('./history')

/**
 * Start a load test, hooked up to graphics
 *
 */
exports.lt = wsk => (_1, _2, _3, _4, _5, _6, args, options) => {
    const url = args[args.indexOf('lt') + 1] || options.url,
          testName = options.name || url

    if (!url || options.help) {
        throw new Error('Usage: croak <url>')
    }

    // reigster as a listener for load test updates, for the table
    const graphics = initUI(),
          handler = addRow(graphics)
    eventBus.on('/croak/iter', handler)
    handler() // add header row to the table

    /**
     * Deregister event listeners, record the final result in persistent storage
     *
     */
    const finishUp = dataset => {
        // deregister as a listener for load test updates
        eventBus.removeListener('/croak/iter', handler)

        // stash the dataset, for future consumption
        wsk.apiHost.get().then(apiHost => history.remember(dataset, testName, apiHost))
    }

    // start the load run
    lt({ url, eventBus, wsk }).then(finishUp)

    return wsk.apiHost.get().then(apiHost => response(graphics, { testName, apiHost }))
}

/**
 * End the current load test
 *
 */
exports.end = () => {
    eventBus.emit('/croak/terminate')
    return true
}
