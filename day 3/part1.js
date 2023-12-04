const fs = require('node:fs/promises');
const max = {
	red: 12,
	green: 13,
	blue: 14
}

const data2 = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`

const numerRegex = /\d+/g
const signRegex = /\$|!|@|#|\$|%|\^|&|\*|\+|-|\/|=/g
var signs = {};
processData = (data) => {
	var lines = data.split("\n");
	var lineNum = 0;
	lines.forEach(line => {
		var signmathes = line.matchAll(signRegex);
		signs[lineNum] = [];
		[...signmathes].forEach(sign => {
			signs[lineNum].push({ sign: sign[0], x: sign.index, y: lineNum });
		});


		lineNum++;
	});

	var lineNum = 0;
	var testRes = lines.map((line) => {
		var numberMatches = line.matchAll(numerRegex);
		var sum = [...numberMatches].map(number => {
			var start = number.index;
			var end = start + number[0].length;
			var val = Number(number[0]);
			signsPrev = signs[lineNum - 1];
			singsCur = signs[lineNum];
			singsNext = signs[lineNum + 1];
			var t = testLine(signsPrev, start, end) || testLine(singsCur, start, end) || testLine(singsNext, start, end);

			console.log(val + " s " + start + " l " + lineNum + " =" + t);
			return t ? val : 0;
		}).reduce((accumulator, currentValue) => accumulator + currentValue, 0);;

		lineNum++;
		return sum;
	}).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

	console.log(testRes);
}

var testLine = (line, start, end) => {
	if (line) {
		var test = line.map(sign => {
			return testNum(sign.x, start, end);
		}).reduce((accumulator, currentValue) => accumulator || currentValue, false);

		return test;
	}

	return false;
}

var testNum = (index, start, end) => {
	if (index >= start - 1 && index <= end) return true;

	return false;
}

async function loadData() {
	try {
		const data = await fs.readFile('data.txt', { encoding: 'utf8' });
		processData(data);
	} catch (err) {
		console.log(err);
	}
}

loadData();

