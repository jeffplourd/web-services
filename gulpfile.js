let gulp = require('gulp');
let rimraf = require('rimraf');
let tslint = require('gulp-tslint');
let sourcemaps = require('gulp-sourcemaps');
let typescript = require('gulp-typescript');
let runSequence = require('run-sequence');
let nodemon = require('gulp-nodemon');
let lab = require('gulp-lab');

const TS_SRC_GLOB = './src/**/*.ts';
const JS_SRC_GLOB = './build/**/*.js';
const TS_GLOB = [TS_SRC_GLOB];
const STATIC_FILES = ['./src/**/*.json'];

const env = {
  NODE_ENV: 'development',
  NODE_CONFIG_DIR: './build/main/config'
};

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
  return gulp.src('./build/test/**/*.js')
    .pipe(lab())
});