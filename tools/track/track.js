/* Tiny Tracker v0.2
 * Copyright (c) 2017 Eugene Y. Q. Shen.
 *
 * Tiny Tracker is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version
 * 3 of the License, or (at your option) any later version.
 *
 * Tiny Tracker is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 */

const LOCAL_STORAGE_NAME = "eyqs_track_data";
const IGNORE_EVENT_TIME = 5000;
const EMPTY_JSON_LENGTH = 64;
// "name": [{start_time: 0, end_time: 7}, ...]
let past_dict = {};
// "name": {activity: "name", instant: true, count: 8}
let cell_dict = {};
// "name, foo, bar": {chain: "name, foo, bar", activity: "name",
//                    next: ["foo", "bar"], count: 32}
let chain_dict = {};
// {activity: "name", time: 9, paused: true, next: ["next"]}
let current_list = [];


// utility functions

function clickCell(cell) {
  return startAction({activity: cell.activity}, cell.instant);
}

function clickChain(chain) {
  return startAction({activity: chain.activity, next: chain.next}, false);
}

function submitInput() {
  const form = document.getElementById("track");
  const value = form.elements.activity.value;
  const instant = form.elements.instant.checked;
  const split = value.split(",").map((item) => item.trim())
    .filter((item) => item.length !== 0);
  const chain = split.join(", ");
  const activity = split[0];
  const next = split.slice(1);
  form.elements.activity.value = "";
  form.elements.instant.checked = false;
  if (split.length > 0) {
    if (split.length > 1) {
      if (chain_dict[chain]) {
        chain_dict[chain].count += 1;
      } else {
        chain_dict[chain] = {chain, activity, next, count: 1};
      }
      return startAction({activity, next}, false);
    }
    return startAction({activity}, instant);
  }
}

function toggleBanner(index) {
  const action = current_list[index];
  const current_time = new Date().getTime();
  action.paused = !action.paused;
  // if action is now unpaused, start a new action
  if (!action.paused) {
    action.time = current_time;
    return update();
  } else {
    return stopAction(action, current_time);
  }
}

function stopBanner(index) {
  const action = current_list[index];
  const current_time = new Date().getTime();
  current_list.splice(index, 1);
  if (action.paused) {
    return update();
  } else {
    return stopAction(action, current_time);
  }
}

function nextBanner(index) {
  const action = current_list[index];
  const current_time = new Date().getTime();
  current_list.splice(index, 1);
  if (!action.paused) {
    stopAction(action, current_time);
  }
  if (action.next.length > 0) {
    return startAction({
      activity: action.next[0],
      next: action.next.slice(1),
    }, false);
  }
}

function sortData(list) {
  return Object.keys(list).sort((a, b) => list[b].count - list[a].count);
}

function importData() {
  const data = window.localStorage.getItem(LOCAL_STORAGE_NAME);
  if (data) {
    try {
      ({past_dict, cell_dict, chain_dict, current_list} = JSON.parse(data));
    } catch (ignore) {}
  }
}

function exportData() {
  const data = JSON.stringify(
    {past_dict, cell_dict, chain_dict, current_list}
  );
  if (data.length >= EMPTY_JSON_LENGTH) {
    window.localStorage.setItem(LOCAL_STORAGE_NAME, data);
  }
}

function resetData() {
  window.localStorage.setItem(LOCAL_STORAGE_NAME, "");
}


// start tracking the given action

function startAction(action, instant) {
  const current_time = new Date().getTime();
  if (instant) {
    saveEvent(action.activity, current_time, current_time, true);
  } else {
    for (current of current_list) {
      if (action.activity === current.activity) {
        return;
      }
    }
    action.time = new Date().getTime();
    action.paused = false;
    current_list.push(action);
  }
  return update();
}


// stop tracking the given action

function stopAction(action, end_time) {
  if (end_time - action.time > IGNORE_EVENT_TIME) {
    saveEvent(action.activity, action.time, end_time, false);
  }
  return update();
}


// save the given event in past_dict

function saveEvent(activity, start_time, end_time, instant) {
  if (past_dict[activity]) {
    past_dict[activity].push({start_time, end_time});
  } else {
    past_dict[activity] = [{start_time, end_time}];
  }
  if (cell_dict[activity]) {
    cell_dict[activity].count += 1;
  } else {
    cell_dict[activity] = {activity, instant, count: 1};
  }
}


// update the HTML display

function render() {

  // render the cell list
  const cell_list = sortData(cell_dict);
  const cell_element = document.getElementById("cells");
  const cell_html = [];
  for (const cell of cell_list) {
    cell_html.push(`<div class="cell">${cell_dict[cell].activity}</div>\n`);
  }
  cell_element.innerHTML = cell_html.join("");

  // render the chain list
  const chain_list = sortData(chain_dict);
  const chain_element = document.getElementById("chains");
  const chain_html = [];
  for (const chain of chain_list) {
    chain_html.push(`<div class="cell">${chain_dict[chain].chain}</div>\n`);
  }
  chain_element.innerHTML = chain_html.join("");


  // render the banner
  const banner_element = document.getElementById("banner");
  const banner_html = [];
  for (const action of current_list) {
    const banner_buttons = [];
    let time_string = new Date(action.time).toString().split(" ")[4];
    if (action.paused) {
      time_string = "paused";
      banner_buttons.push("<div class='banner-button'>\u25B6\uFE0E</div>");
    } else {
      banner_buttons.push("<div class='banner-button'>\u25AE\u25AE</div>");
    }
    banner_buttons.push("<div class='banner-button'>\u25FC</div>");
    if (action.next && action.next.length > 0) {
      banner_buttons.push("<div class='banner-button'>\u2794</div>");
    }
    banner_html.push(
      `<div class="banner">
         <div class="banner-activity">${action.activity}</div>
         <div class="banner-time">${time_string}</div>
         <div class="banner-controls">${banner_buttons.join("\n")}</div>
       </div>`
    );
  }
  banner_element.innerHTML = banner_html.join("");

  // add event listeners
  for (let i = 0; i < cell_list.length; i++) {
    cell_element.children[i].addEventListener("click",
      () => clickCell(cell_dict[cell_list[i]]));
  }
  for (let i = 0; i < chain_list.length; i++) {
    chain_element.children[i].addEventListener("click",
      () => clickChain(chain_dict[chain_list[i]]));
  }
  for (let i = 0; i < current_list.length; i++) {
    const controls = banner_element.children[i].children[2];
    try {
      controls.children[0].addEventListener("click", () => toggleBanner(i));
      controls.children[1].addEventListener("click", () => stopBanner(i));
      controls.children[2].addEventListener("click", () => nextBanner(i));
    } catch (ignore) {}
  }
}


// update everything

function update() {
  exportData();
  return render();
}


// add all event listeners when ready

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("track").addEventListener("submit", function (e) {
    e.preventDefault();
    submitInput();
  });
  importData();
  render();
});
