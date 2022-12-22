'use strict';
import * as THREE from '../resources/threejs/r146/build/three.module.js';
import { PLAYER, CAMERA } from './PlayerEntity.mjs';

// Globals
// delta time
const clock = new THREE.Clock();
let deltaTime = clock.getDelta();
// create and name our main rendering scene
const mainScene = new THREE.Scene();
mainScene.name = 'Top';
// get our canvas for renderer to render on
const canvas = document.querySelector('#threejs-canvas');

function start() {
  console.log('starting render');
  console.log('start::camera = ' + CAMERA);
  const renderer = new THREE.WebGLRenderer({ canvas });
  // set the pixel ratio for the pixely look
  renderer.setPixelRatio(0.66);
  // set the size of the canvas and let threejs take control of the style
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, true);
  renderer.setAnimationLoop(() => {
    deltaTime = clock.getDelta();
    // mixer.update(deltaTime);
    renderer.render(mainScene, CAMERA);
  });
}

function main() {
  // manager will call on load when all things loaded by gltfloader are done loading
  const manager = new THREE.LoadingManager();
  manager.onLoad = start;
  // we'll get our base camera from the player gltf scene
  PLAYER.createComponents(mainScene, manager);
  // POLICE.creatcomp 
  // CIVILIANS.createcomp

  // old stuff moved to playerentity
  // start loading stuff
  // const gltfloader = new GLTFLoader(manager);
  // gltfloader.load('../resources/models/base-human-male-model.gltf', (gltf) => {
  //   // add an animation tree to our player

  //   // delete me
  //   mixer = new THREE.AnimationMixer(mainScene);
  //   runAction = mixer.clipAction(Object.values(gltf.animations)[1]);
  //   runningStopRightFootAction = mixer.clipAction(
  //     Object.values(gltf.animations)[3]
  //   );
  //   // runAction.timeScale = 1.0;
  //   runningStopRightFootAction.timeScale = 1.2;
  //   runningStopRightFootAction.loop = THREE.LoopOnce;

  //   // add our camera to the top of the scene
  //   camera = sceneClone.getObjectByName('Camera');
  //   mainScene.add(camera);
  // });

  // ways to get current frame
  //   const FRAME_RATE = 24;

  // cosnt animationTime = animationMixer.time;

  // const frameIndex = Math.floor(animationTime*FRAME_RATE);

  const inputMap = {};

  // messing with crossfades atm, need to find a good animation setup for player
  document.addEventListener('keydown', (e) => {
    e = e || event; // for ie
    inputMap[e.key.toLowerCase()] = e.type == 'keydown';

    // old stuff moved to player entity .mjs
    // if (inputMap['w'] == true) {
    //   console.log(runningStopRightFootAction.isRunning());
    //   if (runningStopRightFootAction.isRunning()) {
    //     runAction.reset();
    //     runAction.crossFadeFrom(runningStopRightFootAction, 0.25);
    //   } else {
    //     runAction.reset();
    //     runAction.play();
    //   }
    // } else if (inputMap['s'] == true) {
    //   console.log('wtf');
    //   runningStopRightFootAction.reset();
    //   runningStopRightFootAction.play();
    //   runAction.crossFadeTo(runningStopRightFootAction, 0.25);
    // }
  });

  document.addEventListener('keyup', (e) => {
    e = e || event; // for ie
    inputMap[e.key.toLowerCase()] = e.type == 'keydown';
  });
}

main();
