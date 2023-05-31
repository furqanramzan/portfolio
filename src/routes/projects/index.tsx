import {
  AmbientLight,
  BoxGeometry,
  Color,
  DepthTexture,
  DirectionalLight,
  DoubleSide,
  FogExp2,
  InstancedMesh,
  Matrix4,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  Vector2,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three';
import { BsArrowUpRightCircleFill } from '@qwikest/icons/bootstrap';
import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  useVisibleTask$(({ cleanup }) => {
    const renderer = new WebGLRenderer({});
    const scene = new Scene();
    const camera = new PerspectiveCamera(100, 2, 10, 2000);
    const controls = new OrbitControls(camera, renderer.domElement);
    window.addEventListener('resize', () => {
      const { clientWidth, clientHeight } = renderer.domElement;
      renderer.setSize(clientWidth, clientHeight, false);
      renderer.setPixelRatio(window.devicePixelRatio);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    });
    document.body.prepend(renderer.domElement);
    window.dispatchEvent(new Event('resize'));

    //// Setup

    camera.position.set(400, 400, 400);
    scene.background = new Color('black');
    scene.fog = new FogExp2('black', 0.0015);
    scene.add(new AmbientLight('white', 0.5));
    controls.autoRotate = true;
    controls.autoRotateSpeed = -2;
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2.1;

    const light0 = new DirectionalLight('white', 1);
    light0.position.set(1, 1, 0);
    scene.add(light0);

    //// Make Meshes
    const tex0 = new TextureLoader().load('/assets/textures/building.jpeg');
    const nInst = 10000;
    const mesh = new InstancedMesh(
      new BoxGeometry(1, 1, 1).translate(0, 0.5, 0),
      new MeshPhongMaterial({
        map: tex0,
        alphaMap: tex0,
        alphaTest: 0.5,
        side: DoubleSide,
      }),
      nInst,
    );
    for (let i = 0; i < nInst; ++i) {
      const scaleBase = 10 + Math.random() * 20;
      const scaleHeight = 1 + (i / nInst) * 300.0;
      const x = Math.random() * 4000 - 2000;
      const z = Math.random() * 4000 - 2000;
      mesh.setMatrixAt(
        i,
        new Matrix4()
          .makeTranslation(x, 0, z)
          .multiply(new Matrix4().makeScale(scaleBase, scaleHeight, scaleBase)),
      );
    }
    mesh.instanceMatrix.needsUpdate = true;
    scene.add(mesh);

    //// Make RenderTarget

    const drawingBufferSize = renderer.getDrawingBufferSize(new Vector2());
    const depthTexture = new DepthTexture(
      drawingBufferSize.x,
      drawingBufferSize.y,
    );
    const renderTarget = new WebGLRenderTarget(
      drawingBufferSize.x,
      drawingBufferSize.y,
      { depthTexture },
    );

    window.addEventListener('resize', () => {
      const { x, y } = renderer.getDrawingBufferSize(new Vector2());
      renderTarget.setSize(x, y);
    });

    //// Post Processing Ground Fog

    const composer = new EffectComposer(renderer);
    composer.addPass(
      new ShaderPass(
        {
          uniforms: {
            cameraNear: { value: camera.near },
            cameraFar: { value: camera.far },
            tDiffuse: { value: null },
            tDepth: { value: null },
            fogColor: { value: scene.background },
            projectionMatrixInverse: { value: camera.projectionMatrixInverse },
            viewMatrixInverse: { value: camera.matrixWorld },
          },
          vertexShader: `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
          fragmentShader: `
    #include <packing>
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform sampler2D tDepth;
    uniform float cameraNear;
    uniform float cameraFar;
    uniform mat4 projectionMatrixInverse;
    uniform mat4 viewMatrixInverse;
    uniform vec3 fogColor;

    // see https://threejs.org/examples/webgl_depth_texture.html
    float readDepth( sampler2D depthSampler, vec2 coord ) {
        float fragCoordZ = texture2D( depthSampler, coord ).x;
        float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
        return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
    }

    // see https://stackoverflow.com/questions/32227283/getting-world-position-from-depth-buffer-value
    // this is supposed to get the world position from the depth buffer
    vec3 WorldPosFromDepth(float depth, vec2 uv) {
        float z = depth * 2.0 - 1.0;
        vec4 clipSpacePosition = vec4(uv * 2.0 - 1.0, z, 1.0);
        vec4 viewSpacePosition = projectionMatrixInverse * clipSpacePosition;
        // Perspective division
        viewSpacePosition /= viewSpacePosition.w;
        vec4 worldSpacePosition = viewMatrixInverse * viewSpacePosition;
        return worldSpacePosition.xyz;
    }

    void main() {
        vec3 world = WorldPosFromDepth( texture( tDepth, vUv ).x, vUv );
        vec4 texel = texture( tDiffuse, vUv );
        gl_FragColor.rgb = mix( fogColor,
            texel.rgb * world / 50.0, // tint
            smoothstep(0.0, 150.0, world.y) ); // altitude 150
        gl_FragColor.a = texel.a; 
    }`,
        },
        'stubbed',
      ),
    );

    //// Render

    renderer.setAnimationLoop((t) => {
      renderer.setRenderTarget(renderTarget);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      (composer.passes[0] as any).uniforms.tDiffuse.value =
        renderTarget.texture;
      (composer.passes[0] as any).uniforms.tDepth.value =
        renderTarget.depthTexture;
      (composer.passes[0] as any).uniforms.viewMatrixInverse.value =
        camera.matrixWorld;
      composer.render();
      controls.target.set(
        150 * Math.sin(t * 0.001),
        0,
        150 * Math.cos(t * 0.001),
      );
      controls.update();
    });

    cleanup(() => {
      window.addEventListener('resize', () => {});
      renderer.domElement.remove();
      renderer.renderLists.dispose();
      renderer.dispose();
    });
  });

  const projects = [
    {
      name: 'My Bright Maids',
      description:
        'Babysitting / Nanny and Cleaners platform. Get connected to trusted babysitters and cleaners in your neighborhood.',
      slug: 'mybrightmaids',
      link: 'https://mybrightmaids.user.furqanramzan.com/',
    },
    {
      name: 'Liga SH',
      description:
        'Liga.sh is the first eFootball league for the state of Schleswig-Holstein',
      slug: 'ligash',
      link: 'https://ligash.user.furqanramzan.com/',
    },
  ];

  return (
    <>
      <section class="w-full">
        {projects.map(({ name, description, slug, link }, index) => (
          <div
            key={index}
            class="relative mx-auto mb-10 mt-20 flex max-w-screen-xl flex-wrap items-center justify-between p-4 pb-5 md:mb-40 md:pb-20"
          >
            <div class="w-full cursor-pointer xl:w-[calc(100%-10%)]">
              <a target="_blank" href={link} class="cursor-pointer">
                <img
                  class="w-full"
                  src={`/assets/projects/${slug}.webp`}
                  width={800}
                  height={600}
                  alt={name}
                />
              </a>
            </div>
            <a
              target="_blank"
              href={link}
              class="relative bottom-0 right-0 w-full cursor-pointer bg-gray-900 p-3 text-justify text-lg text-white md:p-10 xl:absolute xl:w-[calc(100%-70%)]"
            >
              <h3 class="mb-2 text-xl md:text-2xl ">{name}</h3>
              <p class="md:text-xlg text-sm">{description}</p>
              <div class="float-right text-sm md:text-2xl">
                <BsArrowUpRightCircleFill />
              </div>
            </a>
          </div>
        ))}
      </section>
    </>
  );
});

const title = 'Muhammad Furqan | Projects';
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
