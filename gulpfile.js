var fs = require("fs");
var del = require('del');
var gulp = require('gulp');

var cached = require('gulp-cached');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var babelify = require('babelify');
var browserify = require('browserify');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');


// 디렉토리 설정
var dirRoot = __dirname;
var dirSrc = '/src';
var dirJs = '/js';
var dirImg = '/img';
var dirLib = '/lib';
var dirBuild = '/build';



function directoryExists(path) {
    try {
        return fs.statSync(path).isDirectory();
    }
    catch (err) {
        return false;
    }
}


gulp.task('clean', () => {
    return del(dirRoot + dirBuild + '**/*', {
        force: true
    });
});


gulp.task('copy-img', () => {
    return gulp.src(dirRoot + dirSrc + dirImg + '/**/*.*')
    .pipe(cached('img'))
    .pipe(gulp.dest(dirRoot + dirBuild + dirImg));
});


gulp.task('copy-lib', () => {
    return gulp.src(dirRoot + dirSrc + dirLib + '**/*')
        .pipe(cached('lib'))
        .pipe(gulp.dest(dirRoot + dirBuild));
});


gulp.task('copy-html', () => {
    return gulp.src(dirRoot + dirSrc + dirJs + '/*.html')
        .pipe(cached('html'))
        .pipe(gulp.dest(dirRoot + dirBuild + dirJs));
});


gulp.task('bundle', () => {
    return browserify(dirRoot + dirSrc + dirJs + "/index.js")
        .transform(babelify, {presets: ['es2015-loose']})
        .bundle()
        .pipe(fs.createWriteStream(dirRoot + dirBuild + dirJs + '/bundle.js'));
});


gulp.task('build', ['clean', 'copy-img', 'copy-lib', 'copy-html'], () => {
    return gulp.start('bundle');
});





