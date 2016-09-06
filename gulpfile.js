var gulp = require('gulp');
var tslint = require('gulp-tslint');
var exec = require('child_process').exec;
var istanbul = require("gulp-istanbul");
var jasmine = require('gulp-jasmine');
var tsconfig = require('gulp-tsconfig-files');
var JasmineConsoleReporter = require('jasmine-console-reporter');

var del = require('del');
var dtsGenerator = require('dts-generator');
var reporter = new JasmineConsoleReporter({
    colors: 1, // (0|false)|(1|true)|2 
    cleanStack: 1, // (0|false)|(1|true)|2|3 
    verbosity: 4, // (0|false)|1|2|(3|true)|4 
    listStyle: 'indent', // "flat"|"indent" 
    activity: false
});

require('dotbin');

var tsFilesGlob = ['./typings/index.d.ts', './src/**/*.ts', './test/**/*.ts', '!./src/**/index.ts'];

var appName = (function (p) {
    return p.name;
})(require('./package.json'));

gulp.task('clean', function () {
    return del([
        'lib/**/*'
    ]);
});

gulp.task('tslint', function () {
    return gulp.src(tsFilesGlob)
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

gulp.task('gen-def', function () {
    return dtsGenerator.default({
        name: appName,
        project: '.',
        out: './lib/' + appName + '.d.ts',
        exclude: ['node_modules/**/*.d.ts', 'typings/**/*.d.ts']
    });
});

gulp.task('_build', function (cb) {
    exec('tsc --version', function (err, stdout, stderr) {
        console.log('TypeScript ', stdout);
        if (stderr) {
            console.log(stderr);
        }
    });

    return exec('tsc', function (err, stdout, stderr) {
        console.log(stdout);
        if (stderr) {
            console.log(stderr);
        }
        cb(err);
    });
});

//run tslint task, then run update-tsconfig and gen-def in parallel, then run _build
gulp.task('build', function (callback) {
    gulp.series('tslint', 'gen-def', '_build')(callback);
});

gulp.task("istanbul:pre-test", function () {
    return gulp.src(['lib/src/**/*.js', '!lib/src/**/index.js'])
        // Covering files
        .pipe(istanbul({ includeUntested: true }))
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task('test', gulp.series('istanbul:pre-test', function () {
    return gulp.src('lib/test/**/*.spec.js')
        .pipe(jasmine({
            reporter: reporter
        }))
        .pipe(istanbul.writeReports());
}));

gulp.task('test-and-build', gulp.series('build', 'istanbul:pre-test', function () {
    return gulp.src('lib/test/**/*.spec.js')
        .pipe(jasmine())
        .pipe(istanbul.writeReports());
}));

gulp.task('watch', function () {
    gulp.watch('src/**/*.ts', ['build']);
});