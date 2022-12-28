import {
  AnimationMixer,
  Object3D,
  PerspectiveCamera,
} from '../resources/threejs/r146/build/three.module.js';
import { Entity } from './Entity.mjs';
import { GLTFLoader } from '../resources/threejs/r146/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from '../resources/threejs/r146/examples/jsm/utils/SkeletonUtils.js';
import { Skin } from './Components.mjs';
import { LoopRepeat } from '../resources/threejs/r146/build/three.module.js';
import Utils from './UtilsFunctions.mjs';

// add our input map for player controls
const inputMap = {};

// our globals
let CAMERA = new PerspectiveCamera();
const PLAYER = new Entity('player');
// resource location
const res = '../resources/models/base-human-male-model.gltf';

PLAYER.createComponents = (scene, manager) => {
  const gltfloader = new GLTFLoader(manager);
  gltfloader.load(res, (gltf) => {
    console.log(gltf);
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
    const walkAnimAction = mixer
      .clipAction(animClips[5])
      .setEffectiveTimeScale(1.2);
    const runAnimAction = mixer.clipAction(animClips[1]);
    // defining our state machine for Animation State Handle
    let pressonce = true;
    document.addEventListener('keydown', (e) => {
      e = e || event; // for ie
      inputMap[e.key.toLowerCase()] = e.type == 'keydown';
      if (inputMap['w'] && pressonce) {
        Utils.fadeToAction(walkAnimAction, idleAnimAction, 0.3);
        pressonce = false;
      }
    });
    document.addEventListener('keyup', (e) => {
      e = e || event; // for ie
      inputMap[e.key.toLowerCase()] = e.type == 'keydown';
      Utils.fadeToAction(idleAnimAction, walkAnimAction, 0.3);
      pressonce = true;
    });
    idleAnimAction.play();
    walkAnimAction.loop = LoopRepeat;
    let machine = {};
    // add the rig as a component to our player entity
    PLAYER.addComponent(Skin, modelParent, mixer, machine);
    // add our camera to the scene for now
    CAMERA = sceneClone.getObjectByName('Camera');
    scene.add(CAMERA);
  });
};

export { PLAYER, CAMERA };
