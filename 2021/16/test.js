const fs = require('fs');
const input = fs.readFileSync(`${__dirname}/input.txt`).toString().split('');

let binaryDict = {
    0: '0000',
    1: '0001',
    2: '0010',
    3: '0011',
    4: '0100',
    5: '0101',
    6: '0110',
    7: '0111',
    8: '1000',
    9: '1001',
    A: '1010',
    B: '1011',
    C: '1100',
    D: '1101',
    E: '1110',
    F: '1111'
};
let binary = '';
input.forEach((char) => {
    binary += binaryDict[char];
});

let versionTotal = 0;
let total = binary.length;
let partTwo;

function day16(binary) {
    console.log(binary);
    let version = parseInt(binary.substring(0, 3), 2);
    let typeId = parseInt(binary.substring(3, 6), 2);
    let isLiteral = typeId == 4;
    versionTotal += version;

    if (isLiteral) {
        let lastIndex = 6;
        let value = [];
        let isSearching = true;
        let rest;
        while (isSearching) {
            let val = binary.substring(lastIndex, lastIndex + 5);
 
            value.push(val.substring(1));
            lastIndex = lastIndex + 5;
            if (val[0] == '0') {
                isSearching = false;
                rest = binary.substring(lastIndex);
            }
        }
        value = parseInt(value.join(''), 2);
        return [lastIndex, rest, value];
    } else {
        let action =
            typeId == 0
                ? 'sum'
                : typeId == 1
                ? 'product'
                : typeId == 2
                ? 'min'
                : typeId == 3
                ? 'max'
                : typeId == 5
                ? 'greater'
                : typeId == 6
                ? 'lesser'
                : 'equal';
        let lastIndex = 6;
        let lengthTypeId = binary[lastIndex];
        let k;
        let res = 0;
        let inc = 0;
        if (lengthTypeId == '0') {
            let totalLength = parseInt(binary.substring(lastIndex + 1, lastIndex + 16), 2);
            let rest = binary.substring(lastIndex + 16);
            let count = total - rest.length;
            while (total - rest.length - count !== totalLength) {
                k = day16(rest);
                rest = k[1];
                res = calculate(res, k[2], inc, action);
                inc++;
            }
            partTwo = res;
            k[2] = res;
            return k;
        } else if (lengthTypeId == '1') {
            let numberOfPackets = parseInt(binary.substring(lastIndex + 1, lastIndex + 12), 2);
            let rest = binary.substring(lastIndex + 12);
            while (inc < numberOfPackets) {
                k = day16(rest);
                res = calculate(res, k[2], inc, action);
                inc++;
                rest = k[1];
            }
            partTwo = res;
            k[2] = res;
            return k;
        }
    }
}

function calculate(res, val, inc, action) {
    if (action == 'sum') {
        res += val;
    } else if (action == 'product') {
        res = inc == 0 ? val : res * val;
    } else if (action == 'min') {
        res = inc == 0 ? val : Math.min(val, res);
    } else if (action == 'max') {
        res = inc == 0 ? val : Math.max(val, res);
    } else if (action == 'greater') {
        res = inc == 0 ? val : res > val ? 1 : 0;
    } else if (action == 'lesser') {
        res = inc == 0 ? val : res < val ? 1 : 0;
    } else if (action == 'equal') {
        res = inc == 0 ? val : res == val ? 1 : 0;
    }

    return res;
}

day16(binary);
console.log('Part one = ' + versionTotal);
console.log('Part two = ' + partTwo);
