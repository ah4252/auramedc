const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDY_YEAR = 'السنة الاولى';
const SUBJECT_NAME = 'SSH';
const DIFFICULTY = 'MEDIUM';

const questions = [
  {
    text: "Concernant l'histoire de la médecine en civilisation islamique, laquelle des affirmations suivantes est FAUSSE ?",
    explanation: "Ibn al-Haytham (Alhacen) est connu pour ses travaux en optique et la perception visuelle, pas pour la circulation sanguine. La découverte de la circulation pulmonaire est attribuée à Ibn al-Nafis (XIIIe siècle), avant William Harvey (XVIIe siècle).",
    options: [
      { text: "Ibn al-Nafis a décrit la circulation pulmonaire et les artères coronaires au XIIIe siècle", isCorrect: false },
      { text: "Al-Razi (Rhazes) a été le premier médecin à utiliser systématiquement l'alcool dans sa pratique médicale et a décrit la variole et la rougeole", isCorrect: false },
      { text: "Avicenne (Ibn Sina) a introduit la quantification et l'expérimentation en physiologie dans son Canon de la médecine", isCorrect: false },
      { text: "Abu al-Qasim (Abulcasis) est considéré comme le père de la chirurgie moderne et a inventé de nombreux instruments chirurgicaux dont le catgut", isCorrect: false },
      { text: "Ibn al-Haytham (Alhacen) a découvert la circulation sanguine avant William Harvey", isCorrect: true },
    ],
  },
  {
    text: "Le Code de déontologie médicale algérien a été promulgué par le Décret exécutif n° 92-276 du 06 juillet 1992. Selon ce code, lequel des énoncés suivants concernant les devoirs professionnels du médecin est CORRECT ?",
    explanation: "Le patient dispose du droit de libre choix de son médecin, sauf exceptions (secteur public, expertise, médecine de contrôle, médecine scolaire). Le médecin ne peut refuser des soins en cas d'urgence. Le secret médical s'impose au médecin et à ses collaborateurs. La médecine-spectacle est interdite.",
    options: [
      { text: "Le médecin peut refuser de donner des soins en toute circonstance, y compris en cas d'urgence, s'il invoque sa clause de conscience", isCorrect: false },
      { text: "Le secret médical ne s'applique pas aux collaborateurs du médecin (infirmiers, secrétaires médicaux)", isCorrect: false },
      { text: "Le médecin peut délivrer un certificat médical sur la base des déclarations du patient sans examen préalable", isCorrect: false },
      { text: "Le malade dispose du droit du libre choix de son médecin, sauf exceptions comme l'expertise médicale ou la médecine de contrôle", isCorrect: true },
      { text: "La déontologie médicale autorise la pratique de la médecine-spectacle (médecine foraine) à condition d'informer le public", isCorrect: false },
    ],
  },
  {
    text: "Un médecin est confronté à un patient atteint d'un cancer métastatique en phase terminale. La famille demande que le diagnostic ne soit pas révélé au patient pour ne pas le \"briser\". Selon les principes éthiques et déontologiques, quelle est la conduite la plus appropriée ?",
    explanation: "L'information du patient est un droit fondamental et le consentement éclairé est la pierre angulaire de la relation médecin-malade. Le diagnostic grave ou le pronostic fatal ne doivent être révélés qu'avec circonspection, mais le patient doit être informé pour pouvoir consentir aux soins.",
    options: [
      { text: "Accéder à la demande de la famille et ne rien révéler au patient, car la famille connaît mieux le patient", isCorrect: false },
      { text: "Révéler le diagnostic au patient avec circonspection, car le consentement éclairé est un droit fondamental du patient", isCorrect: true },
      { text: "Révéler le diagnostic uniquement si le patient le demande explicitement", isCorrect: false },
      { text: "Ne pas révéler le diagnostic mais mentionner qu'il s'agit d'une \"maladie grave\" sans précision", isCorrect: false },
      { text: "Révéler le diagnostic à la famille uniquement et laisser celle-ci décider d'en informer ou non le patient", isCorrect: false },
    ],
  },
  {
    text: "Concernant le secret médical en Algérie, quelles sont les dérogations formelles (obligations légales de révélation) prévues par la loi ?",
    explanation: "Les dérogations formelles (obligatoires) incluent : déclaration des maladies contagieuses, certificats d'internement pour troubles mentaux (loi LPPS 85), sévices à enfants, crimes contre la sûreté de l'État. Le signalement des toxicomanes est une dérogation relative (facultative).",
    options: [
      { text: "Signalement des toxicomanes et déclaration des avortements illégaux", isCorrect: false },
      { text: "Déclaration des maladies contagieuses, certificats d'internement pour troubles mentaux, et déclaration des sévices à enfants", isCorrect: true },
      { text: "Révélation du secret médical devant la justice en tant que médecin témoin", isCorrect: false },
      { text: "Information du conjoint du patient en cas de maladie sexuellement transmissible", isCorrect: false },
      { text: "Transmission du dossier médical aux héritiers après le décès du patient", isCorrect: false },
    ],
  },
  {
    text: "La transition épidémiologique décrite par Omran en 1971 comporte plusieurs modèles. Le modèle \"retardé\" ou \"différé\" concerne principalement :",
    explanation: "Le modèle retardé (ou différé) concerne les pays en développement où la transition démarre tardivement, sans diminution rapide de la fertilité et sans amélioration notable des conditions de vie.",
    options: [
      { text: "Les pays d'Europe où la transition a débuté avant les grands progrès scientifiques et a duré 100 à 200 ans", isCorrect: false },
      { text: "Le Japon où la diminution de la mortalité et de la fertilité a été très rapide", isCorrect: false },
      { text: "Les pays en développement où la transition démarre tardivement, sans diminution rapide de la fertilité ni amélioration notable des conditions de vie", isCorrect: true },
      { text: "Les pays à économie intermédiaire (Moyen-Orient, Maghreb) où l'on observe la coexistence de plusieurs phases de la transition", isCorrect: false },
      { text: "Les pays à revenus élevés où les maladies cardiovasculaires et les cancers sont les principales causes de décès avec un recul des taux selon l'âge", isCorrect: false },
    ],
  },
  {
    text: "La troisième transition épidémiologique, selon le cours, est qualifiée de \"pathocénose virtuelle\". Cette notion se caractérise par :",
    explanation: "La troisième transition épidémiologique est une pathocénose \"virtuelle\" où les médecins proposent des facteurs de risque (cholestérol, déficit cognitif léger) qui deviennent des maladies vécues comme réelles, alors que les patients n'ont pas de symptômes concrets.",
    options: [
      { text: "La réapparition des grandes épidémies historiques comme la peste et le choléra", isCorrect: false },
      { text: "Une médecine où ce ne sont plus les patients qui viennent déposer leurs plaintes, mais les médecins qui leur proposent de nouvelles maladies (facteurs de risque), transformant des anomalies biologiques en maladies vécues comme réelles", isCorrect: true },
      { text: "La disparition complète des maladies infectieuses au profit des maladies chroniques", isCorrect: false },
      { text: "La transition d'une pathocénose rurale à une pathocénose urbaine", isCorrect: false },
      { text: "L'augmentation de l'espérance de vie au-delà de 70 ans dans les pays développés", isCorrect: false },
    ],
  },
  {
    text: "Un indicateur de santé est défini comme un outil d'aide à la décision. Parmi les qualités requises pour un bon indicateur, laquelle est INCORRECTE ?",
    explanation: "Un indicateur de santé doit être fiable et précis, mais sa taille n'est pas un critère de qualité en soi. Les qualités requises sont : simple, opérationnel, crédible, acceptable, validé, pertinent, fiable, précis, reproductible, sensible et spécifique.",
    options: [
      { text: "Simple, opérationnel, crédible et acceptable", isCorrect: false },
      { text: "Validé et pertinent", isCorrect: false },
      { text: "Toujours de grande taille (nombre d'observations élevé) pour être fiable", isCorrect: true },
      { text: "Fiable, précis et reproductible", isCorrect: false },
      { text: "Sensible et spécifique", isCorrect: false },
    ],
  },
  {
    text: "Dans une ville de 200 000 habitants, on dénombre en une année 250 naissances vivantes et 180 décès. Le taux de natalité (TBN) et le taux d'accroissement naturel (TAN) pour 1000 habitants sont respectivement :",
    explanation: "TBN = 250/200000 × 1000 = 1,25 × 1000 = 12,5 ‰ (pour 1000). Accroissement naturel = 250 − 180 = 70. TAN = 70/200000 × 1000 = 0,35 × 1000 = 3,5 ‰ (pour 1000).",
    options: [
      { text: "TBN = 1,25 ‰ ; TAN = 0,35 ‰", isCorrect: false },
      { text: "TBN = 1,25 ‰ ; TAN = 0,90 ‰", isCorrect: false },
      { text: "TBN = 12,5 ‰ ; TAN = 3,5 ‰", isCorrect: true },
      { text: "TBN = 12,5 ‰ ; TAN = 0,35 ‰", isCorrect: false },
      { text: "TBN = 125 ‰ ; TAN = 35 ‰", isCorrect: false },
    ],
  },
  {
    text: "La notion de vulnérabilité en santé publique désigne :",
    explanation: "La vulnérabilité en santé publique est un concept qui englobe le fait que les inégalités socio-économiques créent des inégalités face à la maladie et au risque. Les individus vulnérables ont, à exposition égale, une probabilité plus élevée de subir des conséquences délétères.",
    options: [
      { text: "La prédisposition génétique à développer une maladie spécifique", isCorrect: false },
      { text: "Le fait que les inégalités socio-économiques engendrent des inégalités devant la maladie, les individus ayant une probabilité plus élevée, à exposition égale face à un risque, de subir des conséquences délétères", isCorrect: true },
      { text: "L'absence de couverture sociale chez les patients", isCorrect: false },
      { text: "La fragilité liée uniquement à l'âge avancé", isCorrect: false },
      { text: "La résistance diminuée aux infections nosocomiales", isCorrect: false },
    ],
  },
  {
    text: "Selon la classification des stigmates proposée par Erving Goffman, les stigmates \"tribaux\" correspondent à :",
    explanation: "Selon Goffman, les trois catégories de stigmates sont : corporels (handicaps, malformations), reliés à la personnalité/passé (maladie mentale, alcoolisme), et tribaux (ethnie, religion, nationalité, transmis de génération en génération).",
    options: [
      { text: "Les défauts physiques comme un handicap ou une malformation", isCorrect: false },
      { text: "Les antécédents de maladie mentale ou d'alcoolisme", isCorrect: false },
      { text: "L'ethnie, la religion ou la nationalité de l'individu, transmis de génération en génération", isCorrect: true },
      { text: "Les comportements déviants par rapport aux normes sociales", isCorrect: false },
      { text: "Les maladies chroniques visibles comme le psoriasis", isCorrect: false },
    ],
  },
  {
    text: "La iatrogénie est définie comme l'ensemble des conséquences néfastes sur l'état de santé de tout acte ou mesure pratiqué ou prescrit par un professionnel de santé habilité. Parmi les situations suivantes, laquelle ne constitue PAS un événement iatrogène ?",
    explanation: "L'évolution naturelle d'une maladie chronique vers une complication connue ne constitue pas un événement iatrogène car elle n'est pas liée à un acte ou une mesure de soin. Les autres options sont des événements iatrogènes.",
    options: [
      { text: "Une infection nosocomiale contractée lors d'une hospitalisation", isCorrect: false },
      { text: "Un effet indésirable grave d'un médicament survenu aux doses thérapeutiques habituelles", isCorrect: false },
      { text: "Une complication chirurgicale inévitable survenue malgré une technique parfaitement maîtrisée", isCorrect: false },
      { text: "L'évolution naturelle d'une maladie chronique vers une complication connue", isCorrect: true },
      { text: "Une erreur médicamenteuse liée à une confusion entre deux médicaments aux noms similaires", isCorrect: false },
    ],
  },
  {
    text: "Dans le rapport « To Err is Human : building a safer health system » publié aux États-Unis en 2000, il a été estimé que les événements indésirables graves surviennent dans quel pourcentage des hospitalisations ?",
    explanation: "Le rapport « To Err is Human » a estimé que les événements indésirables graves surviennent dans 2,9 à 3,7 % des hospitalisations.",
    options: [
      { text: "0,5 à 1 %", isCorrect: false },
      { text: "2,9 à 3,7 %", isCorrect: true },
      { text: "8 à 10 %", isCorrect: false },
      { text: "15 à 20 %", isCorrect: false },
      { text: "25 à 30 %", isCorrect: false },
    ],
  },
  {
    text: "Concernant la télémédecine, laquelle des affirmations suivantes est FAUSSE ?",
    explanation: "La télémédecine ne se limite pas à la téléconsultation ; elle inclut également la télé-expertise, la téléassistance médicale, la télésurveillance, la télémédecine d'urgence, etc.",
    options: [
      { text: "La télémédecine a été officiellement reconnue et définie en France par la loi du 21 juillet 2009", isCorrect: false },
      { text: "Un décret d'application du 21 octobre 2010 précise que la réalisation des actes de télémédecine requiert le consentement du patient sauf urgence", isCorrect: false },
      { text: "La télémédecine se limite exclusivement à la téléconsultation entre un patient et son médecin traitant", isCorrect: true },
      { text: "La télé-expertise permet à plusieurs médecins de se concerter sur le cas d'un patient", isCorrect: false },
      { text: "La téléassistance médicale permet à un médecin d'assister à distance un autre professionnel pour un acte médical", isCorrect: false },
    ],
  },
  {
    text: "Le taux de mortalité maternelle (TMM) se calcule par le rapport :",
    explanation: "Le taux de mortalité maternelle (TMM) est le rapport des décès de femmes pendant leur grossesse ou dans les 42 jours suivant l'accouchement sur le nombre de naissances vivantes, exprimé pour 100 000 (ou 1000). Le délai de 42 jours est caractéristique.",
    options: [
      { text: "Décès de femmes pendant leur grossesse / Nombre de naissances vivantes × 1000", isCorrect: false },
      { text: "Décès de femmes pendant leur grossesse ou dans les 42 jours suivant l'accouchement / Nombre de naissances vivantes × 1000", isCorrect: true },
      { text: "Décès de femmes pendant leur grossesse / Population féminine en âge de procréer × 1000", isCorrect: false },
      { text: "Décès de femmes pendant l'accouchement / Nombre de naissances totales (vivantes et mort-nés) × 1000", isCorrect: false },
      { text: "Décès de femmes pendant leur grossesse ou dans les 42 jours suivant l'accouchement / Nombre de femmes enceintes × 1000", isCorrect: false },
    ],
  },
  {
    text: "La prévalence et l'incidence sont deux mesures épidémiologiques essentielles. Laquelle des affirmations suivantes est CORRECTE ?",
    explanation: "La prévalence instantanée est le rapport de l'ensemble des cas d'une maladie à un instant donné sur la population moyenne. L'incidence mesure les nouveaux cas.",
    options: [
      { text: "La prévalence mesure le nombre de nouveaux cas d'une maladie survenus pendant une période donnée", isCorrect: false },
      { text: "L'incidence est utile pour la planification des services de soins car elle mesure la charge d'une maladie", isCorrect: false },
      { text: "La prévalence instantanée est le rapport de l'ensemble des cas d'une maladie à un instant donné sur la population moyenne", isCorrect: true },
      { text: "L'incidence est particulièrement utile pour les maladies chroniques car elle reflète leur fardeau dans la population", isCorrect: false },
      { text: "Le taux d'attaque est une mesure de prévalence utilisée en période épidémique", isCorrect: false },
    ],
  },
  {
    text: "Concernant la normalité et la pathologie en médecine, Georges Canguilhem a proposé une approche novatrice. Selon cette approche :",
    explanation: "Selon Canguilhem, le pathologique n'est pas une simple variation quantitative par rapport à la norme statistique. La santé est la capacité à établir de nouvelles normes et à s'adapter face à l'environnement ; le pathologique est une diminution de cette capacité normative.",
    options: [
      { text: "Le normal se définit exclusivement par l'absence de pathologie", isCorrect: false },
      { text: "Le normal est ce qui est conforme à la moyenne statistique d'une population", isCorrect: false },
      { text: "La pathologie est une variation quantitative par rapport à une norme statistique établie", isCorrect: false },
      { text: "La santé est la capacité à établir de nouvelles normes et à s'adapter, le pathologique étant une diminution de cette capacité normative", isCorrect: true },
      { text: "La normalité est définie par les acteurs du système social selon la théorie de la norme sociale", isCorrect: false },
    ],
  },
  {
    text: "Les épidémies de peste en Algérie au XIXe siècle ont eu des conséquences humanitaires majeures. L'épidémie de 1867-1868 est particulièrement marquante car :",
    explanation: "L'épidémie de 1867-1868 fut particulièrement meurtrière car elle était associée à la sécheresse, la famine, le choléra et le typhus, frappant des tribus algériennes affaiblies. Elle a été aggravée par les conditions de misère extrême.",
    options: [
      { text: "Elle fut importée par des pèlerins revenant de la Mecque et toucha principalement la région d'Oran", isCorrect: false },
      { text: "Elle fut associée à la sécheresse, la famine et une épidémie de choléra et de typhus, frappant des tribus déjà affaiblies", isCorrect: true },
      { text: "Elle fut la première épidémie à être endiguée grâce à la vaccination systématique de la population", isCorrect: false },
      { text: "Elle toucha exclusivement la population européenne des villes, épargnant les populations indigènes", isCorrect: false },
      { text: "Elle fut à l'origine de la création du premier lazaret à Cap Matifou", isCorrect: false },
    ],
  },
  {
    text: "La quarantaine comme mesure de lutte contre les épidémies a été institutionnalisée à Venise. Concernant cette mesure, quelle affirmation est CORRECTE ?",
    explanation: "La durée initiale de 40 jours (quarantaine) couvrait l'incubation la plus longue constatée pour la peste.",
    options: [
      { text: "La quarantaine a été instaurée pour la première fois par Moïse pour les lépreux", isCorrect: false },
      { text: "Sa durée initiale de 40 jours couvrait l'incubation la plus longue constatée pour la peste", isCorrect: true },
      { text: "La quarantaine ne s'appliquait qu'aux personnes, jamais aux marchandises", isCorrect: false },
      { text: "Les malades du choléra étaient exemptés de quarantaine car la maladie n'était pas contagieuse", isCorrect: false },
      { text: "La quarantaine a été abolie définitivement après la conférence de Paris de 1926", isCorrect: false },
    ],
  },
  {
    text: "L'épidémie de choléra de 1865 a eu un impact majeur sur le pèlerinage à la Mecque. Parmi les affirmations suivantes, laquelle est EXACTE ?",
    explanation: "L'épidémie de choléra de 1865 a fait environ 200 000 victimes à travers les continents et a poussé les États européens à prendre des mesures urgentes pour protéger le continent.",
    options: [
      { text: "Cette épidémie a provoqué environ 200 000 victimes à travers les continents et a poussé les États européens à prendre des mesures urgentes pour protéger le continent", isCorrect: true },
      { text: "Elle a touché uniquement les pèlerins algériens et tunisiens avec un taux de mortalité de 38 %", isCorrect: false },
      { text: "Le lazaret de Cap Matifou a été inauguré en 1865 pour accueillir les pèlerins de retour", isCorrect: false },
      { text: "Cette épidémie n'a pas eu de répercussions en Europe car les mesures de quarantaine étaient déjà efficaces", isCorrect: false },
      { text: "Le bilan des victimes en Égypte lors de cette épidémie était inférieur à 10 000", isCorrect: false },
    ],
  },
  {
    text: "La transition épidémiologique en Algérie se caractérise actuellement par une charge de plus en plus importante des maladies non-transmissibles (MNT). Selon l'étude TAHINA de 2005, les MNT représentaient quel pourcentage des causes de mortalité ?",
    explanation: "Selon l'étude TAHINA de 2005, les maladies non-transmissibles (MNT) représentaient 58,6 % des causes de mortalité en Algérie, contre 22,7 % pour les maladies transmissibles.",
    options: [
      { text: "22,7 %", isCorrect: false },
      { text: "35,8 %", isCorrect: false },
      { text: "58,6 %", isCorrect: true },
      { text: "72,3 %", isCorrect: false },
      { text: "85,0 %", isCorrect: false },
    ],
  }
];

