import { EventDispatcher } from '../resources/threejs/r146/build/three.module.js';
import { Skin } from './Components.mjs';
import { Entity } from './Entity.mjs';

const MOTION_SYSTEM = {};

MOTION_SYSTEM.events = new EventDispatcher();

// delta time and an object with all things that need to be updated in the animation system, PLAYER will always be a part of this
MOTION_SYSTEM.update = (deltaTime, params = {}) => {
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
      const curState = skin.machine.get(skin.machine.state);
      if (curState == undefined) {
        throw new Error(`No state named ${skin.machine.state} in ${entity.getId()}`)
      } else {
        curState.forEach((step) => {
        let resolve = true;
        step.whens.forEach((w) => {
          // check each when function and resolve whether we should do the thing
          resolve = resolve && w();
          if (resolve) {
            // doo aaaallll the dooooos 
            step.dos.forEach((d) => {
              d();
            })
          }
        });
      });
      }

      skin.update({ deltaTime });
    }
  }
};

export default MOTION_SYSTEM;
