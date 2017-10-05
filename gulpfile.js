// Less configuration
// yarn add --dev gulp gulp-less gulp-clean-css gulp-rename gulp-if gulp-sourcemaps
const gulp = require('gulp');
const less = require('gulp-less');
const minify = require('gulp-clean-css');
const rename = require('gulp-rename');
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('less', () => {
  gulp.src(['public/assets/css/skins/*.less'])
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(f => f.base))
    .pipe(gulpIf('*.css', minify({ sourceMap: false })))
    .pipe(minify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulpIf('*.css', gulp.dest(f => f.base)));
});

gulp.task('default', ['less'], () => {
  gulp.watch('public/assets/css/skins/*.less', ['less']).on('change', event => {
    console.log(`File ${event.path} was ${event.type}, running tasks...`);
  });
});
