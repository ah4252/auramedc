const { PrismaClient } = require('@prisma/client');

// Use direct URL for script execution
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
});

const SUBJECT_ID = 'cmqusbo08000ejx040snqoybl'; // EMBRYOLOGIE (original)
const STUDY_YEAR = 'السنة الاولى';

const questions = [
  {
    text: "Un homme présente une azoospermie sécrétoire. Parmi les causes suivantes, laquelle est la plus susceptible d'expliquer cette condition ?",
    difficulty: "MEDIUM",
    explanation: "La cryptorchidie bilatérale non corrigée expose les testicules à la température corporelle (37°C au lieu de 35°C), ce qui altère irréversiblement la spermatogenèse et entraîne une azoospermie sécrétoire (défaut de production). L'option A correspond à une azoospermie excrétoire (obstruction).",
    keywords: "azoospermie, sécrétoire, cryptorchidie, spermatogenèse",
    options: [
      { text: "Une obstruction des voies excrétrices (canaux déférents)", isCorrect: false, order: 0 },
      { text: "Une cryptorchidie bilatérale non corrigée", isCorrect: true, order: 1 },
      { text: "Une infection des glandes annexes (prostate, vésicules séminales)", isCorrect: false, order: 2 },
      { text: "Un trouble de l'éjaculation", isCorrect: false, order: 3 },
      { text: "Une altération de la glaire cervicale chez sa partenaire", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant la spermatogenèse, quel est l'ordre chronologique correct des cellules germinales mâles depuis la puberté jusqu'à la formation du spermatozoïde ?",
    difficulty: "MEDIUM",
    explanation: "L'ordre correct est : Spermatogonie Ad (sombre, cellule-souche) → Spermatogonie Ap (pâle, cellule amplificatrice) → Spermatogonie B → Spermatocyte I (méiose I) → Spermatocyte II (méiose II) → Spermatide → Spermatozoïde (spermiogenèse).",
    keywords: "spermatogenèse, spermatogonies, méiose, spermiogenèse",
    options: [
      { text: "Spermatogonie Ad → Spermatogonie Ap → Spermatogonie B → Spermatocyte I → Spermatocyte II → Spermatide → Spermatozoïde", isCorrect: true, order: 0 },
      { text: "Spermatogonie B → Spermatogonie Ad → Spermatocyte I → Spermatocyte II → Spermatide → Spermatozoïde", isCorrect: false, order: 1 },
      { text: "Spermatogonie Ad → Spermatogonie B → Spermatogonie Ap → Spermatocyte I → Spermatide → Spermatocyte II → Spermatozoïde", isCorrect: false, order: 2 },
      { text: "Spermatocyte I → Spermatogonie Ad → Spermatogonie Ap → Spermatogonie B → Spermatocyte II → Spermatide → Spermatozoïde", isCorrect: false, order: 3 },
      { text: "Spermatogonie Ad → Spermatogonie Ap → Spermatocyte I → Spermatogonie B → Spermatocyte II → Spermatide → Spermatozoïde", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "La spermiogenèse est la phase de différenciation des spermatides en spermatozoïdes. Parmi les événements suivants, lequel ne fait PAS partie de la spermiogenèse ?",
    difficulty: "MEDIUM",
    explanation: "La réduction du nombre de chromosomes de 2n à n est accomplie lors de la méiose (phase de maturation), bien avant la spermiogenèse. La spermiogenèse est une différenciation morphologique sans division cellulaire.",
    keywords: "spermiogenèse, spermatides, méiose, acrosome, flagelle",
    options: [
      { text: "Condensation du noyau avec remplacement des histones par des protamines", isCorrect: false, order: 0 },
      { text: "Formation de l'acrosome par fusion des vésicules golgiennes", isCorrect: false, order: 1 },
      { text: "Réduction du nombre de chromosomes de 2n à n par méiose", isCorrect: true, order: 2 },
      { text: "Élongation du flagelle à partir du centriole distal", isCorrect: false, order: 3 },
      { text: "Formation du manchon mitochondrial en hélice autour du flagelle", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Le spermatozoïde mature comporte trois parties. La pièce intermédiaire est caractérisée par :",
    difficulty: "EASY",
    explanation: "La pièce intermédiaire contient le manchon mitochondrial (mitochondries disposées en hélice) et le centriole proximal.",
    keywords: "spermatozoïde, pièce intermédiaire, mitochondries, centriole",
    options: [
      { text: "La présence du noyau condensé et de l'acrosome", isCorrect: false, order: 0 },
      { text: "La présence de mitochondries disposées en hélice et du centriole proximal", isCorrect: true, order: 1 },
      { text: "La présence de l'axonème formé de microtubules", isCorrect: false, order: 2 },
      { text: "La présence de l'acrosome contenant des enzymes hydrolytiques", isCorrect: false, order: 3 },
      { text: "La présence de la membrane plasmique et de l'enveloppe nucléaire", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant l'ovogenèse, quelle affirmation est CORRECTE ?",
    difficulty: "MEDIUM",
    explanation: "L'ovocyte I est formé pendant la vie fœtale et reste bloqué en prophase I (dictyotène) jusqu'à l'ovulation.",
    keywords: "ovogenèse, ovocyte, méiose, prophase, ovulation",
    options: [
      { text: "L'ovogenèse débute à la puberté et se poursuit jusqu'à la ménopause", isCorrect: false, order: 0 },
      { text: "Les ovogonies se multiplient par méiose pendant la vie fœtale", isCorrect: false, order: 1 },
      { text: "Un ovocyte I est bloqué en prophase I depuis la vie fœtale jusqu'à l'ovulation", isCorrect: true, order: 2 },
      { text: "L'ovocyte II est expulsé lors de l'ovulation et est bloqué en prophase II", isCorrect: false, order: 3 },
      { text: "La première division de méiose de l'ovocyte I donne deux cellules haploïdes de taille égale", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Une femme de 32 ans consulte pour infertilité. L'exploration révèle une absence d'ovulation. Parmi les mécanismes suivants, lequel pourrait expliquer cette anovulation ?",
    difficulty: "MEDIUM",
    explanation: "Un déficit en FSH empêche la sélection et la croissance du follicule dominant, provoquant une anovulation.",
    keywords: "anovulation, FSH, follicule, infertilité",
    options: [
      { text: "Absence de glaire cervicale alcaline au moment de l'ovulation", isCorrect: false, order: 0 },
      { text: "Déficit en FSH empêchant la sélection du follicule dominant", isCorrect: true, order: 1 },
      { text: "Absence de réaction acrosomique des spermatozoïdes", isCorrect: false, order: 2 },
      { text: "Présence d'anticorps anti-spermatozoïdes", isCorrect: false, order: 3 },
      { text: "Obstruction des trompes de Fallope", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "La fécondation a lieu au niveau du tiers externe de la trompe de Fallope. Parmi les étapes suivantes de la fécondation, laquelle se produit en premier après la pénétration du spermatozoïde ?",
    difficulty: "MEDIUM",
    explanation: "La réaction corticale se déclenche immédiatement après la pénétration du spermatozoïde pour bloquer la polyspermie.",
    keywords: "fécondation, réaction corticale, polyspermie, ovocyte",
    options: [
      { text: "La fusion des pronucléus (amphimixie)", isCorrect: false, order: 0 },
      { text: "La réaction corticale bloquant la polyspermie", isCorrect: true, order: 1 },
      { text: "La reprise de la deuxième division méiotique de l'ovocyte II", isCorrect: false, order: 2 },
      { text: "La formation du zygote diploïde", isCorrect: false, order: 3 },
      { text: "L'activation du métabolisme de l'œuf", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Un couple consulte pour infertilité. Le spermogramme du mari montre une oligo-asthéno-tératospermie. Quelle est la signification de ce terme ?",
    difficulty: "EASY",
    explanation: "OAT : oligo = diminution du nombre, asthéno = diminution de la mobilité, térato = anomalies morphologiques.",
    keywords: "oligo-asthéno-tératospermie, spermogramme, infertilité",
    options: [
      { text: "Absence de spermatozoïdes dans le sperme", isCorrect: false, order: 0 },
      { text: "Diminution du nombre, de la mobilité et de la morphologie normale des spermatozoïdes", isCorrect: true, order: 1 },
      { text: "Présence d'anticorps anti-spermatozoïdes dans le sperme", isCorrect: false, order: 2 },
      { text: "Obstruction des voies génitales masculines", isCorrect: false, order: 3 },
      { text: "Augmentation du nombre de spermatozoïdes avec anomalie de la mobilité", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "La capacitation des spermatozoïdes est une étape indispensable à la fécondation. Cette capacitation se produit :",
    difficulty: "MEDIUM",
    explanation: "La capacitation se produit dans les voies génitales féminines (glaire cervicale, utérus, trompes).",
    keywords: "capacitation, spermatozoïdes, fécondation, voies génitales",
    options: [
      { text: "Dans l'épididyme pendant la maturation des spermatozoïdes", isCorrect: false, order: 0 },
      { text: "Dans la prostate sous l'effet du liquide prostatique", isCorrect: false, order: 1 },
      { text: "Dans les voies génitales féminines, au contact de la glaire cervicale et des sécrétions utérines et tubaires", isCorrect: true, order: 2 },
      { text: "Dans les tubes séminifères au moment de la spermiogenèse", isCorrect: false, order: 3 },
      { text: "Dans les vésicules séminales pendant le mélange des sécrétions", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "La réaction acrosomique est déclenchée par :",
    difficulty: "MEDIUM",
    explanation: "La réaction acrosomique est induite par des substances chimio-attractantes émises par les cellules de la corona radiata et par l'ovule.",
    keywords: "réaction acrosomique, corona radiata, zone pellucide, acrosine",
    options: [
      { text: "La fusion des membranes plasmiques du spermatozoïde et de l'ovocyte", isCorrect: false, order: 0 },
      { text: "Les substances émises par les cellules de la corona radiata et par l'ovule", isCorrect: true, order: 1 },
      { text: "Le contact du spermatozoïde avec la glaire cervicale", isCorrect: false, order: 2 },
      { text: "L'hydrolyse de l'ATP par les mitochondries de la pièce intermédiaire", isCorrect: false, order: 3 },
      { text: "La diminution du pH vaginal lors du rapport sexuel", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "La première semaine du développement embryonnaire est marquée par la segmentation. Concernant cette segmentation chez l'humain, laquelle des affirmations suivantes est FAUSSE ?",
    difficulty: "MEDIUM",
    explanation: "La segmentation chez l'humain est asynchrone : les blastomères ne se divisent pas tous en même temps.",
    keywords: "segmentation, blastomères, asynchrone, morula",
    options: [
      { text: "La segmentation est totale", isCorrect: false, order: 0 },
      { text: "La segmentation est inégale (les blastomères sont de taille différente)", isCorrect: false, order: 1 },
      { text: "La segmentation est synchrone (tous les blastomères se divisent en même temps)", isCorrect: true, order: 2 },
      { text: "La zone pellucide entoure l'embryon jusqu'au stade morula", isCorrect: false, order: 3 },
      { text: "La morula se forme au 4ème jour du développement embryonnaire", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Au 5ème jour du développement, le blastocyste est formé. Sa structure comprend :",
    difficulty: "MEDIUM",
    explanation: "Le bouton embryonnaire (macromères) donnera l'embryon et certaines annexes.",
    keywords: "blastocyste, bouton embryonnaire, trophoblaste, blastocèle",
    options: [
      { text: "Le bouton embryonnaire (macromères) qui donnera l'embryon et certaines annexes", isCorrect: true, order: 0 },
      { text: "Le trophoblaste (micromères) qui donnera exclusivement le système nerveux", isCorrect: false, order: 1 },
      { text: "Le blastocèle qui contient des cellules souches totipotentes", isCorrect: false, order: 2 },
      { text: "La zone pellucide qui protège le blastocyste lors de l'éclosion", isCorrect: false, order: 3 },
      { text: "Le cytotrophoblaste qui est responsable de l'érosion de l'endomètre", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Une patiente présente une grossesse extra-utérine (GEU) tubaire. L'anomalie est survenue lors de :",
    difficulty: "MEDIUM",
    explanation: "La GEU tubaire est due à un arrêt de la migration du blastocyste dans la trompe.",
    keywords: "GEU, grossesse extra-utérine, trompe, blastocyste",
    options: [
      { text: "La fécondation qui a eu lieu dans le vagin", isCorrect: false, order: 0 },
      { text: "La segmentation qui s'est déroulée trop rapidement", isCorrect: false, order: 1 },
      { text: "La migration du blastocyste qui s'est arrêté dans l'ampoule de la trompe", isCorrect: true, order: 2 },
      { text: "La nidation qui a eu lieu dans le péritoine", isCorrect: false, order: 3 },
      { text: "L'ovulation qui s'est produite dans la trompe controlatérale", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "La deuxième semaine du développement embryonnaire est caractérisée par la nidation. Concernant cette période, quelle affirmation est CORRECTE ?",
    difficulty: "HARD",
    explanation: "La membrane de Heuser est formée de cellules mésenchymateuses issues du cytotrophoblaste.",
    keywords: "nidation, membrane de Heuser, syncytiotrophoblaste, lécithocèle",
    options: [
      { text: "Le syncytiotrophoblaste se différencie en une couche cellulaire interne", isCorrect: false, order: 0 },
      { text: "Les lacunes syncytiales apparaissent au 13ème jour", isCorrect: false, order: 1 },
      { text: "Le bouton embryonnaire se différencie en un germe tridermique (ectoblaste, mésoblaste, endoblaste)", isCorrect: false, order: 2 },
      { text: "La membrane de Heuser est formée de cellules mésenchymateuses issues du cytotrophoblaste", isCorrect: true, order: 3 },
      { text: "Le lecithocèle primaire est la cavité définitive qui persiste jusqu'à la fin de la grossesse", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "La nidation a pour conséquence la réaction déciduale. Parmi les trois zones de la caduque, laquelle est située entre l'œuf et la cavité utérine ?",
    difficulty: "MEDIUM",
    explanation: "La caduque ovulaire (ou réfléchie) est située entre l'œuf et la cavité utérine.",
    keywords: "caduque, nidation, decidua, ovulaire, basilaire",
    options: [
      { text: "La caduque basilaire", isCorrect: false, order: 0 },
      { text: "La caduque ovulaire ou réfléchie", isCorrect: true, order: 1 },
      { text: "La caduque pariétale", isCorrect: false, order: 2 },
      { text: "La caduque fonctionnelle", isCorrect: false, order: 3 },
      { text: "La caduque spongieuse", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "L'hormone chorionique gonadotrophine (HCG) est sécrétée par le trophoblaste. Quelle est sa principale fonction ?",
    difficulty: "EASY",
    explanation: "L'HCG maintient le corps jaune gestatif en vie pendant les premières semaines.",
    keywords: "HCG, trophoblaste, corps jaune, grossesse",
    options: [
      { text: "Stimuler la croissance folliculaire ovarienne", isCorrect: false, order: 0 },
      { text: "Maintenir le corps jaune gestatif en vie", isCorrect: true, order: 1 },
      { text: "Initier la lactation chez la mère", isCorrect: false, order: 2 },
      { text: "Induire la neurulation chez l'embryon", isCorrect: false, order: 3 },
      { text: "Provoquer l'ovulation au 14ème jour du cycle", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "La troisième semaine du développement embryonnaire est marquée par la gastrulation. Le nœud de Hensen et la ligne primitive permettent :",
    difficulty: "MEDIUM",
    explanation: "La ligne primitive et le nœud de Hensen permettent l'invagination des cellules pour former le mésoblaste intra-embryonnaire.",
    keywords: "gastrulation, nœud de Hensen, ligne primitive, mésoblaste",
    options: [
      { text: "La formation de la cavité amniotique", isCorrect: false, order: 0 },
      { text: "La mise en place du mésoblaste intra-embryonnaire par invagination des cellules de l'ectoblaste", isCorrect: true, order: 1 },
      { text: "La formation du tube neural", isCorrect: false, order: 2 },
      { text: "La mise en place du placenta définitif", isCorrect: false, order: 3 },
      { text: "La formation de l'allantoïde", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "La chorde dorsale se forme à partir du matériel chordal. Quel est l'ordre correct des stades de formation de la chorde ?",
    difficulty: "HARD",
    explanation: "Canal chordal (18ème jour) → Canal chordal fissuré (19ème jour) → Gouttière chordale renversée (20ème jour) → Plaque chordale (21ème jour) → Chorde dorsale (22ème jour).",
    keywords: "chorde dorsale, matériel chordal, canal chordal, plaque chordale",
    options: [
      { text: "Canal chordal → Gouttière chordale renversée → Plaque chordale → Chorde dorsale → Canal chordal fissuré", isCorrect: false, order: 0 },
      { text: "Canal chordal → Canal chordal fissuré → Gouttière chordale renversée → Plaque chordale → Chorde dorsale", isCorrect: true, order: 1 },
      { text: "Gouttière chordale renversée → Canal chordal → Canal chordal fissuré → Plaque chordale → Chorde dorsale", isCorrect: false, order: 2 },
      { text: "Plaque chordale → Canal chordal → Canal chordal fissuré → Gouttière chordale renversée → Chorde dorsale", isCorrect: false, order: 3 },
      { text: "Canal chordal → Plaque chordale → Canal chordal fissuré → Gouttière chordale renversée → Chorde dorsale", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "La quatrième semaine du développement embryonnaire est une période critique pour la tératogenèse. Parmi les événements suivants, lequel ne se produit PAS au cours de la quatrième semaine ?",
    difficulty: "MEDIUM",
    explanation: "Les bourgeons des membres inférieurs apparaissent vers le 28ème-30ème jour, à la fin de la 4ème ou début de la 5ème semaine.",
    keywords: "4ème semaine, tératogenèse, neurulation, somites, bourgeons",
    options: [
      { text: "La neurulation, avec formation du tube neural", isCorrect: false, order: 0 },
      { text: "La métamérisation du mésoblaste en somites", isCorrect: false, order: 1 },
      { text: "La délimitation de l'embryon par rapport à ses annexes", isCorrect: false, order: 2 },
      { text: "La formation de la première paire de somites", isCorrect: false, order: 3 },
      { text: "L'apparition des bourgeons des membres inférieurs", isCorrect: true, order: 4 },
    ],
  },
  {
    text: "Le placenta est une annexe embryonnaire essentielle. Parmi les affirmations suivantes concernant le placenta, laquelle est INCORRECTE ?",
    difficulty: "MEDIUM",
    explanation: "La progestérone est initialement produite par le corps jaune gestatif. Le relais placentaire ne s'effectue qu'à partir de la 12ème semaine.",
    keywords: "placenta, progestérone, hémochorial, barrière placentaire",
    options: [
      { text: "Le placenta humain est discoïdal, villeux, hémochorial et pseudo-cotylédoné", isCorrect: false, order: 0 },
      { text: "Les villosités tertiaires sont caractérisées par la présence d'un axe mésenchymateux vascularisé", isCorrect: false, order: 1 },
      { text: "La barrière placentaire est constituée du syncytiotrophoblaste, du cytotrophoblaste et de l'endothélium des capillaires fœtaux", isCorrect: false, order: 2 },
      { text: "Les immunoglobulines IgG traversent le placenta par pinocytose, assurant une immunité passive au nouveau-né", isCorrect: false, order: 3 },
      { text: "La progestérone est exclusivement synthétisée par le placenta dès la 1ère semaine de grossesse", isCorrect: true, order: 4 },
    ],
  },
];

async function main() {
  console.log("Starting to add Embryologie 1ère année QCM questions...\n");

  // Verify subject exists
  const subject = await prisma.subject.findUnique({
    where: { id: SUBJECT_ID },
    select: { id: true, name: true },
  });

  if (!subject) {
    console.error(`Subject with ID ${SUBJECT_ID} not found!`);
    process.exit(1);
  }
  console.log(`Found subject: ${subject.name} (${subject.id})`);
  console.log(`Using studyYear: "${STUDY_YEAR}"\n`);

  // Create questions
  let created = 0;
  let errors = 0;
  const createdQuestionIds = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    try {
      const question = await prisma.quizQuestion.create({
        data: {
          text: q.text,
          subjectId: SUBJECT_ID,
          studyYear: STUDY_YEAR,
          difficulty: q.difficulty,
          type: "MULTIPLE_CHOICE",
          explanation: q.explanation || null,
          hint: null,
          reference: null,
          keywords: q.keywords || null,
          isPublished: true,
          options: {
            create: q.options.map((opt) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
              order: opt.order,
            })),
          },
        },
        include: { options: true },
      });

      const correctOpt = q.options.find((o) => o.isCorrect);
      const correctLetter = String.fromCharCode(65 + q.options.indexOf(correctOpt));
      console.log(`✓ QCM ${i + 1}/${questions.length} added (ID: ${question.id}) — Correct: ${correctLetter}`);
      createdQuestionIds.push(question.id);
      created++;
    } catch (error) {
      console.error(`✗ QCM ${i + 1}/${questions.length} FAILED:`, error.message);
      errors++;
    }
  }

  // Create a QuizExam grouping all questions
  if (createdQuestionIds.length > 0) {
    console.log("\nCreating QuizExam...");
    const exam = await prisma.quizExam.create({
      data: {
        title: "QCM Embryologie - 1ère année",
        description: "Examen QCM sur l'embryologie humaine : spermatogenèse, ovogenèse, fécondation, segmentation, nidation, gastrulation et placenta.",
        subjectId: SUBJECT_ID,
        studyYear: STUDY_YEAR,
        difficulty: "MEDIUM",
        questionCount: createdQuestionIds.length,
        durationMinutes: 40,
        passScore: 60,
        allowRetake: true,
        randomizeQuestions: true,
        randomizeOptions: true,
        showAnswerExplanation: true,
        isPublished: true,
        questions: {
          create: createdQuestionIds.map((qId, index) => ({
            questionId: qId,
            order: index + 1,
          })),
        },
      },
    });
    console.log(`✓ QuizExam created: "${exam.title}" (ID: ${exam.id}) with ${createdQuestionIds.length} questions`);
  }

  console.log(`\n========================================`);
  console.log(`Done! Created: ${created}/${questions.length} | Errors: ${errors}`);
  console.log(`All questions are PUBLISHED and ready for students.`);
  console.log(`========================================`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("Fatal error:", e);
  await prisma.$disconnect();
  process.exit(1);
});
