/* Tiny Tracker v0.1
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
let past_list = {};
let current_list = [];


// utility functions

function clickCell(activity) {
  return startAction({activity});
}

function clickChain(chain) {
  const next = [];
  for (const activity of chain) {
    next.push(activity);
  }
  return startAction({activity, next});
}

function submitInput() {
  const form = document.getElementById("track");
  let activity = form.elements.activity.value;
  const next = activity.split(",");
  if (next.length > 1) {
    activity = next[0];
    next.splice(0, 1);
  }
  form.elements.activity.value = "";
  return startAction({activity, next});
}

function toggleBanner(index) {
  const current_time = new Date().getTime();
  const {activity, time, paused} = current_list[index];
  current_list[index].time = current_time;
  current_list[index].paused = !paused;
  if (paused) {
    exportData();
    render();
  } else {
    return stopAction({activity, time}, current_time);
  }
}

function stopBanner(index) {
  const current_time = new Date().getTime();
  const {activity, time, paused} = current_list[index];
  current_list.splice(index, 1);
  if (paused) {
    exportData();
    render();
  } else {
    return stopAction({activity, time}, current_time);
  }
}

function nextBanner(index) {
  const current_time = new Date().getTime();
  const {activity, time, paused, next} = current_list[index];
  current_list.splice(index, 1);
  if (!paused) {
    stopAction({activity, time}, current_time);
  }
  if (next.length > 0) {
    return startAction({activity: next[0], next: next.slice(1)});
  }
}

function sortData() {
  return Object.keys(past_list).sort(
    (a, b) => past_list[b].length - past_list[a].length);
}

function importData() {
  const data = window.localStorage.getItem(LOCAL_STORAGE_NAME);
  if (data) {
    try {
      ({past_list, current_list} = JSON.parse(data));
    } catch (ignore) {}
  }
}

function exportData() {
  const data = JSON.stringify({past_list, current_list});
  if (data.length > 34) {
    window.localStorage.setItem(LOCAL_STORAGE_NAME,
      JSON.stringify({past_list, current_list}));
  }
}

function resetData() {
  window.localStorage.setItem(LOCAL_STORAGE_NAME, "");
}


// start tracking the given action

function startAction(action) {
  action.time = new Date().getTime();
  action.paused = false;
  current_list.push(action);
  exportData();
  render();
}


// stop tracking the given action

function stopAction(action, end_time) {
  if (past_list[action.activity]) {
    past_list[action.activity].push({start_time: action.time, end_time});
  } else {
    past_list[action.activity] = [{start_time: action.time, end_time}];
  }
  exportData();
  render();
}


// update the HTML display

function render() {

  // render the activity list
  const activity_list = sortData();
  const main_element = document.getElementById("main");
  const main_html = [];
  for (const activity of activity_list) {
    main_html.push(`<div class="cell">${activity} ${past_list[activity].length}</div>\n`);
  }
  main_element.innerHTML = main_html.join("");

  // render the banner
  const banner_element = document.getElementById("banner");
  const banner_html = [];
  for (const action of current_list) {
    const banner_buttons = [];
    let time_string = new Date(action.time).toString().split(" ")[4];
    if (action.paused) {
      time_string = "paused";
      banner_buttons.push("<div class='banner-button'>\u25B6</div>");
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
         <div class="banner-controls">${banner_buttons.join("")}</div>
       </div>`
    );
  }
  banner_element.innerHTML = banner_html.join("");

  // add event listeners
  for (let i = 0; i < activity_list.length; i++) {
    main_element.children[i].addEventListener("click",
      () => clickCell(activity_list[i]));
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


// add all event listeners when ready

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("track").addEventListener("submit", function (e) {
    e.preventDefault();
    submitInput();
  });
  importData();
  render();
});
