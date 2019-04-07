var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// var jade = require('gulp-jade');
// var sass = require('gulp-sass');
// var plumber = require('gulp-plumber');
// var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
// var watch = require('gulp-watch');
// const babel = require('gulp-babel');
// const concat = require('gulp-concat');
// var sourcemaps = require('gulp-sourcemaps');
var mainBowerFiles = require('main-bower-files');
var parseArgs = require('minimist');
var gulpSequence = require('gulp-sequence');

gulp.task('clean', function() {
    return gulp.src(['./tmp'],{read:false})
        .pipe($.clean());
});

gulp.task('jade', function () {
    gulp.src('./source/**/*.jade')
        .pipe($.watch('./source/*.jade'))
        .pipe($.plumber())
        .pipe($.jade({
            pretty: true
        }))
        .pipe(gulp.dest('./public/'))
});

gulp.task('sass', function () {
    var plugins = [
        autoprefixer({
            browsers: ['last 2 version', '> 5%', 'ie 8']
        })
    ];
    return gulp.src('./source/scss/**/*.scss')
        .pipe($.watch('./source/scss/**/*.scss'))
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.postcss(plugins))
        .pipe($.sourcemaps.write('../maps'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('babel', () => {
    return gulp.src('./source/js/**/*.js')
        .pipe($.watch('./source/js/**/*.js'))
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['@babel/env']
        }))
        .pipe($.concat('all.js'))
        .pipe($.sourcemaps.write('../maps'))
        .pipe(gulp.dest('./public/js'))
});

gulp.task('bower', function() {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest('./tmp/vendors'))
});

gulp.task('vendorJS', function() {
    return gulp.src('./tmp/vendors/**/**.js')
        .pipe($.concat('vendors.js'))
        .pipe(gulp.dest('./public/js'))
});
// gulp.task('sequence', gulpSequence('clean','jade', 'sass','babel','bower','vendorJS'));
// gulp.task('default', ['jade', 'sass','babel']);