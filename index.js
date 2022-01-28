'use strict'

const words = [
  'venea',
  'eroda',
  'moare',
  'farui',
  'darui',
  'pesta',
  'nazal',
  'nasol',
  'aurie',
  'erona',
  'eruda',
  'elena',
  'acela',
  'stern',
  'stele',
  'liman',
  'pulan',
  'rampa',
  'uzura',
  'doare',
  'repet',
  'rodie',
  'doina',
  'coral',
  'corai',
  'iubit',
  'eleva',
  'piept',
  'jucat',
  'fulgi',
  'marte',
  'topit',
  'masaj',
  'carti',
  'abate',
  'aboli',
  'abona',
  'abtii',
  'acasa',
  'acces',
  'aceea',
  'acele',
  'acest',
  'acolo',
  'acord',
  'activ',
  'actor',
  'acuza',
  'adanc',
  'adaos',
  'adica',
  'admis',
  'adora',
  'aduce',
  'adult',
  'aduna',
  'afara',
  'afuma',
  'agata',
  'agita',
  'agrea',
  'ajuta',
  'albie',
  'album',
  'albus',
  'alege',
  'aliaj',
  'alina',
  'aloca',
  'altar',
  'aluat',
  'aluna',
  'amagi',
  'amana',
  'amurg',
  'amuza',
  'anexa',
  'anima',
  'antic',
  'anula',
  'anume',
  'anunt',
  'apara',
  'apasa',
  'apuca',
  'apune',
  'arama',
  'arata',
  'arcus',
  'argou',
  'aripa',
  'aroma',
  'asalt',
  'asana',
  'aseza',
  'aspru',
  'asuma',
  'atare',
  'atasa',
  'atata',
  'atent',
  'atlas',
  'atlet',
  'audia',
  'autor',
  'avans',
  'avant',
  'avere',
  'avion',
  'bacon',
  'bagaj',
  'baiat',
  'balet',
  'balon',
  'balta',
  'banal',
  'banca',
  'banda',
  'banui',
  'baraj',
  'barba',
  'barca',
  'barfi',
  'bazin',
  'belea',
  'beton',
  'bidon',
  'bilet',
  'birou',
  'bivol',
  'bizon',
  'bizui',
  'blama',
  'blana',
  'bland',
  'bloca',
  'blond',
  'bluza',
  'boaba',
  'boala',
  'boboc',
  'bogat',
  'boier',
  'bolta',
  'borna',
  'botez',
  'bresa',
  'briza',
  'broda',
  'bronz',
  'brusc',
  'bubui',
  'bucal',
  'bucla',
  'bufet',
  'bufni',
  'bufon',
  'buget',
  'bujie',
  'bunic',
  'bursa',
  'burta',
  'buton',
  'butuc',
  'cablu',
  'cacao',
  'cadea',
  'cadou',
  'cadru',
  'cafea',
  'caiet',
  'caine',
  'calca',
  'calup',
  'camin',
  'campa',
  'canal',
  'canoe',
  'canta',
  'capac',
  'capat',
  'capot',
  'capra',
  'carie',
  'carne',
  'carpa',
  'carte',
  'casca',
  'casti',
  'catar',
  'catel',
  'catre',
  'catun',
  'cauta',
  'cauza',
  'cazma',
  'ceafa',
  'ceapa',
  'ceara',
  'ceata',
  'ceaun',
  'cerne',
  'cersi',
  'certa',
  'cetos',
  'cheie',
  'chema',
  'chiar',
  'chila',
  'chior',
  'chist',
  'chiul',
  'ciclu',
  'cifra',
  'cinci',
  'cinic',
  'circa',
  'citet',
  'ciuda',
  'ciuma',
  'ciupi',
  'civil',
  'cizma',
  'cladi',
  'clama',
  'clasa',
  'clima',
  'clipa',
  'clipi',
  'clovn',
  'coace',
  'coada',
  'coaja',
  'coama',
  'coasa',
  'coase',
  'cocor',
  'cocos',
  'codas',
  'coleg',
  'comic',
  'comod',
  'comun',
  'conta',
  'conte',
  'copac',
  'copia',
  'copie',
  'copii',
  'copil',
  'copoi',
  'covor',
  'crapa',
  'crede',
  'crema',
  'cresa',
  'creta',
  'crima',
  'criza',
  'cruce',
  'crunt',
  'cruta',
  'cufar',
  'cuget',
  'cuier',
  'culca',
  'cules',
  'culme',
  'cumva',
  'cupla',
  'cuplu',
  'curaj',
  'curat',
  'curba',
  'curea',
  'curge',
  'cursa',
  'curte',
  'cusur',
  'cutie',
  'dalta',
  'danut',
  'dativ',
  'dator',
  'dauna',
  'debil',
  'debut',
  'decat',
  'deces',
  'decis',
  'decor',
  'deget',
  'dejun',
  'delta',
  'desen',
  'devia',
  'dicta',
  'dieta',
  'difuz',
  'dineu',
  'dinte',
  'divin',
  'docil',
  'doica',
  'dolar',
  'doliu',
  'dormi',
  'dosar',
  'drama',
  'drapa',
  'drept',
  'drona',
  'dubiu',
  'duhni',
  'duios',
  'dulap',
  'dulce',
  'dunga',
  'durea',
  'dusca',
  'echer',
  'ecran',
  'edita',
  'educa',
  'efect',
  'efort',
  'elice',
  'emite',
  'enorm',
  'epava',
  'epoca',
  'eroic',
  'etala',
  'etans',
  'etapa',
  'evada',
  'evita',
  'exact',
  'exces',
  'facla',
  'faima',
  'faina',
  'falca',
  'fanta',
  'fapta',
  'farsa',
  'fatal',
  'fauri',
  'fazan',
  'febra',
  'felie',
  'ferma',
  'festa',
  'ficat',
  'fidel',
  'fiere',
  'fiica',
  'final',
  'firav',
  'firma',
  'fizic',
  'flora',
  'flota',
  'fluid',
  'foaie',
  'foita',
  'folos',
  'fonta',
  'forja',
  'forma',
  'forta',
  'frana',
  'frate',
  'freca',
  'frica',
  'frige',
  'front',
  'fruct',
  'fugar',
  'fular',
  'funie',
  'furca',
  'furie',
  'fusta',
  'gaina',
  'galon',
  'galop',
  'gamba',
  'garaj',
  'garda',
  'gasca',
  'gaura',
  'gauri',
  'gazda',
  'geana',
  'gelos',
  'geniu',
  'ghici',
  'ghips',
  'gluga',
  'gluma',
  'goana',
  'graba',
  'grabi',
  'grajd',
  'grava',
  'grefa',
  'greoi',
  'greva',
  'grija',
  'grila',
  'gripa',
  'grota',
  'guler',
  'gunoi',
  'haina',
  'haine',
  'haita',
  'hamal',
  'harta',
  'hobby',
  'holba',
  'hotar',
  'hotel',
  'hrana',
  'hrani',
  'iarba',
  'iarna',
  'ibric',
  'ideal',
  'idila',
  'ierta',
  'imens',
  'imita',
  'impar',
  'inalt',
  'incet',
  'incie',
  'indoi',
  'infam',
  'infia',
  'inger',
  'inima',
  'intai',
  'intim',
  'intra',
  'intre',
  'invoi',
  'irita',
  'irosi',
  'istet',
  'iulie',
  'iunie',
  'izola',
  'izvor',
  'jefui',
  'jeleu',
  'jigni',
  'jilav',
  'joaca',
  'joben',
  'joule',
  'judet',
  'jupui',
  'jurat',
  'juriu',
  'lacat',
  'lacom',
  'lalea',
  'lampa',
  'lance',
  'langa',
  'lansa',
  'lapte',
  'largi',
  'larma',
  'laser',
  'latin',
  'lauda',
  'lauta',
  'leafa',
  'legal',
  'lenes',
  'lesin',
  'liber',
  'liceu',
  'lider',
  'limba',
  'linie',
  'linte',
  'lipsa',
  'liric',
  'lista',
  'litru',
  'livra',
  'locui',
  'logic',
  'loial',
  'lucid',
  'luciu',
  'lucra',
  'lucru',
  'lunar',
  'lupta',
  'macar',
  'macaz',
  'magar',
  'magic',
  'magie',
  'mahni',
  'maica',
  'maine',
  'maior',
  'major',
  'manca',
  'maner',
  'mania',
  'manie',
  'manji',
  'manta',
  'manui',
  'marai',
  'marca',
  'maree',
  'maret',
  'marfa',
  'marti',
  'masca',
  'masea',
  'masiv',
  'matca',
  'matur',
  'maxim',
  'medic',
  'medie',
  'mediu',
  'menaj',
  'mereu',
  'merge',
  'merit',
  'mesaj',
  'metal',
  'metro',
  'miere',
  'milos',
  'minge',
  'minim',
  'minor',
  'minte',
  'minti',
  'minus',
  'minut',
  'miros',
  'misca',
  'moale',
  'moara',
  'mobil',
  'model',
  'molie',
  'monta',
  'moral',
  'morar',
  'mosie',
  'motai',
  'motiv',
  'motor',
  'motto',
  'muget',
  'mugur',
  'mulge',
  'mumie',
  'munca',
  'munte',
  'musca',
  'muzeu',
  'namol',
  'narav',
  'narui',
  'naste',
  'natal',
  'nazui',
  'neamt',
  'nebun',
  'necaz',
  'negot',
  'negru',
  'nepot',
  'neted',
  'nimic',
  'ninge',
  'nisip',
  'niste',
  'nitui',
  'nivel',
  'nobil',
  'nociv',
  'noroc',
  'noroi',
  'numai',
  'numar',
  'nunta',
  'nutri',
  'o',
  'mie',
  'oaste',
  'oblon',
  'obosi',
  'obraz',
  'ocara',
  'ocean',
  'ocupa',
  'odata',
  'odgon',
  'odios',
  'oferi',
  'ofili',
  'omida',
  'omite',
  'onest',
  'onora',
  'opera',
  'optim',
  'opune',
  'ordin',
  'orfan',
  'organ',
  'orice',
  'ospat',
  'ostas',
  'ostil',
  'pacat',
  'pacla',
  'pagan',
  'pahar',
  'paine',
  'palat',
  'palid',
  'palma',
  'panou',
  'panta',
  'panza',
  'papuc',
  'parau',
  'parea',
  'paria',
  'paroh',
  'parte',
  'pasaj',
  'pasiv',
  'pasta',
  'paste',
  'pasti',
  'patru',
  'pauza',
  'pazea',
  'penaj',
  'penar',
  'penel',
  'peria',
  'perla',
  'perna',
  'peron',
  'peste',
  'petic',
  'piata',
  'picta',
  'piele',
  'pieri',
  'piesa',
  'pilda',
  'pilot',
  'pipai',
  'piper',
  'pirat',
  'piron',
  'pisca',
  'pisic',
  'pisoi',
  'pista',
  'pitic',
  'placa',
  'plaja',
  'plana',
  'plasa',
  'plata',
  'plati',
  'pleca',
  'pleda',
  'plisc',
  'plivi',
  'plumb',
  'pluta',
  'poala',
  'poate',
  'podea',
  'podis',
  'pofta',
  'pojar',
  'polei',
  'polua',
  'pompa',
  'ponei',
  'popor',
  'porni',
  'posac',
  'posta',
  'potop',
  'prada',
  'praji',
  'pranz',
  'preda',
  'preot',
  'presa',
  'preta',
  'primi',
  'print',
  'pripa',
  'priva',
  'privi',
  'priza',
  'proba',
  'prost',
  'proza',
  'pruna',
  'prund',
  'pudra',
  'puhoi',
  'pulsa',
  'punct',
  'punga',
  'purta',
  'putea',
  'putin',
  'rabda',
  'racai',
  'racni',
  'radio',
  'ragaz',
  'raion',
  'ramas',
  'rapid',
  'ratat',
  'ratie',
  'raton',
  'ravna',
  'razes',
  'razui',
  'rebel',
  'rebut',
  'refuz',
  'regal',
  'regla',
  'releu',
  'relua',
  'reper',
  'retea',
  'reuni',
  'reusi',
  'rigid',
  'rigla',
  'rival',
  'roade',
  'roata',
  'robot',
  'roman',
  'rosti',
  'rugbi',
  'ruina',
  'runda',
  'rupta',
  'rural',
  'sabie',
  'sacai',
  'salam',
  'salta',
  'salut',
  'salva',
  'sange',
  'sanie',
  'sansa',
  'sapca',
  'sapte',
  'sapun',
  'sarac',
  'sarma',
  'sarpe',
  'sarut',
  'satul',
  'scalp',
  'scapa',
  'scara',
  'scaun',
  'scena',
  'sclav',
  'scobi',
  'scoci',
  'scrie',
  'scrum',
  'scuar',
  'scula',
  'scump',
  'scund',
  'scurt',
  'scuti',
  'scuza',
  'seara',
  'secat',
  'secol',
  'sedea',
  'seism',
  'semet',
  'senin',
  'serba',
  'serie',
  'serif',
  'servi',
  'sever',
  'sezon',
  'sfant',
  'sfera',
  'sfert',
  'sfida',
  'sifon',
  'sigur',
  'sipet',
  'siret',
  'siroi',
  'sirop',
  'situa',
  'slabi',
  'slava',
  'sleit',
  'soare',
  'soclu',
  'socru',
  'sofer',
  'solar',
  'solid',
  'sonda',
  'sonet',
  'sonor',
  'sopti',
  'sorbi',
  'sorti',
  'sosea',
  'sovai',
  'spala',
  'spate',
  'spera',
  'spion',
  'spirt',
  'spita',
  'spori',
  'sport',
  'spuma',
  'spune',
  'stalp',
  'stand',
  'stang',
  'stare',
  'staul',
  'steag',
  'stema',
  'sterp',
  'stima',
  'stins',
  'stire',
  'stiva',
  'stofa',
  'strat',
  'strop',
  'subit',
  'sueta',
  'sufla',
  'sumar',
  'sunca',
  'super',
  'suplu',
  'sursa',
  'surub',
  'suvoi',
  'tabel',
  'tabla',
  'tacea',
  'tacut',
  'taina',
  'talie',
  'tanar',
  'tanji',
  'tapet',
  'taram',
  'taran',
  'tarie',
  'tarif',
  'tarta',
  'tarus',
  'tasni',
  'tatic',
  'tavan',
  'teaca',
  'teama',
  'teanc',
  'teava',
  'tenis',
  'terci',
  'teren',
  'ticsi',
  'tigla',
  'tigru',
  'tihna',
  'timid',
  'tinde',
  'tinta',
  'tinut',
  'tipar',
  'tipic',
  'tiran',
  'titei',
  'titlu',
  'toast',
  'toiag',
  'topai',
  'topor',
  'torta',
  'trada',
  'trage',
  'trasa',
  'trata',
  'treaz',
  'trece',
  'trisa',
  'trist',
  'truda',
  'trupa',
  'tunde',
  'tunel',
  'turba',
  'turla',
  'turma',
  'turna',
  'ulita',
  'ultim',
  'umbla',
  'umbre',
  'umfla',
  'umple',
  'unchi',
  'uncie',
  'unghi',
  'urban',
  'urias',
  'ursuz',
  'usura',
  'uzina',
  'vaduv',
  'vagon',
  'vaita',
  'valet',
  'valid',
  'valva',
  'vapor',
  'varga',
  'varia',
  'varsa',
  'varui',
  'varza',
  'vasla',
  'vatra',
  'vechi',
  'vecie',
  'vecin',
  'vedea',
  'veghe',
  'venin',
  'venit',
  'verde',
  'verva',
  'vesel',
  'vesta',
  'veste',
  'viata',
  'vibra',
  'vicia',
  'vifor',
  'vinde',
  'virus',
  'visin',
  'vital',
  'vitel',
  'vlaga',
  'voiaj',
  'voios',
  'volan',
  'volei',
  'volum',
  'vorba',
  'vraja',
  'vraji',
  'vreme',
  'vreun',
  'vulpe',
  'xerox',
  'zacea',
  'zadar',
  'zahar',
  'zarva',
  'zavor',
  'zbura',
  'zeama',
  'zebra',
  'zefir',
  'zeita',
  'zgura',
  'zodie',
  'zvelt'
]

