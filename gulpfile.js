/*
 * @Xia Yanfei 2015-03-04
 */

"use strict";

var gulp = require('gulp');

var minifyCSS = require('gulp-minify-css'),     // 压缩css文件
    uglify = require('gulp-uglify'),            // 压缩js文件
    concat = require('gulp-concat'),            // 合并文件
    rename = require('gulp-rename');            // 重命名

// 压缩src文件到build/下
gulp.task('gallery-js', function () {
    gulp.src(['./src/**/*.js'])
        .pipe(rename({suffix: '.debug'}))
        .pipe(gulp.dest('./build/'))    //输出main.js到文件夹
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename = path.basename.replace('.debug', '');
            // path.basename += '.min';
        }))
        .pipe(gulp.dest('./build/'));
});

gulp.task('default', ['gallery-js']);