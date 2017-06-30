let gulp = require('gulp');
let nodemon = require('gulp-nodemon');
let env = require('./env');
let { $exec } = require('./utils');
let runSequence = require('run-sequence');

gulp.task('watch', ['build'], function() {
  return nodemon({
    ext: 'ts js json',
    script: 'build/main/index.js',
    watch: ['src/*'],
    tasks: ['build'],
    env
  });
});

gulp.task('serve', (cb) => {

  function serve(cb) {
    $exec('node build/main/index.js', { env }).then(() => cb());
  }

  if (env.NODE_ENV === 'development') {
    runSequence('build', 'dbUpdate', () => serve(cb));
  }
  else {
    runSequence('build', () => serve(cb));
  }
});