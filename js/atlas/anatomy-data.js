/**
 * Metadados, sistemas anatômicos, terminologia em português (pt-BR),
 * descrições fisiológicas didáticas e conexões pedagógicas para o LabSim.
 */

export const SYSTEMS = [
  {
    id: 'skeletal',
    name: 'Sistema Esquelético',
    shortName: 'Esqueleto',
    icon: '🦴',
    color: '#e2d9ba',
    badge: 'SUSTENTAÇÃO & HEMATOPOIESE',
    description: 'Armação estrutural de sustentação do corpo, proteção mecânica de órgãos nobres e alavanca biomecânica para a locomoção. O tecido ósseo armazena 99% do cálcio e fósforo do organismo, e sua medula óssea vermelha realiza a hematopoiese contínua.',
    connection: 'Conecta-se diretamente aos tendões musculares e produz todas as linhagens de células sanguíneas (eritrócitos, leucócitos e plaquetas) investigadas no Laboratório de Hematologia.',
    fact: 'O esqueleto adulto possui 206 ossos articulados. O fêmur é o mais longo e resistente, suportando até 30 vezes o peso corporal.',
    curiosity: 'O esqueleto é dinâmico: a cada 7 a 10 anos, todo o tecido ósseo do corpo é integralmente remodelado pela ação combinada de osteoblastos e osteoclastos.',
    labLink: { text: 'Ver Produção de Células no Lab Hematologia →', url: 'hematologia.html' }
  },
  {
    id: 'muscular',
    name: 'Sistema Muscular',
    shortName: 'Músculos',
    icon: '💪',
    color: '#a85b50',
    badge: 'CINÉTICA & TERMORREGULAÇÃO',
    description: 'Composto por mais de 650 músculos estriados esqueléticos que geram tração sobre os ossos através de tendões. Permite a marcha, mastigação, manutenção da postura ereta e geração contínua de calor metabólico.',
    connection: 'Trabalha em sincronia com os neurônios motores do sistema nervoso central e vascularização de alta demanda energética proveniente das artérias.',
    fact: 'O músculo mais potente em relação ao tamanho é o masseter (mastigatório); o de maior volume é o glúteo máximo.',
    curiosity: 'Cerca de 40% a 50% do peso corporal total de um adulto saudável corresponde à massa muscular esquelética.',
    labLink: { text: 'Observar Tecido Muscular na Microscopia →', url: 'microscopia.html' }
  },
  {
    id: 'cardiac',
    name: 'Coração e Pericárdio',
    shortName: 'Coração',
    icon: '❤️',
    color: '#b96760',
    badge: 'CIRCULAÇÃO & PERFUSÃO',
    description: 'Bomba muscular oca tetracameral situada no mediastino médio. O átrio e ventrículo direitos impulsionam sangue venoso para os pulmões (pequena circulação); o átrio e ventrículo esquerdos ejetam sangue oxigenado na aorta para perfundir todo o organismo.',
    connection: 'Trabalha em ciclo contínuo com os pulmões para trocas gasosas e nutre os rins, cérebro, fígado e musculatura esquelética.',
    fact: 'O miocárdio bate em média 100.000 vezes por dia, bombeando cerca de 7.500 litros de sangue diariamente sob pressões reguladas.',
    curiosity: 'O sangue demora menos de 60 segundos para sair do ventrículo esquerdo, circular por todas as extremidades do corpo e retornar ao átrio direito.',
    labLink: { text: 'Analisar Esfregaço Sanguíneo no Lab Hematologia →', url: 'hematologia.html' }
  },
  {
    id: 'arterial',
    name: 'Sistema Arterial',
    shortName: 'Artérias',
    icon: '🩸',
    color: '#c05245',
    badge: 'DISTRIBUIÇÃO DE ALTA PRESSÃO',
    description: 'Vasos eferentes de alta pressão com túnica média espessa rica em fibras elásticas e músculo liso. Conduzem sangue oxigenado e repleto de nutrientes do coração para os leitos capilares periféricos.',
    connection: 'Artérias coronárias nutrem o próprio coração; carótidas irrigam o encéfalo; e as artérias renais perfundem os glomérulos para filtração urinária.',
    fact: 'A artéria aorta é o maior vaso do corpo humano, com diâmetro médio de 2.5 cm a 3 cm próximo à raiz cardíaca.',
    curiosity: 'As grandes artérias elásticas funcionam como um reservatório de pressão elástica (efeito Windkessel), amortecendo o choque sistólico e mantendo fluxo constante na diástole.',
    labLink: { text: 'Investigar Hemácias e Transporte de O2 no Lab Hematologia →', url: 'hematologia.html' }
  },
  {
    id: 'venous',
    name: 'Sistema Venoso',
    shortName: 'Veias',
    icon: '🔵',
    color: '#527c9f',
    badge: 'RETORNO & CAPACITÂNCIA',
    description: 'Rede vascular aferente de baixa pressão equipada com válvulas semilunares que garantem o retorno unidirecional do sangue desoxigenado dos tecidos periféricos até o coração.',
    connection: 'A veia porta hepática direciona nutrientes absorvidos no trato digestório diretamente para desintoxicação e síntese no fígado antes da circulação sistêmica.',
    fact: 'Aproximadamente 64% de todo o volume sanguíneo do organismo encontra-se nas veias em qualquer momento, servindo como grande reservatório de capacitância.',
    curiosity: 'A contração dos músculos da panturrilha atua como uma verdadeira "bomba periférica", empurrando o sangue venoso contra a força da gravidade em direção ao coração.',
    labLink: { text: 'Observar Plaquetas e Coagulação no Lab Hematologia →', url: 'hematologia.html' }
  },
  {
    id: 'nervous',
    name: 'Sistema Nervoso',
    shortName: 'Nervoso',
    icon: '🧠',
    color: '#d8b565',
    badge: 'CONTROLE & COORDENAÇÃO',
    description: 'Composto pelo sistema nervoso central (encéfalo e medula espinhal) e periférico (nervos cranianos, espinhais e gânglios). Integra estímulos sensoriais, planeja respostas motoras voluntárias e regula reflexos autonômicos.',
    connection: 'Inerva o nó sinusal cardíaco, musculatura lisa respiratória e digestória, e controla a liberação neuroendócrina da hipófise.',
    fact: 'Impulsos elétricos nervosos em fibras mielinizadas saltatórias podem trafegar a velocidades de até 120 m/s (~430 km/h).',
    curiosity: 'O encéfalo humano contém cerca de 86 bilhões de neurônios, estabelecendo trilhões de conexões sinápticas plásticas com altíssimo consumo de glicose e oxigênio.',
    labLink: { text: 'Observar Neurônios e Glia na Microscopia 3D →', url: 'microscopia.html' }
  },
  {
    id: 'respiratory',
    name: 'Sistema Respiratório',
    shortName: 'Respiratório',
    icon: '🫁',
    color: '#b98991',
    badge: 'HEMATOSE & TROCAS GASOSAS',
    description: 'Condutos aéreos (fossas nasais, faringe, laringe, traqueia, árvore brônquica) e pulmões. Permite a difusão passiva de oxigênio para os capilares e a remoção contínua do dióxido de carbono por gradiente de pressão parcial.',
    connection: 'A hematose nos alvéolos pulmonares oxigena o sangue venoso vindo da artéria pulmonar, permitindo o retorno de sangue arterial pelas veias pulmonares.',
    fact: 'A área somada de todos os alvéolos pulmonares ultrapassa 75 a 100 m², equivalente à área de uma quadra de tênis.',
    curiosity: 'Inspiramos cerca de 10.000 a 12.000 litros de ar a cada 24 horas através de cerca de 20.000 ciclos ventilatórios repousados.',
    labLink: { text: 'Examinar Epitélio Respiratório Ciliado na Microscopia →', url: 'microscopia.html' }
  },
  {
    id: 'digestive',
    name: 'Sistema Digestório',
    shortName: 'Digestório',
    icon: '🥣',
    color: '#b8916b',
    badge: 'NUTRIÇÃO & METABOLISMO',
    description: 'Tubo digestório (esôfago, estômago, intestinos delgado e grosso) e glândulas anexas (fígado, pâncreas, glândulas salivares). Realiza trituração, digestão enzimática, absorção de nutrientes e excreção.',
    connection: 'Nutrientes absorvidos penetram os capilares mesentéricos e alcançam o fígado via veia porta para biotransformação antes de suprirem os tecidos.',
    fact: 'O intestino delgado estende-se por cerca de 6 a 7 metros de comprimento, ampliando sua superfície interna em centenas de vezes graças às vilosidades e microvilosidades.',
    curiosity: 'O epitélio gástrico se renova totalmente a cada 3 a 5 dias para proteger as paredes do estômago contra o ácido clorídrico (pH 1.5).',
    labLink: { text: 'Analisar Vilosidades Intestinais na Microscopia →', url: 'microscopia.html' }
  },
  {
    id: 'urinary',
    name: 'Sistema Urinário',
    shortName: 'Urinário',
    icon: '💧',
    color: '#b47961',
    badge: 'EXCREÇÃO & HOMEOSTASE',
    description: 'Rins, ureteres, bexiga urinária e uretra. Filtra o plasma sanguíneo, regula a volemia, o balanço de eletrólitos (sódio, potássio), a pressão arterial (sistema renina-angiotensina) e o pH sistêmico.',
    connection: 'Os rins recebem cerca de 20% a 25% de todo o débito cardíaco através das artérias renais e produzem eritropoietina (EPO), que estimula a produção de glóbulos vermelhos na medula óssea.',
    fact: 'Os rins filtram aproximadamente 180 litros de plasma diariamente, reabsorvendo mais de 99% da água e eletrólitos para produzir 1.5 litro de urina final.',
    curiosity: 'Cada rim humano contém cerca de 1 milhão de néfrons funcionais capazes de ultrafiltração glomerular seletiva.',
    labLink: { text: 'Ver Relação com Eritropoiese no Lab Hematologia →', url: 'hematologia.html' }
  },
  {
    id: 'lymphatic',
    name: 'Sistema Linfático e Imune',
    shortName: 'Linfático',
    icon: '🛡️',
    color: '#879f7c',
    badge: 'IMUNIDADE & DRENAGEM',
    description: 'Capilares e vasos linfáticos, ductos torácicos, linfonodos, timo e baço. Drena o excesso de líquido intersticial de volta à circulação venosa, transporta lipídios absorvidos (quilo) e abriga células imunes.',
    connection: 'Linfonodos filtram a linfa e ativam linfócitos T e B quando patógenos são detectados, enviando anticorpos diretamente para o plasma sanguíneo.',
    fact: 'Existem entre 500 e 700 linfonodos espalhados estrategicamente pelo corpo, com concentrações no pescoço, axilas, mediastino e virilha.',
    curiosity: 'Diferente do sistema cardiovascular, o sistema linfático não tem bomba central: a linfa move-se pela compressão dos músculos e pulsação arterial vizinha.',
    labLink: { text: 'Estudar Linfócitos e Defesa no Lab Hematologia →', url: 'hematologia.html' }
  },
  {
    id: 'endocrine',
    name: 'Sistema Endócrino',
    shortName: 'Endócrino',
    icon: '⚗️',
    color: '#c5a09a',
    badge: 'COMUNICAÇÃO HORMONAL',
    description: 'Glândulas secretoras sem ductos (hipófise, tireoide, paratireoides, suprarrenais, pâncreas endócrino e gônadas). Liberam hormônios na circulação que orquestram processos metabólicos lentos e sustentados.',
    connection: 'O eixo hipotálamo-hipofisário traduz estímulos do sistema nervoso em sinais endócrinos que modulam a tireoide, gônadas e córtex da suprarrenal.',
    fact: 'A hipófise, do tamanho aproximado de uma ervilha, controla a secreção hormonal de quase todas as outras glândulas do corpo.',
    curiosity: 'Hormônios agem em concentrações extremamente baixas no sangue (picomolares a nanomolares), reconhecidos por receptores de altíssima especificidade.',
    labLink: { text: 'Observar Ilhotas Pancreáticas na Microscopia →', url: 'microscopia.html' }
  },
  {
    id: 'reproductive',
    name: 'Sistema Reprodutor',
    shortName: 'Reprodutor',
    icon: '🧬',
    color: '#bda098',
    badge: 'GAMETOGÊNESE & ANDRÓGENOS',
    description: 'Testículos, epidídimos, ductos deferentes, vesículas seminais, próstata e pênis. Responsável pela produção contínua de espermatozoides (espermatogênese), sêmen e síntese de hormônios androgênicos como a testosterona.',
    connection: 'Regulado pelos hormônios hipofisários LH (hormônio luteinizante) e FSH (hormônio folículo-estimulante).',
    fact: 'Os testículos produzem cerca de 1.000 espermatozoides por segundo, totalizando dezenas de milhões diariamente.',
    curiosity: 'A temperatura testicular é mantida cerca de 2°C a 3°C abaixo da temperatura corporal interna pelo músculo cremaster e plexo pampiniforme.',
    labLink: { text: 'Examinar Tecido Testicular na Microscopia →', url: 'microscopia.html' }
  },
  {
    id: 'sensory',
    name: 'Órgãos dos Sentidos',
    shortName: 'Sentidos',
    icon: '👁️',
    color: '#b0c8ce',
    badge: 'TRANSDUÇÃO SENSORIAL',
    description: 'Órgãos fotorreceptores (olhos com córnea, cristalino e retina), mecanorreceptores da audição e equilíbrio (orelha interna, caracol e canais semicirculares), vias olfatórias e gustativas.',
    connection: 'Transduz estímulos de ondas luminosas, sonoras e químicas em potenciais de ação conduzidos pelos nervos óptico (II), vestibulococlear (VIII) e olfatório (I).',
    fact: 'A retina humana possui mais de 120 milhões de bastonetes (visão crepuscular) e cerca de 6 milhões de cones (visão de cores em alta resolução).',
    curiosity: 'A orelha interna contém os menores ossículos do corpo humano: o martelo, a bigorna e o estribo (que mede apenas 3 milímetros).',
    labLink: { text: 'Observar Camadas da Retina na Microscopia 3D →', url: 'microscopia.html' }
  },
  {
    id: 'integumentary',
    name: 'Superfície Corporal (Tegumento)',
    shortName: 'Pele / Tegumento',
    icon: '🧍',
    color: '#ba9b7d',
    badge: 'BARREIRA & TERMORREGULAÇÃO',
    description: 'Pele (epiderme queratinizada e derme fibrosa densa), pelos, unhas e glândulas sudoríparas e sebáceas. Proteção contra desidratação, radiação ultravioleta e microrganismos invasores.',
    connection: 'Contém miríades de terminações nervosas livres e corpúsculos sensoriais que transmitem sensações táteis, térmicas e dolorosas ao córtex somatossensorial.',
    fact: 'A pele é o órgão mais pesado do corpo humano, correspondendo a cerca de 16% do peso total (aproximadamente 4 a 5 kg em um adulto).',
    curiosity: 'Perdemos cerca de 30.000 a 40.000 células mortas de pele por minuto, totalizando quase 4 kg de queratinócitos descamados por ano.',
    labLink: { text: 'Analisar Estrutura da Pele na Microscopia 3D →', url: 'microscopia.html' }
  },
  {
    id: 'connective',
    name: 'Tecido Conjuntivo e Fáscias',
    shortName: 'Conjuntivo',
    icon: '🔗',
    color: '#aec3bb',
    badge: 'ESTABILIZAÇÃO & BIOMECÂNICA',
    description: 'Cartilagens hialinas articulares, fibrocartilagens intervertebrais, ligamentos estabilizadores, cápsulas articulares e fáscias de envelope muscular. Transmite e dissipa forças biomecânicas.',
    connection: 'Reveste todos os ventres musculares e preenche os espaços entre órgãos, fornecendo suporte mecânico e vias de passagem vasculonervosa.',
    fact: 'A cartilagem articular não possui vasos sanguíneos nem inervação própria: sua nutrição depende inteiramente da difusão de solutos do líquido sinovial durante o movimento.',
    curiosity: 'O colágeno, principal proteína do tecido conjuntivo, responde por mais de 25% a 30% de toda a massa proteica do corpo humano.',
    labLink: { text: 'Observar Fibras de Colágeno na Microscopia →', url: 'microscopia.html' }
  },
  {
    id: 'pregnancy',
    name: 'Gestação e Placenta (Feminino)',
    shortName: 'Gestação',
    icon: '🤰',
    color: '#e0a3ba',
    badge: 'EMBRIOGÊNESE & PLACENTA',
    description: 'Estruturas de referência uteroplacentária, membranas fetais, cordão umbilical e placenta de referência do modelo feminino HuBMAP / HRA.',
    connection: 'A placenta atua simultaneamente como pulmão, rim, trato digestório e glândula endócrina para o feto em desenvolvimento.',
    fact: 'A circulação materno-fetal é estritamente separada pela barreira placentária, evitando a mistura direta de sangue materno e fetal.',
    curiosity: 'O cordão umbilical contém duas artérias umbilicais (que levam sangue desoxigenado do feto à placenta) e uma veia umbilical (que traz sangue rico em O2 e nutrientes).'
  }
];

