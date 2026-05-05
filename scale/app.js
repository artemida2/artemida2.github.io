/* ════════════════════════════════════════════════════════════════
   АРТЕМИДА: МАСШТАБ ВСЕЛЕННОЙ — app.js
   Интерактивный скролл-зум от планковской длины до диаметра
   наблюдаемой Вселенной (~62 порядка). Vanilla JS + Canvas 2D.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const LANG = (window.SU_LANG === 'en') ? 'en' : 'ru';

  /* ──────────────────────────────────────────────
     i18n (UI strings only; объекты — внутри OBJECTS)
     ────────────────────────────────────────────── */
  const I18N = {
    ru: {
      brandSub: 'Масштаб Вселенной',
      hintTitle: 'Прокрути всю Вселенную',
      hintSub: 'Колёсико мыши, тачпад, свайп или стрелки ↑↓ — от кварка до Хаббла',
      hintTap: 'Свайпай вверх/вниз — от кварка до Хаббла',
      tour: 'Тур',
      sound: 'Звук',
      search: 'Поиск',
      share: 'Поделиться',
      copyLink: 'Скопировать ссылку',
      copyMeme: 'Скопировать как мем',
      copied: 'Скопировано',
      shareTwitter: 'Twitter',
      shareTelegram: 'Telegram',
      shareVK: 'ВКонтакте',
      lang: 'EN',
      langOther: '/scale/en/',
      about: 'О проекте',
      youAre: 'Ты здесь',
      times: 'раз',
      timesLargerThanYou: 'в {n} раз больше тебя',
      timesSmallerThanYou: 'в {n} раз меньше тебя',
      ordersLargerThanYou: 'на {n} порядков больше тебя',
      ordersSmallerThanYou: 'на {n} порядков меньше тебя',
      sameAsYou: 'примерно равно тебе',
      meters: 'м',
      kilometers: 'км',
      lightYears: 'св. лет',
      au: 'а.е.',
      memeI: 'Я в {n} раз больше, чем «{name}» — найди свой масштаб:',
      memeIShort: 'Это в {n} раз меньше меня. А что вокруг тебя?',
      shareTitle: 'Масштаб Вселенной — {name} ({size})',
      shareDesc: '{name} — {size}. Прокрути всю Вселенную: от кварка до Хаббла, 62 порядка одной прокруткой.',
      epochs: {
        quantum: 'Квантовый мир',
        atomic: 'Атомы и молекулы',
        cellular: 'Клетки и вирусы',
        human: 'Жизнь и быт',
        architectural: 'Города и горы',
        planetary: 'Планеты и звёзды',
        stellar: 'Звёздные системы',
        galactic: 'Галактики',
        cosmological: 'Космология'
      },
      noScript: 'Включите JavaScript для интерактивной прокрутки или прочитайте список объектов ниже.'
    },
    en: {
      brandSub: 'Scale of the Universe',
      hintTitle: 'Scroll the Whole Universe',
      hintSub: 'Mouse wheel, trackpad, swipe or arrows ↑↓ — from quark to Hubble',
      hintTap: 'Swipe up/down — from quark to Hubble',
      tour: 'Tour',
      sound: 'Sound',
      search: 'Search',
      share: 'Share',
      copyLink: 'Copy link',
      copyMeme: 'Copy as meme',
      copied: 'Copied',
      shareTwitter: 'Twitter',
      shareTelegram: 'Telegram',
      shareVK: 'VK',
      lang: 'RU',
      langOther: '/scale/',
      about: 'About',
      youAre: 'You are here',
      times: 'times',
      timesLargerThanYou: '{n}× larger than you',
      timesSmallerThanYou: '{n}× smaller than you',
      ordersLargerThanYou: '{n} orders larger than you',
      ordersSmallerThanYou: '{n} orders smaller than you',
      sameAsYou: 'about your size',
      meters: 'm',
      kilometers: 'km',
      lightYears: 'ly',
      au: 'AU',
      memeI: 'I am {n}× larger than “{name}” — find your scale:',
      memeIShort: 'It’s {n}× smaller than me. What about you?',
      shareTitle: 'Scale of the Universe — {name} ({size})',
      shareDesc: '{name} — {size}. Scroll the whole Universe: from quark to Hubble, 62 orders of magnitude in one scroll.',
      epochs: {
        quantum: 'Quantum world',
        atomic: 'Atoms & molecules',
        cellular: 'Cells & viruses',
        human: 'Life & everyday',
        architectural: 'Cities & mountains',
        planetary: 'Planets & stars',
        stellar: 'Stellar systems',
        galactic: 'Galaxies',
        cosmological: 'Cosmology'
      },
      noScript: 'Enable JavaScript for the interactive scroll or read the list of objects below.'
    }
  };
  const T = I18N[LANG];

  /* ──────────────────────────────────────────────
     Эпохи — цветовые «миры», между ними плавно смешивается фон.
     ────────────────────────────────────────────── */
  const EPOCHS = [
    { id: 'quantum',       min: -36, max: -15, a: '#1a0533', b: '#06010f', accent: '#c060ff', name: T.epochs.quantum },
    { id: 'atomic',        min: -15, max:  -9, a: '#003040', b: '#020812', accent: '#00c8ff', name: T.epochs.atomic },
    { id: 'cellular',      min:  -9, max:  -4, a: '#003a18', b: '#020806', accent: '#39ff6a', name: T.epochs.cellular },
    { id: 'human',         min:  -4, max:   2, a: '#3a1a05', b: '#0b0500', accent: '#ffb830', name: T.epochs.human },
    { id: 'architectural', min:   2, max:   7, a: '#082a3a', b: '#02060c', accent: '#00c8ff', name: T.epochs.architectural },
    { id: 'planetary',     min:   7, max:  10, a: '#3a1004', b: '#0a0301', accent: '#ff6b35', name: T.epochs.planetary },
    { id: 'stellar',       min:  10, max:  14, a: '#2a0a3a', b: '#080110', accent: '#ff6b35', name: T.epochs.stellar },
    { id: 'galactic',      min:  14, max:  22, a: '#2a052e', b: '#070010', accent: '#ff5fc4', name: T.epochs.galactic },
    { id: 'cosmological',  min:  22, max:  28, a: '#0a0030', b: '#000005', accent: '#c060ff', name: T.epochs.cosmological }
  ];

  /* ──────────────────────────────────────────────
     ОБЪЕКТЫ — ~60 якорных объектов, отсортированы по размеру.
     `m` — размер в метрах. Названия и факты на двух языках.
     `kind` определяет процедурный рисунок на canvas.
     `glyph` — Unicode/эмодзи для центрального символа (опц.)
     `you` — true для «человек» (привязка для сравнений).
     ────────────────────────────────────────────── */
  const OBJECTS = [
    // ── Квантовый мир ───────────────────────────────
    { id:'planck',  m:1.616e-35, kind:'foam',     glyph:'◌',
      name:{ru:'Планковская длина', en:'Planck length'},
      fact:{ru:'Самая малая длина, на которой имеют смысл понятия пространства и времени. Глубже — квантовая пена.',
            en:'The smallest meaningful length scale. Below it, space and time dissolve into quantum foam.'} },
    { id:'string',  m:1e-33, kind:'foam', glyph:'∿',
      name:{ru:'Длина струны (теория)', en:'String length (theory)'},
      fact:{ru:'Гипотетический размер вибрирующей струны в теории струн — на 10⁻³³ м.',
            en:'The hypothetical length of a vibrating string in string theory — at 10⁻³³ m.'} },
    { id:'neutrino', m:1e-24, kind:'particle', glyph:'•',
      name:{ru:'Нейтрино', en:'Neutrino'},
      fact:{ru:'Размер не измерен напрямую; верхняя оценка ~10⁻²⁴ м. Сквозь твоё тело каждую секунду пролетают триллионы нейтрино.',
            en:'Not directly measured; upper bound ~10⁻²⁴ m. Trillions pass through your body every second.'} },
    { id:'quark',   m:1e-19, kind:'particle', glyph:'•',
      name:{ru:'Кварк', en:'Quark'},
      fact:{ru:'Точечная частица: верхний предел размера ~10⁻¹⁹ м. Кварки никогда не наблюдались по отдельности.',
            en:'Point-like: upper bound ~10⁻¹⁹ m. Quarks have never been observed in isolation.'} },
    { id:'electron', m:1e-18, kind:'particle', glyph:'e⁻',
      name:{ru:'Электрон', en:'Electron'},
      fact:{ru:'Считается точечной частицей; экспериментальный верхний предел радиуса — 10⁻¹⁸ м.',
            en:'Considered point-like; experimental upper bound on its radius is 10⁻¹⁸ m.'} },
    { id:'proton',  m:1.7e-15, kind:'nucleon', glyph:'p⁺',
      name:{ru:'Протон', en:'Proton'},
      fact:{ru:'Состоит из трёх кварков. Если бы атом водорода был размером со стадион, протон в центре был бы крупинкой пыли.',
            en:'Made of three quarks. If a hydrogen atom were a stadium, the proton would be a speck of dust at the center.'} },
    { id:'nucleus', m:7e-15, kind:'nucleon', glyph:'⚛',
      name:{ru:'Ядро урана', en:'Uranium nucleus'},
      fact:{ru:'92 протона + 146 нейтронов в шарике 7 фм. Здесь живёт ~99,9% массы атома.',
            en:'92 protons + 146 neutrons packed in 7 fm. Holds ~99.9% of the atom’s mass.'} },

    // ── Атомы и молекулы ────────────────────────────
    { id:'hydrogen', m:1.06e-10, kind:'atom', glyph:'H',
      name:{ru:'Атом водорода', en:'Hydrogen atom'},
      fact:{ru:'Самый простой и распространённый атом: один протон, один электрон. ~75% видимой массы Вселенной — это водород.',
            en:'The simplest, most abundant atom: one proton, one electron. ~75% of the Universe’s visible mass is hydrogen.'} },
    { id:'gold',    m:2.88e-10, kind:'atom', glyph:'Au',
      name:{ru:'Атом золота', en:'Gold atom'},
      fact:{ru:'79 протонов, рождается только в столкновениях нейтронных звёзд. Каждый атом золота в твоём кольце — старше Солнца.',
            en:'79 protons. Forms only in neutron-star collisions. Every gold atom in your ring is older than the Sun.'} },
    { id:'water',   m:2.75e-10, kind:'molecule', glyph:'H₂O',
      name:{ru:'Молекула воды', en:'Water molecule'},
      fact:{ru:'Угол H–O–H = 104,5°. В стакане воды (250 мл) ~8,4×10²⁴ молекул — больше, чем звёзд в наблюдаемой Вселенной.',
            en:'H–O–H angle 104.5°. A glass of water (250 ml) holds ~8.4×10²⁴ molecules — more than stars in the observable Universe.'} },
    { id:'buckyball', m:1e-9, kind:'molecule', glyph:'⬢',
      name:{ru:'Фуллерен C₆₀', en:'Buckminsterfullerene'},
      fact:{ru:'60 атомов углерода в форме футбольного мяча. Открыт в 1985, стал символом нанотехнологий.',
            en:'60 carbon atoms shaped like a soccer ball. Discovered in 1985, an icon of nanotech.'} },
    { id:'dna',     m:2e-9, kind:'helix', glyph:'⥃',
      name:{ru:'ДНК (диаметр)', en:'DNA (diameter)'},
      fact:{ru:'Двойная спираль шириной 2 нм. Если развернуть всю ДНК одного человека — это 67 раз туда-обратно до Солнца.',
            en:'Double helix 2 nm wide. Unwound, one human’s DNA reaches the Sun and back 67 times.'} },
    { id:'transistor', m:3e-9, kind:'chip', glyph:'⏚',
      name:{ru:'Транзистор 3 нм', en:'3 nm transistor'},
      fact:{ru:'Современный чип Apple/TSMC — миллиарды транзисторов размером в 12 атомов кремния поперёк.',
            en:'Modern Apple/TSMC chip — billions of transistors, just 12 silicon atoms wide.'} },
    { id:'ribosome', m:2e-8, kind:'biostruct', glyph:'◉',
      name:{ru:'Рибосома', en:'Ribosome'},
      fact:{ru:'Молекулярная фабрика клетки: собирает белки со скоростью 20 аминокислот в секунду.',
            en:'A cell’s molecular factory: assembles proteins at 20 amino acids per second.'} },

    // ── Клетки и вирусы ─────────────────────────────
    { id:'flu',     m:1e-7, kind:'virus', glyph:'❉',
      name:{ru:'Вирус гриппа', en:'Influenza virion'},
      fact:{ru:'~100 нм, восемь сегментов РНК. Один чих — миллионы вирионов.',
            en:'~100 nm, eight RNA segments. A single sneeze releases millions of virions.'} },
    { id:'sars2',   m:1.2e-7, kind:'virus', glyph:'☣',
      name:{ru:'Коронавирус SARS-CoV-2', en:'SARS-CoV-2'},
      fact:{ru:'Шипастая сфера 120 нм, изменившая мир в 2020. На один белок-шип помещается 100 атомов в ширину.',
            en:'A 120 nm spiked sphere that reshaped the world in 2020. Each spike protein is ~100 atoms wide.'} },
    { id:'phage',   m:2e-7, kind:'virus', glyph:'⚙',
      name:{ru:'Бактериофаг T4', en:'Bacteriophage T4'},
      fact:{ru:'Вирус-«посадочный модуль» с лунной геометрией: садится на бактерию и впрыскивает свою ДНК.',
            en:'Virus that looks like a lunar lander: docks on bacteria and injects its DNA.'} },
    { id:'visiblelight', m:5.5e-7, kind:'wave', glyph:'~',
      name:{ru:'Длина волны зелёного света', en:'Green light wavelength'},
      fact:{ru:'550 нм — пик чувствительности человеческого глаза. Меньше — мы уже не видим.',
            en:'550 nm — the peak of human eye sensitivity. Anything smaller is invisible to us.'} },
    { id:'ecoli',   m:2e-6, kind:'cell', glyph:'⌬',
      name:{ru:'Бактерия E. coli', en:'E. coli bacterium'},
      fact:{ru:'2 мкм длиной. В тебе сейчас ~10¹³ бактерий — почти столько же, сколько собственных клеток.',
            en:'2 μm long. ~10¹³ bacteria live in your body — nearly as many as your own cells.'} },
    { id:'rbc',     m:8e-6, kind:'cell', glyph:'◯',
      name:{ru:'Эритроцит', en:'Red blood cell'},
      fact:{ru:'Двояковогнутый диск 8 мкм. В твоей крови ~25 триллионов эритроцитов и каждую секунду рождается 2 миллиона.',
            en:'Biconcave disc 8 μm wide. Your blood holds ~25 trillion of them; 2 million are born every second.'} },
    { id:'cell',    m:2e-5, kind:'cell', glyph:'◉',
      name:{ru:'Клетка человека', en:'Human cell'},
      fact:{ru:'Средний размер 20 мкм. Тело состоит из ~37 триллионов клеток — это в ~5000 раз больше людей на Земле.',
            en:'Average size 20 μm. Your body has ~37 trillion cells — ~5000× the human population.'} },
    { id:'sperm',   m:5e-5, kind:'cell', glyph:'❀',
      name:{ru:'Сперматозоид', en:'Sperm cell'},
      fact:{ru:'~50 мкм длиной (с хвостом). Самая мелкая клетка человека.',
            en:'~50 μm long including tail. The smallest human cell.'} },
    { id:'hair',    m:7e-5, kind:'fiber', glyph:'❘',
      name:{ru:'Толщина волоса', en:'Human hair'},
      fact:{ru:'70 мкм поперёк. Растёт примерно на 1 см в месяц — ~3 нанометра в секунду.',
            en:'70 μm thick. Grows ~1 cm per month — ~3 nanometers per second.'} },
    { id:'sand',    m:5e-4, kind:'grain', glyph:'•',
      name:{ru:'Песчинка', en:'Grain of sand'},
      fact:{ru:'0,5 мм. На пляжах Земли больше песчинок, чем звёзд в Млечном Пути.',
            en:'0.5 mm. There are more grains of sand on Earth’s beaches than stars in the Milky Way.'} },
    { id:'ant',     m:5e-3, kind:'creature', glyph:'🐜',
      name:{ru:'Муравей', en:'Ant'},
      fact:{ru:'5 мм. Все муравьи планеты вместе весят примерно столько же, сколько все люди.',
            en:'5 mm. All the ants on Earth weigh roughly as much as all the humans.'} },

    // ── Жизнь и быт ─────────────────────────────────
    { id:'coin',    m:0.022, kind:'object', glyph:'⊙',
      name:{ru:'Монета 10 ₽', en:'Coin'},
      fact:{ru:'22 мм в диаметре. Удобный «человеческий» масштаб для интуиции.',
            en:'A 22 mm coin — a familiar human-scale reference.'} },
    { id:'phone',   m:0.16, kind:'object', glyph:'▭',
      name:{ru:'Смартфон', en:'Smartphone'},
      fact:{ru:'~16 см. У тебя в кармане миллиард транзисторов 3 нм — больше, чем людей в стране.',
            en:'~16 cm. A billion 3 nm transistors in your pocket — more than people in most countries.'} },
    { id:'cat',     m:0.46, kind:'creature', glyph:'🐈',
      name:{ru:'Кошка', en:'Cat'},
      fact:{ru:'46 см в холке. Кошка слышит ультразвук до 64 кГц — в 1,5 раза выше, чем собака.',
            en:'46 cm at the shoulder. Cats hear up to 64 kHz — 1.5× higher than dogs.'} },
    { id:'human',   m:1.7,   kind:'creature', glyph:'🧍', you:true,
      name:{ru:'Человек', en:'Human'},
      fact:{ru:'1,7 метра. Ты — где-то посередине между кварком и наблюдаемой Вселенной (на ~26 порядков от каждой).',
            en:'1.7 m. You sit nearly in the middle between a quark and the observable Universe (~26 orders from each).'} },
    { id:'giraffe', m:5.5,   kind:'creature', glyph:'🦒',
      name:{ru:'Жираф', en:'Giraffe'},
      fact:{ru:'5,5 м. Самое высокое наземное животное. Сердце весит 11 кг — чтобы протолкнуть кровь к голове.',
            en:'5.5 m. The tallest land animal; its heart weighs 11 kg to pump blood up its neck.'} },
    { id:'whale',   m:30, kind:'creature', glyph:'🐋',
      name:{ru:'Синий кит', en:'Blue whale'},
      fact:{ru:'30 м. Самое крупное животное за всю историю Земли. Сердце — размером с автомобиль.',
            en:'30 m. The largest animal that ever lived. Its heart is the size of a small car.'} },
    { id:'jumbo',   m:70, kind:'object', glyph:'✈',
      name:{ru:'Боинг 747', en:'Boeing 747'},
      fact:{ru:'70 м длиной. Один двигатель CF6 даёт тяги, достаточной, чтобы поднять 25 синих китов.',
            en:'70 m long. A single CF6 engine could lift 25 blue whales.'} },

    // ── Города и горы ───────────────────────────────
    { id:'eiffel',  m:330,  kind:'building', glyph:'🗼',
      name:{ru:'Эйфелева башня', en:'Eiffel Tower'},
      fact:{ru:'330 м. Зимой ниже на 15 см — сталь сжимается от холода.',
            en:'330 m. Shrinks 15 cm in winter — the iron contracts in the cold.'} },
    { id:'burj',    m:828,  kind:'building', glyph:'🏙',
      name:{ru:'Бурдж-Халифа', en:'Burj Khalifa'},
      fact:{ru:'828 м. С последнего этажа закат можно увидеть дважды — поднимаясь на лифте.',
            en:'828 m. From the top floor you can watch the sunset twice by riding the elevator up.'} },
    { id:'everest', m:8848, kind:'mountain', glyph:'⛰',
      name:{ru:'Эверест', en:'Mount Everest'},
      fact:{ru:'8848 м. Растёт на ~4 мм в год — Индийская плита продолжает наезжать на Евразийскую.',
            en:'8 848 m. Grows ~4 mm per year as India keeps pushing into Asia.'} },
    { id:'manhattan', m:21000, kind:'region', glyph:'▥',
      name:{ru:'Манхэттен', en:'Manhattan'},
      fact:{ru:'21 км в длину. Скала, на которой стоит небоскрёбный лес — древнее динозавров.',
            en:'21 km long. The bedrock under the skyscraper forest is older than dinosaurs.'} },
    { id:'mkad',    m:35000, kind:'region', glyph:'◯',
      name:{ru:'МКАД (диаметр)', en:'Moscow Ring (diameter)'},
      fact:{ru:'~35 км. Москва внутри МКАД — крупнейший европейский город по площади.',
            en:'~35 km. Inside the ring is the largest European city by area.'} },
    { id:'canyon',  m:446000, kind:'region', glyph:'≋',
      name:{ru:'Гранд-Каньон', en:'Grand Canyon'},
      fact:{ru:'446 км длиной. Колорадо вырезала его за 5–6 миллионов лет — мгновение по геологическим меркам.',
            en:'446 km long. The Colorado River carved it in just 5–6 million years.'} },

    // ── Планеты и звёзды ───────────────────────────
    { id:'moon',    m:3.474e6, kind:'moon', glyph:'🌑',
      name:{ru:'Луна (диаметр)', en:'Moon (diameter)'},
      fact:{ru:'3 474 км. Удаляется от Земли на 3,8 см в год — на размер ладони за десятилетие.',
            en:'3 474 km. Drifting 3.8 cm farther per year — a hand’s width per decade.'} },
    { id:'mercury', m:4.879e6, kind:'planet', glyph:'☿',
      name:{ru:'Меркурий', en:'Mercury'},
      fact:{ru:'4 879 км. День здесь длится 176 земных суток, а год — 88. Сутки длиннее года.',
            en:'4 879 km. A day lasts 176 Earth days, a year only 88 — days longer than years.'} },
    { id:'mars',    m:6.779e6, kind:'planet', glyph:'♂',
      name:{ru:'Марс', en:'Mars'},
      fact:{ru:'6 779 км. Олимп здесь — гора 22 км, в 2,5 раза выше Эвереста.',
            en:'6 779 km. Olympus Mons rises 22 km — 2.5× taller than Everest.'} },
    { id:'earth',   m:1.2742e7, kind:'planet', glyph:'🌍',
      name:{ru:'Земля', en:'Earth'},
      fact:{ru:'12 742 км. Единственная известная планета с жизнью. Покрыта на 71% водой.',
            en:'12 742 km. The only known planet with life. 71% covered in water.'} },
    { id:'neptune', m:4.9244e7, kind:'planet', glyph:'♆',
      name:{ru:'Нептун', en:'Neptune'},
      fact:{ru:'49 244 км. Ветры до 2100 км/ч — самые быстрые в Солнечной системе.',
            en:'49 244 km. Winds up to 2 100 km/h — the fastest in the Solar System.'} },
    { id:'jupiter', m:1.39820e8, kind:'planet', glyph:'♃',
      name:{ru:'Юпитер', en:'Jupiter'},
      fact:{ru:'139 820 км. В нём поместятся 1300 Земель. Большое Красное Пятно — буря крупнее нашей планеты, идёт уже 350 лет.',
            en:'139 820 km. 1 300 Earths fit inside. The Great Red Spot is a storm larger than Earth, raging for 350 years.'} },
    { id:'sun',     m:1.392e9, kind:'star', glyph:'☀',
      name:{ru:'Солнце', en:'Sun'},
      fact:{ru:'1,39 миллиона км. 99,86% массы Солнечной системы. Свету нужно 8 минут 20 секунд, чтобы дойти до тебя.',
            en:'1.39 million km. Holds 99.86% of the Solar System’s mass. Sunlight takes 8 min 20 s to reach you.'} },
    { id:'em-distance', m:3.844e8, kind:'orbit', glyph:'⌒',
      name:{ru:'Земля – Луна (расстояние)', en:'Earth–Moon distance'},
      fact:{ru:'384 400 км. В этот промежуток помещаются все остальные планеты Солнечной системы.',
            en:'384 400 km — enough to fit every other planet of the Solar System in between.'} },

    // ── Звёздные системы ───────────────────────────
    { id:'au',      m:1.496e11, kind:'orbit', glyph:'⊕→☀',
      name:{ru:'Астрономическая единица', en:'Astronomical Unit'},
      fact:{ru:'149,6 млн км — расстояние Земля – Солнце. Свет проходит его за 8 мин 20 с.',
            en:'149.6 million km — Earth–Sun distance. Light takes 8 min 20 s.'} },
    { id:'uy',      m:2.4e12, kind:'star', glyph:'★',
      name:{ru:'UY Щита (звезда-гигант)', en:'UY Scuti (hypergiant)'},
      fact:{ru:'1700 радиусов Солнца. Если бы стояла на месте Солнца — поглотила бы орбиту Юпитера.',
            en:'1 700 solar radii. Placed at the Sun’s position, it would swallow Jupiter’s orbit.'} },
    { id:'neptune-orbit', m:9e12, kind:'orbit', glyph:'⊙',
      name:{ru:'Орбита Нептуна', en:'Neptune’s orbit'},
      fact:{ru:'30 а.е. в радиусе. На прохождение света от Солнца до Нептуна уходит ~4 часа.',
            en:'30 AU. Sunlight takes ~4 hours to reach Neptune.'} },
    { id:'kuiper',  m:7.5e12, kind:'orbit', glyph:'◌',
      name:{ru:'Пояс Койпера', en:'Kuiper Belt'},
      fact:{ru:'Дом Плутона и других карликовых планет. Здесь 200 миллиардов ледяных тел.',
            en:'Home of Pluto and other dwarfs. ~200 billion icy bodies live here.'} },

    // ── Межзвёздная и галактическая ────────────────
    { id:'lightday', m:2.59e13, kind:'distance', glyph:'⤳',
      name:{ru:'Световой день', en:'Light-day'},
      fact:{ru:'25,9 млрд км. За день свет покрывает 7 диаметров Солнечной системы.',
            en:'25.9 billion km. Light spans 7 Solar System diameters in a day.'} },
    { id:'oort',    m:1.5e16, kind:'cloud', glyph:'❀',
      name:{ru:'Облако Оорта (внешн. край)', en:'Oort Cloud (outer edge)'},
      fact:{ru:'~1 световой год от Солнца. Здесь начинается межзвёздное пространство.',
            en:'~1 light-year from the Sun. The boundary of interstellar space.'} },
    { id:'lightyear', m:9.461e15, kind:'distance', glyph:'⤳',
      name:{ru:'Световой год', en:'Light-year'},
      fact:{ru:'9,46 трлн км. Расстояние, которое свет пробегает за год.',
            en:'9.46 trillion km — the distance light travels in one year.'} },
    { id:'proxima', m:4.0e16, kind:'distance', glyph:'★',
      name:{ru:'До Проксимы Центавра', en:'To Proxima Centauri'},
      fact:{ru:'4,24 светового года — ближайшая к Солнцу звезда. Voyager 1 долетел бы за ~75 000 лет.',
            en:'4.24 light-years — the nearest star. Voyager 1 would take ~75 000 years to get there.'} },
    { id:'orion',   m:2.4e17, kind:'nebula', glyph:'✷',
      name:{ru:'Туманность Ориона', en:'Orion Nebula'},
      fact:{ru:'24 световых года в поперечнике. Звёздный «инкубатор» — здесь рождаются новые светила.',
            en:'24 light-years across. A stellar nursery where new stars are born.'} },
    { id:'milkyway', m:9.5e20, kind:'galaxy', glyph:'✦',
      name:{ru:'Млечный Путь (диаметр)', en:'Milky Way (diameter)'},
      fact:{ru:'~100 000 световых лет. 100–400 миллиардов звёзд. Делает оборот за 230 млн лет.',
            en:'~100 000 light-years. 100–400 billion stars. One full rotation takes 230 million years.'} },
    { id:'andromeda-dist', m:2.4e22, kind:'distance', glyph:'⤳',
      name:{ru:'До Андромеды', en:'To Andromeda'},
      fact:{ru:'2,5 млн световых лет. Самая дальняя точка, видимая невооружённым глазом.',
            en:'2.5 million light-years. The farthest object visible to the naked eye.'} },
    { id:'localgroup', m:9.5e22, kind:'cluster', glyph:'✺',
      name:{ru:'Местная группа галактик', en:'Local Group'},
      fact:{ru:'~10 млн световых лет. Млечный Путь, Андромеда и ~80 спутников — наш «двор».',
            en:'~10 million light-years. The Milky Way, Andromeda and ~80 dwarfs — our cosmic backyard.'} },
    { id:'virgo',   m:1e23, kind:'cluster', glyph:'❋',
      name:{ru:'Скопление в Деве', en:'Virgo Cluster'},
      fact:{ru:'~1300 галактик. Притягивает Местную группу со скоростью 400 км/с.',
            en:'~1 300 galaxies. Pulls the Local Group at 400 km/s.'} },
    { id:'laniakea', m:5e23, kind:'cluster', glyph:'❋',
      name:{ru:'Сверхскопление Ланиакея', en:'Laniakea Supercluster'},
      fact:{ru:'520 миллионов св. лет. Наш «дом» в космической паутине, открытый в 2014.',
            en:'520 million light-years. Our home in the cosmic web, mapped in 2014.'} },
    { id:'sloan',   m:1.4e25, kind:'web', glyph:'⊞',
      name:{ru:'Великая стена Слоуна', en:'Sloan Great Wall'},
      fact:{ru:'1,4 миллиарда световых лет. Одна из крупнейших известных структур во Вселенной.',
            en:'1.4 billion light-years. One of the largest known structures in the Universe.'} },
    { id:'observable', m:8.8e26, kind:'universe', glyph:'∞',
      name:{ru:'Наблюдаемая Вселенная', en:'Observable Universe'},
      fact:{ru:'93 миллиарда световых лет в поперечнике. И это только то, что мы видим — реальная Вселенная намного больше.',
            en:'93 billion light-years across — and that’s only what we can see. The real Universe is much larger.'} }
  ];

  /* Объекты сортируем и считаем log10(m) */
  OBJECTS.forEach(o => { o.log = Math.log10(o.m); });
  OBJECTS.sort((a, b) => a.log - b.log);
  const MIN_LOG = OBJECTS[0].log - 1;
  const MAX_LOG = OBJECTS[OBJECTS.length - 1].log + 1;
  const HUMAN = OBJECTS.find(o => o.you) || OBJECTS.find(o => o.id === 'human');
  const HUMAN_LOG = HUMAN ? HUMAN.log : 0;

  /* ──────────────────────────────────────────────
     Состояние
     ────────────────────────────────────────────── */
  const state = {
    logScale: 0,
    targetLog: 0,
    audioOn: false,
    showHint: true,
    interacted: false
  };

  /* Deep link ?focus=… или ?scale=1e-15 */
  const params = new URLSearchParams(location.search);
  const focusId = params.get('focus');
  const scaleParam = params.get('scale');
  if (focusId) {
    const f = OBJECTS.find(o => o.id === focusId);
    if (f) { state.logScale = state.targetLog = f.log; state.showHint = false; }
  } else if (scaleParam) {
    const v = parseFloat(scaleParam);
    if (isFinite(v) && v > 0) { state.logScale = state.targetLog = Math.log10(v); state.showHint = false; }
  } else {
    state.logScale = state.targetLog = HUMAN_LOG; // стартуем с человека
  }

  /* ──────────────────────────────────────────────
     DOM-узлы (создадим в init)
     ────────────────────────────────────────────── */
  let canvas, ctx, dpr = 1;
  let bg, card, progress, progressFill, progressHandle, hint, toast, searchEl, searchInput, searchList;
  let zoomInBtn, zoomOutBtn;
  let cardTitle, cardSize, cardFact, cardCompare;
  let soundBtn, shareBtn, searchBtnTop;

  /* ──────────────────────────────────────────────
     Утилиты
     ────────────────────────────────────────────── */
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function hexToRgb(h) {
    const s = h.replace('#','');
    const n = parseInt(s, 16);
    return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
  }
  function rgbToCss(c, a) { return `rgba(${c.r|0},${c.g|0},${c.b|0},${a==null?1:a})`; }
  function lerpRgb(a, b, t) { return { r:lerp(a.r,b.r,t), g:lerp(a.g,b.g,t), b:lerp(a.b,b.b,t) }; }

  function formatSize(m, lang) {
    /* Возвращает «человеческое» представление размера */
    const T = I18N[lang || LANG];
    if (m === 0) return '0';
    const abs = Math.abs(m);
    let val, unit, mantissa, exp;
    if (abs >= 9.461e15) {
      val = m / 9.461e15; unit = T.lightYears;
    } else if (abs >= 1.496e11) {
      val = m / 1.496e11; unit = T.au;
    } else if (abs >= 1000) {
      val = m / 1000; unit = T.kilometers;
    } else {
      val = m; unit = T.meters;
    }
    if (Math.abs(val) >= 1e4 || (Math.abs(val) < 1e-2 && val !== 0)) {
      exp = Math.floor(Math.log10(Math.abs(val)));
      mantissa = val / Math.pow(10, exp);
      const mant = (Math.abs(mantissa - Math.round(mantissa)) < 0.05) ? String(Math.round(mantissa)) : mantissa.toFixed(2);
      return `${mant}\u00d710<sup>${exp}</sup> ${unit}`;
    }
    const rounded = Math.abs(val) >= 100 ? Math.round(val) :
                    Math.abs(val) >= 10  ? val.toFixed(1) :
                    Math.abs(val) >= 1   ? val.toFixed(2) :
                                           val.toPrecision(2);
    return `${rounded} ${unit}`;
  }

  function compareToHuman(obj, lang) {
    const T = I18N[lang || LANG];
    if (!HUMAN) return '';
    const dlog = obj.log - HUMAN_LOG;
    if (Math.abs(dlog) < 0.05) return T.sameAsYou;
    const factor = Math.pow(10, Math.abs(dlog));
    const compact = (n) => {
      if (n < 10) return n.toFixed(2);
      if (n < 100) return n.toFixed(1);
      if (n < 1e4) return Math.round(n).toLocaleString(lang === 'en' ? 'en-US' : 'ru-RU');
      // Big — use scientific
      const e = Math.floor(Math.log10(n));
      const mant = n / Math.pow(10, e);
      const m = (Math.abs(mant - Math.round(mant)) < 0.05) ? Math.round(mant) : mant.toFixed(1);
      return `${m}\u00d710<sup>${e}</sup>`;
    };
    if (Math.abs(dlog) < 4) {
      const tpl = dlog > 0 ? T.timesLargerThanYou : T.timesSmallerThanYou;
      return tpl.replace('{n}', compact(factor));
    }
    const tpl = dlog > 0 ? T.ordersLargerThanYou : T.ordersSmallerThanYou;
    return tpl.replace('{n}', Math.abs(dlog).toFixed(0));
  }

  /* Эпоха для текущего лога */
  function epochAt(log) {
    for (let i = 0; i < EPOCHS.length; i++) {
      if (log >= EPOCHS[i].min && log < EPOCHS[i].max) return EPOCHS[i];
    }
    return log < EPOCHS[0].min ? EPOCHS[0] : EPOCHS[EPOCHS.length - 1];
  }
  function epochBlend(log) {
    /* возвращает {a, b, accent} интерполированный между соседними эпохами */
    const cur = epochAt(log);
    const idx = EPOCHS.indexOf(cur);
    /* плавный переход в последние 0.8 порядка эпохи */
    const span = cur.max - cur.min;
    const local = (log - cur.min) / span;
    let blend = cur, t = 0;
    if (local > 0.85 && idx < EPOCHS.length - 1) {
      blend = EPOCHS[idx + 1]; t = (local - 0.85) / 0.15;
    } else if (local < 0.15 && idx > 0) {
      blend = EPOCHS[idx - 1]; t = (0.15 - local) / 0.15;
    }
    return {
      a: rgbToCss(lerpRgb(hexToRgb(cur.a), hexToRgb(blend.a), t)),
      b: rgbToCss(lerpRgb(hexToRgb(cur.b), hexToRgb(blend.b), t)),
      accent: rgbToCss(lerpRgb(hexToRgb(cur.accent), hexToRgb(blend.accent), t)),
      epoch: cur
    };
  }

  /* Ближайший якорь */
  function nearestObject(log) {
    let best = null, bestD = Infinity;
    for (let i = 0; i < OBJECTS.length; i++) {
      const d = Math.abs(OBJECTS[i].log - log);
      if (d < bestD) { bestD = d; best = OBJECTS[i]; }
    }
    return { obj: best, distance: bestD };
  }

  /* ──────────────────────────────────────────────
     Canvas — рендер сцены
     ────────────────────────────────────────────── */
  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.floor(window.innerWidth  * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width  = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }

  function drawScene() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;
    const baseSize = Math.min(W, H) * 0.42;
    const log = state.logScale;
    const epoch = epochBlend(log);
    /* Объекты в окне ±2 порядка */
    for (let i = 0; i < OBJECTS.length; i++) {
      const o = OBJECTS[i];
      const dlog = o.log - log; /* >0 — крупнее текущего масштаба */
      if (dlog < -2.2 || dlog > 2.2) continue;
      const screenSize = baseSize * Math.pow(10, dlog);
      const fade = 1 - Math.min(1, Math.abs(dlog) / 2.2);
      const alpha = Math.pow(fade, 1.6);
      drawObject(o, cx, cy, screenSize, alpha, epoch);
    }
    /* Маркер «ты здесь» — точка центра при не-человеческих масштабах */
    if (Math.abs(log - HUMAN_LOG) > 1) {
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1 * dpr;
      ctx.setLineDash([4*dpr, 4*dpr]);
      ctx.beginPath();
      ctx.arc(cx, cy, 6 * dpr, 0, Math.PI*2);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawObject(o, cx, cy, size, alpha, epoch) {
    if (size < 0.5 || alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    const r = size * 0.5;
    /* Свечение/контур */
    const grd = ctx.createRadialGradient(cx, cy, r * 0.05, cx, cy, r * 1.4);
    grd.addColorStop(0, epoch.accent.replace(/[\d.]+\)$/, '0.45)'));
    grd.addColorStop(0.5, epoch.accent.replace(/[\d.]+\)$/, '0.18)'));
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.4, 0, Math.PI*2); ctx.fill();
    /* Тип объекта — процедурный «жетон» */
    drawKind(o, cx, cy, r, epoch);
    /* Подпись (только для якоря в фокусе) */
    if (Math.abs(o.log - state.logScale) < 0.18 && size > 60) {
      ctx.fillStyle = '#ffffff';
      ctx.font = `${14 * dpr}px 'Orbitron', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = epoch.accent.replace(/[\d.]+\)$/, '0.9)');
      ctx.shadowBlur = 18 * dpr;
      const label = o.name[LANG];
      ctx.fillText(label.toUpperCase(), cx, cy - r - 22 * dpr);
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }

  function drawKind(o, cx, cy, r, epoch) {
    const accent = epoch.accent.replace(/[\d.]+\)$/, '1)');
    const accentSoft = epoch.accent.replace(/[\d.]+\)$/, '0.55)');
    ctx.lineWidth = Math.max(1, r * 0.02);
    ctx.strokeStyle = accent;
    ctx.fillStyle = accentSoft;
    switch (o.kind) {
      case 'foam':
        for (let i = 0; i < 14; i++) {
          const ang = (i/14) * Math.PI*2;
          const rr = r * (0.3 + Math.random() * 0.7);
          const x = cx + Math.cos(ang) * rr;
          const y = cy + Math.sin(ang) * rr;
          ctx.beginPath();
          ctx.arc(x, y, r * 0.05, 0, Math.PI*2);
          ctx.fill();
        }
        break;
      case 'particle':
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.18, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.6, 0, Math.PI*2);
        ctx.stroke();
        break;
      case 'nucleon':
        for (let i = 0; i < 3; i++) {
          const ang = i * Math.PI*2/3 - Math.PI/2;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(ang)*r*0.3, cy + Math.sin(ang)*r*0.3, r*0.32, 0, Math.PI*2);
          ctx.fill();
        }
        ctx.strokeStyle = accent;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI*2);
        ctx.stroke();
        break;
      case 'atom':
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.18, 0, Math.PI*2);
        ctx.fillStyle = accent;
        ctx.fill();
        ctx.fillStyle = accentSoft;
        for (let i = 0; i < 3; i++) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(i * Math.PI/3);
          ctx.beginPath();
          ctx.ellipse(0, 0, r * 0.85, r * 0.32, 0, 0, Math.PI*2);
          ctx.stroke();
          ctx.restore();
        }
        break;
      case 'molecule':
        const balls = [
          [0,0, 0.32], [-0.55, 0, 0.22], [0.55, 0, 0.22],
          [0, -0.55, 0.18], [0, 0.55, 0.18]
        ];
        ctx.strokeStyle = accent;
        balls.forEach(b => {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + b[0]*r, cy + b[1]*r);
          ctx.stroke();
        });
        balls.forEach(b => {
          ctx.beginPath();
          ctx.arc(cx + b[0]*r, cy + b[1]*r, b[2]*r, 0, Math.PI*2);
          ctx.fillStyle = accentSoft;
          ctx.fill();
          ctx.stroke();
        });
        break;
      case 'helix':
        ctx.strokeStyle = accent;
        for (let s = -1; s <= 1; s += 2) {
          ctx.beginPath();
          for (let t = -1; t <= 1.001; t += 0.02) {
            const x = cx + s * Math.sin(t * Math.PI * 2) * r * 0.4;
            const y = cy + t * r;
            if (t === -1) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        break;
      case 'chip':
        ctx.fillStyle = accentSoft;
        ctx.fillRect(cx - r*0.7, cy - r*0.7, r*1.4, r*1.4);
        ctx.strokeStyle = accent;
        ctx.strokeRect(cx - r*0.7, cy - r*0.7, r*1.4, r*1.4);
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath();
          ctx.moveTo(cx + i*r*0.18, cy - r*0.7);
          ctx.lineTo(cx + i*r*0.18, cy - r*0.95);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx + i*r*0.18, cy + r*0.7);
          ctx.lineTo(cx + i*r*0.18, cy + r*0.95);
          ctx.stroke();
        }
        break;
      case 'biostruct':
        ctx.beginPath(); ctx.arc(cx, cy, r*0.55, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx - r*0.18, cy - r*0.18, r*0.18, 0, Math.PI*2); ctx.fillStyle = accent; ctx.fill();
        break;
      case 'virus':
        ctx.fillStyle = accentSoft;
        ctx.beginPath(); ctx.arc(cx, cy, r*0.55, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = accent;
        for (let i = 0; i < 14; i++) {
          const ang = i * Math.PI*2/14;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(ang)*r*0.55, cy + Math.sin(ang)*r*0.55);
          ctx.lineTo(cx + Math.cos(ang)*r*0.92, cy + Math.sin(ang)*r*0.92);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx + Math.cos(ang)*r*0.95, cy + Math.sin(ang)*r*0.95, r*0.06, 0, Math.PI*2);
          ctx.fill();
        }
        break;
      case 'wave':
        ctx.strokeStyle = accent;
        ctx.beginPath();
        for (let x = -1; x <= 1.001; x += 0.02) {
          const px = cx + x * r;
          const py = cy + Math.sin(x * Math.PI * 5) * r * 0.18;
          if (x === -1) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        break;
      case 'cell':
        ctx.fillStyle = accentSoft;
        ctx.beginPath(); ctx.arc(cx, cy, r*0.85, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = accent;
        ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + r*0.15, cy - r*0.05, r*0.3, 0, Math.PI*2);
        ctx.fillStyle = accent; ctx.fill();
        break;
      case 'fiber':
        ctx.fillStyle = accent;
        ctx.fillRect(cx - r*0.05, cy - r*0.9, r*0.1, r*1.8);
        break;
      case 'grain':
        ctx.beginPath(); ctx.arc(cx, cy, r*0.55, 0, Math.PI*2);
        ctx.fillStyle = accentSoft; ctx.fill();
        ctx.strokeStyle = accent; ctx.stroke();
        break;
      case 'creature':
      case 'object':
      case 'building':
      case 'mountain':
      case 'region':
        /* Эмодзи как «кодовый знак» — кроссплатформенно узнаваемо */
        if (o.glyph) {
          const fs = r * 1.2;
          ctx.font = `${fs}px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(o.glyph, cx, cy);
        } else {
          ctx.fillStyle = accentSoft;
          ctx.beginPath(); ctx.arc(cx, cy, r*0.6, 0, Math.PI*2); ctx.fill();
          ctx.strokeStyle = accent; ctx.stroke();
        }
        break;
      case 'moon':
        ctx.fillStyle = '#c8c8d8';
        ctx.beginPath(); ctx.arc(cx, cy, r*0.85, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.arc(cx + (Math.random()-0.5)*r, cy + (Math.random()-0.5)*r, r * (0.05 + Math.random()*0.1), 0, Math.PI*2);
          ctx.fill();
        }
        break;
      case 'planet':
        if (o.id === 'earth') drawEarth(cx, cy, r);
        else if (o.id === 'mars') drawDisc(cx, cy, r, '#c1440e', '#7a2c0a');
        else if (o.id === 'mercury') drawDisc(cx, cy, r, '#a08778', '#3a3128');
        else if (o.id === 'jupiter') drawJupiter(cx, cy, r);
        else if (o.id === 'neptune') drawDisc(cx, cy, r, '#4b70dd', '#0a2050');
        else drawDisc(cx, cy, r, accent, epoch.b);
        break;
      case 'star':
        const sgrd = ctx.createRadialGradient(cx, cy, r*0.05, cx, cy, r);
        sgrd.addColorStop(0, '#fff8c0');
        sgrd.addColorStop(0.4, '#ffb830');
        sgrd.addColorStop(1, 'rgba(255,107,53,0)');
        ctx.fillStyle = sgrd;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff6b0';
        ctx.beginPath(); ctx.arc(cx, cy, r*0.55, 0, Math.PI*2); ctx.fill();
        break;
      case 'orbit':
        ctx.strokeStyle = accent;
        ctx.setLineDash([6*dpr, 6*dpr]);
        ctx.beginPath(); ctx.arc(cx, cy, r*0.85, 0, Math.PI*2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(cx, cy, r*0.05, 0, Math.PI*2);
        ctx.fillStyle = '#fff'; ctx.fill();
        break;
      case 'distance':
        ctx.strokeStyle = accent;
        ctx.beginPath();
        ctx.moveTo(cx - r*0.7, cy); ctx.lineTo(cx + r*0.7, cy);
        ctx.stroke();
        ctx.beginPath(); ctx.arc(cx - r*0.7, cy, r*0.06, 0, Math.PI*2);
        ctx.fillStyle = '#fff'; ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r*0.7, cy, r*0.06, 0, Math.PI*2); ctx.fill();
        break;
      case 'nebula':
      case 'cloud':
        ctx.globalAlpha = ctx.globalAlpha * 0.9;
        for (let i = 0; i < 24; i++) {
          const ang = Math.random() * Math.PI*2;
          const rr = r * (0.2 + Math.random()*0.7);
          const x = cx + Math.cos(ang)*rr, y = cy + Math.sin(ang)*rr;
          const g = ctx.createRadialGradient(x, y, 0, x, y, r*0.25);
          g.addColorStop(0, accent.replace(/[\d.]+\)$/, '0.45)'));
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(x, y, r*0.25, 0, Math.PI*2); ctx.fill();
        }
        break;
      case 'galaxy':
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(0.4);
        for (let arm = 0; arm < 2; arm++) {
          ctx.rotate(Math.PI);
          ctx.beginPath();
          for (let t = 0; t < Math.PI * 2.6; t += 0.05) {
            const rr = r * (0.05 + 0.13 * t);
            const x = Math.cos(t) * rr, y = Math.sin(t) * rr * 0.55;
            if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = accent;
          ctx.lineWidth = r * 0.04;
          ctx.stroke();
        }
        const cgrd = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.4);
        cgrd.addColorStop(0, '#fff6b0');
        cgrd.addColorStop(1, 'rgba(255,184,48,0)');
        ctx.fillStyle = cgrd;
        ctx.beginPath(); ctx.arc(0, 0, r*0.4, 0, Math.PI*2); ctx.fill();
        ctx.restore();
        break;
      case 'cluster':
      case 'web':
        for (let i = 0; i < 60; i++) {
          const ang = Math.random() * Math.PI * 2;
          const rr = Math.pow(Math.random(), 0.6) * r * 0.95;
          const x = cx + Math.cos(ang) * rr;
          const y = cy + Math.sin(ang) * rr;
          ctx.fillStyle = i % 4 === 0 ? '#fff6b0' : accent;
          ctx.beginPath(); ctx.arc(x, y, r * (0.01 + Math.random()*0.025), 0, Math.PI*2); ctx.fill();
        }
        ctx.strokeStyle = accent.replace(/[\d.]+\)$/, '0.25)');
        ctx.lineWidth = 1 * dpr;
        for (let i = 0; i < 14; i++) {
          ctx.beginPath();
          ctx.moveTo(cx + (Math.random()-0.5)*r*1.6, cy + (Math.random()-0.5)*r*1.6);
          ctx.lineTo(cx + (Math.random()-0.5)*r*1.6, cy + (Math.random()-0.5)*r*1.6);
          ctx.stroke();
        }
        break;
      case 'universe':
        const ugrd = ctx.createRadialGradient(cx, cy, r*0.1, cx, cy, r);
        ugrd.addColorStop(0, '#ffffff');
        ugrd.addColorStop(0.3, '#c060ff');
        ugrd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = ugrd;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
        for (let i = 0; i < 200; i++) {
          const ang = Math.random()*Math.PI*2;
          const rr = Math.random() * r * 0.95;
          ctx.fillStyle = Math.random() > 0.7 ? '#fff' : accent;
          ctx.fillRect(cx + Math.cos(ang)*rr, cy + Math.sin(ang)*rr, dpr, dpr);
        }
        break;
      default:
        ctx.beginPath(); ctx.arc(cx, cy, r*0.5, 0, Math.PI*2);
        ctx.fillStyle = accentSoft; ctx.fill();
        ctx.strokeStyle = accent; ctx.stroke();
    }
  }

  function drawDisc(cx, cy, r, c1, c2) {
    const g = ctx.createRadialGradient(cx - r*0.3, cy - r*0.3, r*0.05, cx, cy, r);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, r*0.85, 0, Math.PI*2); ctx.fill();
  }
  function drawEarth(cx, cy, r) {
    const g = ctx.createRadialGradient(cx - r*0.3, cy - r*0.3, r*0.05, cx, cy, r);
    g.addColorStop(0, '#5cb6ff');
    g.addColorStop(1, '#02174a');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, r*0.85, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(57,255,106,0.6)';
    [[-0.2,-0.1,0.18,0.15],[0.15,0.05,0.22,0.18],[-0.05,0.3,0.16,0.1]].forEach(p => {
      ctx.beginPath();
      ctx.ellipse(cx + p[0]*r, cy + p[1]*r, p[2]*r, p[3]*r, 0, 0, Math.PI*2);
      ctx.fill();
    });
  }
  function drawJupiter(cx, cy, r) {
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r*0.85, 0, Math.PI*2); ctx.clip();
    const stripes = ['#d8b48e','#b88c5a','#e8c9a0','#a87848','#d8b48e','#b88c5a','#e8c9a0'];
    stripes.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(cx - r, cy - r + i * (r*1.7/stripes.length) - r*0.15, r*2, r*1.7/stripes.length + 1);
    });
    ctx.fillStyle = '#ff6b35';
    ctx.beginPath(); ctx.ellipse(cx + r*0.18, cy + r*0.05, r*0.16, r*0.1, 0, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  /* ──────────────────────────────────────────────
     Звёздный фон (DOM, лёгкий)
     ────────────────────────────────────────────── */
  function buildStars() {
    bg = document.getElementById('su-bg');
    const count = window.innerWidth < 720 ? 80 : 160;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'su-star';
      const sz = Math.random() < 0.85 ? 1 : 2;
      s.style.width = sz + 'px';
      s.style.height = sz + 'px';
      s.style.left = (Math.random() * 100) + '%';
      s.style.top = (Math.random() * 100) + '%';
      s.style.setProperty('--d', (1.5 + Math.random()*3) + 's');
      s.style.setProperty('--o', (0.3 + Math.random()*0.6).toFixed(2));
      s.style.opacity = s.style.getPropertyValue('--o');
      bg.appendChild(s);
    }
  }
  function applyEpochToBg() {
    const e = epochBlend(state.logScale);
    document.documentElement.style.setProperty('--epoch-color-a', e.a);
    document.documentElement.style.setProperty('--epoch-color-b', e.b);
    document.documentElement.style.setProperty('--epoch-accent', e.accent);
  }

  /* ──────────────────────────────────────────────
     UI: карточка / прогресс / поиск / шеринг
     ────────────────────────────────────────────── */
  let lastCardId = null;
  function updateCard() {
    const { obj, distance } = nearestObject(state.logScale);
    if (!obj) return;
    if (obj.id !== lastCardId) {
      cardTitle.textContent = obj.name[LANG];
      cardSize.innerHTML = formatSize(obj.m, LANG);
      cardFact.textContent = obj.fact[LANG];
      cardCompare.innerHTML = obj.you ? `<b>${T.youAre}</b>` : compareToHuman(obj, LANG);
      lastCardId = obj.id;
      /* Динамический title и URL */
      document.title = T.shareTitle.replace('{name}', obj.name[LANG]).replace('{size}', stripHtml(formatSize(obj.m, LANG)));
      const url = new URL(location.href);
      url.searchParams.set('focus', obj.id);
      url.searchParams.delete('scale');
      history.replaceState(null, '', url.toString());
      const og = document.querySelector('meta[property="og:title"]');
      if (og) og.setAttribute('content', document.title);
      const ogd = document.querySelector('meta[property="og:description"]');
      if (ogd) ogd.setAttribute('content', T.shareDesc.replace('{name}', obj.name[LANG]).replace('{size}', stripHtml(formatSize(obj.m, LANG))));
    }
    /* Плавность fade-in карточки при близости к якорю */
    card.style.opacity = clamp(1 - distance * 0.6, 0.35, 1);
  }
  function stripHtml(s) { return s.replace(/<[^>]+>/g, ''); }

  function updateProgress() {
    const t = (state.logScale - MIN_LOG) / (MAX_LOG - MIN_LOG);
    const isMobile = window.innerWidth <= 720;
    if (isMobile) {
      progressFill.style.width = (t * 100) + '%';
      progressFill.style.height = '';
      progressHandle.style.left = (t * 100) + '%';
      progressHandle.style.top = '50%';
    } else {
      progressFill.style.height = (t * 100) + '%';
      progressFill.style.width = '';
      progressHandle.style.top = (t * 100) + '%';
      progressHandle.style.left = '50%';
    }
  }

  function buildProgressMarkers() {
    while (progress.querySelectorAll('.su-progress-marker').length) {
      progress.querySelectorAll('.su-progress-marker').forEach(n => n.remove());
    }
    while (progress.querySelectorAll('.su-progress-label').length) {
      progress.querySelectorAll('.su-progress-label').forEach(n => n.remove());
    }
    const isMobile = window.innerWidth <= 720;
    EPOCHS.forEach(ep => {
      const t = (ep.min - MIN_LOG) / (MAX_LOG - MIN_LOG);
      const m = document.createElement('div');
      m.className = 'su-progress-marker';
      const l = document.createElement('div');
      l.className = 'su-progress-label';
      l.textContent = ep.name;
      if (isMobile) {
        m.style.left = (t*100) + '%';
        l.style.left = (t*100) + '%';
        l.style.top = '-18px';
      } else {
        m.style.top = (t*100) + '%';
        l.style.top = (t*100) + '%';
      }
      progress.appendChild(m);
      progress.appendChild(l);
    });
  }

  /* ──────────────────────────────────────────────
     Управление: wheel / touch / keyboard / click-progress
     ────────────────────────────────────────────── */
  function dismissHint() {
    if (!state.showHint) return;
    state.showHint = false;
    if (hint) hint.classList.add('hidden');
  }
  function nudge(delta) {
    state.targetLog = clamp(state.targetLog + delta, MIN_LOG, MAX_LOG);
    state.interacted = true;
    dismissHint();
    if (window.ym) window.ym(108414617, 'reachGoal', 'su_scroll');
  }
  function jumpTo(log) {
    state.targetLog = clamp(log, MIN_LOG, MAX_LOG);
    state.interacted = true;
    dismissHint();
  }
  function jumpToObject(obj) {
    if (obj) jumpTo(obj.log);
  }

  function bindControls() {
    /* Wheel: deltaY > 0 (вниз) → к большему масштабу. */
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const sens = e.deltaMode === 1 ? 0.18 : 0.0042; /* line-mode vs pixel-mode */
      nudge(e.deltaY * sens);
    }, { passive: false });

    /* Touch */
    let touchY = null;
    let touchPrevLog = state.targetLog;
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchY = e.touches[0].clientY;
        touchPrevLog = state.targetLog;
      }
    });
    canvas.addEventListener('touchmove', (e) => {
      if (touchY != null && e.touches.length === 1) {
        const dy = e.touches[0].clientY - touchY;
        const sens = 0.018;
        /* Свайп вверх (dy<0) → больший масштаб (логарифм растёт) */
        state.targetLog = clamp(touchPrevLog - dy * sens, MIN_LOG, MAX_LOG);
        state.interacted = true;
        dismissHint();
        e.preventDefault();
      }
    }, { passive: false });
    canvas.addEventListener('touchend', () => { touchY = null; });

    /* Keyboard */
    window.addEventListener('keydown', (e) => {
      if (searchEl.classList.contains('open')) return;
      if (e.key === 'ArrowUp')      { nudge(-0.2); e.preventDefault(); }
      else if (e.key === 'ArrowDown') { nudge(0.2); e.preventDefault(); }
      else if (e.key === 'PageUp')   { nudge(-1); e.preventDefault(); }
      else if (e.key === 'PageDown') { nudge(1); e.preventDefault(); }
      else if (e.key === 'Home')     { jumpTo(MIN_LOG + 1); e.preventDefault(); }
      else if (e.key === 'End')      { jumpTo(MAX_LOG - 1); e.preventDefault(); }
      else if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { openSearch(); e.preventDefault(); }
      else if (e.key === '/') { openSearch(); e.preventDefault(); }
    });

    /* Progress click */
    progress.addEventListener('click', (e) => {
      const rect = progress.getBoundingClientRect();
      const isMobile = window.innerWidth <= 720;
      const t = isMobile ? (e.clientX - rect.left) / rect.width
                         : (e.clientY - rect.top) / rect.height;
      jumpTo(MIN_LOG + clamp(t, 0, 1) * (MAX_LOG - MIN_LOG));
    });

    /* ±10× buttons */
    zoomInBtn.addEventListener('click', () => nudge(-1));
    zoomOutBtn.addEventListener('click', () => nudge(1));

    /* Buttons */
    soundBtn.addEventListener('click', toggleAudio);
    shareBtn.addEventListener('click', share);
    searchBtnTop.addEventListener('click', openSearch);
  }

  /* ──────────────────────────────────────────────
     Поиск
     ────────────────────────────────────────────── */
  let searchActive = -1;
  function openSearch() {
    searchEl.classList.add('open');
    searchInput.value = '';
    renderSearch('');
    searchInput.focus();
  }
  function closeSearch() { searchEl.classList.remove('open'); }
  function renderSearch(q) {
    searchList.innerHTML = '';
    const norm = q.trim().toLowerCase();
    const items = OBJECTS.filter(o => {
      if (!norm) return true;
      return o.name.ru.toLowerCase().includes(norm) ||
             o.name.en.toLowerCase().includes(norm) ||
             o.id.includes(norm);
    });
    items.forEach((o, i) => {
      const div = document.createElement('div');
      div.className = 'su-search-item' + (i === 0 ? ' active' : '');
      div.dataset.id = o.id;
      div.innerHTML = `<span>${escapeHtml(o.name[LANG])}</span><span class="su-search-size">${formatSize(o.m, LANG)}</span>`;
      div.addEventListener('click', () => { jumpToObject(o); closeSearch(); });
      searchList.appendChild(div);
    });
    searchActive = 0;
  }
  function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function bindSearch() {
    searchInput.addEventListener('input', () => renderSearch(searchInput.value));
    searchInput.addEventListener('keydown', (e) => {
      const items = searchList.querySelectorAll('.su-search-item');
      if (e.key === 'ArrowDown') { searchActive = Math.min(items.length-1, searchActive+1); refreshActive(items); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { searchActive = Math.max(0, searchActive-1); refreshActive(items); e.preventDefault(); }
      else if (e.key === 'Enter') { const a = items[searchActive]; if (a) { jumpToObject(OBJECTS.find(o=>o.id===a.dataset.id)); closeSearch(); } }
      else if (e.key === 'Escape') { closeSearch(); }
    });
    searchEl.addEventListener('click', (e) => { if (e.target === searchEl) closeSearch(); });
  }
  function refreshActive(items) {
    items.forEach((it, i) => it.classList.toggle('active', i === searchActive));
    const el = items[searchActive];
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  /* ──────────────────────────────────────────────
     Шеринг
     ────────────────────────────────────────────── */
  function buildShareLink() {
    const obj = nearestObject(state.logScale).obj;
    const u = new URL(LANG === 'en' ? 'https://artemida2.github.io/scale/en/' : 'https://artemida2.github.io/scale/');
    u.searchParams.set('focus', obj.id);
    return { url: u.toString(), obj };
  }
  function buildMemeText() {
    const { url, obj } = buildShareLink();
    if (!HUMAN) return `${obj.name[LANG]} — ${stripHtml(formatSize(obj.m, LANG))}\n${url}`;
    const dlog = obj.log - HUMAN_LOG;
    let line;
    if (dlog > 0) {
      const factor = Math.pow(10, dlog);
      line = T.memeI.replace('{n}', factor >= 1e4 ? `10^${dlog.toFixed(0)}` : Math.round(factor).toLocaleString())
                    .replace('{name}', obj.name[LANG]);
    } else {
      const factor = Math.pow(10, -dlog);
      line = T.memeIShort.replace('{n}', factor >= 1e4 ? `10^${(-dlog).toFixed(0)}` : Math.round(factor).toLocaleString());
    }
    return `${line}\n${url}`;
  }

  function showToast(text) {
    const t = document.createElement('div');
    t.className = 'su-toast';
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1600);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); showToast(T.copied); }
    catch { /* fallback */
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); showToast(T.copied); } catch {}
      ta.remove();
    }
  }

  function share() {
    const { url, obj } = buildShareLink();
    const title = T.shareTitle.replace('{name}', obj.name[LANG]).replace('{size}', stripHtml(formatSize(obj.m, LANG)));
    if (navigator.share) {
      navigator.share({ title, text: buildMemeText(), url }).catch(()=>{});
    } else {
      copy(url);
    }
    if (window.ym) window.ym(108414617, 'reachGoal', 'su_share');
  }

  /* ──────────────────────────────────────────────
     Аудио (drone через WebAudio)
     ────────────────────────────────────────────── */
  let audioCtx = null, audioOsc = null, audioGain = null, audioOsc2 = null;
  function toggleAudio() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioOsc = audioCtx.createOscillator();
        audioOsc.type = 'sine';
        audioOsc.frequency.value = 65;
        audioOsc2 = audioCtx.createOscillator();
        audioOsc2.type = 'triangle';
        audioOsc2.frequency.value = 130;
        const gain2 = audioCtx.createGain();
        gain2.gain.value = 0.04;
        audioGain = audioCtx.createGain();
        audioGain.gain.value = 0;
        audioOsc.connect(audioGain).connect(audioCtx.destination);
        audioOsc2.connect(gain2).connect(audioGain);
        audioOsc.start();
        audioOsc2.start();
      } catch (e) { return; }
    }
    state.audioOn = !state.audioOn;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    audioGain.gain.linearRampToValueAtTime(state.audioOn ? 0.06 : 0, audioCtx.currentTime + 0.5);
    soundBtn.setAttribute('aria-pressed', state.audioOn ? 'true' : 'false');
  }
  function modulateAudio() {
    if (!audioCtx || !state.audioOn) return;
    /* Частота меняется в зависимости от эпохи: квантовый — высокий, космологический — низкий */
    const t = (state.logScale - MIN_LOG) / (MAX_LOG - MIN_LOG);
    const f = 200 - t * 160; /* 200 → 40 Hz */
    audioOsc.frequency.setTargetAtTime(f, audioCtx.currentTime, 0.4);
    audioOsc2.frequency.setTargetAtTime(f * 1.5, audioCtx.currentTime, 0.4);
  }

  /* ──────────────────────────────────────────────
     Главный tick
     ────────────────────────────────────────────── */
  function tick() {
    /* Smooth easing */
    state.logScale += (state.targetLog - state.logScale) * 0.14;
    if (Math.abs(state.targetLog - state.logScale) < 0.0008) state.logScale = state.targetLog;
    drawScene();
    updateCard();
    updateProgress();
    applyEpochToBg();
    modulateAudio();
    requestAnimationFrame(tick);
  }

  /* ──────────────────────────────────────────────
     Инициализация
     ────────────────────────────────────────────── */
  function init() {
    canvas = document.getElementById('su-canvas');
    ctx = canvas.getContext('2d');
    bg = document.getElementById('su-bg');
    card = document.getElementById('su-card');
    cardTitle = document.getElementById('su-card-title');
    cardSize = document.getElementById('su-card-size');
    cardFact = document.getElementById('su-card-fact');
    cardCompare = document.getElementById('su-card-compare');
    progress = document.getElementById('su-progress');
    progressFill = document.getElementById('su-progress-fill');
    progressHandle = document.getElementById('su-progress-handle');
    hint = document.getElementById('su-hint');
    searchEl = document.getElementById('su-search');
    searchInput = document.getElementById('su-search-input');
    searchList = document.getElementById('su-search-list');
    zoomInBtn = document.getElementById('su-zoom-in');
    zoomOutBtn = document.getElementById('su-zoom-out');
    soundBtn = document.getElementById('su-btn-sound');
    shareBtn = document.getElementById('su-btn-share');
    searchBtnTop = document.getElementById('su-btn-search');

    resizeCanvas();
    buildStars();
    buildProgressMarkers();
    bindControls();
    bindSearch();
    window.addEventListener('resize', () => {
      resizeCanvas();
      buildProgressMarkers();
    });

    /* Если зашли по deep-ссылке — подсказка не нужна. */
    if (!state.showHint && hint) hint.classList.add('hidden');

    /* Скрыть подсказку через ~6.5 секунд или после первого взаимодействия */
    setTimeout(() => { if (!state.interacted) dismissHint(); }, 6500);

    /* Экспортируем state для дебага */
    window.SU_STATE = state;

    /* Action bar wiring через delegation для compare/copy */
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-action]');
      if (!t) return;
      const a = t.dataset.action;
      if (a === 'copy-link') { copy(buildShareLink().url); if (window.ym) window.ym(108414617, 'reachGoal', 'su_copy_link'); }
      else if (a === 'copy-meme') { copy(buildMemeText()); if (window.ym) window.ym(108414617, 'reachGoal', 'su_copy_meme'); }
      else if (a === 'share-tw') { const { url } = buildShareLink(); window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(buildMemeText()), '_blank'); }
      else if (a === 'share-tg') { const { url } = buildShareLink(); window.open('https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(buildMemeText()), '_blank'); }
      else if (a === 'share-vk') { const { url } = buildShareLink(); window.open('https://vk.com/share.php?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(document.title), '_blank'); }
      else if (a === 'jump') { const o = OBJECTS.find(x => x.id === t.dataset.id); jumpToObject(o); }
    });

    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Экспорт списка объектов в window для no-JS fallback (сборка статичного списка) */
  window.SU_OBJECTS = OBJECTS;
  window.SU_LANG_T = T;
})();