const green = 'rgb(96, 138, 84)'
const gray = 'rgb(58,58,60)'
const yellow = 'rgb(177, 160, 76)'

const url =
  'https://raw.githubusercontent.com/cristicretu/wordle-gen/main/result.txt'

let grid = document.getElementById('grid')
let message = document.getElementById('message')
let keyboard = document.getElementById('keyboard')
let check = document.getElementById('check')

let word = getRandomWord()

let attempt = 0
let currentAttempt = ''

let changeGame = true
let checked = false

function checkWin() {
  if (currentAttempt === word) {
    message.innerHTML = 'Ai castigat!'
    attempt = 999

    return
  }
}

function populateChecked() {
  // lol again
  let row0 = localStorage.getItem('row-0')
  let row1 = localStorage.getItem('row-1')
  let row2 = localStorage.getItem('row-2')
  let row3 = localStorage.getItem('row-3')
  let row4 = localStorage.getItem('row-4')
  let row5 = localStorage.getItem('row-5')

  if (row0 !== null) {
    renderPastAttempt(0, row0)
    attempt = 1
    currentAttempt = row0
    checkWin()
    currentAttempt = ''
  }
  if (row1 !== null) {
    renderPastAttempt(1, row1)
    attempt = 2
    currentAttempt = row1
    checkWin()
    currentAttempt = ''
  }
  if (row2 !== null) {
    renderPastAttempt(2, row2)
    attempt = 3
    currentAttempt = row2
    checkWin()
    currentAttempt = ''
  }
  if (row3 !== null) {
    renderPastAttempt(3, row3)
    attempt = 4
    currentAttempt = row3
    checkWin()
    currentAttempt = ''
  }
  if (row4 !== null) {
    renderPastAttempt(4, row4)
    attempt = 5
    currentAttempt = row4
    checkWin()
    currentAttempt = ''
  }
  if (row5 !== null) {
    renderPastAttempt(5, row5)
    attempt = 999
    currentAttempt = row5
    checkWin()
    currentAttempt = ''
  }

  if (currentAttempt !== word && attempt === 999) {
    message.innerHTML = `Ai pierdut! Cuvantul corect a fost: ${word}`
    renderPastAttempt(attempt, currentAttempt)
    attempt = 999
    return
  }
}

