const fs = require('node:fs/promises');

const data2 = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

const numerRegex = /\d+/g
const cards = [];
var lines = [];

processData = (data) => {
    lines = data.split("\n");
    var index = 0;
    var sum = lines.map(() => {
        processCard(index);
        return cards[index++].instances;
    }).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    console.log(sum);
}

var parseCard = (line) => {
    var [winningNumbers, cardNumbers] = line.split(":").split("|");
    var winningNumbersMap = {};

    [...winningNumbers.matchAll(numerRegex)].forEach(num => winningNumbersMap[num] = 1);

    var matches = [...cardNumbers.matchAll(numerRegex)]
        .map(cardNumber => {
            return winningNumbersMap[cardNumber] || 0;
        }).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    return { matches, instances: 0 };
}

var processCard = (index) => {
    if (!cards[index]) {
        cards[index] = parseCard(lines[index]);
    }

    cards[index].instances += 1;

    for (let i = index + 1; i <= index + cards[index].matches; i++) {
        processCard(i);
    }
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

