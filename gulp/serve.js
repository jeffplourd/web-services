let gulp = require('gulp');
let nodemon = require('gulp-nodemon');
let env = require('./env');

gulp.task('watch', ['build'], function() {
  return nodemon({
    ext: 'ts js json',
    script: 'build/main/index.js',
    watch: ['src/*'],
    tasks: ['build'],
    env
  });
});