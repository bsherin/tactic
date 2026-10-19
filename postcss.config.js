module.exports = {
  plugins: {
    // Blueprint uses relative-color channel math inside calc(). Preserve those
    // expressions because postcss-calc cannot parse channel names such as `l`.
    'cssnano': {
      preset: ['default', {calc: false}]
    }
  }
};
