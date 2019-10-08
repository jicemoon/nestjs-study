const grid = require('./grid/index');
module.exports = function addComponent(util) {
  grid(util, {
    grids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    gaps: {
      '0': '0',
      '4': '1rem',
      '8': '2rem',
    },
  });
};
