import { $ } from '@wdio/globals';
import * as THREE from '../../resources/threejs/r146/build/three.module.js';
import { GLTFLoader } from '../../resources/threejs/r146/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from '../../resources/threejs/r146/examples/jsm/utils/SkeletonUtils.js';
import '../components/renderRootComponent.js';

describe('Player controls', () => {
  let gltf;
  let sceneClone;
  let parent;
  let renderCanvas;
  let renderer;
  let scene;
  let camera;

  before(() => {
    const gltfloader = new GLTFLoader();
    gltfloader.load(
      '../resources/models/test-model-withcamera2.gltf',
      (_gltf) => {
        gltf = _gltf;
        sceneClone = SkeletonUtils.clone(gltf.scene);
      }
    );
  });

  beforeEach(async () => {
    parent = document.createElement('layer-controls-render-root');
    document.body.appendChild(parent);
    await $('<render-root />');
    renderCanvas = parent.getCanvas();
    renderer = new THREE.WebGLRenderer({ canvas: renderCanvas });
    scene = new THREE.Scene();
    camera = sceneClone.getObjectByName('Camera');
  });

  it('Player should move in direction of w', async () => {
    const maleModel = sceneClone.getObjectByName('human-male');
    const modelParent = new THREE.Object3D();
    modelParent.add(maleModel);
    scene.add(modelParent);
    scene.add(camera);

    const inputMap = { w: true };
    renderer.setPixelRatio(0.66);
    renderer.setSize(renderCanvas.clientWidth, renderCanvas.clientHeight, true);
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  });

  afterEach(() => {
    parent.remove();
  });
});
