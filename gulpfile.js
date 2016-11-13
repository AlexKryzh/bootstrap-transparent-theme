var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var iconfont = require('gulp-iconfont');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var runTimestamp = Math.round(Date.now()/1000);

gulp.task('default', function(callback) {
    runSequence('clean',
              'icons',
              'styles',
              'index',
              'server',
              callback);
});

gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('icons', function(){
    return gulp.src(['assets/icons/*.svg'])
    .pipe(iconfont({
      fontName: 'myfont', // required 
      prependUnicode: true, // recommended option 
      formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available 
      timestamp: runTimestamp, // recommended to get consistent builds when watching files 
    }))
      .on('glyphs', function(glyphs, options) {
        // CSS templating, e.g. 
        console.log(glyphs, options);
      })
    .pipe(gulp.dest('www/fonts/'));
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