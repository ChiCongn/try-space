import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeViewerProps {
  color?: string;
}

export function ThreeViewer({ color = "#c8963e" }: ThreeViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.8, 0.9),
      new THREE.MeshStandardMaterial({ color }),
    );
    scene.add(mesh);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2.2));
    camera.position.set(2.4, 1.6, 2.6);
    camera.lookAt(0, 0, 0);

    let frame = 0;
    function animate() {
      frame = requestAnimationFrame(animate);
      mesh.rotation.y += 0.008;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(frame);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [color]);

  return <div className="three-viewer" ref={mountRef} />;
}
