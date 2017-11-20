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
    const area = '#152934',
          gradient = ctx.createLinearGradient(0, 0, 0, 800)
    gradient.addColorStop(0, transparent(area, 0.9))
    gradient.addColorStop(1, transparent(area, 0.1))

    return {
        bar: [
            '#152934',
            null,
            'hsla(194, 71%, 40%, 1)',
            '#152934'//'#FF829D'
        ],
        area: gradient,
        border: 'rgba(255,255,255,0.1)'
    }
}
