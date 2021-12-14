const fs = require('fs');
const os = require('os');

const inputParts = fs.readFileSync(`${__dirname}/input.txt`).toString().split('\n\n');

const startTemplate = inputParts[0].trim().split('');
const insertions = inputParts[1].split(os.EOL).map((x) => x.trim().split(' -> '));

const insertionsMap = new Map();

insertions.forEach((insertion) => insertionsMap.set(insertion[0], insertion[1]));

let pairsTemplate = startTemplate
    .map((v, idx, arr) => v + arr[idx + 1])
    .slice(0, -1)
    .reduce((acc, cur) => {
        acc[cur] = ++acc[cur] || 1;
        return acc;
    }, {});

let pairsMap = new Map();
const edges = [startTemplate[0], startTemplate[startTemplate.length - 1]];

Object.entries(pairsTemplate).forEach((pair) => pairsMap.set(pair[0], pair[1]));

const pairIncrement = (result, key, prev) => {
    const ammount = prev || 1;
    if (result.has(key)) result.set(key, result.get(key) + ammount);
    else result.set(key, ammount);
};

// for each pair in pairs
// given a pair 'AB' with count of N
// given a particular rule 'AB' -> C
// increase global counts of pair 'AC' by N and pair 'CB' by N
const polymerize = (pairs) => {
    let polResult = new Map();
    for (const pair of pairs.keys()) {
        const insert = insertionsMap.get(pair);

        pairIncrement(polResult, `${pair[0]}${insert}`, pairs.get(pair));
        pairIncrement(polResult, `${insert}${pair[1]}`, pairs.get(pair));
    }

    return polResult;
};

const part1 = (map, steps) => {
    let results = map;

    for (let i = 0; i < steps; i++) {
        results = polymerize(results);
    }

    const accObj = Array.from(results.entries()).reduce((acc, cur) => {
        acc[cur[0][0]] = acc[cur[0][0]] || 0;
        acc[cur[0][1]] = acc[cur[0][1]] || 0;

        acc[cur[0][0]] += cur[1];
        acc[cur[0][1]] += cur[1];

        return acc;
    }, {});

    let total = Object.entries(accObj).sort((a, b) => b[1] - a[1]);

    total = total.map((x) => (x[0] === edges[0] || x[0] === edges[1] ? [x[0], ++x[1]] : x));

    return (total[0][1] - total[total.length - 1][1]) / 2;
};

module.exports = {
    p1: part1(pairsMap, 10),
    p2: part1(pairsMap, 40)
};
