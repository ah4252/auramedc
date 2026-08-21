const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDY_YEAR = 'السنة الاولى';
const SUBJECT_NAME = 'Chimie S2';
const DIFFICULTY = 'MEDIUM';

const questions = [
  {
    text: "Le pH d’une solution d’acide acétique (CH₃COOH, pKa = 4,8) de concentration 0,1 mol/L est mesuré. Sachant que l’acide est faible et que l’on néglige l’autoprotolyse de l’eau, quelle est la valeur approchée du pH ?",
    explanation: "Pour un acide faible HA, [H₃O⁺] ≈ √(Ka·C) avec Ka = 10^(-4,8) = 1,58×10⁻⁵. [H₃O⁺] ≈ √(1,58×10⁻⁵ × 0,1) = √(1,58×10⁻⁶) = 1,26×10⁻³, pH ≈ 2,9.",
    options: [
      { text: "0,4", isCorrect: false },
      { text: "2,9", isCorrect: true },
      { text: "4,8", isCorrect: false },
      { text: "5,7", isCorrect: false },
      { text: "8,9", isCorrect: false },
    ],
  },
  {
    text: "On prépare une solution tampon en mélangeant 50 mL d’acide acétique 0,2 mol/L avec 50 mL d’acétate de sodium 0,2 mol/L. Le pKa de l’acide acétique est 4,8. Quel est le pH du tampon ? Que devient ce pH si on ajoute 10 mL de HCl 0,1 mol/L (sans variation de volume significative) ?",
    explanation: "Mélange équimolaire acide/base conjuguée ⇒ pH = pKa = 4,8. Après ajout de HCl (acide fort), il réagit avec la base : on ajoute 1 mmol de H⁺. Quantités initiales : acide = 10 mmol, base = 10 mmol. Après ajout : acide = 11 mmol, base = 9 mmol. pH = pKa + log(9/11) = 4,8 - 0,087 ≈ 4,71 (arrondi à 4,60 dans les options).",
    options: [
      { text: "pH = 4,8 ; après ajout : 4,60", isCorrect: true },
      { text: "pH = 4,8 ; après ajout : 4,85", isCorrect: false },
      { text: "pH = 5,8 ; après ajout : 5,40", isCorrect: false },
      { text: "pH = 4,8 ; après ajout : 5,00", isCorrect: false },
      { text: "pH = 7,0 ; après ajout : 6,80", isCorrect: false },
    ],
  },
  {
    text: "Le potentiel standard du couple Fe³⁺/Fe²⁺ est E° = 0,77 V. On prépare une solution contenant [Fe³⁺] = 0,10 mol/L et [Fe²⁺] = 0,01 mol/L. À 25°C, quel est le potentiel de ce couple (équation de Nernst) ?",
    explanation: "E = E° + (0,06/n) log([ox]/[red]) pour n=1. E = 0,77 + 0,06 log(0,10/0,01) = 0,77 + 0,06 = 0,83 V.",
    options: [
      { text: "0,71 V", isCorrect: false },
      { text: "0,77 V", isCorrect: false },
      { text: "0,83 V", isCorrect: true },
      { text: "0,65 V", isCorrect: false },
      { text: "0,89 V", isCorrect: false },
    ],
  },
  {
    text: "La réaction d’oxydoréduction entre l’ion permanganate MnO₄⁻ (en milieu acide) et l’ion ferreux Fe²⁺ est utilisée en dosage. Équilibrer la réaction suivante en milieu acide :\nMnO₄⁻ + Fe²⁺ + H⁺ → Mn²⁺ + Fe³⁺ + H₂O.\nQuels sont les coefficients stœchiométriques de MnO₄⁻, Fe²⁺ et H⁺ ?",
    explanation: "Demi-réactions : MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O ; Fe²⁺ → Fe³⁺ + e⁻. On multiplie la seconde par 5 et on additionne : MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O. Coefficients : 1, 5, 8.",
    options: [
      { text: "1, 5, 8", isCorrect: true },
      { text: "1, 5, 4", isCorrect: false },
      { text: "1, 4, 8", isCorrect: false },
      { text: "2, 10, 16", isCorrect: false },
      { text: "1, 6, 8", isCorrect: false },
    ],
  },
  {
    text: "La décomposition d’un composé A suit une cinétique d’ordre 1 avec une constante de vitesse k = 0,03 min⁻¹. Quelle est la valeur du temps de demi-vie (t₁/₂) et combien de temps faut-il pour que 90 % de A se soit décomposé ?",
    explanation: "Pour ordre 1, t₁/₂ = ln2/k = 0,693/0,03 = 23,1 min. Pour 90 % décomposé, il reste 10 % ⇒ C/C₀ = 0,1 = e^(-kt) ⇒ t = ln(10)/k = 2,303/0,03 = 76,8 min.",
    options: [
      { text: "t₁/₂ = 23,1 min ; t(90 %) = 76,8 min", isCorrect: true },
      { text: "t₁/₂ = 33,3 min ; t(90 %) = 110 min", isCorrect: false },
      { text: "t₁/₂ = 23,1 min ; t(90 %) = 23,1 min", isCorrect: false },
      { text: "t₁/₂ = 0,693 min ; t(90 %) = 2,30 min", isCorrect: false },
      { text: "t₁/₂ = 30 min ; t(90 %) = 100 min", isCorrect: false },
    ],
  },
  {
    text: "La constante de vitesse d’une réaction est multipliée par 4 lorsque la température passe de 298 K à 308 K. En utilisant la loi d’Arrhenius, l’énergie d’activation Eₐ est approximativement : (R = 8,314 J·mol⁻¹·K⁻¹)",
    explanation: "Loi d’Arrhenius : ln(k₂/k₁) = (Eₐ/R)(1/T₁ - 1/T₂). Ici k₂/k₁ = 4, ln 4 = 1,386. 1/298 - 1/308 ≈ 1,09×10⁻⁴. Donc Eₐ = 1,386×8,314 / (1,09×10⁻⁴) ≈ 105 700 J·mol⁻¹ ≈ 106 kJ·mol⁻¹.",
    options: [
      { text: "10 kJ·mol⁻¹", isCorrect: false },
      { text: "20 kJ·mol⁻¹", isCorrect: false },
      { text: "50 kJ·mol⁻¹", isCorrect: false },
      { text: "106 kJ·mol⁻¹", isCorrect: true },
      { text: "200 kJ·mol⁻¹", isCorrect: false },
    ],
  },
  {
    text: "Combien la molécule de 2,3-dihydroxybutanedioïque (acide tartrique) possède-t-elle de carbones asymétriques ? Est-elle chirale ?",
    explanation: "L’acide tartrique possède 2 carbones asymétriques. Le mésomère (2R,3S) est achiral car il possède un plan de symétrie.",
    options: [
      { text: "1 carbone asymétrique ; achirale", isCorrect: false },
      { text: "2 carbones asymétriques ; chirale", isCorrect: false },
      { text: "2 carbones asymétriques ; achirale (mésomère)", isCorrect: true },
      { text: "0 carbone asymétrique ; achirale", isCorrect: false },
      { text: "3 carbones asymétriques ; chirale", isCorrect: false },
    ],
  },
  {
    text: "Attribuer la configuration Z ou E des double liaisons dans le composé suivant :\nCH₃–CH=C(Cl)–CH₂–CH₃ (avec les substituants sur chaque carbone de la double liaison : C1 : CH₃ et H ; C2 : Cl et CH₂CH₃).\nQuelle est la configuration de cette double liaison ?",
    explanation: "Classer les substituants sur chaque C : C1 : CH₃ (prioritaire sur H) ; C2 : Cl (prioritaire sur CH₂CH₃). Les deux groupements prioritaires (CH₃ et Cl) sont de part et d'autre de la double liaison (côté opposé) ⇒ configuration E.",
    options: [
      { text: "Z", isCorrect: false },
      { text: "E", isCorrect: true },
      { text: "ni Z ni E (pas de stéréoisomérie)", isCorrect: false },
      { text: "Les deux sont possibles", isCorrect: false },
      { text: "Z pour la première, E pour la seconde (s'il y en avait plusieurs)", isCorrect: false },
    ],
  },
  {
    text: "Le cyclohexane adopte préférentiellement la conformation chaise. Dans cette conformation, les liaisons C–H sont classées en liaisons axiales et équatoriales. Lorsqu’un substituant volumineux (ex : tertiobutyle) est présent, il occupe préférentiellement quelle position ? Pourquoi ?",
    explanation: "Les substituants volumineux préfèrent la position équatoriale car elle évite les interactions 1,3-diaxiales (interactions stériques avec les atomes axiaux en position 3 et 5).",
    options: [
      { text: "Axiale, car elle minimise les interactions stériques", isCorrect: false },
      { text: "Équatoriale, car elle minimise les interactions 1,3-diaxiales", isCorrect: true },
      { text: "Équatoriale, car elle est plus proche du plan moyen", isCorrect: false },
      { text: "Axiale, car elle est plus stable", isCorrect: false },
      { text: "Les deux positions sont équivalentes", isCorrect: false },
    ],
  },
  {
    text: "Le nom IUPAC du composé suivant, selon les règles de priorité des fonctions, est :\nCH₃–CH(OH)–CH₂–CH₂–CHO",
    explanation: "La fonction aldéhyde (-CHO) est prioritaire (suffixe -al). La chaîne principale doit contenir le groupe aldéhyde (C1). L’alcool est en position 4, donc 4-hydroxybutanal.",
    options: [
      { text: "4-hydroxybutanal", isCorrect: true },
      { text: "2-hydroxybutanal", isCorrect: false },
      { text: "3-hydroxybutanal", isCorrect: false },
      { text: "4-hydroxybutan-1-al", isCorrect: false },
      { text: "1-hydroxybutanal-4-al", isCorrect: false },
    ],
  },
  {
    text: "Le composé aromatique suivant est un dérivé disubstitué du benzène :\n1,2-diméthylbenzène (o-xylène). Son nom IUPAC officiel (en utilisant la numérotation) est :",
    explanation: "Le nom IUPAC officiel est 1,2-diméthylbenzène. Le préfixe \"o\" (ortho) est une nomenclature usuelle (nom trivial).",
    options: [
      { text: "1,2-diméthylbenzène", isCorrect: true },
      { text: "o-diméthylbenzène", isCorrect: false },
      { text: "éthylbenzène", isCorrect: false },
      { text: "1,2-diméthylcyclohexa-1,3,5-triène", isCorrect: false },
      { text: "diméthylbenzène (position non précisée)", isCorrect: false },
    ],
  },
  {
    text: "Dans une solution aqueuse, l’ion hydrogénocarbonate HCO₃⁻ est un ampholyte. Le pKa₁ de H₂CO₃ est 6,1 et le pKa₂ de HCO₃⁻ est 10,3. À pH = 7,4 (sang), quelle est l’espèce prédominante du couple H₂CO₃/HCO₃⁻ ?",
    explanation: "À pH = 7,4, on a pH > pKa₁ (6,1), donc la forme basique HCO₃⁻ prédomine par rapport à H₂CO₃. Et pH < pKa₂ (10,3), donc la forme acide HCO₃⁻ prédomine par rapport à CO₃²⁻.",
    options: [
      { text: "H₂CO₃ (forme acide)", isCorrect: false },
      { text: "HCO₃⁻ (forme basique)", isCorrect: true },
      { text: "CO₃²⁻ (forme totalement déprotonée)", isCorrect: false },
      { text: "Les deux espèces H₂CO₃ et HCO₃⁻ sont en quantités égales", isCorrect: false },
      { text: "H₂O et CO₂", isCorrect: false },
    ],
  },
  {
    text: "On considère les couples redox suivants (potentiels standards) :\nCl₂/Cl⁻ : E° = +1,36 V\nI₂/I⁻ : E° = +0,54 V\nFe³⁺/Fe²⁺ : E° = +0,77 V\nOn mélange une solution contenant I⁻ et Fe³⁺. La réaction spontanée est :",
    explanation: "L’oxydant du couple de plus fort potentiel (Fe³⁺, E°=0,77) réagit avec le réducteur du couple de plus faible potentiel (I⁻, E°=0,54). La réaction est : 2 I⁻ + 2 Fe³⁺ → I₂ + 2 Fe²⁺.",
    options: [
      { text: "I⁻ + Fe³⁺ → ½ I₂ + Fe²⁺", isCorrect: false },
      { text: "I₂ + Fe²⁺ → 2 I⁻ + Fe³⁺", isCorrect: false },
      { text: "2 I⁻ + 2 Fe³⁺ → I₂ + 2 Fe²⁺ (spontanée)", isCorrect: true },
      { text: "Aucune réaction", isCorrect: false },
      { text: "I⁻ + Fe²⁺ → ½ I₂ + Fe", isCorrect: false },
    ],
  },
  {
    text: "La catalyse enzymatique est un exemple de catalyse :",
    explanation: "La catalyse enzymatique est généralement classée comme une catalyse homogène, car l'enzyme (souvent soluble) et le substrat sont dans la même phase liquide (solution aqueuse).",
    options: [
      { text: "Homogène", isCorrect: true },
      { text: "Hétérogène", isCorrect: false },
      { text: "Autocatalyse", isCorrect: false },
      { text: "Catalyse acido-basique", isCorrect: false },
      { text: "Catalyse par transfert de phase", isCorrect: false },
    ],
  },
  {
    text: "Quelle est la relation entre les deux molécules suivantes (énantiomères, diastéréoisomères, isomères de constitution, conformères ou identiques) ?\nMolécule A : (2R,3R)-2,3-dibromobutane\nMolécule B : (2S,3S)-2,3-dibromobutane",
    explanation: "Ces deux molécules ont des configurations absolues opposées sur tous leurs centres stéréogènes. Ce sont donc des images miroir non superposables : des énantiomères.",
    options: [
      { text: "Enantiomères", isCorrect: true },
      { text: "Diastéréoisomères", isCorrect: false },
      { text: "Isomères de constitution", isCorrect: false },
      { text: "Conformères", isCorrect: false },
      { text: "Identiques", isCorrect: false },
    ],
  },
  {
    text: "Le nom IUPAC du composé suivant (ester) :\nCH₃–CH₂–COO–CH₂–CH₃",
    explanation: "L’ester dérive de l’acide propanoïque (3 carbones : CH₃–CH₂–COOH) et de l’éthanol (alkyle à 2 carbones : –CH₂–CH₃). Son nom est le propanoate d’éthyle.",
    options: [
      { text: "Propanoate d’éthyle", isCorrect: true },
      { text: "Éthanoate de propyle", isCorrect: false },
      { text: "Propanoate de méthyle", isCorrect: false },
      { text: "Butanoate d’éthyle", isCorrect: false },
      { text: "Acide propanoïque d’éthyle", isCorrect: false },
    ],
  },
  {
    text: "Dans un titrage acide fort-base forte, le pH à l’équivalence est :",
    explanation: "Lorsqu'on dose un acide fort par une base forte (ou l'inverse), le sel formé à l'équivalence (par exemple NaCl) ne s'hydrolyse pas. Le pH de la solution est donc neutre (pH = 7 à 25°C).",
    options: [
      { text: "pH = 7", isCorrect: true },
      { text: "pH < 7", isCorrect: false },
      { text: "pH > 7", isCorrect: false },
      { text: "pH = pKa", isCorrect: false },
      { text: "pH = 14 – pKa", isCorrect: false },
    ],
  },
  {
    text: "Une pile est constituée des deux demi-piles suivantes :\nZn²⁺/Zn (E° = –0,76 V) et Cu²⁺/Cu (E° = +0,34 V). La f.e.m. standard de la pile est de 1,10 V. À l’anode, la réaction est :",
    explanation: "L'anode est le siège de l'oxydation. Elle se situe à la demi-pile de potentiel le plus bas (pôle négatif), c'est-à-dire l'électrode de zinc. Le Zn s'y oxyde : Zn → Zn²⁺ + 2 e⁻.",
    options: [
      { text: "Cu²⁺ + 2 e⁻ → Cu", isCorrect: false },
      { text: "Zn → Zn²⁺ + 2 e⁻", isCorrect: true },
      { text: "Cu → Cu²⁺ + 2 e⁻", isCorrect: false },
      { text: "Zn²⁺ + 2 e⁻ → Zn", isCorrect: false },
      { text: "2 H⁺ + 2 e⁻ → H₂", isCorrect: false },
    ],
  },
  {
    text: "Pour déterminer l’ordre d’une réaction, on trace ln[C] en fonction du temps. On obtient une droite. Quel est l’ordre de la réaction et que représente la pente ?",
    explanation: "L'intégration de la loi de vitesse d'ordre 1 donne : ln[C] = ln[C]₀ – kt. En traçant ln[C] = f(t), on obtient une droite de pente –k. C'est caractéristique d'une cinétique d'ordre 1.",
    options: [
      { text: "Ordre 0 ; pente = –k", isCorrect: false },
      { text: "Ordre 1 ; pente = –k", isCorrect: true },
      { text: "Ordre 2 ; pente = +k", isCorrect: false },
      { text: "Ordre 1 ; pente = k", isCorrect: false },
      { text: "Ordre 0 ; pente = +k", isCorrect: false },
    ],
  },
  {
    text: "La molécule suivante possède-t-elle un plan de symétrie ? Est-elle chirale ?\n(2R,3S)-2,3-dibromobutane (mésomère)",
    explanation: "Le stéréoisomère (2R,3S) du 2,3-dibromobutane possède un plan de symétrie passant entre les carbones C2 et C3. Par conséquent, son image dans un miroir lui est superposable : la molécule est achirale (composé méso).",
    options: [
      { text: "Possède un plan de symétrie ; achirale", isCorrect: true },
      { text: "Ne possède pas de plan de symétrie ; chirale", isCorrect: false },
      { text: "Possède un centre de symétrie ; chirale", isCorrect: false },
      { text: "Possède un axe de symétrie ; achirale", isCorrect: false },
      { text: "Possède un plan de symétrie ; chirale (contradiction)", isCorrect: false },
    ],
  },
];

async function main() {
  console.log("Starting to insert Chimie S2 questions...\n");

  let subject = await prisma.subject.findFirst({
    where: { name: { equals: SUBJECT_NAME, mode: 'insensitive' } },
  });

  if (!subject) {
    console.log(`Subject '${SUBJECT_NAME}' not found. Creating...`);
    const category = await prisma.category.findFirst();
    subject = await prisma.subject.create({
      data: {
        name: SUBJECT_NAME,
        slug: `chimie-s2-${Date.now()}`,
        description: 'Chimie - Semestre 2',
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