async function updateChecked() {
  if (changeGame === false) {
    return
  }

  checked === false ? (checked = true) : (checked = false)
  if (checked === false) {
    word = getRandomWord()
  } else {
    await fetch(url)
      .then((res) => res.text())
      .then((res) => {
        word = res
      })

    if (localStorage.getItem('word') !== word) {
      localStorage.clear()
      localStorage.setItem('word', word)
    }
    populateChecked()
    console.log(attempt)
  }
}

function createGrid() {
  for (let i = 0; i < 6; ++i) {
    let line = document.createElement('div')

    for (let j = 0; j < 5; ++j) {
      let col = document.createElement('div')
      col.className = 'col'

      line.appendChild(col)
    }

    grid.appendChild(line)
  }
}

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)]
}

function findColor(parent, child, index, line) {
  if (parent[index] === child[index]) {
    return green
  }

  let char = child[index]
  for (let i = 0; i < parent.length; ++i) {
    if (parent[i] == char && line.children[i].style.backgroundColor !== green) {
      return yellow
    }
  }

  if (char !== undefined) return gray
}

function renderPastAttempt(row, attempt) {
  if (row > 5) return

  if (checked === true) localStorage.setItem(`row-${row}`, attempt)

  let line = grid.children[row]
  for (let i = 0; i < 5; ++i) {
    let col = line.children[i]
    col.style.backgroundColor = findColor(word, attempt, i, line)
    col.style.border =
      attempt[i] !== undefined
        ? `2.5px solid ${col.style.backgroundColor}`
        : '2.5px solid rgb(58,58,60)'
    col.innerHTML = attempt[i] ?? '<div style="opacity: 0">X<div>'

    //lol

    let line1 = keyboard.children[0]
    let line2 = keyboard.children[1]
    let line3 = keyboard.children[2]

    for (let j = 0; j < line1.children.length; ++j) {
      if (line1.children[j].innerHTML === attempt[i]) {
        line1.children[j].style.backgroundColor =
          line1.children[j].style.backgroundColor === 'rgb(118, 118, 118)'
            ? col.style.backgroundColor
            : line1.children[j].style.backgroundColor
      }
    }

    for (let j = 0; j < line2.children.length; ++j) {
      if (line2.children[j].innerHTML === attempt[i]) {
        line2.children[j].style.backgroundColor =
          line2.children[j].style.backgroundColor === 'rgb(118, 118, 118)'
            ? col.style.backgroundColor
            : line2.children[j].style.backgroundColor
      }
    }

    for (let j = 0; j < line3.children.length; ++j) {
      if (line3.children[j].innerHTML === attempt[i]) {
        line3.children[j].style.backgroundColor =
          line3.children[j].style.backgroundColor === 'rgb(118, 118, 118)'
            ? col.style.backgroundColor
            : line3.children[j].style.backgroundColor
      }
    }
  }
}

