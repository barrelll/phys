import { EventDispatcher } from '../resources/threejs/r146/build/three.module.js';
import { Skin } from './Components.mjs';
import { Entity } from './Entity.mjs';

const ANIMATION_SYSTEM = {};

ANIMATION_SYSTEM.events = new EventDispatcher();

// delta time and an object with all things that need to be updated in the animation system, PLAYER will always be a part of this
ANIMATION_SYSTEM.update = (deltaTime, params = {}) => {
  for (const property in params) {
    const entity = params[property];
    if (!(entity instanceof Entity)) {
      throw new Error('Object not instance of Entity ANIMATION_SYSTEM');
    } else {
      if (!entity.hasComponent(Skin)) {
        throw new Error(
          'Entity ' + entity.getId() + ' does not have Skin component'
        );
      }
      const skin = entity.getComponent(Skin);
      const curState = skin.machine.state;
      const actions = skin.machine[curState].actions;
      for (const aKey in actions) {
        let action = actions[aKey];
        if (actions[aKey].trigger()) {
          const steps = actions[aKey].steps;
          steps.onBegin(deltaTime).then((resolved) => {
            steps.onProgress(deltaTime).then((resolved) => {
              console.log(resolved);
            });
          });
        }
      }
      skin.update({ deltaTime });
    }
  }
};

export default ANIMATION_SYSTEM;