async function main() {
  console.log("Starting to insert SSH questions...\n");

  let subject = await prisma.subject.findFirst({
    where: {
      name: { equals: SUBJECT_NAME, mode: 'insensitive' },
    },
  });

  if (!subject) {
    console.log(`Subject '${SUBJECT_NAME}' not found. Creating...`);
    const category = await prisma.category.findFirst();
    subject = await prisma.subject.create({
      data: {
        name: SUBJECT_NAME,
        slug: `ssh-${Date.now()}`,
        description: 'Santé, Société et Humanité',
        categoryId: category.id,
      },
    });
    console.log(`Created subject: ${subject.name} (${subject.id})`);
  } else {
    console.log(`Found subject: ${subject.name} (${subject.id})`);
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    console.log(`  Creating question ${i + 1}/${questions.length}...`);

    await prisma.quizQuestion.create({
      data: {
        text: q.text,
        explanation: q.explanation,
        subjectId: subject.id,
        studyYear: STUDY_YEAR,
        difficulty: DIFFICULTY,
        type: 'MULTIPLE_CHOICE',
        isPublished: true,
        options: {
          create: q.options.map((opt, idx) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
            order: idx,
          })),
        },
      },
    });
  }

  console.log(`\n✅ Done! ${questions.length} questions added for ${STUDY_YEAR} / ${SUBJECT_NAME} — published immediately in "اختر مسارك التعليمي".`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
