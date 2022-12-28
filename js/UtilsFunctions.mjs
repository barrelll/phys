const Utils = {};
// Get the angle of two Object3D's
// the first argument will represent 0,0 on the graph
// so the second argument will be the point from 0,0 we're getting the aTan2() from
// meaning we'll need to subract the first from the last aTan2(_v2 - _v1) tyipcally _v2 our camera, and _v1 our player
// params will be the coords we care about and the order we care about them in
// default to our our flat ground plane
Utils.angleOf = function (_v1, _v2, params = ['x', 'z']) {
  _v2 = _v2.sub(_v1);
  const y = _v2[params[0]];
  const x = _v2[params[1]];
  // typically y is the vertical line but
  // because of how we oriented our geometry x will be y
  // and z will be the horizontal plane x
  return Math.atan2(y, x);
};

Utils.fadeToAction = function (toAction, fromAction, duration) {
  fromAction.reset();
  const fromActionWeight = fromAction.getEffectiveWeight();
  const p_startAt = fromAction.time;
  fromAction.startAt(p_startAt).fadeOut(duration, fromActionWeight, 0).play();

  toAction.reset();
  const toActionWeight = toAction.isRunning()
    ? toAction.getEffectiveWeight()
    : 0;
  const a_startAt = toAction.time;
  toAction.startAt(a_startAt).fadeIn(duration, toActionWeight, 1).play();
};

export default Utils;
