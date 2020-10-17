'use strict';

var gulp = require('gulp');

var scss = require('gulp-sass');
scss.compiler = require('node-sass');

var clean = require('gulp-clean');
var rigger = require('gulp-rigger');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var babel = require('gulp-babel');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');

var property = {
    result: {
        main: './Result/',
        css: './Result/Content/css/',
        content: {
            scripts: './Result/Scripts/',
            images: './Result/Content/images/',
            fonts: './Result/Content/fonts/',
            libs: './Result/Content/libs/'
        }
    },
    source: {
        html: './Source/html/',
        scss: './Source/scss/',
        fonts: './source/fonts/',
        images: './source/images/',
        libs: './source/libs/',
        scripts: './source/scripts/'
    }
};

// очистить папки от предыдущего билда
gulp.task('clean', function () {
    return gulp.src(property.result.main, {read: false}).pipe(clean());
});

// собрать HTML
gulp.task('html:build', function () {
    gulp
        .src(property.source.html + '*.html')
        .pipe(rigger())
        .pipe(gulp.dest(property.result.main));
});

gulp.task('html:watch', function () {
    gulp.watch(property.source.html + '/**/*.*', ['html:build']);
});

// собрать SCSS
gulp.task('css:build', function () {
    return gulp
        .src(property.source.scss + '/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(scss().on('error', scss.logError))
        .pipe(
            postcss([
                autoprefixer(),
                require('postcss-object-fit-images'),
                require('postcss-flexbugs-fixes')
            ])
        )
        .pipe(sourcemaps.write('./maps'))

        /* Минификация CSS */

        //.pipe(cleanCSS({level: 2}))

        .pipe(gulp.dest(property.result.css));
});

gulp.task('scss:watch', function () {
    gulp.watch(property.source.scss + '/**/*.scss', ['css:build']);
});

// собрать Content

gulp.task('images:build', function () {
    return gulp
        .src(property.source.images + '/**')
        .pipe(gulp.dest(property.result.content.images));
});

gulp.task('images:watch', function () {
    gulp.watch([property.source.images + '/**/*.*'], ['images:build']);
});

gulp.task('fonts:build', function () {
    return gulp
        .src(property.source.fonts + '/**')
        .pipe(gulp.dest(property.result.content.fonts));
});

gulp.task('libs:build', function () {
    return gulp
        .src(property.source.libs + '/**')
        .pipe(gulp.dest(property.result.content.libs));
});

gulp.task('scripts:build', function () {
    return gulp
        .src(property.source.scripts + '/**')
        .pipe(
            babel({
                presets: ['@babel/env']
            })
        )
        //.pipe(uglify())
        .pipe(gulp.dest(property.result.content.scripts));
});

gulp.task('scripts:watch', function () {
    gulp.watch(property.source.scripts + '/**/*.*', ['scripts:build']);
});

//

// веб сервер
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: property.result.main
        }
    });

    gulp.watch(property.result.main + '*.html').on('change', browserSync.reload);
    gulp.watch(property.result.css + '*.css').on('change', browserSync.reload);
    gulp
        .watch(property.result.content.images + '*.svg')
        .on('change', browserSync.reload);
    gulp
        .watch(property.result.content.images + '*.png')
        .on('change', browserSync.reload);
    gulp
        .watch(property.result.content.images + '*.jpg')
        .on('change', browserSync.reload);
    gulp
        .watch(property.result.content.scripts + '*.js')
        .on('change', browserSync.reload);
});

//

gulp.task('build', [
    'html:build',
    'css:build',
    'images:build',
    'fonts:build',
    'scripts:build',
    'libs:build'
]);

gulp.task('watch', [
    'html:watch',
    'scss:watch',
    'images:watch',
    'scripts:watch'
]);

gulp.task('default', ['build', 'watch', 'browser-sync']);
