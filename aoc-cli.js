const yargs = require('yargs');

const argv = yargs.options({
    year: { alias: 'y', type: 'number', description: 'The year of the AOC event', demandOption: true },
    day: { alias: 'd', type: 'number', description: 'The day of the current year', demandOption: true }
}).argv;

try {
    const { p1, p2 } = require(`./${argv.year}/${argv.day}/index`);
    console.log(`Result part 1: ${p1}`);
    console.log(`Result part 2: ${p2}`);
} catch (err) {
    console.log(`Could not found the exercise with the following path: year: ${argv.year} => day: ${argv.day}`);
}