export const DEFAULT_VISIBLE = [
  'cardiac', 'sensory', 'skeletal', 'muscular', 'arterial',
  'venous', 'nervous', 'respiratory', 'digestive', 'urinary',
  'lymphatic', 'endocrine', 'reproductive', 'connective'
];

// Para o modelo feminino, o sistema tegumentar (pele/superfície) é a camada
// principal visível — sem ela o corpo inteiro fica transparente.
export const DEFAULT_VISIBLE_FEMALE = [
  'integumentary', 'cardiac', 'skeletal', 'muscular', 'arterial',
  'venous', 'nervous', 'respiratory', 'digestive', 'urinary',
  'lymphatic', 'endocrine', 'reproductive', 'connective'
];

/**
 * Fichas didáticas para os principais órgãos e estruturas do corpo humano.
 */
export const DIDACTIC_CARDS = {
  'heart': {
    name: 'Coração',
    system: 'cardiac',
    description: 'Bomba muscular tetracameral situada no mediastino médio. O átrio e ventrículo direitos operam com sangue venoso em baixa pressão rumo aos pulmões; o átrio e ventrículo esquerdos impulsionam sangue oxigenado para a aorta sob alta pressão sistêmica.',
    function: 'Propulsão sanguínea contínua para manutenção da perfusão tecidual e oxigenação celular.',
    curiosity: 'Bate em média 100.000 vezes por dia, bombeando cerca de 7.500 litros de sangue diariamente.',
    labLink: { text: 'Ver Células Sanguíneas no Lab Hematologia →', url: 'hematologia.html' }
  },
  'brain': {
    name: 'Encéfalo (Cérebro)',
    system: 'nervous',
    description: 'Centro de integração e comando do sistema nervoso central. Compreende o telencéfalo (córtex e núcleos da base), diencéfalo, tronco encefálico e cerebelo.',
    function: 'Processamento sensorial complexo, motricidade voluntária, cognição superior, memória, emoções e controle autonômico.',
    curiosity: 'Representa cerca de 2% da massa corporal, mas consome aproximadamente 20% de todo o oxigênio e glicose do organismo.',
    labLink: { text: 'Ver Neurônios na Microscopia 3D →', url: 'microscopia.html' }
  },
  'liver': {
    name: 'Fígado',
    system: 'digestive',
    description: 'Maior glândula e víscera do corpo humano, situada no hipocôndrio direito. Possui dupla irrigação sanguínea (veia porta hepática e artéria hepática própria).',
    function: 'Metabolismo de glicose e lipídios, síntese de proteínas plasmáticas (albumina, fatores de coagulação), produção de bile e biotransformação/desintoxicação de metabólitos.',
    curiosity: 'Possui extraordinária capacidade regenerativa celular a partir de hepatócitos quiescentes.',
    labLink: { text: 'Analisar Hepatócitos na Microscopia →', url: 'microscopia.html' }
  },
  'stomach': {
    name: 'Estômago',
    system: 'digestive',
    description: 'Porção dilatada do tubo digestório entre o esôfago e o duodeno. Possui camadas musculares oblíqua, circular e longitudinal para trituração mecânica.',
    function: 'Armazenamento do bolo alimentar, secreção de ácido clorídrico (HCl) e pepsinogênio, iniciando a digestão proteica e formando o quimo.',
    curiosity: 'A barreira mucosa e de bicarbonato renova seu epitélio superficial a cada 3 a 5 dias para resistir ao pH extremamente ácido (~1.5 a 2.0).',
    labLink: { text: 'Ver Tecido Gástrico na Microscopia →', url: 'microscopia.html' }
  },
  'spleen': {
    name: 'Baço',
    system: 'lymphatic',
    description: 'Órgão linfoide secundário intraperitoneal no hipocôndrio esquerdo. Apresenta polpa branca (tecido linfoide periarteriolar) e polpa vermelha (cordões de Billroth e seios venosos).',
    function: 'Filtração imunológica do sangue, remoção e hemocatereze de eritrócitos senescentes, e reserva circulante de plaquetas e monócitos.',
    curiosity: 'Em situações de anemia extrema ou trauma, pode retomar atividade hematopoiética compensatória.',
    labLink: { text: 'Ver Hemácias e Linfócitos no Lab Hematologia →', url: 'hematologia.html' }
  },
  'pancreas': {
    name: 'Pâncreas',
    system: 'digestive',
    description: 'Glândula mista retroperitoneal localizada posteriormente ao estômago. O componente exócrino é formado por ácinos serosos; o endócrino, pelas ilhotas de Langerhans.',
    function: 'Secreção de suco pancreático rico em enzimas digestivas e bicarbonato, e liberação de hormônios reguladores (insulina e glucagon).',
    curiosity: 'As ilhotas endócrinas constituem apenas cerca de 1% a 2% do volume total do órgão, mas controlam a glicemia de todo o organismo.',
    labLink: { text: 'Ver Ilhotas de Langerhans na Microscopia →', url: 'microscopia.html' }
  },
  'urinary bladder': {
    name: 'Bexiga Urinária',
    system: 'urinary',
    description: 'Reservatório muscular cavitário na cavidade pélvica constituído pelo músculo detrusor, com epitélio de transição (urotélio) altamente distensível.',
    function: 'Armazenamento temporário de urina drenada continuamente pelos ureteres até o ato miccional.',
    curiosity: 'Pode acomodar de 400 mL a 600 mL de urina em condições normais, emitindo os primeiros sinais de repleção com cerca de 150 a 200 mL.'
  },
  'trachea': {
    name: 'Traqueia',
    system: 'respiratory',
    description: 'Conduto cartilaginoso e membranoso que se estende da laringe (ao nível de C6) até a bifurcação nos brônquios principais (carina, ao nível de T4-T5).',
    function: 'Condução, aquecimento, umidificação e purificação do ar inspirado por meio do epitélio pseudoestratificado colunar ciliado.',
    curiosity: 'Seus anéis cartilaginosos têm formato de "C" incompletos posteriormente para permitir a expansão do esôfago durante a deglutição.',
    labLink: { text: 'Ver Epitélio Ciliado na Microscopia →', url: 'microscopia.html' }
  },
  'diaphragm': {
    name: 'Músculo Diafragma',
    system: 'respiratory',
    description: 'Septo músculo-tendíneo cupuliforme que separa a cavidade torácica da abdominal, inervado pelos nervos frênicos (C3-C5).',
    function: 'Principal motor da ventilação pulmonar; sua contração aumenta o diâmetro vertical da caixa torácica e gera pressão negativa intratorácica.',
    curiosity: 'Possui três aberturas vitais: o forame da veia cava, o hiato esofágico e o hiato aórtico.'
  },
  'femur': {
    name: 'Fêmur',
    system: 'skeletal',
    description: 'Osso longo que compõe o esqueleto da coxa, articulando-se proximalmente com o acetábulo do osso do quadril e distalmente com a tíbia e patela.',
    function: 'Sustentação primária da carga corpórea ereta e alavanca biomecânica para marcha, corrida e salto.',
    curiosity: 'É o osso mais longo, mais volumoso e mais resistente do corpo humano, suportando forças de compressão monumentais.',
    labLink: { text: 'Ver Medula Óssea Vermelha no Lab Hematologia →', url: 'hematologia.html' }
  },
  'lung': {
    name: 'Pulmão',
    system: 'respiratory',
    description: 'Órgão par esponjoso localizado na cavidade pleural torácica, dividido em lobos (3 no direito, 2 no esquerdo devido ao leito cardíaco).',
    function: 'Hematose: oxigenação do sangue venoso e eliminação do CO2 pelos alvéolos.',
    curiosity: 'O pulmão direito é cerca de 10% mais volumoso que o esquerdo devido à inclinação do ápice do coração.',
    labLink: { text: 'Ver Alvéolos Pulmonares na Microscopia →', url: 'microscopia.html' }
  },
  'kidney': {
    name: 'Rim',
    system: 'urinary',
    description: 'Órgão par retroperitoneal em formato de feijão, situado entre T12 e L3. Contém córtex renal, medula com pirâmides de Malpighi e cálices coletores.',
    function: 'Filtração do sangue, controle osmótico, regulação da pressão arterial e secreção de eritropoietina.',
    curiosity: 'Filtra cerca de 1.200 mL de sangue por minuto, produzindo aproximadamente 1 a 1.5 litro de urina ao dia.',
    labLink: { text: 'Ver Relação com Eritrócitos no Lab Hematologia →', url: 'hematologia.html' }
  },
  'uterus': {
    name: 'Útero',
    system: 'reproductive',
    description: 'Órgão muscular cavitário piriforme no centro da pelve feminina entre a bexiga e o reto. Apresenta fundo, corpo, istmo e colo (cérvix), com paredes espessas formadas por endométrio, miométrio e perimétrio.',
    function: 'Acomodação, nutrição e proteção do concepto durante a gestação, e ejeção no parto através de contrações miometriais coordenadas por ocitocina.',
    curiosity: 'Durante a gravidez a termo, o útero aumenta seu peso em cerca de 20 vezes e seu volume interno em mais de 500 vezes.'
  },
  'ovary': {
    name: 'Ovário',
    system: 'reproductive',
    description: 'Gônada feminina par situada na fossa ovariana da pelve, ligada ao útero pelo ligamento útero-ovárico. Apresenta córtex ovariano (com folículos em diversos estágios) e medula vascularizada.',
    function: 'Oogênese (produção e maturação de oócitos) e secreção endócrina cíclica de estrogênios e progesterona.',
    curiosity: 'Ao nascer, a mulher possui cerca de 1 a 2 milhões de folículos primordiais, dos quais apenas cerca de 400 a 500 atingirão a ovulação madura ao longo da vida fértil.'
  },
  'fallopian tube': {
    name: 'Tuba Uterina (Trompa de Falópio)',
    system: 'reproductive',
    description: 'Conduto tubular músculo-mucoso par com cerca de 10 cm a 12 cm que se estende do corno uterino ao ovário, composto por istmo, ampola e infundíbulo com fímbrias.',
    function: 'Captação do oócito liberado na ovulação pelas fímbrias, local de fertilização espermática (na ampola) e transporte do zigoto/blastocisto até o útero.',
    curiosity: 'O transporte do óvulo depende dos batimentos coordenados de milhares de cílios epiteliais e de contrações peristálticas suaves da camada muscular.'
  },
  'vagina': {
    name: 'Vagina',
    system: 'reproductive',
    description: 'Conduto fibromuscular tubular elástico de 7 cm a 9 cm que se estende do colo uterino (fórnice) até o óstio vaginal no vestíbulo vulvar.',
    function: 'Canal de parto, via de escoamento do fluxo menstrual e órgão copulador feminino.',
    curiosity: 'A microbiota comensal dominada por lactobacilos produz ácido lático, mantendo um pH protetor ácido (~3.8 a 4.5) que inibe a proliferação de fungos e bactérias patogênicas.'
  },
  'placenta': {
    name: 'Placenta',
    system: 'pregnancy',
    description: 'Órgão transitório fetomaterno hemocorial aderido à parede uterina, formado por componente fetal (córion frondoso) e materno (decídua basal).',
    function: 'Hematose fetal, transporte ativo de aminoácidos e glicose, excreção de ureia fetal e secreção de hCG, progesterona e lactogênio placentário.',
    curiosity: 'Ao término da gravidez, a placenta pesa cerca de 500 gramas e possui uma rede capilar com mais de 50 km de extensão.'
  }
};

