/* Tiny Tracker v1.0
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


// data structures

// activity = string (ex. "shower")
// chain = comma-separated string (ex. "shower, brush teeth, floss, sleep")
// next = array of strings (ex. ["brush teeth", "floss", "sleep"])
// instant = boolean (ex. true)
// paused = boolean (ex. true)
// count = integer (ex. 8)
// time = epoch time (ex. 1514588810)

// action = {activity, next, time, paused}
// past_activity = {activity, instant, count}
// past_chain = {activity, next, count}

// time_dict[activity] = [{start_time: 0, end_time: 7}, {start_time: 20, ...}]
// activity_dict[activity] = past_activity
// chain_dict[chain] = past_chain
// action_list[0] = action
// activity_history[0] = activity


// global constants

const LOCAL_STORAGE_NAME = "eyqs_track_data";
const IGNORE_EVENT_TIME = 5000;


// utility functions

function dictToList(dict) {
  return Object.keys(dict).filter(a => dict[a].count !== 0)
      .sort((a, b) => dict[b].count - dict[a].count);
}

function resetData() {
  window.localStorage.setItem(LOCAL_STORAGE_NAME, "");
}


// main Vue app

const vm = new Vue({
  el: "#app",
  data: {

    // global variables

    time_dict: {},
    activity_dict: {},
    chain_dict: {},
    action_list: [],
    activity_history: [],
    download_file_name: LOCAL_STORAGE_NAME + ".json",


    // HTML elements

    form: {
      activity: "",
      instant: false,
    },
  },


  // sort dicts to display them by decreasing frequency

  computed: {
    activity_list() {
      return dictToList(this.activity_dict);
    },
    chain_list() {
      return dictToList(this.chain_dict);
    },
    export_data() {
      return JSON.stringify(this.$data);
    },
    export_link() {
      return "data: text/plain; charset=utf-8, "
          + encodeURIComponent(this.export_data);
    },
  },


  // import previous data before initialization

  created() {
    this.importData();
  },


  // banner component

  components: {

    "action-banner": {
      props: {
        action: Object,
        index: Number,
      },
      computed: {
        time_string() {
          return new Date(this.action.time).toString().split(" ")[4];
        },
      },

      template: `
        <div class="banner">
          <div class="banner-activity">
            {{ action.activity }}
          </div>
          <div class="banner-time" v-if="action.paused">
            paused
          </div>
          <div class="banner-time" v-else>
            {{ time_string }}
          </div>
          <div class="banner-controls">
            <div class="banner-button"
                 v-show="!(action.next && action.next.length > 0)"
                 @click="$emit('stop')">
              \u25FC
            </div>
            <div class="banner-button"
                 v-show="action.next && action.next.length > 0"
                 @click="$emit('skip')">
              \u27A0
            </div>
            <div class="banner-button"
                 v-show="action.paused"
                 @click="$emit('toggle')">
              \u25B6\uFE0E
            </div>
            <div class="banner-button"
                 v-show="!action.paused"
                 @click="$emit('toggle')">
              \u25AE\u25AE
            </div>
            <div class="banner-button"
                 v-show="action.next && action.next.length > 0"
                 @click="$emit('next')">
              \u2794
            </div>
          </div>
        </div>`,
    },
  },


  template: `
    <div id="app">
      <h1>Tiny Tracker</h1>
      <div id="banners">
        <action-banner v-for="(action, index) of action_list"
                       :action="action"
                       :index="index"
                       :key="action.activity"
                       @toggle="toggleBanner(index)"
                       @stop="stopBanner(index)"
                       @next="nextBanner(index)"
                       @skip="skipBanner(index)" />
      </div>
      <form id="track" @submit.prevent="submitInput">
        <input v-model="form.activity" type="text">
        <label>
          Instant
          <input v-model="form.instant" type="checkbox">
        </label>
        <input type="submit" value="Track">
      </form>
      <form id="controls" @submit.prevent="importFile">
        <input type="text" :value="export_data">
        <a class="button" @click="undoActivity">
          Undo activity
        </a>
        <a class="button" :href="export_link" :download="download_file_name">
          Export file
        </a>
        <input id="import" type="file" required="required" v-show="false">
        <input type="submit" value="Import file">
        <label class="button" for="import">
          Select file
        </label>
      </form>
      <div id="activities">
        <div class="cell"
             v-for="activity of activity_list"
             @click="clickActivity(activity)">
          {{ activity }}
        </div>
      </div>
      <div id="chains">
        <div class="cell"
             v-for="chain of chain_list"
             @click="clickChain(chain)">
          {{ chain }}
        </div>
      </div>
    </div>`,


  methods: {

    // import data from a JSON file

    importFile() {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          Object.assign(this.$data, JSON.parse(e.target.result));
          this.exportData();
        } catch (ignore) {}
      }.bind(this);
      reader.readAsText(document.getElementById("import").files[0]);
    },


    // import saved data from local storage

    importData() {
      const data = window.localStorage.getItem(LOCAL_STORAGE_NAME);
      if (data) {
        try {
          Object.assign(this.$data, JSON.parse(data));
        } catch (ignore) {}
      }
    },


    // export updated data to local storage
    // only called in startAction, stopAction, and importFile

    exportData() {
      window.localStorage.setItem(LOCAL_STORAGE_NAME,
          JSON.stringify(this.$data));
    },


    // parse a new text input and start the action

    submitInput() {
      const split = this.form.activity.split(",").map((item) => item.trim())
        .filter((item) => item.length !== 0);
      const chain = split.join(", ");
      const activity = split[0];
      const next = split.slice(1);
      const instant = this.form.instant;
      this.form.activity = "";
      this.form.instant = false;
      if (split.length > 0) {
        if (split.length > 1) {
          if (this.chain_dict[chain]) {
            this.chain_dict[chain].count += 1;
          } else {
            this.$set(this.chain_dict, chain, {activity, next, count: 1});
          }
          this.startAction({activity, next}, false);
        }
        this.startAction({activity}, instant);
      }
    },


    // pause or unpause the activity in the banner

    toggleBanner(index) {
      const action = this.action_list[index];
      const current_time = new Date().getTime();
      action.paused = !action.paused;
      // if action is now unpaused, start a new action
      if (!action.paused) {
        action.time = current_time;
      } else {
        this.stopAction(action, current_time, false);
      }
    },


    // stop the activity or chain in the banner

    stopBanner(index) {
      const action = this.action_list[index];
      const current_time = new Date().getTime();
      this.action_list.splice(index, 1);
      if (!action.paused) {
        this.stopAction(action, current_time, false);
      }
    },


    // start the next activity of the chain in the banner

    nextBanner(index) {
      const action = this.action_list[index];
      const current_time = new Date().getTime();
      this.action_list.splice(index, 1);
      if (!action.paused) {
        this.stopAction(action, current_time, true);
      }
      this.startAction({
        activity: action.next[0],
        next: action.next.slice(1),
      }, false);
    },


    // skip the current activity and start the next activity of the chain

    skipBanner(index) {
      const action = this.action_list[index];
      this.action_list.splice(index, 1);
      this.startAction({
        activity: action.next[0],
        next: action.next.slice(1),
      }, false);
    },


    // start tracking a past activity in the activity list

    clickActivity(activity) {
      const past_activity = this.activity_dict[activity];
      this.startAction(past_activity, past_activity.instant);
    },


    // start tracking a past chain in the chain list

    clickChain(chain) {
      const past_chain = this.chain_dict[chain];
      this.chain_dict[chain].count += 1;
      this.startAction(past_chain, false);
    },


    // start tracking the given action

    startAction(action, instant) {
      const current_time = new Date().getTime();
      if (instant) {
        this.saveActivity(action.activity, current_time, current_time, true);
      } else {
        for (duplicate of this.action_list) {
          if (action.activity === duplicate.activity) {
            return;
          }
        }
        action.time = new Date().getTime();
        action.paused = false;
        this.action_list.push(action);
      }
      this.exportData();
    },


    // stop tracking the given action

    stopAction(action, end_time, save_activity) {
      if (save_activity || end_time - action.time > IGNORE_EVENT_TIME) {
        this.saveActivity(action.activity, action.time, end_time, false);
      }
      this.exportData();
    },


    // undo the last saved activity from time_dict and activity_dict

    undoActivity() {
      if (this.activity_history.length > 0) {
        const activity = this.activity_history.pop();
        if (this.time_dict[activity].length > 0) {
          this.time_dict[activity].pop();
        }
        if (this.activity_dict[activity].count > 0) {
          this.activity_dict[activity].count -= 1;
        }
      }
    },


    // save the given activity in time_dict and activity_dict

    saveActivity(activity, start_time, end_time, instant) {
      this.activity_history.push(activity);
      if (this.time_dict[activity]) {
        this.time_dict[activity].push({start_time, end_time});
      } else {
        this.time_dict[activity] = [{start_time, end_time}];
      }
      if (this.activity_dict[activity]) {
        this.activity_dict[activity].count += 1;
      } else {
        this.$set(this.activity_dict, activity, {activity, instant, count: 1});
      }
    },
  },
});
