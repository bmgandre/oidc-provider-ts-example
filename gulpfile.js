var gulp = require('gulp');

gulp.task('cp-views', function () {
  return gulp.src('./src/views/**/*.ejs')
    .pipe(gulp.dest('./dist/views'));
});
