const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDY_YEAR = 'السنة الاولى';
const SUBJECT_NAME = 'Biochimie S1';
const DIFFICULTY = 'MEDIUM';

const questions = [
  {
    text: "Concernant la structure des glucides, lequel des énoncés suivants est CORRECT ?",
    explanation: "Le pouvoir rotatoire d'un mélange racémique (équimolaire de D et L) est nul car les rotations s'annulent. Le glycéraldéhyde possède un seul C* donc 2 isomères (2¹). La cyclisation peut donner pyrane (C1-C5) ou furane (C1-C4). Les oses naturels sont de série D.",
    options: [
      { text: "Le glycéraldéhyde possède 2 carbones asymétriques, ce qui donne 4 isomères optiques", isCorrect: false },
      { text: "La cyclisation du D-glucose en solution aqueuse se fait exclusivement par une liaison C1-C4 formant un furane", isCorrect: false },
      { text: "Les oses naturels appartiennent majoritairement à la série L, contrairement à ce qu'indique la représentation de Fischer", isCorrect: false },
      { text: "Le pouvoir rotatoire d'un mélange équimolaire de D-glucose et L-glucose est nul car ce mélange est racémique", isCorrect: true },
      { text: "L'oxydation énergétique d'un cétose par HNO₃ donne un acide aldarique sans coupure de chaîne", isCorrect: false },
    ],
  },
  {
    text: "Un étudiant prépare une solution de D-glucose à 0,022 mol/L et mesure son pouvoir rotatoire dans un tube de 50 cm. Sachant que le pouvoir rotatoire spécifique du D-glucose est de 52,2°·ml/g·dm (Masse molaire = 180 g/mol), quelle sera la valeur de l'angle de déviation α ?",
    explanation: "Calcul : C = 0,022 mol/L × 180 g/mol = 3,96 g/L = 0,00396 g/mL ; l = 50 cm = 5 dm ; α = 52,2 × 0,00396 × 5 = 1,034° ≈ 1,04°",
    options: [
      { text: "0,26°", isCorrect: false },
      { text: "0,52°", isCorrect: false },
      { text: "1,04°", isCorrect: true },
      { text: "2,08°", isCorrect: false },
      { text: "5,20°", isCorrect: false },
    ],
  },
  {
    text: "Concernant la mutarotation, quelle affirmation est EXACTE ?",
    explanation: "La mutarotation correspond au passage par la forme linéaire ouverte (environ 0,02% à l'équilibre pour le glucose) permettant l'interconversion α↔β. L'équilibre du glucose est 36% α et 64% β.",
    options: [
      { text: "La mutarotation est due à l'oxydation du glucose en acide gluconique", isCorrect: false },
      { text: "Elle correspond à l'interconversion entre les formes α et β d'un ose jusqu'à l'équilibre, qui pour le glucose est de 50% α et 50% β", isCorrect: false },
      { text: "Le phénomène de mutarotation s'explique par le passage par la forme linéaire ouverte, présente à environ 0,02% à l'équilibre pour le glucose", isCorrect: true },
      { text: "La mutarotation est un phénomène observé uniquement pour les cétoses", isCorrect: false },
      { text: "La mutarotation modifie la configuration D/L de l'ose sans affecter son pouvoir rotatoire", isCorrect: false },
    ],
  },
  {
    text: "Le saccharose est un diholoside particulier. Parmi les propositions suivantes, quelle est celle qui le caractérise correctement ?",
    explanation: "Le saccharose est bien un α-D-glucopyranosyl (1→2) β-D-fructofuranoside. Il est non réducteur car les deux carbones anomériques sont engagés dans la liaison osidique. Ce n'est pas un triholoside et son hydrolyse donne glucose + fructose.",
    options: [
      { text: "Le saccharose est un sucre réducteur car il possède un OH hémiacétalique libre", isCorrect: false },
      { text: "Sa liaison osidique est de type α-D-glucopyranosyl (1→4) α-D-glucopyranose", isCorrect: false },
      { text: "L'hydrolyse du saccharose par une enzyme spécifique produit exclusivement du D-galactose", isCorrect: false },
      { text: "Le saccharose est formé d'une liaison α-D-glucopyranosyl (1→2) β-D-fructofuranoside, ce qui le rend non réducteur", isCorrect: true },
      { text: "Le saccharose est un triholoside appartenant à la classe des osides", isCorrect: false },
    ],
  },
  {
    text: "Un acide gras de formule brute C₂₀H₄₀O₂ présente les caractéristiques suivantes SAUF :",
    explanation: "La numérotation des acides gras commence par le carbone du groupement carboxylique (C1), et non par le groupement méthyle terminal.",
    options: [
      { text: "C'est un acide gras saturé", isCorrect: false },
      { text: "Son nom systématique est l'acide eicosanoïque", isCorrect: false },
      { text: "Sa numérotation commence par le carbone du groupement méthyle terminal", isCorrect: true },
      { text: "Sa formule développée est CH₃-(CH₂)₁₈-COOH", isCorrect: false },
      { text: "Il est insoluble dans l'eau", isCorrect: false },
    ],
  },
  {
    text: "Concernant les propriétés des acides gras insaturés, quel énoncé est CORRECT ?",
    explanation: "Les oméga sont déterminés par la position de la première double liaison à partir du carbone méthyle (extrémité ω). L'indice d'iode est proportionnel aux insaturations, les doubles liaisons abaissent le point de fusion, KMnO₄ provoque une coupure oxydative, et l'hydrogénation transforme les insaturés en saturés.",
    options: [
      { text: "La présence de doubles liaisons augmente significativement le point d'ébullition par rapport à l'acide gras saturé correspondant", isCorrect: false },
      { text: "L'indice d'iode est inversement proportionnel au nombre de doubles liaisons dans un lipide", isCorrect: false },
      { text: "L'oxydation ménagée d'un acide gras insaturé par KMnO₄ permet une hydrogénation des doubles liaisons", isCorrect: false },
      { text: "La position de la première double liaison à partir du carbone méthyle détermine la famille des oméga (ω)", isCorrect: true },
      { text: "L'hydrogénation catalytique transforme un acide gras saturé en acide gras insaturé", isCorrect: false },
    ],
  },
  {
    text: "Un peptide est soumis à une hydrolyse enzymatique par la trypsine et la chymotrypsine. Sachant que la séquence est : Met-Lys-Phe-Arg-Tyr-Gly-Arg-Trp-Leu, quels fragments obtiendrait-on par action séquentielle de la trypsine puis de la chymotrypsine ?",
    explanation: "La trypsine coupe spécifiquement après les résidus Lysine et Arginine. La chymotrypsine coupe après les acides aminés aromatiques (Phe, Tyr, Trp). La séquence donne bien : Met-Lys | Phe-Arg | Tyr-Gly-Arg | Trp-Leu après trypsine.",
    options: [
      { text: "La trypsine coupe après Lys, Arg → Met-Lys | Phe-Arg | Tyr-Gly-Arg | Trp-Leu ; puis chymotrypsine coupe après Phe, Tyr, Trp", isCorrect: true },
      { text: "La trypsine coupe après Phe, Tyr, Trp et la chymotrypsine après Lys, Arg", isCorrect: false },
      { text: "La trypsine et la chymotrypsine coupent indifféremment toutes les liaisons peptidiques", isCorrect: false },
      { text: "La trypsine coupe après Arg seulement → Met-Lys-Phe-Arg | Tyr-Gly-Arg | Trp-Leu", isCorrect: false },
      { text: "La chymotrypsine coupe après Lys et Arg → Met-Lys | Phe-Arg | Tyr-Gly-Arg | Trp-Leu", isCorrect: false },
    ],
  },
  {
    text: "Un acide aminé possède un pHi de 6,0 et se trouve dans une solution à pH 8,5. Quelle sera sa charge globale et sa migration dans un champ électrique ?",
    explanation: "Si pH (8,5) > pHi (6,0), l'acide aminé est chargé négativement (déprotoné). Il migre donc vers l'anode.",
    options: [
      { text: "Charge positive, migration vers la cathode", isCorrect: false },
      { text: "Charge négative, migration vers l'anode", isCorrect: true },
      { text: "Charge nulle, pas de migration", isCorrect: false },
      { text: "Charge positive, migration vers l'anode", isCorrect: false },
      { text: "Charge négative, migration vers la cathode", isCorrect: false },
    ],
  },
  {
    text: "La réaction de la ninhydrine avec les acides aminés permet :",
    explanation: "La ninhydrine réagit avec les amines primaires pour donner un chromophore violet (570 nm) et avec les amines secondaires pour donner un chromophore jaune (440 nm). Elle n'est pas spécifique des acides aminés (réagit aussi avec glucosamine, peptides...).",
    options: [
      { text: "De couper spécifiquement les liaisons peptidiques entre les acides aminés aromatiques", isCorrect: false },
      { text: "De former un chromophore violet pour les amines primaires (570 nm) et jaune pour les amines secondaires (440 nm)", isCorrect: true },
      { text: "De déterminer la séquence N-terminale d'un peptide par la méthode d'Edman", isCorrect: false },
      { text: "De réduire les ponts disulfures entre deux résidus cystéine", isCorrect: false },
      { text: "De doser spécifiquement la glycine uniquement", isCorrect: false },
    ],
  },
  {
    text: "Concernant la structure des protéines, quelle affirmation est CORRECTE ?",
    explanation: "La structure quaternaire est l'association de plusieurs chaînes peptidiques (protomères). La structure primaire est la séquence linéaire, l'hélice α est stabilisée par liaisons hydrogène (pas covalentes), le collagène a une structure en triple hélice particulière, et le feuillet β est une structure étirée en zigzag.",
    options: [
      { text: "La structure primaire correspond à l'arrangement tridimensionnel des acides aminés dans l'espace", isCorrect: false },
      { text: "L'hélice α est stabilisée uniquement par des liaisons covalentes entre les chaînes latérales", isCorrect: false },
      { text: "Le collagène possède une structure secondaire de type hélice α classique stabilisée par des liaisons hydrogène intra-chaîne", isCorrect: false },
      { text: "La structure quaternaire n'est présente que dans les protéines composées de plusieurs sous-unités (protomères)", isCorrect: true },
      { text: "Le feuillet β est une structure hélicoïdale avec 3,6 résidus par tour", isCorrect: false },
    ],
  },
  {
    text: "Un nucléotide est composé de trois éléments. Lesquels ?",
    explanation: "Un nucléotide est constitué d'une base azotée (purique ou pyrimidique), d'un pentose (ribose ou désoxyribose) et d'un groupement phosphate.",
    options: [
      { text: "Une base purique, un ribose et un groupement phosphate", isCorrect: false },
      { text: "Une base azotée, un pentose et un groupement phosphate", isCorrect: true },
      { text: "Une base pyrimidique, un désoxyribose et un groupement phosphate", isCorrect: false },
      { text: "Une base azotée, un hexose et un groupement phosphate", isCorrect: false },
      { text: "Une purine, une pyrimidine et un pentose", isCorrect: false },
    ],
  },
  {
    text: "Concernant la structure de l'ADN, quelle proposition est Fausse ?",
    explanation: "L'ADN mitochondrial est distinct de l'ADN nucléaire (génome mitochondrial circulaire, transmis par la mère, code pour certaines protéines). Toutes les autres propositions sont correctes.",
    options: [
      { text: "L'ADN est une double hélice formée de deux brins antiparallèles", isCorrect: false },
      { text: "Les bases azotées sont appariées par liaisons hydrogène selon la règle de Chargaff : A=T (2 liaisons) et G≡C (3 liaisons)", isCorrect: false },
      { text: "La liaison phosphodiester s'établit entre le carbone 5' d'un nucléotide et le carbone 3' du nucléotide suivant", isCorrect: false },
      { text: "L'ADN mitochondrial est identique à l'ADN nucléaire en termes de séquence et de structure", isCorrect: true },
      { text: "L'uracile est une base spécifique de l'ARN, remplacée par la thymine dans l'ADN", isCorrect: false },
    ],
  },
  {
    text: "Un technicien souhaite identifier la nature d'un oside inconnu. Il réalise une hydrolyse acide suivie d'une chromatographie. Le chromatogramme montre la présence de glucose et de fructose. L'hydrolyse enzymatique par une α-glucosidase libère également du glucose et du fructose. Le composé est probablement :",
    explanation: "Le saccharose est le seul diholoside naturel donnant glucose + fructose. Le lactose donne glucose + galactose, le maltose donne deux glucoses, le raffinose est un triholoside, et le glycogène est un polyoside.",
    options: [
      { text: "Le lactose", isCorrect: false },
      { text: "Le maltose", isCorrect: false },
      { text: "Le saccharose", isCorrect: true },
      { text: "Le raffinose", isCorrect: false },
      { text: "Le glycogène", isCorrect: false },
    ],
  },
  {
    text: "Concernant les propriétés des acides nucléiques, laquelle des affirmations suivantes est INCORRECTE ?",
    explanation: "C'est l'inverse : l'ARN est moins stable que l'ADN en milieu alcalin car le groupement OH en 2' du ribose permet une hydrolyse alcaline (formation de 2',3'-phosphate cyclique). L'ADN n'a pas de OH en 2' (désoxyribose), donc plus stable.",
    options: [
      { text: "L'ADN absorbe la lumière UV de manière maximale à 260 nm, propriété utilisée pour son dosage", isCorrect: false },
      { text: "L'ADN simple brin absorbe 12 à 40% plus de lumière que l'ADN double brin", isCorrect: false },
      { text: "L'ARN est plus stable que l'ADN en milieu alcalin car il possède un groupement OH en position 2'", isCorrect: true },
      { text: "L'ADN est insoluble dans l'éthanol et peut être précipité par ce solvant", isCorrect: false },
      { text: "La dénaturation de l'ADN par chauffage sépare les deux brins en rompant les liaisons hydrogène, et un refroidissement lent permet sa renaturation", isCorrect: false },
    ],
  },
  {
    text: "Un patient présente un déficit enzymatique dans le métabolisme d'un acide aminé conduisant à une aminoacidurie. L'analyse de ses urines révèle un excès de phénylalanine. La réaction de Sanger (DNFB) sur un peptide extrait de ce patient permettrait de :",
    explanation: "La réaction de Sanger (DNFB ou 1-fluoro-2,4-dinitrobenzène) permet d'identifier l'acide aminé N-terminal d'un peptide ou d'une protéine en formant un dérivé dinitrophénylé coloré.",
    options: [
      { text: "Doser spécifiquement la phénylalanine par coloration à la ninhydrine", isCorrect: false },
      { text: "Identifier l'acide aminé N-terminal du peptide par formation d'un dérivé dinitrophénylé", isCorrect: true },
      { text: "Hydrolyser les liaisons peptidiques pour libérer tous les acides aminés", isCorrect: false },
      { text: "Oxyler la phénylalanine en tyrosine par l'acide performique", isCorrect: false },
      { text: "Mesurer le pouvoir rotatoire du peptide pour déterminer sa configuration D/L", isCorrect: false },
    ],
  },
];

async function main() {
  console.log("Starting to insert Biochimie S1 questions...\n");

  // Find or create subject
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
        slug: `biochimie-s1-${Date.now()}`,
        description: 'Biochimie structurale - Semestre 1',
        categoryId: category.id,
      },
    });
    console.log(`Created subject: ${subject.name} (${subject.id})`);
  } else {
    console.log(`Found subject: ${subject.name} (${subject.id})`);
  }

  // Insert individual questions only (no QuizExam)
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
