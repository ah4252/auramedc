const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SUBJECT_ID = 'cmqusa9f10004jx042lox98a6'; // BIOCHIMIE S1
const STUDY_YEAR = 'السنة الاولى';

const questions = [
  {
    text: "Concernant la structure des glucides, lequel des énoncés suivants est CORRECT ?",
    difficulty: "MEDIUM",
    explanation: "Le pouvoir rotatoire d'un mélange racémique (équimolaire de D et L) est nul car les rotations s'annulent. Le glycéraldéhyde possède un seul C* donc 2 isomères (x=2¹). La cyclisation peut donner pyrane (C1-C5) ou furane (C1-C4). Les oses naturels sont de série D.",
    keywords: "glucides, isomères, pouvoir rotatoire, racémique",
    options: [
      { text: "Le glycéraldéhyde possède 2 carbones asymétriques, ce qui donne 4 isomères optiques", isCorrect: false, order: 0 },
      { text: "La cyclisation du D-glucose en solution aqueuse se fait exclusivement par une liaison C1-C4 formant un furane", isCorrect: false, order: 1 },
      { text: "Les oses naturels appartiennent majoritairement à la série L, contrairement à ce qu'indique la représentation de Fischer", isCorrect: false, order: 2 },
      { text: "Le pouvoir rotatoire d'un mélange équimolaire de D-glucose et L-glucose est nul car ce mélange est racémique", isCorrect: true, order: 3 },
      { text: "L'oxydation énergétique d'un cétose par HNO₃ donne un acide aldarique sans coupure de chaîne", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Un étudiant prépare une solution de D-glucose à 0,022 mol/L et mesure son pouvoir rotatoire dans un tube de 50 cm. Sachant que le pouvoir rotatoire spécifique du D-glucose est de 52,2°·ml/g·dm (Masse molaire = 180 g/mol), quelle sera la valeur de l'angle de déviation α ?",
    difficulty: "HARD",
    explanation: "Calcul : C = 0,022 mol/L × 180 g/mol = 3,96 g/L = 0,00396 g/mL ; l = 50 cm = 5 dm ; α = 52,2 × 0,00396 × 5 = 1,034° ≈ 1,04°",
    keywords: "pouvoir rotatoire, D-glucose, calcul, polarimétrie",
    options: [
      { text: "0,26°", isCorrect: false, order: 0 },
      { text: "0,52°", isCorrect: false, order: 1 },
      { text: "1,04°", isCorrect: true, order: 2 },
      { text: "2,08°", isCorrect: false, order: 3 },
      { text: "5,20°", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant la mutarotation, quelle affirmation est EXACTE ?",
    difficulty: "MEDIUM",
    explanation: "La mutarotation correspond au passage par la forme linéaire ouverte (environ 0,02% à l'équilibre pour le glucose) permettant l'interconversion α↔β. L'équilibre du glucose est 36% α et 64% β.",
    keywords: "mutarotation, glucose, interconversion, α, β",
    options: [
      { text: "La mutarotation est due à l'oxydation du glucose en acide gluconique", isCorrect: false, order: 0 },
      { text: "Elle correspond à l'interconversion entre les formes α et β d'un ose jusqu'à l'équilibre, qui pour le glucose est de 50% α et 50% β", isCorrect: false, order: 1 },
      { text: "Le phénomène de mutarotation s'explique par le passage par la forme linéaire ouverte, présente à environ 0,02% à l'équilibre pour le glucose", isCorrect: true, order: 2 },
      { text: "La mutarotation est un phénomène observé uniquement pour les cétoses", isCorrect: false, order: 3 },
      { text: "La mutarotation modifie la configuration D/L de l'ose sans affecter son pouvoir rotatoire", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Le saccharose est un diholoside particulier. Parmi les propositions suivantes, quelle est celle qui le caractérise correctement ?",
    difficulty: "MEDIUM",
    explanation: "Le saccharose est bien un α-D-glucopyranosyl (1→2) β-D-fructofuranoside. Il est non réducteur car les deux carbones anomériques sont engagés dans la liaison osidique. Ce n'est pas un triholoside et son hydrolyse donne glucose + fructose.",
    keywords: "saccharose, diholoside, liaison osidique, non réducteur",
    options: [
      { text: "Le saccharose est un sucre réducteur car il possède un OH hémiacétalique libre", isCorrect: false, order: 0 },
      { text: "Sa liaison osidique est de type α-D-glucopyranosyl (1→4) α-D-glucopyranose", isCorrect: false, order: 1 },
      { text: "L'hydrolyse du saccharose par une enzyme spécifique produit exclusivement du D-galactose", isCorrect: false, order: 2 },
      { text: "Le saccharose est formé d'une liaison α-D-glucopyranosyl (1→2) β-D-fructofuranoside, ce qui le rend non réducteur", isCorrect: true, order: 3 },
      { text: "Le saccharose est un triholoside appartenant à la classe des osides", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Un acide gras de formule brute C₂₀H₄₀O₂ présente les caractéristiques suivantes SAUF :",
    difficulty: "MEDIUM",
    explanation: "La numérotation des acides gras commence par le carbone du groupement carboxylique (C1), et non par le groupement méthyle terminal.",
    keywords: "acide gras, saturé, eicosanoïque, numérotation",
    options: [
      { text: "C'est un acide gras saturé", isCorrect: false, order: 0 },
      { text: "Son nom systématique est l'acide eicosanoïque", isCorrect: false, order: 1 },
      { text: "Sa numérotation commence par le carbone du groupement méthyle terminal", isCorrect: true, order: 2 },
      { text: "Sa formule développée est CH₃-(CH₂)₁₈-COOH", isCorrect: false, order: 3 },
      { text: "Il est insoluble dans l'eau", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant les propriétés des acides gras insaturés, quel énoncé est CORRECT ?",
    difficulty: "HARD",
    explanation: "Les oméga sont déterminés par la position de la première double liaison à partir du carbone méthyle (extrémité ω). L'indice d'iode est proportionnel aux insaturations, les doubles liaisons abaissent le point de fusion (pas d'influence sur le point d'ébullition), KMnO₄ provoque une coupure oxydative (pas d'hydrogénation), et l'hydrogénation transforme les insaturés en saturés.",
    keywords: "acides gras, insaturés, oméga, indice d'iode",
    options: [
      { text: "La présence de doubles liaisons augmente significativement le point d'ébullition par rapport à l'acide gras saturé correspondant", isCorrect: false, order: 0 },
      { text: "L'indice d'iode est inversement proportionnel au nombre de doubles liaisons dans un lipide", isCorrect: false, order: 1 },
      { text: "L'oxydation ménagée d'un acide gras insaturé par KMnO₄ permet une hydrogénation des doubles liaisons", isCorrect: false, order: 2 },
      { text: "La position de la première double liaison à partir du carbone méthyle détermine la famille des oméga (ω)", isCorrect: true, order: 3 },
      { text: "L'hydrogénation catalytique transforme un acide gras saturé en acide gras insaturé", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Un peptide est soumis à une hydrolyse enzymatique par la trypsine et la chymotrypsine. Sachant que la séquence est : Met-Lys-Phe-Arg-Tyr-Gly-Arg-Trp-Leu, quels fragments obtiendrait-on par action séquentielle de la trypsine puis de la chymotrypsine ?",
    difficulty: "HARD",
    explanation: "La trypsine coupe spécifiquement après les résidus Lysine et Arginine. La chymotrypsine coupe après les acides aminés aromatiques (Phe, Tyr, Trp). La séquence donne : Met-Lys | Phe-Arg | Tyr-Gly-Arg | Trp-Leu après trypsine.",
    keywords: "peptide, trypsine, chymotrypsine, hydrolyse enzymatique",
    options: [
      { text: "La trypsine coupe après Lys, Arg → Met-Lys | Phe-Arg | Tyr-Gly-Arg | Trp-Leu ; puis chymotrypsine coupe après Phe, Tyr, Trp", isCorrect: true, order: 0 },
      { text: "La trypsine coupe après Phe, Tyr, Trp et la chymotrypsine après Lys, Arg", isCorrect: false, order: 1 },
      { text: "La trypsine et la chymotrypsine coupent indifféremment toutes les liaisons peptidiques", isCorrect: false, order: 2 },
      { text: "La trypsine coupe après Arg seulement → Met-Lys-Phe-Arg | Tyr-Gly-Arg | Trp-Leu", isCorrect: false, order: 3 },
      { text: "La chymotrypsine coupe après Lys et Arg → Met-Lys | Phe-Arg | Tyr-Gly-Arg | Trp-Leu", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Un acide aminé possède un pHi de 6,0 et se trouve dans une solution à pH 8,5. Quelle sera sa charge globale et sa migration dans un champ électrique ?",
    difficulty: "MEDIUM",
    explanation: "Si pH (8,5) > pHi (6,0), l'acide aminé est chargé négativement (déprotoné). Il migre donc vers l'anode.",
    keywords: "acide aminé, pHi, charge, migration, électrophorèse",
    options: [
      { text: "Charge positive, migration vers la cathode", isCorrect: false, order: 0 },
      { text: "Charge négative, migration vers l'anode", isCorrect: true, order: 1 },
      { text: "Charge nulle, pas de migration", isCorrect: false, order: 2 },
      { text: "Charge positive, migration vers l'anode", isCorrect: false, order: 3 },
      { text: "Charge négative, migration vers la cathode", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "La réaction de la ninhydrine avec les acides aminés permet :",
    difficulty: "EASY",
    explanation: "La ninhydrine réagit avec les amines primaires pour donner un chromophore violet (570 nm) et avec les amines secondaires pour donner un chromophore jaune (440 nm). Elle n'est pas spécifique des acides aminés.",
    keywords: "ninhydrine, acides aminés, coloration, chromophore",
    options: [
      { text: "De couper spécifiquement les liaisons peptidiques entre les acides aminés aromatiques", isCorrect: false, order: 0 },
      { text: "De former un chromophore violet pour les amines primaires (570 nm) et jaune pour les amines secondaires (440 nm)", isCorrect: true, order: 1 },
      { text: "De déterminer la séquence N-terminale d'un peptide par la méthode d'Edman", isCorrect: false, order: 2 },
      { text: "De réduire les ponts disulfures entre deux résidus cystéine", isCorrect: false, order: 3 },
      { text: "De doser spécifiquement la glycine uniquement", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant la structure des protéines, quelle affirmation est CORRECTE ?",
    difficulty: "MEDIUM",
    explanation: "La structure quaternaire est l'association de plusieurs chaînes peptidiques (protomères). La structure primaire est la séquence linéaire, l'hélice α est stabilisée par liaisons hydrogène (pas covalentes), le collagène a une structure en triple hélice particulière, et le feuillet β est une structure étirée en zigzag.",
    keywords: "protéines, structure, quaternaire, hélice α, feuillet β",
    options: [
      { text: "La structure primaire correspond à l'arrangement tridimensionnel des acides aminés dans l'espace", isCorrect: false, order: 0 },
      { text: "L'hélice α est stabilisée uniquement par des liaisons covalentes entre les chaînes latérales", isCorrect: false, order: 1 },
      { text: "Le collagène possède une structure secondaire de type hélice α classique stabilisée par des liaisons hydrogène intra-chaîne", isCorrect: false, order: 2 },
      { text: "La structure quaternaire n'est présente que dans les protéines composées de plusieurs sous-unités (protomères)", isCorrect: true, order: 3 },
      { text: "Le feuillet β est une structure hélicoïdale avec 3,6 résidus par tour", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Un nucléotide est composé de trois éléments. Lesquels ?",
    difficulty: "EASY",
    explanation: "Un nucléotide est constitué d'une base azotée, d'un pentose (ribose ou désoxyribose) et d'un groupement phosphate.",
    keywords: "nucléotide, base azotée, pentose, phosphate",
    options: [
      { text: "Une base purique, un ribose et un groupement phosphate", isCorrect: false, order: 0 },
      { text: "Une base azotée, un pentose et un groupement phosphate", isCorrect: true, order: 1 },
      { text: "Une base pyrimidique, un désoxyribose et un groupement phosphate", isCorrect: false, order: 2 },
      { text: "Une base azotée, un hexose et un groupement phosphate", isCorrect: false, order: 3 },
      { text: "Une purine, une pyrimidine et un pentose", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant la structure de l'ADN, quelle proposition est Fausse ?",
    difficulty: "MEDIUM",
    explanation: "L'ADN mitochondrial est distinct de l'ADN nucléaire (génome mitochondrial circulaire, transmis par la mère, code pour certaines protéines). Toutes les autres propositions sont correctes.",
    keywords: "ADN, structure, mitochondrie, Chargaff, phosphodiester",
    options: [
      { text: "L'ADN est une double hélice formée de deux brins antiparallèles", isCorrect: false, order: 0 },
      { text: "Les bases azotées sont appariées par liaisons hydrogène selon la règle de Chargaff : A=T (2 liaisons) et G≡C (3 liaisons)", isCorrect: false, order: 1 },
      { text: "La liaison phosphodiester s'établit entre le carbone 5' d'un nucléotide et le carbone 3' du nucléotide suivant", isCorrect: false, order: 2 },
      { text: "L'ADN mitochondrial est identique à l'ADN nucléaire en termes de séquence et de structure", isCorrect: true, order: 3 },
      { text: "L'uracile est une base spécifique de l'ARN, remplacée par la thymine dans l'ADN", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Un technicien souhaite identifier la nature d'un oside inconnu. Il réalise une hydrolyse acide suivie d'une chromatographie. Le chromatogramme montre la présence de glucose et de fructose. L'hydrolyse enzymatique par une α-glucosidase libère également du glucose et du fructose. Le composé est probablement :",
    difficulty: "MEDIUM",
    explanation: "Le saccharose est le seul diholoside naturel donnant glucose + fructose. Le lactose donne glucose + galactose, le maltose donne deux glucoses, le raffinose est un triholoside, et le glycogène est un polyoside.",
    keywords: "oside, saccharose, glucose, fructose, hydrolyse",
    options: [
      { text: "Le lactose", isCorrect: false, order: 0 },
      { text: "Le maltose", isCorrect: false, order: 1 },
      { text: "Le saccharose", isCorrect: true, order: 2 },
      { text: "Le raffinose", isCorrect: false, order: 3 },
      { text: "Le glycogène", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant les propriétés des acides nucléiques, laquelle des affirmations suivantes est INCORRECTE ?",
    difficulty: "HARD",
    explanation: "C'est l'inverse : l'ARN est moins stable que l'ADN en milieu alcalin car le groupement OH en 2' du ribose permet une hydrolyse alcaline (formation de 2',3'-phosphate cyclique). L'ADN n'a pas de OH en 2' (désoxyribose), donc plus stable.",
    keywords: "acides nucléiques, ADN, ARN, stabilité, alcalin",
    options: [
      { text: "L'ADN absorbe la lumière UV de manière maximale à 260 nm, propriété utilisée pour son dosage", isCorrect: false, order: 0 },
      { text: "L'ADN simple brin absorbe 12 à 40% plus de lumière que l'ADN double brin", isCorrect: false, order: 1 },
      { text: "L'ARN est plus stable que l'ADN en milieu alcalin car il possède un groupement OH en position 2'", isCorrect: true, order: 2 },
      { text: "L'ADN est insoluble dans l'éthanol et peut être précipité par ce solvant", isCorrect: false, order: 3 },
      { text: "La dénaturation de l'ADN par chauffage sépare les deux brins en rompant les liaisons hydrogène, et un refroidissement lent permet sa renaturation", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Un patient présente un déficit enzymatique dans le métabolisme d'un acide aminé conduisant à une aminoacidurie. L'analyse de ses urines révèle un excès de phénylalanine. La réaction de Sanger (DNFB) sur un peptide extrait de ce patient permettrait de :",
    difficulty: "HARD",
    explanation: "La réaction de Sanger (DNFB ou 1-fluoro-2,4-dinitrobenzène) permet d'identifier l'acide aminé N-terminal d'un peptide ou d'une protéine en formant un dérivé dinitrophénylé coloré.",
    keywords: "Sanger, DNFB, N-terminal, peptide, phénylalanine",
    options: [
      { text: "Doser spécifiquement la phénylalanine par coloration à la ninhydrine", isCorrect: false, order: 0 },
      { text: "Identifier l'acide aminé N-terminal du peptide par formation d'un dérivé dinitrophénylé", isCorrect: true, order: 1 },
      { text: "Hydrolyser les liaisons peptidiques pour libérer tous les acides aminés", isCorrect: false, order: 2 },
      { text: "Oxyler la phénylalanine en tyrosine par l'acide performique", isCorrect: false, order: 3 },
      { text: "Mesurer le pouvoir rotatoire du peptide pour déterminer sa configuration D/L", isCorrect: false, order: 4 },
    ],
  },
];

async function main() {
  console.log("Starting to add 15 Biochimie S1 QCM questions...\n");

  // Verify subject exists
  const subject = await prisma.subject.findUnique({
    where: { id: SUBJECT_ID },
    select: { id: true, name: true },
  });

  if (!subject) {
    console.error(`Subject with ID ${SUBJECT_ID} not found!`);
    process.exit(1);
  }
  console.log(`Found subject: ${subject.name} (${subject.id})\n`);

  let created = 0;
  let errors = 0;

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
          isPublished: true, // Published immediately
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
      console.log(`✓ QCM ${i + 1}/15 added (ID: ${question.id}) — Correct: ${correctLetter}`);
      created++;
    } catch (error) {
      console.error(`✗ QCM ${i + 1}/15 FAILED:`, error.message);
      errors++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Done! Created: ${created}/15 | Errors: ${errors}`);
  console.log(`All questions are PUBLISHED and ready for students.`);
  console.log(`========================================`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("Fatal error:", e);
  await prisma.$disconnect();
  process.exit(1);
});
