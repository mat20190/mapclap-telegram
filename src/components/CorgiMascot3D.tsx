import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { GLView, ExpoWebGLRenderingContext } from "expo-gl";
import * as THREE from "three";

type Props = {
  size?: number;
};

type AnyObject = THREE.Object3D & {
  material?: THREE.Material | THREE.Material[];
};

function material(color: number, roughness = 0.72) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness: 0.02
  });
}

function ellipsoid(
  name: string,
  color: number,
  position: [number, number, number],
  scale: [number, number, number],
  segments = 32
) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, segments, Math.max(16, segments / 2)),
    material(color)
  );
  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  return mesh;
}

function cone(
  name: string,
  color: number,
  position: [number, number, number],
  scale: [number, number, number],
  rotation: [number, number, number]
) {
  const mesh = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 48), material(color));
  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  return mesh;
}

function paw(
  group: THREE.Group,
  x: number,
  y: number,
  darkOrange: number
) {
  const leg = ellipsoid("short corgi leg", darkOrange, [x, y, -0.55], [0.13, 0.16, 0.36], 24);
  const foot = ellipsoid("rounded corgi paw", darkOrange, [x - 0.03, y, -0.9], [0.2, 0.16, 0.1], 24);
  group.add(leg, foot);
}

function createCorgi() {
  const group = new THREE.Group();
  const orange = 0xc97838;
  const darkOrange = 0x7f431d;
  const cream = 0xf3efe2;
  const innerEar = 0x9b6557;
  const black = 0x15110f;
  const white = 0xffffff;

  group.add(ellipsoid("compact corgi body", orange, [0.15, 0, -0.15], [1.08, 0.43, 0.48]));
  group.add(ellipsoid("front chest mass", orange, [-0.68, 0, -0.08], [0.48, 0.43, 0.5]));
  group.add(ellipsoid("rear haunch", darkOrange, [0.8, 0, -0.2], [0.43, 0.4, 0.42]));
  group.add(ellipsoid("white belly", cream, [-0.05, -0.01, -0.37], [0.68, 0.34, 0.27]));
  group.add(ellipsoid("white chest", cream, [-0.72, 0, -0.08], [0.36, 0.36, 0.45]));

  const tail = ellipsoid("fluffy corgi tail", orange, [1.2, 0, 0.1], [0.32, 0.21, 0.19], 24);
  tail.rotation.y = -0.45;
  group.add(tail);
  group.add(ellipsoid("cream tail tip", cream, [1.42, 0, 0.14], [0.15, 0.12, 0.1], 20));

  group.add(ellipsoid("large corgi head", orange, [-1.05, 0, 0.55], [0.62, 0.52, 0.55]));
  group.add(ellipsoid("forehead dome", orange, [-1.08, 0, 0.78], [0.48, 0.42, 0.28], 24));
  group.add(ellipsoid("white forehead stripe", cream, [-1.23, 0, 0.58], [0.14, 0.12, 0.5], 24));
  group.add(ellipsoid("rounded lower face", cream, [-1.31, 0, 0.33], [0.4, 0.42, 0.33], 24));
  group.add(ellipsoid("left cheek", cream, [-1.42, -0.25, 0.28], [0.28, 0.24, 0.24], 24));
  group.add(ellipsoid("right cheek", cream, [-1.42, 0.25, 0.28], [0.28, 0.24, 0.24], 24));
  group.add(ellipsoid("short bridge", cream, [-1.46, 0, 0.48], [0.17, 0.16, 0.18], 24));
  group.add(ellipsoid("wide muzzle", cream, [-1.62, 0, 0.26], [0.3, 0.31, 0.21], 24));
  group.add(ellipsoid("black nose", black, [-1.88, 0, 0.34], [0.15, 0.12, 0.09], 24));

  group.add(cone("left huge ear", orange, [-1.05, -0.4, 1.2], [0.31, 0.31, 0.45], [0.2, -0.22, -0.2]));
  group.add(cone("right huge ear", orange, [-1.05, 0.4, 1.2], [0.31, 0.31, 0.45], [-0.2, -0.22, 0.2]));
  group.add(cone("left inner ear", innerEar, [-1.08, -0.39, 1.17], [0.18, 0.18, 0.32], [0.2, -0.22, -0.2]));
  group.add(cone("right inner ear", innerEar, [-1.08, 0.39, 1.17], [0.18, 0.18, 0.32], [-0.2, -0.22, 0.2]));

  const leftEye = ellipsoid("left big eye", black, [-1.5, -0.25, 0.58], [0.14, 0.09, 0.17], 24);
  const rightEye = ellipsoid("right big eye", black, [-1.5, 0.25, 0.58], [0.14, 0.09, 0.17], 24);
  group.add(leftEye, rightEye);
  group.add(ellipsoid("left catchlight", white, [-1.61, -0.29, 0.69], [0.032, 0.018, 0.032], 12));
  group.add(ellipsoid("right catchlight", white, [-1.61, 0.21, 0.69], [0.032, 0.018, 0.032], 12));

  paw(group, -0.58, -0.27, darkOrange);
  paw(group, -0.58, 0.27, darkOrange);
  paw(group, 0.72, -0.27, darkOrange);
  paw(group, 0.72, 0.27, darkOrange);

  group.rotation.x = -Math.PI / 2;
  group.rotation.z = 0;
  return group;
}

export function CorgiMascot3D({ size = 180 }: Props) {
  const onContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    const renderer = new THREE.WebGLRenderer({
      canvas: {
        width,
        height,
        style: {},
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        clientHeight: height,
        clientWidth: width
      } as unknown as HTMLCanvasElement,
      context: gl as unknown as WebGLRenderingContext
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(-5.45, 0, 2.22);
    camera.lookAt(-1.08, 0, 0.36);

    const corgi = createCorgi();
    scene.add(corgi);
    const leftEye = corgi.getObjectByName("left big eye");
    const rightEye = corgi.getObjectByName("right big eye");
    const leftBaseScale = leftEye?.scale.clone();
    const rightBaseScale = rightEye?.scale.clone();
    scene.add(new THREE.AmbientLight(0xffffff, 1.7));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 4, 5);
    scene.add(key);

    let frame = 0;
    const render = () => {
      frame += 1;
      corgi.rotation.x = -Math.PI / 2;
      corgi.rotation.y = 0;
      corgi.position.y = 0;
      corgi.position.z = -0.08;
      const tail = corgi.getObjectByName("fluffy corgi tail");
      if (tail) {
        tail.rotation.y = -0.45 + Math.sin(frame / 9) * 0.22;
      }
      const blink = frame % 150 > 140 ? 0.16 : 1;
      if (leftEye && leftBaseScale) {
        leftEye.scale.set(leftBaseScale.x, leftBaseScale.y, leftBaseScale.z * blink);
      }
      if (rightEye && rightBaseScale) {
        rightEye.scale.set(rightBaseScale.x, rightBaseScale.y, rightBaseScale.z * blink);
      }
      renderer.render(scene, camera);
      gl.endFrameEXP();
      requestAnimationFrame(render);
    };
    render();
  }, []);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <GLView style={styles.gl} onContextCreate={onContextCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center"
  },
  gl: {
    flex: 1,
    alignSelf: "stretch"
  }
});
