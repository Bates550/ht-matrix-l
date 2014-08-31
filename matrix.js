"use strict";

var height = document.documentElement.clientHeight, //window.innerHeight,
	width = document.documentElement.clientWidth, //window.innerWidth,
	colWidth = 16,
	rowWidth = colWidth,
	numCols = Math.floor(width/colWidth),
	numRows = Math.floor(height/rowWidth)-10,
	wordfalls = new Array(),
	busyCols = new Array(),
	busyTimes = new Array();


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
	this.head = this.col.firstChild;
	this.tail = this.head;
	this.length = 1;
	this.maxLength = 10;
	this.shrinking = false;

	this.head.classList.add('lighter-green');
	//console.log("Wordfall of length "+this.length+" created.");
}

Wordfall.prototype.advance = function() {
	if (this.length < this.maxLength) {
		if (this.length === 1) {
			//console.log("Adding one light green segment.");
			this.addLightGreen();
		}
		else if (this.length === 2) {
			//console.log("Adding one green segment.");
			this.addGreen();
		}
		else {
			//console.log("Growing longer.");
			this.growLonger();
		}
	}
	else if (this.head.nextSibling !== null) {
		//console.log("Moving forward.");
		this.moveForward();
	}
	else if (this.head.classList.contains('lighter-green')) {
		//console.log("Removing one lighter green segment.");
		this.removeLighterGreen();
	}
	else if (this.head.classList.contains('light-green')) {
		//console.log("Removing one light green segment.");
		this.removeLightGreen();
	}
	else if (this.head.classList.contains('green')) {
		//console.log("Removing one green segment.");
		this.removeGreen();
	}
}

Wordfall.prototype.addLightGreen = function() {
	this.head.classList.remove('lighter-green');
	this.head.classList.add('light-green');
	this.head = this.head.nextSibling;
	this.head.classList.add('lighter-green');
	++this.length;
}

Wordfall.prototype.addGreen = function() {
	this.head.classList.remove('lighter-green');
	this.head.classList.add('light-green');
	this.tail = this.head.previousSibling;
	this.tail.classList.remove('light-green');
	this.tail.classList.add('green');
	this.head = this.head.nextSibling;
	this.head.classList.add('lighter-green');
	++this.length;
}

Wordfall.prototype.growLonger = function() {
	this.head.classList.remove('lighter-green');
	this.head.classList.add('light-green');
	for (var row = this.head.previousSibling; row !== null; row = row.previousSibling) {
		if (!row.classList.contains('green')) {
			row.classList.add('green');
		}
		if (row.previousSibling === null) {
			this.tail = row;
		}
	}
	this.head.previousSibling.classList.remove('light-green');
	this.head.previousSibling.classList.add('green');
	this.head = this.head.nextSibling;
	this.head.classList.add('lighter-green');
	if (this.length < this.maxLength) {
		++this.length;
	}
}

Wordfall.prototype.moveForward = function() {
	this.head.classList.remove('lighter-green');
	this.head.classList.add('light-green');
	var neck = this.head.previousSibling;
	if (neck.classList.contains('light-green')) {
		neck.classList.remove('light-green');
		neck.classList.add('green');
	}
	this.head = this.head.nextSibling;
	this.head.classList.add('lighter-green');
	this.tail.classList.remove('green');
	this.tail = this.tail.nextSibling;
}

Wordfall.prototype.removeLighterGreen = function () {
	this.head.classList.remove('lighter-green');
	this.head.classList.add('light-green');
	this.head.previousSibling.classList.remove('light-green');
	this.head.previousSibling.classList.add('green');
	this.tail.classList.remove('green');
	this.tail = this.tail.nextSibling;
}

Wordfall.prototype.removeLightGreen = function () {
	this.head.classList.remove('light-green');
	this.head.classList.add('green');
	this.tail.classList.remove('green');
	this.tail = this.tail.nextSibling;
}

Wordfall.prototype.removeGreen = function() {
	if (this.tail === null) {
		clearInterval(intervalId);
		console.log(this);
	}
	this.tail.classList.remove('green');
	this.tail = this.tail.nextSibling;
	if (this.tail === null) {
		wordfalls.remove(this);
	}
}

Array.prototype.remove = function(object) {
	this.splice(this.indexOf(object), 1);
}

function run() {
	var col = Math.floor(Math.random()*numCols), 
		wordfall;

	if (Math.random() > 0) {
		while (busyCols.indexOf(col) !== -1) {
			col = Math.floor(Math.random()*numCols)
		}
		wordfall = new Wordfall(col);
		wordfalls.push(wordfall);
		busyCols.push(col);
		busyTimes.push(wordfall.maxLength+1);
	}
	

	wordfalls.forEach(function(wordfall, index) {
		wordfall.advance();
	});

	busyTimes.forEach(function(time, index) {
		if (--busyTimes[index] === 0) {
			busyCols.splice(index, 1);
			busyTimes.splice(index, 1);
		}
	});
	console.log(busyTimes, busyCols);
}

/*var wordfall = new Wordfall(3);
wordfalls.push(wordfall);
busyCols.push(3);
busyTimes.push(wordfall.maxLength+1);
*/
var intervalId = setInterval(run, 100);
