let fs = require('fs-extra');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
fs.readdirSync('./gulp')
  .filter((file) => (/\.js$/i).test(file))
  .map((file) => {
    require(`./gulp/${file}`);
  });