let argv = require('yargs').argv;
let _ = require('lodash');

const env = _.assign({}, process.env, {
  NODE_ENV: argv.env || 'development',
  NODE_CONFIG_DIR: './build/main/config'
});

module.exports = env;