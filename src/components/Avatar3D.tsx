'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

const CODE_LINES = [
  'const ai = new Claude()',
  'async def train(model)',
  'git push origin main',
  'kubectl apply -f .',
  'npm run deploy',
];

function CodeSnippet({ text, position, delay }: { text: string; position: [number,number,number]; delay: number }) {
  const ref = useRef<any>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() + delay;
    ref.current.position.y = position[1] + Math.sin(t * 0.6) * 0.1;
    ref.current.material.opacity = 0.3 + Math.sin(t * 0.9) * 0.2;
  });
  return (
    <Text ref={ref} position={position} fontSize={0.065} color="#00DFD8" anchorX="center" anchorY="middle" fillOpacity={0.5}>
      {text}
    </Text>
  );
}

function Desk() {
  return (
    <group position={[0, -0.78, 0.1]}>
      {/* Desk surface */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 0.04, 0.7]} />
        <meshStandardMaterial color="#0d0025" emissive="#1a0040" emissiveIntensity={0.3} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Desk edge glow */}
      <mesh position={[0, -0.005, 0.35]}>
        <boxGeometry args={[1.4, 0.006, 0.005]} />
        <meshStandardMaterial color="#FF0080" emissive="#FF0080" emissiveIntensity={2} />
      </mesh>
      {/* Desk legs */}
      {[[-0.62, -0.3, -0.3], [0.62, -0.3, -0.3], [-0.62, -0.3, 0.28], [0.62, -0.3, 0.28]].map((pos, i) => (
        <mesh key={i} position={pos as [number,number,number]}>
          <boxGeometry args={[0.04, 0.6, 0.04]} />
          <meshStandardMaterial color="#0a0018" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Laptop({ position }: { position: [number,number,number] }) {
  return (
    <group position={position} rotation={[0, 0.15, 0]}>
      {/* Base */}
      <mesh>
        <boxGeometry args={[0.44, 0.025, 0.3]} />
        <meshStandardMaterial color="#1a0035" metalness={0.9} roughness={0.15} emissive="#7928CA" emissiveIntensity={0.15} />
      </mesh>
      {/* Keyboard detail */}
      <mesh position={[0, 0.014, 0]}>
        <boxGeometry args={[0.36, 0.002, 0.2]} />
        <meshStandardMaterial color="#0d0020" emissive="#FF0080" emissiveIntensity={0.08} />
      </mesh>
      {/* Screen (angled) */}
      <mesh position={[0, 0.145, -0.145]} rotation={[-0.52, 0, 0]}>
        <boxGeometry args={[0.42, 0.27, 0.014]} />
        <meshStandardMaterial color="#0a0018" metalness={0.85} roughness={0.15} emissive="#7928CA" emissiveIntensity={0.2} />
      </mesh>
      {/* Screen display */}
      <mesh position={[0, 0.147, -0.138]} rotation={[-0.52, 0, 0]}>
        <planeGeometry args={[0.36, 0.22]} />
        <meshStandardMaterial color="#000510" emissive="#00DFD8" emissiveIntensity={0.35} transparent opacity={0.95} />
      </mesh>
      {/* Screen glow light */}
      <pointLight position={[0, 0.2, -0.05]} color="#00DFD8" intensity={0.4} distance={1.2} />
    </group>
  );
}

function FemaleAvatar({ isSpeaking }: { isSpeaking: boolean }) {
  const rootRef  = useRef<THREE.Group>(null!);
  const headRef  = useRef<THREE.Group>(null!);
  const glowRef  = useRef<THREE.PointLight>(null!);
  const scanRef  = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (rootRef.current) {
      rootRef.current.rotation.y = Math.sin(t * 0.3) * 0.12;
    }
    if (headRef.current) {
      headRef.current.rotation.x = -0.18 + Math.sin(t * 0.5) * 0.04; // looking slightly down at screen
      headRef.current.rotation.y = Math.sin(t * 0.4) * 0.08;
    }
    if (glowRef.current) {
      glowRef.current.intensity = isSpeaking
        ? 1.6 + Math.sin(t * 10) * 0.5
        : 0.6 + Math.sin(t * 1.2) * 0.15;
    }
    if (scanRef.current) {
      scanRef.current.position.y = ((t * 0.35) % 2.2) - 1.1;
    }
  });

  const solidMat  = (color: string, emissive: string, ei = 0.35) =>
    ({ color, emissive, emissiveIntensity: ei, metalness: 0.5, roughness: 0.4 } as any);
  const glowMat   = (color: string) =>
    ({ color, emissive: color, emissiveIntensity: 1.4 } as any);

  return (
    <group ref={rootRef} position={[0, -0.12, 0]}>

      {/* ── HAIR (back volume) ── */}
      <mesh position={[0, 0.72, -0.14]}>
        <sphereGeometry args={[0.36, 24, 24]} />
        <meshStandardMaterial {...solidMat('#180038', '#FF0080', 0.45)} />
      </mesh>
      {/* Top bun / updo */}
      <mesh position={[0, 1.03, -0.1]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial {...solidMat('#200050', '#FF0080', 0.5)} />
      </mesh>
      {/* Side strands left */}
      <mesh position={[-0.3, 0.52, -0.04]} rotation={[0.1, 0, 0.3]}>
        <capsuleGeometry args={[0.05, 0.42, 4, 10]} />
        <meshStandardMaterial {...solidMat('#180038', '#FF0080', 0.35)} />
      </mesh>
      {/* Side strands right */}
      <mesh position={[0.3, 0.52, -0.04]} rotation={[0.1, 0, -0.3]}>
        <capsuleGeometry args={[0.05, 0.42, 4, 10]} />
        <meshStandardMaterial {...solidMat('#180038', '#FF0080', 0.35)} />
      </mesh>

      {/* ── HEAD ── */}
      <group ref={headRef} position={[0, 0.62, 0]}>
        <mesh>
          <sphereGeometry args={[0.29, 32, 32]} />
          <meshStandardMaterial {...solidMat('#1e0042', '#a855f7', 0.3)} />
        </mesh>

        {/* Glasses left */}
        <mesh position={[-0.09, 0.04, 0.28]}>
          <torusGeometry args={[0.07, 0.012, 8, 28]} />
          <meshStandardMaterial {...glowMat('#00DFD8')} />
        </mesh>
        <mesh position={[-0.09, 0.04, 0.28]}>
          <circleGeometry args={[0.062, 20]} />
          <meshStandardMaterial color="#00DFD8" transparent opacity={0.07} />
        </mesh>
        {/* Glasses right */}
        <mesh position={[0.09, 0.04, 0.28]}>
          <torusGeometry args={[0.07, 0.012, 8, 28]} />
          <meshStandardMaterial {...glowMat('#00DFD8')} />
        </mesh>
        <mesh position={[0.09, 0.04, 0.28]}>
          <circleGeometry args={[0.062, 20]} />
          <meshStandardMaterial color="#00DFD8" transparent opacity={0.07} />
        </mesh>
        {/* Bridge */}
        <mesh position={[0, 0.04, 0.28]}>
          <boxGeometry args={[0.044, 0.008, 0.008]} />
          <meshStandardMaterial {...glowMat('#00DFD8')} />
        </mesh>
        {/* Earrings */}
        <mesh position={[-0.31, -0.06, 0]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial {...glowMat('#FF0080')} />
        </mesh>
        <mesh position={[0.31, -0.06, 0]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial {...glowMat('#FF0080')} />
        </mesh>
      </group>

      {/* ── NECK ── */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.085, 0.1, 0.26, 14]} />
        <meshStandardMaterial {...solidMat('#1e0042', '#7928CA', 0.25)} />
      </mesh>

      {/* ── TORSO (seated, leaning slightly forward) ── */}
      <mesh position={[0, -0.1, 0]} rotation={[0.08, 0, 0]}>
        <capsuleGeometry args={[0.22, 0.42, 4, 16]} />
        <meshStandardMaterial {...solidMat('#0f0025', '#7928CA', 0.35)} />
      </mesh>
      {/* Collar */}
      <mesh position={[0, 0.12, 0.16]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.1, 0.016, 8, 18, Math.PI]} />
        <meshStandardMaterial {...glowMat('#FF0080')} />
      </mesh>

      {/* ── ARMS (reaching toward laptop) ── */}
      {/* Left arm */}
      <mesh position={[-0.28, -0.02, 0.14]} rotation={[0.55, 0.1, 0.45]}>
        <capsuleGeometry args={[0.055, 0.38, 4, 10]} />
        <meshStandardMaterial {...solidMat('#1e0042', '#7928CA', 0.25)} />
      </mesh>
      {/* Left hand */}
      <mesh position={[-0.38, -0.28, 0.34]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshStandardMaterial {...solidMat('#1e0042', '#a855f7', 0.3)} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.28, -0.02, 0.14]} rotation={[0.55, -0.1, -0.45]}>
        <capsuleGeometry args={[0.055, 0.38, 4, 10]} />
        <meshStandardMaterial {...solidMat('#1e0042', '#7928CA', 0.25)} />
      </mesh>
      {/* Right hand */}
      <mesh position={[0.38, -0.28, 0.34]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshStandardMaterial {...solidMat('#1e0042', '#a855f7', 0.3)} />
      </mesh>

      {/* ── CHAIR (simple) ── */}
      <mesh position={[0, -0.58, -0.28]}>
        <boxGeometry args={[0.55, 0.04, 0.48]} />
        <meshStandardMaterial color="#0a0018" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.16, -0.52]} rotation={[0.05, 0, 0]}>
        <boxGeometry args={[0.55, 0.6, 0.04]} />
        <meshStandardMaterial color="#0a0018" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* ── GLOW LIGHT ── */}
      <pointLight ref={glowRef} position={[0, 0.5, 0.6]} color={isSpeaking ? '#FF0080' : '#7928CA'} intensity={0.6} distance={3} />

      {/* ── SCANLINE ── */}
      <mesh ref={scanRef}>
        <planeGeometry args={[1.4, 0.035]} />
        <meshBasicMaterial color="#00DFD8" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function Avatar3D({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 320 }}>
      <Canvas
        camera={{ position: [0, 0.15, 2.0], fov: 46 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
        }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 4, 3]} intensity={0.9} />
        <directionalLight position={[-2, 2, -1]} intensity={0.25} color="#a855f7" />

        <Stars radius={8} depth={4} count={250} factor={0.3} saturation={0} fade speed={0.4} />

        <FemaleAvatar isSpeaking={isSpeaking} />
        <Desk />
        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.12}>
          <Laptop position={[0.05, -0.72, 0.36]} />
        </Float>

        {CODE_LINES.map((line, i) => (
          <Float key={i} speed={0.7 + i * 0.1} floatIntensity={0.15}>
            <CodeSnippet
              text={line}
              position={[(i % 2 === 0 ? -1 : 1) * (0.7 + (i % 3) * 0.1), 0.5 - i * 0.25, -0.3]}
              delay={i * 0.8}
            />
          </Float>
        ))}
      </Canvas>
    </div>
  );
}
