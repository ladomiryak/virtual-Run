import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  300
);
const renderer = new THREE.WebGLRenderer({ alpha: true });
const fbxLoader = new FBXLoader();

let light;
let mixer;
let animationActions = [];

camera.position.set(1, 1, 2);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaOutput = true;

document.body.appendChild(renderer.domElement);

// light

light = new THREE.HemisphereLight(0xffffff);
light.position.set(-1, 200, 2);
scene.add(light);

light = new THREE.DirectionalLight(0xffffff);
light.castShadow = true;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 100;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.position.set(10, 12, 1);
light.intensity = 1;
scene.add(light);

// load model
fbxLoader.load("./assets/models/girl.fbx", (object) => {
  object.scale.set(0.01, 0.01, 0.01);
  mixer = new THREE.AnimationMixer(object);
  object.castShadow = true;
  object.rotateY(0.85);
  object.position.x = -0.5;
  object.position.y = 0.1;

  object.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(object);

  // add an animation from another file
  fbxLoader.load("../assets/models/running.fbx", (object) => {
    let animationAction = mixer.clipAction(object.animations[0]);
    animationActions.push(animationAction);
    animationAction.play();
  });
});

// add plane
const planeGeometry = new THREE.CircleGeometry(10, 10);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.rotateX(-Math.PI / 2);
plane.position.y = 0.1;
plane.receiveShadow = true;
plane.position.z = -2;
scene.add(plane);

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const clock = new THREE.Clock();

var animate = function () {
  requestAnimationFrame(animate);

  if (mixer) mixer.update(clock.getDelta());

  render();
};

function render() {
  renderer.render(scene, camera);
}
animate();
