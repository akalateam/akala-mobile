var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var del = require('del');
var csso = require('gulp-csso');

var paths = {
    sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('bower_dev', function (cb) {
    runSequence('bower', 'concatjs', 'concatcss', 'mkfonts', 'minjs', 'mincss', cb);
});

gulp.task('bower_prd', function (cb) {
    runSequence('bower_dev', 'cleanlib', cb);
});

gulp.task('bower', function (done) {
    gulp.src(mainBowerFiles())
        .pipe(gulp.dest('./www/lib/'))
        .on('end', done);
});

gulp.task('mkfonts', function (done) {
    gulp.src(['./www/lib/*.eot', './www/lib/*.svg', './www/lib/*.ttf', './www/lib/*.woff', './www/lib/*.woff2'])
        .pipe(gulp.dest('./www/lib/fonts/'))
        .on('end', done);
});

gulp.task('concatjs', function (done) {
    gulp.src(['./www/lib/angular.js', './www/lib/ionic.js', './www/lib/ionic-angular.js', './www/lib/*.js', '!./www/lib/lib.js'])
        .pipe(concat('lib.js', {newLine: ';'}))
        .pipe(gulp.dest('./www/lib'))
        .on('end', done);
});

gulp.task('concatcss', function (done) {
    gulp.src(['./www/lib/*.css', '!./www/lib/lib.css'])
        .pipe(concat('lib.css'))
        .pipe(gulp.dest('./www/lib'))
        .on('end', done);
});

gulp.task('minjs', function (done) {
    gulp.src('./www/lib/lib.js')
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('./www/lib/js'))
        .on('end', done);
});

gulp.task('mincss', function (done) {
    gulp.src('./www/lib/lib.css')
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(csso())
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./www/lib/css'))
        .on('end', done);
});

gulp.task('cleanlib', function (done) {
    del(['./www/lib/*.*'], done);
});

gulp.task('config_dev', function (done) {
    gulp.src(['./config/config_dev.js'])
        .pipe(rename({
            basename: 'config',
            extname: '.js'
        }))
        .pipe(gulp.dest('./www/config/'))
        .on('end', done);
});

gulp.task('config_prd', function (done) {
    gulp.src(['./config/config_prd.js'])
        .pipe(rename({
            basename: 'config',
            extname: '.js'
        }))
        .pipe(gulp.dest('./www/config/'))
        .on('end', done);
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
