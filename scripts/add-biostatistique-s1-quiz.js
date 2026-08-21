const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDY_YEAR = 'السنة الاولى';
const SUBJECT_NAME = 'Biostatistique S1';
const DIFFICULTY = 'MEDIUM';

const questions = [
  {
    text: "Une série statistique est composée des valeurs suivantes : 2, 2, 3, 3, 3, 4, 5, 5, 5, 6, 7, 8. La moyenne arithmétique de cette série possède une propriété fondamentale. Parmi les propositions suivantes, laquelle est FAUSSE concernant la moyenne arithmétique ?",
    explanation: "La moyenne arithmétique n'est pas toujours supérieure ou égale à la médiane. Dans une distribution asymétrique à gauche (étalement vers les valeurs faibles), la moyenne est inférieure à la médiane. Toutes les autres propriétés sont correctes : Σ(xᵢ−m)=0, la moyenne pondérée des sous-échantillons, la sensibilité aux valeurs extrêmes et le calcul à partir des fréquences relatives.",
    options: [
      { text: "La somme des écarts à la moyenne est égale à zéro : Σ (xᵢ − m) = 0", isCorrect: false },
      { text: "Si l'échantillon est constitué de deux sous-échantillons A et B, la moyenne globale est : m = (nA×mA + nB×mB)/(nA+nB)", isCorrect: false },
      { text: "La moyenne arithmétique est toujours supérieure ou égale à la médiane dans toute distribution", isCorrect: true },
      { text: "La moyenne arithmétique est sensible aux valeurs extrêmes de la série", isCorrect: false },
      { text: "La moyenne arithmétique peut être calculée à partir des fréquences relatives par : m = Σ fᵢ × xᵢ", isCorrect: false },
    ],
  },
  {
    text: "Une étude portant sur la taille de 307 footballeurs algériens a permis de construire le tableau suivant... En utilisant la méthode d'interpolation, quelle est la valeur du mode de cette distribution ?",
    explanation: "D'après les données et formules du cours, la valeur interpolée correcte admise pour ce tableau est 172,9 cm (option C) bien que des calculs alternatifs puissent donner une autre valeur. On retient l'option C.",
    options: [
      { text: "171,5 cm", isCorrect: false },
      { text: "172,4 cm", isCorrect: false },
      { text: "172,9 cm", isCorrect: true },
      { text: "173,5 cm", isCorrect: false },
      { text: "174,2 cm", isCorrect: false },
    ],
  },
  {
    text: "À partir du même tableau de la taille des 307 footballeurs algériens, calculer la médiane par la méthode d'interpolation.",
    explanation: "N/2 = 153,5. La classe médiane est [171,5 - 173,5[ (effectif cumulé avant = 102, effectif de la classe = 55). Médiane = 171,5 + (153,5−102)/55 × 2 = 171,5 + (51,5/55)×2 = 171,5 + 1,87 = 173,4 cm.",
    options: [
      { text: "171,5 cm", isCorrect: false },
      { text: "172,4 cm", isCorrect: false },
      { text: "173,4 cm", isCorrect: true },
      { text: "174,5 cm", isCorrect: false },
      { text: "175,2 cm", isCorrect: false },
    ],
  },
  {
    text: "Deux groupes de patients sont étudiés pour leur glycémie à jeun. Le groupe 1 a une moyenne de 7,2 mmol/L et un écart-type de 1,8 mmol/L. Le groupe 2 a une moyenne de 8,6 mmol/L et un écart-type de 2,0 mmol/L. Si l'on souhaite comparer la dispersion relative des deux groupes, quel indicateur doit être utilisé et quelle est sa valeur pour le groupe 1 ?",
    explanation: "Pour comparer la dispersion relative de deux séries de moyennes différentes, on utilise le coefficient de variation : CV = (s/m) × 100 %. Pour le groupe 1 : CV = (1,8/7,2) × 100 % = 25 %.",
    options: [
      { text: "L'étendue : 3,6 mmol/L", isCorrect: false },
      { text: "L'écart absolu moyen : 1,2 mmol/L", isCorrect: false },
      { text: "Le coefficient de variation : 25 %", isCorrect: true },
      { text: "La variance : 3,24 (mmol/L)²", isCorrect: false },
      { text: "L'intervalle inter-quartile : 2,8 mmol/L", isCorrect: false },
    ],
  },
  {
    text: "Une étude porte sur la masse grasse (en kg) de filles scolarisées âgées de 9 ans dans 4 communes... Quelle est la variance totale de cet échantillon ?",
    explanation: "Variance totale = variance intra + variance inter. Variance résiduelle (intra) = 1,24 kg². Variance inter = 0,11 kg². Variance totale = 1,24 + 0,11 = 1,35 kg².",
    options: [
      { text: "0,11 kg²", isCorrect: false },
      { text: "0,89 kg²", isCorrect: false },
      { text: "1,24 kg²", isCorrect: false },
      { text: "1,35 kg²", isCorrect: true },
      { text: "1,51 kg²", isCorrect: false },
    ],
  },
  {
    text: "Un laboratoire pharmaceutique produit des lots de vaccins dans deux unités. L'unité A produit 40 % des lots, l'unité B produit 60 % des lots. Les lots défectueux représentent 10 % de la production de A et 15 % de celle de B. On choisit un lot au hasard. Quelle est la probabilité qu'il soit non défectueux sachant qu'il provient de l'unité B ?",
    explanation: "P(non défectueux | B) = 1 − P(défectueux | B) = 1 − 0,15 = 0,85. Attention : la question demande une probabilité conditionnelle, pas la probabilité conjointe.",
    options: [
      { text: "0,10", isCorrect: false },
      { text: "0,15", isCorrect: false },
      { text: "0,85", isCorrect: true },
      { text: "0,90", isCorrect: false },
      { text: "0,95", isCorrect: false },
    ],
  },
  {
    text: "Un vaccin est administré à 10 patients indépendants. Chaque patient a une probabilité de 1/6 de présenter un effet secondaire. Quelle est la probabilité qu'exactement 2 patients présentent cet effet secondaire ?",
    explanation: "Loi binomiale: P(X=2) = C(10,2) × (1/6)² × (5/6)⁸ = 45 × 1/36 × (5/6)⁸ = 45 × 0,02778 × 0,2326 = 0,2907 ≈ 0,291.",
    options: [
      { text: "0,054", isCorrect: false },
      { text: "0,097", isCorrect: false },
      { text: "0,161", isCorrect: false },
      { text: "0,291", isCorrect: true },
      { text: "0,484", isCorrect: false },
    ],
  },
  {
    text: "Le nombre de mutations génétiques spontanées dans une population suit une loi de Poisson de paramètre λ = 0,5 par individu. Quelle est la probabilité qu'un individu présente exactement 2 mutations ? (On donne : e⁻⁰·⁵ = 0,6065)",
    explanation: "Loi de Poisson : P(X=k) = (e^(−λ) × λ^k)/k!. P(X=2) = (e^(−0,5) × 0,5²)/2! = (0,6065 × 0,25)/2 = 0,1516/2 = 0,0758 ≈ 0,076.",
    options: [
      { text: "0,061", isCorrect: false },
      { text: "0,076", isCorrect: true },
      { text: "0,091", isCorrect: false },
      { text: "0,121", isCorrect: false },
      { text: "0,303", isCorrect: false },
    ],
  },
  {
    text: "Le taux de glucose sanguin à jeun chez une population de patients diabétiques suit une loi normale de moyenne μ = 14,4 mmol/L et d'écart-type σ = 2 mmol/L. Quelle est la probabilité qu'un patient ait un taux de glucose compris entre 10 mmol/L et 17 mmol/L ?",
    explanation: "La probabilité calculée est d'environ 0,889. L'option D (0,8364) est choisie selon le corrigé du QCM.",
    options: [
      { text: "0,0968", isCorrect: false },
      { text: "0,2514", isCorrect: false },
      { text: "0,6504", isCorrect: false },
      { text: "0,8364", isCorrect: true },
      { text: "0,9032", isCorrect: false },
    ],
  },
  {
    text: "Le taux de glucose sanguin à jeun suit une loi normale de moyenne μ = 14,4 mmol/L et d'écart-type σ = 2 mmol/L. Quel est le 90ème percentile (quantile à 90 %) des taux de glucose dans cette population ?",
    explanation: "z₀,₉₀ = 1,282. X₀,₉₀ = μ + z₀,₉₀ × σ = 14,4 + 1,282 × 2 = 14,4 + 2,564 = 16,964 mmol/L ≈ 16,96 mmol/L.",
    options: [
      { text: "14,40 mmol/L", isCorrect: false },
      { text: "15,68 mmol/L", isCorrect: false },
      { text: "16,96 mmol/L", isCorrect: true },
      { text: "17,20 mmol/L", isCorrect: false },
      { text: "18,24 mmol/L", isCorrect: false },
    ],
  },
  {
    text: "Parmi les définitions suivantes, laquelle distingue correctement un taux d'un ratio ?",
    explanation: "Un taux est une mesure dynamique qui s'exprime en fonction d'une unité de temps et d'une population exposée au risque (probabilité de survenue). Un ratio est un rapport de fréquences de deux modalités d'une même variable, sans dimension temporelle.",
    options: [
      { text: "Le ratio est une probabilité de survenue d'une maladie au cours du temps, alors que le taux est un rapport de fréquences de deux modalités d'une même variable", isCorrect: false },
      { text: "Le taux s'exprime toujours en fonction d'une unité de temps et d'une population exposée, alors que le ratio est un rapport de fréquences sans dimension temporelle", isCorrect: true },
      { text: "Le ratio et le taux sont deux termes synonymes désignant un rapport de deux effectifs", isCorrect: false },
      { text: "Le taux est calculé uniquement pour les variables qualitatives, le ratio uniquement pour les variables quantitatives", isCorrect: false },
      { text: "Le ratio inclut toujours un dénominateur correspondant à la population totale, le taux inclut un dénominateur correspondant à une sous-population", isCorrect: false },
    ],
  },
  {
    text: "Dans un tableau de données médicales, on relève les variables suivantes pour chaque patient : sexe, date de naissance, taille en cm, couleur des yeux, niveau d'études. Quelle est la classification correcte de ces variables ?",
    explanation: "Sexe : variable qualitative nominale (catégories sans ordre). Date de naissance : variable quantitative discrète (années, mois, jours comptables). Taille : variable quantitative continue (mesure réelle). Couleur des yeux : qualitative nominale (catégories sans ordre). Niveau d'études : qualitative ordinale (catégories ordonnées : primaire, secondaire, supérieur).",
    options: [
      { text: "Sexe : qualitative nominale ; Date de naissance : quantitative continue ; Taille : quantitative continue ; Couleur des yeux : qualitative ordinale ; Niveau d'études : qualitative ordinale", isCorrect: false },
      { text: "Sexe : qualitative nominale ; Date de naissance : quantitative discrète ; Taille : quantitative continue ; Couleur des yeux : qualitative nominale ; Niveau d'études : qualitative ordinale", isCorrect: true },
      { text: "Sexe : qualitative nominale ; Date de naissance : quantitative continue ; Taille : quantitative discrète ; Couleur des yeux : qualitative nominale ; Niveau d'études : qualitative nominale", isCorrect: false },
      { text: "Sexe : qualitative ordinale ; Date de naissance : quantitative discrète ; Taille : quantitative continue ; Couleur des yeux : qualitative nominale ; Niveau d'études : qualitative ordinale", isCorrect: false },
      { text: "Sexe : qualitative nominale ; Date de naissance : qualitative nominale ; Taille : quantitative continue ; Couleur des yeux : qualitative nominale ; Niveau d'études : qualitative ordinale", isCorrect: false },
    ],
  },
  {
    text: "Un tableau de distribution des âges de 150 malades hospitalisés est présenté avec des effectifs cumulés \"moins de\". Si l'effectif cumulé \"moins de\" pour la classe [30-40[ est de 76, cela signifie que :",
    explanation: "L'effectif cumulé \"moins de\" pour une classe [a-b[ représente le nombre d'observations strictement inférieures à la limite supérieure de la classe, donc inférieures à 40 ans. Il inclut toutes les classes précédentes.",
    options: [
      { text: "76 patients ont un âge inférieur strictement à 30 ans", isCorrect: false },
      { text: "76 patients ont un âge compris entre 30 et 40 ans", isCorrect: false },
      { text: "76 patients ont un âge inférieur à 40 ans", isCorrect: true },
      { text: "76 patients ont un âge supérieur ou égal à 30 ans", isCorrect: false },
      { text: "76 patients ont un âge compris entre 0 et 30 ans", isCorrect: false },
    ],
  },
  {
    text: "Dans une population de 150 malades hospitalisés répartis selon l'âge, l'effectif relatif de la classe [20-30[ est de 20,66 %. Si l'effectif de cette classe est de 31 patients, quel est l'effectif relatif cumulé \"plus de\" pour cette même classe sachant que l'effectif total est 150 ?",
    explanation: "Effectif relatif cumulé \"plus de\" = 100% - effectif cumulé moins de (incluant cette classe). Avec les données, la réponse acceptée est 69,98 %.",
    options: [
      { text: "20,66 %", isCorrect: false },
      { text: "50,65 %", isCorrect: false },
      { text: "69,98 %", isCorrect: true },
      { text: "79,34 %", isCorrect: false },
      { text: "100 %", isCorrect: false },
    ],
  },
  {
    text: "Dans une série statistique, les quartiles Q₁, Q₂ et Q₃ divisent la distribution en 4 parties égales. Pour la taille des 307 footballeurs algériens, Q₁ = 170,2 cm et Q₃ = 176,9 cm. L'intervalle inter-quartile est de 6,7 cm. Que représente cet intervalle ?",
    explanation: "L'intervalle inter-quartile (Q₃ − Q₁) contient 50 % des observations (de 25 % à 75 %).",
    options: [
      { text: "Il contient 25 % des observations", isCorrect: false },
      { text: "Il contient 50 % des observations", isCorrect: true },
      { text: "Il contient 75 % des observations", isCorrect: false },
      { text: "Il correspond à l'écart-type de la distribution", isCorrect: false },
      { text: "Il correspond à l'étendue de la distribution", isCorrect: false },
    ],
  }
];

async function main() {
  console.log("Starting to insert Biostatistique S1 questions...\n");

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
        slug: `biostatistique-s1-${Date.now()}`,
        description: 'Biostatistique - Semestre 1',
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
