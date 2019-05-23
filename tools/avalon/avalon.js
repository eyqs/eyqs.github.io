/* Tiny Avalon v0.2
 * Copyright (c) 2017 Eugene Y. Q. Shen.
 *
 * Tiny Avalon is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version
 * 3 of the License, or (at your option) any later version.
 *
 * Tiny Avalon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 */


// global constants

// role_names[role] is the full name of the given role
const role_names = {
  merlin: "Merlin",
  percival: "Percival",
  servant: "a loyal servant of Arthur",
  assassin: "the Assassin",
  morgana: "Morgana",
  oberon: "Oberon",
  mordred: "Mordred",
  minion: "a minion of Mordred",
};

// character_lists[n] are the default characters in a game with n players
const character_lists = {
  5:  ["merlin", "servant", "servant", "assassin", "mordred"],
  6:  ["merlin", "percival", "servant", "servant", "morgana", "mordred"],
  7:  ["merlin", "percival", "servant", "servant",
          "assassin", "morgana", "oberon"],
  8:  ["merlin", "percival", "servant", "servant", "servant",
          "assassin", "morgana", "minion"],
  9:  ["merlin", "percival", "servant", "servant", "servant", "servant",
          "assassin", "morgana", "mordred"],
  10: ["merlin", "percival", "servant", "servant", "servant", "servant",
          "assassin", "morgana", "mordred", "oberon"],
};

// quest_votes[n][i] is the number of volunteers
// needed for the ith quest in a group of n players
const quest_votes = {
  5:  [2, 3, 2, 3, 3, 0],
  6:  [2, 3, 4, 3, 4, 0],
  7:  [2, 3, 3, 4, 4, 0],
  8:  [3, 4, 4, 5, 5, 0],
  9:  [3, 4, 4, 5, 5, 0],
  10: [3, 4, 4, 5, 5, 0],
};


// global variables

// players is the number of players
let players;
// player_names[i] is the name of the ith player
let player_names;
// role_list[i] is the role of the ith player
let role_list;
// player_list[role] is the index of the player with the given role
let player_list;

// wait_text is true iff the waiting text is currently displayed
let wait_text = false;
// on_quest is true iff the players are currently on a quest
let on_quest = false;
// player is the current player to read their role in nextRole
//   and the current mission leader in prepareVote
let player;
// quest is the current quest
let quest;
// success_quest is the current number of quests that succeeded
let success_quests;
// all_votes is the current number of votes for the current quest
let all_votes;
// success_votes is the number of success votes for the current quest
let success_votes;
// first_succeed is true if clicking the first button casts a succeed vote
let first_succeed;
// last_succeed is true if the last vote was a succeed vote
let last_succeed;


// use the Fisher-Yates algorithm to shuffle a list

function shuffle(const_list) {
  const list = JSON.parse(JSON.stringify(const_list));
  for (let i = players - 1; i >= 0; i--) {
    const j = Math.floor(i * Math.random());
    const t = list[i];
    list[i] = list[j];
    list[j] = t;
  }
  return list;
}


// count votes for a quest

function clickFirst() {
  if (success_quests >= 3) {
    success_quests = -3;
    nextMission();
  }
  all_votes++;
  last_succeed = first_succeed;
  if (first_succeed) {
    success_votes++;
    document.getElementById("confirmation").textContent =
        "Are you sure you want to succeed?";
  } else {
    document.getElementById("confirmation").textContent =
        "Are you sure you want to fail?";
  }
  document.getElementById("first").style.display = "none";
  document.getElementById("second").style.display = "none";
  document.getElementById("confirm").style.display = "inline-block";
  document.getElementById("deny").style.display = "inline-block";
}

function clickSecond() {
  if (success_quests >= 3) {
    success_quests++;
    nextMission();
  }
  all_votes++;
  last_succeed = !first_succeed;
  if (!first_succeed) {
    success_votes++;
    document.getElementById("confirmation").textContent =
        "Are you sure you want to succeed?";
  } else {
    document.getElementById("confirmation").textContent =
        "Are you sure you want to fail?";
  }
  document.getElementById("first").style.display = "none";
  document.getElementById("second").style.display = "none";
  document.getElementById("confirm").style.display = "inline-block";
  document.getElementById("deny").style.display = "inline-block";
}

