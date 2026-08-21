const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDY_YEAR = 'السنة الاولى';
const SUBJECT_NAME = 'Histologie';
const DIFFICULTY = 'MEDIUM';

const questions = [
  {
    text: "Concernant l'ossification endochondrale, laquelle des affirmations suivantes est FAUSSE ?",
    explanation: "Les ostéoclastes dérivent de la lignée hématopoïétique monocytaire (fusion de monocytes) et non des cellules mésenchymateuses. Les cellules mésenchymateuses du bourgeon conjonctivo-vasculaire se différencient en ostéoblastes (qui élaborent la matrice osseuse) et en cellules hématopoïétiques.",
    options: [
      { text: "L'ossification endochondrale concerne les os situés en-dessous de la base du crâne, à l'exception des clavicules", isCorrect: false },
      { text: "La virole périostique se forme à partir de l'ossification primaire endomembranaire en périphérie de la diaphyse", isCorrect: false },
      { text: "Les chondrocytes s'hypertrophient et leur chondroplaste s'agrandit, tandis que la matrice cartilagineuse se calcifie", isCorrect: false },
      { text: "Les ostéoclastes dérivent des cellules mésenchymateuses qui pénètrent dans le cartilage via le bourgeon conjonctivo-vasculaire", isCorrect: true },
      { text: "La croissance des os en longueur est assurée par le cartilage de conjugaison métaphysaire", isCorrect: false },
    ],
  },
  {
    text: "Concernant les épithéliums de revêtement, quelle affirmation concernant leur classification est CORRECTE ?",
    explanation: "L'épithélium intestinal est un épithélium simple prismatique (cylindrique) avec un plateau strié (microvillosités) qui augmente la surface d'absorption.",
    options: [
      { text: "L'épithélium pseudostratifié est un épithélium pluristratifié dont les cellules présentent des noyaux à différents niveaux", isCorrect: false },
      { text: "Les épithéliums stratifiés sont classés selon la forme des cellules de la couche basale (germinative)", isCorrect: false },
      { text: "Tous les épithéliums de revêtement sont vascularisés par des capillaires sanguins traversant la lame basale", isCorrect: false },
      { text: "Les stéréocils sont des cils vibratiles longs présents dans les voies respiratoires", isCorrect: false },
      { text: "L'épithélium de l'intestin grêle est un épithélium simple prismatique avec plateau strié (microvillosités) ayant une fonction d'absorption", isCorrect: true },
    ],
  },
  {
    text: "Un patient présente une fragilité osseuse anormale avec des fractures spontanées. L'analyse histologique révèle une matrice osseuse avec une diminution du collagène de type I. Le collagène de type I est majoritairement présent dans :",
    explanation: "Le collagène de type I est le plus abondant dans le corps humain et est présent dans la matrice osseuse, les tendons, les ligaments, le derme et le tissu conjonctif.",
    options: [
      { text: "La lame basale des épithéliums", isCorrect: false },
      { text: "Le tissu cartilagineux", isCorrect: false },
      { text: "La matrice osseuse, les tendons et les ligaments", isCorrect: true },
      { text: "Les fibres de réticuline des organes lymphoïdes", isCorrect: false },
      { text: "Le tissu adipeux blanc", isCorrect: false },
    ],
  },
  {
    text: "Concernant les cellules du tissu osseux, laquelle des affirmations suivantes est EXACTE ?",
    explanation: "Les ostéoblastes sont les seules cellules capables de synthétiser la matrice osseuse calcifiée. Ils sont riches en phosphatase alcaline et en organites de synthèse (REG, Golgi).",
    options: [
      { text: "Les ostéoblastes dérivent de la lignée hématopoïétique monocytaire comme les ostéoclastes", isCorrect: false },
      { text: "Les ostéocytes sont des cellules géantes plurinucléées localisées dans les lacunes de Howship", isCorrect: false },
      { text: "Les ostéoclastes sont activés par la calcitonine et inhibés par la parathormone", isCorrect: false },
      { text: "Les ostéoblastes sont les seules cellules capables de synthétiser la matrice osseuse calcifiée", isCorrect: true },
      { text: "Les cellules bordantes sont des ostéoclastes quiescents en attente d'activation", isCorrect: false },
    ],
  },
  {
    text: "La matrice osseuse est composée de 70 % de matière minérale et de 25 % de matière organique. La partie organique (ostéoïde) contient essentiellement :",
    explanation: "La partie organique de la matrice osseuse (ostéoïde) est composée à 90 % de collagène de type I, associé à des glycoprotéines (ostéocalcine, ostéonectine) et des protéoglycanes.",
    options: [
      { text: "Du collagène de type II et des protéoglycanes", isCorrect: false },
      { text: "Du collagène de type I, des glycoprotéines et des protéoglycanes", isCorrect: true },
      { text: "Des cristaux d'hydroxyapatite et de carbonate de calcium", isCorrect: false },
      { text: "De l'élastine et de la chondroïtine sulfate", isCorrect: false },
      { text: "Du collagène de type III et des fibres de réticuline", isCorrect: false },
    ],
  },
  {
    text: "Un enfant de 10 ans présente un retard de croissance. L'examen radiologique montre une anomalie du cartilage de conjugaison métaphysaire. Ce cartilage est organisé en zones distinctes. La zone où les chondrocytes se disposent en groupes isogéniques axiaux (perpendiculairement à la ligne d'ossification) est appelée :",
    explanation: "La zone de cartilage sérié (ou zone de prolifération) est caractérisée par des chondrocytes disposés en groupes isogéniques axiaux (perpendiculaires à la ligne d'ossification).",
    options: [
      { text: "Zone de réserve (cartilage hyalin banal)", isCorrect: false },
      { text: "Zone de cartilage sérié", isCorrect: true },
      { text: "Zone de cartilage hypertrophique", isCorrect: false },
      { text: "Zone de calcification", isCorrect: false },
      { text: "Ligne d'érosion", isCorrect: false },
    ],
  },
  {
    text: "Concernant les épithéliums glandulaires, le mode d'excrétion mérocrine est caractérisé par :",
    explanation: "Le mode mérocrine (ou eccrine) est caractérisé par l'élimination du produit de sécrétion par exocytose, sans perte de matériel cellulaire (ex : pancréas exocrine, glandes salivaires).",
    options: [
      { text: "La destruction complète de la cellule avec libération du produit de sécrétion (ex : glande sébacée)", isCorrect: false },
      { text: "L'élimination du pôle apical de la cellule avec le produit de sécrétion (ex : glande mammaire)", isCorrect: false },
      { text: "L'élimination du produit de sécrétion par exocytose sans perte de matériel cellulaire (ex : pancréas exocrine)", isCorrect: true },
      { text: "La libération du produit de sécrétion par rupture de la membrane plasmique (ex : glande sudoripare)", isCorrect: false },
      { text: "L'accumulation du produit dans le noyau avant sa libération", isCorrect: false },
    ],
  },
  {
    text: "Les glandes endocrines peuvent être classées selon leur morphologie. Parmi les exemples suivants, laquelle est une glande endocrine vésiculeuse ?",
    explanation: "La thyroïde est une glande endocrine vésiculeuse : ses cellules sont organisées en vésicules (follicules) dont la cavité assure le stockage temporaire des hormones (collaïde).",
    options: [
      { text: "Le pancréas (îlots de Langerhans)", isCorrect: false },
      { text: "La corticosurrénale", isCorrect: false },
      { text: "La thyroïde", isCorrect: true },
      { text: "L'hypophyse antérieure", isCorrect: false },
      { text: "Les cellules de Leydig du testicule", isCorrect: false },
    ],
  },
  {
    text: "Concernant le tissu cartilagineux, lequel des énoncés suivants est CORRECT ?",
    explanation: "Le périchondre est absent au niveau des cartilages articulaires, où le cartilage est directement en contact avec le liquide synovial.",
    options: [
      { text: "Le cartilage est un tissu conjonctif abondamment vascularisé et innervé", isCorrect: false },
      { text: "Le cartilage hyalin contient des fibres de collagène de type I et des fibres élastiques", isCorrect: false },
      { text: "Le périchondre est absent au niveau des cartilages articulaires", isCorrect: true },
      { text: "Les chondrocytes sont responsables de la résorption du tissu cartilagineux", isCorrect: false },
      { text: "Le cartilage élastique contient des fibres de collagène de type II et est dépourvu de périchondre", isCorrect: false },
    ],
  },
  {
    text: "La croissance du cartilage peut se faire par deux mécanismes. La croissance interstitielle est caractérisée par :",
    explanation: "La croissance interstitielle est la division mitotique des chondrocytes à l'intérieur de la matrice cartilagineuse, formant des groupes isogéniques (axiaux ou coronaires).",
    options: [
      { text: "La différenciation de cellules mésenchymateuses du périchondre en chondroblastes", isCorrect: false },
      { text: "La division mitotique des chondrocytes à l'intérieur de la matrice cartilagineuse, formant des groupes isogéniques", isCorrect: true },
      { text: "L'apposition de nouvelles couches de cartilage sous le périchondre", isCorrect: false },
      { text: "La transformation du cartilage en os par les ostéoclastes", isCorrect: false },
      { text: "La migration de chondrocytes depuis la moelle osseuse", isCorrect: false },
    ],
  },
  {
    text: "Concernant le tissu musculaire strié squelettique, le sarcomère est l'unité contractile. La zone H est caractérisée par :",
    explanation: "La zone H (bande H) est la région centrale de la bande A où se trouvent uniquement des filaments épais de myosine (absence de filaments fins d'actine).",
    options: [
      { text: "La présence de filaments fins d'actine uniquement", isCorrect: false },
      { text: "La présence de filaments épais de myosine uniquement", isCorrect: true },
      { text: "La présence des deux types de filaments (actine et myosine)", isCorrect: false },
      { text: "La présence de la strie Z en son centre", isCorrect: false },
      { text: "La présence de titine uniquement", isCorrect: false },
    ],
  },
  {
    text: "La contraction du muscle strié squelettique est déclenchée par la libération de calcium du réticulum sarcoplasmique. Cette libération est provoquée par :",
    explanation: "La dépolarisation du sarcolemme se propage via les tubules T jusqu'au réticulum sarcoplasmique, activant les canaux calciques (récepteurs à la ryanodine) et libérant le Ca²⁺.",
    options: [
      { text: "La fixation de l'acétylcholine sur le sarcolemme", isCorrect: false },
      { text: "La dépolarisation du sarcolemme transmise aux tubules T, activant les canaux calciques voltage-dépendants du réticulum sarcoplasmique", isCorrect: true },
      { text: "L'hydrolyse de l'ATP par la tête de myosine", isCorrect: false },
      { text: "La fixation du calcium sur la troponine C", isCorrect: false },
      { text: "La phosphorylation de la chaîne légère de myosine", isCorrect: false },
    ],
  },
  {
    text: "Les cellules musculaires cardiaques (myocytes) présentent des caractéristiques distinctes des cellules musculaires squelettiques. Parmi les propositions suivantes, laquelle est CORRECTE ?",
    explanation: "Les myocytes cardiaques sont reliés entre eux par des disques intercalaires (traits scalariformes) contenant des jonctions communicantes (GAP) permettant la propagation de l'excitation.",
    options: [
      { text: "Les myocytes cardiaques sont plurinucléés avec des noyaux périphériques", isCorrect: false },
      { text: "La contraction du myocarde est volontaire et contrôlée par le système nerveux central", isCorrect: false },
      { text: "Les myocytes cardiaques sont reliés entre eux par des disques intercalaires contenant des jonctions communicantes (GAP)", isCorrect: true },
      { text: "Le réticulum sarcoplasmique du myocarde forme des triades comme dans le muscle squelettique", isCorrect: false },
      { text: "Le myocarde est dépourvu de tissu nodal et l'automatisme est assuré par le système nerveux autonome", isCorrect: false },
    ],
  },
  {
    text: "Concernant le tissu sanguin, laquelle des affirmations suivantes est INCORRECTE ?",
    explanation: "Les lymphocytes T (et non B) sont responsables de l'immunité à médiation cellulaire (destruction des cellules infectées). Les lymphocytes B sont responsables de l'immunité humorale (production d'anticorps).",
    options: [
      { text: "Les hématies sont des cellules anucléées en forme de disque biconcave, riches en hémoglobine", isCorrect: false },
      { text: "Les granulocytes neutrophiles sont les leucocytes les plus nombreux et sont impliqués dans la phagocytose", isCorrect: false },
      { text: "Les lymphocytes B sont responsables de l'immunité à médiation cellulaire (destruction des cellules infectées)", isCorrect: true },
      { text: "Les monocytes sont les précurseurs des macrophages tissulaires", isCorrect: false },
      { text: "Les plaquettes (thrombocytes) sont des fragments cellulaires anucléés impliqués dans l'hémostase", isCorrect: false },
    ],
  },
  {
    text: "Un patient présente une anémie avec un volume globulaire moyen (VGM) augmenté (macrocytose). Cette anomalie est caractéristique d'une carence en :",
    explanation: "Une macrocytose (VGM augmenté) est caractéristique d'une carence en vitamine B12 ou en acide folique (anémie mégaloblastique). La carence en fer provoque une microcytose.",
    options: [
      { text: "Fer", isCorrect: false },
      { text: "Vitamine B12 ou acide folique", isCorrect: true },
      { text: "Vitamine C", isCorrect: false },
      { text: "Cuivre", isCorrect: false },
      { text: "Vitamine K", isCorrect: false },
    ],
  },
  {
    text: "L'hématopoïèse est le processus de production des cellules sanguines. Chez l'adulte, le siège principal de l'hématopoïèse est :",
    explanation: "Chez l'adulte, l'hématopoïèse se déroule dans la moelle osseuse rouge des os plats (vertèbres, côtes, crâne, bassin, sternum) et des épiphyses des os longs (fémur, tibia).",
    options: [
      { text: "Le foie", isCorrect: false },
      { text: "La rate", isCorrect: false },
      { text: "La moelle osseuse rouge des os plats (vertèbres, côtes, crâne, bassin) et des épiphyses des os longs", isCorrect: true },
      { text: "Les ganglions lymphatiques", isCorrect: false },
      { text: "Le thymus", isCorrect: false },
    ],
  },
  {
    text: "Concernant le tissu conjonctif, laquelle des affirmations suivantes concernant les mastocytes est EXACTE ?",
    explanation: "Les mastocytes contiennent des granulations riches en histamine, héparine, sérotonine et enzymes.",
    options: [
      { text: "Les mastocytes dérivent des lymphocytes B", isCorrect: false },
      { text: "Les granulations des mastocytes contiennent de l'histamine, de l'héparine et de la sérotonine", isCorrect: true },
      { text: "Les mastocytes sont des cellules phagocytaires responsables de l'élimination des débris cellulaires", isCorrect: false },
      { text: "Les mastocytes sont principalement localisés dans le tissu osseux", isCorrect: false },
      { text: "Les mastocytes sont activés par l'IL-2 pour produire des anticorps", isCorrect: false },
    ],
  },
  {
    text: "Les fibres de collagène sont synthétisées en deux étapes (intra- et extracellulaire). La molécule de tropocollagène est formée :",
    explanation: "Le tropocollagène est formé dans la matrice extracellulaire par clivage du procollagène par la procollagène peptidase.",
    options: [
      { text: "Dans le réticulum endoplasmique par polymérisation de trois chaînes de procollagène", isCorrect: false },
      { text: "Dans la matrice extracellulaire par clivage du procollagène par la procollagène peptidase", isCorrect: true },
      { text: "Dans le cytoplasme par polymérisation des acides aminés", isCorrect: false },
      { text: "Dans l'appareil de Golgi par glycosylation du collagène", isCorrect: false },
      { text: "Dans les lysosomes par dégradation du collagène de type III", isCorrect: false },
    ],
  },
  {
    text: "Le tissu conjonctif est classé selon la prédominance de ses constituants. Le tissu conjonctif réticulé (réticulaire) se caractérise par :",
    explanation: "Le tissu conjonctif réticulé (réticulaire) a une charpente de fibres de réticuline (collagène de type III) formant le stroma des organes hématopoïétiques (moelle osseuse) et lymphoïdes (ganglions, rate).",
    options: [
      { text: "Une prédominance de fibres de collagène de type I orientées en faisceaux parallèles", isCorrect: false },
      { text: "Une prédominance de cellules adipeuses univacuolaires", isCorrect: false },
      { text: "Une charpente de fibres de réticuline (collagène de type III) formant le stroma des organes hématopoïétiques et lymphoïdes", isCorrect: true },
      { text: "Une prédominance de substance fondamentale riche en protéoglycanes (ex : gelée de Wharton)", isCorrect: false },
      { text: "Une prédominance de fibres élastiques (ex : ligament jaune)", isCorrect: false },
    ],
  },
  {
    text: "Concernant les adipocytes, laquelle des affirmations suivantes est FAUSSE ?",
    explanation: "Les adipocytes blancs sont localisés à la fois dans le tissu adipeux sous-cutané et viscéral (mésentère, épiploon). Ils ne sont pas exclusivement viscéraux.",
    options: [
      { text: "Les adipocytes blancs (univacuolaires) sont les plus abondants chez l'adulte", isCorrect: false },
      { text: "Les adipocytes bruns (multivacuolaires) sont abondants chez le fœtus et le nouveau-né et participent à la thermogenèse", isCorrect: false },
      { text: "Les adipocytes blancs synthétisent la leptine, une hormone qui régule la satiété", isCorrect: false },
      { text: "Les adipocytes bruns contiennent de nombreuses mitochondries", isCorrect: false },
      { text: "Les adipocytes blancs sont exclusivement localisés dans le tissu adipeux viscéral (mésentère)", isCorrect: true },
    ],
  },
  {
    text: "Une patiente consulte pour une masse palpée au niveau du sein. La biopsie révèle une tumeur maligne. L'analyse histologique montre des cellules tumorales disposées en amas avec une activité mitotique élevée et une invasion du tissu conjonctif environnant. Les cellules tumorales dérivent de :",
    explanation: "Les tumeurs mammaires (carcinomes) dérivent des cellules épithéliales des canaux ou des lobules mammaires.",
    options: [
      { text: "Cellules mésenchymateuses du tissu conjonctif lâche", isCorrect: false },
      { text: "Cellules épithéliales des canaux mammaires", isCorrect: true },
      { text: "Adipocytes du tissu adipeux", isCorrect: false },
      { text: "Fibroblastes du tissu conjonctif dense", isCorrect: false },
      { text: "Mastocytes du tissu conjonctif", isCorrect: false },
    ],
  },
  {
    text: "Les ostéoclastes jouent un rôle majeur dans le remodelage osseux. Sous l'influence de la parathormone, les ostéoclastes synthétisent des enzymes qui participent à la résorption osseuse. Parmi ces enzymes, les hydrolases interviennent dans :",
    explanation: "Les hydrolases dépolymérisent (détruisent) la fraction organique de la matrice osseuse (collagène, protéoglycanes). Les citrates et les lactates interviennent dans la solubilisation de la fraction minérale.",
    options: [
      { text: "La solubilisation de la fraction minérale", isCorrect: false },
      { text: "La dépolymérisation de la fraction organique (collagène, protéoglycanes)", isCorrect: true },
      { text: "La synthèse de la matrice osseuse", isCorrect: false },
      { text: "La minéralisation de l'ostéoïde", isCorrect: false },
      { text: "La fixation du calcium sur l'hydroxyapatite", isCorrect: false },
    ],
  },
  {
    text: "Un patient de 60 ans est diagnostiqué avec une ostéoporose. L'ostéodensitométrie confirme une diminution de la densité minérale osseuse. Le traitement par bisphosphonates vise à :",
    explanation: "Les bisphosphonates sont des inhibiteurs puissants de l'activité des ostéoclastes. Ils se fixent à l'hydroxyapatite de l'os et sont internalisés par les ostéoclastes, réduisant ainsi la résorption osseuse.",
    options: [
      { text: "Stimuler la formation osseuse par les ostéoblastes", isCorrect: false },
      { text: "Inhiber l'activité des ostéoclastes, réduisant la résorption osseuse", isCorrect: true },
      { text: "Augmenter l'absorption intestinale du calcium", isCorrect: false },
      { text: "Stimuler la synthèse de vitamine D par la peau", isCorrect: false },
      { text: "Activer la parathormone pour augmenter la calcémie", isCorrect: false },
    ],
  },
];

async function main() {
  console.log("Starting to insert Histologie questions...\n");

  let subject = await prisma.subject.findFirst({
    where: { name: { equals: SUBJECT_NAME, mode: 'insensitive' } },
  });

  if (!subject) {
    console.log(`Subject '${SUBJECT_NAME}' not found. Creating...`);
    const category = await prisma.category.findFirst();
    subject = await prisma.subject.create({
      data: {
        name: SUBJECT_NAME,
        slug: `histologie-${Date.now()}`,
        description: 'Histologie - Semestre 1/2',
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
