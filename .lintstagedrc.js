module.exports = {
  '**/*.ts?(x)': () => 'npm run type-check',
  '**/*.(ts|tsx|js)': (filenames) => [
    `npm run lint . ${filenames.join(' ')}`,
    `npm run prettier --write ${filenames.join(' ')}`,
  ],
};
