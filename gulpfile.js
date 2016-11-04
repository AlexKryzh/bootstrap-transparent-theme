var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('default', function(callback) {
    runSequence('clean',
              'styles',
              'index',
              'server',
              callback);
});

gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('styles', function() {
    return gulp.src('src/styles/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.stream());
});

gulp.task('index', function() {
    return gulp.src('src/index.html')
    .pipe(gulp.dest('dist/'))
});

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch('src/styles/*.scss', ['styles']);
    gulp.watch('src/*.html').on('change', browserSync.reload);
});