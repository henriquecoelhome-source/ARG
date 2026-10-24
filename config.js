// ARG "conhecer-verdade": tudo que muda fica aqui.
// Depois de editar, rode:  node build.js   (gera public/index.html)

const b64 = s => Buffer.from(s, 'utf8').toString('base64');
const rev64 = s => b64([...s].reverse().join(''));
const poem = st => st.map(p => '<p>' + p.join('<br>') + '</p>').join('');

const AUDIO = 'assets/mensagem.wav';   // coloque aqui o seu áudio com o espectrograma (WAV, sem compressão)
const AUDIO_NOME = 'mensagem.wav';     // nome do arquivo quando o jogador baixar

const ENIGMA3 = 'mas não devemos focar no final agora';
const FRASE6 = 'As coisas só aparecem quando ninguém está olhando.';

module.exports = {
  salt: 'cv::7d2f91ab',
  iterations: 120000,

  // As 8 localizações fixas no jogo (formato idêntico ao das placas da biblioteca).
  coords: [
    'S14 LESTE · F6 SUL · FACE A · PRATELEIRA 3',
    'S15 LESTE · F10 NORTE · FACE B · PRATELEIRA 1',
    'S14 LESTE · F23 SUL · FACE A · PRATELEIRA 5',
    'S12 LESTE · F29 NORTE · FACE B · PRATELEIRA 4',
    'S32 LESTE · F5 SUL · FACE A · PRATELEIRA 2',
    'S29 LESTE · F39 NORTE · FACE B · PRATELEIRA 5',
    'S40 LESTE · F45 SUL · FACE A · PRATELEIRA 1',
    'S63 LESTE · F25 NORTE · FACE B · PRATELEIRA 3'
  ],

  // Cada fase: num (vazio = não mostra número), html, answers (variações aceitas),
  // cls (classe CSS), clean (esconde o botão "registro"), kind/data (comportamentos), attrs (atributos do campo)
  levels: [
    {
      num: '1',
      html: '<p>qual a resposta?</p>',
      answers: [
        'e a rainha raivosa roeu o resto',
        'a rainha raivosa roeu o resto',
        'o rato roeu a roupa do rei de roma e a rainha raivosa roeu o resto'
      ]
    },
    {
      num: '2',
      html:
        '<p class="long">Ele nunca foi dono das mensagens, apenas quem as carrega. Tem pressa nos calcanhares e atravessa qualquer porta sem pedir licença.</p>' +
        '<p class="long">Escreve em todas as línguas, as das pessoas e as das máquinas, porque tudo pode ser uma mensagem.</p>' +
        '<p class="long">Nada aqui é só o que parece. Todos os elementos podem ser inspecionados a fundo, e é lá dentro que a resposta espera.</p>' +
        '<p class="hermes" hidden>os ratos que incitaram, serão os mesmos que finalizarão</p>',
      attrs: { 'data-mensagem': 'os ratos que incitaram, serão os mesmos que finalizarão' }, // vai no <main>: aparece direto no inspetor
      answers: ['os ratos que incitaram, serão os mesmos que finalizarão']
    },
    {
      num: '3',
      cls: 'lv-offset',
      clean: true,
      html: '<p class="ghost" aria-hidden="true">' + b64(ENIGMA3) + '</p>',
      answers: [ENIGMA3]
    },
    {
      num: '4',
      html:
        '<p class="long">o incompreensível se faz claro como um relógio adiantado 8 segundos à frente.</p>' +
        '<p class="cipher">YCMU YCQAMZ AIJMZ W YCM PIDMZI LM IKWVBMKMZ LMDM KWVAQLMZIZ W YCM RI IKWVBMKMC, XWZYCM BWLIA IA KWQAIA LW UCVLW, MU BWLWA WA BMUXWA, MVKWVBZIU KWZZMAXWVLMVKQI VWA BMUXWA IVBQOWA. QAAW IKWVBMKM XWZYCM, AMVLW MTIA NMQBIA XWZ [1], YCM BMU M [2] [3] [4] [5] [6], BIQA KWQAIA AW XWLMU, VMKMAAIZQIUMVBM, BMZ W UMAUW MNMQBW.</p>',
      answers: ['homens sempre tiveram as mesmas paixões']
    },
    {
      num: '5',
      kind: 'audio',
      data: { src: AUDIO, name: AUDIO_NOME },
      html: '<div class="player"></div>',
      answers: ['o fim é o começo visto de trás']
    },
    {
      num: '6',
      kind: 'tab',
      data: { p: rev64(FRASE6) },
      html: '<p>Se uma árvore cai no meio de uma floresta sem ninguém por perto pra ouvir, ela fez som?</p>',
      answers: ['as coisas só aparecem quando ninguém está olhando']
    },
    {
      num: '7',
      clean: true,
      html: '<p>mercúrio trará a resposta</p>',
      answers: ['arche']
    },
    {
      num: '',            // fase 8: só o poema e o campo
      cls: 'poem',
      clean: true,
      html: poem([
        ['...', 'e a rainha raivosa roeu o resto,', 'e deixou ao reino só a mesa posta.'],
        ['Os ratos que incitaram, serão os mesmos que finalizarão;', 'estava escrito, e ninguém soube ler.'],
        ['Mas não devemos focar no final agora.', 'Homens sempre tiveram as mesmas paixões,', 'trocam de rosto, de coroa, de nome,', 'e a roda gira no mesmo lugar.'],
        ['O fim é o começo visto de trás.', 'As coisas só aparecem quando ninguém está olhando,', 'e eu esperei, a cada página, que alguém olhasse.'],
        ['Chame o princípio pelo nome antigo,', 'aquele que nunca esteve longe:', 'arche.'],
        ['Aqui o poema termina, o fim é igual o começo.', 'Qual a resposta?']
      ]),
      answers: [
        'o rato roeu a roupa do rei de roma',
        'o rato roeu a roupa do rei de roma e a rainha raivosa roeu o resto'
      ]
    }
  ]
};
