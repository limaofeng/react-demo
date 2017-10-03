// Less configuration
const gulp = require('gulp');
const less = require('gulp-less');

gulp.task('less', () => {
  gulp.src('*.less')
    .pipe(less())
    .pipe(gulp.dest(f => f.base));
});

gulp.task('default', ['less'], () => {
  gulp.watch('*.less', ['less']);
});
