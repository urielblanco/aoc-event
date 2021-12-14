const fs = require('fs');
const os = require('os');

const inputString = fs.readFileSync(`${__dirname}/input.txt`).toString();

const inputVertices = inputString
    .split('\n\n')[0]
    .split(os.EOL)
    .map((a) => a.split(','))
    .map((a) => a.map((b) => parseInt(b)));

const inputFolds = inputString
    .split('\n\n')[1]
    .split(os.EOL)
    .map((a) => a.split(' along '))
    .map((a) => a[1])
    .map((a) => a.split('='))
    .map((a) => [a[0], parseInt(a[1])]);

const xFold = (point, foldLine) => {
    let newX = foldLine - (point[0] - foldLine);
    return point[0] > foldLine ? [newX, point[1]] : point;
};

const yFold = (point, foldLine) => {
    let newY = foldLine - (point[1] - foldLine);
    return point[1] > foldLine ? [point[0], newY] : point;
};

const paperFolder = (vertices, foldLine) => {
    return vertices.map((a) => (foldLine[0] == 'x' ? xFold(a, foldLine[1]) : yFold(a, foldLine[1])));
};

const removeDuplicate = (array) => {
    let newArray = [];
    for (let item of array) {
        if (!newArray.some((a) => a[0] == item[0] && a[1] == item[1])) {
            newArray.push(item);
        }
    }
    return newArray;
};

const part1 = (vertices, inputFolds) => {
    const verticesResulted = paperFolder(vertices, inputFolds);

    return removeDuplicate(verticesResulted).length;
};

const part2 = (vertices, inputFolds) => {
    let verticesResulted = vertices.slice();

    for (const fold of inputFolds) {
        verticesResulted = paperFolder(verticesResulted, fold);
    }

    const verticesToDraw = removeDuplicate(verticesResulted);

    const yMax = Math.max(...verticesToDraw.map((x) => x[1]));
    const xMax = Math.max(...verticesToDraw.map((x) => x[0]));

    let wordHidden = '';

    for (let i = 0; i <= yMax; i++) {
        for (let j = 0; j <= xMax; j++) {
            if (verticesToDraw.some((vertice) => vertice[0] === j && vertice[1] === i)) {
                wordHidden += ' 🌫 ';
            } else {
                wordHidden += ' . ';
            }
        }

        wordHidden += '\n';
    }

    return '\n' + wordHidden;
};

module.exports = {
    p1: part1(inputVertices, inputFolds[0]),
    p2: part2(inputVertices, inputFolds)
};
