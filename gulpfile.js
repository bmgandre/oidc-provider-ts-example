var gulp = require('gulp'),
  exec = require('child_process').exec;

gulp.task('cp-views', function () {
  return gulp.src('./src/views/**/*.ejs')
    .pipe(gulp.dest('./dist/views'));
});