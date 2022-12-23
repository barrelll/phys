import { Skin } from './Components.mjs';
import { Entity } from './Entity.mjs';

const ANIMATION_SYSTEM = {};

// delta time and an object with all things that need to be updated in the animation system, PLAYER will always be a part of this
ANIMATION_SYSTEM.update = (deltaTime, params = {}) => {
  for (const property in params) {
    if (!property instanceof Entity) {
      throw new Error('Object not instance of Entity ANIMATION_SYSTEM');
    } else {
      if (!property.hasComponent(Skin)) {
        throw new Error(
          'Entity ' + property.id + ' does not have Skin component'
        );
      }
    }
  }
};

export default ANIMATION_SYSTEM;
