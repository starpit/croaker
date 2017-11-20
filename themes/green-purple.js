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

const { transparent } = require('../lib/util')

exports.colors = ctx => {
    const area = '#018001',
          gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, transparent(area, 0.99))
    gradient.addColorStop(1, transparent(area, 0.25))

    const base = [
        '#030382',
        '#030382'
    ]
    return {
        fontFamily: 'Roboto',
        bar: {
            latency50: { border: base[0], bg: base[0] },
            latency99: { border: base[1], bg: 'transparent' },
            latency25: { bg: transparent(base[0], 0.3), border: 'transparent' },
            latency75: { bg: transparent(base[0], 0.3), border: 'transparent' },
            latencyMinMax: { bg: transparent(base[0], 0.075), border: 'transparent' }
        },
        area,
        areaStroke: 'transparent',
        border: '#323232',
        chart: {
            backgroundColor: '#fff'
        },
        borderWidth: 4
    }
}
