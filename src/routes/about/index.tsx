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
import { TbMailShare } from '@qwikest/icons/tablericons';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import type { DocumentHead } from '@builder.io/qwik-city';
import Image from '~/components/Image';
import { furqan } from '~/utils/blur';

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

    const texture = new TextureLoader().load('/assets/textures/island.jpg');

    const mesh0 = new Mesh(
      new PlaneGeometry(size, size, segs, segs).rotateX(-0.5 * Math.PI),
      makeMaterial(),
    );
    scene.add(mesh0);
    const mesh1 = new Mesh(
      new PlaneGeometry(size, size, segs >> 1, segs >> 1).rotateX(
        -0.5 * Math.PI,
      ),
      makeMaterial(true, new Color('grey')),
    );
    scene.add(mesh1);

    function makeMaterial(wireframe?: boolean, color?: Color) {
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
      mat.uniforms.map.value = texture;
      mat.uniforms.displacementMap.value = texture;
      (mat as any).map = texture;
      (mat as any).displacementMap = texture;
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

    cleanup(() => {
      window.removeEventListener('resize', () => {});
      renderer.domElement.remove();
      renderer.renderLists.dispose();
      renderer.dispose();
    });
  });

  const email = 'furqanramzan271996@gmail.com';

  return (
    <>
      <div class="mx-auto my-28 max-w-screen-xl">
        <div class="grid grid-cols-1 lg:grid-cols-2">
          <div class="col-span-[1/2] text-1xl w-full content-center px-4 text-justify font-bold text-white">
            <p>
              With over 7 years of experience in the software development
              industry, I can do almost anything in web development all you have
              to do is ask. My top priority is client success, and I strive to
              exceed their expectations by finding innovative solutions,
              resolving technical issues, and optimizing performance that meet
              project deadlines.
              <br />
              <br />
              My expertise in Laravel enables me to build robust and scalable
              web applications, while my proficiency in NestJS ensures efficient
              and performant back-end systems. I am highly skilled in managing
              databases using both MySQL and MongoDB, which enables me to handle
              and retrieve data with the utmost efficiency. I possess a high
              level of proficiency in creating unit tests through the use of
              Jest.
              <br />
              <br />
              I also create dynamic and interactive user interfaces using
              Nuxt.js and Next.js, providing a seamless user experience.
              Furthermore, I demonstrated proficiency in SvelteKit, allowing me
              to create lightweight and optimized web applications.
              <br />
              <br />
              I am also proficient in Docker containerization, which streamlines
              development and deployment processes. Moreover, my extensive
              understanding of Linux and Git ensures smooth server management
              and version control.
              <br />
              <br />
              I have a strong dedication to keeping myself informed about the
              latest advancements and top practices in the industry so that I
              can offer creative and state-of-the-art solutions to my clients,
              ensuring their projects are advanced in technology.
              <br />
              <br />
              As a collaborative and communicative professional, I prioritize
              understanding my client's needs and objectives. I actively listen,
              provide regular updates, and maintain open lines of communication
              throughout the development process.
              <br />
              <br />
              If you're looking for a trustworthy and proficient full-stack
              developer who can provide meaningful support to your projects and
              turn your ideas into reality, your search ends here. Let's connect
              and discuss how I can contribute to your project's success. I am
              ready to leverage my expertise and commitment to help you achieve
              success.
            </p>
            <a
              class="mt-3 flex cursor-pointer items-center"
              href={`mailto:${email}`}
            >
              <i class="mr-1 text-2xl">
                <TbMailShare />
              </i>
              {email}
            </a>
          </div>
          <div class="flex w-full content-center justify-center">
            <Image
              classes="mt-10 px-4 lg:mt-40"
              image="/assets/furqan.webp"
              alt="Muhammad Furqan"
              width={850}
              height={1250}
              blurImage={furqan}
            />
          </div>
        </div>
      </div>
    </>
  );
});

const title = 'Muhammad Furqan | About';
const description =
  'Discover Muhammad Furqan, a full-stack developer who is passionate about his work and is dedicated to solving complex problems and achieving the best outcomes.';
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
