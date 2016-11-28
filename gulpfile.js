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
var dirExample = '/example';
var dirJs = '/js';
var dirImg = '/img';
var dirLibs = '/libs';
var dirBuild = '/__build__';



function directoryExists(path) {
    try {
        return fs.statSync(path).isDirectory();
    }
    catch (err) {
        return false;
    }
}


gulp.task('clean', () => del(dirRoot + dirBuild + '**/*', {
    force: true
}));


gulp.task('img', () => {
    return gulp.src([dirRoot + dirSrc + dirImg + '**/*'])
        .pipe(cached('img'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(dirRoot + dirBuild + dirSrc));
});


gulp.task('html', () => {
    gulp.src(dirRoot + dirSrc + '/*.html')
        .pipe(cached('html'))
        .pipe(gulp.dest(dirRoot + dirBuild + dirSrc));

    return gulp.src(dirRoot + dirExample + '/*.html')
        .pipe(cached('example-html'))
        .pipe(gulp.dest(dirRoot + dirBuild + dirExample));
});


gulp.task('libs', () => {
    return gulp.src(dirRoot + dirSrc + dirLibs + '**/*')
        .pipe(cached('libs'))
        .pipe(gulp.dest(dirRoot + dirBuild + dirSrc));
});


gulp.task('bundle', () => {
    if (!directoryExists(dirRoot + dirBuild + dirExample)) {
        fs.mkdirSync(dirRoot + dirBuild + dirExample);
    }

    return browserify(dirRoot + dirExample + dirJs + "/index.js")
        .transform(babelify, {presets: ['es2015-loose']})
        .bundle()
        .pipe(fs.createWriteStream(dirRoot + dirBuild + dirExample + '/bundle.js'));
});


gulp.task('build', ['clean'], () => {
    return gulp.start('img', 'libs', 'html', 'bundle');
});





