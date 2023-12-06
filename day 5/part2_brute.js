const fs = require('node:fs/promises');

const data2 = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`

const numerRegex = /\d+/g

processData = (data) => {
	var sections = data.split("\r\n\r\n");
	var maps = sections.slice(1).reduce((acc, line) => { acc.push(parseSection(line)); return acc; }, []);

	var min = null;
	var minIndex = null;
	var seeds = [...sections[0].matchAll(numerRegex)];

	for (let index = 0; index < seeds.length; index += 2) {
		var start = Number(seeds[index]);
		var length = Number(seeds[index + 1]);

		for (let i = start; i < start + length; i++) {


			var nextValue = i;
			for (var map of maps) {
				var range = map.find(r => {
					var offSet = nextValue - r[1];
					return offSet >= 0 && offSet <= r[2];
				});

				if (range)
					nextValue = range[0] + (nextValue - range[1])
			}

			if (min === null || nextValue < min) {
				min = nextValue;
				minIndex = i;
			}
		}
	}

	console.dir(minIndex);
}

var parseSection = (section) => {
	return section.split("\r\n").slice(1).map(line => {
		return [...line.matchAll(numerRegex)].map(val => Number(val));
	});
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

