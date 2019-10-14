var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');


gulp.task('js', function() {
    return gulp.src('./resources/js/*.js')
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/'))
});

gulp.task('css', function() {
    return gulp.src('./resources/css/*.css')
        .pipe(concat('styles.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./public/css/'))
});

gulp.task('default', gulp.parallel([
    'js',
    'css'
]));