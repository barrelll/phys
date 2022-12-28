'use strict';
import * as THREE from '../resources/threejs/r146/build/three.module.js';
import MOTION_SYSTEM from './MotionSystem.mjs';
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
  const renderer = new THREE.WebGLRenderer({ canvas });
  // set the pixel ratio for the pixely look
  renderer.setPixelRatio(0.66);
  // set the size of the canvas and let threejs take control of the style
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, true);
  renderer.setAnimationLoop(() => {
    deltaTime = clock.getDelta();
    MOTION_SYSTEM.update(deltaTime, { PLAYER });
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

  // ways to get current frame
  //   const FRAME_RATE = 24;

  // cosnt animationTime = animationMixer.time;

  // const frameIndex = Math.floor(animationTime*FRAME_RATE);
}

main();
