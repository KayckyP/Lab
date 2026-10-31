// LabSim - Atlas Anatômico Interativo 3D com Motor WebGL2 (Open Anatomy Atlas Core)
/* global mat4, Geometry, PARTS, buildProceduralAtlas, Atlas, AtlasRenderer, getScientificSummary */

document.addEventListener('DOMContentLoaded', () => {
  // Base científica e educacional dos 8 sistemas e estruturas em Português
  const anatomyDatabase = {
    all: {
      system: 'VISÃO GERAL HOLÍSTICA',
      title: 'Corpo Humano Completo',
      badge: 'HOMEOSTASE INTEGRADA',
      icon: '⌬',
      location: 'Organismo humano integrado em planos anatômicos (sagital, coronal, axial).',
      function: 'Coordenação simultânea e equilibrada (homeostase) entre todos os 8 sistemas vitais.',
      connection: 'Nenhum órgão funciona isoladamente: o sistema cardiovascular nutre os tecidos, o nervoso comanda, o respiratório oxigena e o esquelético sustenta.',
      fact: 'Um ser humano adulto é composto por mais de 37 trilhões de células e cerca de 100.000 km de vasos sanguíneos circulatórios.',
      curiosity: 'O cérebro consome cerca de 20% de toda a energia e oxigênio do corpo, embora represente apenas 2% da massa corporal total.'
    },
    skeletal: {
      system: 'SISTEMA ESQUELÉTICO',
      title: 'Sistema Esquelético (Esqueleto)',
      badge: 'SUSTENTAÇÃO & PROTEÇÃO',
      icon: '🦴',
      location: 'Armação osteocartilaginosa interna abrangendo esqueleto axial (crânio, coluna, tórax) e apendicular (membros).',
      function: 'Sustentação postural, proteção mecânica de órgãos nobres, alavanca para locomoção e hematopoiese.',
      connection: 'Conecta-se diretamente aos tendões do sistema muscular e produz todas as células do sangue (eritrócitos, leucócitos) na medula óssea vermelha.',
      fact: 'O corpo adulto possui 206 ossos. O fêmur é o osso mais longo e resistente, suportando até 30 vezes o peso corporal.',
      curiosity: 'Os ossos estão em contínua remodelação: a cada 7 a 10 anos, todo o nosso esqueleto celular é completamente renovado por osteoblastos e osteoclastos.'
    },
    muscular: {
      system: 'SISTEMA MUSCULAR',
      title: 'Sistema Muscular',
      badge: 'CINÉTICA & TERMORREGULAÇÃO',
      icon: '💪',
      location: 'Mais de 650 músculos esqueléticos distribuídos por cabeça, tronco e membros.',
      function: 'Geração de movimento voluntário e involuntário, estabilização articular, manutenção da postura corporal e termogênese.',
      connection: 'Trabalha em perfeita sincronia com a inervação motora proveniente do sistema nervoso periférico e fixações ósseas articulares.',
      fact: 'O músculo mais forte em força de mordida é o masseter; o maior em volume é o glúteo máximo.',
      curiosity: 'Cerca de 40% a 50% do peso corporal total de um adulto saudável corresponde à massa muscular esquelética.'
    },
    nervous: {
      system: 'SISTEMA NERVOSO',
      title: 'Encéfalo e Sistema Nervoso',
      badge: 'CONTROLE & PROCESSAMENTO',
      icon: '🧠',
      location: 'Encéfalo abrigado no crânio, medula espinhal no canal vertebral e nervos periféricos por todo o corpo.',
      function: 'Transmissão ultrarrápida de impulsos eletroquímicos, integração sensorial, cognição, memória e controle autonômico dos órgãos vitais.',
      connection: 'Regula o batimento cardíaco, ritmo respiratório, reflexos musculoesqueléticos e secreções glandulares digestórias.',
      fact: 'Impulsos nervosos em axônios mielinizados podem atingir velocidades superiores a 400 km/h (120 m/s).',
      curiosity: 'Existem cerca de 86 bilhões de neurônios no cérebro humano, cada um realizando até 10.000 conexões sinápticas com seus vizinhos.'
    },
    cardiovascular: {
      system: 'SISTEMA CARDIOVASCULAR',
      title: 'Coração e Rede Vascular',
      badge: 'CIRCULAÇÃO & PERFUSÃO',
      icon: '❤️',
      location: 'Coração situado no mediastino médio da cavidade torácica, conectado a artérias, veias e capilares em todos os tecidos.',
      function: 'Bombear continuamente oxigênio, nutrientes, hormônios e células imunológicas para todas as regiões do organismo.',
      connection: 'Trabalha em ciclo fechado com os pulmões (pequena circulação) e nutre o encéfalo, rins, músculos e trato digestório (grande circulação).',
      fact: 'O coração bate cerca de 100.000 vezes por dia, bombeando aproximadamente 7.500 litros de sangue diariamente.',
      curiosity: 'O sangue demora menos de 60 segundos para sair do coração, percorrer todo o corpo e retornar às câmaras cardíacas.'
    },
    respiratory: {
      system: 'SISTEMA RESPIRATÓRIO',
      title: 'Pulmões e Vias Aéreas',
      badge: 'HEMATOSE & TROCAS GASOSAS',
      icon: '🫁',
      location: 'Cavidade torácica, abrangendo traqueia, brônquios, bronquíolos e ambos os pulmões.',
      function: 'Troca de gases (hematose alveolar): captação do oxigênio atmosférico e eliminação do dióxido de carbono metabólico.',
      connection: 'Os alvéolos são intimamente recobertos pela rede de capilares pulmonares, oxigenando o sangue que retorna ao ventrículo esquerdo.',
      fact: 'Se esticássemos a superfície interna de todos os alvéolos de um par de pulmões, ela cobriria uma quadra de tênis (~70 a 100 m²).',
      curiosity: 'Inspiramos cerca de 11.000 litros de ar todos os dias, realizando em média 12 a 20 incursões respiratórias por minuto em repouso.'
    },
    digestive: {
      system: 'SISTEMA DIGESTÓRIO',
      title: 'Estômago, Intestinos e Fígado',
      badge: 'NUTRIÇÃO & METABOLISMO',
      icon: '🥗',
      location: 'Cavidade abdominal e pélvica, estendendo-se do esôfago, estômago, fígado, pâncreas aos intestinos delgado e grosso.',
      function: 'Digestão química e mecânica de alimentos, absorção de macronutrientes, micronutrientes e água, e síntese de metabólitos.',
      connection: 'Os nutrientes digeridos entram na circulação porta-hepática para processamento metabólico no fígado antes de circularem pelo corpo.',
      fact: 'O intestino delgado possui cerca de 6 metros de comprimento e suas microvilosidades aumentam a área absortiva em mais de 600 vezes.',
      curiosity: 'O estômago produz ácido clorídrico com pH entre 1,5 e 2,0 — ácido o suficiente para dissolver metais se não fosse a espessa camada de muco protetor.'
    },
    urinary: {
      system: 'SISTEMA URINÁRIO',
      title: 'Rins e Vias Urinárias',
      badge: 'EXCREÇÃO & OSMORREGULAÇÃO',
      icon: '💧',
      location: 'Retroperitônio na parede abdominal posterior (rins direito e esquerdo, ureteres, bexiga urinária).',
      function: 'Filtração contínua do plasma sanguíneo, regulação da volemia e pressão arterial, excreção de ureia/creatinina e equilíbrio hidroeletrolítico.',
      connection: 'Recebe cerca de 20% a 25% de todo o débito cardíaco por minuto pelas artérias renais para processo contínuo de depuração plasmática.',
      fact: 'Os néfrons renais filtram aproximadamente 180 litros de líquido plasmático por dia, reabsorvendo mais de 99% e excretando apenas 1,5 L em urina.',
      curiosity: 'Os rins também produzem o hormônio eritropoietina (EPO), que sinaliza à medula óssea para fabricar mais hemácias quando o oxigênio cai.'
    },
    reproductive: {
      system: 'SISTEMA REPRODUTOR',
      title: 'Sistema Reprodutor Humano',
      badge: 'PERPETUAÇÃO & ENDOCRINOLOGIA',
      icon: '🧬',
      location: 'Região pélvica inferior.',
      function: 'Produção de gametas sexuais, síntese de hormônios androgênicos/estrogênicos e suporte à reprodução humana.',
      connection: 'Intensamente regulado pelo eixo hipotálamo-hipófise do sistema endócrino e vascularizado pelos ramos da artéria ilíaca interna.',
      fact: 'Os gametas humanos contêm metade da carga genética (23 cromossomos), permitindo a recombinação genética na fertilização.',
      curiosity: 'O sistema reprodutor é o único conjunto de órgãos corporais que difere estruturalmente entre indivíduos com base na diferenciação sexual biológica.'
    }
  };

  // Elementos do DOM
  const canvas = document.querySelector('#atlas-gl-canvas');
  const loadingElem = document.querySelector('#model-loading');
  const fallbackSvg = document.querySelector('#body-fallback-model');
  const orientationElem = document.querySelector('#orientation');
  const modeStatusElem = document.querySelector('#mode-status');

  // Painel de informações
  const infoSystem = document.querySelector('#info-system');
  const infoTitle = document.querySelector('#info-title');
  const infoBadge = document.querySelector('#info-badge');
  const infoVisual = document.querySelector('#info-visual');
  const infoLocation = document.querySelector('#info-location');
  const infoFunction = document.querySelector('#info-function');
  const infoConnection = document.querySelector('#info-connection');
  const infoFact = document.querySelector('#info-fact');
  const infoCuriosity = document.querySelector('#info-curiosity');
  const wikiBox = document.querySelector('#wiki-box');
  const wikiExcerpt = document.querySelector('#wiki-excerpt');
  const wikiLink = document.querySelector('#wiki-link');

  // Campo de busca
  const searchInput = document.querySelector('#search-anatomy');
  const searchResults = document.querySelector('#search-results');

  let renderer = null;
  let atlas = null;
  let currentSystem = 'all';
  let selectedElementIdx = -1;

  // Inicializa o Motor WebGL2 do Open Anatomy Atlas
  function initEngine() {
    if (!canvas) return;

    try {
      renderer = new AtlasRenderer(canvas);
      renderer.background = [0.93, 0.96, 0.97];
      renderer.selColor = [0.08, 0.72, 0.65]; // Teal LabSim

      // Compila o atlas anatômico
      const data = buildProceduralAtlas();
      atlas = new Atlas(data.index);
      renderer.setAtlas(data.index, data.bin);

      // Define cores dos elementos
      for (let i = 0; i < data.index.elements.length; i++) {
        const el = data.index.elements[i];
        const col = el.color || [0.8, 0.8, 0.8];
        renderer.setColor(i, col);
      }

      // Enquadramento e câmera inicial
      renderer.setCamera({ yaw: 0, pitch: 0.08, dist: 2.8, target: [0, 0.85, 0] }, false);
      renderer.requestRender();

      if (loadingElem) loadingElem.style.display = 'none';
      if (fallbackSvg) fallbackSvg.style.display = 'none';
      if (modeStatusElem) {
        modeStatusElem.innerHTML = '<span class="status-live">●</span> MOTOR OPEN ANATOMY WEBGL2 ATIVO';
      }

      // Evento de frame para atualizar bússola
      renderer.onFrame = () => {
        if (!orientationElem) return;
        const deg = ((renderer.camera.yaw * 180 / Math.PI) % 360 + 360) % 360;
        if (deg < 35 || deg > 325) {
          orientationElem.textContent = 'VISTA ANTERIOR (FRENTE)';
        } else if (deg >= 35 && deg <= 145) {
          orientationElem.textContent = 'PERFIL DIREITO';
        } else if (deg > 145 && deg < 215) {
          orientationElem.textContent = 'VISTA POSTERIOR (COSTAS)';
        } else {
          orientationElem.textContent = 'PERFIL ESQUERDO';
        }
      };

      setupControls();
      setupSearch();

    } catch (e) {
      console.warn('Falha ao iniciar WebGL2 Open Anatomy Atlas:', e);
      if (loadingElem) loadingElem.style.display = 'none';
      if (modeStatusElem) {
        modeStatusElem.innerHTML = '<span>●</span> VISUALIZADOR VETORIAL ATIVO';
      }
    }
  }

  function setupControls() {
    let dragging = false;
    let mode = 'orbit';
    let lx = 0, ly = 0;
    let pointerDownTime = 0;

    canvas.addEventListener('contextmenu', e => e.preventDefault());

    canvas.addEventListener('pointerdown', e => {
      dragging = true;
      mode = (e.button === 2 || e.shiftKey) ? 'pan' : 'orbit';
      lx = e.clientX;
      ly = e.clientY;
      pointerDownTime = performance.now();
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;

      if (mode === 'orbit') {
        renderer.orbit(dx * 0.007, dy * 0.007);
      } else {
        renderer.pan(dx, dy);
      }
    });

    canvas.addEventListener('pointerup', e => {
      if (!dragging) return;
      dragging = false;

      const duration = performance.now() - pointerDownTime;
      if (duration < 300 && Math.hypot(e.clientX - lx, e.clientY - ly) < 5) {
        handlePick(e.clientX, e.clientY);
      }
    });

    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.12 : 0.89;
      renderer.zoom(factor);
    }, { passive: false });

    canvas.addEventListener('dblclick', e => {
      const el = renderer.pick(e.clientX, e.clientY);
      if (el >= 0) {
        selectElement(el, true);
      }
    });
  }

  function handlePick(clientX, clientY) {
    if (!renderer) return;
    const el = renderer.pick(clientX, clientY);
    if (el >= 0) {
      selectElement(el);
    } else {
      clearSelection();
    }
  }

  async function selectElement(elIdx, focus = false) {
    selectedElementIdx = elIdx;
    renderer.selectElement(elIdx);

    const elem = atlas.elements[elIdx];
    const concept = atlas.concepts[elem.c];
    const sysKey = elem.system || currentSystem;

    if (focus) {
      renderer.focusElements([elIdx]);
    }

    if (infoBadge) infoBadge.textContent = concept.id || 'ESTRUTURA SELECIONADA';
    if (infoSystem) infoSystem.textContent = `SISTEMA ${sysKey.toUpperCase()}`;
    if (infoTitle) infoTitle.textContent = concept.name;
    if (infoVisual) infoVisual.textContent = getIconForSystem(sysKey);

    if (infoLocation) {
      infoLocation.textContent = concept.la ? `Terminologia Anatômica: ${concept.la}.` : 'Estrutura anatômica humana.';
    }

    const sysData = anatomyDatabase[sysKey] || anatomyDatabase.all;
    if (infoFunction) infoFunction.textContent = `Integrante ativo do ${sysData.title}, desempenhando papel em: ${sysData.function}`;
    if (infoConnection) infoConnection.textContent = sysData.connection;
    if (infoFact) infoFact.textContent = `Ontologia FMA: ${concept.id || 'N/A'}. ${sysData.fact}`;
    if (infoCuriosity) infoCuriosity.textContent = sysData.curiosity;

    // Consulta enciclopédica online integrada
    if (wikiBox && wikiExcerpt && typeof getScientificSummary === 'function') {
      wikiBox.style.display = 'block';
      wikiExcerpt.textContent = 'Buscando referência enciclopédica...';
      const summary = await getScientificSummary(concept.name, concept.enName);
      if (summary && summary.extract) {
        wikiExcerpt.textContent = summary.extract;
        if (wikiLink) {
          wikiLink.href = summary.url;
          wikiLink.style.display = 'inline-block';
        }
      } else {
        wikiExcerpt.textContent = 'Estrutura catalogada no vocabulário anatômico padrão FMA / Z-Anatomy.';
        if (wikiLink) wikiLink.style.display = 'none';
      }
    }
  }

  function clearSelection() {
    selectedElementIdx = -1;
    if (renderer) renderer.clearSelection();
    if (wikiBox) wikiBox.style.display = 'none';
    updateInfoPanel(currentSystem);
  }

  function getIconForSystem(sys) {
    const map = {
      all: '⌬', skeletal: '🦴', muscular: '💪', nervous: '🧠',
      cardiovascular: '❤️', respiratory: '🫁', digestive: '🥗',
      urinary: '💧', reproductive: '🧬'
    };
    return map[sys] || '✦';
  }

  function updateInfoPanel(key) {
    const data = anatomyDatabase[key] || anatomyDatabase.all;
    if (infoSystem) infoSystem.textContent = data.system;
    if (infoTitle) infoTitle.textContent = data.title;
    if (infoBadge) infoBadge.textContent = data.badge;
    if (infoVisual) infoVisual.textContent = data.icon;
    if (infoLocation) infoLocation.textContent = data.location;
    if (infoFunction) infoFunction.textContent = data.function;
    if (infoConnection) infoConnection.textContent = data.connection;
    if (infoFact) infoFact.textContent = data.fact;
    if (infoCuriosity) infoCuriosity.textContent = data.curiosity;
    if (wikiBox) wikiBox.style.display = 'none';
  }

  // Filtragem por Sistemas
  function filterBySystem(sysKey) {
    currentSystem = sysKey;
    clearSelection();

    document.querySelectorAll('.system-button').forEach(btn => {
      const match = btn.dataset.system === sysKey;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', String(match));
    });

    if (!renderer || !atlas) return;

    if (sysKey === 'all') {
      renderer.showAll();
      renderer.setCamera({ yaw: 0, pitch: 0.08, dist: 2.8, target: [0, 0.85, 0] }, true);
    } else {
      const mask = new Uint8Array(atlas.elements.length);
      const visibleIndices = [];
      atlas.elements.forEach((el, idx) => {
        if (el.system === sysKey) {
          mask[idx] = 1;
          visibleIndices.push(idx);
        }
      });
      renderer.setVisibleMask(mask);
      if (visibleIndices.length > 0) {
        renderer.focusElements(visibleIndices);
      }
    }
  }

  document.querySelectorAll('.system-button').forEach(button => {
    button.addEventListener('click', () => {
      filterBySystem(button.dataset.system);
    });
  });

  // Ferramenta de Busca Anatômica Instantânea
  function setupSearch() {
    if (!searchInput || !searchResults) return;

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) {
        searchResults.style.display = 'none';
        searchResults.innerHTML = '';
        return;
      }

      const matches = [];
      atlas.elements.forEach((el, idx) => {
        const c = atlas.concepts[el.c];
        const name = (c.name || '').toLowerCase();
        const enName = (c.enName || '').toLowerCase();
        const la = (c.la || '').toLowerCase();
        if (name.includes(q) || enName.includes(q) || la.includes(q)) {
          matches.push({ idx, name: c.name, la: c.la, system: el.system });
        }
      });

      if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-item-empty">Nenhuma estrutura encontrada</div>';
        searchResults.style.display = 'block';
        return;
      }

      searchResults.innerHTML = matches.slice(0, 8).map(m => `
        <button class="search-item" data-idx="${m.idx}" type="button">
          <strong>${m.name}</strong>
          <small>${m.la || m.system}</small>
        </button>
      `).join('');
      searchResults.style.display = 'block';

      searchResults.querySelectorAll('.search-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.idx);
          selectElement(idx, true);
          searchResults.style.display = 'none';
          searchInput.value = '';
        });
      });
    });

    document.addEventListener('click', e => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });
  }

  // Exportação de imagem PNG para relatórios ou estudos
  const btnSnapshot = document.querySelector('#btn-snapshot');
  if (btnSnapshot) {
    btnSnapshot.addEventListener('click', () => {
      if (!renderer) return;
      const dataUrl = renderer.snapshot();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `LabSim-Anatomia-${currentSystem}-${Date.now()}.png`;
      a.click();
    });
  }

  // Ferramentas da Barra de Ações (Isolar, Raio-X, Cortes, etc.)
  const btnXray = document.querySelector('#btn-xray');
  const btnIsolate = document.querySelector('#btn-isolate');
  const btnHide = document.querySelector('#btn-hide');
  const btnShowAll = document.querySelector('#btn-showall');
  const btnClipToggle = document.querySelector('#btn-clip-toggle');
  const selectClipPlane = document.querySelector('#clip-plane-select');
  const sliderClipPos = document.querySelector('#clip-slider');

  if (btnXray) {
    btnXray.addEventListener('click', () => {
      const active = renderer.toggleXray();
      btnXray.classList.toggle('active', active);
    });
  }

  if (btnIsolate) {
    btnIsolate.addEventListener('click', () => {
      if (selectedElementIdx >= 0) {
        renderer.isolateElements([selectedElementIdx]);
      } else {
        alert('Selecione primeiro um órgão ou estrutura no corpo para isolá-lo.');
      }
    });
  }

  if (btnHide) {
    btnHide.addEventListener('click', () => {
      if (selectedElementIdx >= 0) {
        renderer.hideElements([selectedElementIdx]);
        clearSelection();
      }
    });
  }

  if (btnShowAll) {
    btnShowAll.addEventListener('click', () => {
      filterBySystem('all');
    });
  }

  function updateClipPlane() {
    if (!renderer || !btnClipToggle) return;
    const isClipOn = btnClipToggle.classList.contains('active');
    const planeType = selectClipPlane ? selectClipPlane.value : 'axial';
    const val = sliderClipPos ? Number(sliderClipPos.value) : 0;

    let plane = [0, -1, 0, 1];
    if (planeType === 'axial') {
      plane = [0, -1, 0, val];
    } else if (planeType === 'sagittal') {
      plane = [-1, 0, 0, val];
    } else if (planeType === 'coronal') {
      plane = [0, 0, -1, val];
    }

    renderer.setClip(isClipOn, plane);
  }

  if (btnClipToggle) {
    btnClipToggle.addEventListener('click', () => {
      btnClipToggle.classList.toggle('active');
      const box = document.querySelector('#clip-controls-box');
      if (box) box.style.display = btnClipToggle.classList.contains('active') ? 'flex' : 'none';
      updateClipPlane();
    });
  }

  if (selectClipPlane) selectClipPlane.addEventListener('change', updateClipPlane);
  if (sliderClipPos) sliderClipPos.addEventListener('input', updateClipPlane);

  // Controles de Câmera
  const zoomInBtn = document.querySelector('#zoom-in');
  const zoomOutBtn = document.querySelector('#zoom-out');
  const rotateLeftBtn = document.querySelector('#rotate-left');
  const rotateRightBtn = document.querySelector('#rotate-right');
  const resetBtn = document.querySelector('#reset-view');

  if (zoomInBtn) zoomInBtn.onclick = () => renderer && renderer.zoom(0.85);
  if (zoomOutBtn) zoomOutBtn.onclick = () => renderer && renderer.zoom(1.18);
  if (rotateLeftBtn) rotateLeftBtn.onclick = () => renderer && renderer.orbit(-0.4, 0);
  if (rotateRightBtn) rotateRightBtn.onclick = () => renderer && renderer.orbit(0.4, 0);
  if (resetBtn) resetBtn.onclick = () => filterBySystem('all');

  // Atalhos de Teclado
  window.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const k = e.key.toUpperCase();
    if (k === 'X' && btnXray) btnXray.click();
    if (k === 'I' && btnIsolate) btnIsolate.click();
    if (k === 'H' && btnHide) btnHide.click();
    if (k === 'A' && btnShowAll) btnShowAll.click();
    if (k === 'F' && selectedElementIdx >= 0) renderer.focusElements([selectedElementIdx]);
    if (k === 'S' && btnSnapshot) btnSnapshot.click();
    if (k === '/' && searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
    if (k === '1' && renderer) renderer.setCamera({ yaw: 0, pitch: 0.08, dist: 2.8, target: [0, 0.85, 0] }, true);
    if (k === '2' && renderer) renderer.setCamera({ yaw: Math.PI, pitch: 0.08, dist: 2.8, target: [0, 0.85, 0] }, true);
    if (k === '3' && renderer) renderer.setCamera({ yaw: Math.PI/2, pitch: 0.08, dist: 2.8, target: [0, 0.85, 0] }, true);
    if (k === '4' && renderer) renderer.setCamera({ yaw: -Math.PI/2, pitch: 0.08, dist: 2.8, target: [0, 0.85, 0] }, true);
  });

  initEngine();
  updateInfoPanel('all');
});
