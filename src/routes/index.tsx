import { component$, useVisibleTask$ } from '@builder.io/qwik';
import {
  Scene,
  Color,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  Mesh,
  DirectionalLight,
  PlaneGeometry,
  ShaderMaterial,
  UniformsUtils,
  ShaderLib,
  Vector2,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  useVisibleTask$(({ cleanup }) => {
    const renderer = new WebGLRenderer({});
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, 2, 20, 12000);
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

    //// Inputs

    const size = 5000;
    const segs = 500;
    const disp = 500;

    //// Setup

    camera.position.set(1000, 1200, 1200);
    controls.autoRotate = true;
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2.9;

    const light = new DirectionalLight('grey', 1);
    light.position.set(0, 1, 0);
    scene.add(light);

    const tex0 = new TextureLoader().load('assets/island.jpeg');

    const mesh0 = new Mesh(
      new PlaneGeometry(size, size, segs, segs).rotateX(-0.5 * Math.PI),
      f(),
    );
    scene.add(mesh0);
    const mesh1 = new Mesh(
      new PlaneGeometry(size, size, segs >> 1, segs >> 1).rotateX(
        -0.5 * Math.PI,
      ),
      f(true, new Color('grey')),
    );
    scene.add(mesh1);

    //// Make Material

    function f(wireframe?: boolean, color?: Color) {
      const mat = new ShaderMaterial({
        extensions: {
          derivatives: true, // wgl 1
        },
        lights: true,
        wireframe: Boolean(wireframe),
        uniforms: UniformsUtils.merge([
          ShaderLib.standard.uniforms,
          {
            time: { value: 0 },
            displacementScale: { value: disp },
            wireframe: { value: wireframe || false },
            color: { value: color || new Color() },
            roughness: { value: 1 },
            metalness: { value: 0 },
          },
        ]),
        vertexShader:
          `
            varying vec3 vWorldPos;
            ` +
          ShaderLib.standard.vertexShader
            .replace(
              '#include <worldpos_vertex>',
              `
            // #if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP )
                vec4 worldPosition = vec4( transformed, 1.0 );
                #ifdef USE_INSTANCING
                    worldPosition = instanceMatrix * worldPosition;
                #endif
                worldPosition = modelMatrix * worldPosition;
                vWorldPos = worldPosition.xyz;
            // #endif
            `,
            )
            .replace(
              '#include <displacementmap_vertex>',
              `
            #ifdef USE_DISPLACEMENTMAP
                transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vUv ).x * displacementScale + displacementBias );
                // form a bowl
                float yOffset = length( position.xz ) / ${size.toFixed(1)};
                yOffset = pow(sin(yOffset * 2.0), 2.0);
                transformed.y += yOffset * ${size.toFixed(1)} / 3.0;
            #endif
            `,
            ),
        fragmentShader:
          `
            varying vec3 vWorldPos;
            uniform float time;
            uniform bool wireframe;
            uniform vec3 color;
            ` +
          ShaderLib.standard.fragmentShader.replace(
            'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
            `
                gl_FragColor = vec4( outgoingLight, diffuseColor.a );
                float ths = ${size.toFixed(1)} * pow(sin(time * 0.00015), 2.0);
                if ( !wireframe ) {
                    if ( length( vWorldPos ) > ths ) {
                        discard;
                    } 
                } else {
                    gl_FragColor = vec4( color, 1.0 );
                    if ( length( vWorldPos ) < ths ) {
                        discard;
                    }
                }
          `,
          ),
      });
      mat.uniforms.map.value = tex0;
      mat.uniforms.displacementMap.value = tex0;
      (mat as any).map = tex0;
      (mat as any).displacementMap = tex0;
      return mat;
    }

    //// Render

    const res = new Vector2();
    window.addEventListener('resize', () => {
      renderer.getDrawingBufferSize(res);
      fx.setSize(res.width, res.height);
    });
    const fx = new EffectComposer(renderer);
    fx.addPass(new RenderPass(scene, camera));
    fx.addPass(new UnrealBloomPass(res, 0.5, 0.5, 0.3));

    renderer.setAnimationLoop((t) => {
      fx.render();
      mesh0.material.uniforms.time.value = t;
      mesh1.material.uniforms.time.value = t;
      controls.update();
    });

    cleanup(() => renderer.dispose());
  });

  return (
    <>
      <section class="flex h-screen w-full">
        <div class="flex w-full flex-col items-center justify-center">
          <h1 class="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl xl:text-6xl">
            Muhammad Furqan
          </h1>
          <h3 class="mb-4 max-w-2xl text-3xl font-bold leading-none tracking-tight text-white md:text-5xl xl:text-5xl">
            Web Developer
          </h3>
          <h5 class="mb-4 max-w-2xl text-xs font-bold leading-none tracking-tight text-white md:text-2xl xl:text-2xl">
            Transforming Ideas into Digital Experiences
          </h5>
        </div>
      </section>
    </>
  );
});

const title = 'Muhammad Furqan | Web Developer';
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
