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
	this.length = 0;
	this.maxLength = 10;
	this.shrinking = false;

	this.row.classList.add('lighter-green');
}

Wordfall.prototype.advance = function() {
	var row = this.row;
	var length = this.length;
	/*if (length === 0) {
		row.classList.add('lighter-green');
	}
	else {*/
	if (length !== 0) {
		for (var i = 0; i < length; ++i) {
			if (i === 0) { // head of wordfall
				if (row.nextSibling === null) { 			// If row is at bottom of screen and is removed.
					this.row.classList.remove('lighter-green');
					--this.length;
					this.shrinking = true;
				}
				else {										// Else we have not reached the bottom.
					this.row = row.nextSibling; 			// Set the div below the current as the head
					this.row.classList.add('lighter-green');
				}
				row.classList.remove('lighter-green');
				row.classList.add('light-green');
				//console.log(row);
			}
			else if (i === 1) { // neck of wordfall (neighbor of head)
				row.classList.remove('light-green');
				row.classList.add('green');
			}
			else if (i === length-1) { // last tail of wordfall
				row.classList.remove('green');
				//wordfalls.splice(wordfalls.indexOf(this), 1);
				//console.log("End of wordfall.", row);
			}
			if (row.previousSibling !== null) {
				row = row.previousSibling
				//console.log('Row decremented.', i, length, row);
			}
		}
	}
	if (length < this.maxLength && !this.shrinking) {
		++this.length;
		//console.log("Length incremented.");
	}
	//console.log(this.row, this.length);
}

function run() {
	if (Math.random() > 0) {
		var col = Math.floor(Math.random()*numCols);
		//console.log(col);
		var wordfall = new Wordfall(col);
		wordfalls.push(wordfall);
	}

	wordfalls.forEach(function(wordfall, index) {
		//console.log("Advancing wordfalls["+index+"].");
		wordfall.advance();
	});
}

setInterval(run, 100);
//run();