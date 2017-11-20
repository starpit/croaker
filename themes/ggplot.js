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
    const area = '#5A6C72',
          gradient = ctx.createLinearGradient(0, 0, 0, 200)
    gradient.addColorStop(0, transparent(area, 0.9))
    gradient.addColorStop(1, transparent(area, 0.4))

    return {
        bar: [
            '#00BFC4',
            null,
            '#F8766D',
            '#362C21'
        ],
        area: gradient,
        areaStroke: area,
        border: 'rgba(255,255,255,0.5)'
    }
}
