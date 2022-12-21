'use strict';
import * as THREE from '../resources/threejs/r146/build/three.module.js';
import { Entity } from './Entity.mjs';
import { GLTFLoader } from '../resources/threejs/r146/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from '../resources/threejs/r146/examples/jsm/utils/SkeletonUtils.js';
import { Velocity, Skin, AnimationTree } from './Components.mjs';

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
  let mixer;
  let runAction;
  let runningStopRightFootAction;
  // create our player entity
  const player = new Entity('player');
  player.addComponent(Velocity, 0.0, 0.0, 0.06, 0.001);

  // manager will call on load when all things loaded by gltfloader are done loading
  const manager = new THREE.LoadingManager();
  manager.onLoad = start;

  // start loading stuff
  const gltfloader = new GLTFLoader(manager);
  gltfloader.load('../resources/models/base-human-male-model.gltf', (gltf) => {
    console.log(gltf);
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

    // delete me
    mixer = new THREE.AnimationMixer(mainScene);
    runAction = mixer.clipAction(Object.values(gltf.animations)[1]);
    runningStopRightFootAction = mixer.clipAction(
      Object.values(gltf.animations)[3]
    );
    // runAction.timeScale = 1.0;
    runningStopRightFootAction.timeScale = 1.2;
    runningStopRightFootAction.loop = THREE.LoopOnce;

    // add our camera to the top of the scene
    camera = sceneClone.getObjectByName('Camera');
    mainScene.add(camera);
  });

  // ways to get current frame
  //   const FRAME_RATE = 24;

  // cosnt animationTime = animationMixer.time;

  // const frameIndex = Math.floor(animationTime*FRAME_RATE);

  const inputMap = {};

  const FRAME_RATE = 24;

  // messing with crossfades atm, need to find a good animation setup for player
  document.addEventListener('keydown', (e) => {
    e = e || event; // for ie
    inputMap[e.key.toLowerCase()] = e.type == 'keydown';
    if (inputMap['w'] == true) {
      console.log(runningStopRightFootAction.isRunning());
      if (runningStopRightFootAction.isRunning()) {
        runAction.reset();
        runAction.crossFadeFrom(runningStopRightFootAction, 0.25);
      } else {
        runAction.reset();
        runAction.play();
      }
    } else if (inputMap['s'] == true) {
      console.log('wtf');
      runningStopRightFootAction.reset();
      runningStopRightFootAction.play();
      runAction.crossFadeTo(runningStopRightFootAction, 0.25);
    }
  });

  document.addEventListener('keyup', (e) => {
    e = e || event; // for ie
    inputMap[e.key.toLowerCase()] = e.type == 'keydown';
  });

  function start() {
    console.log('starting render');
    const renderer = new THREE.WebGLRenderer({ canvas });
    // set the pixel ratio for the pixely look
    renderer.setPixelRatio(0.66);
    // set the size of the canvas and let threejs take control of the style
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, true);
    renderer.setAnimationLoop(() => {
      deltaTime = clock.getDelta();
      // const frameIndex = Math.floor(mixer.time * FRAME_RATE) % FRAME_RATE;
      mixer.update(deltaTime);
      renderer.render(mainScene, camera);
    });
  }
}

main();
