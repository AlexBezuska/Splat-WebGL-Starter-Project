module.exports = {
  create: function(x, y) {
    return [x, y];
  },
  add: function(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
  },
  subtract: function(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
  },
  multiply: function(a, scalar) {
    return [a[0] * scalar, a[1] * scalar];
  },
  dot: function(a, b) {
    return (a[0] * b[0]) + (a[1] * b[1]);
  },
  magnitudeSquared: function(a) {
    return (a[0] * a[0]) + (a[1] * a[1]);
  }
};
