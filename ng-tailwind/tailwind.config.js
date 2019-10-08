const comps = require('./tailwind/cmps/index');
const utils = require('./tailwind/utils/');
module.exports = {
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [comps, utils],
};
