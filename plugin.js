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

const { lt, end } = require('./lib/croak'),
      { last, show } = require('./lib/replay'),
      { list } = require('./lib/history-table'),
      { del, clear } = require('./lib/history')

module.exports = (commandTree, prequire) => {
    const wsk = prequire('/ui/commands/openwhisk-core')

    commandTree.listen('/croak/lt', lt(wsk))         // start a new load run
    commandTree.listen('/croak/end', end)            // end any ongoing load run
    commandTree.listen('/croak/last', last)          // show last run, from history
    commandTree.listen('/croak/history', list(wsk))  // show recent history
    commandTree.listen('/croak/delete', del)         // delete selected historical run
    commandTree.listen('/croak/clear', clear)        // clear history
    commandTree.listen('/croak/show', show)          // show a given historical run
}
