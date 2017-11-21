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

const history = require('./history'),
      { initUI, response } = require('./graphics'),
      { addRow } = require('./table')

/** have some fun with replay... add a pause, in milliseconds, between each iter */
const playbackPause = 1

/**
  * Replay a previous dataset
  *
  */
exports.replay = ({apiHost, dataset, testName}, graphics = initUI(), options={}) => {
    const resp = response(graphics, Object.assign({ apiHost, testName }, options))

    if (!options.noTable) {
        // add header row to the table
        addRow(resp.graphics)()
    }

    const iter = (idx=0) => {
        if (idx < dataset.length) {
            const row = dataset[idx]
            eventBus.emit('/croak/iter', row)

            if (!options.noTable) {
                addRow(resp.graphics)(row)
            }

            // replay the next iter
            setTimeout(() => iter(idx + 1), playbackPause)
        }
    }
    setTimeout(iter, 650)

    return resp
}

/**
 * Visualize the most recent data set
 *
 */
exports.last = () => {
    const last = history.last()
    if (!last) {
        throw new Error('You have no load test runs available for viewing')
    }

    return exports.replay(last)
}

/**
 * Visualize the idx-th most recent data set
 *
 */
exports.show = (_1, _2, _3, _4, _5, _6, args, options) => {
    const idx = args[args.indexOf('show') + 1]
    if (idx===undefined || options.help) {
        console.error(idx, args)
        throw new Error('Usage: croak show <index>')
    }

    const dataset = history.get(idx)
    if (!dataset) {
        throw new Error('The requested load test run is not available for viewing')
    }

    return exports.replay(dataset, undefined, { label: `Run #${idx}` })
}
