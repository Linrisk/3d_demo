'use client';
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, useGLTF } from "@react-three/drei";



function GroundGrid() {
  return <gridHelper args={[50, 50, "white", "gray"]} />;
}

interface GLTFObjectProps {
  url: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: THREE.Euler;
}

function GLTFObject({ url, position, scale, rotation }: GLTFObjectProps) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={position} scale={scale} rotation={rotation} />;
}


function FirstPersonControls() {
  const { camera, gl } = useThree();
const controlsRef = useRef<any>(null);

  return <PointerLockControls ref={controlsRef} args={[camera, gl.domElement]} />;
}
function PlayerMovement() {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const prevTime = useRef(performance.now());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyZ":
        case "KeyW": moveForward.current = true; break;
        case "KeyS": moveBackward.current = true; break;
        case "KeyQ":
        case "KeyA": moveLeft.current = true; break;
        case "KeyD": moveRight.current = true; break;
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyZ":
        case "KeyW": moveForward.current = false; break;
        case "KeyS": moveBackward.current = false; break;
        case "KeyQ":
        case "KeyA": moveLeft.current = false; break;
        case "KeyD": moveRight.current = false; break;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame(() => {
    const time = performance.now();
    const delta = (time - prevTime.current) / 1000;
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;
    direction.current.z = Number(moveForward.current) - Number(moveBackward.current);
    direction.current.x = Number(moveRight.current) - Number(moveLeft.current);
    direction.current.normalize();
    const speed = 25.0;
    if (moveForward.current || moveBackward.current) velocity.current.z -= direction.current.z * speed * delta;
    if (moveLeft.current || moveRight.current) velocity.current.x -= direction.current.x * speed * delta;
    const y = camera.position.y;
    camera.translateX(velocity.current.x * delta);
    camera.translateZ(velocity.current.z * delta);
    camera.position.y = y;
    prevTime.current = time;
  });

  return null;
}
export default function Home() {
  const scale = [1.2, 1.2, 1.2];
  const rotation = new THREE.Euler(0, Math.PI / 4, 0);

  return (
    <>
      <Canvas style={{ height: "100vh", width: "100%" }} camera={{ position: [0, 2, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight castShadow position={[5, 10, 7]} intensity={1} />
        <GroundGrid />
        <GLTFObject url="/ricard.glb" position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]} rotation={rotation} />
        <GLTFObject url="/malta.glb" position={[20, 0, 0]} scale={[0.5, 0.5, 0.5]} rotation={new THREE.Euler(0, 210, 0)} />
        <GLTFObject url="/3d.glb" position={[-3, -0, 8]} scale={[0.5, 0.5, 0.5]} rotation={new THREE.Euler(0, 10, -1.62)} />
        <GLTFObject url="/maison.glb" position={[10, 0, 10]} scale={[0.8, 0.8, 0.8]} rotation={new THREE.Euler(0, 0, 0)} />

        <FirstPersonControls />
        <PlayerMovement />
      </Canvas>
    </>
  );
}
