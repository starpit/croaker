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

const lsKeys = {
    history: 'fsh.croaker.history',
    last:  'fsh.croaker.last'
}

/**
 * Clear history
 *
 */
exports.clear = () => {
    localStorage.removeItem(lsKeys.history)
    localStorage.removeItem(lsKeys.last)

    return true
}

/**
 * Delete selected history
 *
 */
exports.del = (_1, _2, _3, modules, _5, _6, args, options) => {
    const idx = args.indexOf('delete'),
          which = args.slice(idx + 1)

    if (which.length === 0 || options.help) {
        throw new modules.errors.usage(args.slice(0, idx).join(' ') + ' <idx1> [<idx2> <idx3> ...]')
    }

    let list = exports.all()

    // update the last model
    if (which.find(_ => _ === list.length - 1)) {
        const penultimate = list[list.length - 2]
        if (!penultimate) {
            localStorage.removeItem(lsKeys.last)
        } else {
            localStorage.setItem(lsKeys.last, JSON.stringify(penultimate))
        }
    }

    // update the list of all runs
    which.forEach(idx => {
        list[idx] = null
    })
    list = list.filter(_=>_) // remove the nulls

    localStorage.setItem(lsKeys.history, JSON.stringify(list))

    eventBus.emit('/croak/history/delete', which)

    return true
}

/**
  * Stash the results of a load run
  *
  */
exports.remember = (dataset, testName, apiHost) => {
    // this is the record structure
    const last = { dataset, testName, apiHost }

    // persist it in the "last" model
    localStorage.setItem(lsKeys.last, JSON.stringify(last))

    // persist it in the "list" model
    const history = exports.all()
    history.push(last)
    localStorage.setItem(lsKeys.history, JSON.stringify(history))
}

/**
 * @return the most recent data set
 *
 */
exports.last = () => {
    const last = localStorage.getItem(lsKeys.last)
    if (last) {
        return JSON.parse(last)
    }
}

/**
 * @return the idx-th data set
 *
 */
exports.get = idx => {
    return exports.all()[idx]
}

/**
 * @return the history of data sets
 *
 */
exports.all = () => {
    const history = localStorage.getItem(lsKeys.history)
    if (history) {
        return JSON.parse(history)
    } else {
        return []
    }
}

