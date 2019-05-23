#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const assert = require('assert');

if (process.argv.length < 4) {
  console.log('Run `merge-track.js [old_file] [new_file] > [output_file]` ' +
      'to merge the old file and the new file into the output file.');
  process.exit(1);
}

const oldJson = JSON.parse(fs.readFileSync(path.resolve(process.argv[2])));
const newText = fs.readFileSync(path.resolve(process.argv[3]));
const newJson = JSON.parse(decodeURIComponent(newText).substring(33));

for (const key in oldJson.activity_dict) {
  if (oldJson.activity_dict.hasOwnProperty(key)) {
    assert(newJson.activity_dict[key].activity === key);
    assert(newJson.activity_dict[key].count >= oldJson.activity_dict[key].count);
  }
}
for (const key in oldJson.chain_dict) {
  if (oldJson.chain_dict.hasOwnProperty(key)) {
    assert(newJson.chain_dict[key].count >= oldJson.chain_dict[key].count);
  }
}

for (const key in newJson.time_dict) {
  if (newJson.time_dict.hasOwnProperty(key)) {
    if (!oldJson.time_dict.hasOwnProperty(key)) {
      oldJson.time_dict[key] = [];
    }
    oldJson.time_dict[key].push(...newJson.time_dict[key]);
  }
}

console.log(JSON.stringify({
  action_list: newJson.action_list,
  activity_dict: newJson.activity_dict,
  activity_history: [],
  chain_dict: newJson.chain_dict,
  download_file_name: "track_data.json",
  form: {activity: "", instant: false},
  time_dict: oldJson.time_dict,
}));
