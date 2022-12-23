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
  constructor(_entity, _model, _animMixer) {
    super(_entity);
    // error handling, need specific types
    this.crossFadeUpdate = false;
    if (_model.isObject3D) {
      this.model = _model;
    } else {
      throw new Error(
        'Model is not of type Object3d, component: ' +
          this.parentEntity.getId() +
          ' needs an Object3d'
      );
    }
    if (_animMixer instanceof AnimationMixer) {
      _animMixer.addEventListener('startCrossFade', (data) => {
        this.endTime = data.end;
        this.crossFadeUpdate = true;
      });
      _animMixer.addEventListener('endCrossFade', (data) => {
        this.parentEntity.getComponent(AnimationStateHandle).transExit('Idle')
        console.log('exited idle');
        this.crossFadeUpdate = false;
      });
      this.animMixer = _animMixer;
    } else {
      throw new Error(
        'Mixer is not of type AnimationMixer, component: ' +
          this.parentEntity.getId() +
          ' needs an AnimationMixer'
      );
    }
    // Skin assumes we have an Animation Tree
    let stateHandler = this.parentEntity.getComponent(AnimationStateHandle);
    if (!stateHandler) {
      throw new Error(
        'Skin assumes we have an AnimationStateHandle, component: ' +
          this.parentEntity.getId() +
          ' needs an AnimationStateHandle'
      );
    }
    stateHandler.start();
  }

  update(params = {}) {
    if (this.crossFadeUpdate) {
      if (this.animMixer.time > this.endTime) {
        this.animMixer.dispatchEvent({ type: 'endCrossFade' });
      }
    }

    if (params.deltaTime) {
      this.animMixer.update(params.deltaTime);
    }
  }
}

class AnimationStateHandle extends Component {
  constructor(_entity, _machine) {
    super(_entity);
    this.addEventListener('finished', (action) => {
      console.log(action);
    });
    this.machine = (() => {
      const ret = {
        state: _machine.initialState,
        start() {
          _machine[this.state].actions.OnEnter();
        },
        transEnter(currentState, event) {
          const currStateDef = _machine[currentState];
          const desTransition = currStateDef.transitions[event];
          const toState = desTransition.target;
          const desStateDef = _machine[toState];

          desTransition.action();
          desStateDef.actions.OnEnter();

          this.state = toState;
          return this.state;
        },
        transExit(state) {
          const prevState = _machine[state]
          prevState.actions.OnExit();
        },
      };
      return ret;
    })();
  }

  update(params = {}) {}

  start() {
    this.machine.start();
  }

  transEnter(event) {
    this.machine.transEnter(this.machine.state, event);
  }

  transExit(state) {
    this.machine.transExit(state);
  }
}

export { AnimationStateHandle, Skin, Velocity };
