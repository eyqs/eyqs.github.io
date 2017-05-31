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
  return startActivity(activity);
}

function submitInput() {
  const form = document.getElementById("track");
  const value = form.elements.activity.value;
  form.elements.activity.value = "";
  return startActivity(value);
}

function clickBanner(index) {
  const end_time = new Date().getTime();
  const {activity, time: start_time} = current_list[index];
  current_list.splice(index, 1);
  return stopActivity(activity, start_time, end_time);
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


// start tracking the given activity

function startActivity(activity) {
  const time = new Date().getTime();
  current_list.push({activity, time});
  exportData();
  render();
}


// stop tracking the given activity

function stopActivity(activity, start_time, end_time) {
  if (past_list[activity]) {
    past_list[activity].push({start_time, end_time});
  } else {
    past_list[activity] = [{start_time, end_time}];
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
    main_html.push(`<div class="cell">${activity}</div>\n`);
  }
  main_element.innerHTML = main_html.join("");

  // render the banner
  const banner_element = document.getElementById("banner");
  const banner_html = [];
  for (const current of current_list) {
    const time_string = new Date(current.time).toString().split(" ")[4];
    banner_html.push(
      `<div class="banner">
         <div class="banner-activity">${current.activity}</div>
         <div class="banner-time">${time_string}</div>
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
    banner_element.children[i].addEventListener("click",
      () => clickBanner(i));
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
