#!/usr/bin/env node

const wrk = require('wrk'),
      path = require('path'),
      parseDuration = require('parse-duration')

if (!process.env.URL) {
    console.error('Please set process.env.URL')
    process.exit(1)
}

function benchmark(N = 1, results = []) {
    const nThreads = N * 1,
          nConns = N * 10

    wrk({
        threads: nThreads,
        connections: nConns,
        duration: '10s',
        timeout: '10000',
	path: path.join('wrk', 'wrk'), // wrk/wrk is the location of the wrk binary
	script: path.join('scripts', 'echo.lua'),
        printLatency: true,
        url: process.env.URL
    }, (err, current) => {
        if (err) {
            console.error(err)
            console.log(results)
            process.exit(1)
        }

        const first = results[0],
              prev = results[results.length - 1],
              fratio = !first ? 1 : parseDuration(current.latency50) / parseDuration(first.latency50)
              pratio = !prev ? 1 : parseDuration(current.latency50) / parseDuration(prev.latency50)

        results.push(current);
        console.error(N, current.requestsPerSec, fratio, pratio, current.latency50, current.latency75, current.latency90, current.latency99, current.latencyMax)

        if (prev) {

            if (fratio > 4) {
		console.error(`Exiting due to fratio ${fratio}`)
                return console.log(results)
	    } else if (pratio > 2) {
		console.error(`Exiting due to pratio ${pratio}`)
                return console.log(results)
	    } else if (current.non2xx3xx > 0) {
		console.error(`Exiting due to non2xx3xx ${current.non2xx3xx}`)
                return console.log(results)
	    } else if (current.connectErrors > 0) {
		console.error(`Exiting due to connectErrors ${current.connectErrors}`)
                return console.log(results)
	    } else if (current.readErrors > 0) {
		console.error(`Exiting due to readErrors ${current.readErrors}`)
                return console.log(results)
            } else if (current.writeErrors > 0) {
		console.error(`Exiting due to writeErrors ${current.writeErrors}`)
                return console.log(results)
            } else if (current.timeoutErrors > 0) {
		console.error(`Exiting due to timeoutErrors ${current.timeoutErrors}`)
                return console.log(results)
            }
        }

        if (N === 100) {
            console.log(results);
        } else {
            benchmark(N + 1, results);
        }
    });
}

benchmark();