function confirmVote() {
  document.getElementById("first").style.display = "inline-block";
  document.getElementById("second").style.display = "inline-block";
  document.getElementById("confirm").style.display = "none";
  document.getElementById("deny").style.display = "none";
  prepareVote();
}

function denyVote() {
  all_votes--;
  if (last_succeed) {
    success_votes--;
  }
  document.getElementById("confirmation").textContent = "";
  document.getElementById("first").style.display = "inline-block";
  document.getElementById("second").style.display = "inline-block";
  document.getElementById("confirm").style.display = "none";
  document.getElementById("deny").style.display = "none";
}


// prepare the screen for voting

function prepareVote() {
  if (all_votes >= quest_votes[players][quest]) {
    nextMission();
    return;
  }
  const message_list = [];
  message_list.push(`Welcome to quest ${quest + 1}!`);
  message_list.push(`This quest requires ${quest_votes
[players][quest]} volunteers.`);
  message_list.push(`The mission leader is ${player_names[player]}.`);
  if (players >= 7 && quest === 3) {
    message_list.push("This quest requires two fail votes to fail.");
  }
  message_list.push(`Volunteer ${all_votes + 1}, please cast your vote.`);
  document.getElementById("messages").innerHTML = `
      <p>${message_list.join("</p>\n      </p>")}</p>`;
  document.getElementById("confirmation").textContent = "";
  if (Math.random() > 0.5) {
    first_succeed = true;
    document.getElementById("first").textContent = "Succeed";
    document.getElementById("second").textContent = "Fail";
  } else {
    first_succeed = false;
    document.getElementById("first").textContent = "Fail";
    document.getElementById("second").textContent = "Succeed";
  }
}


// start a new quest

function nextMission() {
  if (success_quests === 3) {
    const message_list = [];
    message_list.push("Three quests have succeeded.");
    message_list.push("But can the Assassin identify Merlin?");
    document.getElementById("first").style.display = "inline-block";
    document.getElementById("second").style.display = "inline-block";
    document.getElementById("first").textContent = "Yes, Merlin dies.";
    document.getElementById("second").textContent = "No, Merlin lives.";
    document.getElementById("next").style.display = "none";
    document.getElementById("messages").innerHTML = `
        <p>${message_list.join("</p>\n      </p>")}</p>`;
    return;
  } else if (success_quests >= 3) {
    endGame(true);
  } else if (quest - success_quests >= 3) {
    endGame(false);
  } else if (!on_quest) {
    on_quest = true;
    all_votes = 0;
    success_votes = 0;
    player = (player + 1) % players;
    document.getElementById("first").style.display = "inline-block";
    document.getElementById("second").style.display = "inline-block";
    document.getElementById("next").style.display = "none";
    prepareVote();
  } else if (all_votes >= quest_votes[players][quest]) {
    on_quest = false;
    const message_list = [];
    message_list.push(`Welcome to quest ${quest +1}!`);
    message_list.push(
      `${success_votes} out of ${all_votes} volunteers voted to succeed.`);
    if (success_votes === all_votes
      || (players >= 7 && quest === 3 && success_votes === all_votes - 1)) {
      success_quests++;
      message_list.push("So the quest succeeded!");
    } else {
      message_list.push("So the quest failed!");
    }
    document.getElementById("messages").innerHTML = `
        <p>${message_list.join("</p>\n      </p>")}</p>`;
    document.getElementById("confirmation").textContent = "";
    document.getElementById("first").style.display = "none";
    document.getElementById("second").style.display = "none";
    document.getElementById("confirm").style.display = "none";
    document.getElementById("deny").style.display = "none";
    document.getElementById("next").style.display = "inline-block";
    quest++;
  }
}


// end the game; good wins if good_wins is true

