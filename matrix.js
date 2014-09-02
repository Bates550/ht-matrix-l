"use strict";

var height = document.documentElement.clientHeight, //window.innerHeight,
	width = document.documentElement.clientWidth, //window.innerWidth,
	container = document.getElementById("container"),
	colWidth = 16,
	rowWidth = colWidth,
	numCols = Math.floor(width/colWidth)-1,
	numRows = Math.floor(height/rowWidth)-1, 
	numSpawn = 1, // Number of Wordfall's to spawn per call to run()
	wordfalls = new Array(),
	busyCols = new Array(),
	busyTimes = new Array();


for (var i=0; i < numCols; ++i) {
	var col = document.createElement('div');
	container.appendChild(col);
	col.setAttribute("id", "col" + i);
	for (var j=0; j < numRows; ++j) {
		var row = document.createElement('div');
		col.appendChild(row);
	}
}

/* Like a waterfall, but with words */
function Wordfall(col, word, maxLength) {
	this.col = document.getElementById("col"+col);
	this.head = this.col.firstChild;
	this.tail = this.head;
	this.length = 1;
	this.maxLength = maxLength;
	this.word = word;

	var i = 0; 
	for (var row = this.head; row.nextSibling !== null; row = row.nextSibling) {
		row.innerHTML = this.word[i++];
	}

	this.head.classList.add('lighter-green');
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
	this.tail.classList.remove('green');
	this.tail = this.tail.nextSibling;
	if (this.tail === null) {
		wordfalls.removeObject(this);
	}
}

/* Removes object from Array and shifts array elements to fill missing spot. 
 * If array contains multiple instances of object, it will remove the first. 
 */
Array.prototype.removeObject = function(object) {
	this.splice(this.indexOf(object), 1);
}

/* Removes item at index and shifts array elements to fill missing spot. 
 */
Array.prototype.removeIndex = function(index) {
	this.splice(index, 1);
}

function randomWord() {
	var wordLength = numRows;
	var result = "";
	for (var i = 0; i < wordLength; ++i) {
		result += String.fromCharCode(0x0019 + Math.random()*(0x0078-0x0021+1));
	}
	return result;
}

function randomColumn() {
	var col = Math.floor(Math.random()*numCols);
	while (busyCols.indexOf(col) !== -1) {
		col = Math.floor(Math.random()*numCols)
	}
	return col;
}

function run() {
	wordfalls.forEach(function(wordfall, index) {
		wordfall.advance();
	});

	busyTimes.forEach(function(time, index) {
		if (--busyTimes[index] === 0) {
			busyCols.removeIndex(index);
			busyTimes.removeIndex(index);
		}
	});
	var col,
		word,
		length,
		wordfall;

	for (var i=0; i < numSpawn; i++) {
		col = randomColumn();
		word = randomWord();
		length = Math.floor(Math.random() * (13 - 5 + 1) + 5);
		wordfall = new Wordfall(col, word, length);
		wordfalls.push(wordfall);
		busyCols.push(col);
		busyTimes.push(wordfall.maxLength+1);
	}
	
	//console.log(busyTimes, busyCols);
}

/*var wordfall = new Wordfall(3);
wordfalls.push(wordfall);
busyCols.push(3);
busyTimes.push(wordfall.maxLength+1);
*/
var intervalId = setInterval(run, 100);