function renderCurrentAttempt(row, attempt) {
  if (row > 5) return

  let line = grid.children[row]
  for (let i = 0; i < 5; ++i) {
    let col = line.children[i]
    col.innerHTML = attempt[i] ?? '<div style="opacity: 0">X<div>'
  }
}

function logKey(e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return
  let char = e.key.toLowerCase()
  if (char === 'backspace') {
    currentAttempt = currentAttempt.slice(0, -1)
    renderCurrentAttempt(attempt, currentAttempt)
  } else if (char === 'enter') {
    if (!currentAttempt.length) {
      return
    }

    if (currentAttempt.length < 5) {
      alert('Cuvantul e prea scurt!')
      return
    }

    if (currentAttempt === word) {
      message.innerHTML = 'Ai castigat!'
      renderPastAttempt(attempt, currentAttempt)
      attempt = 999

      return
    }

    if (currentAttempt !== word && attempt === 5) {
      message.innerHTML = `Ai pierdut! Cuvantul corect a fost: ${word}`
      renderPastAttempt(attempt, currentAttempt)
      attempt = 999
      return
    }

    // check if currentAttempt exists in the array of words with binary search
    if (words.indexOf(currentAttempt) === -1) {
      if (
        window.confirm(
          'Cuvantul nu exista, sau s-ar putea sa nu existe in lista cuvintelor: Apasa OK pentru a-l adauga.'
        )
      ) {
        window.open(
          `https://github.com/cristicretu/wordle/issues/new?labels=word&title=${currentAttempt} `,
          '_blank'
        )
      }
      return
    }

    renderPastAttempt(attempt, currentAttempt)
    attempt += 1
    currentAttempt = ''
  } else if (
    char.match(/[a-zA-Z]/) &&
    currentAttempt.length < 5 &&
    char.length === 1
  ) {
    console.log(char)
    changeGame = false
    currentAttempt += char
    renderCurrentAttempt(attempt, currentAttempt)
  }
}

