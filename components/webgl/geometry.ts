import * as THREE from "three";
import type { Form, Tread } from "@/lib/forms";

/** Smooth interpolation across a width profile, heel (t=0) to toe (t=1). */
function halfWidth(t: number, fm: Form) {
  const pts: [number, number][] = [
    [0.0, fm.heel * 0.62],
    [0.1, fm.heel],
    [0.34, Math.min(fm.heel, fm.width) * 0.84],
    [0.68, fm.width],
    [0.88, fm.width * 0.92],
    [1.0, fm.width * fm.toe * 0.42],
  ];
  for (let i = 0; i < pts.length - 1; i++) {
    const [t0, v0] = pts[i];
    const [t1, v1] = pts[i + 1];
    if (t >= t0 && t <= t1) {
      const k = (t - t0) / (t1 - t0);
      const e = 0.5 - Math.cos(k * Math.PI) / 2; // cosine ease
      return v0 + (v1 - v0) * e;
    }
  }
  return fm.width;
}

/** Closed footprint outline. X runs heel to toe, Y is width. */
export function footprint(fm: Form): THREE.Shape {
  const N = 34;
  const L = fm.len / 2;
  const top: THREE.Vector2[] = [];
  const bottom: THREE.Vector2[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = -L + t * fm.len;
    const hw = halfWidth(t, fm);
    top.push(new THREE.Vector2(x, hw));
    bottom.push(new THREE.Vector2(x, -hw));
  }
  const s = new THREE.Shape();
  s.moveTo(top[0].x, top[0].y);
  s.splineThru(top.slice(1));
  s.splineThru(bottom.reverse());
  s.closePath();
  return s;
}


/** Extrudes the footprint into a slab. Returns geometry lying flat (Y up). */
export function slab(fm: Form, depth: number, inset: number, detail: boolean) {
  const shape = inset === 0 ? footprint(fm) : footprint({ ...fm, width: fm.width - inset, heel: fm.heel - inset, len: fm.len - inset * 2 });
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: Math.min(0.05, depth * 0.35),
    bevelSize: Math.min(0.045, depth * 0.3),
    bevelSegments: detail ? 4 : 1,
    curveSegments: detail ? 10 : 4,
  });
  // Extrusion runs along +Z; stand it up so thickness is vertical.
  g.rotateX(-Math.PI / 2);
  g.computeVertexNormals();
  return g;
}

export type TreadSpec = {
  geo: THREE.BufferGeometry;
  placements: THREE.Matrix4[];
};

/** Tread geometry appropriate to the shoe's actual ground. */
export function tread(fm: Form, kind: Tread, detail: boolean): TreadSpec | null {
  if (kind === "none" || kind === "smooth") return null;
  const L = fm.len / 2;
  const y = -0.001;
  const placements: THREE.Matrix4[] = [];
  const push = (x: number, z: number, sx = 1, sy = 1, sz = 1, rot = 0) => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rot, 0));
    m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(sx, sy, sz));
    placements.push(m);
  };


  const rows = detail ? 11 : 6;

  if (kind === "lug") {
    // Chunky blocks that survive abrasive cement.
    for (let r = 0; r < rows; r++) {
      const t = r / (rows - 1);
      const x = -L * 0.82 + t * fm.len * 0.82;
      const hw = halfWidth(t, fm) * 0.66;
      for (let c = -1; c <= 1; c++) {
        if (c === 0 && t > 0.25 && t < 0.62) continue; // arch stays clear
        push(x, c * hw, 1, 1, 1);
      }
    }
    return { geo: new THREE.BoxGeometry(0.15, 0.05, 0.12), placements };
  }

  if (kind === "nub") {
    // Dense multi-directional nubs: grip turf without catching in it.
    for (let r = 0; r < rows + 4; r++) {
      const t = r / (rows + 3);
      const x = -L * 0.86 + t * fm.len * 0.86;
      const hw = halfWidth(t, fm) * 0.74;
      for (let c = -2; c <= 2; c++) {
        push(x, (c / 2) * hw, 1, 1, 1, (r + c) * 0.4);
      }
    }
    return { geo: new THREE.CylinderGeometry(0.032, 0.042, 0.045, detail ? 6 : 4), placements };
  }

  if (kind === "stud") {
    // Moulded studs for cement and matting, not turf spikes.
    const spots: [number, number][] = [
      [0.06, 0.55], [0.06, -0.55], [0.2, 0.0],
      [0.78, 0.62], [0.78, -0.62], [0.92, 0.34], [0.92, -0.34], [0.64, 0.0],
    ];
    spots.forEach(([t, c]) => {
      const x = -L + t * fm.len;
      push(x, c * halfWidth(t, fm), 1, 1, 1);
    });
    return { geo: new THREE.ConeGeometry(0.05, 0.075, detail ? 8 : 5), placements };
  }

  // channel — drainage cut across the sole, the Dry System read
  for (let r = 0; r < rows; r++) {
    const t = r / (rows - 1);
    const x = -L * 0.8 + t * fm.len * 0.8;
    push(x, 0, 1, 1, halfWidth(t, fm) * 13);
  }
  return { geo: new THREE.BoxGeometry(0.055, 0.05, 0.1), placements };
}
