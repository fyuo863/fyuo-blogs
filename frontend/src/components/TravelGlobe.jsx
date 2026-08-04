import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* Hallmark · component: celestial globe canvas · genre: atmospheric editorial
 * pre-emit critique: P5 H5 E5 S5 R5 V5 · contrast: pass (40–41) · slop: pass (33, 47–48)
 */

function colorFromCss(value) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.fillStyle = value;
  context.fillRect(0, 0, 1, 1);
  const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
  return new THREE.Color(red / 255, green / 255, blue / 255);
}

function pointFromCoordinates(latitude, longitude, radius = 1) {
  const phi = THREE.MathUtils.degToRad(90 - latitude);
  const theta = THREE.MathUtils.degToRad(longitude + 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

const degreesToRadians = (value) => (value * Math.PI) / 180;
const radiansToDegrees = (value) => (value * 180) / Math.PI;
const normalizeDegrees = (value) => ((value % 360) + 360) % 360;
const SUN_RADIUS = 695700 / 6371;
const SUN_DISTANCE = 149597870 / 6371;
const MOON_RADIUS = 1737.4 / 6371;
const MOON_DISTANCE = 384400 / 6371;

function julianDay(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function siderealDegrees(day) {
  return normalizeDegrees(280.46061837 + 360.98564736629 * (day - 2451545));
}

function equatorialDirection(rightAscension, declination, day) {
  const longitude = normalizeDegrees(rightAscension - siderealDegrees(day) + 180) - 180;
  return pointFromCoordinates(declination, longitude);
}

function sunDirection(day) {
  const elapsedDays = day - 2451545;
  const meanLongitude = normalizeDegrees(280.46 + 0.9856474 * elapsedDays);
  const meanAnomaly = degreesToRadians(normalizeDegrees(357.528 + 0.9856003 * elapsedDays));
  const eclipticLongitude = degreesToRadians(meanLongitude + 1.915 * Math.sin(meanAnomaly) + 0.02 * Math.sin(2 * meanAnomaly));
  const obliquity = degreesToRadians(23.439 - 0.0000004 * elapsedDays);
  const rightAscension = radiansToDegrees(Math.atan2(Math.cos(obliquity) * Math.sin(eclipticLongitude), Math.cos(eclipticLongitude)));
  const declination = radiansToDegrees(Math.asin(Math.sin(obliquity) * Math.sin(eclipticLongitude)));
  return equatorialDirection(rightAscension, declination, day);
}

function moonDirection(day) {
  const elapsedDays = day - 2451543.5;
  const ascendingNode = degreesToRadians(normalizeDegrees(125.1228 - 0.0529538083 * elapsedDays));
  const inclination = degreesToRadians(5.1454);
  const periapsis = degreesToRadians(normalizeDegrees(318.0634 + 0.1643573223 * elapsedDays));
  const meanAnomaly = degreesToRadians(normalizeDegrees(115.3654 + 13.0649929509 * elapsedDays));
  const eccentricity = 0.0549;
  let eccentricAnomaly = meanAnomaly;

  for (let index = 0; index < 5; index += 1) {
    eccentricAnomaly -= (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly) / (1 - eccentricity * Math.cos(eccentricAnomaly));
  }

  const orbitalX = Math.cos(eccentricAnomaly) - eccentricity;
  const orbitalY = Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(eccentricAnomaly);
  const trueAnomaly = Math.atan2(orbitalY, orbitalX);
  const eclipticLongitude = trueAnomaly + periapsis;
  const eclipticX = Math.cos(ascendingNode) * Math.cos(eclipticLongitude) - Math.sin(ascendingNode) * Math.sin(eclipticLongitude) * Math.cos(inclination);
  const eclipticY = Math.sin(ascendingNode) * Math.cos(eclipticLongitude) + Math.cos(ascendingNode) * Math.sin(eclipticLongitude) * Math.cos(inclination);
  const eclipticZ = Math.sin(eclipticLongitude) * Math.sin(inclination);
  const obliquity = degreesToRadians(23.4393 - 0.0000003563 * elapsedDays);
  const equatorialY = eclipticY * Math.cos(obliquity) - eclipticZ * Math.sin(obliquity);
  const equatorialZ = eclipticY * Math.sin(obliquity) + eclipticZ * Math.cos(obliquity);
  const rightAscension = radiansToDegrees(Math.atan2(equatorialY, eclipticX));
  const declination = radiansToDegrees(Math.atan2(equatorialZ, Math.hypot(eclipticX, equatorialY)));
  return equatorialDirection(rightAscension, declination, day);
}

const celestialInkFieldShader = {
  uniforms: {
    uPrintPaper: { value: new THREE.Color() },
    uPrintCyan: { value: new THREE.Color() },
    uPrintMagenta: { value: new THREE.Color() },
    uPrintYellow: { value: new THREE.Color() },
    uPrintBlack: { value: new THREE.Color() },
    uSunDirection: { value: new THREE.Vector3(0, 0, 1) },
    uMoonDirection: { value: new THREE.Vector3(0, 0, 1) },
    uAspect: { value: 1 },
  },
  vertexShader: `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,
  fragmentShader: `
  uniform vec3 uPrintPaper;
  uniform vec3 uPrintCyan;
  uniform vec3 uPrintMagenta;
  uniform vec3 uPrintYellow;
  uniform vec3 uPrintBlack;
  uniform vec3 uSunDirection;
  uniform vec3 uMoonDirection;
  uniform float uAspect;
  varying vec2 vUv;

  vec2 rotateScreen(vec2 point, float angle) {
    float sine = sin(angle);
    float cosine = cos(angle);
    return mat2(cosine, -sine, sine, cosine) * point;
  }

  float paperGrain(vec2 uv) {
    return fract(sin(dot(uv * vec2(911.0, 617.0), vec2(31.17, 13.31))) * 43758.5453);
  }

  float inkDot(vec2 uv, float frequency, float angle, float coverage, vec2 registration) {
    vec2 screen = rotateScreen((uv + registration) * frequency, angle);
    vec2 cell = floor(screen);
    float inkSpread = mix(0.88, 1.12, paperGrain(cell / frequency));
    float radius = 0.46 * sqrt(clamp(coverage, 0.0, 1.0)) * inkSpread;
    float distanceToCenter = length(fract(screen) - 0.5);
    float antialias = 0.072;
    float dot = 1.0 - smoothstep(radius - antialias, radius + antialias, distanceToCenter);
    return dot * smoothstep(0.016, 0.042, radius);
  }

  vec3 pigmentTransmission(vec3 pigment, float density) {
    vec3 relativeReflectance = clamp(pigment / max(uPrintPaper, vec3(0.001)), vec3(0.012), vec3(1.0));
    return pow(relativeReflectance, vec3(density));
  }

  void main() {
    vec2 fieldUv = vUv - 0.5;
    fieldUv.x *= uAspect;
    vec3 ray = normalize(vec3(fieldUv * 1.28, -1.0));
    vec3 sunDirection = normalize(uSunDirection);
    vec3 moonDirection = normalize(uMoonDirection);
    float sunLight = pow(max(dot(ray, sunDirection), 0.0), 8.0);
    float moonLight = pow(max(dot(ray, moonDirection), 0.0), 12.0);
    float horizon = smoothstep(-0.9, 0.65, ray.y);
    float deepSpace = 0.72 + 0.28 * (1.0 - horizon);
    vec3 celestialSource = mix(uPrintPaper * 0.16, uPrintPaper * 0.42, sunLight);
    celestialSource += uPrintCyan * sunLight * 0.42;
    celestialSource += uPrintMagenta * moonLight * 0.34;
    celestialSource += uPrintPaper * moonLight * 0.18;
    celestialSource *= deepSpace;
    vec3 cmy = clamp(vec3(1.0) - celestialSource / max(uPrintPaper, vec3(0.001)), 0.0, 1.0);
    float keyCoverage = min(cmy.r, min(cmy.g, cmy.b)) * 0.74;
    vec3 processCoverage = clamp(cmy - vec3(keyCoverage), 0.0, 1.0);
    float cyan = inkDot(vUv, 122.0, 0.27, pow(processCoverage.r, 0.86), vec2(0.0011, -0.00084));
    float magenta = inkDot(vUv, 129.0, 1.36, pow(processCoverage.g, 0.88), vec2(-0.00128, 0.00096));
    float yellow = inkDot(vUv, 136.0, 0.0, pow(processCoverage.b, 0.84), vec2(0.00076, -0.00048));
    float black = inkDot(vUv, 143.0, 0.79, smoothstep(0.035, 0.92, keyCoverage), vec2(0.00042, 0.00062));
    vec3 printed = uPrintPaper;
    printed *= pigmentTransmission(uPrintCyan, cyan * 0.82);
    printed *= pigmentTransmission(uPrintMagenta, magenta * 0.8);
    printed *= pigmentTransmission(uPrintYellow, yellow * 0.65);
    printed *= pigmentTransmission(uPrintBlack, black * 0.9);
    float stars = step(0.996, paperGrain(floor(vUv * vec2(310.0, 190.0))));
    printed += stars * (uPrintPaper * (0.2 + sunLight * 0.45));
    printed += (paperGrain(floor(vUv * vec2(170.0, 116.0)) / vec2(170.0, 116.0)) - 0.5) * 0.018;
    gl_FragColor = vec4(printed, 1.0);
  }
`,
};

const nightLightsShader = {
  uniforms: {
    nightMap: { value: null },
    sunDirection: { value: new THREE.Vector3(0, 1, 0) },
  },
  vertexShader: `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,
  fragmentShader: `
  uniform sampler2D nightMap;
  uniform vec3 sunDirection;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vec3 nightSample = texture2D(nightMap, vUv).rgb;
    float citySignal = max(nightSample.r, nightSample.g) - nightSample.b * 0.42;
    float cityBrightness = smoothstep(0.012, 0.18, citySignal);
    float solarExposure = dot(normalize(vNormal), normalize(sunDirection));
    float nightMask = 1.0 - smoothstep(-0.16, 0.18, solarExposure);
    vec3 cityInk = max(nightSample - vec3(nightSample.b * 0.32), vec3(0.0));
    vec3 cityEmission = pow(cityInk, vec3(0.56)) * 3.1;
    gl_FragColor = vec4(cityEmission, cityBrightness * nightMask);
  }
`,
};

const atmosphereShader = {
  uniforms: {
    sunDirection: { value: new THREE.Vector3(0, 1, 0) },
    uCobalt: { value: new THREE.Color() },
    uPaper: { value: new THREE.Color() },
    uEarthRadius: { value: 1.0 },
    uAtmosphereRadius: { value: 1.016 },
  },
  vertexShader: `
  varying vec3 vLocalNormal;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;

  void main() {
    vLocalNormal = normal;
    vViewNormal = normalize(normalMatrix * normal);
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = viewPosition.xyz;
    gl_Position = projectionMatrix * viewPosition;
  }
`,
  fragmentShader: `
  uniform vec3 sunDirection;
  uniform vec3 uCobalt;
  uniform vec3 uPaper;
  uniform float uEarthRadius;
  uniform float uAtmosphereRadius;
  varying vec3 vLocalNormal;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;

  void main() {
    float viewCosine = max(dot(normalize(vViewNormal), normalize(-vViewPosition)), 0.0);
    float shellThickness = uAtmosphereRadius - uEarthRadius;
    float earthIntersection = viewCosine * viewCosine - (uAtmosphereRadius * uAtmosphereRadius - uEarthRadius * uEarthRadius);
    float pathLength = earthIntersection > 0.0
      ? viewCosine - sqrt(earthIntersection)
      : 2.0 * viewCosine;
    float opticalDepth = max(pathLength / shellThickness, 0.0);
    float transmittance = exp(-0.12 * opticalDepth);
    float daylight = smoothstep(-0.32, 0.48, dot(normalize(vLocalNormal), normalize(sunDirection)));
    float inscattering = (1.0 - transmittance) * mix(0.24, 1.0, daylight);
    vec3 atmosphere = mix(uCobalt, uPaper, daylight * 0.28);
    gl_FragColor = vec4(atmosphere, inscattering * 0.72);
  }
`,
};

function createFallbackTexture() {
  const texture = new THREE.DataTexture(new Uint8Array([244, 239, 228, 255]), 1, 1, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createNightLightsFallbackTexture() {
  const texture = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function TravelGlobe({ places, onSelectPlace }) {
  const hostRef = useRef(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true, powerPreference: "high-performance" });
    } catch {
      const failureTimer = window.setTimeout(() => setUnavailable(true), 0);
      return () => window.clearTimeout(failureTimer);
    }

    const styles = getComputedStyle(host);
    const colors = {
      paper: styles.getPropertyValue("--color-paper").trim(),
      cobalt: styles.getPropertyValue("--color-cobalt").trim(),
      accent: styles.getPropertyValue("--color-accent").trim(),
      ink: styles.getPropertyValue("--color-ink").trim(),
      printPaper: styles.getPropertyValue("--color-print-paper").trim(),
      printCyan: styles.getPropertyValue("--color-print-cyan").trim(),
      printMagenta: styles.getPropertyValue("--color-print-magenta").trim(),
      printYellow: styles.getPropertyValue("--color-print-yellow").trim(),
      printBlack: styles.getPropertyValue("--color-print-black").trim(),
    };
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, SUN_DISTANCE * 1.3);
    camera.position.set(0, 0, 3.45);
    const backgroundScene = new THREE.Scene();
    const backgroundCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const globe = new THREE.Group();
    globe.rotation.set(-0.26, -1.83, 0);
    scene.add(globe);

    const inkFieldMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPrintPaper: { value: colorFromCss(colors.printPaper) },
        uPrintCyan: { value: colorFromCss(colors.printCyan) },
        uPrintMagenta: { value: colorFromCss(colors.printMagenta) },
        uPrintYellow: { value: colorFromCss(colors.printYellow) },
        uPrintBlack: { value: colorFromCss(colors.printBlack) },
        uSunDirection: { value: new THREE.Vector3() },
        uMoonDirection: { value: new THREE.Vector3() },
        uAspect: { value: 1 },
      },
      vertexShader: celestialInkFieldShader.vertexShader,
      fragmentShader: celestialInkFieldShader.fragmentShader,
      depthWrite: false,
      depthTest: false,
    });
    const inkField = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), inkFieldMaterial);
    inkField.frustumCulled = false;
    backgroundScene.add(inkField);

    const solarColor = colorFromCss(colors.printPaper).lerp(colorFromCss(colors.printYellow), 0.18);
    const hemisphereLight = new THREE.HemisphereLight(colorFromCss(colors.printPaper), colorFromCss(colors.paper), 0.3);
    scene.add(hemisphereLight);
    const sunLight = new THREE.DirectionalLight(solarColor, 4.1);
    const moonLight = new THREE.DirectionalLight(colorFromCss(colors.cobalt), 0.06);
    scene.add(sunLight, sunLight.target, moonLight, moonLight.target);

    const fallbackTexture = createFallbackTexture();
    const sphereGeometry = new THREE.SphereGeometry(1, 72, 48);
    const earthMaterial = new THREE.MeshStandardMaterial({ map: fallbackTexture, roughness: 0.64, metalness: 0 });
    earthMaterial.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        vec3 oceanSample = texture2D( map, vMapUv ).rgb;
        float oceanBlue = smoothstep( 0.018, 0.16, oceanSample.b - max( oceanSample.r, oceanSample.g ) * 0.55 );
        float oceanDark = 1.0 - smoothstep( 0.025, 0.15, max( oceanSample.r, max( oceanSample.g, oceanSample.b ) ) );
        float oceanMask = max( oceanBlue, oceanDark * 0.7 );
        roughnessFactor = mix( roughnessFactor, 0.26, oceanMask );`
      );
    };
    earthMaterial.customProgramCacheKey = () => "travel-earth-ocean-reflection-v1";
    const sphere = new THREE.Mesh(sphereGeometry, earthMaterial);
    globe.add(sphere);

    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(SUN_RADIUS, 48, 32),
      new THREE.MeshBasicMaterial({ color: colorFromCss(colors.paper) })
    );
    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(MOON_RADIUS, 32, 20),
      new THREE.MeshStandardMaterial({ color: colorFromCss(colors.paper), roughness: 0.96, metalness: 0 })
    );
    globe.add(sunMesh, moonMesh);

    const nightLightsFallbackTexture = createNightLightsFallbackTexture();
    const nightLightsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        nightMap: { value: nightLightsFallbackTexture },
        sunDirection: { value: new THREE.Vector3() },
      },
      vertexShader: nightLightsShader.vertexShader,
      fragmentShader: nightLightsShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });
    const nightLights = new THREE.Mesh(new THREE.SphereGeometry(1.003, 72, 48), nightLightsMaterial);
    nightLights.renderOrder = 2;
    globe.add(nightLights);

    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sunDirection: { value: new THREE.Vector3() },
        uCobalt: { value: colorFromCss(colors.cobalt) },
        uPaper: { value: colorFromCss(colors.paper) },
        uEarthRadius: { value: 1.0 },
        uAtmosphereRadius: { value: 1.016 },
      },
      vertexShader: atmosphereShader.vertexShader,
      fragmentShader: atmosphereShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
    });
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.016, 64, 48), atmosphereMaterial);
    globe.add(atmosphere);

    const markerGeometry = new THREE.SphereGeometry(0.032, 16, 12);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: colorFromCss(colors.accent) });
    const markerMeshes = [];
    places.forEach((place) => {
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(pointFromCoordinates(place.latitude, place.longitude, 1.018));
      marker.userData.place = place;
      globe.add(marker);
      markerMeshes.push(marker);

      if (place.route?.length > 1) {
        const routeGeometry = new THREE.BufferGeometry().setFromPoints(
          place.route.map((point) => pointFromCoordinates(point.latitude, point.longitude, 1.012))
        );
        globe.add(new THREE.Line(routeGeometry, new THREE.LineBasicMaterial({ color: colorFromCss(colors.accent) })));
      }
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "travel-globe__canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    let earthTexture;
    let nightLightsTexture;

    const sunLocal = new THREE.Vector3();
    const moonLocal = new THREE.Vector3();
    const lightWorld = new THREE.Vector3();
    const updateCelestialLighting = () => {
      const day = julianDay(new Date());
      sunLocal.copy(sunDirection(day));
      moonLocal.copy(moonDirection(day));
      nightLightsMaterial.uniforms.sunDirection.value.copy(sunLocal);
      atmosphereMaterial.uniforms.sunDirection.value.copy(sunLocal);
      inkFieldMaterial.uniforms.uSunDirection.value.copy(sunLocal).applyQuaternion(globe.quaternion);
      inkFieldMaterial.uniforms.uMoonDirection.value.copy(moonLocal).applyQuaternion(globe.quaternion);
      const moonPhase = THREE.MathUtils.clamp((1 - sunLocal.dot(moonLocal)) * 0.5, 0, 1);
      moonLight.intensity = 0.025 + moonPhase * 0.11;
    };
    const positionCelestialLights = () => {
      lightWorld.copy(sunLocal).applyQuaternion(globe.quaternion).multiplyScalar(8);
      sunLight.position.copy(lightWorld);
      lightWorld.copy(moonLocal).applyQuaternion(globe.quaternion).multiplyScalar(7);
      moonLight.position.copy(lightWorld);
      sunMesh.position.copy(sunLocal).multiplyScalar(SUN_DISTANCE);
      moonMesh.position.copy(moonLocal).multiplyScalar(MOON_DISTANCE);
    };
    updateCelestialLighting();
    const celestialTimer = window.setInterval(() => {
      updateCelestialLighting();
      render();
    }, 60000);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const drag = { active: false, moved: false, x: 0, y: 0, velocityX: 0, velocityY: 0 };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame;
    let previousFrameTime = 0;

    const render = () => {
      positionCelestialLights();
      inkFieldMaterial.uniforms.uSunDirection.value.copy(sunLocal).applyQuaternion(globe.quaternion);
      inkFieldMaterial.uniforms.uMoonDirection.value.copy(moonLocal).applyQuaternion(globe.quaternion);
      renderer.clear();
      renderer.render(backgroundScene, backgroundCamera);
      renderer.clearDepth();
      renderer.render(scene, camera);
    };
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "/assets/earth/blue-marble-1024.png",
      (texture) => {
        earthTexture = texture;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        earthMaterial.map = texture;
        earthMaterial.needsUpdate = true;
        render();
      },
      undefined,
      () => {
        setUnavailable(true);
      }
    );
    textureLoader.load(
      "/assets/earth/black-marble-2012.jpg",
      (texture) => {
        nightLightsTexture = texture;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        nightLightsMaterial.uniforms.nightMap.value = texture;
        render();
      },
      undefined,
      () => {
        nightLights.visible = false;
      }
    );
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      inkFieldMaterial.uniforms.uAspect.value = width / height;
      render();
    };
    const tick = (timestamp) => {
      const elapsed = Math.min(timestamp - previousFrameTime || 16.67, 32);
      previousFrameTime = timestamp;
      if (!drag.active && !reduceMotion) {
        globe.rotation.y += elapsed * 0.000035 + drag.velocityX;
        globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x + drag.velocityY, -0.92, 0.92);
        drag.velocityX *= 0.93;
        drag.velocityY *= 0.93;
        render();
      }
      frame = requestAnimationFrame(tick);
    };
    const onPointerDown = (event) => {
      drag.active = true;
      drag.moved = false;
      drag.x = event.clientX;
      drag.y = event.clientY;
      drag.velocityX = 0;
      drag.velocityY = 0;
      host.setPointerCapture?.(event.pointerId);
      host.dataset.dragging = "true";
    };
    const onPointerMove = (event) => {
      if (!drag.active) return;
      const deltaX = event.clientX - drag.x;
      const deltaY = event.clientY - drag.y;
      if (Math.abs(deltaX) + Math.abs(deltaY) > 2) drag.moved = true;
      drag.velocityX = deltaX * 0.006;
      drag.velocityY = deltaY * 0.004;
      globe.rotation.y += drag.velocityX;
      globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x + drag.velocityY, -0.92, 0.92);
      drag.x = event.clientX;
      drag.y = event.clientY;
      render();
    };
    const onPointerUp = (event) => {
      if (!drag.active) return;
      drag.active = false;
      delete host.dataset.dragging;
      host.releasePointerCapture?.(event.pointerId);
      if (!drag.moved) {
        const bounds = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(markerMeshes, false)[0];
        if (hit?.object.userData.place) onSelectPlace(hit.object.userData.place);
      }
    };
    const onKeyDown = (event) => {
      const step = 0.09;
      if (event.key === "ArrowLeft") globe.rotation.y -= step;
      else if (event.key === "ArrowRight") globe.rotation.y += step;
      else if (event.key === "ArrowUp") globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x - step, -0.92, 0.92);
      else if (event.key === "ArrowDown") globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x + step, -0.92, 0.92);
      else return;
      event.preventDefault();
      render();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointercancel", onPointerUp);
    host.addEventListener("keydown", onKeyDown);
    resize();
    if (!reduceMotion) frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(celestialTimer);
      observer.disconnect();
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointercancel", onPointerUp);
      host.removeEventListener("keydown", onKeyDown);
      scene.traverse((object) => {
        object.geometry?.dispose?.();
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose?.());
        else object.material?.dispose?.();
      });
      inkField.geometry.dispose();
      inkFieldMaterial.dispose();
      earthTexture?.dispose();
      nightLightsTexture?.dispose();
      fallbackTexture.dispose();
      nightLightsFallbackTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [places, onSelectPlace]);

  if (unavailable) {
    return <div className="travel-globe__fallback" role="img" aria-label="A globe preview is unavailable on this device." />;
  }

  return <div className="travel-globe" ref={hostRef} tabIndex="0" aria-label="Drag the globe to inspect saved locations, or use arrow keys to rotate it." />;
}

export default TravelGlobe;
