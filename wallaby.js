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
  debug: true
});
