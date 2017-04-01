var THREE = require("three");

module.exports = function makeMesh(name, options) { // eslint-disable-line no-unused-vars
  switch (name) {
  case "box":
  default:
    return makeBox(options);
  case "camera":
    return makeCamera(options);
  case "cylinder":
    return makeCylinder(options);
  case "sphere":
    return makeSphere(options);
  case "directionalLight":
    return makeDirectionalLight(options);
  case "text":
    return makeText(options);
  case "spriteText":
    return makeSpriteText(options);
  case "sprite":
    return makeSprite(options);
  }
};


function makeSprite(options) {
  var texture = new THREE.TextureLoader().setPath("./").load(options.texture);
  texture.generateMipmaps = true;
  var material = new THREE.SpriteMaterial({
    useScreenCoordinates: false,
    map: texture
  });
  var sprite = new THREE.Sprite(material);
  sprite.scale.set(options.width, options.height, 1.0); // imageWidth, imageHeight
  return sprite;
}

function makeBox(options) {
  var width = getOption(options.width, 1);
  var height = getOption(options.height, 1);
  var depth = getOption(options.depth, 1);
  var color = getColorOption(options.color, 0xffffff);
  var geometry = new THREE.BoxGeometry(width, height, depth);
  var material = new THREE.MeshLambertMaterial({ color: color });

  if (options.material) {
    console.log(options.material.type);
    var directions, textureCube;
    if (options.material.type === "skybox") {
      directions = options.skybox;
      textureCube = new THREE.CubeTextureLoader().setPath("./").load(directions);
      textureCube.minFilter = THREE.NearestFilter;

      var shader = THREE.ShaderLib["cube"];
      shader.uniforms["tCube"].value = textureCube;
      material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
      });
    } else if (options.material.type === "skybox-reflection") {
      material = new THREE.MeshPhongMaterial({ color: color });
      directions = options.skybox;
      textureCube = THREE.ImageUtils.loadTextureCube(directions);
      textureCube.minFilter = THREE.NearestFilter;
      material.envMap = textureCube;
      material.reflectivity = getOption(options.material.reflectivity, 1);
      //material.specular = 0x050505;
      material.shininess = 10000;
    } else if (options.material.type === "transparent") {
      material.transparent = getOption(options.material.transparent, true);
      material.opacity = getOption(options.material.opacity, 1);
    }
  }
  var mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function makeCamera(options) {
  var fieldOfView = getOption(options.fieldOfView, 75);
  var aspectRatio = getOption(options.aspectRatio, window.innerWidth / window.innerHeight);
  var near = getOption(options.near, 1);
  var far = getOption(options.far, 1000);
  return new THREE.PerspectiveCamera(fieldOfView, aspectRatio, near, far);
}

function makeSphere(options) {
  var radius = getOption(options.radius, 1);
  var widthSegments = getOption(options.widthSegments, 64);
  var heightSegments = getOption(options.heightSegments, 64);
  var color = getColorOption(options.color, 0xffffff);

  var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  var material = new THREE.MeshPhongMaterial({ color: color });
  //options.material.reflectivity = getOption(options.material.reflectivity, 1);
  //options.material.shininess = 10000;
  var mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  return mesh;
}

function makeCylinder(options) {
  var radiusTop = getOption(options.radiusTop, 1);
  var radiusBottom = getOption(options.radiusBottom, 1);
  var height = getOption(options.height, 1);
  var radiusSegments = getOption(options.radiusSegments, 64);
  var color = getColorOption(options.color, 0xffffff);

  var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments);
  var material = new THREE.MeshLambertMaterial({ color: color });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  return mesh;
}

function makeDirectionalLight(options) {
  var color = getColorOption(options.color, 0xffffff);
  var intensity = getOption(options.intensity, 1);
  var castShadow = getOption(options.castShadow, false);
  var targetX = getOption(options.targetX, 0);
  var targetY = getOption(options.targetY, 0);
  var targetZ = getOption(options.targetZ, 0);

  var light = new THREE.DirectionalLight(color, intensity);
  light.castShadow = castShadow;
  light.shadowDarkness = 1;
  light.target.position.set(targetX, targetY, targetZ);
  return light;
}


var textMeasurementDiv = document.createElement("div");
textMeasurementDiv.style.display = "block";
textMeasurementDiv.style.position = "absolute";
textMeasurementDiv.style.top  = "-9999px";
textMeasurementDiv.style.left = "-9999px";
document.body.appendChild(textMeasurementDiv);

function measureTextInDiv(text, font) {
  textMeasurementDiv.style.font = font;
  textMeasurementDiv.textContent = text;
  return {
    width: textMeasurementDiv.offsetWidth,
    height: textMeasurementDiv.offsetHeight
  };
}

function canvasFont(options) {
  var font = [];
  Object.keys(options).forEach(function(key) {
    font.push(options[key]);
  });
  return font.join(" ");
}


function makeSpriteText(options) {
  var text = getOption(options.text, "Hello, world!");
  var fillStyle = getOption(options.fillStyle, "rgba(255, 0, 0, 0.95)");
  var font = getOption(canvasFont(options.font), "40px sans serif");
  var textWidth = getOption(options.textWidth, 256);
  var textHeight = getOption(options.textHeight, 256);
  var width = getOption(options.width, textWidth);
  var height = getOption(options.height, textHeight);

  var textCanvas = document.createElement("canvas");
  var textContext = textCanvas.getContext("2d");
  textCanvas.width = textWidth;
  textCanvas.height = textHeight;

  var metrics = measureTextInDiv(text, font);

  textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);
  textContext.textBaseline = "middle";
  textContext.font = font;
  textContext.fillStyle = fillStyle;
  textContext.fillText(text, (textWidth / 2) - (metrics.width / 2), (textHeight / 2));

  var texture1 = new THREE.Texture(textCanvas);
  texture1.needsUpdate = true;

  var spriteMaterial = new THREE.SpriteMaterial({
    useScreenCoordinates: false,
    map: texture1
  });

  var spriteText = new THREE.Sprite(spriteMaterial);
  spriteText.scale.set(width, height, 0); // imageWidth, imageHeight
  return spriteText;
}

function makeText(options) {
  var text = getOption(options.text, "Hello, world!");
  var fillStyle = getOption(options.fillStyle, "rgba(255, 0, 0, 0.95)");
  var font = getOption(options.font, "40px sans serif");
  var textWidth = getOption(options.textWidth, 256);
  var textHeight = getOption(options.textHeight, 256);
  var width = getOption(options.width, textWidth);
  var height = getOption(options.height, textHeight);

  var textCanvas = document.createElement("canvas");
  var textContext = textCanvas.getContext("2d");
  textCanvas.width = textWidth;
  textCanvas.height = textHeight;

  var metrics = measureTextInDiv(text, font);

  textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);
  textContext.textBaseline = "middle";
  textContext.font = font;
  textContext.fillStyle = fillStyle;
  textContext.fillText(text, (textWidth / 2) - (metrics.width / 2), (textHeight / 2));

  var texture1 = new THREE.Texture(textCanvas);
  texture1.needsUpdate = true;

  var material = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
  material.transparent = true;
  material.side = THREE.FrontSide;

  var geometry = new THREE.PlaneGeometry(width, height);

  return new THREE.Mesh(geometry, material);
}

function getOption(value, defaultValue) {
  if (value === undefined) {
    return defaultValue;
  }
  return value;
}

function getColorOption(color, defaultValue) {
  if (typeof color === "string" && color.indexOf("x") !== -1) {
    return parseInt(color, 16);
  }
  if (color === undefined) {
    return defaultValue;
  }
  return color;
}
