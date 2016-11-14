var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var iconfont = require('gulp-iconfont');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var runTimestamp = Math.round(Date.now()/1000);
var consolidate = require('gulp-consolidate');
var rename = require('gulp-rename');
var inlineFonts = require('gulp-inline-fonts');

gulp.task('default', function(callback) {
    runSequence('clean',
              'icons',
              'fonts',
              'styles',
              'index',
              'server',
              callback);
});

gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('icons', function(){
    return gulp.src(['src/assets/icons/*.svg'])
    .pipe(iconfont({
      fontName: 'icons', // required 
      normalize: true,
      prependUnicode: true, // recommended option 
      formats: ['woff'], // default, 'woff2' and 'svg' are available 
      timestamp: runTimestamp, // recommended to get consistent builds when watching files 
      log: function(){}
    }))
    .on('glyphs', function(glyphs, options) {
      gulp.src('icons.css')
          .pipe(consolidate('lodash', {
              glyphs: glyphs,
              fontName: 'icons',
              fontPath: 'src/assets/fonts/',
              className: 'icon'
          }))
          .pipe(rename('_icons.scss'))
          .pipe(gulp.dest('src/styles/'));
    })
    .pipe(gulp.dest('src/assets/fonts/'));
});

gulp.task('fonts', function(){
    return gulp.src('src/assets/fonts/*')
        .pipe(inlineFonts({
          name: 'icons',
          style: 'normal',
          weight: 'normal',
          formats: ['woff']
        }))
        .pipe(rename('_fonts.scss'))
        .pipe(gulp.dest('src/styles/'));
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
    gulp.watch('src/*.html', ['index']).on('change', browserSync.reload);
});