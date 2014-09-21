"use strict";

var height = document.documentElement.clientHeight, //window.innerHeight,
	width = document.documentElement.clientWidth, //window.innerWidth,
	foreground = document.getElementById("foreground"),
	colWidthFG = 16,
	rowWidthFG = colWidthFG,
	numColsFG = Math.floor(width/colWidthFG),
	numRowsFG = Math.floor(height/rowWidthFG)-1,
	background = document.getElementById("background"),
	colWidthBG = 12,
	rowWidthBG = colWidthBG,
	numColsBG = Math.floor(width/colWidthBG),
	numRowsBG = Math.floor(height/rowWidthBG)-1;


for (var i=0; i < numColsFG; ++i) {
	var col = document.createElement('div');
	foreground.appendChild(col);
	col.setAttribute("id", "colfg" + i);
	for (var j=0; j < numRowsFG; ++j) {
		var row = document.createElement('div');
		col.appendChild(row);
		row.innerHTML = 'F';
	}
}

for (var i = 0; i < numColsBG; ++i) {
	var col = document.createElement('div');
	background.appendChild(col);
	col.setAttribute("id", "colbg" + i);	
	for (var j=0; j < numRowsBG; ++j) {
		var row = document.createElement('div');
		col.appendChild(row);
		row.innerHTML = 'B';
	}
}