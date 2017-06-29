let gulp = require('gulp');
let runSequence = require('run-sequence');
let argv = require('yargs').argv;
let env = require('./env');
let { $exec, dbMigrate, addMigrationFile } = require('./utils');

/* local database commands */
gulp.task('dbLocalClean', ['dbLocalStop'], cb => {
  $exec('docker rm postgres')
    .then(() => $exec('docker rmi -f postgres'))
    .then(() => cb());
});

gulp.task('dbLocalStop', cb => {
  $exec('docker stop postgres').then(() => cb());
});

gulp.task('dbLocalStart', ['dbLocalCreateContainer'], cb => {
  $exec('docker start postgres').then(() => cb());
});

gulp.task('dbLocalCreateContainer', cb => {
  $exec('docker pull postgres')
    .then(() =>
      $exec(
        'docker create --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres'
      )
    )
    .then(() => cb())
    .catch(() => cb());
});

gulp.task('dbCreateFile', cb => {
  if (!argv.filename) {
    console.log('Must specify filename using "--filename=<name of file>"');
    return;
  }
  addMigrationFile(argv.filename);
});

gulp.task('dbUpdate', cb => {
  if (env.NODE_ENV === 'development') {
    runSequence('build', 'dbLocalStart', () => dbMigrate(() => cb()));
  } else {
    runSequence('build', () => dbMigrate(() => cb()));
  }
});

gulp.task('makePretty', cb => {
  $exec(
    'prettier --list-different --no-semi --single-quote --write --print-width 80 "src/**/*.ts"'
  ).then(() => cb());
});
