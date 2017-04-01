module.exports = {
  factory: function() {
    return {
      x: 0,
      y: 0,
      z: 0,
      w: 0
    };
  },
  reset: function(quaternion) {
    quaternion.x = 0;
    quaternion.y = 0;
    quaternion.z = 0;
    quaternion.w = 0;
  }
};
