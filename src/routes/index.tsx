import {
  EquirectangularReflectionMapping,
  Fog,
  FogExp2,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PointLight,
  RepeatWrapping,
  Scene,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { component$, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  useVisibleTask$(({ cleanup }) => {
    const renderer = new WebGLRenderer({
      antialias: true,
    });
    document.body.prepend(renderer.domElement);

    // default bg canvas color //
    renderer.setClearColor(0x11151c);

    //  use device aspect ratio //
    renderer.setPixelRatio(window.devicePixelRatio);

    // set size of canvas within window //
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new Scene();

    const hdrEquirect = new RGBELoader()
      .setPath('/assets/mask/')
      .load('gradient.hdr', function () {
        hdrEquirect.mapping = EquirectangularReflectionMapping;
      });

    scene.environment = hdrEquirect;
    scene.fog = new Fog(0x11151c, 1, 100);
    scene.fog = new FogExp2(0x11151c, 0.14);

    let theta1 = 0;

    const camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 10;
    camera.position.y = 0.2;

    const pointlight = new PointLight(0x85ccb8, 2, 20);
    pointlight.position.set(0, 3, 2);
    scene.add(pointlight);

    const pointlight2 = new PointLight(0x85ccb8, 2, 20);
    pointlight2.position.set(0, 3, 2);
    scene.add(pointlight2);

    const textureLoader = new TextureLoader();

    const surf_imp = textureLoader.load('/assets/textures/face.jpg');
    surf_imp.wrapT = RepeatWrapping;
    surf_imp.wrapS = RepeatWrapping;

    const hand_mat = new MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 1,
      metalness: 1,
      roughnessMap: surf_imp,
      transparent: true,
      opacity: 1,
    });

    const loaderFBX1 = new FBXLoader().setPath('/assets/mask/');
    loaderFBX1.load('mask.fbx', function (object) {
      const model = object.children[0];
      model.position.set(0, -0.2, 0);
      model.scale.setScalar(2);
      (model as any).material = hand_mat;
      scene.add(model);
    });

    // POST PROCESSING
    const renderScene = new RenderPass(scene, camera);

    const afterimagePass = new AfterimagePass();

    const bloomparams = {
      exposure: 1,
      bloomStrength: 1,
      bloomThreshold: 0.1,
      bloomRadius: 1,
    };

    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85,
    );
    bloomPass.threshold = bloomparams.bloomThreshold;
    bloomPass.strength = bloomparams.bloomStrength;
    bloomPass.radius = bloomparams.bloomRadius;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(afterimagePass);
    composer.addPass(bloomPass);

    // RESIZE
    window.addEventListener('resize', onWindowResize);

    const update = function () {
      theta1 += 0.007;

      camera.position.x = Math.sin(theta1) * 2;
      camera.position.y = 2.5 * Math.cos(theta1) + 1;

      pointlight.position.x = Math.sin(theta1 + 1) * 11;
      pointlight.position.z = Math.cos(theta1 + 1) * 11;
      pointlight.position.y = 2 * Math.cos(theta1 - 3) + 3;

      pointlight2.position.x = -Math.sin(theta1 + 1) * 11;
      pointlight2.position.z = -Math.cos(theta1 + 1) * 11;
      pointlight2.position.y = 2 * -Math.cos(theta1 - 3) - 6;

      camera.lookAt(0, 0, 0);
    };

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      update();
      composer.render();
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    cleanup(() => {
      window.removeEventListener('resize', () => {});
      renderer.domElement.remove();
      renderer.renderLists.dispose();
      renderer.dispose();
    });
  });

  return (
    <>
      <section class="relative flex h-[calc(100vh-92px)] w-full flex-col">
        <div class="absolute top-8 flex w-full flex-col items-center justify-center">
          <h1 class="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl xl:text-6xl">
            Muhammad Furqan
          </h1>
        </div>
        <div class="absolute bottom-14 flex w-full flex-col items-center justify-center">
          <h3 class="mb-4 max-w-2xl text-3xl font-bold leading-none tracking-tight text-white md:text-5xl xl:text-5xl">
            Full-Stack Developer
          </h3>
          <h5 class="mb-4 max-w-2xl text-xs font-bold leading-none tracking-tight text-white md:text-2xl xl:text-2xl">
            Transforming Ideas into Digital Experiences
          </h5>
        </div>
      </section>
    </>
  );
});

const title = 'Muhammad Furqan | Full-Stack Developer';
const description =
  'Welcome to the online portfolio of Muhammad Furqan, a skilled and passionate web developer. Explore a collection of his projects, demonstrating his expertise in front-end and back-end development, along with his commitment to delivering user-friendly and visually appealing websites.';
export const head: DocumentHead = {
  title,
  meta: [
    {
      name: 'description',
      content: description,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
  ],
};
