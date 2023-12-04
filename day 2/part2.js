const fs = require('node:fs/promises');
const valueMatch = /\d+ [a-z]+/g

processData = (data) => {
    var lines = data.split("\r\n");
    var testRes = lines.map((line) => {
        var values = line.matchAll(valueMatch);
        let maxTurn = { red: 0, green: 0, blue: 0 };
        [...values].forEach(cube => {
            var cubeData = cube[0].split(" ");
            var number = Number(cubeData[0]);
            if (number > maxTurn[cubeData[1]]) {
                maxTurn[cubeData[1]] = number;
            }
        })

        return maxTurn.red * maxTurn.green * maxTurn.blue;
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