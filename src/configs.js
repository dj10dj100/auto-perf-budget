const exit = require('exit');
const args = require('commander');
const path = require('path');
const root = process.env.PWD;

args
  .version('0.1.0')
  // .usage('[options] <file ...>')
  .option('-c --config [config]', 'Add config for url testing')
  .parse(process.argv);


if (!args.config) {
  console.log('Config not found, check docs for missing --config option');
  exit(1);
};

console.log(`${root}/${args.config}`);

module.exports = require(path.resolve(`${root}/${args.config}`));
