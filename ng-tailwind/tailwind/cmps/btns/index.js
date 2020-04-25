const _ = require('lodash');
const Color = require('color');

function defaultOptions(colors) {
  return {
    borderRadius: '.25rem',
    fontWeight: '600',
    lineHeight: '1.25',
    fontSize: '1rem',
    padding: '.5rem 1rem',
    colors: {
      white: {
        background: colors['white'],
        text: colors['black'],
      },
      black: {
        background: colors['black'],
      },
      grey: {
        background: colors['gray'],
        text: colors['black'],
      },
      red: {
        background: colors['red'],
      },
      orange: {
        background: colors['orange'],
      },
      yellow: {
        background: colors['yellow'],
        text: colors['yellow-darkest'],
      },
      green: {
        background: colors['green'],
      },
      teal: {
        background: colors['teal'],
      },
      blue: {
        background: colors['blue'],
      },
      indigo: {
        background: colors['indigo'],
      },
      purple: {
        background: colors['purple'],
      },
      pink: {
        background: colors['pink'],
      },
    },
    sizes: {
      sm: {
        fontSize: '.875rem',
        padding: '.5rem .75rem',
      },
      lg: {
        fontSize: '1.25rem',
        padding: '.75rem 1.5rem',
      },
    },
  };
}

function btnColor(bgc, fc, colorOptions, colors) {
  const bgColor = Color(bgc);
  if (bgColor.lightness() < 70) {
    fc = fc || colors.white;
  } else {
    fc = fc || colors.black;
  }
  return {
    backgroundColor: bgc,
    color: fc,
    '&:focus': {
      outline: 0,
      boxShadow: `0 0 0 .2em ${bgColor.alpha(0.5).rgb().toString()}`,
    },
    '&:hover': {
      backgroundColor: _.get(
        colorOptions,
        'hoverBackground',
        bgColor.darken(0.1).hex().toString(),
      ),
      color: _.get(colorOptions, 'hoverText', fc),
    },
    '&:active': {
      backgroundColor: _.get(
        colorOptions,
        'activeBackground',
        bgColor.darken(0.1).hex().toString(),
      ),
      color: _.get(colorOptions, 'activeText', fc),
    },
  };
}

module.exports = function btnCo({ addComponents, theme, e }, options) {
  const colors = theme('colors', {});
  const defaultBtnConfig = defaultOptions(colors);
  options = _.isFunction(options)
    ? options(defaultBtnConfig)
    : _.defaults(options, defaultBtnConfig);
  addComponents([
    {
      '.btn': {
        display: 'inline-block',
        padding: options.padding,
        // fontSize: options.fontSize,
        // fontWeight: options.fontWeight,
        lineHeight: options.lineHeight,
        borderRadius: options.borderRadius,
        textDecoration: 'none',
      },
    },
    ..._.map(_.omit(options.sizes, 'default'), (sizeOptions, name) => {
      return {
        [`.btn-${e(name)}`]: {
          padding: _.get(sizeOptions, 'padding', options.padding),
          // fontSize: _.get(sizeOptions, 'fontSize', options.fontSize),
          // fontWeight: _.get(sizeOptions, 'fontWeight', options.fontWeight),
          lineHeight: _.get(sizeOptions, 'lineHeight', options.lineHeight),
          borderRadius: _.get(
            sizeOptions,
            'borderRadius',
            options.borderRadius,
          ),
        },
      };
    }),
    ..._.flatten(
      _.map(options.colors, (colorOptions, name) => {
        const { background, text } = colorOptions;
        if (_.isString(background)) {
          return {
            [`.btn-${e(name)}`]: btnColor(
              background,
              text,
              colorOptions,
              colors,
            ),
          };
        } else {
          return _.map(background, (bc, key) => {
            return {
              [`.btn-${e(name)}-${e(key)}`]: btnColor(
                bc,
                text,
                colorOptions,
                colors,
              ),
            };
          });
        }
      }),
    ),
  ]);
};
