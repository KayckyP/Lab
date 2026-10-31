// Construtor do Atlas com suporte aos 8 Sistemas Anatômicos e Terminologia Bilíngue (PT / LA)
/* global PARTS, Geometry */

function buildProceduralAtlas() {
  const CAT = {
    skeletal: 'bone',
    muscular: 'muscle',
    nervous: 'nervous',
    cardiovascular: 'artery',
    respiratory: 'organ',
    digestive: 'organ',
    urinary: 'organ',
    reproductive: 'organ'
  };

  const pos = [], nor = [], idx = [];
  const elements = [];
  let v0 = 0;

  PARTS.forEach((p, i) => {
    const g = p.shape === 'sphere' ? Geometry.genSphere(p.size[0])
      : p.shape === 'capsule' ? Geometry.genCapsule(p.size[0], p.size[1])
      : Geometry.genBox(p.size[0], p.size[1], p.size[2]);

    const [rx, ry, rz] = p.rot || [0, 0, 0];
    const rot = (x, y, z) => {
      let a = [x, y * Math.cos(rx) - z * Math.sin(rx), y * Math.sin(rx) + z * Math.cos(rx)];
      a = [a[0] * Math.cos(ry) + a[2] * Math.sin(ry), a[1], -a[0] * Math.sin(ry) + a[2] * Math.cos(ry)];
      return [a[0] * Math.cos(rz) - a[1] * Math.sin(rz), a[0] * Math.sin(rz) + a[1] * Math.cos(rz), a[2]];
    };

    const S = 0.2; // Escala humana ~1.75m
    const b = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
    for (let k = 0; k < g.positions.length; k += 3) {
      const r = rot(g.positions[k], g.positions[k + 1], g.positions[k + 2]);
      const q = [(r[0] + p.pos[0]) * S, (r[1] + p.pos[1] + 0.6) * S, (r[2] + p.pos[2]) * S];
      pos.push(q[0], q[1], q[2]);
      for (let a = 0; a < 3; a++) {
        b[a] = Math.min(b[a], q[a]);
        b[a + 3] = Math.max(b[a + 3], q[a]);
      }
      const n = rot(g.normals[k], g.normals[k + 1], g.normals[k + 2]);
      nor.push(Math.round(n[0] * 32767), Math.round(n[1] * 32767), Math.round(n[2] * 32767));
    }

    const o = idx.length;
    for (const t of g.indices) idx.push(t + v0);
    v0 += g.positions.length / 3;

    elements.push({
      k: 'LAB-' + p.id,
      c: -1,
      t: CAT[p.system] || 'organ',
      system: p.system,
      color: p.color || [0.8, 0.8, 0.8],
      o,
      n: g.indices.length,
      b
    });
  });

  // Conceitos ontológicos e hierarquia
  const concepts = [];
  const add = (c) => {
    concepts.push(Object.assign({ pp: [], pc: [], ip: [], ic: [], el: [] }, c));
    return concepts.length - 1;
  };

  const body = add({ id: 'LAB-BODY', name: 'Corpo Humano Completo', la: 'Corpus humanum' });

  // Os 8 Sistemas Vitais
  const groups = {
    skeletal: add({ id: 'SYS-SKEL', name: 'Sistema Esquelético', la: 'Systema skeletale' }),
    muscular: add({ id: 'SYS-MUSC', name: 'Sistema Muscular', la: 'Systema musculare' }),
    nervous: add({ id: 'SYS-NERV', name: 'Sistema Nervoso', la: 'Systema nervosum' }),
    cardiovascular: add({ id: 'SYS-CARD', name: 'Sistema Cardiovascular', la: 'Systema cardiovasculare' }),
    respiratory: add({ id: 'SYS-RESP', name: 'Sistema Respiratório', la: 'Systema respiratorium' }),
    digestive: add({ id: 'SYS-DIGE', name: 'Sistema Digestório', la: 'Systema digestorium' }),
    urinary: add({ id: 'SYS-URIN', name: 'Sistema Urinário', la: 'Systema urinarium' }),
    reproductive: add({ id: 'SYS-REPR', name: 'Sistema Reprodutor', la: 'Systema genitale' }),
  };

  const allEl = [];
  PARTS.forEach((p, i) => {
    const g = groups[p.system];
    const leaf = add({
      id: p.fma || ('LAB-' + p.id),
      name: p.pt || p.label,
      enName: p.label,
      la: p.la || '',
      system: p.system,
      pp: [g],
      ip: [g],
      el: [i]
    });
    elements[i].c = leaf;
    concepts[g].pc.push(leaf);
    concepts[g].ic.push(leaf);
    concepts[g].el.push(i);
    allEl.push(i);
  });

  for (const g of Object.values(groups)) {
    concepts[g].pp.push(body);
    concepts[body].pc.push(g);
  }
  concepts[body].el = allEl;

  const P = new Float32Array(pos);
  const N = new Int16Array(nor.length + (nor.length % 2));
  N.set(nor);
  const I = new Uint32Array(idx);

  const bin = new ArrayBuffer(P.byteLength + N.byteLength + I.byteLength);
  new Uint8Array(bin, 0, P.byteLength).set(new Uint8Array(P.buffer));
  new Uint8Array(bin, P.byteLength, N.byteLength).set(new Uint8Array(N.buffer));
  new Uint8Array(bin, P.byteLength + N.byteLength, I.byteLength).set(new Uint8Array(I.buffer));

  const bb = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
  for (const e of elements) {
    for (let a = 0; a < 3; a++) {
      bb[a] = Math.min(bb[a], e.b[a]);
      bb[a + 3] = Math.max(bb[a + 3], e.b[a + 3]);
    }
  }

  return {
    index: {
      format: 'open-anatomy-atlas/1',
      name: 'Atlas Anatômico LabSim (8 Sistemas Integrados)',
      version: '2.0.0',
      demo: true,
      attribution: 'LabSim + Open Anatomy Atlas (Cognition Lab SNUC) - Dados FMA / Z-Anatomy',
      license: 'MIT / CC BY-SA 4.0',
      categories: null,
      bbox: bb,
      counts: {
        elements: elements.length,
        concepts: concepts.length,
        triangles: I.length / 3,
        vertices: P.length / 3
      },
      buffers: {
        positions: [0, P.byteLength],
        normals: [P.byteLength, N.byteLength],
        indices: [P.byteLength + N.byteLength, I.byteLength]
      },
      elements,
      concepts,
      roots: { partof: [body], isa: Object.values(groups) }
    },
    bin
  };
}

if (typeof module !== 'undefined') module.exports = { buildProceduralAtlas };
if (typeof window !== 'undefined') window.buildProceduralAtlas = buildProceduralAtlas;
