/**
 * Controlador de Interface Avançado do Atlas Anatômico 3D do LabSim.
 * Conecta os elementos visuais, a busca instantânea, a navegação dos 15 sistemas,
 * os planos de corte tomográfico, o modo Raio-X, o snapshot PNG
 * e as correlações didáticas cruzadas (Hematologia e Microscopia 3D).
 */

import { AtlasEngine } from './atlas-engine.js';
import { SYSTEMS, DEFAULT_VISIBLE, DEFAULT_VISIBLE_FEMALE, translateAnatomyName, getStructureExplanation, DIDACTIC_CARDS } from './anatomy-data.js';

export class AtlasApp {
  constructor() {
    this.container = document.getElementById('atlas-viewport');
    this.engine = null;
    this.atlas = null;
    this.sex = 'male'; // 'male' | 'female'
    this.selectedConcept = null;
    this.selectedPart = null;
    this.counts = {};

    this.init();
  }

  async init() {
    if (!this.container) return;

    this.setupUI();

    this.engine = new AtlasEngine(this.container, {
      modelBasePath: 'models/atlas/',
      onSelect: (part) => this.handlePartSelect(part),
      onProgress: (percent) => this.handleProgress(percent),
      onError: (msg) => this.handleError(msg),
      onHover: (part, x, y) => this.handleHover(part, x, y)
    });

    await this.engine.loadAtlas('models/atlas/atlas.json');
    this.atlas = this.engine.atlas;

    if (this.atlas) {
      this.calculateCounts();
      this.renderSystemsList();
      this.setupSearch();
    }
  }

  calculateCounts() {
    this.counts = Object.fromEntries(
      SYSTEMS.map(s => [s.id, this.atlas.parts.filter(p => p.system === s.id).length])
    );
  }

