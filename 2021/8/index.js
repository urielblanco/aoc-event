const fs = require('fs');
const os = require('os');

const input = fs.readFileSync(`${__dirname}/input.txt`).toString();

const part1 = (data) => {
    const parsed = data
        .split(os.EOL)
        .map((line) => line.split('|')[1].trim().split(' '))
        .flatMap((line) => line);

    return parsed.reduce((acc, cur) => {
        const wordLength = cur.length;
        return (acc += [2, 4, 3, 7].some((num) => num === wordLength) ? 1 : 0);
    }, 0);
};

const decode = (line) => {
    const [digits, output] = line;

    const characters = {
        1: digits.find((d) => d.length === 2),
        4: digits.find((d) => d.length == 4),
        7: digits.find((d) => d.length == 3),
        8: digits.find((d) => d.length == 7)
    };

    const _069 = digits.filter((d) => d.length == 6);
    const _235 = digits.filter((d) => d.length == 5);

    // 6 will be missing half of 1
    characters[6] = _069.find((d) => {
        const one = characters[1];
        return d.indexOf(one[0]) == -1 || d.indexOf(one[1]) == -1;
    });

    // 5 will almost match 6
    characters[5] = _235.find((d) => {
        return characters[6].split('').filter((x) => d.indexOf(x) == -1).length == 1;
    });

    // 9 is like 5 + 1
    characters[9] = _069.find((d) => {
        return d == [...new Set([...characters[5].split(''), ...characters[1].split('')])].sort().join('');
    });

    characters[0] = _069.find((d) => d !== characters[6] && d !== characters[9]);

    characters[2] = _235.find((d) => {
        const one = characters[1].split('');
        return d != characters[5] && (d.indexOf(one[0]) == -1 || d.indexOf(one[1]) == -1);
    });

    // 3 is not 2 or 5
    characters[3] = _235.find((d) => d != characters[2] && d != characters[5]);

    const arrDigits = Object.entries(characters).map((x) => x[1]);

    return output.reduce((acc, cur) => `${acc}${arrDigits.indexOf(cur)}`, '');
};

const part2 = (data) => {
    const parsed = data.split(os.EOL).map((x) =>
        x.split('|').map((y) =>
            y
                .trim()
                .split(' ')
                .map((x) => x.split('').sort().join(''))
        )
    );

    return parsed.reduce((acc, line) => acc + Number(decode(line)), 0);
};

module.exports = {
    p1: part1(input),
    p2: part2(input)
};