/**
 * Tabela léxica expandida para tradução anatômica automática e científica.
 */
const VOCABULARY = [
  // Estruturas
  [/\bbone\b/gi, 'osso'],
  [/\bbones\b/gi, 'ossos'],
  [/\bmuscle\b/gi, 'músculo'],
  [/\bmuscles\b/gi, 'músculos'],
  [/\bartery\b/gi, 'artéria'],
  [/\barteries\b/gi, 'artérias'],
  [/\bvein\b/gi, 'veia'],
  [/\bveins\b/gi, 'veias'],
  [/\bnerve\b/gi, 'nervo'],
  [/\bnerves\b/gi, 'nervos'],
  [/\bligament\b/gi, 'ligamento'],
  [/\bligaments\b/gi, 'ligamentos'],
  [/\btendon\b/gi, 'tendão'],
  [/\btendons\b/gi, 'tendões'],
  [/\bcartilage\b/gi, 'cartilagem'],
  [/\bcartilages\b/gi, 'cartilagens'],
  [/\bgland\b/gi, 'glândula'],
  [/\bglands\b/gi, 'glândulas'],
  [/\blymph node\b/gi, 'linfonodo'],
  [/\blymph nodes\b/gi, 'linfonodos'],
  [/\bnode\b/gi, 'nódulo / linfonodo'],
  [/\bnodes\b/gi, 'linfonodos'],
  [/\bbranch\b/gi, 'ramo'],
  [/\bbranches\b/gi, 'ramos'],
  [/\bplexus\b/gi, 'plexo'],
  [/\bvascular tree\b/gi, 'árvore vascular'],
  [/\btrunk\b/gi, 'tronco'],
  [/\blobe\b/gi, 'lobo'],
  [/\blobes\b/gi, 'lobos'],
  [/\bcortex\b/gi, 'córtex'],
  [/\bventricle\b/gi, 'ventrículo'],
  [/\batrium\b/gi, 'átrio'],
  [/\bvalva\b/gi, 'valva'],
  [/\bvalve\b/gi, 'válvula / valva'],
  [/\barch\b/gi, 'arco'],
  [/\bvertebra\b/gi, 'vértebra'],
  [/\bvertebrae\b/gi, 'vértebras'],
  [/\brib\b/gi, 'costela'],
  [/\bribs\b/gi, 'costelas'],
  [/\bskull\b/gi, 'crânio'],
  [/\bspine\b/gi, 'coluna vertebral'],
  [/\bjoint\b/gi, 'articulação'],
  [/\bjoints\b/gi, 'articulações'],
  [/\bfascia\b/gi, 'fáscia'],
  [/\bsheath\b/gi, 'bainha'],
  [/\bforamen\b/gi, 'forame'],
  [/\bcanal\b/gi, 'canal'],
  [/\bsinus\b/gi, 'seio'],

  // Posições e orientações relativas
  [/\bleft\b/gi, 'esquerdo(a)'],
  [/\bright\b/gi, 'direito(a)'],
  [/\bsuperior\b/gi, 'superior'],
  [/\binferior\b/gi, 'inferior'],
  [/\banterior\b/gi, 'anterior'],
  [/\bposterior\b/gi, 'posterior'],
  [/\bmedial\b/gi, 'medial'],
  [/\blateral\b/gi, 'lateral'],
  [/\bproximal\b/gi, 'proximal'],
  [/\bdistal\b/gi, 'distal'],
  [/\binternal\b/gi, 'interno(a)'],
  [/\bexternal\b/gi, 'externo(a)'],
  [/\bsuperficial\b/gi, 'superficial'],
  [/\bdeep\b/gi, 'profundo(a)'],
  [/\bascending\b/gi, 'ascendente'],
  [/\bdescending\b/gi, 'descendente'],
  [/\btransverse\b/gi, 'transverso(a)'],
  [/\blongitudinal\b/gi, 'longitudinal'],

  // Regiões corpóreas
  [/\bhead\b/gi, 'cabeça'],
  [/\bneck\b/gi, 'pescoço'],
  [/\bthorax\b/gi, 'tórax'],
  [/\babdomen\b/gi, 'abdômen'],
  [/\bpelvis\b/gi, 'pelve'],
  [/\bupper limb\b/gi, 'membro superior'],
  [/\blower limb\b/gi, 'membro inferior'],
  [/\bhand\b/gi, 'mão'],
  [/\bfoot\b/gi, 'pé'],
  [/\barm\b/gi, 'braço'],
  [/\bforearm\b/gi, 'antebraço'],
  [/\bthigh\b/gi, 'coxa'],
  [/\bleg\b/gi, 'perna'],

  // Órgãos e ossos específicos
  [/\bheart\b/gi, 'coração'],
  [/\blung\b/gi, 'pulmão'],
  [/\blungs\b/gi, 'pulmões'],
  [/\bbrain\b/gi, 'encéfalo'],
  [/\bcerebrum\b/gi, 'cérebro'],
  [/\bcerebellum\b/gi, 'cerebelo'],
  [/\bspinal cord\b/gi, 'medula espinhal'],
  [/\bstomach\b/gi, 'estômago'],
  [/\bliver\b/gi, 'fígado'],
  [/\bkidney\b/gi, 'rim'],
  [/\bkidneys\b/gi, 'rins'],
  [/\bspleen\b/gi, 'baço'],
  [/\bpancreas\b/gi, 'pâncreas'],
  [/\btrachea\b/gi, 'traqueia'],
  [/\besophagus\b/gi, 'esôfago'],
  [/\bgallbladder\b/gi, 'vesícula biliar'],
  [/\bbladder\b/gi, 'bexiga'],
  [/\bureter\b/gi, 'ureter'],
  [/\burethra\b/gi, 'uretra'],
  [/\bthyroid\b/gi, 'tireoide'],
  [/\beye\b/gi, 'olho'],
  [/\beyes\b/gi, 'olhos'],
  [/\bear\b/gi, 'orelha / ouvido'],
  [/\btongue\b/gi, 'língua'],
  [/\bdiaphragm\b/gi, 'diafragma'],
  [/\buterus\b/gi, 'útero'],
  [/\bovary\b/gi, 'ovário'],
  [/\bovaries\b/gi, 'ovários'],
  [/\bfallopian tube\b/gi, 'tuba uterina'],
  [/\buterine tube\b/gi, 'tuba uterina'],
  [/\bcervix\b/gi, 'colo do útero (cérvix)'],
  [/\bvagina\b/gi, 'vagina'],
  [/\bplacenta\b/gi, 'placenta'],
  [/\bumbilical cord\b/gi, 'cordão umbilical'],
  [/\bmammary gland\b/gi, 'glândula mamária'],
  [/\bbreast\b/gi, 'mama'],
  [/\bskin of body\b/gi, 'pele / tegumento corporal'],
  [/\bfemur\b/gi, 'fêmur'],
  [/\btibia\b/gi, 'tíbia'],
  [/\bfibula\b/gi, 'fíbula'],
  [/\bhumerus\b/gi, 'úmero'],
  [/\bradius\b/gi, 'rádio'],
  [/\bulna\b/gi, 'ulna'],
  [/\bclavicle\b/gi, 'clavícula'],
  [/\bscapula\b/gi, 'escápula'],
  [/\bsternum\b/gi, 'esterno'],
  [/\bpatella\b/gi, 'patela'],
  [/\bmandible\b/gi, 'mandíbula'],
  [/\bmaxilla\b/gi, 'maxila'],
  [/\baorta\b/gi, 'aorta']
];

