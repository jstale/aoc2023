const fs = require('node:fs/promises');

const data2 = `Time:      7  15   30
Distance:  9  40  200`

const numerRegex = /\d+/g

processData = (data) => {
	var lines = data.split("\n");
	var times = [...lines[0].matchAll(numerRegex)].map(val => Number(val));
	var maxLenghts = [...lines[1].matchAll(numerRegex)].map(val => Number(val));;
	var total = 1;

	for (let index = 0; index < times.length; index++) {
		const time = times[index];
		const max = maxLenghts[index];
		var count = 0;

		for (let timeHolding = 0; timeHolding <= time; timeHolding++) {
			var dist = timeHolding * (time - timeHolding);
			if (dist > max) {
				count++
			}
		}

		total *= count;
	}

	console.dir(total);
}


async function loadData() {
	try {
		const data = await fs.readFile('data.txt', { encoding: 'utf8' });
		processData(data2);
	} catch (err) {
		console.log(err);
	}
}

loadData();

