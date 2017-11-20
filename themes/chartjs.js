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
    const area = '#FFCD57',
          gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, transparent(area, 0.8))
    gradient.addColorStop(1, transparent(area, 0))

    return {
        bar: [
            '#C2BFC0',
            null,
            '#5EB5EF',
            '#FF829D'
        ],
        area: gradient,
        areaStroke: area,
        border: '#F8F8F8'
    }
}
