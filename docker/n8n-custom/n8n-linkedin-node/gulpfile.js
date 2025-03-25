const { src, dest, task } = require('gulp');

// Task to copy icons
task('build:icons', function() {
  return src('src/icons/**/*')
    .pipe(dest('dist/icons/'));
});