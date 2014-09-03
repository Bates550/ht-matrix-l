"use strict";

var height = document.documentElement.clientHeight, //window.innerHeight,
	width = document.documentElement.clientWidth, //window.innerWidth,
	foreground = document.getElementById("foreground"),
	colWidthFG = 16,
	rowWidthFG = colWidthFG,
	numColsFG = Math.floor(width/colWidthFG)-1,
	numRowsFG = Math.floor(height/rowWidthFG)-1, 
	numSpawnFG = 1, // Number of Wordfall's to spawn per call to run()
	spawnChanceFG = 0.66,
	background = document.getElementById("background"),
	colWidthBG = 12,
	rowWidthBG = colWidthBG,
	numColsBG = Math.floor(width/colWidthBG)-1,
	numRowsBG = Math.floor(height/rowWidthBG)-1,
	numSpawnBG = 1,
	spawnChanceBG = 0.66,
	wordfalls = new Array(),
	busyColsFG = new Array(),
	busyTimesFG = new Array(),
	busyColsBG = new Array(),
	busyTimesBG = new Array();

// Populate foreground
for (var i=0; i < numColsFG; ++i) {
	var col = document.createElement('div');
	foreground.appendChild(col);
	col.setAttribute("id", "colfg" + i);
	for (var j=0; j < numRowsFG; ++j) {
		var row = document.createElement('div');
		col.appendChild(row);
	}
}

// Populate background
for (var i = 0; i < numColsBG; ++i) {
	var col = document.createElement('div');
	background.appendChild(col);
	col.setAttribute("id", "colbg" + i);	
	for (var j=0; j < numRowsBG; ++j) {
		var row = document.createElement('div');
		col.appendChild(row);
	}
}

/* Like a waterfall, but with words */
function Wordfall(col, word, maxLength, depth) {
	if (depth != 'fg' && depth != 'bg') {
		console.log("Invalid depth value:", depth);
	}
	this.col = document.getElementById("col"+depth+col);
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

function randomWord(depth) {
	var wordLength,
		result = "";
	depth = depth.toLowerCase();
	if (depth == 'fg') {
		wordLength = numRowsFG;
	}
	else if (depth == 'bg') {
		wordLength = numRowsBG;
	}
	else {
		console.log("Invalide depth value:", depth);
		clearInterval(intervalId);
	}
	for (var i = 0; i < wordLength; ++i) {
		result += String.fromCharCode(0x0019 + Math.random()*(0x0078-0x0021+1));
	}
	return result;
}

function randomColumn(depth) {
	var numCols,
		busyCols,
		col;
	if (depth == 'fg') {
		numCols = numColsFG;
		busyCols = busyColsFG;
	}
	else if (depth == 'bg') {
		numCols = numColsBG;
		busyCols = busyColsBG;
	}
	else {
		console.log("Invalide depth value:", depth);
	}

	col = Math.floor(Math.random()*numCols);
	while (busyCols.indexOf(col) !== -1) {
		col = Math.floor(Math.random()*numCols)
	}
	return col;
}

function run() {
	wordfalls.forEach(function(wordfall, index) {
		wordfall.advance();
	});

	busyTimesFG.forEach(function(time, index) {
		if (--busyTimesFG[index] === 0) {
			busyColsFG.removeIndex(index);
			busyTimesFG.removeIndex(index);
		}
	});
	busyTimesBG.forEach(function(time, index) {
		if (--busyTimesBG[index] === 0) {
			busyColsBG.removeIndex(index);
			busyTimesBG.removeIndex(index);
		}
	});
	var col,
		word,
		length,
		wordfall;

	if (Math.random() < spawnChanceFG) {
		for (var i=0; i < numSpawnFG; ++i) {
			col = randomColumn('fg');
			word = randomWord('fg');
			length = Math.floor(Math.random() * (13 - 5 + 1) + 5);
			wordfall = new Wordfall(col, word, length, 'fg');
			wordfalls.push(wordfall);
			busyColsFG.push(col);
			busyTimesFG.push(wordfall.maxLength+1);
		}
	}

	if (Math.random() < spawnChanceBG) {
		for (var i=0; i < numSpawnBG; ++i) {
			col = randomColumn('bg');
			word = randomWord('bg');
			length = Math.floor(Math.random() * (13 - 5 + 1) + 5);
			wordfall = new Wordfall(col, word, length, 'bg');
			wordfalls.push(wordfall);
			busyColsBG.push(col);
			busyTimesBG.push(wordfall.maxLength+1);
		}
	}
}


var intervalId = setInterval(run, 75);
//run();