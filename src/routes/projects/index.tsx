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
import Image from '~/components/Image';

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
      blurImage:
        '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AACMAAAAGwEFAAEAAACUAAAAKAEDAAEAAAADAAAAMQECAA0AAACcAAAAMgECABQAAACqAAAAaYcEAAEAAAC+AAAAAAAAAAgACAAIAL0AAAAFAAAAvQAAAAUAAABHSU1QIDIuMTAuMzQAADIwMjM6MDU6MzEgMTY6MDc6MzUAAQABoAMAAQAAAAEAAAAAAAAAWE1QILANAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA0LjQuMC1FeGl2MiI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOmE2MjRhMjcwLTVhMDctNGUwYS04MWViLTMxYmFhNDI0Yjg2ZSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplMjc3YjE1ZS0zMTkwLTRiYjEtYThhMC1lNDA1MjRmMTk2NzkiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmNmYyNTdlOC1iYTY3LTQ3YTEtODMxNS01YzIxMGY4MWRiNDYiIGRjOkZvcm1hdD0iaW1hZ2Uvd2VicCIgR0lNUDpBUEk9IjIuMCIgR0lNUDpQbGF0Zm9ybT0iTGludXgiIEdJTVA6VGltZVN0YW1wPSIxNjg1NTMxMjU1NzQ4NTQxIiBHSU1QOlZlcnNpb249IjIuMTAuMzQiIHRpZmY6T3JpZW50YXRpb249IjEiIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzOjA1OjMxVDE2OjA3OjM1KzA1OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMzowNTozMVQxNjowNzozNSswNTowMCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDpjaGFuZ2VkPSIvIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjYxNWVmNTdmLTY5N2YtNDE0MC04ZWMwLTQ5ZWVlOTM5NTY4NyIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChMaW51eCkiIHN0RXZ0OndoZW49IjIwMjMtMDUtMzFUMTU6MTQ6MTYrMDU6MDAiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDpjaGFuZ2VkPSIvIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjYxNDkwYjY5LWJhYmUtNGNiYy1iNzYyLTQyZDI2NDM2Nzc3MSIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChMaW51eCkiIHN0RXZ0OndoZW49IjIwMjMtMDUtMzFUMTY6MDc6MzUrMDU6MDAiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz4=',
      link: 'https://mybrightmaids.user.furqanramzan.com/',
    },
    {
      name: 'Liga SH',
      description:
        'Liga.sh is the first eFootball league for the state of Schleswig-Holstein',
      slug: 'ligash',
      blurImage:
        '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ZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjA4ZjYzNTVjLWY5YTktNGI3NS1iYWIyLTNmMjJkMDdkMDcxYiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkZjhiN2NjZC03MjMxLTQ1YjAtOTU4ZC1iZTNkN2E3NWY4N2YiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyOTJmYmI4MS1lNDAzLTQ5ZGUtYjVmZi1kNjE3OTcyMTBjZDEiIGRjOkZvcm1hdD0iaW1hZ2Uvd2VicCIgR0lNUDpBUEk9IjIuMCIgR0lNUDpQbGF0Zm9ybT0iTGludXgiIEdJTVA6VGltZVN0YW1wPSIxNjg1NTMxMDEwNTQ3Njg1IiBHSU1QOlZlcnNpb249IjIuMTAuMzQiIHRpZmY6T3JpZW50YXRpb249IjEiIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzOjA1OjMxVDE2OjAzOjI5KzA1OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMzowNTozMVQxNjowMzoyOSswNTowMCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDpjaGFuZ2VkPSIvIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmRkNWZjZWRjLTRmNDYtNDIyNC1iMTlkLTc4NGMwOWU3NjQ1NSIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChMaW51eCkiIHN0RXZ0OndoZW49IjIwMjMtMDUtMzFUMTU6MTM6NDQrMDU6MDAiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDpjaGFuZ2VkPSIvIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjMxOGQ5YmQ3LTRlMTYtNGRkMy04YjFhLTE2ZjY5NWExYTFmNyIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChMaW51eCkiIHN0RXZ0OndoZW49IjIwMjMtMDUtMzFUMTY6MDM6MzArMDU6MDAiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz4=',
      link: 'https://ligash.user.furqanramzan.com/',
    },
  ];

  return (
    <>
      <section class="w-full">
        {projects.map(({ name, description, slug, blurImage, link }, index) => (
          <div
            key={index}
            class="relative mx-auto mb-10 mt-20 flex max-w-screen-xl flex-wrap items-center justify-between p-4 pb-5 md:mb-40 md:pb-20"
          >
            <div class="w-full cursor-pointer xl:w-[calc(100%-10%)]">
              <a target="_blank" href={link} class="cursor-pointer">
                <Image
                  classes="w-full"
                  alt={name}
                  image={`/assets/projects/${slug}.webp`}
                  blurImage={blurImage}
                  width={1120}
                  height={550}
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
  "Explore Muhammad Furqan's projects. From web applications built with Laravel to dynamic user interfaces created using Nuxt.js, discover a range of innovative and high-performing software solutions. Get inspired by my previous work and see how I can contribute to your project's success.";
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
