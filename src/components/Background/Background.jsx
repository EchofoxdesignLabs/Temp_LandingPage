// components/Background/Background.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Trail } from "./trail";
import styles from "./styles/Background.module.css";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { REVISION } from "three";

const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`
          const ktx2Loader = new KTX2Loader()
            .setTranscoderPath(`${THREE_PATH}/examples/jsm/libs/basis/`)
            
      const draco = new DRACOLoader();
      draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
export default function Background({
  modelUrl = "/contour_optimized.glb",
  textureUrl = "/marble-texture.webp", // kept for API parity
  theme = "light",                     // default LIGHT
  className = "",
  priority = false,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // clean + canvas
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.className = styles.canvas;
    canvasRef.current = canvas;
    container.appendChild(canvas);

    // ---- TRAIL (lower res) ----
    const trail = new Trail(
      Math.max(512, Math.floor(window.innerWidth / 2)),
      Math.max(512, Math.floor(window.innerHeight / 2))
    );
    const trailCanvas = trail.getTextureCanvas();
    const trailTexture = new THREE.CanvasTexture(trailCanvas);
    // IMPORTANT: we invert Y in shaders; keep flipY=false here
    trailTexture.flipY = false;
    trailTexture.needsUpdate = true;
     // Data texture: avoid gamma + mipmap blur that lifts darks
     trailTexture.colorSpace = THREE.NoColorSpace;
     trailTexture.generateMipmaps = false;
     trailTexture.minFilter = THREE.LinearFilter; // or NearestFilter if you prefer
     trailTexture.magFilter = THREE.LinearFilter;


    // ---- THREE core ----
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
    camera.position.set(0, 0, 12.9);

    const bgColor = theme === "light"
      ? new THREE.Color(0xffffff)
      : new THREE.Color(0x28282B);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      premultipliedAlpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(bgColor, 1);

    renderer.domElement.style.display = "block";
    if (priority) renderer.domElement.style.zIndex = 0;
    ktx2Loader.detectSupport(renderer);

    scene.add(new THREE.AmbientLight(0xffffff, 2));

    // ---- pointer & picking (for uMouse) ----
    const raycaster = new THREE.Raycaster();
    const mouseCanvas = { x: -9999, y: -9999 };      // trail canvas coords
    const mouseNDC = new THREE.Vector2(-10, -10);    // NDC for raycaster
    const uMouse = new THREE.Vector3(9999, 9999, 9999);

    const pickPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    pickPlane.position.set(0, 0, 0);
    scene.add(pickPlane);

    // ===== BACKGROUND PLANE (screen-space sampling; pure white base in light mode) =====
    const planeGeo = new THREE.PlaneGeometry(20, 20, 16, 16);
    const planeMat = new THREE.ShaderMaterial({
      uniforms: {
        uTrail:    { value: trailTexture },
        uBgColor:  { value: bgColor.clone() },
        uMouse:    { value: uMouse },
        uRadius:   { value: 5 },
        uCut:      { value: 0.06 },   // ignore tiny values
        uGain:     { value: 1.0 / (1.0 - 0.06) }, // renormalize after cut
      },
      vertexShader: `
        precision highp float;
        varying vec2 vScreenUv;
        varying vec3 vWorld;
        void main() {
          vWorld = (modelMatrix * vec4(position,1.0)).xyz;

          // clip pos
          vec4 clip = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          // to NDC → [0..1] UV
          vec2 ndc = clip.xy / clip.w;
          vScreenUv = ndc * 0.5 + 0.5;
          vScreenUv.y = 1.0 - vScreenUv.y; // match CanvasTexture orientation

          gl_Position = clip;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vScreenUv;
        varying vec3 vWorld;
        uniform sampler2D uTrail;
        uniform vec3 uBgColor;
        uniform vec3 uMouse;
        uniform float uRadius;
        uniform float uCut;
        uniform float uGain;

        void main() {
          // screen-space trail (TSL screenUV analogue)
          float s = texture2D(uTrail, vScreenUv).r;
           // harden the floor so tiny mip/blur doesn't grey the entire screen
          s = max(0.0, s - uCut) * uGain;
          s = clamp(s, 0.0, 1.0);

          // mouse falloff in world space
          float dist    = length(vWorld - uMouse);
          float falloff = smoothstep(uRadius, 0.0, dist); // 1 near cursor

          // keep white base; slightly darken near trail + cursor for embossed feel
          float shade = 1.0 - s * 0.18 * (0.35 + 0.65 * falloff);
          vec3 col = uBgColor * shade;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
      transparent: false,
      depthWrite: true,
    });
    const bgPlane = new THREE.Mesh(planeGeo, planeMat);
    bgPlane.position.z = -5;
    scene.add(bgPlane);

    // ===== MODEL (vertex extrusion from screenUV + multi-layer fragment blend) =====
    const materials = [];
    if (modelUrl) {
      
      const loader = new GLTFLoader();
      loader.setDRACOLoader(draco);
      loader.setKTX2Loader(ktx2Loader);

      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;
          model.position.set(0,2.2,0);
          model.scale.set(1.2,1.2,1.2);
          scene.add(model);

          model.traverse((ch) => {
            if (!ch.isMesh) return;

            const orig = Array.isArray(ch.material) ? ch.material[0] : ch.material;
            const map = orig?.map || null;
            const em  = orig?.emissiveMap || null;
            if (map) map.colorSpace = THREE.SRGBColorSpace;

            if (em) em.colorSpace = THREE.SRGBColorSpace;

            // faithful port of your TSL material:
            // - vertex: compute screen-space uv, sample trail, scale local z
            // - fragment: channel unwrap w/ sRGB↔linear + mouse falloff influence
            const mat = new THREE.ShaderMaterial({
              uniforms: {
                uTrail:       { value: trailTexture },
                uMap:         { value: map },
                uEmissiveMap: { value: em },
                uHasMap:      { value: !!map },
                uHasEmissive: { value: !!em },
                uMouse:       { value: uMouse },
                uRadius:      { value: 4 }, // mesh falloff radius
                uBgColor: { value: bgColor.clone() },
              },
              vertexShader: `
                precision highp float;
                varying vec2 vUv;
                varying vec2 vScreenUv;
                varying vec3 vWorld;

                uniform sampler2D uTrail;

                void main() {
                  vUv = uv;

                  // compute screenUV from ORIGINAL position (before displacement)
                  vec4 clip0 = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  vec2 ndc0 = clip0.xy / clip0.w;
                  vScreenUv = ndc0 * 0.5 + 0.5;
                  vScreenUv.y = 1.0 - vScreenUv.y;

                  // sample trail in screen space
                  float extrude = texture2D(uTrail, vScreenUv).r;

                  // *** TSL parity: scale local Z by mix(0.03, 1.0, extrude)
                  vec3 p = position;
                  p.z *= mix(0.03, 1.0, extrude);

                  vWorld = (modelMatrix * vec4(p,1.0)).xyz;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
                }
              `,
              fragmentShader: `
              precision highp float;

              varying vec2 vUv;
              varying vec2 vScreenUv;
              varying vec3 vWorld;

              uniform sampler2D uTrail;
              uniform sampler2D uMap;
              uniform sampler2D uEmissiveMap;
              uniform bool uHasMap;
              uniform bool uHasEmissive;
              uniform vec3 uMouse;
              uniform float uRadius;
              uniform vec3 uBgColor;

              // --- sRGB transfer OETF (linear -> sRGB), per component ---
              // Matches your TSL "sRGBTransferOETF" (1/2.4 ≈ 0.41666; 0.0031308 threshold)
              vec3 sRGBTransferOETF(vec3 cLinear) {
                vec3 a = 1.055 * pow(cLinear, vec3(1.0/2.4)) - 0.055;  // curved branch
                vec3 b = 12.92 * cLinear;                              // linear branch
                bvec3 useB = lessThanEqual(cLinear, vec3(0.0031308));
                return vec3(
                  useB.x ? b.x : a.x,
                  useB.y ? b.y : a.y,
                  useB.z ? b.z : a.z
                );
              }

              void main() {
                // TSL: extrude = texture(trailTexture, screenUV)
                float extrude = texture2D(uTrail, vScreenUv).r;

                // Sample original textures, but run them through the OETF
                // (like your sRGBTransferOETF) BEFORE channel mixing.
                vec3 tt1 = vec3(1.0); // base (albedo)
                if (uHasMap) {
                  tt1 = sRGBTransferOETF(texture2D(uMap, vUv).rgb);
                }
                vec3 tt2 = vec3(0.0); // emissive
                if (uHasEmissive) {
                  tt2 = sRGBTransferOETF(texture2D(uEmissiveMap, vUv).rgb);
                }

                // Multi-layer channel unwrapping (same order as your TSL):
                float level0 = tt2.b; // emissive B
                float level1 = tt2.g; // emissive G
                float level2 = tt2.r; // emissive R
                float level3 = tt1.b; // base B
                float level4 = tt1.g; // base G
                float level5 = tt1.r; // base R

                // World-space mouse falloff (your distance(positionWorld, uMouse))
                float dist    = length(vWorld - uMouse);
                float falloff = smoothstep(uRadius, 0.0, dist); // 1 near cursor

                // Reveal curve controlled by trail + proximity (kept from your port)
                float e = extrude * (0.35 + 0.65 * falloff);

                // Layer walk:
                float finalv = level0;
                finalv = mix(finalv, level1, smoothstep(0.0, 0.2, e));
                finalv = mix(finalv, level2, smoothstep(0.2, 0.4, e));
                finalv = mix(finalv, level3, smoothstep(0.4, 0.6, e));
                finalv = mix(finalv, level4, smoothstep(0.6, 0.8, e));
                finalv = mix(finalv, level5, smoothstep(0.8, 1.0, e));

                // TSL returns vec4(vec3(final),1) — no extra gamma conversion
                //gl_FragColor = vec4(vec3(finalv), 1.0);
                vec3 shadedColor = uBgColor * 0.7; // A dark version of the theme color
                vec3 finalColor = mix(shadedColor, uBgColor, finalv);

                gl_FragColor = vec4(finalColor, 1.0);
              }
            `,
              transparent: false,
              depthWrite: true,
            });

            mat.side = orig.side ?? THREE.FrontSide;
            mat.depthWrite = orig.depthWrite ?? true;
            ch.material = mat;
            materials.push(mat);
          });
        },
        undefined,
        (err) => console.warn("GLTF load failed:", err)
      );
    }

    // ---- pointer mapping ----
    const onPointerMove = (e) => {
      const r = container.getBoundingClientRect();

      // trail canvas coords
      mouseCanvas.x = ((e.clientX - r.left) / r.width) * trailCanvas.width;
      mouseCanvas.y = ((e.clientY - r.top) / r.height) * trailCanvas.height;

      // NDC for raycast world mouse
      mouseNDC.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // ---- resize ----
    const ro = new ResizeObserver(() => {
      const r = container.getBoundingClientRect();
      renderer.setSize(r.width, r.height);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    });
    ro.observe(container);
    resizeObserverRef.current = ro;

    // ---- loop ----
    const loop = () => {
      // update trail & texture
      trail.update(mouseCanvas);
      trailTexture.needsUpdate = true;

      // world-space mouse
      raycaster.setFromCamera(mouseNDC, camera);
      const hit = raycaster.intersectObject(pickPlane, true)[0];
      if (hit) uMouse.copy(hit.point);

      // push uMouse to materials (bg plane shares same object)
      for (let i = 0; i < materials.length; i++) {
        const m = materials[i];
        if (m.uniforms?.uMouse) m.uniforms.uMouse.value = uMouse;
      }

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    // cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onPointerMove);
      try { ro.disconnect(); } catch {}
      scene.traverse((o) => {
        if (o.isMesh) {
          o.geometry?.dispose?.();
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose?.());
          else o.material?.dispose?.();
        }
      });
      renderer.dispose();
    };
  }, [modelUrl, theme, priority]);

  return (
    <div
      ref={containerRef}
      className={`${styles.wrap} ${className}`}
      aria-hidden
      style={{ pointerEvents: "none" }}
    />
  );
}