/**
 * Traduz nomes anatômicos em inglês para português brasileiro culto e científico.
 */
export function translateAnatomyName(englishName) {
  if (!englishName) return '';
  const lower = englishName.trim().toLowerCase();

  if (DIDACTIC_CARDS[lower]) {
    return DIDACTIC_CARDS[lower].name;
  }

  let pt = englishName;
  for (const [regex, replacement] of VOCABULARY) {
    pt = pt.replace(regex, replacement);
  }

  // Ajustes de concordância comuns
  pt = pt.replace(/\besquerdo\(a\)\s+([a-zA-ZÀ-ÿ]+)/gi, '$1 esquerdo(a)');
  pt = pt.replace(/\bdireito\(a\)\s+([a-zA-ZÀ-ÿ]+)/gi, '$1 direito(a)');
  pt = pt.replace(/\binferior\s+([a-zA-ZÀ-ÿ]+)/gi, '$1 inferior');
  pt = pt.replace(/\bsuperior\s+([a-zA-ZÀ-ÿ]+)/gi, '$1 superior');
  pt = pt.replace(/\btransverso\(a\)\s+([a-zA-ZÀ-ÿ]+)/gi, '$1 transverso(a)');

  return pt.charAt(0).toUpperCase() + pt.slice(1);
}

/**
 * Retorna a descrição científica para uma estrutura.
 */
export function getStructureExplanation(name, systemId) {
  const lower = (name || '').trim().toLowerCase();
  if (DIDACTIC_CARDS[lower]) {
    return DIDACTIC_CARDS[lower].description;
  }
  const sys = SYSTEMS.find(s => s.id === systemId);
  return sys ? sys.description : 'Estrutura anatômica modelada pelo atlas BodyParts3D 4.0.';
}
