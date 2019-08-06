var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    nano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    cleancss = require('gulp-clean-css'),
    livereload = require('gulp-livereload'),
    htmlbeautify = require('gulp-html-beautify'),
    fileinclude = require('gulp-file-include'),
    connect = require('gulp-connect');

gulp.task('connect', function () {
    connect.server();
});


// Local Server
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: './'
        },
        notify: true,
        // open: false,
        // online: false, // Work Offline Without Internet Connection
        // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
    })
});

//EJS Tasks
gulp.task('ejs', function () {
    return gulp.src("./templates/*.ejs")
        .pipe(plumber())
        .pipe(ejs({
            msg: "Hello Gulp!"
        }))
        .pipe(htmlbeautify())
        .pipe(gulp.dest('./'))
        .pipe(livereload())
        .pipe(browserSync.stream());
});


//SASS Tasks
gulp.task('sass', function () {
    return gulp.src(['./node_modules/bootstrap/scss/bootstrap.scss', './src/sass/**/*.scss'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleancss({
            level: {
                1: {
                    specialComments: 0
                }
            }
        })) // Opt., comment out when debugging
        .pipe(concat('app.css'))
        .pipe(nano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(livereload())
        .pipe(browserSync.stream());
});

//HTML Tasks
gulp.task('html', function () {
    return gulp.src("./*.html")
        .pipe(plumber())
        .pipe(htmlbeautify())
        .pipe(gulp.dest('./'))
        .pipe(livereload())
        .pipe(browserSync.stream());
});

//IMAGES & SVG Tasks
gulp.task('img', () =>
    gulp.src('src/imgs/*')
    .pipe(plumber())
    .pipe(imagemin([
        imagemin.gifsicle({
            interlaced: true
        }),
        imagemin.jpegtran({
            progressive: true,
            optimizationLevel: 7
        }),
        imagemin.optipng({
            optimizationLevel: 7
        }),
        imagemin.svgo({
            plugins: [{
                    removeViewBox: true
                },
                {
                    cleanupIDs: false
                }
            ]
        })
    ]))
    .pipe(gulp.dest('dist/imgs'))
    .pipe(livereload())
    .pipe(browserSync.stream())
);


//Javscript Tasks
gulp.task('js', function () {
    return gulp.src("./src/js/**/*.*")
        .pipe(plumber())
        .pipe(uglify('./src/js/**/*.*'))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(livereload())
        .pipe(browserSync.stream());
});

// gulp.task('code', function () {
//     return gulp.src('./*.html')
//         .pipe(browserSync.reload({
//             stream: true
//         }))
// });


gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('./src/sass/**/*.scss', ['sass']);
    gulp.watch('./src/js/**/*.*', ['js']);
    gulp.watch('./*.html', ['html']).on('change', browserSync.reload);
    gulp.watch('./src/img/**/*.*', ['img']);
});

gulp.task('default', ['browser-sync', 'js', 'img', 'sass', 'html', 'watch', 'connect']);