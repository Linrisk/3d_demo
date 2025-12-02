"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { PointerLockControls, useGLTF } from "@react-three/drei"
import { WelcomeModal } from "@/components/welcome-modal"
import { HUD } from "@/components/hud"
import { InfoPopup } from "@/components/info-popup"

/* -------------------------------------------------------------------------- */
/*                            STARFIELD BACKGROUND                            */
/* -------------------------------------------------------------------------- */
function StarfieldBackground() {
  const { scene } = useThree()
  useEffect(() => {
    scene.background = new THREE.Color("#000000")

    // Create starfield
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 1000
    const positions = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 400
      positions[i + 1] = (Math.random() - 0.5) * 400
      positions[i + 2] = (Math.random() - 0.5) * 400
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    const starMaterial = new THREE.PointsMaterial({
      size: 0.7,
      color: 0xffffff,
      sizeAttenuation: true,
    })

    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    return () => {
      scene.remove(stars)
    }
  }, [scene])

  return null
}

/* -------------------------------------------------------------------------- */
/*                              NEON RETROWAVE GRID                           */
/* -------------------------------------------------------------------------- */
function NeonGrid() {
  const grid = useRef<THREE.GridHelper>(null!)
  useEffect(() => {
    if (grid.current) {
      grid.current.material.opacity = 0.35
      grid.current.material.transparent = true
      grid.current.material.color = new THREE.Color("#80591fff")
    }
  }, [])
  return <gridHelper ref={grid} args={[100, 100]} position={[0, 0.01, 0]} />
}

function GlowGrid() {
  const lines = []
  for (let i = -50; i <= 50; i += 2) {
    lines.push(
      <line key={"z" + i} position={[i, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, -50, 0, 0, 50])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#f4af0eff" linewidth={2} />
      </line>,
    )
    lines.push(
      <line key={"x" + i} position={[0, 0, i]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-50, 0, 0, 50, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4e19cbff" linewidth={2} />
      </line>,
    )
  }
  return <group>{lines}</group>
}

/* -------------------------------------------------------------------------- */
/*                               GLTF LOADER                                   */
/* -------------------------------------------------------------------------- */
interface GLTFObjectProps {
  url: string
  position: [number, number, number]
  scale: [number, number, number]
  rotation: THREE.Euler
}

function GLTFObject({ url, position, scale, rotation }: GLTFObjectProps) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} position={position} scale={scale} rotation={rotation} />
}

/* -------------------------------------------------------------------------- */
/*                    INTERACTIVE ZONES (Detection + Lighting)                */
/* -------------------------------------------------------------------------- */
interface InteractiveZoneProps {
  position: [number, number, number]
  onHover: (isHovering: boolean) => void
}

function InteractiveZone({ position, onHover }: InteractiveZoneProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { camera } = useThree()

  useFrame(() => {
    if (meshRef.current) {
      const distance = camera.position.distanceTo(new THREE.Vector3(...position))
      onHover(distance < 5)
    }
  })

  return (
    <mesh ref={meshRef} position={[position[0], 0, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[2.5, 2.5, 0.1, 32]} />
      <meshStandardMaterial emissive="#ff00ffff" emissiveIntensity={0.6} color="#ff00ff" transparent opacity={0.3} />
    </mesh>
  )
}

/* -------------------------------------------------------------------------- */
/*                              ZONE LIGHTS                                    */
/* -------------------------------------------------------------------------- */
interface ZoneLightProps {
  position: [number, number, number]
  color: string
}

function ZoneLight({ position, color }: ZoneLightProps) {
  const light = useRef<THREE.PointLight>(null!)

  useFrame((state) => {
    if (light.current) {
      light.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5
    }
  })

  return (
    <pointLight
      ref={light}
      position={[position[0], 0.5, position[2]]}
      color={color}
      intensity={1.5}
      distance={15}
      decay={2}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*                         FIRST PERSON CAMERA + MOVEMENT                      */
/* -------------------------------------------------------------------------- */
function FirstPersonControls() {
  const { camera, gl } = useThree()
  const controlsRef = useRef<any>(null)
  return <PointerLockControls ref={controlsRef} args={[camera, gl.domElement]} />
}

function PlayerMovement() {
  const { camera } = useThree()
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())
  const moveForward = useRef(false)
  const moveBackward = useRef(false)
  const moveLeft = useRef(false)
  const moveRight = useRef(false)
  const prevTime = useRef(performance.now())

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyZ":
        case "KeyW":
          moveForward.current = true
          break
        case "KeyS":
          moveBackward.current = true
          break
        case "KeyQ":
        case "KeyA":
          moveLeft.current = true
          break
        case "KeyD":
          moveRight.current = true
          break
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyZ":
        case "KeyW":
          moveForward.current = false
          break
        case "KeyS":
          moveBackward.current = false
          break
        case "KeyQ":
        case "KeyA":
          moveLeft.current = false
          break
        case "KeyD":
          moveRight.current = false
          break
      }
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("keyup", onKeyUp)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("keyup", onKeyUp)
    }
  }, [])

  useFrame(() => {
    const time = performance.now()
    const delta = (time - prevTime.current) / 1000
    velocity.current.x -= velocity.current.x * 10.0 * delta
    velocity.current.z -= velocity.current.z * 10.0 * delta
    direction.current.z = Number(moveForward.current) - Number(moveBackward.current)
    direction.current.x = Number(moveRight.current) - Number(moveLeft.current)
    direction.current.normalize()
    const speed = 25.0
    if (moveForward.current || moveBackward.current) velocity.current.z -= direction.current.z * speed * delta
    if (moveLeft.current || moveRight.current) velocity.current.x -= direction.current.x * speed * delta
    const y = camera.position.y
    camera.translateX(velocity.current.x * delta)
    camera.translateZ(velocity.current.z * delta)
    camera.position.y = y
    prevTime.current = time
  })
  return null
}

