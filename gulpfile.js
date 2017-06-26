let gulp = require('gulp');
let rimraf = require('rimraf');
let tslint = require('gulp-tslint');
let sourcemaps = require('gulp-sourcemaps');
let typescript = require('gulp-typescript');
let runSequence = require('run-sequence');

const TS_SRC_GLOB = './src/**/*.ts';
const JS_SRC_GLOB = './build/**/*.js';
const TS_GLOB = [TS_SRC_GLOB];
const STATIC_FILES = ['./src/**/*.json'];

const tsProject = typescript.createProject('tsconfig.json');

gulp.task('cleanBuild', (cb) => {
  rimraf('./build', cb);
});

gulp.task('tslint', () => {
  return gulp.src(TS_GLOB)
    .pipe(tslint({formatter: 'verbose'}))
    .pipe(tslint.report({
      // set this to true, if you want the build process to fail on tslint errors.
      emitError: false
    }));
});

// Compiles all *.ts-files to *.js-files.
gulp.task('copyStatic', () => {
  return gulp.src(STATIC_FILES)
    .pipe(gulp.dest('build'));
});

gulp.task('compileTypescript', () => {
  return gulp.src(TS_GLOB)
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.', { sourceRoot: '../src' }))
    .pipe(gulp.dest('build'));
});

gulp.task('build', (cb) => {
  runSequence('cleanBuild', 'tslint', 'compileTypescript', 'copyStatic', cb);
});
