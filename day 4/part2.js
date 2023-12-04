const fs = require('node:fs/promises');

const data2 = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

const numerRegex = /\d+/g
var cardPoints = [];

processData = (data) => {
	var lines = data.split("\n");
	lines.forEach(line => {
		var input = line.split(":");
		var cardNum = Number(input[0].match(numerRegex)[0]);

		var numbersInput = input[1].split("|");
		var winningNumbers = {};
		[...numbersInput[0].matchAll(numerRegex)].forEach(num => winningNumbers[num] = 1);


		var cardNumbers = [...numbersInput[1].matchAll(numerRegex)];

		var pow = cardNumbers.map(cardNumber => {
			return winningNumbers[cardNumber] || 0;
		}).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

		cardPoints[cardNum - 1] = { num: cardNum, matches: pow, instances: 0 };
	});

	var sum = cardPoints.map(card => {
		processCard(card.num);
		return card.instances;
	}).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

	console.log(sum);
}

var processCard = (startIndex) => {
	cardPoints[startIndex - 1].instances += 1;
	for (let index = startIndex + 1; index <= startIndex + cardPoints[startIndex - 1].matches; index++) {
		processCard(index);
	}
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

