'use strict';

// change this to your app's name (angular module)
var appName = 'IonicGulpSeed';


var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var beep = require('beepbeep');
var express = require('express');
var path = require('path');
var open = require('open');
var stylish = require('jshint-stylish');
var connectLr = require('connect-livereload');
var streamqueue = require('streamqueue');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var ripple = require('ripple-emulator');
var cache = require('gulp-cached');
var KarmaServer = require('karma').Server;
var spawn = require('child_process').spawn;
var Promise = require('bluebird');

// this is the express server which 
// will be initiated when gulp serve
var server = null;

/**
 * Parse arguments
 */
var args = require('yargs')
    .alias('e', 'emulate')
    .alias('b', 'build')
    .alias('r', 'run')
    // remove all debug messages (console.logs, alerts etc) from release build
    .alias('release', 'strip-debug')
    .default('build', false)
    .default('port', 9000)
    .default('strip-debug', false)
    .argv;

var build = !!(args.build || args.emulate || args.run);
var emulate = args.emulate;
var run = args.run;
var port = args.port;
var stripDebug = !!args.stripDebug;
var targetDir = path.resolve(build ? 'www' : '.tmp');

// if we just use emualate or run without specifying platform, we assume iOS
// in this case the value returned from yargs would just be true
if (emulate === true) {
    emulate = 'ios';
}
if (run === true) {
    run = 'ios';
}

// global error handler
function errorHandler(error) {
  console.log('beep: ', beep);
  beep();
  if (build) {
    throw error;
  } else {
    plugins.util.log(error);
  }
};


// clean target dir
gulp.task('clean', function(done) {
  del([targetDir], done);
});

// precompile .scss and concat with ionic.css
gulp.task('styles', function() {

  var options = build ? { style: 'compressed' } : { style: 'expanded' };

  var sassStream = gulp.src('app/styles/main.scss')
    .pipe(plugins.sass(options))
    .on('error', function(err) {
      console.log('err: ', err);
      beep();
    });


  var ionicStream = gulp.src('bower_components/ionic/scss/ionic.scss')
    .pipe(cache('styles'))
    .pipe(plugins.sass(options))
    .pipe(plugins.remember('styles'))
    .on('error', function(err) {
        console.log('err: ', err);
        beep();
      });

  return streamqueue({ objectMode: true }, ionicStream, sassStream)
    .pipe(plugins.autoprefixer('last 1 Chrome version', 'last 3 iOS versions', 'last 3 Android versions'))
    .pipe(plugins.concat('main.css'))
    .pipe(plugins.if(build, plugins.stripCssComments()))
    .pipe(plugins.if(build && !emulate, plugins.rev()))
    .pipe(gulp.dest(path.join(targetDir, 'styles')))
    .on('error', errorHandler);
});


// build templatecache, copy scripts.
// if build: concat, minsafe, uglify and versionize
gulp.task('scripts', function() {
  var dest = path.join(targetDir, 'scripts');

  var minifyConfig = {
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeComments: true
  };

  // prepare angular template cache from html templates
  // (remember to change appName var to desired module name)
  var templateStream = gulp
    .src('**/*.html', { cwd: 'app/templates'})
    .pipe(plugins.angularTemplatecache('templates.js', {
      root: 'templates/',
      module: appName,
      htmlmin: build && minifyConfig
    }));

  var scriptStream = gulp
    .src(['templates.js', 'app.js', '**/*.js'], { cwd: 'app/scripts' })

    .pipe(plugins.if(!build, plugins.changed(dest)));

  return streamqueue({ objectMode: true }, scriptStream, templateStream)
    .pipe(plugins.if(build, plugins.ngAnnotate()))
    .pipe(plugins.if(stripDebug, plugins.stripDebug()))
    .pipe(plugins.if(build, plugins.concat('app.js')))
    .pipe(plugins.if(build, plugins.uglify()))
    .pipe(plugins.if(build && !emulate, plugins.rev()))

    .pipe(gulp.dest(dest))

    .on('error', errorHandler);
});

// copy fonts
gulp.task('fonts', function() {
  return gulp
    .src(['app/fonts/*.*', 'bower_components/ionic/fonts/*.*'])

    .pipe(gulp.dest(path.join(targetDir, 'fonts')))

    .on('error', errorHandler);
});


// copy templates
gulp.task('templates', function() {
  return gulp.src('app/templates/**/*.*')
    .pipe(gulp.dest(path.join(targetDir, 'templates')))

    .on('error', errorHandler);
});

// generate iconfont
gulp.task('iconfont', function(){
  return gulp.src('app/icons/*.svg', {
        buffer: false
    })
    .pipe(plugins.iconfontCss({
      fontName: 'ownIconFont',
      path: 'app/icons/own-icons-template.css',
      targetPath: '../styles/own-icons.css',
      fontPath: '../fonts/'
    }))
    .pipe(plugins.iconfont({
        fontName: 'ownIconFont'
    }))
    .pipe(gulp.dest(path.join(targetDir, 'fonts')))
    .on('error', errorHandler);
});

// copy images
gulp.task('images', function() {
  return gulp.src('app/images/**/*.*')
    .pipe(gulp.dest(path.join(targetDir, 'images')))

    .on('error', errorHandler);
});


