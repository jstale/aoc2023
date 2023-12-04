const fs = require('node:fs/promises');

var regex2 = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g;
var numbers = {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9
}

processData = (data) => {
    var lines = data.split("\r\n");
    var sum = lines.map((line) => {
        var matches = [...line.matchAll(regex2)];
        return Number("" + numbers[matches[0][1]] + numbers[matches[matches.length - 1][1]]);
    }).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    console.log(sum);
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