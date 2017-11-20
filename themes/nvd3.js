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
    const area = '#FDA353',
          gradient = ctx.createLinearGradient(0, 0, 0, 500)
    gradient.addColorStop(0, transparent(area, 0.9))
    gradient.addColorStop(1, transparent(area, 0.2))

    return {
        bar: [
            '#C1D2EA',
            null,
            '#5F9DC8',
            '#FF829D'
        ],
        area: gradient,
        areaStroke: area,
        border: '#F8F8F8'
    }
}
