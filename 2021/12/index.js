const fs = require('fs');
const os = require('os');

const input = fs
    .readFileSync(`${__dirname}/input.txt`)
    .toString()
    .split(os.EOL)
    .map((row) => row.trim());

const buildUndirectedGraph = (data) => {
    const paths = [];

    for (const line of data) {
        const [from, to] = line.split('-');

        paths[from] = paths[from] || [];
        paths[to] = paths[to] || [];
        paths[from].push(to);
        paths[to].push(from);
    }

    return paths;
};

const isSmallCave = (cave) => /[a-z]/.test(cave);

const part1 = (data) => {
    const caves = buildUndirectedGraph(input);
    const dfs = (cave, visited = new Set()) => {
        if (cave === 'end') return 1;
        if (visited.has(cave) && isSmallCave(cave)) return 0;

        let result = 0;

        visited.add(cave);

        for (const nextCave of caves[cave]) {
            result += dfs(nextCave, visited);
        }

        visited.delete(cave);

        return result;
    };

    return dfs('start');
};

const part2 = (data) => {
    const caves = buildUndirectedGraph(input);

    const dfs = (cave, visited = {}, doubleSmallFlag = false) => {
        if (cave === 'end') return 1;

        if (visited[cave] && isSmallCave(cave)) {
            if (doubleSmallFlag) return 0;
            else doubleSmallFlag = true;
        }

        let result = 0;

        visited[cave] = visited[cave] + 1 || 1;

        for (const nextCave of caves[cave]) {
            if (nextCave !== 'start') {
                result += dfs(nextCave, visited, doubleSmallFlag);
            }
        }

        --visited[cave];

        return result;
    };

    return dfs('start');
};

module.exports = {
    p1: part1(input),
    p2: part2(input)
};
