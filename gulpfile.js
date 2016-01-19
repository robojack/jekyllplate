var gulp         = require('gulp');
var haml         = require('gulp-ruby-haml');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var concat       = require('gulp-concat');
var coffee       = require('gulp-coffee');
var uglify       = require('gulp-uglify');
var browserSync  = require('browser-sync');
var reload       = browserSync.reload;

gulp.task('haml', function() {
  gulp.src('_haml/**/*.haml')
    .pipe(haml())
    .on('error', function (err) {
      console.log(err);
      this.emit('end');
    })
    .pipe(gulp.dest('./'));
});

gulp.task('sass', function() {
  gulp.src('assets/_sass/**/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({
      indentedSyntax: true,
      outputStyle: 'compressed',
      includePaths: [
        'node_modules/susy/sass/'
      ]
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('assets/css/'))
    .pipe(reload({stream: true}));
});

gulp.task('coffee', function() {
  gulp.src([
    // This is like the Rails asset pipeline JS manifest
    'assets/_coffee/global.coffee',
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.coffee'))
    .pipe(coffee({bare: true}).on('error', function (err) {
      console.log(err);
      this.emit('end');
    }))
    .pipe(sourcemaps.write())
    // .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('assets/js/'));
});

gulp.task('uglify', function() {
  return gulp.src('assets/js/main.js')
    .pipe(uglify())
    .pipe(gulp.dest('assets/js/'));
});

gulp.task('browser-sync', function() {
  browserSync({
    notify: false,
    reloadDebounce: 2000,
    files: [
      '_site/assets/css/*.css',
      '_site/assets/media/**',
      '_site/assets/js/**/*.js',
      '_site/**/*.html'
    ],
    ghostMode: {
      clicks: true,
      forms: true
    },
    open: false,
    logLevel: 'debug',
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task('watch', function() {
  gulp.watch('_haml/**/*.haml', ['haml']);
  gulp.watch('assets/_sass/**/*.sass', ['sass']);
  gulp.watch('assets/_coffee/**/*.coffee', ['coffee']);
  // gulp.watch('assets/js/main.js', ['uglify']);
});

// Default Task
gulp.task('default', [
  'haml',
  'sass',
  'coffee',
  'uglify',
  'browser-sync',
  'watch'
]);
