const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDY_YEAR = 'السنة الاولى';
const SUBJECT_SLUG = 'embryologie';
const SUBJECT_NAME = 'EMBRYOLOGIE';
const DIFFICULTY = 'MEDIUM';
const EXAM_TITLE = 'QCM Embryologie - 1ère année';
const EXAM_DESCRIPTION = "Examen QCM sur l'embryologie humaine : spermatogenèse, ovogenèse, fécondation, segmentation, nidation, gastrulation et placenta.";

const questions = [
  {
    text: "Un homme présente une azoospermie sécrétoire. Parmi les causes suivantes, laquelle est la plus susceptible d'expliquer cette condition ?",
    explanation: "La cryptorchidie (testicule non descendu) expose les testicules à la température corporelle, ce qui altère la spermatogenèse et peut conduire à une azoospermie sécrétoire (défaut de production). L'azoospermie excrétoire correspond à une obstruction (A). Les autres causes affectent la qualité du sperme ou la fécondation mais ne sont pas des azoospermies sécrétoires primitives.",
    options: [
      { text: "Une obstruction des voies excrétrices (canaux déférents)", isCorrect: false },
      { text: "Une cryptorchidie bilatérale non corrigée", isCorrect: true },
      { text: "Une infection des glandes annexes (prostate, vésicules séminales)", isCorrect: false },
      { text: "Un trouble de l'éjaculation", isCorrect: false },
      { text: "Une altération de la glaire cervicale chez sa partenaire", isCorrect: false },
    ],
  },
  {
    text: "Concernant la spermatogenèse, quel est l'ordre chronologique correct des cellules germinales mâles depuis la puberté jusqu'à la formation du spermatozoïde ?",
    explanation: "L'ordre correct est : Spermatogonie Ad (poussiéreuse sombre, cellule-souche) → Spermatogonie Ap (poussiéreuse pâle) → Spermatogonie B (croutelleuse) → Spermatocyte I → Spermatocyte II → Spermatide → Spermatozoïde.",
    options: [
      { text: "Spermatogonie Ad → Spermatogonie Ap → Spermatogonie B → Spermatocyte I → Spermatocyte II → Spermatide → Spermatozoïde", isCorrect: true },
      { text: "Spermatogonie B → Spermatogonie Ad → Spermatocyte I → Spermatocyte II → Spermatide → Spermatozoïde", isCorrect: false },
      { text: "Spermatogonie Ad → Spermatogonie B → Spermatogonie Ap → Spermatocyte I → Spermatide → Spermatocyte II → Spermatozoïde", isCorrect: false },
      { text: "Spermatocyte I → Spermatogonie Ad → Spermatogonie Ap → Spermatogonie B → Spermatocyte II → Spermatide → Spermatozoïde", isCorrect: false },
      { text: "Spermatogonie Ad → Spermatogonie Ap → Spermatocyte I → Spermatogonie B → Spermatocyte II → Spermatide → Spermatozoïde", isCorrect: false },
    ],
  },
  {
    text: "La spermiogenèse est la phase de différenciation des spermatides en spermatozoïdes. Parmi les événements suivants, lequel ne fait PAS partie de la spermiogenèse ?",
    explanation: "La réduction du nombre de chromosomes de 2n à n se produit pendant la méiose (phase de maturation), et non pendant la spermiogenèse. La spermiogenèse transforme les spermatides en spermatozoïdes sans division cellulaire.",
    options: [
      { text: "Condensation du noyau avec remplacement des histones par des protamines", isCorrect: false },
      { text: "Formation de l'acrosome par fusion des vésicules golgiennes", isCorrect: false },
      { text: "Réduction du nombre de chromosomes de 2n à n par méiose", isCorrect: true },
      { text: "Élongation du flagelle à partir du centriole distal", isCorrect: false },
      { text: "Formation du manchon mitochondrial en hélice autour du flagelle", isCorrect: false },
    ],
  },
  {
    text: "Le spermatozoïde mature comporte trois parties. La pièce intermédiaire est caractérisée par :",
    explanation: "La pièce intermédiaire contient des mitochondries disposées en hélice (manchon mitochondrial) et le centriole proximal. L'acrosome et le noyau sont dans la tête (A). L'axonème est dans le flagelle (C). Les enzymes hydrolytiques sont dans l'acrosome (D).",
    options: [
      { text: "La présence du noyau condensé et de l'acrosome", isCorrect: false },
      { text: "La présence de mitochondries disposées en hélice et du centriole proximal", isCorrect: true },
      { text: "La présence de l'axonème formé de microtubules", isCorrect: false },
      { text: "La présence de l'acrosome contenant des enzymes hydrolytiques", isCorrect: false },
      { text: "La présence de la membrane plasmique et de l'enveloppe nucléaire", isCorrect: false },
    ],
  },
  {
    text: "Concernant l'ovogenèse, quelle affirmation est CORRECTE ?",
    explanation: "L'ovocyte I est formé pendant la vie fœtale et reste bloqué en prophase I jusqu'à l'ovulation. L'ovogenèse débute pendant la vie fœtale (A). Les ovogonies se multiplient par mitose (B). L'ovocyte II est expulsé lors de l'ovulation et bloqué en métaphase II (D). La première division de méiose donne un ovocyte II et un globule polaire de taille inégale (E).",
    options: [
      { text: "L'ovogenèse débute à la puberté et se poursuit jusqu'à la ménopause", isCorrect: false },
      { text: "Les ovogonies se multiplient par méiose pendant la vie fœtale", isCorrect: false },
      { text: "Un ovocyte I est bloqué en prophase I depuis la vie fœtale jusqu'à l'ovulation", isCorrect: true },
      { text: "L'ovocyte II est expulsé lors de l'ovulation et est bloqué en prophase II", isCorrect: false },
      { text: "La première division de méiose de l'ovocyte I donne deux cellules haploïdes de taille égale", isCorrect: false },
    ],
  },
  {
    text: "Une femme de 32 ans consulte pour infertilité. L'exploration révèle une absence d'ovulation. Parmi les mécanismes suivants, lequel pourrait expliquer cette anovulation ?",
    explanation: "Un déficit en FSH empêche la sélection et la croissance du follicule dominant, provoquant une anovulation. Les autres options (A,C,D,E) concernent des causes d'infertilité mais pas l'anovulation.",
    options: [
      { text: "Absence de glaire cervicale alcaline au moment de l'ovulation", isCorrect: false },
      { text: "Déficit en FSH empêchant la sélection du follicule dominant", isCorrect: true },
      { text: "Absence de réaction acrosomique des spermatozoïdes", isCorrect: false },
      { text: "Présence d'anticorps anti-spermatozoïdes", isCorrect: false },
      { text: "Obstruction des trompes de Fallope", isCorrect: false },
    ],
  },
  {
    text: "La fécondation a lieu au niveau du tiers externe de la trompe de Fallope. Parmi les étapes suivantes de la fécondation, laquelle se produit en premier après la pénétration du spermatozoïde ?",
    explanation: "La réaction corticale (blocage de la polyspermie) se produit immédiatement après la pénétration du spermatozoïde. La reprise de la méiose II (C) et l'amphimixie (A) suivent. L'activation du métabolisme (E) est une conséquence globale.",
    options: [
      { text: "La fusion des pronucléus (amphimixie)", isCorrect: false },
      { text: "La réaction corticale bloquant la polyspermie", isCorrect: true },
      { text: "La reprise de la deuxième division méiotique de l'ovocyte II", isCorrect: false },
      { text: "La formation du zygote diploïde", isCorrect: false },
      { text: "L'activation du métabolisme de l'œuf", isCorrect: false },
    ],
  },
  {
    text: "Un couple consulte pour infertilité. Le spermogramme du mari montre une oligo-asthéno-tératospermie. Quelle est la signification de ce terme ?",
    explanation: "Oligo-asthéno-tératospermie signifie : oligo = diminution du nombre, asthéno = diminution de la mobilité, tératos = anomalies morphologiques. L'azoospermie est l'absence de spermatozoïdes (A).",
    options: [
      { text: "Absence de spermatozoïdes dans le sperme", isCorrect: false },
      { text: "Diminution du nombre, de la mobilité et de la morphologie normale des spermatozoïdes", isCorrect: true },
      { text: "Présence d'anticorps anti-spermatozoïdes dans le sperme", isCorrect: false },
      { text: "Obstruction des voies génitales masculines", isCorrect: false },
      { text: "Augmentation du nombre de spermatozoïdes avec anomalie de la mobilité", isCorrect: false },
    ],
  },
  {
    text: "La capacitation des spermatozoïdes est une étape indispensable à la fécondation. Cette capacitation se produit :",
    explanation: "La capacitation se produit dans les voies génitales féminines (glaire cervicale, utérus, trompes). Elle débarrasse la membrane acrosomiale de son revêtement glycoprotéique. La maturation épididymaire est une étape antérieure (A).",
    options: [
      { text: "Dans l'épididyme pendant la maturation des spermatozoïdes", isCorrect: false },
      { text: "Dans la prostate sous l'effet du liquide prostatique", isCorrect: false },
      { text: "Dans les voies génitales féminines, au contact de la glaire cervicale et des sécrétions utérines et tubaires", isCorrect: true },
      { text: "Dans les tubes séminifères au moment de la spermiogenèse", isCorrect: false },
      { text: "Dans les vésicules séminales pendant le mélange des sécrétions", isCorrect: false },
    ],
  },
  {
    text: "La réaction acrosomique est déclenchée par :",
    explanation: "La réaction acrosomique est déclenchée par les substances émises par les cellules de la corona radiata et par l'ovule, après capacitation complète. La fusion des membranes (A) est une étape ultérieure.",
    options: [
      { text: "La fusion des membranes plasmiques du spermatozoïde et de l'ovocyte", isCorrect: false },
      { text: "Les substances émises par les cellules de la corona radiata et par l'ovule", isCorrect: true },
      { text: "Le contact du spermatozoïde avec la glaire cervicale", isCorrect: false },
      { text: "L'hydrolyse de l'ATP par les mitochondries de la pièce intermédiaire", isCorrect: false },
      { text: "La diminution du pH vaginal lors du rapport sexuel", isCorrect: false },
    ],
  },
  {
    text: "La première semaine du développement embryonnaire est marquée par la segmentation. Concernant cette segmentation chez l'humain, laquelle des affirmations suivantes est FAUSSE ?",
    explanation: "La segmentation chez l'humain est asynchrone : les divisions ne sont pas parfaitement synchrones (un blastomère peut se diviser avant l'autre). Elle est totale et inégale.",
    options: [
      { text: "La segmentation est totale", isCorrect: false },
      { text: "La segmentation est inégale (les blastomères sont de taille différente)", isCorrect: false },
      { text: "La segmentation est synchrone (tous les blastomères se divisent en même temps)", isCorrect: true },
      { text: "La zone pellucide entoure l'embryon jusqu'au stade morula", isCorrect: false },
      { text: "La morula se forme au 4ème jour du développement embryonnaire", isCorrect: false },
    ],
  },
  {
    text: "Au 5ème jour du développement, le blastocyste est formé. Sa structure comprend :",
    explanation: "Le bouton embryonnaire (macromères) donne l'embryon et certaines annexes (amnios, lécithocèle). Le trophoblaste donne le placenta, pas le système nerveux (B). Le blastocèle est une cavité liquidienne (C). La zone pellucide est perdue lors de l'éclosion (D). C'est le syncytiotrophoblaste qui érode l'endomètre (E).",
    options: [
      { text: "Le bouton embryonnaire (macromères) qui donnera l'embryon et certaines annexes", isCorrect: true },
      { text: "Le trophoblaste (micromères) qui donnera exclusivement le système nerveux", isCorrect: false },
      { text: "Le blastocèle qui contient des cellules souches totipotentes", isCorrect: false },
      { text: "La zone pellucide qui protège le blastocyste lors de l'éclosion", isCorrect: false },
      { text: "Le cytotrophoblaste qui est responsable de l'érosion de l'endomètre", isCorrect: false },
    ],
  },
  {
    text: "Une patiente présente une grossesse extra-utérine (GEU) tubaire. L'anomalie est survenue lors de :",
    explanation: "La GEU est due à un arrêt de la migration du blastocyste dans la trompe (le plus souvent l'ampoule) où il s'implante. La fécondation a lieu normalement dans la trompe (A).",
    options: [
      { text: "La fécondation qui a eu lieu dans le vagin", isCorrect: false },
      { text: "La segmentation qui s'est déroulée trop rapidement", isCorrect: false },
      { text: "La migration du blastocyste qui s'est arrêté dans l'ampoule de la trompe", isCorrect: true },
      { text: "La nidation qui a eu lieu dans le péritoine", isCorrect: false },
      { text: "L'ovulation qui s'est produite dans la trompe controlatérale", isCorrect: false },
    ],
  },
  {
    text: "La deuxième semaine du développement embryonnaire est caractérisée par la nidation. Concernant cette période, quelle affirmation est CORRECTE ?",
    explanation: "La membrane de Heuser est formée de cellules mésenchymateuses issues du cytotrophoblaste. Le syncytiotrophoblaste est externe (A). Les lacunes apparaissent au 9ème jour (B). Le germe est didermique (ectophylle et entophylle) en 2ème semaine (C). Le lécithocèle primaire disparaît (E).",
    options: [
      { text: "Le syncytiotrophoblaste se différencie en une couche cellulaire interne", isCorrect: false },
      { text: "Les lacunes syncytiales apparaissent au 13ème jour", isCorrect: false },
      { text: "Le bouton embryonnaire se différencie en un germe tridermique (ectoblaste, mésoblaste, endoblaste)", isCorrect: false },
      { text: "La membrane de Heuser est formée de cellules mésenchymateuses issues du cytotrophoblaste", isCorrect: true },
      { text: "Le lecithocèle primaire est la cavité définitive qui persiste jusqu'à la fin de la grossesse", isCorrect: false },
    ],
  },
  {
    text: "La nidation a pour conséquence la réaction déciduale. Parmi les trois zones de la caduque, laquelle est située entre l'œuf et la cavité utérine ?",
    explanation: "La caduque ovulaire (ou réfléchie) est située entre l'œuf et la cavité utérine. La caduque basilaire (A) est entre l'œuf et la paroi utérine. La caduque pariétale (C) est le reste de l'endomètre.",
    options: [
      { text: "La caduque basilaire", isCorrect: false },
      { text: "La caduque ovulaire ou réfléchie", isCorrect: true },
      { text: "La caduque pariétale", isCorrect: false },
      { text: "La caduque fonctionnelle", isCorrect: false },
      { text: "La caduque spongieuse", isCorrect: false },
    ],
  },
  {
    text: "L'hormone chorionique gonadotrophine (HCG) est sécrétée par le trophoblaste. Quelle est sa principale fonction ?",
    explanation: "L'HCG maintient le corps jaune gestatif en vie (et donc la sécrétion de progestérone) pendant les premières semaines de grossesse. La croissance folliculaire est stimulée par la FSH (A). La prolactine initie la lactation (C).",
    options: [
      { text: "Stimuler la croissance folliculaire ovarienne", isCorrect: false },
      { text: "Maintenir le corps jaune gestatif en vie", isCorrect: true },
      { text: "Initier la lactation chez la mère", isCorrect: false },
      { text: "Induire la neurulation chez l'embryon", isCorrect: false },
      { text: "Provoquer l'ovulation au 14ème jour du cycle", isCorrect: false },
    ],
  },
  {
    text: "La troisième semaine du développement embryonnaire est marquée par la gastrulation. Le nœud de Hensen et la ligne primitive permettent :",
    explanation: "La ligne primitive et le nœud de Hensen permettent l'invagination des cellules ectoblastiques qui migrent entre l'ectoblaste et l'endoblaste pour former le mésoblaste intra-embryonnaire (gastrulation). La cavité amniotique se forme en 2ème semaine (A), le tube neural en 4ème semaine (C).",
    options: [
      { text: "La formation de la cavité amniotique", isCorrect: false },
      { text: "La mise en place du mésoblaste intra-embryonnaire par invagination des cellules de l'ectoblaste", isCorrect: true },
      { text: "La formation du tube neural", isCorrect: false },
      { text: "La mise en place du placenta définitif", isCorrect: false },
      { text: "La formation de l'allantoïde", isCorrect: false },
    ],
  },
  {
    text: "La chorde dorsale se forme à partir du matériel chordal. Quel est l'ordre correct des stades de formation de la chorde ?",
    explanation: "L'ordre correct est : Canal chordal (18ème jour) → Canal chordal fissuré (19ème jour) → Gouttière chordale renversée (20ème jour) → Plaque chordale (21ème jour) → Chorde dorsale (22ème jour).",
    options: [
      { text: "Canal chordal → Gouttière chordale renversée → Plaque chordale → Chorde dorsale → Canal chordal fissuré", isCorrect: false },
      { text: "Canal chordal → Canal chordal fissuré → Gouttière chordale renversée → Plaque chordale → Chorde dorsale", isCorrect: true },
      { text: "Gouttière chordale renversée → Canal chordal → Canal chordal fissuré → Plaque chordale → Chorde dorsale", isCorrect: false },
      { text: "Plaque chordale → Canal chordal → Canal chordal fissuré → Gouttière chordale renversée → Chorde dorsale", isCorrect: false },
      { text: "Canal chordal → Plaque chordale → Canal chordal fissuré → Gouttière chordale renversée → Chorde dorsale", isCorrect: false },
    ],
  },
  {
    text: "La quatrième semaine du développement embryonnaire est une période critique pour la tératogenèse. Parmi les événements suivants, lequel ne se produit PAS au cours de la quatrième semaine ?",
    explanation: "Les bourgeons des membres inférieurs apparaissent vers le 28ème jour (fin de la 4ème semaine) ; les membres supérieurs vers le 26ème jour. Les autres événements (neurulation, métamérisation, délimitation, 1ère paire de somites le 20ème jour) se produisent bien pendant la 4ème semaine.",
    options: [
      { text: "La neurulation, avec formation du tube neural", isCorrect: false },
      { text: "La métamérisation du mésoblaste en somites", isCorrect: false },
      { text: "La délimitation de l'embryon par rapport à ses annexes", isCorrect: false },
      { text: "La formation de la première paire de somites", isCorrect: false },
      { text: "L'apparition des bourgeons des membres inférieurs", isCorrect: true },
    ],
  },
  {
    text: "Le placenta est une annexe embryonnaire essentielle. Parmi les affirmations suivantes concernant le placenta, laquelle est INCORRECTE ?",
    explanation: "La progestérone est synthétisée par le corps jaune gestatif jusqu'à la fin de la 12ème semaine, puis le relais est pris par le syncytiotrophoblaste. Elle n'est donc pas exclusivement placentaire dès la 1ère semaine. Toutes les autres affirmations sont correctes.",
    options: [
      { text: "Le placenta humain est discoïdal, villeux, hémochorial et pseudo-cotylédoné", isCorrect: false },
      { text: "Les villosités tertiaires sont caractérisées par la présence d'un axe mésenchymateux vascularisé", isCorrect: false },
      { text: "La barrière placentaire est constituée du syncytiotrophoblaste, du cytotrophoblaste et de l'endothélium des capillaires fœtaux", isCorrect: false },
      { text: "Les immunoglobulines IgG traversent le placenta par pinocytose, assurant une immunité passive au nouveau-né", isCorrect: false },
      { text: "La progestérone est exclusivement synthétisée par le placenta dès la 1ère semaine de grossesse", isCorrect: true },
    ],
  },
];

