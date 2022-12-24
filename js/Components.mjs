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

// state machine builder, assumes order of insertion when running
class MachineBuilder {
  map = new Map();
  current = '';
  step = 0;
  // name of the current state to edit
  state(name) {
    // create new state and set the curr key to edit, as the name
    if (!this.map.has(name)) {
      this.map.set(name, new Array());
    }
    this.current = name;
    return this;
  }
  // x is something that can be resolved to a bool
  when(x) {
    const state = this.map.get(this.current);
    const resolve = () => {
      try {
        return x.call() == true;
      } catch (error) {
        return x == true;
      }
    };
    if (state.length === 0) {
      state.push({ whens: [resolve], dos: [] });
    } else {
      const step = state[this.step];
      step.whens.push(resolve);
    }
    return this;
  }
  do(y) {
    const state = this.map.get(this.current);
    if (state.length === 0) {
      // should throw an error here? whens should be mapped to dos, and vice versa
      // state.push({ whens: [], dos: [] });
    } else {
      const step = state[this.step];
      // should throw if y is not callable?
      step.dos.push(y);
    }
    return this;
  }
  build(defaultState = this.current) {
    this.map.state = defaultState;
    return this.map;
  }
}

export { Skin, MachineBuilder };
