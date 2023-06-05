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
import Image from '~/components/Image';

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

  return (
    <>
      <div class="mx-auto my-28 max-w-screen-xl">
        <div class="grid grid-cols-1 lg:grid-cols-2">
          <div class="col-span-[1/2] w-full content-center px-4">
            <p class="text-1xl mb-0 text-justify font-bold text-white">
              With over 7 years of experience in the software development
              industry, I can do almost anything in web development all you have
              to do is ask. My top priority is client success, and I strive to
              exceed their expectations by finding innovative solutions,
              resolving technical issues, and optimizing performance. Throughout
              my career, I have demonstrated a problem-solving approach and
              delivered high-quality software solutions that meet project
              deadlines.
              <br />
              <br />
              My expertise in Laravel enables me to build robust and scalable
              web applications, while my proficiency in NestJS ensures efficient
              and performant back-end systems. I am highly skilled in managing
              databases using both MySQL and MongoDB, which enables me to handle
              and retrieve data with the utmost efficiency.
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
              and version control. I possess a high level of proficiency in
              creating unit tests through the use of Jest.
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
          </div>
          <div class="flex w-full content-center justify-center">
            <Image
              classes="mt-10 px-4 lg:mt-40"
              image="/assets/furqan.webp"
              blurImage="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
              BAABAAAAHgAAAAEBBAABAAAALwAAAAIBAwADAAAAhgAAABIBAwABAAAAAQAAABoBBQABAAAAjAAA
              ABsBBQABAAAAlAAAACgBAwABAAAAAgAAADEBAgANAAAAnAAAADIBAgAUAAAAqgAAAGmHBAABAAAA
              vgAAAAAAAAAIAAgACABgAAAAAQAAAGAAAAABAAAAR0lNUCAyLjEwLjM0AAAyMDIzOjA2OjA1IDE3
              OjI3OjMzAAMAAaADAAEAAAABAAAAAqAEAAEAAADgAQAAA6AEAAEAAAD3AgAAAAAAAFhNUCCwDQAA
              PD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6
              eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAt
              RXhpdjIiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjIt
              cmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBN
              TT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9u
              cy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6
              Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpHSU1QPSJodHRwOi8vd3d3LmdpbXAu
              b3JnL3htcC8iIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxu
              czp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9Imdp
              bXA6ZG9jaWQ6Z2ltcDplMGVjNTE0YS0yN2Y0LTQ5ZTktYTIxOS1jY2EwMzdhZGIyMmQiIHhtcE1N
              Okluc3RhbmNlSUQ9InhtcC5paWQ6NTBlZTg0ZTAtNjdlMC00ZTNjLTk5MzktNDlhOWQ0MzVlNzMz
              IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NmU1MTBhMTItZjdlMS00OTIxLTk4
              OTAtNGM3MWFjYWI1ZmUzIiBkYzpGb3JtYXQ9ImltYWdlL3dlYnAiIEdJTVA6QVBJPSIyLjAiIEdJ
              TVA6UGxhdGZvcm09IkxpbnV4IiBHSU1QOlRpbWVTdGFtcD0iMTY4NTk2ODA1NTM0ODUwMCIgR0lN
              UDpWZXJzaW9uPSIyLjEwLjM0IiB0aWZmOk9yaWVudGF0aW9uPSIxIiB4bXA6Q3JlYXRvclRvb2w9
              IkdJTVAgMi4xMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMzowNjowNVQxNzoyNzozMyswNTowMCIg
              eG1wOk1vZGlmeURhdGU9IjIwMjM6MDY6MDVUMTc6Mjc6MzMrMDU6MDAiPiA8eG1wTU06SGlzdG9y
              eT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6Y2hhbmdlZD0i
              LyIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozMDcyYWJkZC0yMDA5LTQzZTctYmQ4OC1kOGM1
              ZGZjZDY2MmIiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoTGludXgpIiBzdEV2dDp3
              aGVuPSIyMDIzLTA2LTA1VDEzOjU4OjIzKzA1OjAwIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJz
              YXZlZCIgc3RFdnQ6Y2hhbmdlZD0iLyIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyYmJmYzc2
              Yi0xZmI5LTQyM2QtOTE3Ni05NTlmYzkyYzQ0MzgiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAg
              Mi4xMCAoTGludXgpIiBzdEV2dDp3aGVuPSIyMDIzLTA2LTA1VDE3OjI3OjM1KzA1OjAwIi8+IDwv
              cmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8
              L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
              ICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+
              "
              alt="Muhammad Furqan"
              width={480}
              height={760}
            />
          </div>
        </div>
      </div>
    </>
  );
});

const title = 'Muhammad Furqan | About';
const description =
  'Learn more about Muhammad Furqan, a dedicated and communicative full-stack developer. With a problem-solving approach and a commitment to client success, Strive to exceed expectations and deliver high-quality software solutions. Discover my experience, expertise, and passion for staying up-to-date with the latest industry advancements.';
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
