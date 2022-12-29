import {
  AnimationMixer,
  Object3D,
  PerspectiveCamera,
  Quaternion,
  Vector3,
} from '../resources/threejs/r146/build/three.module.js';
import { Entity } from './Entity.mjs';
import { GLTFLoader } from '../resources/threejs/r146/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from '../resources/threejs/r146/examples/jsm/utils/SkeletonUtils.js';
import { MachineBuilder, Skin } from './Components.mjs';
import Utils from './UtilsFunctions.mjs';

// our globals
let CAMERA = new PerspectiveCamera();
const PLAYER = new Entity('player');
// resource location
const res = '../resources/models/base-human-male-model.gltf';
// add our input map for player controls
const inputMap = {};

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
    // play our default anim
    const idleAnimAction = mixer.clipAction(animClips[0]).play();
    const walkAnimAction = mixer
      .clipAction(animClips[5])
      .setEffectiveTimeScale(1.4);
    const runAnimAction = mixer.clipAction(animClips[1]);
    // some functions to organize the whens in our machine
    let wasd_notshift_pressed = () => {
      return (
        (inputMap['w'] || inputMap['a'] || inputMap['s'] || inputMap['d']) &&
        !inputMap['shift']
      );
    };
    let wasd_shift_pressed = () => {
      return (
        (inputMap['w'] || inputMap['a'] || inputMap['s'] || inputMap['d']) &&
        inputMap['shift']
      );
    };
    let wasd_released = () => {
      return !(
        inputMap['w'] ||
        inputMap['a'] ||
        inputMap['s'] ||
        inputMap['d']
      );
    };
    let shift_released = () => {
      return !inputMap['shift'];
    };
    // duration for state anim_machine transitions
    const duration = 0.3;
    // defining our state anim_machine for Animation State Handle
    const builder = new MachineBuilder();
    let anim_machine = builder
      /** IDLE STATE **/
      .state('Idle')
      .when(wasd_notshift_pressed) // jump to walkidle
      .do(() => {
        Utils.fadeToAction(walkAnimAction, idleAnimAction, duration);
        anim_machine.state = 'WalkIdle';
      })
      .when(wasd_shift_pressed) // jump to runidle
      .do(() => {
        Utils.fadeToAction(runAnimAction, idleAnimAction, duration);
        anim_machine.state = 'RunIdle';
      })
      /** WALKIDLE STATE **/
      .state('WalkIdle')
      .when(() => {
        // when crossfade finishes
        // when we are not running idleAnim and running walkAnim, we're in the walk state
        return !idleAnimAction.isRunning() && walkAnimAction.isRunning();
      })
      .do(() => {
        anim_machine.state = 'Walk';
      })
      .when(wasd_released) // back to idle
      .do(() => {
        Utils.fadeToAction(idleAnimAction, walkAnimAction, duration);
        anim_machine.state = 'Idle';
      })
      .when(wasd_shift_pressed) // jump to runwalk
      .do(() => {
        Utils.fadeToAction(runAnimAction, walkAnimAction, duration);
        anim_machine.state = 'RunWalk';
      })
      /** WALK STATE **/
      .state('Walk')
      .when(wasd_released) // back to idle
      .do(() => {
        Utils.fadeToAction(idleAnimAction, walkAnimAction, duration);
        anim_machine.state = 'Idle';
      })
      .when(wasd_shift_pressed) // jump to runwalk
      .do(() => {
        Utils.fadeToAction(runAnimAction, walkAnimAction, duration);
        anim_machine.state = 'RunWalk';
      })
      /** RUNIDLE STATE **/
      .state('RunIdle')
      .when(() => {
        // when crossfade finishes
        // when we are not running idleAnim and running runAnim, we're in the run state
        return !idleAnimAction.isRunning() && runAnimAction.isRunning();
      })
      .do(() => {
        anim_machine.state = 'Run';
      })
      .when(wasd_released) // back to idle
      .do(() => {
        Utils.fadeToAction(idleAnimAction, runAnimAction, duration);
        anim_machine.state = 'Idle';
      })
      .when(shift_released) // back to walk
      .do(() => {
        Utils.fadeToAction(walkAnimAction, runAnimAction, duration);
        anim_machine.state = 'Walk';
      })
      /** RUNWALK STATE **/
      .state('RunWalk')
      .when(() => {
        // when crossfade finishes
        // when we are not running walkAnim and running runAnim, we're in the run state
        return !walkAnimAction.isRunning() && runAnimAction.isRunning();
      })
      .do(() => {
        anim_machine.state = 'Run';
      })
      .when(wasd_released) // back to idle
      .do(() => {
        Utils.fadeToAction(idleAnimAction, runAnimAction, duration);
        anim_machine.state = 'Idle';
      })
      .when(shift_released) // back to walk
      .do(() => {
        Utils.fadeToAction(walkAnimAction, runAnimAction, duration);
        anim_machine.state = 'Walk';
      })
      /** RUN STATE **/
      .state('Run')
      .when(wasd_released) // need to check on a special state here, do we go back to idle or do we do a running stop?
      .do(() => {
        Utils.fadeToAction(idleAnimAction, runAnimAction, duration);
        anim_machine.state = 'Idle';
      })
      .when(shift_released) // back to walk
      .do(() => {
        Utils.fadeToAction(walkAnimAction, runAnimAction, duration);
        anim_machine.state = 'Walk';
      })
      .build('Idle');
    // add the rig as a component to our player entity
    PLAYER.addComponent(Skin, modelParent, mixer, anim_machine);
    // add our camera to the scene
    CAMERA = sceneClone.getObjectByName('Camera');
    scene.add(CAMERA);
    // finally add our event listeners once player is loaded
    document.addEventListener('keydown', (e) => {
      e = e || event; // for ie
      inputMap[e.key.toLowerCase()] = e.type == 'keydown';
      // our rotation math
      // const angle = Utils.angleOf(modelParent.position, CAMERA.position);
      // const q = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), angle);
      // console.log('calling')
      // modelParent.quaternion.rotateTowards(q, 0.2);
    });

    document.addEventListener('keyup', (e) => {
      e = e || event; // for ie
      inputMap[e.key.toLowerCase()] = e.type == 'keydown';
    });
  });
};

export { PLAYER, CAMERA };
