# Ionic Gulp Seed
### An ionic starter project with a gulp toolchain

Heads-up: There is now also a [Yeoman Generator](https://github.com/tmaximini/generator-ionic-gulp) available for this seed.

## Features

* Gulp jobs for development, building, unit testing, emulating and running your app
* Compiles and concatenates your Sass
* Local development server with live reload, even inside ios emulator
* Automatically inject all your JS sources into `index.html`
* Auto min-safe all Angular DI through `ng-annotate`, no need to use weird bracket notation
* Comes already with [ng-cordova](http://ngcordova.com/) and [lodash](https://lodash.com)
* generate icon font from svg files
* Blazing fast
* E2E(End-to-End) testing with Protractor

## Commands

| gulp command                | shortcut             | what it does                                                                                   |
|-----------------------------|----------------------|------------------------------------------------------------------------------------------------|
| `gulp`                      | —                    | run local development server, start watchers, auto reload browser on change, targetfolder /tmp |
| `gulp --build`              | `gulp -b`            | create a build from current `/app` folder, minify assets, targetfolder `/www`                  |
| `gulp --emulate <platform>` | `gulp -e <platform>` | run a build first, then ionic emulate <platform>. defaults to ios                              |
| `gulp --run <platform>`     | `gulp -r <platform>` | run a build first, then ionic run <platform>. defaults to ios                                  |
| `gulp test-unit`            | none                 | run all the test cases under `test/unit` folder using Karma runner                             |
| `gulp test-e2e`             | none                 | run all the test cases under `test/e2e` folder using Protractor                                |

## Installation

I recommend using the available [Yeoman Generator](https://github.com/tmaximini/generator-ionic-gulp).

```bash
npm install -g yo generator-ionic-gulp
yo ionic-gulp
```

OR you can clone the repo manually:

1. Clone this project `git clone https://github.com/tmaximini/ionic-gulp-seed.git <YOUR-PROJECT-NAME>`
2. Change remote to your repo `git remote set-url origin https://github.com/<YOUR-USERNAME>/<YOUR-PROJECT-NAME>.git`
3. run `npm install` and `bower install` to install dependencies


## Structure

The source code lives inside the `app` folder.

| Source Files  | Location |
| ------------- | ------------- |
| Javascript    | `app/scripts`  |
| Styles (scss) | `app/styles`  |
| Templates     | `app/templates`  |
| Images        | `app/images`  |
| Fonts         | `app/fonts`  |
| Icons         | `app/icons`  |

A lot of starter kits and tutorials encourage you to work directly inside the `www` folder, but I chose `app` instead, as it conforms better with most Angular.js projects. Note that `www` is gitignored and will be created dynamically during our build process.

All 3rd party Javascript sources have to be manually added into `.vendor.json` and will be concatenated into a single `vendor.js` file.
I know there is [wiredep](https://github.com/taptapship/wiredep) but I prefer to explicitly control which files get injected and also wiredep ends up adding lots of `<script>` tags in your index.html instead of building a single `vendor.js` file.

All test cases are located under `test` folder. E2E testing specs are inside `test/e2e` folder. Unit Testing with [Karma] runner is in `test/unit` folder. They both use [MochaJS] as the main framework.

## Workflow

This doc assumes you have `gulp` globally installed (`npm install -g gulp`).
If you do not have / want gulp globally installed, you can run `npm run gulp` instead.

Secondly, you need to have cordova and ionic cli installed (`npm install -g cordova` and `npm install -g ionic`. _Note:_ when you run `cordova platform add android` for the first time, it will give an error _Error: Current working directory is not a Cordova-based project._. The reason is that you are not having the _www_ folder. All you have to do is to run `gulp --build` to generate the folder.

#### Development mode

By running just `gulp`, we start our development build process, consisting of:

- compiling, concatenating, auto-prefixing of all `.scss` files required by `app/styles/main.scss`
- creating `vendor.js` file from external sources defined in `./vendor.json`
- linting all `*.js` files `app/scripts`, see `.jshintrc` for ruleset
- automatically inject sources into `index.html` so we don't have to add / remove sources manually
- build everything into `.tmp` folder (also gitignored)
- start local development server and serve from `.tmp`
- start watchers to automatically lint javascript source files, compile scss and reload browser on changes


#### Build mode

By running just `gulp --build` or short `gulp -b`, we start gulp in build mode

- concat all `.js` sources into single `app.js` file
- version `main.css` and `app.js`
- build everything into `www` folder
- remove debugs messages such as `console.log` or `alert` with passing `--release`


#### Emulate

By running `gulp -e <platform>`, we can run our app in the simulator

- <platform> can be either `ios` or `android`, defaults to `ios`
- make sure to have iOS Simulator installed in XCode, as well as `ios-sim` package globally installed (`npm install -g ios-sim`)
- for Android, [Ripple](http://ripple.incubator.apache.org/) or [Genymotion](https://www.genymotion.com/) seem to be the emulators of choice
- It will run the `gulp --build` before, so we have a fresh version to test
- In iOS, it will livereload any code changes in iOS simulator

#### Emulate a specific iOS device

By running `gulp select` you will se a prompt where you can choose which ios device to emulate. This works only when you have the `gulp -e` task running in one terminal window and run `gulp select` in another terminal window.


#### Ripple Emulator

Run `gulp ripple` to open your app in a browser using ripple. This is useful for emuating a bunch of different Android devices and settings, such as geolocation, battery status, globalization and more. Note that ripple is still in beta and will show weird debug messages from time to time.


#### Run

By running `gulp -r <platform>`, we can run our app on a connected device

- <platform> can be either `ios` or `android`, defaults to `ios`
- It will run the `gulp --build` before, so we have a fresh version to test

### splash screens and icons

Replace `splash.png` and `icon.png` inside `/resources`. Then run `ionic resources`. If you only want to regenerate icons or splashs, you can run `gulp icon` or `gulp splash` shorthand.

#### more info

There is also a [blog post with more detailed information about this gulp workflow](http://www.thomasmaximini.com/2015/02/10/speeding-up-ionic-app-development-with-gulp.html)

## Testing

### Unit Testing
Unit Testing is done using [Karma] runner. The main configuration file is `karma.conf.js` under root folder. You can change the frameworks to be used by changing the `frameworks` key in `karma.conf.js` file. Currently [MochaJS], [Chai]\(BDD testing style) and [Sinon] are being used.

All the html files `app/templates/**/*.html` are converted to angular module `AppTemplate` using [html2js](https://github.com/karma-runner/karma-ng-html2js-preprocessor) when you run `gulp test-unit`. Hence, you need to write `beforeEach(module('AppTemplate'))` in your test files so that angular will not give you a GET error when looking for the template files.

### E2E testing
[Protractor] is used in this project to run E2E testing. `protractor.conf.js` is the main configuration file. If you change the port for the running server, you will need to change the baseUrl in the `protractor.conf.js` file. To make it generic, [MochaJS] is also used as the main framework. You need to suffix your files with 'spec.js'. It's actually only a convention and I'm trying to follow that.

When you run `gulp test-e2e`, it brings up the server by running `gulp default` task with all the preprocessing for javascript and css files. Then it tries to update [WebDriver]. When that's finished, it starts [WebDriver] process and runs all the test cases.

<!--
	Links
-->
[MochaJS]: https://mochajs.org
[Karma]: http://karma-runner.github.io/0.13/index.html
[Chai]: http://chaijs.com/api/bdd
[Sinon]: http://sinonjs.org
[Protractor]: https://docs.angularjs.org/guide/e2e-testing
[WebDriver]: http://webdriver.io