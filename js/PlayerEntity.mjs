import {
  AnimationMixer,
  Object3D,
  PerspectiveCamera,
} from '../resources/threejs/r146/build/three.module.js';
import { Entity } from './Entity.mjs';
import { GLTFLoader } from '../resources/threejs/r146/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from '../resources/threejs/r146/examples/jsm/utils/SkeletonUtils.js';
import { Skin } from './Components.mjs';

// add our input map for player controls
const inputMap = {};

document.addEventListener('keydown', (e) => {
  e = e || event; // for ie
  inputMap[e.key.toLowerCase()] = e.type == 'keydown';
});

document.addEventListener('keyup', (e) => {
  e = e || event; // for ie
  inputMap[e.key.toLowerCase()] = e.type == 'keydown';
});

// our globals
let CAMERA = new PerspectiveCamera();
const PLAYER = new Entity('player');
// resource location
const res = '../resources/models/base-human-male-model.gltf';

PLAYER.createComponents = (scene, manager) => {
  const gltfloader = new GLTFLoader(manager);
  gltfloader.load(res, (gltf) => {
    // get a copy of our models
    const sceneClone = SkeletonUtils.clone(gltf.scene);
    // get male model from gltf, it needs a parent to help organize animations
    // we'll use an object3d for parenting and transforms
    const maleModel = sceneClone.getObjectByName('human-male');
    const modelParent = new Object3D();
    modelParent.add(maleModel);
    // add it to the scene here
    scene.add(modelParent);
    // get our animation info here
    const mixer = new AnimationMixer(scene);
    const animClips = Object.values(gltf.animations);
    const idleAnimAction = mixer.clipAction(animClips[0]);
    const walkAnimAction = mixer.clipAction(animClips[5]);
    const runAnimAction = mixer.clipAction(animClips[1]);
    // defining our state machine for Animation State Handle
    const startState = 'Idle';
    const machine = {
      state: startState,
      Idle: {
        animAction: idleAnimAction,
        actions: {
          CrossFade: {
            duration: 0.3, // time for crossfade
            timer: 0.0,
            target: 'Walk', // target to change state to
            settings: {
              stepsPlayOnce: true,
            },
            trigger() {
              // trigger will return true when the conditions for action to happen apply
              return (
                inputMap['w'] || inputMap['a'] || inputMap['s'] || inputMap['d']
              );
            },
            steps: {
              onBegin(deltaTime) {
                // functionality of our action
                return new Promise((resolve) => {
                  if (!idleAnimAction.isRunning()) {
                    idleAnimAction.play();
                  }
                  resolve('onProgress');
                });
              },
              onProgress(deltaTime) {
                // functionality of our action
                return new Promise((resolve) => {
                  const crossfade =  machine.Idle.actions.CrossFade;
                  const duration = crossfade.duration;
                  crossfade.timer += deltaTime;
                  walkAnimAction.play();
                  idleAnimAction.crossFadeTo(walkAnimAction, duration);
                  if (!crossfade.trigger()) {
                    resolve('onAbort');
                  } else if(crossfade.timer >= crossfade.duration) {
                    // reset timer
                    crossfade.timer = 0.0;
                    resolve('onEnd');
                  }
                  // resolve('onAbort');
                });
              },
              onAbort(deltaTime) {},
              onEnd(deltaTime) {
                return new Promise((resolve) => {
                  console.log('onEnd: ' + data);
                  idleAnimAction.stop();
                  resolve();
                });
              },
            },
          },
        },
      },
      Walk: {
        actions: {
          CrossFade: {
            duration: 0.25, // time for crossfade
            target: 'Idle', // target to change state to
            trigger() {
              // trigger will return true when the conditions for action to happen apply
              return !(
                inputMap['w'] ||
                inputMap['a'] ||
                inputMap['s'] ||
                inputMap['d']
              );
            },
            steps: {
              onBegin(data) {
                // functionality of our action
                idleAnimAction.play();
              },
              onProgress(data) {
                // functionality of our action
                idleAnimAction.crossFadeTo(walkAnimAction, this.duration);
              },
              onAbort(data) {},
              onEnd(data) {
                idleAnimAction.stop();
              },
            },
          },
        },
      },
    };
    // add the rig as a component to our player entity
    PLAYER.addComponent(Skin, modelParent, mixer, machine);
    // add our camera to the scene for now
    CAMERA = sceneClone.getObjectByName('Camera');
    scene.add(CAMERA);
  });
};

export { PLAYER, CAMERA };
