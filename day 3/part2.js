const fs = require('node:fs/promises');

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
const signRegex = /\*/g
var signs = [];
processData = (data) => {
	var lines = data.split("\n");
	var lineNum = 0;
	lines.forEach(line => {
		var signmathes = line.matchAll(signRegex);
		signs[lineNum] = [];
		[...signmathes].forEach(sign => {

			signs[lineNum].push({ sign: sign[0], x: sign.index, y: lineNum, gears: [] });
		});


		lineNum++;
	});


	console.log("--------------------");
	var lineNum = 0;
	lines.forEach((line) => {
		var numberMatches = line.matchAll(numerRegex);
		[...numberMatches].forEach(number => {
			var start = number.index;
			var end = start + number[0].length;
			var val = Number(number[0]);
			signsPrev = signs[lineNum - 1];
			singsCur = signs[lineNum];
			singsNext = signs[lineNum + 1];

			processLine(signsPrev, start, end, val);
			processLine(singsCur, start, end, val);
			processLine(singsNext, start, end, val);

		});

		lineNum++;
		return 0;
	});

	var ts = signs.flat().filter((sign) => {
		return sign.gears.length > 1
	}).map(sign => sign.gears.reduce((accumulator, currentValue) => accumulator * currentValue, 1))
		.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

	console.log(ts);
}



var processLine = (line, start, end, value) => {

	if (line) {
		var test = line.forEach(sign => {
			//console.log("s " + start + " e " + end + " " + sign.sign + sign.x);
			if (testNum(sign.x, start, end)) {
				sign.gears.push(value);
			}
		})
	}
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

