import * as THREE from "three";
import type { Tread } from "@/lib/forms";

/* ═══════════════════════════════════════════════════════════════════════════
   MATERIAL STUDY GEOMETRY
   ---------------------------------------------------------------------------
   A rounded rectangular sample, layered into a cross-section, carrying the
   tread of whichever shoe owns the viewport. Deliberately not shoe-shaped:
   an obvious material study invites no comparison with a real product, where
   an almost-right shoe invites nothing but.
   ═══════════════════════════════════════════════════════════════════════════ */

export type TreadSpec = {
  geo: THREE.BufferGeometry;
  placements: THREE.Matrix4[];
};

function roundedRect(w: number, d: number, r: number) {
  const s = new THREE.Shape();
  const x = w / 2;
  const y = d / 2;
  s.moveTo(-x + r, -y);
  s.lineTo(x - r, -y);
  s.quadraticCurveTo(x, -y, x, -y + r);
  s.lineTo(x, y - r);
  s.quadraticCurveTo(x, y, x - r, y);
  s.lineTo(-x + r, y);
  s.quadraticCurveTo(-x, y, -x, y - r);
  s.lineTo(-x, -y + r);
  s.quadraticCurveTo(-x, -y, -x + r, -y);
  return s;
}

/** One layer of the sample stack, lying flat with thickness on Y. */
export function plate(w: number, d: number, thickness: number, detail: boolean) {
  const g = new THREE.ExtrudeGeometry(roundedRect(w, d, Math.min(0.18, d * 0.16)), {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: Math.min(0.022, thickness * 0.3),
    bevelSize: Math.min(0.02, thickness * 0.28),
    bevelSegments: detail ? 3 : 1,
    curveSegments: detail ? 8 : 3,
  });
  g.rotateX(-Math.PI / 2);
  g.computeVertexNormals();
  return g;
}


/** Tread laid out across the underside of the sample. */
export function plateTread(
  w: number,
  d: number,
  kind: Tread,
  detail: boolean
): TreadSpec | null {
  if (kind === "none" || kind === "smooth") return null;
  const placements: THREE.Matrix4[] = [];
  const push = (x: number, z: number, rot = 0, sz = 1) => {
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rot, 0));
    placements.push(
      new THREE.Matrix4().compose(
        new THREE.Vector3(x, 0, z),
        q,
        new THREE.Vector3(1, 1, sz)
      )
    );
  };

  const cols = detail ? 9 : 5;
  const rows = detail ? 6 : 3;
  const spanX = w * 0.86;
  const spanZ = d * 0.78;
  const stepX = spanX / (cols - 1);
  const stepZ = spanZ / (rows - 1);

  if (kind === "channel") {
    // Drainage, cut straight across — the Dry System read.
    for (let c = 0; c < cols; c++) push(-spanX / 2 + c * stepX, 0, 0, d * 7.4);
    return { geo: new THREE.BoxGeometry(0.05, 0.05, 0.1), placements };
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const stagger = r % 2 ? stepX * 0.5 : 0;
      push(-spanX / 2 + c * stepX + stagger, -spanZ / 2 + r * stepZ, (r + c) * 0.5);
    }
  }

  if (kind === "nub") {
    return { geo: new THREE.CylinderGeometry(0.03, 0.038, 0.05, detail ? 6 : 4), placements };
  }
  if (kind === "stud") {
    return { geo: new THREE.ConeGeometry(0.045, 0.075, detail ? 8 : 5), placements };
  }
  return { geo: new THREE.BoxGeometry(0.11, 0.05, 0.09), placements }; // lug
}
