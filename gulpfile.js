var gulp = require("gulp");
var shell = require("gulp-shell");

gulp.task('scripts',  function() {
  return gulp.src('src/assets/packets/createjson.js', {read: false})
    .pipe(shell([
      'node <%= file.path %>'
    ]))
});

gulp.task('default', function() {
  //gulp.run('scripts');
});

//alphabetical order reverse and forward.
