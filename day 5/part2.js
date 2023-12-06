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
//const lineSeparator = "\r\n";
const lineSeparator = "\n";

processData = (data) => {
    var sections = data.split(lineSeparator + lineSeparator);
    var maps = sections.slice(1).reduce((acc, line) => { acc.push(parseSection(line)); return acc; }, []);

    var min = null;
    var seeds = [...sections[0].matchAll(numerRegex)];

    for (let index = 0; index < seeds.length; index += 2) {
        var start = Number(seeds[index]);
        var length = Number(seeds[index + 1]);

        var inputPairs = [{ start, length }];
        maps.forEach(map => {
            inputPairs = getAllPairs(map, inputPairs);;
        });

        inputPairs.forEach(r => {
            var val = r.start;
            if (min === null || min > val) {
                min = val;
            }
        });
    }

    console.dir(min);
}

var getAllPairs = (section, inputPairsIn) => {
    var foundPairs = [];
    var inputPairs = [...inputPairsIn];

    for (let r of section) {
        var newInputPair = [];
        for (let index = 0; index < inputPairs.length; index++) {

            var { start, length } = inputPairs[index];

            var offSetStart = start - r[1];
            var offSetEnd = start + length - r[1];
            if (offSetStart >= 0 && offSetStart < r[2] && offSetEnd >= 0 && offSetEnd <= r[2]) {
                foundPairs.push({ start: r[0] + offSetStart, length });
            }
            else if (offSetStart >= 0 && offSetStart < r[2]) {
                newInputPair.push({ start: r[1] + r[2], length: length - (r[2] - offSetStart) });
                foundPairs.push({ start: r[0] + offSetStart, length: r[2] - offSetStart + 1 });
            }
            else if (offSetEnd >= 0 && offSetEnd < r[2]) {
                newInputPair.push({ start, length: r[1] - start });
                foundPairs.push({ start: r[0], length: offSetEnd });
            }
            else if (offSetStart < 0 && offSetEnd > r[2]) {
                newInputPair.push({ start, length: r[1] - start });
                newInputPair.push({ start: r[1] + r[2], length: length - r[2] - (r[1] - start) });
                foundPairs.push({ start: r[0], length: r[2] });
            }
            else {
                newInputPair.push(inputPairs[index]);
            }
        }

        inputPairs = newInputPair;
    };



    if (inputPairs.length > 0) {
        foundPairs = [...foundPairs, ...inputPairs];
    }

    return foundPairs;
}

var parseSection = (section) => {
    return section.split(lineSeparator).slice(1).map(line => {
        return [...line.matchAll(numerRegex)].map(val => Number(val));
    });

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

