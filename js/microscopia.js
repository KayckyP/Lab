// LabSim - Laboratório de Microscopia Virtual
document.addEventListener('DOMContentLoaded', () => {
  const slidesData = {
    blood: {
      prep: 'COLORAÇÃO LEISHMAN / WRIGHT · ESFREGAÇO SANGUÍNEO',
      name: 'Esfregaço Sanguíneo Humano',
      desc: 'Observação do sangue periférico normal. Mostra matriz extracelular (plasma sanguíneo simulado), dezenas de eritrócitos com halo central pálido (área mais delgada bicôncava), um neutrófilo segmentado e um linfócito típico.',
      primary: 'Eritrócitos, Neutrófilos & Plaquetas',
      size: 'Hemácias: 7,2 a 7,8 µm',
      highlight: 'O halo central mais claro das hemácias reflete a espessura menor no centro do disco bicôncavo. Ao lado, o neutrófilo apresenta núcleo multilobado (3 a 5 lobos).',
      scaleText: { 40: '~150 µm', 100: '~60 µm', 400: '~15 µm', 1000: '~5 µm' },
      renderSvg: (power) => {
        return `
          <defs>
            <radialGradient id="rbc-grad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#ff7b88"/>
              <stop offset="60%" stop-color="#e03e52"/>
              <stop offset="90%" stop-color="#ab182a"/>
              <stop offset="100%" stop-color="#730a17"/>
            </radialGradient>
            <radialGradient id="rbc-center" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ffa6af" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#e03e52" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="leuco-grad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#c5b6f7"/>
              <stop offset="70%" stop-color="#836ae0"/>
              <stop offset="100%" stop-color="#4e359f"/>
            </radialGradient>
            <radialGradient id="nucleus-grad" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stop-color="#462c82"/>
              <stop offset="80%" stop-color="#241249"/>
              <stop offset="100%" stop-color="#14092b"/>
            </radialGradient>
          </defs>
          <rect width="600" height="600" fill="#f8edf0"/>
          <!-- Fundo celular difuso -->
          <g opacity="0.35">
            <circle cx="80" cy="90" r="32" fill="url(#rbc-grad)"/>
            <circle cx="210" cy="70" r="30" fill="url(#rbc-grad)"/>
            <circle cx="490" cy="110" r="34" fill="url(#rbc-grad)"/>
            <circle cx="530" cy="280" r="28" fill="url(#rbc-grad)"/>
            <circle cx="90" cy="480" r="31" fill="url(#rbc-grad)"/>
            <circle cx="500" cy="460" r="33" fill="url(#rbc-grad)"/>
          </g>
          <!-- Hemácias do campo focal principal -->
          <g id="rbc-group">
            <!-- Hemácia 1 -->
            <circle cx="170" cy="220" r="46" fill="url(#rbc-grad)"/>
            <circle cx="170" cy="220" r="26" fill="url(#rbc-center)"/>
            <ellipse cx="170" cy="220" rx="20" ry="16" fill="#fbc5cb" opacity="0.45"/>
            <!-- Hemácia 2 -->
            <circle cx="270" cy="190" r="44" fill="url(#rbc-grad)"/>
            <circle cx="270" cy="190" r="24" fill="url(#rbc-center)"/>
            <ellipse cx="270" cy="190" rx="18" ry="15" fill="#fbc5cb" opacity="0.45"/>
            <!-- Hemácia 3 -->
            <circle cx="210" cy="330" r="45" fill="url(#rbc-grad)"/>
            <circle cx="210" cy="330" r="25" fill="url(#rbc-center)"/>
            <ellipse cx="210" cy="330" rx="19" ry="16" fill="#fbc5cb" opacity="0.45"/>
            <!-- Hemácia 4 (sobreposta) -->
            <circle cx="120" cy="310" r="43" fill="url(#rbc-grad)"/>
            <circle cx="120" cy="310" r="23" fill="url(#rbc-center)"/>
            <!-- Hemácia 5 -->
            <circle cx="390" cy="380" r="47" fill="url(#rbc-grad)"/>
            <circle cx="390" cy="380" r="26" fill="url(#rbc-center)"/>
            <!-- Hemácia 6 -->
            <circle cx="430" cy="240" r="42" fill="url(#rbc-grad)"/>
            <circle cx="430" cy="240" r="22" fill="url(#rbc-center)"/>
            <!-- Hemácia 7 -->
            <circle cx="310" cy="440" r="44" fill="url(#rbc-grad)"/>
            <circle cx="310" cy="440" r="24" fill="url(#rbc-center)"/>
          </g>
          <!-- Neutrófilo (Leucócito Granulócito) -->
          <g id="neutrophil" transform="translate(320, 260)">
            <circle cx="0" cy="0" r="62" fill="url(#leuco-grad)" opacity="0.88"/>
            <!-- Grânulos citoplasmáticos -->
            <circle cx="-25" cy="-15" r="2.5" fill="#6c4fc2"/>
            <circle cx="-10" cy="-35" r="2" fill="#6c4fc2"/>
            <circle cx="30" cy="-20" r="2.5" fill="#6c4fc2"/>
            <circle cx="20" cy="35" r="2" fill="#6c4fc2"/>
            <circle cx="-25" cy="25" r="2.5" fill="#6c4fc2"/>
            <!-- Núcleo lobulado característico (3 lóbulos unidos por pontes de cromatina) -->
            <path d="M-22,-18 C-35,-5 -28,20 -10,18 C0,17 12,28 26,18 C38,7 32,-15 18,-20 C5,-23 -5,-10 -15,-22 Z" fill="url(#nucleus-grad)"/>
            <circle cx="-16" cy="-2" r="14" fill="url(#nucleus-grad)"/>
            <circle cx="16" cy="2" r="13" fill="url(#nucleus-grad)"/>
            <circle cx="4" cy="-16" r="12" fill="url(#nucleus-grad)"/>
          </g>
          <!-- Plaquetas (fragmentos citoplasmáticos pequenos) -->
          <g id="platelets">
            <ellipse cx="260" cy="265" rx="7" ry="5" fill="#805ad5" transform="rotate(25 260 265)"/>
            <circle cx="263" cy="264" r="2" fill="#3c2174"/>
            <ellipse cx="272" cy="275" rx="6" ry="4" fill="#805ad5" transform="rotate(-15 272 275)"/>
            <circle cx="271" cy="274" r="1.5" fill="#3c2174"/>
          </g>
        `;
      }
    },
    neuron: {
      prep: 'IMPREGNAÇÃO DE PRATA (GOLGI) · CÓRTEX CEREBRAL',
      name: 'Neurônio Piramidal do Córtex',
      desc: 'Visualização de tecido nervoso revelando o neurônio piramidal, caracterizado pelo corpo celular triangular, dendrito apical longo em direção à superfície cortical e arborização dendrítica basal rica em espinhas dendríticas.',
      primary: 'Soma, Dendrito Apical & Axônio',
      size: 'Soma: 20 a 40 µm; Axônio: > 1 mm',
      highlight: 'As minúsculas espinhas dendríticas visíveis nas ramificações são sítios pós-sinápticos onde ocorrem conexões com outros axônios.',
      scaleText: { 40: '~200 µm', 100: '~80 µm', 400: '~20 µm', 1000: '~7 µm' },
      renderSvg: (power) => {
        return `
          <defs>
            <radialGradient id="silver-bg" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stop-color="#ecd9b6"/>
              <stop offset="70%" stop-color="#cfb489"/>
              <stop offset="100%" stop-color="#9d835b"/>
            </radialGradient>
            <linearGradient id="silver-silver" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#342b20"/>
              <stop offset="50%" stop-color="#18130d"/>
              <stop offset="100%" stop-color="#050403"/>
            </linearGradient>
          </defs>
          <rect width="600" height="600" fill="url(#silver-bg)"/>
          <!-- Rede neuropil difusa de fundo -->
          <g stroke="#7b6748" stroke-width="1.2" opacity="0.45" fill="none">
            <path d="M50,120 Q180,180 320,130 T550,220"/>
            <path d="M80,450 Q230,380 380,470 T570,390"/>
            <path d="M120,50 Q160,250 200,550"/>
            <path d="M480,30 Q440,300 420,580"/>
          </g>
          <!-- Neurônio Principal Piramidal -->
          <g stroke="url(#silver-silver)" stroke-linecap="round" fill="none">
            <!-- Dendrito apical longo subindo -->
            <path d="M300,280 C298,220 305,160 295,90 C290,50 270,20 260,0" stroke-width="8"/>
            <!-- Ramos do apical -->
            <path d="M298,170 C330,140 370,120 420,105" stroke-width="4"/>
            <path d="M370,120 C395,95 440,85 470,70" stroke-width="2.5"/>
            <path d="M297,140 C265,110 230,90 190,75" stroke-width="3.5"/>
            <path d="M295,90 C320,60 360,40 390,20" stroke-width="3"/>
            <!-- Espinhas dendríticas no apical -->
            <path d="M298,200 L308,198 M298,185 L288,183 M300,165 L312,163 M301,150 L290,148 M302,130 L313,128 M303,115 L292,114 M304,100 L315,99" stroke-width="2"/>
            <!-- Dendritos basais se espalhando -->
            <path d="M275,340 C220,370 170,410 100,430" stroke-width="6"/>
            <path d="M185,400 C150,440 110,480 60,510" stroke-width="3"/>
            <path d="M325,340 C370,380 430,410 520,440" stroke-width="6"/>
            <path d="M410,395 C450,450 490,490 560,520" stroke-width="3"/>
            <path d="M290,345 C270,410 250,470 230,550" stroke-width="4.5"/>
            <path d="M310,345 C325,410 345,480 370,550" stroke-width="4.5"/>
            <!-- Axônio fino descendo reto -->
            <path d="M300,345 C301,420 299,500 302,600" stroke-width="3" stroke-dasharray="0"/>
            <path d="M300,430 C325,445 350,450 380,455" stroke-width="1.8"/>
            <path d="M300,510 C270,525 240,530 210,535" stroke-width="1.8"/>
          </g>
          <!-- Corpo celular (Soma triangular piramidal) -->
          <polygon points="300,270 330,345 270,345" fill="url(#silver-silver)"/>
          <ellipse cx="300" cy="320" rx="30" ry="25" fill="url(#silver-silver)"/>
          <!-- Núcleo interno pálido característico -->
          <circle cx="300" cy="318" r="11" fill="#7a6242" opacity="0.8"/>
          <circle cx="301" cy="317" r="3.5" fill="#20170a"/>
        `;
      }
    },
    muscle: {
      prep: 'HEMATOXILINA-EOSINA (HE) · MÚSCULO ESQUELÉTICO',
      name: 'Fibras Musculares Estriadas',
      desc: 'Corte longitudinal de músculo estriado esquelético. Fibras cilíndricas multinucleadas com estriações transversais regulares (faixas claras I e escuras A) e núcleos alongados localizados estritamente na periferia celular.',
      primary: 'Sarcômeros, Banda A, Banda I, Núcleos Periféricos',
      size: 'Diâmetro fibra: 10 a 100 µm; Sarcômero: ~2,5 µm',
      highlight: 'O padrão de estriação resulta do alinhamento milimétrico dos miofilamentos de actina e miosina nos sarcômeros, a unidade contrátil elementar.',
      scaleText: { 40: '~180 µm', 100: '~70 µm', 400: '~18 µm', 1000: '~6 µm' },
      renderSvg: (power) => {
        let striations = '';
        for (let x = 30; x < 580; x += 14) {
          striations += `<line x1="${x}" y1="50" x2="${x}" y2="550" stroke="#b42954" stroke-width="7" opacity="0.7"/>`;
          striations += `<line x1="${x + 7}" y1="50" x2="${x + 7}" y2="550" stroke="#f295b0" stroke-width="5" opacity="0.8"/>`;
          striations += `<line x1="${x + 3.5}" y1="50" x2="${x + 3.5}" y2="550" stroke="#52071a" stroke-width="1.5" opacity="0.9"/>`;
        }
        return `
          <defs>
            <linearGradient id="fiber-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#df436e"/>
              <stop offset="50%" stop-color="#fa7498"/>
              <stop offset="100%" stop-color="#c92955"/>
            </linearGradient>
            <radialGradient id="muscle-nucleus" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#4e3188"/>
              <stop offset="80%" stop-color="#241052"/>
              <stop offset="100%" stop-color="#0f0426"/>
            </radialGradient>
          </defs>
          <rect width="600" height="600" fill="#fdf0f3"/>
          <!-- Fibra muscular 1 (Superior) -->
          <rect x="0" y="60" width="600" height="135" fill="url(#fiber-grad)" opacity="0.9"/>
          <!-- Fibra muscular 2 (Central) -->
          <rect x="0" y="215" width="600" height="150" fill="url(#fiber-grad)" opacity="0.95"/>
          <!-- Fibra muscular 3 (Inferior) -->
          <rect x="0" y="385" width="600" height="145" fill="url(#fiber-grad)" opacity="0.9"/>
          <!-- Estriações transversais em todas as fibras -->
          <g id="striation-lines">
            ${striations}
          </g>
          <!-- Endomísio / Espaço intersticial com capilares -->
          <line x1="0" y1="205" x2="600" y2="205" stroke="#fff" stroke-width="18" opacity="0.85"/>
          <line x1="0" y1="375" x2="600" y2="375" stroke="#fff" stroke-width="18" opacity="0.85"/>
          <!-- Núcleos periféricos subsarcolemais alongados -->
          <!-- Fibra 1 -->
          <ellipse cx="140" cy="68" rx="30" ry="9" fill="url(#muscle-nucleus)"/>
          <ellipse cx="380" cy="188" rx="32" ry="8" fill="url(#muscle-nucleus)"/>
          <!-- Fibra 2 -->
          <ellipse cx="230" cy="222" rx="34" ry="9" fill="url(#muscle-nucleus)"/>
          <ellipse cx="490" cy="223" rx="28" ry="8" fill="url(#muscle-nucleus)"/>
          <ellipse cx="110" cy="358" rx="33" ry="9" fill="url(#muscle-nucleus)"/>
          <ellipse cx="360" cy="357" rx="35" ry="9" fill="url(#muscle-nucleus)"/>
          <!-- Fibra 3 -->
          <ellipse cx="190" cy="392" rx="30" ry="8" fill="url(#muscle-nucleus)"/>
          <ellipse cx="450" cy="522" rx="34" ry="9" fill="url(#muscle-nucleus)"/>
        `;
      }
    },
    alveoli: {
      prep: 'CORTE HISTOLÓGICO 4µm · PARÊNQUIMA PULMONAR',
      name: 'Alvéolos Pulmonares e Septos Interalveolares',
      desc: 'Parênquima esponjoso pulmonar apresentando espaços alveolares aéreos delimitados por septos delicados contendo capilares densos, pneumócitos tipo I (troca gasosa) e pneumócitos tipo II (secreção de surfactante).',
      primary: 'Espaços Aéreos Alveolares, Pneumócitos I e II, Capilares',
      size: 'Alvéolo: 200 µm de diâmetro; Barreira alvéolo-capilar: 0,5 µm',
      highlight: 'A barreira hematoaérea é extremamente delgada (menos de 1 mícron), permitindo que o oxigênio e o gás carbônico se difundam passivamente quase instantaneamente.',
      scaleText: { 40: '~250 µm', 100: '~100 µm', 400: '~25 µm', 1000: '~8 µm' },
      renderSvg: (power) => {
        return `
          <defs>
            <radialGradient id="air-lumen" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="85%" stop-color="#fdf4f6"/>
              <stop offset="100%" stop-color="#fce1e8"/>
            </radialGradient>
            <linearGradient id="septa-wall" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#d44b6b"/>
              <stop offset="100%" stop-color="#a31d3d"/>
            </linearGradient>
            <radialGradient id="alv-cap" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#e8364f"/>
              <stop offset="100%" stop-color="#800a1c"/>
            </radialGradient>
          </defs>
          <rect width="600" height="600" fill="#fdf0f4"/>
          <!-- Lúmens alveolares (sacos de ar) -->
          <ellipse cx="170" cy="180" rx="130" ry="110" fill="url(#air-lumen)"/>
          <ellipse cx="440" cy="170" rx="120" ry="115" fill="url(#air-lumen)"/>
          <ellipse cx="180" cy="420" rx="125" ry="120" fill="url(#air-lumen)"/>
          <ellipse cx="430" cy="430" rx="135" ry="115" fill="url(#air-lumen)"/>
          <!-- Paredes e septos interalveolares -->
          <g stroke="url(#septa-wall)" fill="none" stroke-linecap="round">
            <!-- Septo Vertical Central -->
            <path d="M305,20 C300,140 315,280 295,330 C280,390 310,510 300,580" stroke-width="22"/>
            <!-- Septo Horizontal Central -->
            <path d="M20,290 C120,300 240,285 300,310 C380,325 490,295 580,300" stroke-width="20"/>
            <!-- Contornos externos -->
            <path d="M50,80 C110,40 220,50 305,20" stroke-width="16"/>
            <path d="M305,20 C380,45 490,35 550,80" stroke-width="16"/>
            <path d="M50,520 C120,560 210,550 300,580" stroke-width="16"/>
            <path d="M300,580 C390,555 490,565 560,520" stroke-width="16"/>
          </g>
          <!-- Capilares sanguíneos com hemácias no septo -->
          <g id="capillaries">
            <ellipse cx="304" cy="150" rx="6" ry="9" fill="url(#alv-cap)"/>
            <ellipse cx="307" cy="175" rx="6" ry="8" fill="url(#alv-cap)"/>
            <ellipse cx="305" cy="205" rx="7" ry="9" fill="url(#alv-cap)"/>
            <ellipse cx="303" cy="235" rx="6" ry="8" fill="url(#alv-cap)"/>
            <ellipse cx="298" cy="380" rx="6" ry="9" fill="url(#alv-cap)"/>
            <ellipse cx="301" cy="410" rx="7" ry="8" fill="url(#alv-cap)"/>
            <ellipse cx="305" cy="440" rx="6" ry="9" fill="url(#alv-cap)"/>
            <ellipse cx="190" cy="298" rx="8" ry="6" fill="url(#alv-cap)"/>
            <ellipse cx="220" cy="296" rx="9" ry="6" fill="url(#alv-cap)"/>
            <ellipse cx="400" cy="315" rx="8" ry="6" fill="url(#alv-cap)"/>
          </g>
          <!-- Pneumócitos Tipo I (achatados nos septos) -->
          <ellipse cx="220" cy="190" rx="14" ry="4" fill="#301551" transform="rotate(-15 220 190)"/>
          <ellipse cx="380" cy="175" rx="14" ry="4" fill="#301551" transform="rotate(20 380 175)"/>
          <ellipse cx="190" cy="400" rx="14" ry="4" fill="#301551" transform="rotate(10 190 400)"/>
          <!-- Pneumócitos Tipo II (células cúbicas arredondadas secretoras de surfactante) -->
          <g transform="translate(290, 275)">
            <rect x="0" y="0" width="22" height="20" rx="6" fill="#6c3899"/>
            <circle cx="11" cy="10" r="6" fill="#1b0830"/>
          </g>
          <g transform="translate(315, 345)">
            <rect x="0" y="0" width="20" height="20" rx="6" fill="#6c3899"/>
            <circle cx="10" cy="10" r="6" fill="#1b0830"/>
          </g>
        `;
      }
    }
  };

  let activeSlide = 'blood';
  let activePower = 100;
  let focusVal = 100;

  const svgElem = document.querySelector('#scope-svg');
  const stageElem = document.querySelector('#scope-stage');
  const scaleMarker = document.querySelector('#scope-scale-marker');
  const slideCards = document.querySelectorAll('.slide-card');
  const zoomBtns = document.querySelectorAll('.zoom-btn');
  const focusSlider = document.querySelector('#focus-slider');
  const focusValReadout = document.querySelector('#focus-val');

  function renderCurrentSlide() {
    const data = slidesData[activeSlide];
    if (!data) return;

    // Atualiza info textual
    document.querySelector('#slide-prep').textContent = `${data.prep} · ${activePower}x`;
    document.querySelector('#slide-name').textContent = data.name;
    document.querySelector('#slide-desc').textContent = data.desc;
    document.querySelector('#slide-primary').textContent = data.primary;
    document.querySelector('#slide-size').textContent = data.size;
    document.querySelector('#slide-highlight').textContent = data.highlight;

    // Atualiza marcador de escala
    if (scaleMarker && data.scaleText[activePower]) {
      scaleMarker.textContent = `Barra de escala: ${data.scaleText[activePower]}`;
    }

    // Renderiza SVG
    svgElem.innerHTML = data.renderSvg(activePower);

    // Aplica zoom e nitidez
    applyZoomAndFocus();
  }

  function applyZoomAndFocus() {
    // Fator de escala baseado no poder
    const zoomMap = { 40: 0.8, 100: 1.0, 400: 1.45, 1000: 2.1 };
    const baseScale = zoomMap[activePower] || 1.0;
    
    // Efeito de desfoque se o slider estiver fora de 100%
    const blurAmount = Math.abs(100 - focusVal) * 0.08;
    
    svgElem.style.transform = `scale(${baseScale})`;
    svgElem.style.filter = blurAmount > 0.1 ? `blur(${blurAmount.toFixed(1)}px)` : 'none';
  }

  // Eventos de seleção de lâmina
  slideCards.forEach(card => {
    card.addEventListener('click', () => {
      slideCards.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });
      card.classList.add('active');
      card.setAttribute('aria-selected', 'true');
      activeSlide = card.dataset.slide;
      renderCurrentSlide();
    });
  });

  // Eventos de objetiva / zoom
  zoomBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      zoomBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePower = Number(btn.dataset.power);
      renderCurrentSlide();
    });
  });

  // Evento de foco fino
  if (focusSlider) {
    focusSlider.addEventListener('input', (e) => {
      focusVal = Number(e.target.value);
      if (focusValReadout) {
        if (focusVal === 100) {
          focusValReadout.textContent = '100% Nítido';
          focusValReadout.style.color = 'var(--teal)';
        } else {
          focusValReadout.textContent = `${focusVal}% (Fora de foco)`;
          focusValReadout.style.color = '#e07a5f';
        }
      }
      applyZoomAndFocus();
    });
  }

  // Inicializa visualização
  renderCurrentSlide();
});
