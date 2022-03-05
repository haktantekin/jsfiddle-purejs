// if you want run write 'gulp watch' in console.

"use strict";

let gulp = require('gulp'),sass = require("gulp-sass")(require("node-sass")),
concat = require('gulp-concat'),
minifyCSS = require('gulp-minify-css'),
uglify = require('gulp-uglify');

// Load plugins
// CSS task
function css() { 
  return gulp
    .src(
      [
        "./node_modules/bootstrap/scss/bootstrap.scss",
        "./node_modules/codemirror/lib/codemirror.css",
        "./node_modules/codemirror/addon/hint/show-hint.css",
        "./node_modules/codemirror/addon/lint/lint.css",
        "./node_modules/codemirror/theme/material-darker.css",
        "./assets/css/layout.scss"
      ])
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(concat('natkah-min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./assets/public/css'));
}

// Lint scripts
function scriptsLint() {
  return gulp
    .src(["./assets/scripts/*", "./gulpfile.js"])
}

// Transpile, concatenate and minify scripts
function scripts() {
  return (
    gulp
      .src([
        "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
        "./node_modules/codemirror/lib/codemirror.js",
        "./node_modules/codemirror/mode/javascript/javascript.js",
        "./node_modules/codemirror/mode/css/css.js",
        "./node_modules/codemirror/mode/xml/xml.js",
        "./node_modules/codemirror/addon/edit/closebrackets.js",
        "./node_modules/codemirror/addon/edit/closetag.js",
        "./node_modules/codemirror/addon/edit/continuelist.js",
        "./node_modules/codemirror/addon/edit/matchbrackets.js",
        "./node_modules/codemirror/addon/edit/matchtags.js",
        "./node_modules/codemirror/addon/edit/trailingspace.js",
        "./node_modules/codemirror/addon/hint/show-hint.js",
        "./node_modules/codemirror/addon/hint/css-hint.js",
        "./node_modules/codemirror/addon/hint/html-hint.js",
        "./node_modules/codemirror/addon/hint/xml-hint.js",
        "./node_modules/codemirror/addon/hint/javascript-hint.js",
        "./assets/scripts/plugin/jshint.js",
        "./assets/scripts/plugin/csslint.js",
        "./node_modules/codemirror/addon/lint/lint.js",
        "./node_modules/codemirror/addon/lint/css-lint.js",
        "./node_modules/codemirror/addon/lint/javascript-lint.js",
        "./assets/scripts/layout.js"
      ])
      .pipe(uglify())
      .pipe(concat('natkah-min.js'))
      .pipe(gulp.dest("./assets/public/js"))
  );
}

// Watch files
function watchFiles() {
  gulp.watch("./assets/css/**/*", css);
  gulp.watch("./assets/scripts/**/*", gulp.series(scriptsLint, scripts));
}


// define complex tasks
const js = gulp.series(scriptsLint, scripts);
const build = gulp.series(gulp.parallel(css, js));
const watch = gulp.parallel(watchFiles);


// export tasks
exports.css = css;
exports.js = js;
exports.watch = watch;