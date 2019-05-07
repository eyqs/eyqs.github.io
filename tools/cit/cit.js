/* cit v0.2
 * Copyright (c) 2017 Eugene Y. Q. Shen.
 *
 * cit is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version
 * 3 of the License, or (at your option) any later version.
 *
 * cit is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 */


// a two-dimensional position on the canvas

class Point {
  constructor(x, y) {
    Object.assign(this, {x, y});
  }
}


// a pair of lists of points, one on each image
// each list of points is connected by line segments
// the first list of points morphs into the second list

class Line {
  constructor(name, colour, width) {
    Object.assign(this, {name, colour, width});
    this.first_list = [];
    this.second_list = [];
  }
}


// global variables

let c;                              // canvas element
let bg;                             // background canvas context
let ctx;                            // canvas context
let WIDTH;                          // canvas width
let HEIGHT;                         // canvas height
let line_list = [];                 // list of all lines
let show_first = true;              // true = show first image, false = second
let current_line_index;             // index of the current line in line_list
let first_zoom_level;               // current zoom level of the first image
let second_zoom_level;              //   scale = ZOOM_FACTOR ** zoom_level
let first_zoom_corner;              // relative position of top left
let second_zoom_corner;             //   corner of transformed canvas
let last_mouse_position;            // last position of the mouse on mousedown
const DRAG_DELTA = 10;              // minimum pixels to move before dragging
const ZOOM_FACTOR = 1.5;            // scaling factor per zoom level
const FIRST_IMAGE = new Image();    // first background image
const SECOND_IMAGE = new Image();   // second background image
const LOCAL_STORAGE_NAME = "cit_import_lines";


// get the current scale and top left corner
function getTransform() {
  if (show_first) {
    return {
      scale: ZOOM_FACTOR ** first_zoom_level,
      corner: first_zoom_corner,
    };
  } else {
    return {
      scale: ZOOM_FACTOR ** second_zoom_level,
      corner: second_zoom_corner,
    };
  }
}

// get the cursor position inside the canvas element, in pixels

function getAbsolutePosition(e) {
  const rect = c.getBoundingClientRect();
  return new Point(
    (e.clientX - rect.left) * WIDTH / rect.width,
    (e.clientY - rect.top) * HEIGHT / rect.height,
  );
}


// get the cursor position relative to the background image, in scaled pixels

function getRelativePosition(e) {
  const {scale, corner} = getTransform();
  const absolute = getAbsolutePosition(e);
  return new Point(
    (corner.x + absolute.x) / scale,
    (corner.y + absolute.y) / scale,
  );
}


// draw the given list of points

function drawPointList(point_list, colour, width) {
  if (point_list.length > 0) {
    ctx.strokeStyle = colour;
    ctx.lineWidth = width / getTransform().scale;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(point_list[0].x, point_list[0].y);
    for (const point of point_list) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  }
}


// draw the entire canvas

function drawCanvas() {
  const {scale, corner} = getTransform();
  bg.setTransform(1, 0, 0, 1, 0, 0);
  bg.clearRect(0, 0, WIDTH, HEIGHT);
  bg.setTransform(scale, 0, 0, scale, -corner.x, -corner.y);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.setTransform(scale, 0, 0, scale, -corner.x, -corner.y);
  if (show_first) {
    bg.drawImage(FIRST_IMAGE, 0, 0, WIDTH, HEIGHT);
    for (const line of line_list) {
      drawPointList(line.first_list, line.colour, line.width);
    }
  } else {
    bg.drawImage(SECOND_IMAGE, 0, 0, WIDTH, HEIGHT);
    for (const line of line_list) {
      drawPointList(line.second_list, line.colour, line.width);
    }
  }
}


// update the line list HTML

function updateLineList() {
  inner_html = [];
  for (const line of line_list) {
    inner_html.push(
      `<li>
         <form class="line">
           <input name="colour" type="color" value="${line.colour}">
           <input name="name" type="text" value="${line.name}">
           Width:
           <input name="width" type="number" value="${line.width}">
           <input type="submit" value="Update">
         </form>
       </li>`
   );
  }
  document.getElementById("linelist").innerHTML = inner_html.join("");

  // add event listeners to update the line list via HTML
  const line_html_list = document.getElementById("linelist").children;
  for (let i = 0; i < line_html_list.length; i++) {
    const form = line_html_list[i].firstElementChild;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      Object.assign(line_list[i], {
        name: form.elements.name.value,
        colour: form.elements.colour.value,
        width: form.elements.width.value,
      });
      update();
    });
  }
}


// update the JSON data in the import tab and local storage

function updateJSON(json_data) {
  window.localStorage.setItem(LOCAL_STORAGE_NAME, json_data);
  document.getElementById("import").elements.import.value = json_data;
}


// update everything

function update() {
  drawCanvas();
  updateLineList();
  updateJSON(JSON.stringify({show_first, current_line_index, line_list}));
}


// change zoom level and calculate where to move the top left corner

