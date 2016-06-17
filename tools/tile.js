/* Tile Planner v0.1
 * Copyright © 2016 Eugene Y. Q. Shen.
 *
 * Tile Planner is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version
 * 3 of the License, or (at your option) any later version.
 *
 * Tile Planner is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 */

var c;
var ctx;
var BORDER = 3;
var PADDING = 20;
var SBWIDTH = 200;
var SNAPDIST = 50;
var selected = false;
var tiles;
var floor;

/* Structure for tiles */
function Tile(x, y, width, height, colour) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colour = colour;
}

/* Structure for points of a tile on the floor
 * Can place new tile at a point when num = 0
 * Num decreases by one whenever a new corner is placed at the point
 * If there are no existing point, a new tile creates points with
 * num 0 at the corners adjacent to the top-left corner and num 2 opposite
 */
function Point(x, y, num) {
    this.x = x;
    this.y = y;
    this.num = num;
}

/* Return the cursor position relative to the canvas */
function getCursorPosition(e) {
    var x, y;
    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    x -= c.offsetLeft;
    y -= c.offsetTop;
    return { x:x, y:y };
}

/* Decide what to do when user clicks */
function onClick(e) {
    var pos = getCursorPosition(e);
    if (selected) {
        if (fxstart < pos.x && fxend > pos.x &&
            fystart < pos.y && fyend > pos.y)
            clickOnFloor({ x:pos.x - fxstart, y:pos.y - fystart});
        else {
            clickOnSpace();
            selected = false;
        }
    } else
        for (var i = 0; i < tiles.length; i++)
            if (tiles[i].x < pos.x && tiles[i].x + tiles[i].width > pos.x &&
                tiles[i].y < pos.y && tiles[i].y + tiles[i].height > pos.y) {
                selected = tiles[i];
                clickOnTile();
            }
}

/* Place the selected tile on the closest available point on the floor */
function clickOnFloor(pos) {
    var i, j;
    var minsq = 4 * fwidth * fheight;
    for (i = 0; i < floor.length; i++)
        if (!floor[i].num &&
            ((pos.x - floor[i].x) * (pos.x - floor[i].x) +
             (pos.y - floor[i].y) * (pos.y - floor[i].y) < minsq)) {
            minsq = (pos.x - floor[i].x) * (pos.x - floor[i].x) +
                    (pos.y - floor[i].y) * (pos.y - floor[i].y);
            j = i;
        }
    if (minsq < SNAPDIST * SNAPDIST) {
        floor[j].num--;
        if (floor[j].x + selected.width > fwidth &&
            floor[j].y + selected.height > fheight)
            addTile(new Tile(floor[j].x, floor[j].y,
                             fwidth - floor[j].x, fheight - floor[j].y));
        else if (floor[j].x + selected.width > fwidth)
            addTile(new Tile(floor[j].x, floor[j].y,
                             fwidth - floor[j].x, selected.height));
        else if (floor[j].y + selected.height > fheight)
            addTile(new Tile(floor[j].x, floor[j].y,
                             selected.width, fheight - floor[j].y));
        else
            addTile(new Tile(floor[j].x, floor[j].y,
                             selected.width, selected.height));
    }
}

/* Deselect the selected tile */
function clickOnSpace() {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(selected.x - BORDER, selected.y - BORDER,
                 selected.width + BORDER * 2, selected.height + BORDER * 2);
    drawTile(selected);
}

/* Select and highlight the selected tile */
function clickOnTile() {
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(selected.x - BORDER, selected.y - BORDER,
                 selected.width + BORDER * 2, selected.height + BORDER * 2);
    drawTile(selected);
}

/* Add a tile to the floor */
function addTile(t) {
    var i, j = -1, k = -1;
    drawTile(new Tile(t.x + fxstart, t.y + fystart, t.width, t.height));
    for (i = 0; i < floor.length; i++) {
        if (floor[i].x === t.x && floor[i].y === t.y + t.height)
            j = i;
        if (floor[i].x === t.x + t.width && floor[i].y === t.y)
            k = i;
    }
    if (j === -1) {
        if (t.y + t.height < fheight)
            floor.push(new Point(t.x, t.y + t.height, 0));
    }
    else
        floor[j].num--;
    if (k === -1) {
        if (t.x + t.width < fwidth)
            floor.push(new Point(t.x + t.width, t.y, 0));
    }
    else
        floor[k].num--;
    if (t.x + t.width < fwidth && t.y + t.height < fheight)
        floor.push(new Point(t.x + t.width, t.y + t.height, 2));
}

/* Draw the given tile on the canvas */
function drawTile(t) {
    ctx.fillStyle = t.colour;
    ctx.fillRect(t.x, t.y, t.width, t.height);
    ctx.strokeRect(t.x, t.y, t.width, t.height);
}

/* Draw the entire application on the canvas */
function drawApp() {
    ctx.clearRect(0, 0, swidth, sheight);
    ctx.fillStyle = "#000000";
    ctx.strokeRect(0, 0, swidth, sheight);
    ctx.moveTo(bwidth, 0);
    ctx.lineTo(bwidth, bwidth);
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Tile Planner v1.0", sidebar, PADDING);
    ctx.font = "16px sans-serif";
    ctx.fillText("Full tiles:", sidebar, 40);
    ctx.fillText("Part tiles:", sidebar, 180);
    ctx.font = "8px sans-serif";
    ctx.fillText("Copyright © 2016 Eugene Y. Q. Shen.", sidebar, 390);
    ctx.fillStyle = "#CCCCCC";
    ctx.fillRect(fxstart, fystart, fwidth, fheight);
    ctx.stroke();
    for (var i = 0; i < tiles.length; i++)
        drawTile(tiles[i]);
}

/* Initialize the application */
function initApp(formElement, messageElement, canvasElement) {
    c = canvasElement;
    ctx = c.getContext("2d");
    if (!ctx)
        messageElement.innerHTML = "Your browser does not support this app!";
    else {
        fwidth = Number(formElement.elements["floorwidth"].value);
        fheight = Number(formElement.elements["floorheight"].value);
        bwidth = fwidth + PADDING * 2;
        swidth = bwidth + SBWIDTH;
        sheight = fheight + PADDING * 2;
        fxstart = PADDING;
        fystart = PADDING;
        fxend = fwidth + PADDING;
        fyend = fheight + PADDING;
        sidebar = bwidth + SBWIDTH / 2
        tiles = [new Tile(sidebar, 60,
                          Number(formElement.elements["tilewidth"].value),
                          Number(formElement.elements["tileheight"].value),
                          "#800000")];
        floor = [new Point(0, 0, 0)];
        c.width = swidth;
        c.height = sheight;
        c.addEventListener("click", onClick, false);
        drawApp();
    }
}
