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

const wrk = require('wrk'),
      path = require('path'),
      parseDuration = require('parse-duration'),
      rootDir = path.join(__dirname, '..')

/**
 * Start a load test against the given url
 *
 */
exports.lt = ({url, N = 1, results = [], eventBus, duration = '5s' }) => {
    const nThreads = N * 1,
          nConns = N * 10

    // use wrk to drive the load
    wrk({
        threads: nThreads,
        connections: nConns,
        duration,
        timeout: '10000',
	path: path.join(rootDir, 'wrk', 'wrk'),             // wrk/wrk is the location of the wrk binary
	script: path.join(rootDir, 'scripts', 'echo.lua'),
        printLatency: true,
        url
    }, (err, current) => {
        if (err) {
            console.error(err)
            //console.log(results)
            throw new Error('Internal Error')
        }

        const first = results[0],
              prev = results[results.length - 1],
              fratio = !first ? 1 : parseDuration(current.latency50) / parseDuration(first.latency50)
              pratio = !prev ? 1 : parseDuration(current.latency50) / parseDuration(prev.latency50)

        results.push(current)

        // notify the client of an incremental data point
        if (eventBus) {
            eventBus.emit('/lt/iter', Object.assign({
                N, fratio, pratio
            }, current))
        }

        if (prev) {

            if (fratio > 4) {
		console.error(`Exiting due to fratio ${fratio}`)
                return results
	    } else if (pratio > 2) {
		console.error(`Exiting due to pratio ${pratio}`)
                return results
	    } else if (current.non2xx3xx > 0) {
		console.error(`Exiting due to non2xx3xx ${current.non2xx3xx}`)
                return results
	    } else if (current.connectErrors > 0) {
		console.error(`Exiting due to connectErrors ${current.connectErrors}`)
                return results
	    } else if (current.readErrors > 0) {
		console.error(`Exiting due to readErrors ${current.readErrors}`)
                return results
            } else if (current.writeErrors > 0) {
		console.error(`Exiting due to writeErrors ${current.writeErrors}`)
                return results
            } else if (current.timeoutErrors > 0) {
		console.error(`Exiting due to timeoutErrors ${current.timeoutErrors}`)
                return results
            }
        }

        if (N === 100) {
            return results
        } else {
            return exports.lt({ url, N: N + 1, results, duration, eventBus })
        }
    });
}
