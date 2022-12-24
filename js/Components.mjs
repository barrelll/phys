import {
  AnimationMixer,
  EventDispatcher,
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
    const state = _machine.state;
    this.machine = _machine; // our animation machine, will handle the states of our animations
    // start the default state
    this.machine[state].animAction.play();
  }


  update(params = {}) {
    if (params.deltaTime) {
      this.animMixer.update(params.deltaTime);
    }
  }
}

export { Skin };
