const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', () => del(['build/']));

gulp.task('compile', () =>
  // https://github.com/ivogabe/gulp-typescript/issues/295#issuecomment-197299175
  gulp
    // Compile model too
    .src(['src/**/*.ts', 'src/**/*.js'])
    .pipe(tsProject())
    .js.pipe(gulp.dest('build/src'))
);

gulp.task('copy:src', () =>
  gulp.src(['./src/**/*', '!./**/*.{js,tsx,ts}']).pipe(gulp.dest('build/src'))
);

gulp.task('copy:other', () =>
  gulp
    .src(['package.json', 'knexfile.js', 'yarn.lock'])
    .pipe(gulp.dest('build'))
);

gulp.task(
  'default',
  gulp.series('clean', gulp.parallel('compile', 'copy:src', 'copy:other'))
);
