var constants = require("../constants");

module.exports = function(game) { // eslint-disable-line no-unused-vars

  game.scaleCanvasToFitRectangle(constants.screenResolution.width, constants.screenResolution.height);
};