// lint js sources based on .jshintrc ruleset
gulp.task('jsHint', function(done) {
  return gulp
    .src('app/scripts/**/*.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish))

    .on('error', errorHandler);
    done();
});

// concatenate and minify vendor sources
gulp.task('vendor', function() {
  var vendorFiles = require('./vendor.json');

  return gulp.src(vendorFiles)
    .pipe(plugins.concat('vendor.js'))
    .pipe(plugins.if(build, plugins.uglify()))
    .pipe(plugins.if(build, plugins.rev()))

    .pipe(gulp.dest(targetDir))

    .on('error', errorHandler);
});


// inject the files in index.html
gulp.task('index', ['jsHint', 'scripts'], function() {

  // build has a '-versionnumber' suffix
  var cssNaming = 'styles/main*';

  // injects 'src' into index.html at position 'tag'
  var _inject = function(src, tag) {
    return plugins.inject(src, {
      starttag: '<!-- inject:' + tag + ':{{ext}} -->',
      read: false,
      addRootSlash: false
    });
  };

  // get all our javascript sources
  // in development mode, it's better to add each file seperately.
  // it makes debugging easier.
  var _getAllScriptSources = function() {
    var scriptStream = gulp.src(['scripts/app.js', 'scripts/**/*.js'], { cwd: targetDir });
    return streamqueue({ objectMode: true }, scriptStream);
  };

  return gulp.src('app/index.html')
    // inject css
    .pipe(_inject(gulp.src(cssNaming, { cwd: targetDir }), 'app-styles'))
    // inject vendor.js
    .pipe(_inject(gulp.src('vendor*.js', { cwd: targetDir }), 'vendor'))
    // inject app.js (build) or all js files indivually (dev)
    .pipe(plugins.if(build,
      _inject(gulp.src('scripts/app*.js', { cwd: targetDir }), 'app'),
      _inject(_getAllScriptSources(), 'app')
    ))

    .pipe(gulp.dest(targetDir))
    .on('error', errorHandler);
});

// start local express server
gulp.task('serve', function() {
  server = express()
    .use(!build ? connectLr() : function(){})
    .use(express.static(targetDir))
    .listen(port);
  open('http://localhost:' + port + '/');
});

// ionic emulate wrapper
gulp.task('ionic:emulate', plugins.shell.task([
  'ionic emulate ' + emulate + ' --livereload --consolelogs'
]));

// ionic run wrapper
gulp.task('ionic:run', plugins.shell.task([
  'ionic run ' + run
]));

// ionic resources wrapper
gulp.task('icon', plugins.shell.task([
  'ionic resources --icon'
]));
gulp.task('splash', plugins.shell.task([
  'ionic resources --splash'
]));
gulp.task('resources', plugins.shell.task([
  'ionic resources'
]));

// select emulator device
gulp.task('select', plugins.shell.task([
  './emulateios'
]));

// ripple emulator
gulp.task('ripple', ['scripts', 'styles', 'watchers'], function() {

  var options = {
    keepAlive: false,
    open: true,
    port: 4400
  };

  // Start the ripple server
  ripple.emulate.start(options);

  open('http://localhost:' + options.port + '?enableripple=true');
});


// start watchers
gulp.task('watchers', function() {
  plugins.livereload.listen();
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/fonts/**', ['fonts']);
  gulp.watch('app/icons/**', ['iconfont']);
  gulp.watch('app/images/**', ['images']);
  gulp.watch('app/scripts/**/*.js', ['index']);
  gulp.watch('./vendor.json', ['vendor']);
  gulp.watch('app/templates/**/*.html', ['index']);
  gulp.watch('app/index.html', ['index']);
  gulp.watch(targetDir + '/**')
    .on('change', plugins.livereload.changed)
    .on('error', errorHandler);
});

// no-op = empty function
gulp.task('noop', function() {});

//testing
gulp.task('test-unit', function(done){
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

/*
 * This gets the path to protractor folder under node_modules
 */
function getProtractorBinary(binaryName){
    var pkgPath = require.resolve('protractor');
    var protractorDir = path.resolve(path.join(path.dirname(pkgPath), '..', 'bin'));
    return path.join(protractorDir, '/'+binaryName);
}

gulp.task('test-e2e', ['default'], function(){
  var protractor = plugins.protractor.protractor;

  return new Promise(function(resolve, reject){
    /**
     * Steps:
     * 1. webdriver-manager update: to make sure the standalone 
     *      selenium driver is downloaded to be used
     * 2. webdriver-manager start: to start selenium driver
     * 3. run protractor test cases
     */
    var webdriverBinary = getProtractorBinary('webdriver-manager');

    var webdriverUpdate = spawn('node', [webdriverBinary, 'update'], {stdio: 'inherit'})
      .once('close', function(){
        var webdriverProcess = spawn('node', 
                        [webdriverBinary, 'start'], 
                        {stdio: 'inherit'});
     
        setTimeout(function(){

          var stream = gulp.src('test/e2e/**/*.spec.js').
                  pipe(protractor({
                    configFile: './protractor.conf.js'
                  })).on('end', function(){
                    webdriverProcess.kill();
                    webdriverUpdate.kill();
                    server.close();
                  });
          resolve(stream);
        }, 5000);
      });
  });
});


// our main sequence, with some conditional jobs depending on params
gulp.task('default', function(done) {
  runSequence(
    'clean',
    'iconfont',
    [
      'fonts',
      'templates',
      'styles',
      'images',
      'vendor'
    ],
    'index',
    build ? 'noop' : 'watchers',
    build ? 'noop' : 'serve',
    emulate ? ['ionic:emulate', 'watchers'] : 'noop',
    run ? 'ionic:run' : 'noop',
    done);
});
