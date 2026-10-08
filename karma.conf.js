module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['qunit'],
    files: [
      'node_modules/lodash/lodash.js',
      'build/three.js',
      'test/unit/**/*.js'
    ],
    exclude: [
      'test/unit/unittests_*.html',
      'test/unit/qunit-*.js',
      'test/unit/qunit-*.css',
      'test/unit/qunit-utils.js',
      'test/unit/SmartComparer.js'
    ],
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
      subdir: '.'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity,
    client: {
      qunit: {
        showUI: true,
        testTimeout: 10000
      }
    }
  });
};