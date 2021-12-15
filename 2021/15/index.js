const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`).toString();

const shortestPath = (map, startPos = [0, 0]) => {
    const ADJ = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1]
    ];
    const queue = [{ pos: startPos, cost: 0 }];
    const visited = new Set();
    while (queue.length) {
        const {
            pos: [x, y],
            cost
        } = queue.shift();
        if (y === map.length - 1 && x === map[0].length - 1) return cost;

        ADJ.map(([dx, dy]) => [dx + x, dy + y])
            .filter(([x, y]) => map[y]?.[x])
            .filter((pos) => !visited.has(pos + ''))
            .forEach((pos) => {
                visited.add(pos + '');
                queue.push({ pos, cost: cost + map[pos[1]][pos[0]] });
            });
        queue.sort((a, b) => a.cost - b.cost);
    }
};

const parse = (input) => input.split('\n').map((row) => row.split('').map(Number));

const part1 = (input) => ((map) => shortestPath(map))(parse(input));

// expand the map 5x5 and increment  the current index by one in each direction
const part2 = (input) =>
    ((map) => {
        const expandedMap = [...Array(map.length * 5)].map((_, y) =>
            [...Array(map[0].length * 5)].map(
                (_, x) =>
                    1 +
                    ((map[y % map.length][x % map[0].length] -
                        1 +
                        Math.trunc(x / map[0].length) +
                        Math.trunc(y / map.length)) %
                        9)
            )
        );
        return shortestPath(expandedMap);
    })(parse(input));

module.exports = {
    p1: part1(input),
    p2: part2(input)
};
