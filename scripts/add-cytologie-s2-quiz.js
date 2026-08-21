const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDY_YEAR = 'السنة الاولى';
const SUBJECT_NAME = 'Cytologie S2';
const DIFFICULTY = 'MEDIUM';

const questions = [
  {
    text: "Le cytosquelette est composé de trois types de filaments protéiques. Parmi les propositions suivantes concernant leurs caractéristiques morphologiques et leur dynamique, laquelle est CORRECTE ?",
    explanation: "Les microtubules ont un diamètre de 25 nm, sont formés de 13 protofilaments de tubuline (dimères α/β) et sont très dynamiques (polymérisation/dépolymérisation). Les microfilaments mesurent 7 nm (actine) et les filaments intermédiaires 8-12 nm.",
    options: [
      { text: "Les microfilaments ont un diamètre de 25 nm, sont formés de dimères de tubuline et sont très dynamiques", isCorrect: false },
      { text: "Les filaments intermédiaires ont un diamètre de 7 nm, sont formés d'actine et sont les plus stables", isCorrect: false },
      { text: "Les microtubules ont un diamètre de 25 nm, sont formés de 13 protofilaments de tubuline et sont dynamiques", isCorrect: true },
      { text: "Les filaments intermédiaires ont un diamètre de 8-12 nm, sont formés d'actine et sont stables", isCorrect: false },
      { text: "Les microtubules ont un diamètre de 7 nm, sont formés de G-actine et sont très dynamiques", isCorrect: false },
    ],
  },
  {
    text: "Le cytosol est le milieu intracellulaire dans lequel baignent les organites. Concernant ses propriétés physicochimiques, laquelle des affirmations suivantes est FAUSSE ?",
    explanation: "Dans le cytosol, la concentration en K⁺ est élevée (environ 140 mM) tandis que la concentration en Na⁺ est faible (environ 10-15 mM). C'est l'inverse du milieu extracellulaire. Les autres affirmations sont correctes.",
    options: [
      { text: "Le pH du cytosol est légèrement basique, variant entre 7,0 et 7,4", isCorrect: false },
      { text: "La viscosité du cytosol est due à la forte concentration de protéines (200-300 mg/mL)", isCorrect: false },
      { text: "La capacité tampon du cytosol est assurée principalement par les protéines et les phosphates", isCorrect: false },
      { text: "La concentration en K⁺ est plus faible que la concentration en Na⁺ dans le cytosol", isCorrect: true },
      { text: "Le cytosol représente environ 54 % du volume cellulaire", isCorrect: false },
    ],
  },
  {
    text: "Les ribosomes sont des organites essentiels à la synthèse protéique. Concernant leur structure chez les eucaryotes, quelle est la composition correcte des sous-unités ribosomiques ?",
    explanation: "Chez les eucaryotes, les ribosomes 80S sont constitués d'une sous-unité 40S contenant l'ARNr 18S et d'une sous-unité 60S contenant les ARNr 28S, 5,8S et 5S. Les procaryotes ont des ribosomes 70S avec les sous-unités 30S (ARNr 16S) et 50S (ARNr 23S et 5S).",
    options: [
      { text: "Sous-unité 30S contenant l'ARNr 16S et sous-unité 50S contenant les ARNr 23S et 5S", isCorrect: false },
      { text: "Sous-unité 40S contenant l'ARNr 18S et sous-unité 60S contenant les ARNr 28S, 5,8S et 5S", isCorrect: true },
      { text: "Sous-unité 40S contenant l'ARNr 16S et sous-unité 60S contenant les ARNr 23S et 5S", isCorrect: false },
      { text: "Sous-unité 30S contenant l'ARNr 18S et sous-unité 50S contenant les ARNr 28S et 5,8S", isCorrect: false },
      { text: "Sous-unité 60S contenant l'ARNr 18S et sous-unité 40S contenant les ARNr 28S et 5S", isCorrect: false },
    ],
  },
  {
    text: "Les peroxysomes sont des organites impliqués dans le métabolisme oxydatif. Concernant leurs caractéristiques, laquelle des affirmations suivantes est FAUSSE ?",
    explanation: "Les peroxysomes ne se forment pas par fission à partir de mitochondries. Ils se forment à partir de précurseurs et de protéines issues du réticulum endoplasmique (biogenèse) et peuvent se diviser par fission selon les besoins cellulaires.",
    options: [
      { text: "Ils sont entourés d'une membrane lipidique simple", isCorrect: false },
      { text: "Ils contiennent la catalase pour décomposer le peroxyde d'hydrogène en eau et oxygène", isCorrect: false },
      { text: "Ils sont impliqués dans la β-oxydation des acides gras", isCorrect: false },
      { text: "Ils sont formés par fission à partir de mitochondries préexistantes", isCorrect: true },
      { text: "Le syndrome de Zellweger est une pathologie liée à un défaut des peroxysomes", isCorrect: false },
    ],
  },
  {
    text: "La mitochondrie est un organite semi-autonome. Concernant sa structure et ses fonctions, laquelle des propositions est EXACTE ?",
    explanation: "La matrice mitochondriale contient l'ADN mitochondrial, des ribosomes 70S (similaires à ceux des procaryotes) et les enzymes du cycle de Krebs. La membrane interne (et non externe) contient les complexes de la chaîne respiratoire. La β-oxydation a lieu dans la matrice.",
    options: [
      { text: "La membrane externe contient les complexes de la chaîne respiratoire et l'ATP synthase", isCorrect: false },
      { text: "La matrice contient l'ADN mitochondrial, des ribosomes 70S et les enzymes du cycle de Krebs", isCorrect: true },
      { text: "Les crêtes mitochondriales augmentent la surface de la membrane externe", isCorrect: false },
      { text: "La β-oxydation des acides gras a lieu dans l'espace intermembranaire", isCorrect: false },
      { text: "La mitochondrie est exclusivement dépendante de l'ADN nucléaire pour toutes ses protéines", isCorrect: false },
    ],
  },
  {
    text: "Les microfilaments d'actine sont impliqués dans plusieurs processus cellulaires. La phalloïdine est une drogue qui :",
    explanation: "La phalloïdine stabilise les filaments d'actine (F-actine) et est utilisée en imagerie par fluorescence pour marquer les microfilaments. La cytochalasine inhibe la polymérisation, la latrunculine dépolarise l'actine.",
    options: [
      { text: "Inhibe la polymérisation de l'actine, bloquant la motilité cellulaire", isCorrect: false },
      { text: "Stabilise les filaments d'actine et est utilisée en imagerie par fluorescence", isCorrect: true },
      { text: "Dépolarise les microtubules et est utilisée en chimiothérapie", isCorrect: false },
      { text: "Inhibe la polymérisation des microtubules, traitant la goutte", isCorrect: false },
      { text: "Se lie aux filaments intermédiaires, stabilisant les kératines", isCorrect: false },
    ],
  },
  {
    text: "La culture cellulaire est une technique fondamentale en biologie. Concernant les lignées cellulaires, laquelle des affirmations suivantes est CORRECTE ?",
    explanation: "Les cellules HeLa sont un exemple célèbre de lignée cellulaire immortelle issue de cellules cancéreuses (Henrietta Lacks). Les cellules en culture primaire ont un nombre limité de divisions (limite de Hayflick). Les lignées cellulaires sont immortelles, pas normales.",
    options: [
      { text: "Les cellules en culture primaire peuvent se diviser indéfiniment", isCorrect: false },
      { text: "Les lignées cellulaires sont des cellules normales qui ont perdu leur capacité de division", isCorrect: false },
      { text: "Les cellules HeLa sont un exemple de lignée cellulaire immortelle issue de cellules cancéreuses", isCorrect: true },
      { text: "La limite de Hayflick décrit la capacité des cellules cancéreuses à se diviser sans limite", isCorrect: false },
      { text: "Les cellules en culture primaire sont toujours immortelles après la 50ème division", isCorrect: false },
    ],
  },
  {
    text: "Les filaments intermédiaires sont classés en différentes familles selon leur composition protéique. La desmine est spécifiquement présente dans :",
    explanation: "La desmine est spécifique des cellules musculaires (lisses, striées et cardiaques). Les kératines sont dans les cellules épithéliales, les neurofilaments dans les neurones, les lamines dans l'enveloppe nucléaire et la vimentine dans le mésenchyme.",
    options: [
      { text: "Les cellules épithéliales", isCorrect: false },
      { text: "Les cellules musculaires (lisses, striées et cardiaques)", isCorrect: true },
      { text: "Les neurones", isCorrect: false },
      { text: "L'enveloppe nucléaire", isCorrect: false },
      { text: "Les cellules mésenchymateuses", isCorrect: false },
    ],
  },
  {
    text: "Le système endomembranaire assure le flux membranaire entre les différents compartiments. Concernant ce flux, lequel des énoncés suivants est INCORRECT ?",
    explanation: "Les vésicules de sécrétion quittent l'appareil de Golgi par la face trans (et non cis). La face cis reçoit les vésicules du RE. Toutes les autres propositions sont correctes.",
    options: [
      { text: "Le transport du RE vers l'appareil de Golgi se fait via des vésicules COPII", isCorrect: false },
      { text: "Le transport rétrograde de l'appareil de Golgi vers le RE est assuré par des vésicules COPI", isCorrect: false },
      { text: "Les vésicules de sécrétion quittent l'appareil de Golgi par la face cis", isCorrect: true },
      { text: "La membrane nucléaire est en continuité avec le réticulum endoplasmique", isCorrect: false },
      { text: "Les endosomes assurent le tri des molécules internalisées par endocytose", isCorrect: false },
    ],
  },
  {
    text: "Un patient présente une mutation dans le gène codant pour la dystrophine, une protéine associée à l'actine dans les cellules musculaires. Quelle pathologie est la plus probablement associée à ce dysfonctionnement ?",
    explanation: "La dystrophie musculaire est due à des mutations dans la dystrophine, une protéine associée à l'actine. La maladie d'Alzheimer est liée à la protéine tau (microtubules), l'épidermolyse bulleuse aux kératines, la cardiomyopathie dilatée à la desmine et la progéria aux lamines.",
    options: [
      { text: "Maladie d'Alzheimer", isCorrect: false },
      { text: "Dystrophie musculaire", isCorrect: true },
      { text: "Épidermolyse bulleuse simplex", isCorrect: false },
      { text: "Cardiomyopathie dilatée", isCorrect: false },
      { text: "Progéria", isCorrect: false },
    ],
  },
  {
    text: "Les microtubules sont organisés à partir d'un centre organisateur (MTOC). La colchicine est une drogue qui :",
    explanation: "La colchicine inhibe la polymérisation des microtubules et est utilisée dans le traitement de la goutte (réduit l'inflammation en inhibant la migration des neutrophiles). Le taxol stabilise les microtubules (chimiothérapie).",
    options: [
      { text: "Stabilise les microtubules, inhibant la division cellulaire", isCorrect: false },
      { text: "Inhibe la polymérisation des microtubules, traitant la goutte", isCorrect: true },
      { text: "Dépolarise les microfilaments, inhibant la migration cellulaire", isCorrect: false },
      { text: "Stabilise les filaments intermédiaires, traitant les maladies de la peau", isCorrect: false },
      { text: "Active la polymérisation des microtubules, favorisant la mitose", isCorrect: false },
    ],
  },
  {
    text: "La dystrophie musculaire est une pathologie liée au dysfonctionnement des microfilaments. Le mécanisme principal de cette pathologie est :",
    explanation: "La dystrophie musculaire est due à une mutation dans la dystrophine, une protéine associée à l'actine, entraînant une faiblesse musculaire progressive. Les autres pathologies correspondent à d'autres composants du cytosquelette.",
    options: [
      { text: "Une agrégation de la protéine tau perturbant les microtubules", isCorrect: false },
      { text: "Une mutation dans la dystrophine, protéine associée à l'actine, entraînant une faiblesse musculaire", isCorrect: true },
      { text: "Une mutation dans la desmine provoquant une faiblesse cardiaque", isCorrect: false },
      { text: "Une mutation dans les kératines entraînant une fragilité cutanée", isCorrect: false },
      { text: "Un dysfonctionnement des cils dû à des anomalies des microtubules", isCorrect: false },
    ],
  },
  {
    text: "Concernant les mitochondries et leur rôle dans l'apoptose, lequel des événements suivants se produit lors de l'apoptose mitochondriale ?",
    explanation: "Lors de l'apoptose mitochondriale, le cytochrome c est libéré de l'espace intermembranaire dans le cytosol, formant l'apoptosome avec Apaf-1, qui active les caspases initiatrices (caspase-9) puis les caspases effectrices.",
    options: [
      { text: "La membrane externe se rompt libérant des enzymes lysosomiales", isCorrect: false },
      { text: "Le cytochrome c est libéré dans le cytosol, activant les caspases via l'apoptosome", isCorrect: true },
      { text: "Les mitochondries fusionnent pour augmenter la production d'ATP", isCorrect: false },
      { text: "La matrice se vide de son ADN mitochondrial", isCorrect: false },
      { text: "Les crêtes mitochondriales se désorganisent pour stopper la respiration", isCorrect: false },
    ],
  },
  {
    text: "Les lysosomes sont des organites du système endomembranaire. Concernant leurs caractéristiques, laquelle est CORRECTE ?",
    explanation: "Les lysosomes contiennent des enzymes hydrolytiques (lipases, protéases, glycosidases) pour dégrader les macromolécules. Leur pH est acide (environ 5). Ils sont entourés d'une membrane simple et sont abondants dans les macrophages/neutrophiles pour la digestion des pathogènes.",
    options: [
      { text: "Ils ont un pH neutre (environ 7,4) pour optimiser l'activité des enzymes hydrolytiques", isCorrect: false },
      { text: "Ils contiennent des enzymes comme les lipases et les protéases pour la dégradation des macromolécules", isCorrect: true },
      { text: "Ils sont entourés d'une double membrane lipidique", isCorrect: false },
      { text: "Ils sont abondants dans les hépatocytes pour la synthèse des lipides", isCorrect: false },
      { text: "Leur formation se fait directement à partir du réticulum endoplasmique lisse", isCorrect: false },
    ],
  },
  {
    text: "La maladie de Tay-Sachs est une pathologie lysosomale. Elle est due à :",
    explanation: "La maladie de Tay-Sachs est une sphingolipidose due à une accumulation de ganglioside GM2 (glycosphingolipide) dans les lysosomes, causée par un déficit en hexosaminidase A. Les autres options correspondent à d'autres pathologies (Zellweger, progéria, ciliopathies, glycogénose).",
    options: [
      { text: "Une accumulation de glycosphingolipides dans les lysosomes", isCorrect: true },
      { text: "Un défaut de la β-oxydation des acides gras dans les peroxysomes", isCorrect: false },
      { text: "Une mutation dans les lamines causant un vieillissement prématuré", isCorrect: false },
      { text: "Un dysfonctionnement des cils dû à des anomalies des microtubules", isCorrect: false },
      { text: "Une accumulation de glycogène dans le cytosol", isCorrect: false },
    ],
  },
  {
    text: "L'appareil de Golgi est une structure polaire. Concernant ses faces et leurs fonctions, laquelle des propositions est CORRECTE ?",
    explanation: "La face cis de l'appareil de Golgi reçoit les vésicules de transport (COPII) en provenance du réticulum endoplasmique. La face trans est proche de la membrane plasmique et est impliquée dans le tri et la sécrétion. Les deux faces sont biochimiquement distinctes.",
    options: [
      { text: "La face cis reçoit les vésicules de sécrétion en provenance des lysosomes", isCorrect: false },
      { text: "La face trans est proche du réticulum endoplasmique et reçoit les vésicules de transition", isCorrect: false },
      { text: "La face cis reçoit les vésicules de transport (COPII) en provenance du RE", isCorrect: true },
      { text: "La face trans est impliquée dans la N-glycosylation initiale des protéines", isCorrect: false },
      { text: "Les deux faces sont biochimiquement identiques", isCorrect: false },
    ],
  },
  {
    text: "Les microtubules sont impliqués dans le mouvement des cils et flagelles. La structure de l'axonème est organisée selon le motif :",
    explanation: "L'axonème des cils et flagelles présente une structure en 9+2 : neuf doublets de microtubules périphériques entourant deux microtubules centraux. Les centrioles ont une structure en 9 triplets. Les microtubules cytoplasmiques ont 13 protofilaments.",
    options: [
      { text: "9+0 (neuf doublets périphériques sans microtubules centraux)", isCorrect: false },
      { text: "9+2 (neuf doublets périphériques entourant deux microtubules centraux)", isCorrect: true },
      { text: "13 protofilaments disposés en couronne", isCorrect: false },
      { text: "9 triplets de microtubules", isCorrect: false },
      { text: "9+1 (neuf doublets périphériques entourant un microtubule central)", isCorrect: false },
    ],
  },
  {
    text: "Les endosomes sont des compartiments intermédiaires du système endomembranaire. Leur fonction principale est :",
    explanation: "Les endosomes sont des compartiments de tri pour les molécules internalisées par endocytose. Ils dirigent les molécules vers les lysosomes (pour dégradation) ou vers la membrane plasmique (pour recyclage). Les autres fonctions correspondent à d'autres organites.",
    options: [
      { text: "La synthèse des protéines membranaires", isCorrect: false },
      { text: "La dégradation des macromolécules par des enzymes hydrolytiques", isCorrect: false },
      { text: "Le tri des molécules internalisées par endocytose vers les lysosomes ou le recyclage vers la membrane plasmique", isCorrect: true },
      { text: "La synthèse des lipides membranaires", isCorrect: false },
      { text: "La modification post-traductionnelle des protéines (glycosylation)", isCorrect: false },
    ],
  },
  {
    text: "La mitophagie est un processus cellulaire qui permet :",
    explanation: "La mitophagie est un processus d'autophagie sélective qui permet l'élimination des mitochondries endommagées pour maintenir la qualité des organites. La biogenèse correspond à la formation de nouvelles mitochondries, la fission à la division et la fusion à la combinaison.",
    options: [
      { text: "La formation de nouvelles mitochondries à partir de précurseurs", isCorrect: false },
      { text: "La division des mitochondries pour augmenter leur nombre", isCorrect: false },
      { text: "La fusion des mitochondries pour maintenir leur intégrité", isCorrect: false },
      { text: "L'élimination des mitochondries endommagées par autophagie", isCorrect: true },
      { text: "Le transfert d'ADN mitochondrial entre cellules", isCorrect: false },
    ],
  },
  {
    text: "Un laboratoire de culture cellulaire reçoit deux flacons de cellules. Le flacon A montre des cellules arrondies, flottantes, avec des débris visibles. Le flacon B montre des cellules bien adhérentes, confluentes à 90 %, sans changement de couleur du milieu. Quelle est l'interprétation correcte ?",
    explanation: "Le flacon A montre des cellules arrondies, flottantes avec des débris, ce qui est un signe de contamination ou de mort cellulaire (apoptose/détachement). Le flacon B montre une culture saine avec des cellules adhérentes et confluentes (90 % est acceptable, il faut généralement repiquer à 70-90 %).",
    options: [
      { text: "Le flacon A montre une culture saine avec des cellules en suspension", isCorrect: false },
      { text: "Le flacon A montre des signes de contamination ou de mort cellulaire (apoptose/détachement)", isCorrect: true },
      { text: "Le flacon B montre des signes de contamination car les cellules adhérentes sont confluentes", isCorrect: false },
      { text: "Les deux flacons montrent des cultures saines", isCorrect: false },
      { text: "Le flacon B doit être jeté car la confluence à 90 % est trop élevée", isCorrect: false },
    ],
  },
];

async function main() {
  console.log("Starting to insert Cytologie S2 questions...\n");

  let subject = await prisma.subject.findFirst({
    where: { name: { equals: SUBJECT_NAME, mode: 'insensitive' } },
  });

  if (!subject) {
    console.log(`Subject '${SUBJECT_NAME}' not found. Creating...`);
    const category = await prisma.category.findFirst();
    subject = await prisma.subject.create({
      data: {
        name: SUBJECT_NAME,
        slug: `cytologie-s2-${Date.now()}`,
        description: 'Cytologie - Semestre 2',
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
  .catch((e) => { console.error('Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
