var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');

var gutil = require('gulp-util');
var underscore = require('underscore');
var underscoreStr = require('underscore.string');
var minifyCss = require('gulp-minify-css');

var templateCache = require('gulp-angular-templatecache');

gulp.task('sass', function() {
  gulp.src('public/stylesheets/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('compress', function() {
  gulp.src([
    // 'public/bower_components/**/*.js',
    'public/app.js',
    'public/services/*.js',
    'public/controllers/*.js',
    'public/filters/*.js',
    'public/directives/*.js'
  ])
    .pipe(concat('app.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('public'));
});

gulp.task('templates', function() {
  gulp.src('public/views/**/*.html')
    .pipe(templateCache({ root: 'views', module: 'MyApp' }))
    .pipe(gulp.dest('public'));
});

gulp.task('bundle-bower-js-auto', function(){
    var bowerFile = require('./bower.json');
    var bowerPackages = bowerFile.dependencies;
    var bowerDir = './public/bower_components';
    var packagesOrder = [];
    var mainFiles = [];

    // Function for adding package name into packagesOrder array in the right order
    function addPackage(name){
        // package info and dependencies
        var info = require(bowerDir + '/' + name + '/bower.json');
        var dependencies = info.dependencies;

        // add dependencies by repeat the step
        if(!!dependencies){
            underscore.each(dependencies, function(value, key){
                addPackage(key);
            });
        }

        // and then add this package into the packagesOrder array if they are not exist yet
        if(packagesOrder.indexOf(name) === -1){
            packagesOrder.push(name);
        }
    }

    // calculate the order of packages
    underscore.each(bowerPackages, function(value, key){
        addPackage(key);
    });

    // get the main files of packages base on the order
    underscore.each(packagesOrder, function(bowerPackage){
        var info = require(bowerDir + '/' + bowerPackage + '/bower.json');
        var main = info.main;
        var mainFile = main;

        // get only the .js file if mainFile is an array
        if(underscore.isArray(main)){
            underscore.each(main, function(file){
                if(underscoreStr.endsWith(file, '.js')){
                    mainFile = file;
                }
            });
        }

        // make the full path
        mainFile = bowerDir + '/' + bowerPackage + '/' + mainFile;

        // only add the main file if it's a js file
        if(underscoreStr.endsWith(mainFile, '.js')){
            mainFiles.push(mainFile);
        }
    });

    // run the gulp stream
    return gulp.src(mainFiles)
        .pipe(concat('bower.min.js'))
        .pipe(gulp.dest('public'));
});


gulp.task('bundle-bower-css-auto', function(){
    var bowerFile = require('./bower.json');
    var bowerPackages = bowerFile.dependencies;
    var bowerDir = './public/bower_components';
    var packagesOrder = [];
    var mainFiles = [];

    // Function for adding package name into packagesOrder array in the right order
    function addPackage(name){
        // package info and dependencies
        var info = require(bowerDir + '/' + name + '/bower.json');
        var dependencies = info.dependencies;

        // add dependencies by repeat the step
        if(!!dependencies){
            underscore.each(dependencies, function(value, key){
                addPackage(key);
            });
        }

        // and then add this package into the packagesOrder array if they are not exist yet
        if(packagesOrder.indexOf(name) === -1){
            packagesOrder.push(name);
        }
    }

    // calculate the order of packages
    underscore.each(bowerPackages, function(value, key){
        addPackage(key);
    });

    // get the main files of packages base on the order
    underscore.each(packagesOrder, function(bowerPackage){
        var info = require(bowerDir + '/' + bowerPackage + '/bower.json');
        var main = info.main;
        var mainFile = main;

        // get only the .js file if mainFile is an array
        if(underscore.isArray(main)){
            underscore.each(main, function(file){
                if(underscoreStr.endsWith(file, '.css')){
                    mainFile = file;
                }
            });
        }

        // make the full path
        mainFile = bowerDir + '/' + bowerPackage + '/' + mainFile;

        // only add the main file if it's a js file
        if(underscoreStr.endsWith(mainFile, '.css')){
            mainFiles.push(mainFile);
        }
    });

    // run the gulp stream
    return gulp.src(mainFiles)
        .pipe(concat('bower.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('public'));
});


gulp.task('watch', function() {
  gulp.watch('public/stylesheets/*.scss', ['sass']);
  gulp.watch('public/views/**/*.html', ['templates']);
  gulp.watch(['public/**/*.js', '!public/app.min.js', '!public/templates.js'], ['compress']);
  gulp.watch('public/bower_components',['bundle-bower-css-auto','bundle-bower-js-auto']);
});

gulp.task('default', ['sass', 'compress', 'templates','bundle-bower-js-auto','bundle-bower-css-auto', 'watch']);
