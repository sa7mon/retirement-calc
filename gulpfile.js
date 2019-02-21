const gulp   = require('gulp');
const pump   = require('pump');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel  = require('gulp-babel');
const uglifycss = require('gulp-uglifycss');
const { series, parallel} = require('gulp');

gulp.task('app-js', function(cb) {
    pump([
        gulp.src([
            'src/js/app.js'
        ]),
        concat('app.min.js'),
        gulp.dest('dist/js/'),
        babel({
            presets: ['env']
        }),
        uglify(),
        gulp.dest('dist/js/')
    ], cb);
});

gulp.task('vendor-js', function(cb) {
    pump([
        gulp.src([
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
            'node_modules/chart.js/dist/Chart.min.js',
        ]),
        concat('vendor.min.js'),
        gulp.dest('dist/js/')
    ], cb);
});


gulp.task('app-css', function(cb) {
    pump([
        gulp.src(['src/css/*.css']),
        concat('app.min.css'),
        uglifycss(),
        gulp.dest('dist/css/')
    ], cb); 
});

gulp.task('vendor-css', function(cb) {
    pump([
        gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css']),
        concat('vendor.min.css'),
        // uglifycss(),
        gulp.dest('dist/css/')
    ], cb); 
});

// gulp.task('template-css', function(cb) {
//     pump([
//         gulp.src(['src/css/bootstrap-4.1.min.css']),
//         concat('template.min.css'),
//         uglifycss(),
//         gulp.dest('dist/css/')
//     ], cb); 
// });

// gulp.task('watch', function () {
//     gulp.watch(['src/js/*.js'], gulp.series('app-js'));
//     gulp.watch(['src/css/*.css'], gulp.series('app-css'));
// });

gulp.task('default', gulp.series(parallel('app-js', 'vendor-js', 'app-css', 'vendor-css')), function() {});