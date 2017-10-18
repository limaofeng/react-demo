module.exports = wallaby => ({
  files: [
    { pattern: 'src/**/*.+(js|jsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)', instrument: false },
    '!src/**/*.test.js?(x)'
  ],
  tests: ['src/**/*.test.js?(x)'],
  compilers: {
    'src/**/*.js': wallaby.compilers.babel()
  },
  env: {
    type: 'node',
    runner: 'node'
  },
  testFramework: 'jest',
  setup(wallaby) {
    const jestConfig = require('./package.json').jest;
    jestConfig.globals = { __DEV__: true, testEnvironment: 'jsdom' };
    wallaby.testFramework.configure(jestConfig);
  },
  debug: true
});