function changeZoom(zoom_in, absolute, relative) {
  const {scale, corner} = getTransform();
  if (zoom_in) {
    const new_corner = new Point(
      (corner.x + absolute.x) * ZOOM_FACTOR - absolute.x,
      (corner.y + absolute.y) * ZOOM_FACTOR - absolute.y,
    );
    if (show_first) {
      first_zoom_level += 1;
      first_zoom_corner = new_corner;
    } else {
      second_zoom_level += 1;
      second_zoom_corner = new_corner;
    }
  } else {
    const new_corner = new Point(
      (corner.x + absolute.x) / ZOOM_FACTOR - absolute.x,
      (corner.y + absolute.y) / ZOOM_FACTOR - absolute.y,
    );
    if (show_first) {
      first_zoom_level -= 1;
      first_zoom_corner = new_corner;
    } else {
      second_zoom_level -= 1;
      second_zoom_corner = new_corner;
    }
  }
  update();
}


// pan the canvas when user drags

function onDrag(e) {
  const mouse = getAbsolutePosition(e);
  if (show_first) {
    first_zoom_corner = new Point(
      first_zoom_corner.x - (mouse.x - last_mouse_position.x),
      first_zoom_corner.y - (mouse.y - last_mouse_position.y),
    );
  } else {
    second_zoom_corner = new Point(
      second_zoom_corner.x - (mouse.x - last_mouse_position.x),
      second_zoom_corner.y - (mouse.y - last_mouse_position.y),
    );
  }
  update();
}


// decide what to do when user clicks

function onClick(e) {
  const absolute = getAbsolutePosition(e);
  const relative = getRelativePosition(e);

  // either change the zoom
  if (e.shiftKey) {
    changeZoom(true, absolute, relative);
  } else if (e.ctrlKey) {
    changeZoom(false, absolute, relative);
  } else {

    // or add a new point
    if (show_first) {
      show_first = false;
      line_list[current_line_index].first_list.push(relative);
    } else {
      show_first = true;
      line_list[current_line_index].second_list.push(relative);
    }
    update();
  }
}


// record position where user mouses down

function onMouseDown(e) {
  last_mouse_position = getAbsolutePosition(e);
  e.target.style.cursor = "move";
}


// decide whether the user clicked or dragged

function onMouseUp(e) {
  const mouse = getAbsolutePosition(e);
  if ((mouse.x - last_mouse_position.x) ** 2
    + (mouse.y - last_mouse_position.y) ** 2 > DRAG_DELTA ** 2) {
    onDrag(e);
  } else {
    onClick(e);
  }
  last_mouse_position = undefined;
  e.target.style.cursor = "default";
}


// track the current line when user moves mouse

function onMouseMove(e) {
  drawCanvas();

  // do not update if user is dragging
  if (last_mouse_position) {
    return;
  }
  const mouse = getRelativePosition(e);
  const current_line = line_list[current_line_index];
  let point_list;
  if (show_first) {
    point_list = current_line.first_list;
  } else {
    point_list = current_line.second_list;
  }

  // draw a line from the last point to the mouse
  drawPointList(point_list, current_line.colour, current_line.width);
  if (point_list.length > 0) {
    ctx.beginPath();
    ctx.moveTo(
      point_list[point_list.length - 1].x,
      point_list[point_list.length - 1].y,
    );
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
  }

  // draw a circle around the mouse
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 1.5 * current_line.width / getTransform().scale,
    0, 2 * Math.PI, true);
  ctx.fillStyle = current_line.colour;
  ctx.fill();
}


// show at most one control tab at a time

function toggleControls(control_element, item_element) {
  if (control_element.classList.contains("active")) {
    control_element.classList.remove("active");
    item_element.style.display = "none";
  } else {
    for (const control of document.getElementById("controllist").children) {
      control.classList.remove("active");
    }
    for (const item of document.getElementById("controllist").children) {
      document.getElementById(item.getAttribute("data-form"))
        .style.display = "none";
    }
    control_element.classList.add("active");
    item_element.style.display = "block";
  }
}


// remove the last point added

function undoPoint() {
  if (show_first) {
    show_first = false;
    line_list[current_line_index].second_list.pop();
  } else {
    show_first = true;
    line_list[current_line_index].first_list.pop();
  }
  update();
}


// reset all zoom levels and panning

function resetTransform(e, reset_all) {
  if (show_first || reset_all) {
    first_zoom_level = 0;
    first_zoom_corner = new Point(0, 0);
  } if (!show_first || reset_all) {
    second_zoom_level = 0;
    second_zoom_corner = new Point(0, 0);
  }
  update();
}


// start the application

