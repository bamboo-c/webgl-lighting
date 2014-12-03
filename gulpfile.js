"use strict";

// variables
var gulp         = require("gulp");
var $            = require("gulp-load-plugins")();
var concat       = require("gulp-concat");
var uglify       = require("gulp-uglify");
var plumber      = require("gulp-plumber");

// ===== Sources path ====== //
var sources = {
      // dist
      js: "js/",

      // assets
      jsAssets: "assets/**/**.js"
    };
// ===== Sources path ====== //

// ===== JavaScript Optimaize ====== //
gulp.task("scripts", function () {
  return gulp.src(["assets/Main.js", "assets/lib/*.js"])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat("Main.js"))
    .pipe(gulp.dest(sources.js));
});
// ===== JavaScript Optimaize ====== //

// ===== files watch and make a local server ====== //
gulp.task("default", function () {
  gulp.watch([sources.jsAssets], ["scripts"]);
});
// ===== files watch and make a local server ====== //