/* -------------------------------------------------------------------------- */
/*                                 MAIN SCENE                                 */
/* -------------------------------------------------------------------------- */
interface ArtObject {
  id: string
  position: [number, number, number]
  scale: [number, number, number]
  rotation: THREE.Euler
  title: string
  description: string
  color: string
}

export default function Home() {
  const [welcomeDismissed, setWelcomeDismissed] = useState(false)
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const cameraRef = useRef<THREE.Camera | null>(null)

  const artObjects: ArtObject[] = [
    {
      id: "ricard",
      position: [0, 0, 0],
      scale: [0.5, 0.5, 0.5],
      rotation: new THREE.Euler(0, Math.PI / 4, 0),
      title: "Ricard",
      description: "Ma première création 3D, un portrait stylisé en style cyberpunk.",
      color: "#ff00ff",
    },
    {
      id: "malta",
      position: [20, 0, 0],
      scale: [0.5, 0.5, 0.5],
      rotation: new THREE.Euler(0, 210 * (Math.PI / 180), 0),
      title: "Malta",
      description: "Une représentation artistique des côtes maltaises, captures de paysages.",
      color: "#00ffff",
    },
    {
      id: "3d",
      position: [-3, 0, 8],
      scale: [0.5, 0.5, 0.5],
      rotation: new THREE.Euler(0, 10 * (Math.PI / 180), -1.62),
      title: "3D Art",
      description: "Une exploration abstraite des formes géométriques en 3D.",
      color: "#ffff00",
    },
    {
      id: "Maison",
      position: [10, 0, 10],
      scale: [0.8, 0.8, 0.8],
      rotation: new THREE.Euler(0, 0, 0),
      title: "Maison",
      description: "Une architecture rêvée, inspirée par mes voyages et mes visions.",
      color: "#00ff00",
    },
  ]

  const handleTeleport = (targetPosition: [number, number, number]) => {
    if (cameraRef.current) {
      cameraRef.current.position.set(targetPosition[0], 2, targetPosition[2] - 5)
    }
  }

  return (
    <>
      <WelcomeModal isOpen={!welcomeDismissed} onDismiss={() => setWelcomeDismissed(true)} />
      <Canvas style={{ height: "100vh", width: "100%" }} camera={{ position: [0, 2, 5], fov: 75 }}>
        <StarfieldBackground />
        <ambientLight intensity={0.7} />
        <directionalLight intensity={1} position={[5, 10, 7]} />

        {/* RETROWAVE GRID */}
        <NeonGrid />
        <GlowGrid />

        {artObjects.map((obj) => (
          <group key={obj.id}>
            {/* Original object */}
            <GLTFObject url={`/${obj.id}.glb`} position={obj.position} scale={obj.scale} rotation={obj.rotation} />

            {/* Interactive zone and light */}
            <InteractiveZone
              position={obj.position}
              onHover={(isHovering) => setHoveredZone(isHovering ? obj.id : null)}
            />
            <ZoneLight position={obj.position} color={obj.color} />
          </group>
        ))}

        {/* CONTROLS */}
        <FirstPersonControls />
        <PlayerMovement />

        <CameraRef setRef={(setRef) => (cameraRef.current = setRef)} />
      </Canvas>

      <HUD artObjects={artObjects} onTeleport={handleTeleport} />

      {hoveredZone && <InfoPopup {...artObjects.find((obj) => obj.id === hoveredZone)!} />}
    </>
  )
}

// Helper component to access camera
function CameraRef({ setRef }: { setRef: (camera: THREE.Camera) => void }) {
  const { camera } = useThree()
  useEffect(() => {
    setRef(camera)
  }, [camera, setRef])
  return null
}