function startApp() {
  document.getElementById("landing").style.display = "none";

  // save canvas and context into global variables
  c = document.getElementById("canvas");
  ctx = c.getContext("2d");
  if (!ctx) {
    document.getElementById("nocanvas").innerHTML =
      "Your browser does not support this app!";
  } else {
    const b = document.getElementById("background");
    bg = b.getContext("2d");

    // save background images into global variables
    const form = document.getElementById("start");
    const first_reader = new FileReader();
    const second_reader = new FileReader();
    first_reader.onload = function (e) {
      FIRST_IMAGE.src = e.target.result;
      FIRST_IMAGE.onload = function () {
        WIDTH = FIRST_IMAGE.width;
        HEIGHT = FIRST_IMAGE.height;
        c.width = WIDTH;
        c.height = HEIGHT;
        b.width = WIDTH;
        b.height = HEIGHT;
        bg.drawImage(FIRST_IMAGE, 0, 0);
      }
    };
    second_reader.onload = (e) => SECOND_IMAGE.src = e.target.result;
    first_reader.readAsDataURL(form.elements.first.files[0]);
    second_reader.readAsDataURL(form.elements.second.files[0]);

    // initialize miscellaneous things
    document.getElementById("main").style.display = "block";
    document.getElementById("canvases").style.display = "block";
    toggleControls(
      document.getElementById("controllist").children[0],
      document.getElementById("general")
    );

    // try to get data from local storage, and add canvas event listeners
    let data = window.localStorage.getItem(LOCAL_STORAGE_NAME);
    resetTransform(null, true);
    if (!data) {
      newLine();
    } else {
      updateJSON(data);
      importJSON();
    }
    c.addEventListener("mousedown", onMouseDown);
    c.addEventListener("mouseup", onMouseUp);
    c.addEventListener("mousemove", onMouseMove);
  }
}


// import data from JSON

function importJSON() {
  ({show_first, current_line_index, line_list} =
    JSON.parse(document.getElementById("import").elements.import.value));
  update();
}


// create a new line

function newLine() {
  const form = document.getElementById("new");
  const name = form.elements.name.value;
  const colour = form.elements.colour.value;
  const width = form.elements.width.value;

  // reset background to first and add new line to line list
  show_first = true;
  current_line_index = line_list.length;
  line_list.push(new Line(name, colour, width));
  update();
}


// animate the drawing and export it to GIF if capture is true

function animateApp(capture) {
  const form = document.getElementById("animate");
  const n = Number(form.elements.number.value);
  const animate_back = form.elements.back.checked;
  const pause_time = Number(form.elements.pause.value);
  const line_animate_list = JSON.parse(JSON.stringify(line_list));

  // interpolate to find the speed of each point in each line
  const line_difference_list = [];
  for (const line of line_animate_list) {
    const difference_list = [];
    for (let i = 0; i < line.second_list.length; i++) {
      difference_list.push(new Point(
        (line.second_list[i].x - line.first_list[i].x) / n,
        (line.second_list[i].y - line.first_list[i].y) / n,
      ));
    }
    line_difference_list.push(difference_list);
  }

  // initialize time, clear background image, and capture animation
  let t = 0;
  bg.setTransform(1, 0, 0, 1, 0, 0);
  bg.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  let capturer;
  if (capture) {
    capturer = new CCapture({format: "gif", workersPath: ""});
    capturer.start();
  }
  animate();

  // increment time, clear previous image, and animate
  function animate() {
    t += 1;
    if (t <= n || (animate_back && t <= 2 * n + pause_time)) {
      requestAnimationFrame(animate);
      if (capture) {
        capturer.capture(c);
      }
    } else if (capture) {
      capturer.stop();
      capturer.save();
    }

    // must explicitly fill to avoid transparent background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // handle logic for animating back and pausing before that
    if (t <= n) {
      for (let i = 0; i < line_difference_list.length; i++) {
        const actual_list = line_animate_list[i].first_list;
        for (let j = 0; j < line_difference_list[i].length; j++) {
          actual_list[j].x += line_difference_list[i][j].x;
          actual_list[j].y += line_difference_list[i][j].y;
        }
      }
    } else if (t > n + pause_time) {
      for (let i = 0; i < line_difference_list.length; i++) {
        const actual_list = line_animate_list[i].first_list;
        for (let j = 0; j < line_difference_list[i].length; j++) {
          actual_list[j].x -= line_difference_list[i][j].x;
          actual_list[j].y -= line_difference_list[i][j].y;
        }
      }
    }
    for (const line of line_animate_list) {
      drawPointList(line.first_list, line.colour, line.width);
    }
  }
}


// restart the application by deleting all local storage data

function restartApp() {
  if (confirm("Are you sure you want to restart and lose all local data?")) {
    line_list = [];
    newLine();
  }
}


// add all event listeners when ready

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("start").addEventListener("submit", function (e) {
    e.preventDefault();
    startApp();
  });
  document.getElementById("import").addEventListener("submit", function (e) {
    e.preventDefault();
    importJSON();
  });
  document.getElementById("new").addEventListener("submit", function (e) {
    e.preventDefault();
    newLine();
  });
  document.getElementById("animate").addEventListener("submit", function (e) {
    e.preventDefault();
    animateApp(false);
  });
  document.getElementById("undo").addEventListener("click", undoPoint);
  document.getElementById("reset").addEventListener("click", resetTransform);
  document.getElementById("export").addEventListener("click",
    () => animateApp(true));
  document.getElementById("restart").addEventListener("click", restartApp);
  for (const control of document.getElementById("controllist").children) {
    control.addEventListener("click", () => toggleControls(
      control, document.getElementById(control.getAttribute("data-form"))));
  }
});
