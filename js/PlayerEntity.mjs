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
    // const runAnimAction = mixer.clipAction(animClips[1]);
    console.log(gltf);
    // defining our state machine for Animation State Handle
    let machine = {
      initialState: 'Idle',
      currentState: initialState,
      Idle: {
        transitions: {
          ToWalk: {
            target: 'Walk',
            action() {
              currentState = 'ToWalk';
              console.log(currentState)
              idleAnimAction.crossFadeTo(walkAnimAction, time);
            },
          },
        },
      },
      Walk: {
        transitions: {
          ToIdle: {
            target: 'Idle',
            action() {
              walkAnimAction.crossFadeTo(idleAnimAction, 0.25);
            },
          },
        },
      },
    };
    machine.Idle.transitions.ToWalk.action();
    // create our animation tree handle for our Skin component
    PLAYER.addComponent(AnimationStateHandle, machine);
    // add the rig as a component to our player entity
    PLAYER.addComponent(Skin, modelParent, mixer);
    // add our camera to the scene for now
    CAMERA = sceneClone.getObjectByName('Camera');
    scene.add(CAMERA);
  });
};

export { PLAYER, CAMERA };
