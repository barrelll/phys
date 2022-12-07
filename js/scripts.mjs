'use strict';
import * as THREE from '../resources/threejs/r146/build/three.module.js';
import { Entity } from './Entity.mjs';
import { GLTFLoader } from '../resources/threejs/r146/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from '../resources/threejs/r146/examples/jsm/utils/SkeletonUtils.js';
import { Velocity, Skin, AnimationTree } from './Components.mjs';
import Utils from './UtilsFunctions.mjs';

// Globals
// delta time
const clock = new THREE.Clock();
let deltaTime = clock.getDelta();
// our future camera :3
let camera;
// create and name our main rendering scene
const mainScene = new THREE.Scene();
mainScene.name = 'Top';
// get our canvas for renderer to render on
const canvas = document.querySelector('#threejs-canvas');

function main() {
  // create our player entity
  const player = new Entity('player');
  player.addComponent(Velocity, 0.0, 0.0, 0.06, 0.001);

  // manager will call on load when all things loaded by gltfloader are done loading
  const manager = new THREE.LoadingManager();
  manager.onLoad = start;

  // start loading stuff
  const gltfloader = new GLTFLoader(manager);
  gltfloader.load('../resources/models/test-model-withcamera2.gltf', (gltf) => {
    // get a copy of our models
    const sceneClone = SkeletonUtils.clone(gltf.scene);

    // get male model from gltf, it needs a parent to help organize animations
    // we'll use an object3d for parenting and transforms
    const maleModel = sceneClone.getObjectByName('human-male');
    const modelParent = new THREE.Object3D();
    modelParent.add(maleModel);

    //temp add it to the scene here
    mainScene.add(modelParent);
    // add the rig as a component to our player entity
    player.addComponent(Skin, modelParent, gltf.animations);
    // add an animation tree to our player
    player.addComponent(AnimationTree, {
      tree: {
        IdleAnim: {
          WalkAnim: {
            RunAnim: {
              RunStopLAnim: null,
              RunStopRAnim: null,
            },
          },
        },
      },
    });

    // add our camera to the top of the scene
    camera = sceneClone.getObjectByName('Camera');
    mainScene.add(camera);
  });

  function start() {
    console.log('starting render');
    const renderer = new THREE.WebGLRenderer({ canvas });
    // set the pixel ratio for the pixely look
    renderer.setPixelRatio(0.66);
    // set the size of the canvas and let threejs take control of the style
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, true);
    // ANIMATION LOOP where all the logic happens!
    Utils.angleOf(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 3));
    renderer.setAnimationLoop(() => {
      deltaTime = clock.getDelta;
      renderer.render(mainScene, camera);
    });
  }
}

const inputMap = {};

document.addEventListener('keydown', (e) => {
  e = e || event // for ie
  inputMap[e.key.toLowerCase()] = e.type == 'keydown';
  console.log(inputMap);
});

document.addEventListener('keyup', (e) => {
  e = e || event // for ie
  inputMap[e.key.toLowerCase()] = e.type == 'keydown';
  console.log(inputMap);
});

main();
