import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCw, Eye, Sun, Moon, Compass, Play, Pause, Activity, Sparkles, Film } from 'lucide-react';

interface ThreeViewportProps {
  modelGroup: THREE.Group | null;
  className?: string;
}

export const ThreeViewport: React.FC<ThreeViewportProps> = ({ modelGroup, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentModelRef = useRef<THREE.Group | null>(null);

  // Animation and Rigging refs
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);
  const skeletonHelperRef = useRef<THREE.SkeletonHelper | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  const [isWireframe, setIsWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [lightingPreset, setLightingPreset] = useState<'studio' | 'cyberpunk' | 'daylight'>('cyberpunk');
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [availableClips, setAvailableClips] = useState<string[]>([]);
  const [activeClipName, setActiveClipName] = useState<string>('');
  const [isPlayingAnim, setIsPlayingAnim] = useState(true);
  const [isRiggedModel, setIsRiggedModel] = useState(false);
  const [rigTypeName, setRigTypeName] = useState<string>('Rigged');

  // Key lights refs to adjust color dynamically
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / (container.clientHeight || 1),
      0.1,
      100
    );
    camera.position.set(3.5, 3.0, 4.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 20;
    controls.minDistance = 1;
    controls.target.set(0, 0.8, 0);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 2.0;
    controlsRef.current = controls;

    // Lighting (Cinematic Unreal Engine PBR setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00f0ff, 1.8);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0xa855f7, 1.2);
    fillLight.position.set(-5, 4, -3);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const rimLight = new THREE.DirectionalLight(0xffaa00, 1.5);
    rimLight.position.set(0, 5, -6);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Grid Floor
    const grid = new THREE.GridHelper(12, 24, 0x00f0ff, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();
      
      // Update Mesh2Motion Animation Mixer
      if (mixerRef.current && isPlayingAnim) {
        mixerRef.current.update(delta);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Model in Scene & Setup Mesh2Motion Animations
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Cleanup previous model and helpers
    if (skeletonHelperRef.current) {
      scene.remove(skeletonHelperRef.current);
      skeletonHelperRef.current.dispose();
      skeletonHelperRef.current = null;
    }
    if (currentModelRef.current) {
      scene.remove(currentModelRef.current);
      currentModelRef.current = null;
    }
    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current = null;
    }

    if (modelGroup) {
      currentModelRef.current = modelGroup;
      scene.add(modelGroup);

      // Inspect for Mesh2Motion rigging and animations
      const animations: THREE.AnimationClip[] = (modelGroup as any).animations || [];
      const mesh2motionMeta = (modelGroup as any).__mesh2motion;

      if (animations.length > 0) {
        setIsRiggedModel(true);
        setRigTypeName(mesh2motionMeta?.rigType ? `${mesh2motionMeta.rigType.toUpperCase()} RIG` : 'SKELETAL RIG');
        const clipNames = animations.map((c) => c.name);
        setAvailableClips(clipNames);

        // Setup AnimationMixer
        const mixer = new THREE.AnimationMixer(modelGroup);
        mixerRef.current = mixer;

        // Play first clip (preferably Idle or first)
        const initialClip = animations.find((c) => c.name.toLowerCase().includes('idle')) || animations[0];
        if (initialClip) {
          const action = mixer.clipAction(initialClip);
          action.play();
          currentActionRef.current = action;
          setActiveClipName(initialClip.name);
        }
      } else {
        setIsRiggedModel(false);
        setAvailableClips([]);
        setActiveClipName('');
      }

      // Check if SkinnedMesh exists to attach SkeletonHelper
      let hasBones = false;
      modelGroup.traverse((child) => {
        if (child instanceof THREE.SkinnedMesh && child.skeleton) {
          hasBones = true;
        }
      });

      if (hasBones) {
        const helper = new THREE.SkeletonHelper(modelGroup);
        helper.visible = showSkeleton;
        (helper.material as THREE.LineBasicMaterial).linewidth = 2;
        (helper.material as THREE.LineBasicMaterial).color = new THREE.Color(0x00f0ff);
        scene.add(helper);
        skeletonHelperRef.current = helper;
      }

      // Re-apply wireframe mode if active
      modelGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => (m.wireframe = isWireframe));
          } else {
            child.material.wireframe = isWireframe;
          }
        }
      });

      // Fit camera to object bounds nicely
      const box = new THREE.Box3().setFromObject(modelGroup);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());

      if (controlsRef.current) {
        controlsRef.current.target.copy(center);
      }
      if (cameraRef.current) {
        cameraRef.current.position.set(center.x + size * 0.9, center.y + size * 0.7, center.z + size * 1.1);
        cameraRef.current.lookAt(center);
      }
    }
  }, [modelGroup]);

  // Switch Animation Clip
  const switchAnimation = (clipName: string) => {
    if (!mixerRef.current || !currentModelRef.current) return;
    const animations: THREE.AnimationClip[] = (currentModelRef.current as any).animations || [];
    const targetClip = animations.find((c) => c.name === clipName);
    if (!targetClip) return;

    const newAction = mixerRef.current.clipAction(targetClip);
    if (currentActionRef.current && currentActionRef.current !== newAction) {
      currentActionRef.current.fadeOut(0.25);
    }
    newAction.reset().fadeIn(0.25).play();
    currentActionRef.current = newAction;
    setActiveClipName(clipName);
    setIsPlayingAnim(true);
  };

  // Toggle Skeleton Helper
  useEffect(() => {
    if (skeletonHelperRef.current) {
      skeletonHelperRef.current.visible = showSkeleton;
    }
  }, [showSkeleton]);

  // Update Wireframe state
  useEffect(() => {
    if (!currentModelRef.current) return;
    currentModelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => (m.wireframe = isWireframe));
        } else {
          child.material.wireframe = isWireframe;
        }
      }
    });
  }, [isWireframe]);

  // Update Auto-rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Update Lighting Preset
  useEffect(() => {
    if (!keyLightRef.current || !fillLightRef.current || !rimLightRef.current || !sceneRef.current) return;

    if (lightingPreset === 'cyberpunk') {
      sceneRef.current.background = new THREE.Color(0x080c14);
      keyLightRef.current.color.setHex(0x00f0ff);
      keyLightRef.current.intensity = 1.8;
      fillLightRef.current.color.setHex(0xa855f7);
      fillLightRef.current.intensity = 1.2;
      rimLightRef.current.color.setHex(0xffaa00);
      rimLightRef.current.intensity = 1.5;
    } else if (lightingPreset === 'daylight') {
      sceneRef.current.background = new THREE.Color(0x1a2332);
      keyLightRef.current.color.setHex(0xfff7ed);
      keyLightRef.current.intensity = 2.2;
      fillLightRef.current.color.setHex(0x93c5fd);
      fillLightRef.current.intensity = 1.0;
      rimLightRef.current.color.setHex(0xfef08a);
      rimLightRef.current.intensity = 1.2;
    } else {
      // Studio
      sceneRef.current.background = new THREE.Color(0x111827);
      keyLightRef.current.color.setHex(0xffffff);
      keyLightRef.current.intensity = 1.6;
      fillLightRef.current.color.setHex(0xe2e8f0);
      fillLightRef.current.intensity = 1.0;
      rimLightRef.current.color.setHex(0xffffff);
      rimLightRef.current.intensity = 1.2;
    }
  }, [lightingPreset]);

  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    if (currentModelRef.current) {
      const box = new THREE.Box3().setFromObject(currentModelRef.current);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      controlsRef.current.target.copy(center);
      cameraRef.current.position.set(center.x + size * 0.9, center.y + size * 0.7, center.z + size * 1.1);
    } else {
      cameraRef.current.position.set(3.5, 3.0, 4.5);
      controlsRef.current.target.set(0, 0.8, 0);
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[320px] overflow-hidden select-none ${className}`}>
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: Mesh2Motion & PBR Status Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-cyan-500/30 text-[10px] font-mono text-cyan-400">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>UE5 PBR Shading: Nanite / Lumen Ready</span>
        </div>
        {isRiggedModel && (
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Mesh2Motion: {rigTypeName} • IK Compatible</span>
          </div>
        )}
      </div>

      {/* Top Right: Viewport Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg border border-white/10 shadow-xl z-10">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-1.5 rounded text-xs transition-colors ${
            autoRotate ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Toggle 360° Auto-Rotation"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsWireframe(!isWireframe)}
          className={`p-1.5 rounded text-xs transition-colors ${
            isWireframe ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Toggle Wireframe Mode"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        {isRiggedModel && (
          <button
            onClick={() => setShowSkeleton(!showSkeleton)}
            className={`p-1.5 rounded text-xs transition-colors ${
              showSkeleton ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle Skeleton / Bone Display (Mesh2Motion)"
          >
            <Activity className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={() => {
            const presets: ('cyberpunk' | 'daylight' | 'studio')[] = ['cyberpunk', 'daylight', 'studio'];
            const nextIdx = (presets.indexOf(lightingPreset) + 1) % presets.length;
            setLightingPreset(presets[nextIdx]);
          }}
          className="p-1.5 rounded text-xs text-amber-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
          title={`Lighting: ${lightingPreset.toUpperCase()} (Click to cycle)`}
        >
          {lightingPreset === 'cyberpunk' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={handleResetCamera}
          className="p-1.5 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Reset Camera View"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Bar: Animation Clip Selector (when rigged) */}
      {availableClips.length > 0 && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-2xl z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlayingAnim(!isPlayingAnim)}
              className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center justify-center"
              title={isPlayingAnim ? 'Pause Animation' : 'Play Animation'}
            >
              {isPlayingAnim ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <Film className="w-3.5 h-3.5 text-indigo-400" />
              <span>Clips:</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
            {availableClips.map((clip) => (
              <button
                key={clip}
                onClick={() => switchAnimation(clip)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all whitespace-nowrap ${
                  activeClipName === clip
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/20'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/5'
                }`}
              >
                {clip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Hint when not rigged */}
      {availableClips.length === 0 && (
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-400 bg-slate-900/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/5 pointer-events-none">
          Left-Click: Rotate • Right-Click: Pan • Scroll: Zoom
        </div>
      )}
    </div>
  );
};

