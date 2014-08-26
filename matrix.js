"use strict";

var height = document.documentElement.clientHeight, //window.innerHeight,
	width = document.documentElement.clientWidth, //window.innerWidth,
	colWidth = 16,
	rowWidth = colWidth,
	numCols = Math.floor(width/colWidth),
	numRows = Math.floor(height/rowWidth)-10,
	wordfalls = new Array();


for (var i=0; i < numCols; ++i) {
	var col = document.createElement('div');
	document.body.appendChild(col);
	col.setAttribute("id", "col" + i);
	for (var j=0; j < numRows; ++j) {
		var row = document.createElement('div');
		col.appendChild(row);
	}
}

/* Like a waterfall, but with words */
function Wordfall(col) {
	this.col = document.getElementById("col"+col);
	this.row = this.col.firstChild;
	this.length = 10;

	this.row.classList.add('lighter-green');
}

Wordfall.prototype.advance = function() {
	var row = this.row;
	var length = this.length;
	while (row !== null) {
		var cl = row.classList;
		if (cl.contains('green') && length === 1) {
			cl.remove('green');
		}
		else if (cl.contains('light-green')) {
			cl.remove('light-green');
			cl.add('green');
		}
		else if (cl.contains('lighter-green')) {
			cl.remove('lighter-green');
			cl.add('light-green');
			if (row.nextSibling !== null) {
				this.row = row.nextSibling;
				this.row.classList.add('lighter-green');
			}
			else {
				--this.length;
			}
		}
		row = row.previousSibling;
		--length;
	}

}

Array.prototype.advance = function() {
	for (var i = 0; i < this.length; ++i) {
		this[i].advance();
	}
}

function run() {
	if (Math.random() > 0) {
		var col = Math.floor(Math.random()*numCols);
		//console.log(col);
		var wordfall = new Wordfall(col);
		wordfalls.push(wordfall);
	}

	wordfalls.forEach(function(wordfall) {
		wordfall.advance();
	});
}

setInterval(run, 100);
