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
  called = false;
  // name of the current state to edit
  state(name) {
    // when creating a new state step is back to 0
    this.step = 0;
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
    if (this.called) {
      this.step += 1;
      this.called = false;
    }
    const resolve = () => {
      try {
        return x.call() == true;
      } catch (error) {
        return x == true;
      }
    };
    if (state.length === this.step) {
      state.push({ whens: [resolve], dos: [] });
    } else {
      const step = state[this.step];
      step.whens.push(resolve);
    }
    return this;
  }
  do(y) {
    const state = this.map.get(this.current);
    if (state.length === 0 || state[this.step].whens.length === 0) {
      throw new Error(`Attempting to map a 'do' with no 'whens' for state: ` + `${this.current}`);
    } else {
      const step = state[this.step];
      // should throw if y is not callable?
      step.dos.push(y);
    }
    this.called = true;
    return this;
  }
  build(defaultState = this.current) {
    const state = this.map.get(this.current);
    if (state.length === 0 || state[this.step].whens.length === 0 || state[this.step].dos.length === 0) {
      throw new Error(`Need to map something! Empty state not allowed: ` + `${this.current}`);
    }
    this.map.state = defaultState;
    return this.map;
  }
}

export { Skin, MachineBuilder };