function createKeyboard() {
  createKbRow('qwertyuiop')
  createKbRow('asdfghjkl')
  createKbRow('XzxcvbnmZ')
}

function createKbRow(row) {
  let rowDiv = document.createElement('div')
  for (let char in row) {
    let button = document.createElement('button')
    button.className = 'button'
    button.style.backgroundColor = 'rgb(118, 118, 118)'
    if (row[char] !== 'X' && row[char] !== 'Z') {
      button.innerHTML = row[char]
      button.onclick = () => {
        if (currentAttempt.length < 5) {
          changeGame = false
          currentAttempt += row[char]
          renderCurrentAttempt(attempt, currentAttempt)
        }
      }
    } else if (row[char] === 'X') {
      button.innerHTML = 'ENTER'
      button.onclick = () => {
        if (!currentAttempt.length) {
          return
        }

        if (currentAttempt.length < 5) {
          alert('Cuvantul e prea scurt!')
          return
        }

        if (currentAttempt === word) {
          message.innerHTML = 'Ai castigat!'
          renderPastAttempt(attempt, currentAttempt)
          attempt = 999

          return
        }

        if (currentAttempt !== word && attempt === 5) {
          message.innerHTML = `Ai pierdut! Cuvantul corect a fost: ${word}`
          renderPastAttempt(attempt, currentAttempt)
          attempt = 999
          return
        }

        // check if currentAttempt exists in the array of words with binary search
        if (words.indexOf(currentAttempt) === -1) {
          if (
            window.confirm(
              'Cuvantul nu exista, sau s-ar putea sa nu existe in lista cuvintelor: Apasa OK pentru a-l adauga.'
            )
          ) {
            window.open(
              `https://github.com/cristicretu/wordle/issues/new?labels=word&title=${currentAttempt} `,
              '_blank'
            )
          }
          return
        }

        renderPastAttempt(attempt, currentAttempt)
        attempt += 1
        currentAttempt = ''
      }
    } else if (row[char] === 'Z') {
      button.innerHTML = 'DEL'
      button.onclick = () => {
        currentAttempt = currentAttempt.slice(0, -1)
        renderCurrentAttempt(attempt, currentAttempt)
      }
    }

    rowDiv.appendChild(button)
  }

  keyboard.appendChild(rowDiv)
}

document.addEventListener('keydown', logKey)

createGrid()
createKeyboard()
