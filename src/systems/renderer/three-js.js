var THREE = require("three");
var makeMesh = require("../../make-mesh");

var renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setClearColor(0x7609A2, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);


var oldCanvas = document.getElementById("canvas");
oldCanvas.parentNode.removeChild(oldCanvas);

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  var scene = new THREE.Scene();

  //addLighting(scene);

  game.entities.onRemoveComponent("model", function(entity, component, model) {
    if (model.mesh !== undefined) {
      if (model.mesh.target) {
        scene.remove(model.mesh.target);
      }
      scene.remove(model.mesh);
    }
  });
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var model = game.entities.getComponent(entity, "model");
    if (model.needsUpdate && model.mesh !== undefined) {
      model.needsUpdate = false;
      if (model.mesh.target) {
        scene.remove(model.mesh.target);
      }
      scene.remove(model.mesh);
      delete model.mesh;
    }
    if (model.mesh !== undefined) {
      return;
    }
    model.mesh = makeMesh(model.name, model.options);

    model.mesh.castShadow = model.castShadow;
    //console.log("model.mesh.castShadow", model.mesh.castShadow);
    model.mesh.receiveShadow = model.receiveShadow;
    //console.log("model.mesh.receiveShadow", model.mesh.receiveShadow);

    scene.add(model.mesh);

    // FIXME: this is kinda gross
    // if (model.mesh.target) {
    //   scene.add(model.mesh.target);
    // }

  }, "model");

  game.entities.registerSearch("updateModelPosition", ["model", "position"]);
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var model = game.entities.getComponent(entity, "model");
    var position = game.entities.getComponent(entity, "position");
    model.mesh.position.x = position.x;
    model.mesh.position.y = position.y;
    model.mesh.position.z = position.z;
  }, "updateModelPosition");

  game.entities.registerSearch("updateModelQuaternion", ["model", "quaternion"]);
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var model = game.entities.getComponent(entity, "model");
    var quaternion = game.entities.getComponent(entity, "quaternion");
    model.mesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
  }, "updateModelQuaternion");

  ecs.add(function(entities, elapsed) { // eslint-disable-line no-unused-vars
    var cameras = game.entities.find("camera");
    if (cameras.length > 0) {
      var camera = cameras[0];
      var model = game.entities.getComponent(camera, "model");
      renderer.render(scene, model.mesh);
      resizeRenderer(camera);
      window.addEventListener("optimizedResize", resizeRenderer(camera));


    }
  });


};


// https://developer.mozilla.org/en-US/docs/Web/Events/resize
function throttleEvent(type, name, obj) {
  obj = obj || window;
  var running = false;
  var func = function() {
    if (running) { return; }
    running = true;
    requestAnimationFrame(function() {
      obj.dispatchEvent(new CustomEvent(name));
      running = false;
    });
  };
  obj.addEventListener(type, func);
}

throttleEvent("resize", "optimizedResize");


function resizeRenderer(camera) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  // update the camera
  camera.aspect	= window.innerWidth / window.innerHeight;
  //camera.updateProjectionMatrix(); // camera.updateProjectionMatrix is not a function ?
}