async function main() {
  console.log("Starting to insert QCM Embryologie questions...\n");

  // 1. Find or create the subject
  let subject = await prisma.subject.findFirst({
    where: {
      OR: [
        { slug: { contains: SUBJECT_SLUG } },
        { name: { equals: SUBJECT_NAME, mode: 'insensitive' } },
      ],
    },
  });

  if (!subject) {
    console.log(`Subject '${SUBJECT_NAME}' not found. Creating...`);
    const category = await prisma.category.findFirst();
    subject = await prisma.subject.create({
      data: {
        name: SUBJECT_NAME,
        slug: `${SUBJECT_SLUG}-${Date.now()}`,
        description: 'Embryologie humaine - Développement prénatal',
        categoryId: category.id,
      },
    });
    console.log(`Created subject: ${subject.name} (${subject.id})`);
  } else {
    console.log(`Found subject: ${subject.name} (${subject.id})`);
  }

  // 2. Create the QuizExam
  console.log(`\nCreating exam: "${EXAM_TITLE}"...`);
  const exam = await prisma.quizExam.create({
    data: {
      title: EXAM_TITLE,
      description: EXAM_DESCRIPTION,
      subjectId: subject.id,
      studyYear: STUDY_YEAR,
      difficulty: DIFFICULTY,
      questionCount: questions.length,
      durationMinutes: 40,
      passScore: 60,
      allowRetake: true,
      randomizeQuestions: true,
      randomizeOptions: true,
      showAnswerExplanation: true,
      isPublished: true,
    },
  });
  console.log(`Exam created: ${exam.id}`);

  // 3. Create QuizQuestions and link to exam
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    console.log(`  Creating question ${i + 1}/${questions.length}...`);

    const question = await prisma.quizQuestion.create({
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

    // Link question to exam
    await prisma.quizExamQuestion.create({
      data: {
        examId: exam.id,
        questionId: question.id,
        order: i,
      },
    });
  }

  console.log(`\n✅ Done! Exam "${EXAM_TITLE}" created with ${questions.length} questions and published immediately.`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
