const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`).toString();

const getAllViableVelocitiesP1 = (xBounds, yBounds) => {
    let xVelocities = [];
    let yVelocities = [];

    for (let i = 0; i <= xBounds[1]; i++) {
        xVelocities.push(i);
    }

    // to get a meaningful height, a yV > 0 is mandatory
    for (let i = 0; i <= Math.abs(yBounds[0]); i++) {
        yVelocities.push(i);
    }

    return [xVelocities, yVelocities];
};

getAllViableVelocitiesP2 = (xBounds, yBounds) => {
    let xVelocities = [];
    let yVelocities = [];

    for (let i = 0; i <= xBounds[1]; i++) {
        xVelocities.push(i);
    }

    // we must expand the lower bound in relation to part 1 because now we don't care about the height
    for (let i = yBounds[0]; i <= Math.abs(yBounds[0]); i++) {
        yVelocities.push(i);
    }

    return [xVelocities, yVelocities];
};

const accelerateVertically = (initialVelocity, yBounds) => {
    let step = 0;
    let currentPosition = 0;
    let maxHeight = 0;

    while (currentPosition >= yBounds[1]) {
        currentPosition += initialVelocity - step;
        step++;

        if (maxHeight < currentPosition) {
            maxHeight = currentPosition;
        }
    }

    return [currentPosition, maxHeight, step];
};

const accelerateHorizontally = (initialVelocity, limitStep) => {
    let step = 0;
    let currentPosition = 0;

    while (step < limitStep) {
        currentPosition += initialVelocity;

        let decelerationFactor = 0;
        if (initialVelocity !== 0) {
            decelerationFactor = initialVelocity > 0 ? -1 : 1;
        }

        initialVelocity += decelerationFactor;
        step++;
    }

    return currentPosition;
};

const withinTrench = ([finalX, finalY], xBounds, yBounds) => {
    return finalX >= xBounds[0] && finalX <= xBounds[1] && finalY >= yBounds[0] && finalY <= yBounds[1];
};

const getFinalPosition = (xV, yV, xBounds, yBounds) => {
    let step = 0;
    let currX = 0;
    let currY = 0;
    let xDecelerationFactor = 0;

    do {
        currY += yV - step;
        currX += xV;

        xDecelerationFactor = 0;
        if (xV !== 0) {
            xDecelerationFactor = xV > 0 ? -1 : 1;
        }
        xV += xDecelerationFactor;
        step++;
    } while (!withinTrench([currX, currY], xBounds, yBounds) && currX <= xBounds[1] && currY > yBounds[0]);

    return [currX, currY];
};

const part1 = (input) => {
    let xBounds, yBounds;
    let globalMaxHeigth = 0;

    [xBounds, yBounds] = input.match(/-?[0-9]+\.\.-?[0-9]+/g).map((a) => a.split('..').map(Number));

    let [xVelocities, yVelocities] = getAllViableVelocitiesP1(xBounds, yBounds);

    for (let i in yVelocities) {
        let yV = yVelocities[i];
        let [yPos, maxHeight, limitStep] = accelerateVertically(yV, yBounds);

        for (let j in xVelocities) {
            if (globalMaxHeigth === maxHeight) {
                break;
            }

            let xV = xVelocities[j];
            let xPos = accelerateHorizontally(xV, limitStep);
            let isValid = withinTrench([xPos, yPos], xBounds, yBounds);

            if (isValid && globalMaxHeigth < maxHeight) {
                globalMaxHeigth = maxHeight;
            }
        }
    }
    return globalMaxHeigth;
};

const part2 = (input) => {
    let validCounter = 0;

    let [xBounds, yBounds] = input.match(/-?[0-9]+\.\.-?[0-9]+/g).map((a) => a.split('..').map(Number));

    let [xVelocities, yVelocities] = getAllViableVelocitiesP2(xBounds, yBounds);

    for (let i in xVelocities) {
        for (let j in yVelocities) {
            let [xV, yV] = [xVelocities[i], yVelocities[j]];
            let [xPos, yPos] = getFinalPosition(xV, yV, xBounds, yBounds);

            if (withinTrench([xPos, yPos], xBounds, yBounds)) {
                validCounter++;
            }
        }
    }

    return validCounter;
};

module.exports = {
    p1: part1(input),
    p2: part2(input)
};
