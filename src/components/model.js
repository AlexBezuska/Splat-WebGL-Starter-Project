module.exports = {
  factory: function() {
    return {
      name: undefined,
      options: {},
      mesh: undefined,
      castShadow: false,
      receiveShadow: false
    };
  },
  reset: function(model) {
    model.name = undefined;
    model.options = {};
    model.mesh = undefined;
    model.castShadow = false;
    model.receiveShadow = false;
  }
};
