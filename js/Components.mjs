import { AnimationMixer } from '../resources/threejs/r146/build/three.module.js';

class Velocity {
  constructor(_entity, _min, _cur, _max, _inc) {
    this.parentEntity = _entity;
    this.minVelocity = _min;
    this.currVelocity = _cur;
    this.maxVelocity = _max;
    this.increaseBy = _inc;
  }

  update(params = {}) {}
}

class Skin {
  constructor(_entity, _model, _clips) {
    this.parentEntity = _entity;
    this.model = _model;
    this.animMixer = new AnimationMixer(this.model);
    this.actions = {};
    for (let clip of _clips) {
      const _action = this.animMixer.clipAction(clip);
      this.actions[clip.name] = _action;
    }
  }

  update(params = {}) {
    if (params.deltaTime) {
      this.animMixer.update(params.deltaTime);
    }
  }
}

class AnimationTree {
  constructor(_entity, params = {}) {
    this.parentEntity = _entity;
    if (params.tree) {
      this.tree = params.tree;
    }
  }

  update(params = {}) {}
}

export { AnimationTree, Skin, Velocity };
