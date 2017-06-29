let gulp = require('gulp');
let lab = require('gulp-lab');

gulp.task('test', ['build'], () => {
  return gulp.src('./build/test/**/*.js').pipe(lab());
});