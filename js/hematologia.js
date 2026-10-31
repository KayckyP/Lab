// LabSim - Laboratório de Hematologia
document.addEventListener('DOMContentLoaded', () => {
  const components = {
    hemacias: {
      label: 'TRANSPORTE DE OXIGÊNIO',
      title: 'Hemácias (Eritrócitos)',
      text: 'As hemácias, ou glóbulos vermelhos, são células anucleadas ricas em hemoglobina, uma proteína complexa que se liga avidamente ao oxigênio nos pulmões e o libera nos tecidos celulares pelo organismo.',
      fact: 'Cada hemácia vive em média 120 dias e transporta cerca de 1 bilhão de moléculas de oxigênio!',
      details: 'Sua forma bicôncava maximiza a superfície de contato para troca gasosa e permite grande flexibilidade para percorrer capilares diminutos.',
      style: 'red'
    },
    leucocitos: {
      label: 'DEFESA E IMUNIDADE',
      title: 'Leucócitos (Glóbulos Brancos)',
      text: 'Os leucócitos formam a linha de frente do sistema imunológico. Dividem-se em granulócitos (neutrófilos, eosinófilos, basófilos) e agranulócitos (linfócitos e monócitos), identificando e neutralizando patógenos.',
      fact: 'Em resposta a infecções, a produção medular de leucócitos pode aumentar vertiginosamente em poucas horas.',
      details: 'São capazes de realizar diapedese (atravessar a parede dos capilares sanguíneos) para alcançar focos de inflamação nos tecidos.',
      style: 'violet'
    },
    plaquetas: {
      label: 'COAGULAÇÃO E HEMOSTASIA',
      title: 'Plaquetas (Trombócitos)',
      text: 'Fragmentos citoplasmáticos derivados de megacariócitos na medula óssea. Ao detectar dano endotelial vascular, ativam-se rapidamente, aderem entre si e liberam fatores que iniciam a cascata de coagulação.',
      fact: 'As plaquetas não são células inteiras, mas realizam reações bioquímicas ultrarrápidas em segundos.',
      details: 'Formam o chamado tampão hemostático primário, impedindo hemorragias imediatas até a estabilização com rede de fibrina.',
      style: 'teal'
    }
  };

  const illustration = document.querySelector('#detail-illustration');
  const tabs = document.querySelectorAll('.component-tab');

  tabs.forEach(button => {
    button.addEventListener('click', () => {
      const compKey = button.dataset.component;
      const item = components[compKey];
      if (!item) return;

      tabs.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      document.querySelector('#detail-label').textContent = item.label;
      document.querySelector('#detail-title').textContent = item.title;
      document.querySelector('#detail-text').textContent = item.text;
      document.querySelector('#detail-fact span').textContent = item.fact;

      const extra = document.querySelector('#detail-extra');
      if (extra) extra.textContent = item.details;

      if (illustration) {
        illustration.className = `detail-illustration ${item.style}`;
      }
    });
  });

  // Quiz interativo
  const questions = [
    {
      q: 'Qual é a principal função fisiológica das hemácias?',
      a: ['Fagocitar bactérias invasoras', 'Transportar oxigênio aos tecidos', 'Secretar imunoglobulinas', 'Produzir hormônios esteroides'],
      correct: 1,
      e: 'As hemácias contêm cerca de 270 milhões de moléculas de hemoglobina cada, especializadas na fixação e entrega de oxigênio.'
    },
    {
      q: 'Qual componente sanguíneo desempenha o papel central de defesa imune celular e humoral?',
      a: ['Plaquetas', 'Hemácias', 'Leucócitos', 'Albumina plasmática'],
      correct: 2,
      e: 'Os leucócitos (como neutrófilos, linfócitos T e B, e macrófagos) coordenam e executam as respostas imunológicas.'
    },
    {
      q: 'Ao ocorrer uma lesão na parede de um vaso, quais estruturas são imediatamente recrutadas para hemostasia inicial?',
      a: ['Plaquetas', 'Eritrócitos maduros', 'Osteoblastos', 'Células gliais'],
      correct: 0,
      e: 'As plaquetas aderem ao colágeno exposto e agregam-se formando o tampão hemostático inicial que interrompe o sangramento.'
    },
    {
      q: 'A hemoglobina, responsável pela pigmentação avermelhada e afinidade ao oxigênio, está concentrada em:',
      a: ['Plaquetas', 'Hemácias', 'Linfócitos', 'Megacariócitos'],
      correct: 1,
      e: 'A hemoglobina preenche praticamente todo o citoplasma das hemácias maduras humanas.'
    },
    {
      q: 'No esfregaço de sangue periférico padrão, quais são fragmentos anucleados derivados de megacariócitos?',
      a: ['Leucócitos basófilos', 'Monócitos', 'Plaquetas', 'Eosinófilos'],
      correct: 2,
      e: 'Plaquetas são fragmentos desprendidos do citoplasma dos megacariócitos medulares, não possuindo núcleo.'
    }
  ];

  const app = document.querySelector('#quiz-app');
  let current = 0;
  let answers = [];

  function renderQuestion() {
    if (!app) return;
    const question = questions[current];
    const progressPercent = ((current) / questions.length) * 100;

    app.innerHTML = `
      <div class="quiz-progress">
        <span>Questão ${current + 1} de ${questions.length}</span>
        <div class="progress-track" role="progressbar" aria-valuenow="${current + 1}" aria-valuemin="1" aria-valuemax="${questions.length}">
          <i style="width: ${progressPercent}%"></i>
        </div>
      </div>
      <h3>${question.q}</h3>
      <div class="answers">
        ${question.a.map((answer, i) => `
          <button class="answer" type="button" data-index="${i}">
            <span>${String.fromCharCode(65 + i)}</span>
            ${answer}
          </button>
        `).join('')}
      </div>
      <div class="quiz-feedback" hidden></div>
      <button class="button primary next-button" type="button" hidden>
        ${current === questions.length - 1 ? 'Concluir investigação e ver resultado' : 'Próxima questão'} 
        <span aria-hidden="true">→</span>
      </button>
    `;

    app.querySelectorAll('.answer').forEach(button => {
      button.addEventListener('click', () => chooseAnswer(Number(button.dataset.index)));
    });
  }

  function chooseAnswer(index) {
    const question = questions[current];
    const correct = index === question.correct;
    answers[current] = { index, correct };

    app.querySelectorAll('.answer').forEach(button => {
      button.disabled = true;
      const value = Number(button.dataset.index);
      if (value === question.correct) button.classList.add('correct');
      if (value === index && !correct) button.classList.add('wrong');
    });

    const feedback = app.querySelector('.quiz-feedback');
    feedback.hidden = false;
    feedback.className = `quiz-feedback ${correct ? 'success' : 'error'}`;
    feedback.innerHTML = `<b>${correct ? '✓ Resposta correta!' : '✕ Não é essa a resposta correta.'}</b><span>${question.e}</span>`;

    const next = app.querySelector('.next-button');
    next.hidden = false;
    next.focus();
    next.addEventListener('click', () => {
      current += 1;
      if (current < questions.length) {
        renderQuestion();
      } else {
        renderResult();
      }
    });
  }

  function renderResult() {
    const score = answers.filter(a => a.correct).length;
    let message = '';
    let description = '';

    if (score === 5) {
      message = 'Desempenho Perfeito! Cientista em destaque!';
      description = 'Você dominou com precisão os conceitos de hematologia celular e funções do sangue.';
    } else if (score >= 3) {
      message = 'Muito bem! Investigação consistente.';
      description = 'Você já possui uma excelente base sobre a composição e fisiologia do sangue periférico.';
    } else {
      message = 'Bom início! Vale a pena revisar.';
      description = 'Revise os cartões anatômicos acima e teste seus conhecimentos novamente quando desejar.';
    }

    app.innerHTML = `
      <div class="result">
        <div class="result-score">
          <span>Seu resultado</span>
          <strong>${score}<small>/5</small></strong>
          <p>${score === 1 ? '1 acerto' : `${score} acertos`}</p>
        </div>
        <div>
          <p class="eyebrow">DESAFIO CONCLUÍDO</p>
          <h3>${message}</h3>
          <p>${description}</p>
        </div>
      </div>
      <div class="answer-summary">
        <h3>Resumo da sua investigação</h3>
        ${questions.map((question, i) => `
          <article class="summary-item ${answers[i].correct ? 'is-correct' : 'is-wrong'}">
            <b>${answers[i].correct ? '✓' : '✕'} ${i + 1}. ${question.q}</b>
            <p><strong>Sua resposta:</strong> ${question.a[answers[i].index]}</p>
            <p>${question.e}</p>
          </article>
        `).join('')}
      </div>
      <div class="result-actions">
        <button class="button primary" type="button" id="retry">Tentar novamente</button>
        <a class="button secondary" href="#componentes-title">Revisar componentes</a>
      </div>
    `;

    document.querySelector('#retry').addEventListener('click', () => {
      current = 0;
      answers = [];
      renderQuestion();
      document.querySelector('#desafio').scrollIntoView({ behavior: 'smooth' });
    });
  }

  renderQuestion();
});