  async switchSex(newSex) {
    if (this.sex === newSex || !['male', 'female'].includes(newSex)) return;

    this.sex = newSex;

    // Atualiza botões visuais
    document.querySelectorAll('[data-sex]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-sex') === newSex);
    });

    // Exibe tela de carregamento
    const loadingScreen = document.getElementById('atlas-loading-screen');
    const loadingText = loadingScreen?.querySelector('p');
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
      loadingScreen.style.opacity = '1';
    }
    if (loadingText) {
      loadingText.textContent = newSex === 'female'
        ? 'Carregando Anatomia Feminina (Human Reference Atlas / HuBMAP)...'
        : 'Carregando Anatomia Masculina (BodyParts3D 4.0)...';
    }

    this.closeDetailPanel();

    const manifestUrl = newSex === 'female'
      ? 'models/atlas/atlas-female.json'
      : 'models/atlas/atlas.json';

    // Define os sistemas visíveis corretos para cada modelo
    const defaultVisible = newSex === 'female' ? DEFAULT_VISIBLE_FEMALE : DEFAULT_VISIBLE;

    // Reinicia estado de visibilidade e seleção antes de carregar o novo modelo
    this.engine.setState({
      visible: defaultVisible,
      selected: [],
      isolate: false,
      explode: 0,
      xray: false,
      clipEnabled: false,
      rotate: false
    });

    await this.engine.loadAtlas(manifestUrl);
    this.atlas = this.engine.atlas;

    if (this.atlas) {
      this.calculateCounts();
      this.renderSystemsList();
      this.updateCaption();
      this.updateVisibleCountBadge();
      this.engine.fitCamera('three-quarter', 0);
    }
  }

  setupUI() {
    // Seletor de Modelo Anatômico (Masculino / Feminino)
    document.querySelectorAll('[data-sex]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetSex = btn.getAttribute('data-sex');
        this.switchSex(targetSex);
      });
    });

    // Slider de explosão
    const explodeSlider = document.getElementById('explode-slider');
    const explodeValue = document.getElementById('explode-val');
    if (explodeSlider) {
      explodeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 100;
        if (explodeValue) explodeValue.textContent = `${Math.round(val * 100)}%`;
        this.engine.showAllParts();
    this.engine.setState({ explode: val, rotate: false });
        this.updateCaption();
      });
    }

    // Botões de câmera predefinidos
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        this.setView(view);
      });
    });

    // Auto rotação
    const rotateBtn = document.getElementById('btn-rotate');
    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => this.toggleRotate());
    }

    // Reset geral
    document.getElementById('btn-reset')?.addEventListener('click', () => this.resetAll());

    // Modo Raio-X
    const xrayBtn = document.getElementById('btn-xray');
    if (xrayBtn) {
      xrayBtn.addEventListener('click', () => this.toggleXray());
    }

    // Snapshot fotográfico PNG
    document.getElementById('btn-snapshot')?.addEventListener('click', () => {
      this.engine?.takeSnapshot();
    });

    // Tela Cheia (Fullscreen)
    document.getElementById('btn-fullscreen')?.addEventListener('click', () => {
      this.toggleFullscreen();
    });

    // Ocultar peça selecionada (Dissecação)
    document.getElementById('btn-hide-part')?.addEventListener('click', () => {
      this.hideSelectedPart();
    });

    // Ferramenta de Corte Tomográfico
    const clipToggleBtn = document.getElementById('btn-clip-toggle');
    const clipPanel = document.getElementById('clip-controls-box');
    const clipSelect = document.getElementById('clip-plane-select');
    const clipSlider = document.getElementById('clip-slider');

    if (clipToggleBtn && clipPanel) {
      clipToggleBtn.addEventListener('click', () => {
        const isOpen = clipPanel.style.display !== 'none';
        const nextState = !isOpen;
        clipPanel.style.display = nextState ? 'flex' : 'none';
        clipToggleBtn.classList.toggle('active', nextState);

        this.engine.showAllParts();
    this.engine.setState({ clipEnabled: nextState });
      });
    }

    if (clipSelect && clipSlider) {
      clipSelect.addEventListener('change', (e) => {
        const type = e.target.value;
        if (type === 'axial') {
          clipSlider.min = '0.0';
          clipSlider.max = '1.85';
          clipSlider.value = '0.9';
        } else if (type === 'sagittal') {
          clipSlider.min = '-0.35';
          clipSlider.max = '0.35';
          clipSlider.value = '0.0';
        } else if (type === 'coronal') {
          clipSlider.min = '-0.2';
          clipSlider.max = '0.2';
          clipSlider.value = '0.0';
        }
        this.engine.showAllParts();
    this.engine.setState({
          clipPlaneType: type,
          clipValue: parseFloat(clipSlider.value)
        });
      });

      clipSlider.addEventListener('input', (e) => {
        this.engine.showAllParts();
    this.engine.setState({ clipValue: parseFloat(e.target.value) });
      });
    }

    // Presets de sistemas
    document.getElementById('preset-all')?.addEventListener('click', () => {
      this.engine.showAllParts();
    this.engine.setState({
        visible: SYSTEMS.map(s => s.id),
        selected: [],
        isolate: false
      });
      this.engine.updateSceneState(this.engine.state);
      this.updateSystemCheckboxes();
      this.closeDetailPanel();
    });

    document.getElementById('preset-skeleton')?.addEventListener('click', () => {
      this.engine.showAllParts();
    this.engine.setState({
        visible: ['skeletal'],
        selected: [],
        isolate: false
      });
      this.engine.updateSceneState(this.engine.state);
      this.updateSystemCheckboxes();
      this.closeDetailPanel();
    });

    document.getElementById('preset-organs')?.addEventListener('click', () => {
      this.engine.showAllParts();
    this.engine.setState({
        visible: ['cardiac', 'respiratory', 'digestive', 'urinary', 'endocrine', 'reproductive'],
        selected: [],
        isolate: false
      });
      this.engine.updateSceneState(this.engine.state);
      this.updateSystemCheckboxes();
      this.closeDetailPanel();
    });

    document.getElementById('btn-hide-all')?.addEventListener('click', () => {
      this.engine.showAllParts();
    this.engine.setState({
        visible: [],
        selected: [],
        isolate: false
      });
      this.engine.updateSceneState(this.engine.state);
      this.updateSystemCheckboxes();
      this.closeDetailPanel();
    });

    // Painel de Detalhes: Fechar e Isolar
    document.getElementById('close-details')?.addEventListener('click', () => {
      this.closeDetailPanel();
    });

    document.getElementById('btn-isolate')?.addEventListener('click', () => {
      this.toggleIsolate();
    });

    // Modal de Sobre / Créditos
    document.getElementById('btn-about')?.addEventListener('click', () => {
      document.getElementById('modal-about')?.classList.add('open');
    });
    document.getElementById('close-about')?.addEventListener('click', () => {
      document.getElementById('modal-about')?.classList.remove('open');
    });

    // Atalhos de teclado avançados do LabSim
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const k = e.key.toLowerCase();
      if (e.key === '/') {
        e.preventDefault();
        document.getElementById('search-anatomy')?.focus();
      } else if (k === 'x') {
        e.preventDefault();
        this.toggleXray();
      } else if (k === 's') {
        e.preventDefault();
        this.engine?.takeSnapshot();
      } else if (k === 'h') {
        e.preventDefault();
        this.hideSelectedPart();
      } else if (k === 'f') {
        e.preventDefault();
        this.toggleFullscreen();
      } else if (k === 'i') {
        e.preventDefault();
        this.toggleIsolate();
      } else if (k === 'r') {
        e.preventDefault();
        this.toggleRotate();
      } else if (k === 'a') {
        e.preventDefault();
        this.resetAll();
      } else if (e.key === '1') {
        this.setView('three-quarter');
      } else if (e.key === '2') {
        this.setView('front');
      } else if (e.key === '3') {
        this.setView('side');
      } else if (e.key === '4') {
        this.setView('back');
      } else if (e.key === 'Escape') {
        document.getElementById('modal-about')?.classList.remove('open');
        this.closeDetailPanel();
        document.getElementById('search-results')?.classList.remove('open');
      }
    });

    // Tooltip flutuante de hover
    this.hoverEl = document.createElement('div');
    this.hoverEl.className = 'atlas-hover-tooltip';
    this.hoverEl.style.display = 'none';
    this.container.appendChild(this.hoverEl);
  }

  toggleFullscreen() {
    const ws = document.getElementById('atlas-workspace');
    if (!document.fullscreenElement) {
      ws?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  hideSelectedPart() {
    if (!this.engine?.state.selected.length) return;
    this.engine.hideSelected();
    this.closeDetailPanel();
    this.updateVisibleCountBadge();
  }

  toggleXray() {
    const next = !this.engine.state.xray;
    this.engine.showAllParts();
    this.engine.setState({ xray: next });
    const btn = document.getElementById('btn-xray');
    btn?.classList.toggle('active', next);
  }

  toggleRotate() {
    const next = !this.engine.state.rotate;
    this.engine.showAllParts();
    this.engine.setState({ rotate: next });
    const rotateBtn = document.getElementById('btn-rotate');
    rotateBtn?.classList.toggle('active', next);
  }

  setView(view) {
    document.querySelectorAll('[data-view]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-view') === view);
    });
    this.engine.showAllParts();
    this.engine.setState({ view, reset: this.engine.state.reset + 1, rotate: false });
  }

  toggleIsolate() {
    const nextIsolate = !this.engine.state.isolate;
    this.engine.showAllParts();
    this.engine.setState({ isolate: nextIsolate, explode: 0 });
    this.engine.updateSceneState(this.engine.state);

    const isolateBtn = document.getElementById('btn-isolate');
    if (isolateBtn) {
      isolateBtn.innerHTML = nextIsolate
        ? '<span class="icon">🔍</span> Restaurar Visão Geral'
        : '<span class="icon">🎯</span> Isolar Estrutura';
    }
    this.updateCaption();
  }

  handleProgress(percent) {
    const bar = document.getElementById('loading-progress-bar');
    const text = document.getElementById('loading-percent-text');
    const box = document.getElementById('atlas-loading-screen');

    if (bar) bar.style.width = `${percent}%`;
    if (text) text.textContent = `${percent}%`;

    if (percent >= 100) {
      setTimeout(() => {
        if (box) {
          box.style.opacity = '0';
          setTimeout(() => { box.style.display = 'none'; }, 400);
        }
      }, 300);
    }
  }

  handleError(msg) {
    const errorBox = document.getElementById('atlas-error-screen');
    const errorText = document.getElementById('atlas-error-msg');
    if (errorBox && errorText) {
      errorText.textContent = msg;
      errorBox.style.display = 'flex';
    }
  }

  handleHover(part, clientX, clientY) {
    if (!part) {
      this.hoverEl.style.display = 'none';
      return;
    }
    const rect = this.container.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ptName = translateAnatomyName(part.name);
    this.hoverEl.textContent = ptName;
    this.hoverEl.style.left = `${Math.min(x + 14, rect.width - 200)}px`;
    this.hoverEl.style.top = `${Math.min(y + 18, rect.height - 40)}px`;
    this.hoverEl.style.display = 'block';
  }

  renderSystemsList() {
    const list = document.getElementById('system-checkboxes');
    if (!list) return;

    list.innerHTML = '';

    SYSTEMS.forEach(s => {
      const count = this.counts[s.id] || 0;
      if (count === 0) return;

      const row = document.createElement('div');
      row.className = 'system-item';

      const isChecked = this.engine.state.visible.includes(s.id);

      row.innerHTML = `
        <label class="sys-toggle" title="Mostrar/ocultar ${s.name}">
          <input type="checkbox" data-system-id="${s.id}" ${isChecked ? 'checked' : ''}>
          <span class="sys-dot" style="background: ${s.color};"></span>
          <span class="sys-name">${s.shortName || s.name}</span>
          <span class="sys-count">${count}</span>
        </label>
        <button class="sys-solo-btn" data-solo-id="${s.id}" title="Mostrar apenas ${s.name}">Apenas</button>
      `;

      list.appendChild(row);

      row.querySelector('input').addEventListener('change', (e) => {
        this.toggleSystem(s.id, e.target.checked);
      });

      row.querySelector('.sys-solo-btn').addEventListener('click', () => {
        this.soloSystem(s.id);
      });
    });

    this.updateVisibleCountBadge();
  }

  toggleSystem(systemId, visible) {
    let nextVis = [...this.engine.state.visible];
    if (visible && !nextVis.includes(systemId)) {
      nextVis.push(systemId);
    } else if (!visible) {
      nextVis = nextVis.filter(id => id !== systemId);
    }
    this.engine.showAllParts();
    this.engine.setState({ visible: nextVis, selected: [], isolate: false });
    this.engine.updateSceneState(this.engine.state);
    this.updateVisibleCountBadge();
    this.closeDetailPanel();
  }

  soloSystem(systemId) {
    this.engine.showAllParts();
    this.engine.setState({ visible: [systemId], selected: [], isolate: false });
    this.engine.updateSceneState(this.engine.state);
    this.updateSystemCheckboxes();
    this.updateVisibleCountBadge();
    this.closeDetailPanel();
  }

  updateSystemCheckboxes() {
    const inputs = document.querySelectorAll('#system-checkboxes input[data-system-id]');
    inputs.forEach(input => {
      const id = input.getAttribute('data-system-id');
      input.checked = this.engine.state.visible.includes(id);
    });
    this.updateVisibleCountBadge();
  }

  updateVisibleCountBadge() {
    const badge = document.getElementById('visible-parts-count');
    if (!badge || !this.atlas) return;

    const visCount = this.atlas.parts.filter(p =>
      this.engine.state.isolate
        ? this.engine.state.selected.includes(p.id)
        : this.engine.state.visible.includes(p.system) || this.engine.state.selected.includes(p.id)
    ).length;

    badge.textContent = `${visCount.toLocaleString()} peças visíveis`;
  }

  setupSearch() {
    const input = document.getElementById('search-anatomy');
    const resultsBox = document.getElementById('search-results');
    if (!input || !resultsBox) return;

    let debounceTimer;

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = input.value.trim().toLowerCase();
        if (!query) {
          resultsBox.innerHTML = '';
          resultsBox.classList.remove('open');
          return;
        }

        const matches = this.atlas.concepts
          .filter(c => {
            const ptName = translateAnatomyName(c.name).toLowerCase();
            return ptName.includes(query) || c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query);
          })
          .sort((a, b) => a.name.length - b.name.length)
          .slice(0, 50);

        if (matches.length === 0) {
          resultsBox.innerHTML = '<div class="no-results">Nenhuma estrutura encontrada.</div>';
          resultsBox.classList.add('open');
          return;
        }

        resultsBox.innerHTML = '';
        matches.forEach(concept => {
          const item = document.createElement('div');
          item.className = 'search-item';
          const pt = translateAnatomyName(concept.name);
          item.innerHTML = `
            <div class="search-title"><strong>${pt}</strong> <span>${concept.name}</span></div>
            <div class="search-meta">
              <span class="fma-badge">${concept.id}</span>
              <span class="elem-count">${concept.elements.length} ${concept.elements.length === 1 ? 'peça' : 'peças'}</span>
            </div>
          `;
          item.addEventListener('click', () => {
            this.chooseConcept(concept);
            resultsBox.classList.remove('open');
            input.value = '';
          });
          resultsBox.appendChild(item);
        });

        resultsBox.classList.add('open');
      }, 150);
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !resultsBox.contains(e.target)) {
        resultsBox.classList.remove('open');
      }
    });
  }

  chooseConcept(concept) {
    this.selectedConcept = concept;
    this.engine.setState({
      selected: concept.elements,
      isolate: false,
      rotate: false,
      inspectorOpen: true
    });
    this.engine.updateSceneState(this.engine.state);

    const firstPart = this.atlas.parts.find(p => p.id === concept.elements[0]);
    this.showDetailPanel(concept, firstPart);
    this.updateCaption();
  }

  handlePartSelect(part) {
    this.selectedPart = part;
    const concept = this.atlas.concepts.find(c => c.id === part.conceptId) || {
      id: part.conceptId,
      name: part.name,
      elements: [part.id]
    };
    this.selectedConcept = concept;

    this.engine.setState({
      selected: [part.id],
      isolate: false,
      rotate: false,
      inspectorOpen: true
    });
    this.engine.updateSceneState(this.engine.state);
    this.showDetailPanel(concept, part);
    this.updateCaption();
  }

  showDetailPanel(concept, part) {
    const panel = document.getElementById('atlas-detail-panel');
    if (!panel) return;

    const sys = SYSTEMS.find(s => s.id === part?.system);
    const ptTitle = translateAnatomyName(concept.name);
    const explanation = getStructureExplanation(concept.name, part?.system);

    document.getElementById('detail-system-dot').style.background = sys ? sys.color : '#0066cc';
    document.getElementById('detail-system-name').textContent = sys ? sys.name.toUpperCase() : 'ANATOMIA';
    document.getElementById('detail-title').textContent = ptTitle;
    document.getElementById('detail-orig-name').textContent = concept.name !== ptTitle ? `Inglês: ${concept.name}` : '';
    document.getElementById('detail-fma').textContent = concept.id;
    document.getElementById('detail-count').textContent = `${this.engine.state.selected.length} peça(s)`;
    document.getElementById('detail-description').textContent = explanation;

    const card = DIDACTIC_CARDS[concept.name.toLowerCase()];
    const extraBox = document.getElementById('detail-extra-info');
    if (extraBox) {
      let content = '';
      if (card?.function) {
        content += `<div class="card-item"><strong>Fisiologia Didática:</strong> ${card.function}</div>`;
      }
      if (card?.curiosity) {
        content += `<div class="card-item" style="margin-top: 6px;"><strong>Curiosidade Biomédica:</strong> ${card.curiosity}</div>`;
      } else if (sys?.curiosity) {
        content += `<div class="card-item" style="margin-top: 6px;"><strong>Curiosidade Biomédica:</strong> ${sys.curiosity}</div>`;
      }

      // Link Didático Cruzado com os outros laboratórios do LabSim
      const targetLink = card?.labLink || sys?.labLink;
      if (targetLink) {
        content += `
          <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.15);">
            <a href="${targetLink.url}" class="lab-cross-link" style="color: var(--teal-glow); font-weight: 700; text-decoration: none; font-size: 0.78rem; display: flex; align-items: center; gap: 4px;">
              ${targetLink.text}
            </a>
          </div>
        `;
      }

      extraBox.innerHTML = content;
      extraBox.style.display = content ? 'block' : 'none';
    }

    // Atualiza estado do botão de isolamento
    const isolateBtn = document.getElementById('btn-isolate');
    if (isolateBtn) {
      isolateBtn.innerHTML = this.engine.state.isolate
        ? '<span class="icon">🔍</span> Restaurar Visão Geral'
        : '<span class="icon">🎯</span> Isolar Estrutura';
    }

    panel.classList.add('open');
  }

  closeDetailPanel() {
    const panel = document.getElementById('atlas-detail-panel');
    panel?.classList.remove('open');
    this.engine.setState({ selected: [], isolate: false, inspectorOpen: false });
    this.engine.updateSceneState(this.engine.state);
    this.updateCaption();
  }

  updateCaption() {
    const cap = document.getElementById('scene-caption-text');
    if (!cap) return;

    if (this.engine.state.isolate) {
      const pt = translateAnatomyName(this.selectedConcept?.name || 'ESTRUTURA ISOLADA');
      cap.textContent = `FOCO ISOLADO · ${pt.toUpperCase()}`;
    } else if (this.engine.currentExplode > 0.9) {
      cap.textContent = 'INVENTÁRIO ANATÔMICO BIDIMENSIONAL';
    } else if (this.engine.currentExplode > 0.05) {
      cap.textContent = 'VISUALIZAÇÃO EXPLODIDA INTERATIVA';
    } else if (this.engine.state.clipEnabled) {
      cap.textContent = `CORTE TOMOGRÁFICO (${this.engine.state.clipPlaneType.toUpperCase()})`;
    } else if (this.engine.state.xray) {
      cap.textContent = 'MODO RAIO-X HOLOGRÁFICO ATIVO';
    } else {
      cap.textContent = this.sex === 'female'
        ? 'MULHER ADULTA DE REFERÊNCIA · HuBMAP / HRA v1.5'
        : 'HOMEM ADULTO DE REFERÊNCIA · BODYPARTS3D 4.0';
    }
  }

  resetAll() {
    const slider = document.getElementById('explode-slider');
    const valText = document.getElementById('explode-val');
    if (slider) slider.value = 0;
    if (valText) valText.textContent = '0%';

    const clipBox = document.getElementById('clip-controls-box');
    if (clipBox) clipBox.style.display = 'none';
    document.getElementById('btn-clip-toggle')?.classList.remove('active');
    document.getElementById('btn-xray')?.classList.remove('active');

    // Respeita o modelo atual ao restaurar sistemas visíveis
    const defaultVisible = this.sex === 'female' ? DEFAULT_VISIBLE_FEMALE : DEFAULT_VISIBLE;

    this.engine.showAllParts();
    this.engine.setState({
      explode: 0,
      visible: defaultVisible,
      selected: [],
      isolate: false,
      view: 'three-quarter',
      rotate: false,
      xray: false,
      clipEnabled: false,
      reset: this.engine.state.reset + 1,
      inspectorOpen: false
    });
    this.engine.updateSceneState(this.engine.state);
    this.updateSystemCheckboxes();
    this.closeDetailPanel();
    this.setView('three-quarter');
  }
}

// Inicia automaticamente quando o DOM estiver pronto
window.addEventListener('DOMContentLoaded', () => {
  window.atlasApp = new AtlasApp();
});
