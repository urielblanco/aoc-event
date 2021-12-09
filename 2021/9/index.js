const fs = require('fs');
const os = require('os');

const input = fs
    .readFileSync(`${__dirname}/input.txt`)
    .toString()
    .split(os.EOL)
    .map((x) => x.trim().split('').map(Number));

const getAdyacents = (data, coordinates, limits) => {
    const [y, x] = coordinates;
    const [height, width] = limits;

    const adyacents = [];

    const left = x - 1;
    const right = x + 1;
    const top = y - 1;
    const down = y + 1;

    if (left !== -1) adyacents.push(data[y][left]);
    if (right <= width) adyacents.push(data[y][right]);
    if (top !== -1) adyacents.push(data[top][x]);
    if (down <= height) adyacents.push(data[down][x]);

    return adyacents;
};

const part1 = (data) => {
    const height = data.length - 1;
    const width = data[0].length - 1;
    const lowest = [];

    for (let i = 0; i <= height; i++) {
        for (let j = 0; j <= width; j++) {
            const adyacents = getAdyacents(input, [i, j], [height, width]);

            if (adyacents.every((num) => num > input[i][j])) lowest.push(input[i][j]);
        }
    }

    return lowest.reduce((acc, cur) => acc + cur, 0) + lowest.length;
};

const getBasins = (data, coordinates, limits, basins = new Set()) => {
    const [y, x] = coordinates;
    const [height, width] = limits;

    if (!basins.has(`${y}${x}`)) basins.add(`${y}${x}`);

    const left = x - 1;
    const right = x + 1;
    const top = y - 1;
    const down = y + 1;

    if (left !== -1 && data[y][left] !== 9 && !basins.has(`${y}${left}`)) {
        basis = new Set(getBasins(data, [y, left], limits, basins));
    }

    if (right <= width && data[y][right] !== 9 && !basins.has(`${y}${right}`)) {
        basis = new Set(getBasins(data, [y, right], limits, basins));
    }

    if (top !== -1 && data[top][x] !== 9 && !basins.has(`${top}${x}`)) {
        basis = new Set(getBasins(data, [top, x], limits, basins));
    }

    if (down <= height && data[down][x] !== 9 && !basins.has(`${down}${x}`)) {
        basis = new Set(getBasins(data, [down, x], limits, basins));
    }

    return [...basins];
};

const part2 = (data) => {
    const height = data.length - 1;
    const width = data[0].length - 1;
    const basins = [];

    for (let i = 0; i <= height; i++) {
        for (let j = 0; j <= width; j++) {
            const adyacents = getAdyacents(input, [i, j], [height, width]);

            if (adyacents.every((num) => num > input[i][j])) {
                basins.push(getBasins(data, [i, j], [height, width]).length);
            }
        }
    }

    basins.sort((a, b) => b - a);

    return basins[0] * basins[1] * basins[2];
};

module.exports = {
    p1: part1(input),
    p2: part2(input)
};
