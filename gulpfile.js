let gulp = require('gulp');
let rimraf = require('rimraf');
let tslint = require('gulp-tslint');
let sourcemaps = require('gulp-sourcemaps');
let typescript = require('gulp-typescript');
let runSequence = require('run-sequence');
let nodemon = require('gulp-nodemon');
let lab = require('gulp-lab');
let argv = require('yargs').argv;

let {
  $exec,
  gcloud,
  createPattern,
  kubeServiceName,
  gcluster,
  gclusterExists,
  extractMapping,
  dbMigrate,
  addMigrationFile,
  env
} = require('./gulp-utils');

const TS_SRC_GLOB = './src/**/*.ts';
const JS_SRC_GLOB = './build/**/*.js';
const TS_GLOB = [TS_SRC_GLOB];
const STATIC_FILES = ['./src/**/*.json'];

const tsProject = typescript.createProject('tsconfig.json');

gulp.task('cleanBuild', cb => {
  rimraf('./build', cb);
});

gulp.task('tslint', () => {
  return gulp.src(TS_GLOB).pipe(tslint({ formatter: 'verbose' })).pipe(
    tslint.report({
      // set this to true, if you want the build process to fail on tslint errors.
      emitError: false
    })
  );
});

// Compiles all *.ts-files to *.js-files.
gulp.task('copyStatic', () => {
  return gulp.src(STATIC_FILES).pipe(gulp.dest('build'));
});

gulp.task('compileTypescript', () => {
  return gulp
    .src(TS_GLOB)
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.', { sourceRoot: '../src' }))
    .pipe(gulp.dest('build'));
});

gulp.task('build', cb => {
  runSequence('cleanBuild', 'tslint', 'compileTypescript', 'copyStatic', cb);
});

gulp.task('watch', ['build'], function() {
  return nodemon({
    ext: 'ts js json',
    script: 'build/main/index.js',
    watch: ['src/*'],
    tasks: ['build'],
    env
  });
});

gulp.task('test', ['build'], () => {
  return gulp.src('./build/test/**/*.js').pipe(lab());
});

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
