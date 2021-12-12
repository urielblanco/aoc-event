const fs = require('fs');
const os = require('os');

const input = fs
    .readFileSync(`${__dirname}/input.txt`)
    .toString()
    .split(os.EOL)
    .map((x) => x.trim().split('').map(Number));

const incrementEnergies = (grid) => {
    const flashes = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] + 1 === 10) {
                grid[i][j] = 0;
                flashes.push([i, j]);
            } else {
                ++grid[i][j];
            }
        }
    }

    return flashes;
};

const spreadEnergy = (grid, coordinates, limits) => {
    let flashed = 0;
    const [y, x] = coordinates;
    const [height, width] = limits;

    const left = x - 1;
    const right = x + 1;
    const top = y - 1;
    const down = y + 1;

    if (left !== -1 && grid[y][left] !== 0) {
        if (++grid[y][left] === 10) {
            grid[y][left] = 0;
            ++flashed;
            flashed += spreadEnergy(grid, [y, left], limits);
        }
    }

    if (right <= width && grid[y][right] !== 0) {
        if (++grid[y][right] === 10) {
            grid[y][right] = 0;
            ++flashed;
            flashed += spreadEnergy(grid, [y, right], limits);
        }
    }

    if (top !== -1 && grid[top][x] !== 0) {
        if (++grid[top][x] === 10) {
            grid[top][x] = 0;
            ++flashed;
            flashed += spreadEnergy(grid, [top, x], limits);
        }
    }

    if (down <= height && grid[down][x] !== 0) {
        if (++grid[down][x] === 10) {
            grid[down][x] = 0;
            ++flashed;
            flashed += spreadEnergy(grid, [down, x], limits);
        }
    }

    if (top !== -1 && left !== -1 && grid[top][left] !== 0) {
        if (++grid[top][left] === 10) {
            grid[top][left] = 0;
            ++flashed;
            flashed += spreadEnergy(grid, [top, left], limits);
        }
    }

    if (top !== -1 && right <= width && grid[top][right] !== 0) {
        if (++grid[top][right] === 10) {
            grid[top][right] = 0;
            ++flashed;
            flashed += spreadEnergy(grid, [top, right], limits);
        }
    }

    if (down <= height && left !== -1 && grid[down][left] !== 0) {
        if (++grid[down][left] === 10) {
            grid[down][left] = 0;
            ++flashed;
            flashed += spreadEnergy(grid, [down, left], limits);
        }
    }

    if (down <= height && right <= width && grid[down][right] !== 0) {
        if (++grid[down][right] === 10) {
            grid[down][right] = 0;
            ++flashed;
            flashed += spreadEnergy(grid, [down, right], limits);
        }
    }

    return flashed;
};

const part1 = (data, generations) => {
    const grid = data.map((row) => row.slice());
    const height = grid.length - 1;
    const width = grid[0].length - 1;
    let flashed = 0;

    for (let i = 0; i < generations; i++) {
        const flashes = incrementEnergies(grid);

        for (const coordinates of flashes) {
            flashed++;
            flashed += spreadEnergy(grid, coordinates, [height, width]);
        }
    }

    return flashed;
};

const part2 = (data) => {
    const grid = data.map((row) => row.slice());
    const height = grid.length - 1;
    const width = grid[0].length - 1;

    let generation = 0;

    while (!grid.every((row) => row.every((oct) => oct === 0))) {
        const flashes = incrementEnergies(grid);

        for (const coordinates of flashes) {
            spreadEnergy(grid, coordinates, [height, width]);
        }
        generation++;
    }

    return generation;
};

module.exports = {
    p1: part1(input, 100),
    p2: part2(input)
};
