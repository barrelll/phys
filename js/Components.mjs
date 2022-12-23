import {
  AnimationMixer,
  EventDispatcher,
  MixOperation,
} from '../resources/threejs/r146/build/three.module.js';
import { Entity } from './Entity.mjs';

class Component extends EventDispatcher {
  constructor(_entity) {
    super();
    if (_entity instanceof Entity) {
      this.parentEntity = _entity;
    } else {
      throw new Error('Parent entity not of type Entity');
    }
  }
}

class Velocity extends Component {
  constructor(_entity, _min, _cur, _max, _inc) {
    super(_entity);
    this.minVelocity = _min;
    this.currVelocity = _cur;
    this.maxVelocity = _max;
    this.increaseBy = _inc;
  }

  update(params = {}) {}
}

class Skin extends Component {
  constructor(_entity, _model, _animMixer, _machine) {
    super(_entity);
    // error handling, need specific types
    if (_model.isObject3D) {
      this.model = _model;
    } else {
      throw new Error(
        'Model is not of type Object3d, component: ' +
          this.parentEntity.getId() +
          ' needs an Object3d'
      );
    }

    // error handling of anim mixer
    if (_animMixer instanceof AnimationMixer) {
      this.animMixer = _animMixer;
    } else {
      throw new Error(
        'animMixer is not of type AnimationMixer, component: ' +
          this.parentEntity.getId() +
          ' needs an AnimationMixer'
      );
    }
    this.machine = _machine; // our animation machine, will handle the states of our animations
    // add functionality to our skin based on our _machine
    // start the machine
    const state = _machine.state;
    _machine[state].start();
  }

  update(params = {}) {
    if (params.deltaTime) {
      this.animMixer.update(params.deltaTime);
    }
  }
}

export { Skin, Velocity };
