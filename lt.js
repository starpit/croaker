#!/usr/bin/env node

const wrk = require('wrk'),
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
        duration: '5s',
        timeout: '10000',
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
              fratio = !first ? 1 : parseDuration(current.latencyAvg) / parseDuration(first.latencyAvg)
              pratio = !prev ? 1 : parseDuration(current.latencyAvg) / parseDuration(prev.latencyAvg)

        results.push(current);
        console.error(N, current.requestsPerSec, fratio, pratio, current.latency50, current.latency75, current.latency90, current.latency99, current.latencyMax)

        if (prev) {

            if (fratio > 10 || pratio > 2
                || current.non2xx3xx > 0
                || current.connectErrors > 0
                || current.readErrors > 0
                || current.writeErrors > 0
                || current.timeoutErrors > 0) {
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
