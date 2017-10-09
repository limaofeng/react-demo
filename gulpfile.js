// npm install gulp gulp-less gulp-clean-css gulp-rename gulp-if gulp-sourcemaps gulp-uglify less
const gulp = require('gulp');
const less = require('gulp-less');
const minify = require('gulp-clean-css');
const rename = require('gulp-rename');
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const lessPaths = ['public/assets/css/skins/*.less'];
const jsPaths = ['public/assets/js/beyond.js', 'public/assets/js/skins.js'];

// Less configuration
gulp.task('less', () => {
  gulp.src(lessPaths)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(f => f.base))
    .pipe(gulpIf('*.css', minify({ sourceMap: false })))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulpIf('*.css', gulp.dest(f => f.base)));
});

// JavaScript configuration
gulp.task('script', () => {
  gulp.src(jsPaths)
    .pipe(sourcemaps.init())
    .pipe(gulpIf(file => !/\.min\.js/.test(file.path), uglify({
      output: { comments: '/!/' }
    })))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulpIf(file => !/\.min\.min/.test(file.path), sourcemaps.write('.')))
    .pipe(gulpIf(file => !/\.min\.min/.test(file.path), gulp.dest(f => f.base)));
});

gulp.task('default', [], () => {
  gulp.watch(lessPaths, ['less']).on('change', event => {
    console.log(`File ${event.path} was ${event.type}, running tasks...`);
  });
  gulp.watch(jsPaths, ['script']).on('change', event => {
    console.log(`File ${event.path} was ${event.type}, running tasks...`);
  });
});
