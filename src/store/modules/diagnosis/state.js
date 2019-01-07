export default {
  diagnosis: [{
      code: 'K00',
      title: 'Нарушения развития и прорезывания зубов',
      codes: [{
          code: 'K00.0',
          title: 'Адентия',
          explain: 'Congenitally missing teeth - complete or partial',
          type: 'dental',
        },
        {
          code: 'K00.1',
          title: 'Сверхкомплектные зубы',
          explain: 'Mesiodens',
        },
        {
          code: 'K00.2',
          title: 'Отклонения от размера и формы зуба',
          explain: 'Macr/micro-dontia, dens in dente, cocrescence,fusion, gemination, peg',
        },
        {
          code: 'K00.3',
          title: 'Крапчатые  зубы',
          explain: 'Fluorosis',
        },
        {
          code: 'K00.4',
          title: 'Нарушение формирования зубов',
          explain: 'Enamel hypoplasia, dilaceration, Turner',
        },
        {
          code: 'K00.5',
          title: 'Наследственные нарушения структуры зуба',
          explain: 'Amylo/dentino-genisis imperfecta',
        },
        {
          code: 'K00.6',
          title: 'Нарушения прорезывания зубов',
          explain: 'Natal/neonatal teeth, retained deciduous tooth, premature, late',
        },
        {
          code: 'K00.7',
          title: 'Синдром прорезывания зубов',
        },
        {
          code: 'K00.8',
          title: 'Другие нарушения развития зубов',
          explain: 'Colour changes due to blood incompatability, biliary, porphyria, tetyracy',
        },
        {
          code: 'K00.9',
          title: 'Нарушение развития зубов неуточненные',
        },

      ],
    },

    {
      code: 'K01',
      title: 'Ретенированные и импактные зубы',
      codes: [{
          code: 'K01.0',
          title: 'Ретенированные зубы',
          explain: 'Distinguish from impacted tooth',
        },
        {
          code: 'K01.1',
          title: 'Импактные зубы',
          explain: 'In contact with another tooth',
        },
      ],
    },
    {
      code: 'K02',
      title: 'Кариес зубов',
      type: 'dental',
      codes: [{
          code: 'K02.0',
          title: 'Кариес эмали стадия белого (мелового) пятна',
          explain: 'Restoration, amalgam, composite, resin',
          type: 'dental',
        },
        {
          code: 'K02.1',
          title: 'Кариес дентина',
          explain: 'Restoration, amalgam, composite, resin',
          type: 'dental',
        },
        {
          code: 'K02.2',
          title: 'Кариес цемента',
          explain: 'Restoration, amalgam, composite, resin, crown',
          type: 'dental',
        },
        {
          code: 'K02.3',
          title: 'Приостановившийся кариес зубов',
          explain: 'Restoration, amalgam, composite, resin, crown',
          type: 'dental',
        },
        {
          code: 'K02.4',
          title: 'Одонтоклазия детская меланодентия, меланодонтоклазия',
          explain: 'Infantile meladontia',
          type: 'dental',
        },
        {
          code: 'K02.8',
          title: 'Другой уточненный кариес зубов',
        },
        {
          code: 'K02.9',
          title: 'Кариес зубов неуточненный',
        },
      ],
    },
    {
      code: 'K03',
      title: 'Другие болезни твердых тканей зубов',
      codes: [{
          code: 'K03.0',
          title: 'Повышенное стирание зубов',
        },
        {
          code: 'K03.1',
          title: 'Сошлифовывание (абразивный знос) зубов',
        },
        {
          code: 'K03.2',
          title: 'Эрозия зубов',
          explain: 'Vomiting, anorexia, bulhemia, acid, diet',
        },
        {
          code: 'K03.3',
          title: 'Патологическая резорбция зубов',
          explain: 'Pink spot',
        },
        {
          code: 'K03.4',
          title: 'Гиперцементоз ',
        },
        {
          code: 'K03.5',
          title: 'Анкилоз зубов',
          explain: 'Pink spot',
        },
        {
          code: 'K03.6',
          title: 'Отложения (наросты) на зубах',
          explain: 'Pigmentation, tobacco, betel, plaque, calculus, scaling and polishing',
        },
        {
          code: 'K03.7',
          title: 'Изменения цвета твердых тканей зубов после прорезывания',
          explain: 'Metal, pulpal bleeding, betel, tobacco',
        },
        {
          code: 'K03.8',
          title: 'Другие  уточненные болезни твердых тканей зубов',
          explain: 'Sensitive dentine',
        },
        {
          code: 'K03.9',
          title: 'Болезнь твердых тканей зубов неуточненная',
          explain: '',
        },
      ],
    },
    {
      code: 'K04',
      title: 'Болезни пульпы и периапикальных тканей',
      codes: [{
          code: 'K04.0',
          title: 'Пульпит',
          explain: 'Pulp cap, root canal treatment,sedative dressing, endodontic,obturate',
        },
        {
          code: 'K04.1',
          title: 'Некроз пульпы (гангрена пульпы)',
          explain: 'Gangrene, root canal treatment,sedative dressing, endodontic,obturate',
        },
        {
          code: 'K04.2',
          title: 'Дегенерация пульпы дентикли, пульпарные камни',
          explain: 'Pulp stones, sclerosis',
        },
        {
          code: 'K04.3',
          title: 'Неправильное формирование твердых тканей в пульпе',
          explain: '2ndary dentine - excludes pulp stones(K04.2)',
        },
        {
          code: 'K04.4',
          title: 'Острый апикальный периодонтит пульпарного происхождения ',
          explain: 'Root canal treatment,endodontic,obturate, abcess',
        },
        {
          code: 'K04.5',
          title: 'Хронический апикальный периодонтит (апикальная гранулема)',
          explain: 'Granuloma, root canal treatment,endodontic,obturate,abcess',
        },
        {
          code: 'K04.6',
          title: 'Периапикальный абсцесс со свищем  ',
          explain: 'Root canal treatment,endodontic,obturate,abcess',
        },
        {
          code: 'K04.7',
          title: 'Периапикальный абсцесс без свища',
          explain: 'Root canal treatment,endodontic,obturate,abcess',
        },
        {
          code: 'K04.8',
          title: 'Корневая киста ',
          explain: 'Apical cyst, enucleate,apicectomy, apicoectomy',
        },
        {
          code: 'K04.9',
          title: 'Другие неуточненные болезни пульпы и периапикальных тканей',
        },
      ],
    },
    {
      code: 'K05',
      title: 'Гингивит и болезни пародонта',
      codes: [{
          code: 'K05.0',
          title: 'Острый гингивит',
          explain: 'Gingivitis, bleeding gums, scaling',
        },
        {
          code: 'K05.1',
          title: 'Хронический гингивит',
          explain: 'Gingivitis, bleeding gums, scaling, ulcerative - excludes Vincent',
        },
        {
          code: 'K05.2',
          title: 'Острый парадонтит',
          explain: 'Gingivitis, bleeding gums, scaling ',
        },
        {
          code: 'K05.3',
          title: 'Хронический пародонтит',
          explain: 'Gingivitis, chronic pericoronitis, bleeding gums, scaling',
        },
        {
          code: 'K05.4',
          title: 'Пародонтоз',
          explain: 'Juvenile,gingivitis, bleeding gums, scaling, curettage',
        },
        {
          code: 'K05.5',
          title: 'Другие болезни пародонта',
          explain: 'Gingivitis, bleeding gums, scaling',
        },
        {
          code: 'K05.6',
          title: 'Другие болезни пародонта, неуточненные',
        },
      ],
    },
    {
      code: 'K06',
      title: 'Другие изменения десны и беззубого альвеолярного края',
      codes: [{
          code: 'K06.0',
          title: 'Рецессия десны',
          explain: 'Gingiva, recession',
        },
        {
          code: 'K06.1',
          title: 'Гипертрофия десны',
          explain: 'Fibromatosis',
        },
        {
          code: 'K06.2',
          title: 'Поражения десны и беззубого альвеолярного края, обусловленные травмой',
          explain: 'Denture hyperplasia occlusion, toothbrushing',
        },
        {
          code: 'K06.8',
          title: 'Другие уточненные изменения десны и беззубого альвеолярного края',
          explain: 'Gingival cyst, epulis, pyogenic granuloma',
        },
        {
          code: 'K06.9',
          title: 'Изменения десны и беззубого альвеолярного края неуточненные',
        },
      ],
    },
    {
      code: 'K07',
      title: 'Челюстно-лицевые аномалии (включая аномалии прикуса)',
      codes: [{
          code: 'K07.0',
          title: 'Основные аномалии размеров челюстей',
          explain: 'Gingiva, recession',
        },
        {
          code: 'K07.1',
          title: 'Аномалии челюстно-черепных соотношений',
          explain: 'Asymetry, pro/retrognathic, Cl 2, Cl 3, osteotomy, orthognathic, ortho',
        },
        {
          code: 'K07.2',
          title: 'Аномалии соотношения зубных дуг',
          explain: 'Overjet, overbite, crossbite,midline deviation, orthodontic, banding',
        },
        {
          code: 'K07.3',
          title: 'Аномалии положения зубов',
          explain: 'Crowding, rotation, distema, transposition',
        },
        {
          code: 'K07.4',
          title: 'Аномалии прикуса неуточненные',
        },
        {
          code: 'K07.5',
          title: 'Челюстно-лицевые аномалии функционального происхождения',
          explain: 'Mouth breathing, abnormal swallowing, habits',
        },
        {
          code: 'K07.6',
          title: 'Болезни ВЧНС',
          explain: 'Dislocation, TMJ, click, pain',
        },
        {
          code: 'K07.8',
          title: 'Другие денто-лицевые аномалии',
          explain: 'Dislocation, TMJ, click, pain',
        },
        {
          code: 'K07.9',
          title: 'Денто-лицевая аномалия, неуточненная',
        },
      ],
    },
    {
      code: 'K08',
      title: 'Другие изменения зубов и их опорного аппарата',
      codes: [{
          code: 'K08.0',
          title: 'Эксфолиация зубов из-за системных нарушений',
          explain: 'Hypophosphatasia, scurvy',
        },
        {
          code: 'K08.1',
          title: 'Потеря зубов вследствие несчастного случая, удаления или локализованного пародонтита',
          explain: 'Denture, bridge, implant, space maintainer',
        },
        {
          code: 'K08.2',
          title: 'Атрофия беззубого альвеолярного края',
          explain: 'Gingival mucosal graft',
        },
        {
          code: 'K08.3',
          title: 'Оставшийся корень зуба',
          explain: 'Root rest',
        },
        {
          code: 'K08.8',
          title: 'Другие уточненные изменения зубов и их опорного аппарата',
          explain: 'Toothache NOS',
        },
        {
          code: 'K08.9',
          title: 'Изменения зубов и их опорного аппарата неуточненное',
        },
      ],
    },
    {
      code: 'K09',
      title: 'Кисты области рта, не классифицированные в других  рубриках',
      codes: [{
          code: 'K09.0',
          title: 'Киста при прорезывании зубов',
          explain: 'cyst, eruption, gingival, Kerato, dentigerous,lateral periodontal',
        },
        {
          code: 'K09.1',
          title: 'Ростовые (неодонтогенные) кисты области рта',
          explain: 'Nasopalatine cyst',
        },
        {
          code: 'K09.2',
          title: 'Другие кисты челюстей',
          explain: 'Nasopalatine cyst',
        },
        {
          code: 'K09.8',
          title: 'Кисты полости рта, не классифицированные в других рубриках',
          explain: 'Dermoid cyst',
        },
        {
          code: 'K09.9',
          title: 'Кисты полости рта, неуточненные',
        },
      ],
    },
    {
      code: 'K10',
      title: 'Другие болезни челюстей',
      codes: [{
          code: 'K10.0',
          title: 'Нарушения развития челюстей',
          explain: 'Tori',
        },
        {
          code: 'K10.1',
          title: 'Гигантоклеточная гранулема центральная',
          explain: '',
        },
        {
          code: 'K10.2',
          title: 'Воспалительные заболевания челюстей',
        },
        {
          code: 'K10.3',
          title: 'Альвеолит челюстей альвеолярный остеит, сухая лунка',
          explain: 'Osteomyelitis, sequestra',
        },
        {
          code: 'K10.8',
          title: 'Другие уточненные болезни челюстей',
          explain: 'Dry socket',
        },
        {
          code: 'K10.9',
          title: 'Болезнь челюстей неуточненная',
        },
      ],
    },
    {
      code: 'K11',
      title: '<олезни слюнных желез',
      codes: [{
          code: 'K11.0',
          title: 'Атрофия слюнной железы',
        },
        {
          code: 'K11.1',
          title: 'Гипертрофия слюнной железы',
        },
        {
          code: 'K11.2',
          title: 'Сиалоадеит',
        },
        {
          code: 'K11.3',
          title: 'Абсцесс слюнной железы',
        },
        {
          code: 'K11.4',
          title: 'Свищ слюнной железы',
        },
        {
          code: 'K11.5',
          title: 'Сиалолитиаз, камни в слюнном протоке',
          explain: 'Salivary calculus, stone',
        },
        {
          code: 'K11.6',
          title: 'Мукоцеле слюнной железы, ранула',
        },
        {
          code: 'K11.7',
          title: 'Нарушение секреции слюнных желез',
          explain: 'Xerostoma, dry mouth',
        },
        {
          code: 'K11.8',
          title: 'Другие болезни слюнных желез',
          explain: 'Miculicz',
        },
        {
          code: 'K11.9',
          title: 'Заболевание слюнной железы неуточненное',
        },
      ],
    },
    {
      code: 'K12',
      title: 'Стоматит и родственные поражения',
      codes: [{
          code: 'K12.0',
          title: 'Рецидивирующие афты полости рта',
        },
        {
          code: 'K12.1',
          title: 'Другие формы стоматита',
        },
        {
          code: 'K12.2',
          title: 'Флегмона и абсцесс области рта',
        },
      ],
    },
    {
      code: 'K13',
      title: 'Другие болезни губ и слизистой оболочки полости рта',
      codes: [{
          code: 'K13.0',
          title: 'Болезни губ',
          explain: 'Angular chelitis',
        },
        {
          code: 'K13.1',
          title: 'Прикусывание щеки и губ',
        },
        {
          code: 'K13.2',
          title: 'Лейкоплакия и другие изменения  эпителия  полости рта, включая язык',
        },
        {
          code: 'K13.3',
          title: 'Волосатая лейкоплакия',
        },
        {
          code: 'K13.4',
          title: 'Гранулема и гранулемоподобные поражения сопр',
        },
        {
          code: 'K13.5',
          title: 'Подслизистый фиброз полости рта',
        },
        {
          code: 'K13.6',
          title: 'Гиперплазия СОПР вследствие раздражения',
        },
        {
          code: 'K13.7',
          title: 'Другие  и неуточненные поражения СОПР',
        },
      ],
    },
    {
      code: 'K14',
      title: 'Болезни языка',
      codes: [{
          code: 'K14.0',
          title: 'Глоссит',
          explain: 'Ulcer, abscess',
        },
        {
          code: 'K14.1',
          title: 'Географический язык, эксфолиативный глоссит',
        },
        {
          code: 'K14.2',
          title: 'Срединный ромбовидный глоссит',
        },
        {
          code: 'K14.3',
          title: 'Гипертрофия сосочков языка',
          explain: 'Black hairy tongue',
        },
        {
          code: 'K14.4',
          title: 'Атрофия сосочков языка',
        },
        {
          code: 'K14.5',
          title: 'Складчатый, морщинистый, бороздчатый, расщепленный язык',
          explain: 'Scrotal, fissured tongue',
        },
        {
          code: 'K14.6',
          title: 'Глоссодиния',
        },
        {
          code: 'K14.8',
          title: 'Глоссодиния неуточненная',
        },
        {
          code: 'K14.9',
          title: 'Болезнь языка неуточненная',
        },
      ],
    },
    {
      code: 'Z',
      title: 'Z codes',
      codes: [{
          code: 'Z01.2',
          title: 'Стоматологическое обследование',
          explain: 'Replace amalgams with composites in absence of clinical need; teeth whitening etc',
        },
        {
          code: 'Z41.8',
          title: 'Другие процедуры для целей, отличных от устранения состояния здоровья',
          explain: 'FLUORIDE Rx, FISSURE SEALANT, MOUTH GUARD, PROPHYLACT',
        },
        {
          code: 'Z29.8',
          title: 'Другие уточненные профилактические процедуры',
          explain: 'All prosthetic laboratory procedures , Facing replacement',
        },
        {
          code: 'Z46.3',
          title: 'Установка и регулировка зубного протеза',
          explain: 'Denture repair or adjustment',
        },
        {
          code: 'Z46.4',
          title: 'Установка и настройка стоматологического ортодонтического устройства',
          explain: 'All orthodontic laboratory procedures',
        },
        {
          code: 'Z48.0',
          title: 'Внимание к хирургическим повязкам или швам',
          explain: 'Removal of sutures when original surgery not done by person removing',
        },
        {
          code: 'Z45.8',
          title: 'Корректировка и управление другими имплантированными устройствами',
          explain: 'Replacement of implant or implant-supported components, implant mainteanance',
        },
        {
          code: 'Z53.2',
          title: 'Процедура не выполнена из-за решения пациента по другим и неуказанным причинам',
          explain: 'Failed or cancelled appouintment',
        },
      ],

    },
  ],
  status: '',
};
