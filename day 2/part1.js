const fs = require('node:fs/promises');
const gameMatch = /Game \d+/g
const valueMatch = /\d+ [a-z]+/g
const max = { red: 12, green: 13, blue: 14 }

processData = (data) => {
	var lines = data.split("\r\n");
	var testRes = lines.map((line) => {
		var gameNum = line.match(gameMatch)[0].split(" ")[1];
		var values = line.matchAll(valueMatch);
		var isInvalid = [...values].map(cube => {
			var cubeData = cube[0].split(" ");
			return Number(cubeData[0]) > max[cubeData[1]];
		}).reduce((accumulator, currentValue) => accumulator || currentValue, false);

		return isInvalid ? 0 : Number(gameNum);
	}).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

	console.log(testRes);
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