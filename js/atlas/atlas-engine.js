/**
 * Motor 3D do Atlas Anatômico do LabSim (Versão 2.0 Avançada).
 * Recursos incluídos:
 * - 2.234 malhas anatômicas consolidadas em 15 draw calls (1 por sistema biológico)
 * - Translação, visibilidade e seleção controladas via DataTexture e Shaders customizados
 * - Layout de explosão bidimensional sem sobreposição (Shelf Bin Packing)
 * - Planos de Corte Tomográfico (Axial, Coronal e Sagital) via WebGL local clipping
 * - Modo Raio-X / Transparência Dinâmica holográfica
 * - Captura e exportação de imagem fotográfica médica em PNG (Snapshot)
 * - Picking cinemático inteligente com Bounding Box e projeção em tela
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createExplosionLayout } from './explosion-layout.js';
import { decodeModelResponse } from './model-download.js';
import { PointerTap } from './pointer-tap.js';
import { SYSTEMS } from './anatomy-data.js';

export class AtlasEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      modelBasePath: options.modelBasePath || 'models/atlas/',
      onSelect: options.onSelect || (() => {}),
      onProgress: options.onProgress || (() => {}),
      onError: options.onError || (() => {}),
      onHover: options.onHover || (() => {})
    };

    this.atlas = null;
    this.state = {
      explode: 0,
      visible: SYSTEMS.map(s => s.id),
      selected: [],
      isolate: false,
      view: 'three-quarter',
      rotate: false,
      reset: 0,
      inspectorOpen: false,
      xray: false,
      clipEnabled: false,
      clipPlaneType: 'axial', // 'axial' | 'sagittal' | 'coronal'
      clipValue: 0.9          // Altura / deslocamento do corte
    };

    this.disposed = false;
    this.ready = false;
    this.dirty = true;
    this.isFemaleModel = false;
    this.currentExplode = 0;
    this.layoutKey = '';
    this.lastView = '';
    this.lastReset = -1;
    this.lastIsolate = '';
    this.packingWidth = 1;
    this.packingHeight = 1;

    // Plano de corte tomográfico
    this.clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 10.0); // Inicialmente fora do corpo
    this.hiddenParts = new Set(); // Conjunto de peças ocultadas pelo usuário (dissecação virtual)

    this.initScene();
  }

  initScene() {
    const el = this.container;

    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true // Permite captura de snapshots em PNG
      });
    } catch (err) {
      this.options.onError('Não foi possível iniciar o visualizador 3D WebGL neste navegador.');
      return;
    }

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
    this.renderer.setClearColor(0x0a0e17); // Fundo azul marinho cirúrgico profundo do LabSim
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.renderer.localClippingEnabled = true; // Habilita cortes tomográficos locais
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    el.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(34, el.clientWidth / el.clientHeight, 0.005, 100);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.camera.position.set(1.4, 1.05, 3.6);
    this.controls.target.set(0, 0.85, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.085;
    this.controls.minDistance = 0.07;
    this.controls.maxDistance = 40;
    this.controls.maxPolarAngle = Math.PI * 0.96;
    this.controls.addEventListener('change', () => { this.dirty = true; });

    // Ambiente IBL com RoomEnvironment
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04);
    this.scene.environment = env.texture;
    room.dispose();
    pmrem.dispose();
    this.envTexture = env;

    // Iluminação cirúrgica de alto contraste
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x111827, 1.15));
    const keyLight = new THREE.DirectionalLight(0xfffaf4, 2.5);
    keyLight.position.set(-2, 4, 3);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00d26a, 0.9); // Bio-verde característico do LabSim
    rimLight.position.set(2, 2, -3);
    this.scene.add(rimLight);

    // Tablado e anéis do laboratório
    this.platformGroup = new THREE.Group();
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(25, 64),
      new THREE.MeshStandardMaterial({ color: 0x06090f, roughness: 0.96 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.019;
    this.platformGroup.add(ground);

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68, 0.7, 0.028, 96),
      new THREE.MeshStandardMaterial({ color: 0x111a28, metalness: 0.25, roughness: 0.55 })
    );
    platform.position.y = -0.016;
    this.platformGroup.add(platform);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.63, 0.633, 128),
      new THREE.MeshBasicMaterial({ color: 0x0066cc, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.001;
    this.platformGroup.add(ring);

    this.scene.add(this.platformGroup);

    // Estruturas de picking e eventos
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.tap = new PointerTap();
    this.worldBox = new THREE.Box3();
    this.hitPoint = new THREE.Vector3();
    this.projected = new THREE.Vector3();
    this.targets = [];

    this.bindEvents();
    this.startRenderLoop();
  }

  async loadAtlas(manifestUrl) {
    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();
    this.clearPreviousGeometry();

    // Detecta modelo feminino pelo nome do manifesto
    this.isFemaleModel = manifestUrl.includes('female');

    try {
      this.options.onProgress(5);
      const res = await fetch(manifestUrl, { signal: this.abortController.signal });
      if (!res.ok) throw new Error('Não foi possível carregar o manifesto do atlas.');
      this.atlas = await res.json();
      await this.buildAnatomyGeometry();
    } catch (err) {
      if (err.name !== 'AbortError') {
        this.options.onError(err.message || 'Erro ao carregar o atlas anatômico.');
      }
    }
  }

  clearPreviousGeometry() {
    if (this.scene) {
      const toRemove = [];
      this.scene.children.forEach(child => {
        if (child !== this.platformGroup && !(child instanceof THREE.Light)) {
          toRemove.push(child);
        }
      });
      toRemove.forEach(child => {
        this.scene.remove(child);
        if (child.geometry) child.geometry.dispose();
      });
    }
    if (this.geometries) {
      this.geometries.forEach(g => g.dispose());
      this.geometries = [];
    }
    if (this.materials) {
      this.materials.forEach(m => m.dispose());
      this.materials = [];
    }
    if (this.partTexture) {
      this.partTexture.dispose();
      this.partTexture = null;
    }
    if (this.selectionTexture) {
      this.selectionTexture.dispose();
      this.selectionTexture = null;
    }
    this.pickers = [];
    this.targets = [];
    this.layoutKey = '';
    if (this.systemMaterials) {
      this.systemMaterials.forEach(m => m.dispose());
      this.systemMaterials = null;
    }
    if (this.hiddenParts) this.hiddenParts.clear();
  }

  async buildAnatomyGeometry() {
    const atlas = this.atlas;
    const partsCount = atlas.parts.length;

    // Aloca texturas GPU para controle de translação (partState) e seleção (selectionState)
    this.textureWidth = THREE.MathUtils.ceilPowerOfTwo(partsCount);
    this.partData = new Float32Array(this.textureWidth * 4);
    this.partTexture = new THREE.DataTexture(this.partData, this.textureWidth, 1, THREE.RGBAFormat, THREE.FloatType);
    this.partTexture.needsUpdate = true;

    this.selectionData = new Uint8Array(this.textureWidth * 4);
    this.selectionTexture = new THREE.DataTexture(this.selectionData, this.textureWidth, 1);
    this.selectionTexture.needsUpdate = true;

    this.materials = [];
    this.geometries = [];
    this.pickers = [];
    this.offsets = [];
    this.centers = atlas.parts.map(p =>
      new THREE.Vector3().fromArray(p.bounds[0]).add(new THREE.Vector3().fromArray(p.bounds[1])).multiplyScalar(0.5)
    );
    this.bounds = atlas.parts.map(p =>
      new THREE.Box3(new THREE.Vector3().fromArray(p.bounds[0]), new THREE.Vector3().fromArray(p.bounds[1]))
    );

    // Uniform global reativo para o modo Raio-X
    this.xrayUniform = { value: 0.0 };

    // Cria materiais com Shaders Customizados
    const materialForSystem = (systemId) => {
      const sysDef = SYSTEMS.find(s => s.id === systemId);
      const color = sysDef ? sysDef.color : '#aebbb8';
      const isSkin = systemId === 'integumentary';

      // No modelo feminino, a pele é a superfície principal de referência
      // e precisa de opacidade maior para ser visível como corpo sólido.
      // No modelo masculino, a pele é fantasma para revelar os órgãos internos.
      const skinOpacity = this.isFemaleModel ? 0.45 : 0.12;

      const mat = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.1,
        roughness: 0.52,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSkin ? skinOpacity : 1.0,
        depthWrite: !isSkin,
        clippingPlanes: [this.clipPlane],
        clipShadows: true
      });

      mat.onBeforeCompile = (shader) => {
        shader.uniforms.partState = { value: this.partTexture };
        shader.uniforms.selectionState = { value: this.selectionTexture };
        shader.uniforms.stateWidth = { value: this.textureWidth };
        shader.uniforms.xrayAmount = this.xrayUniform;

        shader.vertexShader =
          'attribute float partIndex;\n' +
          'uniform sampler2D partState;\n' +
          'uniform sampler2D selectionState;\n' +
          'uniform float stateWidth;\n' +
          'varying float partVisible;\n' +
          'varying float partSelected;\n' +
          shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\n' +
          'vec2 stateUv = vec2((partIndex + 0.5) / stateWidth, 0.5);\n' +
          'vec4 state = texture2D(partState, stateUv);\n' +
          'transformed += state.xyz;\n' +
          'partVisible = state.w;\n' +
          'partSelected = texture2D(selectionState, stateUv).r;\n'
        );

        shader.fragmentShader =
          'varying float partVisible;\n' +
          'varying float partSelected;\n' +
          'uniform float xrayAmount;\n' +
          shader.fragmentShader;

        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <clipping_planes_fragment>',
          '#include <clipping_planes_fragment>\n' +
          'if (partVisible < 0.5) discard;\n'
        );

        // Cor de destaque LabSim ao selecionar: ciano / bio-azul vibrante com emissão sutil
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <color_fragment>',
          '#include <color_fragment>\n' +
          'diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.0, 0.88, 0.95), partSelected * 0.85);\n' +
          'if (xrayAmount > 0.05 && partSelected < 0.5) { diffuseColor.a *= mix(1.0, 0.28, xrayAmount); }\n'
        );
      };

      this.materials.push(mat);
      return mat;
    };

    this.systemMaterials = new Map(SYSTEMS.map(s => [s.id, materialForSystem(s.id)]));

    // Carregamento progressivo em 3 workers concorrentes
    let loadedChunks = 0;
    const totalChunks = atlas.chunks.length;

    const loadSingleChunk = async (chunkIndex) => {
      const chunk = atlas.chunks[chunkIndex];
      const filename = (chunk.gzip || chunk.url).split('/').pop();
      const chunkUrl = new URL(filename, new URL(this.options.modelBasePath, window.location.href)).href;

      const isCompressed = !!chunk.gzip;
      const response = await fetch(chunkUrl, { signal: this.abortController.signal });
      const buffer = await decodeModelResponse(response, chunk.bytes, isCompressed);

      if (this.disposed) return;

      const systemGroups = new Map();

      atlas.parts.forEach((p, i) => {
        if (p.chunk !== chunkIndex) return;

        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buffer, p.positions, p.vertexCount * 3), 3));
        g.setAttribute('normal', new THREE.BufferAttribute(new Int16Array(buffer, p.normals, p.vertexCount * 3), 3, true));
        g.setIndex(new THREE.BufferAttribute(new Uint32Array(buffer, p.indices, p.indexCount), 1));

        g.boundingBox = this.bounds[i].clone();
        g.computeBoundingSphere();

        // Mesh leve para colisão de picking
        const pickMesh = new THREE.Mesh(g);
        pickMesh.matrixAutoUpdate = false;
        this.pickers[i] = pickMesh;
        this.geometries.push(g);

        // Identificador da peça injetado em cada vértice
        g.setAttribute('partIndex', new THREE.BufferAttribute(new Float32Array(p.vertexCount).fill(i), 1));

        const list = systemGroups.get(p.system) || [];
        list.push(g);
        systemGroups.set(p.system, list);
      });

      // Mescla todas as malhas do mesmo sistema em um único Draw Call
      systemGroups.forEach((geomList, systemId) => {
        const merged = mergeGeometries(geomList, false);
        if (!merged) throw new Error(`Falha ao mesclar sistema ${systemId}`);
        this.geometries.push(merged);

        const mesh = new THREE.Mesh(merged, this.systemMaterials.get(systemId));
        mesh.frustumCulled = false;
        this.scene.add(mesh);
      });

      loadedChunks++;
      const progressPercent = Math.round((loadedChunks / totalChunks) * 100);
      this.options.onProgress(progressPercent);
      this.dirty = true;
    };

    let cursor = 0;
    await Promise.all(
      Array.from({ length: 3 }, async () => {
        while (cursor < totalChunks) {
          const idx = cursor++;
          await loadSingleChunk(idx);
        }
      })
    );

    if (!this.disposed) {
      this.ready = true;
      this.dirty = true;
      this.updateSceneState(this.state);
    }
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };

    // Atualiza uniform de Raio-X
    if ('xray' in partialState) {
      this.xrayUniform.value = this.state.xray ? 1.0 : 0.0;
    }

    // Atualiza plano de corte tomográfico
    if ('clipEnabled' in partialState || 'clipPlaneType' in partialState || 'clipValue' in partialState) {
      this.updateClipping();
    }

    this.dirty = true;
  }

  updateClipping() {
    if (!this.state.clipEnabled) {
      this.clipPlane.constant = 10.0; // Desativa corte retirando o plano do corpo
      this.clipPlane.normal.set(0, -1, 0);
    } else {
      const type = this.state.clipPlaneType;
      const val = this.state.clipValue;

      if (type === 'axial') {
        // Corte horizontal (altura do corpo Y de 0 a 1.8m)
        this.clipPlane.normal.set(0, -1, 0);
        this.clipPlane.constant = val;
      } else if (type === 'sagittal') {
        // Corte longitudinal lateral (X de -0.35m a +0.35m)
        this.clipPlane.normal.set(-1, 0, 0);
        this.clipPlane.constant = val;
      } else if (type === 'coronal') {
        // Corte coronal frente/costas (Z de -0.2m a +0.2m)
        this.clipPlane.normal.set(0, 0, -1);
        this.clipPlane.constant = val;
      }
    }
  }

  updateSceneState(s) {
    if (!this.atlas || !this.ready) return;

    const visibleSet = new Set(s.visible);
    const selectionSet = new Set(s.selected);

    const visibleParts = this.atlas.parts.filter(p =>
      !this.hiddenParts.has(p.id) && (s.isolate ? selectionSet.has(p.id) : visibleSet.has(p.system) || selectionSet.has(p.id))
    );

    const nextLayoutKey = `${visibleParts.map(p => p.id).join(',')}:${this.camera.aspect.toFixed(3)}`;
    if (nextLayoutKey !== this.layoutKey) {
      const layout = createExplosionLayout(visibleParts, this.camera.aspect);
      this.packingWidth = layout.width;
      this.packingHeight = layout.height;

      this.atlas.parts.forEach((p, i) => {
        const cell = layout.cells.get(p.id);
        this.offsets[i] = cell ? new THREE.Vector3(cell.x, cell.y + 0.85, 0) : this.centers[i].clone();
      });

      this.layoutKey = nextLayoutKey;
    }

    const tTotal = this.currentExplode;

    this.atlas.parts.forEach((p, i) => {
      const c = this.centers[i];
      const dest = this.offsets[i];
      let dx = 0, dy = 0, dz = 0;

      if (tTotal <= 0.45) {
        // Estágio 1: Explosão radial ao redor do corpo
        const t = tTotal / 0.45;
        const groupIdx = SYSTEMS.findIndex(sys => sys.id === p.system);
        const angle = (groupIdx / SYSTEMS.length) * Math.PI * 2;
        dx = Math.sin(angle) * t * 0.48;
        dy = (c.y - 0.85) * t * 0.28;
        dz = Math.cos(angle) * t * 0.48;
      } else {
        // Estágio 2: Alinhamento planar no grid 2D
        const t = (tTotal - 0.45) / 0.55;
        const groupIdx = SYSTEMS.findIndex(sys => sys.id === p.system);
        const angle = (groupIdx / SYSTEMS.length) * Math.PI * 2;
        dx = THREE.MathUtils.lerp(Math.sin(angle) * 0.48, dest.x - c.x, t);
        dy = THREE.MathUtils.lerp((c.y - 0.85) * 0.28, dest.y - c.y, t);
        dz = THREE.MathUtils.lerp(Math.cos(angle) * 0.48, -c.z, t);
      }

      const isSelected = selectionSet.has(p.id);
      const isVis = !this.hiddenParts.has(p.id) && (s.isolate ? isSelected : (visibleSet.has(p.system) || isSelected));

      this.partData.set([dx, dy, dz, isVis ? 1 : 0], i * 4);
      this.selectionData[i * 4] = isSelected ? 255 : 0;

      const pickMesh = this.pickers[i];
      if (pickMesh) {
        pickMesh.position.set(dx, dy, dz);
        pickMesh.updateMatrix();
        pickMesh.updateMatrixWorld(true);
      }
    });

    this.partTexture.needsUpdate = true;
    this.selectionTexture.needsUpdate = true;
  }

  fitCamera(view, extent = 0) {
    const el = this.container;
    const isMobile = el.clientWidth < 768;
    const fovRad = THREE.MathUtils.degToRad(this.camera.fov / 2);

    const normalDistance = isMobile
      ? Math.max(4.5, (1.8 * el.clientHeight) / Math.max(160, el.clientHeight - 350) / (2 * Math.tan(fovRad)))
      : 4.0;

    const reservedHeight = isMobile ? 320 : 260;
    const availableAspect = Math.max(0.35, (el.clientWidth - (isMobile ? 40 : 340)) / Math.max(160, el.clientHeight - reservedHeight));
    const atlasDistance =
      ((Math.max(this.packingHeight, this.packingWidth / availableAspect) / (2 * Math.tan(fovRad))) *
        (el.clientHeight / Math.max(160, el.clientHeight - reservedHeight))) *
      1.08;

    const distance = THREE.MathUtils.lerp(normalDistance, Math.max(0.2, atlasDistance), extent);
    if (extent > 0.8) view = 'front';

    const direction =
      view === 'front'
        ? new THREE.Vector3(0, 0.02, 1)
        : view === 'back'
        ? new THREE.Vector3(0, 0.02, -1)
        : view === 'side'
        ? new THREE.Vector3(1, 0.02, 0)
        : new THREE.Vector3(0.35, 0.06, 1).normalize();

    this.controls.target.set(
      extent > 0.1 && el.clientWidth > 767 ? -this.packingWidth * 0.12 : 0,
      extent > 0.1 || isMobile ? 0.85 : 0.68,
      0
    );

    this.camera.position.copy(this.controls.target).addScaledVector(direction, distance);
    this.controls.update();
    this.dirty = true;
  }

  focusIsolated() {
    const s = this.state;
    const el = this.container;
    const box = new THREE.Box3();

    this.atlas.parts.forEach((p, i) => {
      if (s.selected.includes(p.id)) {
        const offsetVec = new THREE.Vector3(this.partData[i * 4], this.partData[i * 4 + 1], this.partData[i * 4 + 2]);
        box.union(this.bounds[i].clone().translate(offsetVec));
      }
    });

    if (box.isEmpty()) return;

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const w = el.clientWidth;
    const h = el.clientHeight;
    const isMobile = w < 768;

    let left = 20, right = w - 20, top = isMobile ? 160 : 100, bottom = h - 160;
    if (s.inspectorOpen) {
      if (isMobile) {
        bottom = h * 0.5;
      } else {
        right = w - 380;
      }
    }

    const availableWidth = Math.max(150, right - left);
    const availableHeight = Math.max(50, bottom - top);

    this.camera.setViewOffset(w, h, w / 2 - (left + right) / 2, h / 2 - (top + bottom) / 2, w, h);

    const fovRad = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const distance = Math.max(
      0.07,
      (Math.max((size.y * h) / availableHeight, (size.x * w) / availableWidth / this.camera.aspect, size.z) /
        (2 * Math.tan(fovRad))) *
        1.35
    );

    this.controls.maxDistance = Math.max(40, distance * 2);
    this.controls.target.copy(center);
    this.camera.position.copy(center).add(new THREE.Vector3(0.2, 0.1, 1).normalize().multiplyScalar(distance));
    this.controls.update();
    this.dirty = true;
  }

  hideSelected() {
    this.state.selected.forEach(id => this.hiddenParts.add(id));
    this.setState({ selected: [] });
    this.updateSceneState(this.state);
  }

  showAllParts() {
    this.hiddenParts.clear();
    this.updateSceneState(this.state);
  }

  takeSnapshot() {
    this.dirty = true;
    this.renderer.render(this.scene, this.camera);
    const dataUrl = this.renderer.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `labsim-atlas-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }

  findTarget2D(x, y, radius = 16) {
    let best = -1;
    let score = Infinity;

    for (const t of this.targets) {
      const dx = Math.max(t.left - x, 0, x - t.right);
      const dy = Math.max(t.top - y, 0, y - t.bottom);
      const dist = Math.hypot(dx, dy);
      if (dist > radius) continue;

      const candidate = dist + Math.hypot(t.x - x, t.y - y) * 0.025;
      if (candidate < score) {
        score = candidate;
        best = t.index;
      }
    }
    return best;
  }

  bindEvents() {
    const dom = this.renderer.domElement;

    dom.addEventListener('pointerdown', (e) => {
      this.tap.down(e.pointerId, e.clientX, e.clientY, e.pointerType === 'touch' ? 12 : 5);
    });

    dom.addEventListener('pointermove', (e) => {
      this.tap.move(e.pointerId, e.clientX, e.clientY);
      if (e.buttons || this.currentExplode < 0.5 || e.pointerType === 'touch') return;

      const rect = dom.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const hitIdx = this.findTarget2D(x, y, 14);
      dom.style.cursor = hitIdx < 0 ? 'grab' : 'pointer';

      if (hitIdx >= 0 && this.atlas) {
        this.options.onHover(this.atlas.parts[hitIdx], e.clientX, e.clientY);
      } else {
        this.options.onHover(null);
      }
    });

    dom.addEventListener('pointerup', (e) => {
      const isCleanTap = this.tap.up(e.pointerId, e.clientX, e.clientY);
      if (!isCleanTap || !this.ready || !this.atlas) return;

      const rect = dom.getBoundingClientRect();
      this.pointer.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      this.raycaster.setFromCamera(this.pointer, this.camera);

      let nearest = Infinity;
      let foundIndex = -1;
      const hasSolid = this.atlas.parts.some(
        (p, i) => p.system !== 'integumentary' && this.partData[i * 4 + 3] > 0.5
      );

      this.pickers.forEach((mesh, i) => {
        if (!mesh || this.partData[i * 4 + 3] < 0.5) return;
        if (hasSolid && this.atlas.parts[i].system === 'integumentary') return;

        this.worldBox.copy(this.bounds[i]).translate(mesh.position);
        if (!this.raycaster.ray.intersectBox(this.worldBox, this.hitPoint)) return;

        const hits = this.raycaster.intersectObject(mesh, false);
        if (hits[0] && hits[0].distance < nearest) {
          nearest = hits[0].distance;
          foundIndex = i;
        }
      });

      // Fallback para seleção de peças pequenas na vista explodida
      if (foundIndex < 0 && this.currentExplode > 0.45) {
        foundIndex = this.findTarget2D(e.clientX - rect.left, e.clientY - rect.top, e.pointerType === 'touch' ? 24 : 16);
      }

      if (foundIndex >= 0) {
        this.options.onSelect(this.atlas.parts[foundIndex]);
      }
    });

    dom.addEventListener('pointercancel', (e) => {
      this.tap.cancel(e.pointerId);
    });

    this.resizeObserver = new ResizeObserver(() => {
      this.layoutKey = '';
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, w < 768 || h < 600 ? 1.5 : 2));
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this.fitCamera(this.state.view, this.currentExplode);
    });
    this.resizeObserver.observe(this.container);
  }

  startRenderLoop() {
    const clock = new THREE.Clock();

    const animate = () => {
      if (this.disposed) return;
      this.animFrame = requestAnimationFrame(animate);

      const dt = Math.min(clock.getDelta(), 0.05);
      const s = this.state;

      const isMoving = Math.abs(this.currentExplode - s.explode) > 0.0001;
      if (isMoving) {
        this.currentExplode = THREE.MathUtils.damp(this.currentExplode, s.explode, 8, dt);
        this.dirty = true;
        this.updateSceneState(s);
        if (!s.isolate) {
          this.fitCamera(this.currentExplode > 0.5 ? 'front' : s.view, Math.max(0, (this.currentExplode - 0.3) / 0.7));
        }
      }

      if (s.view !== this.lastView || s.reset !== this.lastReset) {
        this.fitCamera(s.view, this.currentExplode);
        this.lastView = s.view;
        this.lastReset = s.reset;
      }

      const isolateKey = s.isolate
        ? `${s.selected.join(',')}:${s.reset}:${s.inspectorOpen}:${this.camera.aspect}`
        : '';

      if (isolateKey !== this.lastIsolate) {
        if (s.isolate) {
          this.focusIsolated();
        } else if (this.lastIsolate) {
          this.camera.clearViewOffset();
          this.fitCamera(s.view, this.currentExplode);
        }
        this.lastIsolate = isolateKey;
      }

      this.controls.enableRotate = this.currentExplode < 0.8;
      this.controls.mouseButtons.LEFT = this.currentExplode < 0.8 ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN;
      this.controls.touches.ONE = this.currentExplode < 0.8 ? THREE.TOUCH.ROTATE : THREE.TOUCH.PAN;

      this.platformGroup.visible = this.currentExplode < 0.5 && !s.isolate;
      this.controls.autoRotate = s.rotate && !s.isolate && this.currentExplode < 0.4;
      this.controls.autoRotateSpeed = 0.65;
      this.controls.update();

      if (this.controls.autoRotate) this.dirty = true;

      if (this.dirty) {
        this.renderer.render(this.scene, this.camera);
        this.targets = [];

        // Atualiza os retângulos de tela para o modo explodido
        if (this.currentExplode > 0.45 && this.atlas) {
          const w = this.container.clientWidth;
          const h = this.container.clientHeight;
          const hasSolid = this.atlas.parts.some(
            (p, i) => p.system !== 'integumentary' && this.partData[i * 4 + 3] > 0.5
          );

          this.atlas.parts.forEach((p, i) => {
            if (this.partData[i * 4 + 3] < 0.5 || (hasSolid && p.system === 'integumentary')) return;

            let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
            for (let corner = 0; corner < 8; corner++) {
              this.projected.set(
                p.bounds[corner & 1 ? 1 : 0][0] + this.partData[i * 4],
                p.bounds[corner & 2 ? 1 : 0][1] + this.partData[i * 4 + 1],
                p.bounds[corner & 4 ? 1 : 0][2] + this.partData[i * 4 + 2]
              ).project(this.camera);

              const px = ((this.projected.x + 1) * w) / 2;
              const py = ((1 - this.projected.y) * h) / 2;
              left = Math.min(left, px);
              right = Math.max(right, px);
              top = Math.min(top, py);
              bottom = Math.max(bottom, py);
            }

            this.projected.copy(this.centers[i]).add(
              new THREE.Vector3(this.partData[i * 4], this.partData[i * 4 + 1], this.partData[i * 4 + 2])
            ).project(this.camera);

            if (this.projected.z >= -1 && this.projected.z <= 1) {
              this.targets.push({
                index: i,
                x: ((this.projected.x + 1) * w) / 2,
                y: ((1 - this.projected.y) * h) / 2,
                left, right, top, bottom
              });
            }
          });
        }
        this.dirty = false;
      }
    };

    animate();
  }

  dispose() {
    this.disposed = true;
    if (this.abortController) this.abortController.abort();
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    if (this.resizeObserver) this.resizeObserver.disconnect();

    this.controls.dispose();
    this.geometries.forEach(g => g.dispose());
    this.materials.forEach(m => m.dispose());
    if (this.envTexture) this.envTexture.dispose();
    if (this.partTexture) this.partTexture.dispose();
    if (this.selectionTexture) this.selectionTexture.dispose();

    this.renderer.dispose();
    if (this.renderer.domElement) this.renderer.domElement.remove();
  }
}