function endGame(good_wins) {
  const message_list = [];
  if (good_wins) {
    message_list.push("The forces of good prevail!");
  } else {
    message_list.push("The forces of evil triumph!");
  }
  for (player in role_list) {
    if (role_list.hasOwnProperty(player)) {
      message_list.push(
        `${player_names[player]} was ${role_names[role_list[player]]}.`);
    }
  }
  message_list.push(
    "Press Next to restart the game with the same players in new roles.");
  message_list.push("Press New Game to change players.");
  document.getElementById("messages").innerHTML = `
      <p>${message_list.join("</p>\n      </p>")}</p>`;
  document.getElementById("first").style.display = "none";
  document.getElementById("second").style.display = "none";
  document.getElementById("next").style.display = "inline-block";
  document.getElementById("next").removeEventListener("click", nextMission);
  document.getElementById("next").addEventListener("click", startGame);
  document.getElementById("start").style.display = "block";
}


// print out the role of the given player

function nextRole() {
  if (wait_text) {
    wait_text = false;
    const message_list = [];
    const known_list = [];
    const role = role_list[player];
    message_list.push(
      `${player_names[player]}, you are ${role_names[role]}.`);
    switch (role) {
    case "merlin":
      known_list.push(...player_list["minion"]);
      known_list.push(...player_list["assassin"]);
      known_list.push(...player_list["morgana"]);
      known_list.push(...player_list["oberon"]);
      message_list.push(...shuffle(known_list)
        .filter(index => index !== undefined && index !== player)
        .map(index => `${player_names[index]} is an agent of evil.`));
      break;
    case "percival":
      known_list.push(...player_list["merlin"]);
      known_list.push(...player_list["morgana"]);
      message_list.push(...shuffle(known_list)
        .filter(index => index !== undefined && index !== player)
        .map(index => `${player_names[index]} is either Merlin or Morgana.`));
      break;
    case "minion": case "assassin": case "morgana": case "mordred":
      known_list.push(...player_list["minion"]);
      known_list.push(...player_list["assassin"]);
      known_list.push(...player_list["morgana"]);
      known_list.push(...player_list["mordred"]);
      message_list.push(...shuffle(known_list)
        .filter(index => index !== undefined && index !== player)
        .map(index => `${player_names[index]} is a fellow agent of evil.`));
      break;
    default:
      break;
    }
    player++;
    if (player >= role_list.length) {
      document.getElementById("next").removeEventListener("click", nextRole);
      document.getElementById("next").addEventListener("click", nextMission);
      message_list.push("Please press Next to start quest 1.");
      player = Math.floor(players * Math.random());
    } else {
      message_list.push(`Please press Next
before passing the screen to ${player_names[player]}.`);
    }
    document.getElementById("messages").innerHTML = `
        <p>${message_list.join("</p>\n      </p>")}</p>`;
  } else {
    wait_text = true;
    document.getElementById("messages").innerHTML = `
        <p>Please pass the screen to ${player_names[player]}.</p>`;
  }
}


// start a new game with the same players

function startGame() {
  player = 0;
  quest = 0;
  success_quests = 0;
  role_list = shuffle(character_lists[players]);
  player_list = {};
  for (const key in role_names) {
    if (role_names.hasOwnProperty(key)) {
      player_list[key] = [];
    }
  }
  for (let i = 0; i < role_list.length; i++) {
    player_list[role_list[i]].push(i);
  }
  document.getElementById("start").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("first").style.display = "none";
  document.getElementById("second").style.display = "none";
  document.getElementById("confirm").style.display = "none";
  document.getElementById("deny").style.display = "none";
  document.getElementById("next").removeEventListener("click", startGame);
  document.getElementById("next").addEventListener("click", nextRole);
  nextRole();
}


// start a new game with new players

function newGame() {
  players = document.getElementById("number").value;
  if (players >= 5 && players <= 10) {
    player_names = document.getElementById("players").value
      .split(",").map(name => name.trim()).filter(name => name);
    for (let i = player_names.length; i < players; i++) {
      player_names.push(`Player ${i + 1}`);
    }
    startGame();
  } else {
    document.getElementById("error").textContent =
      "Must be between 5 and 10 inclusive.";
  }
}


// add all event listeners when ready

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("new").addEventListener("click", newGame);
  document.getElementById("next").addEventListener("click", startGame);
  document.getElementById("first").addEventListener("click", clickFirst);
  document.getElementById("second").addEventListener("click", clickSecond);
  document.getElementById("confirm").addEventListener("click", confirmVote);
  document.getElementById("deny").addEventListener("click", denyVote);
});
