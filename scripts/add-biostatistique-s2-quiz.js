const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDY_YEAR = 'السنة الاولى';
const SUBJECT_NAME = 'Biostatistique S2';
const DIFFICULTY = 'MEDIUM';

const questions = [
  {
    text: "Dans un test de conformité comparant la moyenne d'un échantillon à une valeur de référence, on obtient un écart-type σ = 8,3, une moyenne observée x̄ = 22,3, une moyenne théorique μ = 20,9 et un effectif n = 200. La valeur de la statistique de test est z = 2,38. Le test est bilatéral avec α = 5 %. Quelle est la bonne interprétation ?",
    explanation: "z observé = 2,38 > z seuil = 1,96. La p-value = 0,02 < 0,05. On rejette H₀ au risque de 5 %. La différence entre la moyenne observée et la moyenne théorique est statistiquement significative.",
    options: [
      { text: "z observé < z seuil (1,96) → on accepte H₀, la moyenne observée n'est pas significativement différente de la moyenne théorique", isCorrect: false },
      { text: "z observé > z seuil (1,96) → on rejette H₀, la différence est statistiquement significative", isCorrect: true },
      { text: "z observé > z seuil (2,58) → on rejette H₀, la différence est très significative", isCorrect: false },
      { text: "p = 0,02 > 0,05 → on accepte H₀", isCorrect: false },
      { text: "z observé = 2,38 < 2,58 → on accepte H₀ avec un risque de 1 %", isCorrect: false },
    ],
  },
  {
    text: "On compare les taux de cholestérol LDL entre deux populations : non-traitée (n₁=15, m₁=1,81, σ₁=0,50) et traitée (n₂=12, m₂=1,41, σ₂=0,39). La variance commune calculée est σ² = 0,21 et la statistique t = 2,27 avec ddl = 25. La table de Student donne t(α=0,05, ddl=25) = 2,06. Quelle est la conclusion correcte ?",
    explanation: "t observé = 2,27 > t seuil = 2,06. On rejette l'hypothèse nulle H₀ et on retient H₁. Les deux moyennes sont significativement différentes au risque de 5 %.",
    options: [
      { text: "t observé = 2,27 < t seuil = 2,06 → on accepte H₀, les deux moyennes ne sont pas significativement différentes", isCorrect: false },
      { text: "t observé = 2,27 > t seuil = 2,06 → on rejette H₀, les deux moyennes sont significativement différentes", isCorrect: true },
      { text: "t observé = 2,27 > t seuil = 2,06 → on rejette H₀ avec un risque de 1 %", isCorrect: false },
      { text: "Le test n'est pas valide car les effectifs sont inférieurs à 30", isCorrect: false },
      { text: "On ne peut pas conclure car les variances ne sont pas homogènes", isCorrect: false },
    ],
  },
  {
    text: "Dans une étude sur l'effet d'un extrait de plante sur la glycémie, 10 animaux ont été mesurés avant et après traitement. La moyenne des différences est d̄ = 0,57 et la variance des différences est σ² = 0,122. La statistique t calculée est t = 5,16 avec ddl = 9. La table de Student donne t(α=0,05, ddl=9) = 1,833 (test unilatéral). Quelle est la bonne conclusion ?",
    explanation: "Test unilatéral (on vérifie si l'extrait diminue la glycémie). t observé = 5,16 > t seuil = 1,833. On rejette H₀. L'extrait diminue significativement la glycémie.",
    options: [
      { text: "t observé = 5,16 > t seuil = 1,833 → on rejette H₀, l'extrait diminue significativement la glycémie", isCorrect: true },
      { text: "t observé = 5,16 > t seuil = 1,833 → on rejette H₀, l'extrait augmente significativement la glycémie", isCorrect: false },
      { text: "t observé = 5,16 < t seuil = 1,833 → on accepte H₀, l'extrait n'a pas d'effet sur la glycémie", isCorrect: false },
      { text: "Le test n'est pas valide car l'effectif est inférieur à 30", isCorrect: false },
      { text: "On ne peut pas conclure car la variance des différences est trop élevée", isCorrect: false },
    ],
  },
  {
    text: "Un médecin mesure la consommation protéique chez 15 patients (x̄ = 12 g, s = 0,5 g) et souhaite vérifier la conformité à la recommandation de 12,1 g. Avec un risque α = 5 % et ddl = 14, la table de Student donne t(α=0,05, bilatéral, ddl=14) = 2,145. La statistique t calculée est :",
    explanation: "t = (x̄ − μ) / (s / √n) = (12 − 12,1) / (0,5 / √15) = −0,1 / 0,129 = −0,77. |t| = 0,77 < t seuil = 2,145. On accepte H₀ : la consommation n'est pas significativement différente de la recommandation.",
    options: [
      { text: "t = (12 − 12,1) / (0,5 / √15) = −0,77 → on accepte H₀, la consommation est conforme à la recommandation", isCorrect: true },
      { text: "t = (12 − 12,1) / (0,5 / 15) = −3,00 → on rejette H₀", isCorrect: false },
      { text: "t = (12,1 − 12) / (0,5 × √15) = 0,77 → on accepte H₀", isCorrect: false },
      { text: "t = (12 − 12,1) / (0,5² / 15) = −6,00 → on rejette H₀", isCorrect: false },
      { text: "t = (12 − 12,1) / (0,5 / √14) = −0,75 → on accepte H₀", isCorrect: false },
    ],
  },
  {
    text: "Dans une ANOVA à un facteur avec k = 3 groupes et n = 9 observations totales, on obtient les résultats suivants : SCE_F = 24, SCE_R = 6, ddl_F = 2, ddl_R = 6. La table de Fisher donne F(α=5 %, ddl₁=2, ddl₂=6) = 5,14. Quelle est la conclusion ?",
    explanation: "F = CM_F / CM_R = (SCE_F / ddl_F) / (SCE_R / ddl_R) = (24/2) / (6/6) = 12 / 1 = 12. F observé = 12 > F théorique = 5,14. On rejette H₀ : au moins une des moyennes est significativement différente des autres.",
    options: [
      { text: "F = 12 > 5,14 → on rejette H₀, au moins une moyenne est significativement différente des autres", isCorrect: true },
      { text: "F = 4 < 5,14 → on accepte H₀, toutes les moyennes sont égales", isCorrect: false },
      { text: "F = 24/8 = 3,0 < 5,14 → on accepte H₀", isCorrect: false },
      { text: "F = 6/24 = 0,25 < 5,14 → on accepte H₀", isCorrect: false },
      { text: "On ne peut pas conclure car les effectifs sont inférieurs à 30", isCorrect: false },
    ],
  },
  {
    text: "Concernant l'analyse de variance (ANOVA), laquelle des affirmations suivantes concernant les degrés de liberté (ddl) est CORRECTE ?",
    explanation: "Les degrés de liberté corrects sont : ddl_total = n − 1 ; ddl_factorielle = k − 1 ; ddl_résiduelle = n − k. La seule proposition correcte est C : ddl_résiduelle = n − k.",
    options: [
      { text: "ddl_total = n + k", isCorrect: false },
      { text: "ddl_factorielle = n − 1", isCorrect: false },
      { text: "ddl_résiduelle = n − k", isCorrect: true },
      { text: "ddl_total = k − 1", isCorrect: false },
      { text: "ddl_factorielle = n − k", isCorrect: false },
    ],
  },
  {
    text: "Dans un tableau de contingence 2×2, on observe les effectifs suivants : Groupe A : guéris = 77, non guéris = 23 ; Groupe B : guéris = 70, non guéris = 30. Quel est le degré de liberté du test du χ² d'indépendance ?",
    explanation: "ddl = (nombre de lignes − 1) × (nombre de colonnes − 1) = (2 − 1) × (2 − 1) = 1. Le test du χ² d'indépendance sur un tableau 2×2 a toujours 1 degré de liberté.",
    options: [
      { text: "2", isCorrect: false },
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: false },
      { text: "1", isCorrect: true },
      { text: "(2−1) + (2−1) = 2", isCorrect: false },
    ],
  },
  {
    text: "Pour le tableau de contingence de la question 7, l'effectif théorique attendu pour la cellule \"Groupe A et Guéris\" sous l'hypothèse d'indépendance est :",
    explanation: "Effectif théorique = (Total ligne × Total colonne) / Total général. Pour Groupe A (total = 100) et Guéris (total = 77+70 = 147) : (100 × 147) / 200 = 73,5.",
    options: [
      { text: "77", isCorrect: false },
      { text: "73,5", isCorrect: true },
      { text: "70,5", isCorrect: false },
      { text: "76,5", isCorrect: false },
      { text: "80,0", isCorrect: false },
    ],
  },
  {
    text: "Un test du χ² est réalisé pour vérifier si la distribution des groupes sanguins dans un échantillon de 200 personnes (A=90, B=60, AB=15, O=35) correspond aux proportions de la population générale (A=40 %, B=30 %, AB=10 %, O=20 %). Le χ² calculé est de 9,38 et le χ² théorique à 5 % avec ddl = 3 est 7,81. Quelle est la bonne interprétation ?",
    explanation: "χ² observé = 9,38 > χ² théorique = 7,81. On rejette H₀ au risque de 5 %. La distribution des groupes sanguins dans l'échantillon n'est pas conforme à celle de la population générale. Les effectifs théoriques sont tous > 5 (A=80, B=60, AB=20, O=40), le test est valide.",
    options: [
      { text: "χ² = 9,38 > 7,81 → on rejette H₀, la distribution observée n'est pas conforme à celle attendue", isCorrect: true },
      { text: "χ² = 9,38 > 7,81 → on accepte H₀, la distribution observée est conforme", isCorrect: false },
      { text: "χ² = 9,38 < 7,81 → on accepte H₀", isCorrect: false },
      { text: "Le test n'est pas valide car l'effectif de la classe AB est trop faible", isCorrect: false },
      { text: "On ne peut pas conclure car les effectifs théoriques ne sont pas tous > 5", isCorrect: false },
    ],
  },
  {
    text: "La formule de calcul de la statistique du χ² est :",
    explanation: "La formule correcte du χ² est : χ² = Σ (O − T)² / T, où O = effectif observé et T = effectif théorique (attendu). Cette formule quantifie les écarts quadratiques standardisés.",
    options: [
      { text: "χ² = Σ (O − T)² / O", isCorrect: false },
      { text: "χ² = Σ (O − T) / T", isCorrect: false },
      { text: "χ² = Σ (O − T)² / T", isCorrect: true },
      { text: "χ² = Σ (O − T) / √T", isCorrect: false },
      { text: "χ² = Σ (O² − T²) / T", isCorrect: false },
    ],
  },
  {
    text: "Dans un test de comparaison de deux moyennes sur séries appariées, la statistique de test t s'écrit :",
    explanation: "Pour un test sur série appariée, la statistique t = d̄ / (σ_d / √n) où d̄ est la moyenne des différences et σ_d est l'écart-type des différences.",
    options: [
      { text: "t = (x̄₁ − x̄₂) / √(σ₁²/n₁ + σ₂²/n₂)", isCorrect: false },
      { text: "t = (d̄) / (σ_d / √n)", isCorrect: true },
      { text: "t = (x̄₁ − x̄₂) / √(σ²(1/n₁ + 1/n₂))", isCorrect: false },
      { text: "t = (d̄) × √n / σ_d", isCorrect: false },
      { text: "t = (d̄) / (σ_d × √n)", isCorrect: false },
    ],
  },
  {
    text: "Concernant le coefficient de corrélation r, lequel des énoncés suivants est FAUX ?",
    explanation: "r = 0 signifie qu'il n'y a pas de corrélation linéaire entre X et Y, mais cela n'implique pas l'indépendance des variables. Deux variables peuvent être dépendantes de manière non linéaire avec r = 0.",
    options: [
      { text: "r est compris entre −1 et +1", isCorrect: false },
      { text: "r = 0 signifie que X et Y sont indépendantes", isCorrect: true },
      { text: "r = 1 indique une corrélation linéaire positive parfaite", isCorrect: false },
      { text: "r = −1 indique une corrélation linéaire négative parfaite", isCorrect: false },
      { text: "r mesure l'intensité et le sens de la relation linéaire entre X et Y", isCorrect: false },
    ],
  },
  {
    text: "La méthode des moindres carrés pour estimer les paramètres de la droite de régression y = ax + b consiste à :",
    explanation: "La méthode des moindres carrés consiste à minimiser la somme des carrés des résidus Σ (yᵢ − ŷᵢ)², c'est-à-dire les écarts au carré entre les valeurs observées et les valeurs prédites par le modèle.",
    options: [
      { text: "Minimiser Σ (yᵢ − ŷᵢ)", isCorrect: false },
      { text: "Minimiser Σ (yᵢ − ŷᵢ)²", isCorrect: true },
      { text: "Maximiser Σ (yᵢ − ŷᵢ)²", isCorrect: false },
      { text: "Minimiser Σ |yᵢ − ŷᵢ|", isCorrect: false },
      { text: "Maximiser le coefficient de corrélation r", isCorrect: false },
    ],
  },
  {
    text: "Le coefficient de détermination R² dans une régression linéaire représente :",
    explanation: "R² (coefficient de détermination) représente la proportion de la variance de Y qui est expliquée par la variable X dans le modèle de régression linéaire. Il varie entre 0 et 1 et correspond au carré du coefficient de corrélation r.",
    options: [
      { text: "Le pourcentage de variance de Y expliquée par X", isCorrect: true },
      { text: "La pente de la droite de régression", isCorrect: false },
      { text: "L'ordonnée à l'origine de la droite de régression", isCorrect: false },
      { text: "La covariance entre X et Y", isCorrect: false },
      { text: "Le coefficient de corrélation r", isCorrect: false },
    ],
  },
  {
    text: "Dans une ANOVA, le carré moyen (CM) se calcule par :",
    explanation: "Le carré moyen (CM) est le rapport de la somme des carrés des écarts (SCE) sur son degré de liberté (ddl) : CM = SCE / ddl.",
    options: [
      { text: "CM = SCE / ddl", isCorrect: true },
      { text: "CM = ddl × SCE", isCorrect: false },
      { text: "CM = SCE × ddl", isCorrect: false },
      { text: "CM = √(SCE / ddl)", isCorrect: false },
      { text: "CM = SCE / (ddl + 1)", isCorrect: false },
    ],
  },
  {
    text: "La statistique F dans une ANOVA est le rapport :",
    explanation: "La statistique F = CM_F / CM_R, où CM_F est le carré moyen factoriel (intergroupe) et CM_R est le carré moyen résiduel (intragroupe). Un grand F indique une variance intergroupe importante.",
    options: [
      { text: "CM_F / CM_R", isCorrect: true },
      { text: "CM_R / CM_F", isCorrect: false },
      { text: "SCE_F / SCE_R", isCorrect: false },
      { text: "SCE_R / SCE_F", isCorrect: false },
      { text: "ddl_F / ddl_R", isCorrect: false },
    ],
  },
  {
    text: "Dans un test de conformité avec n ≥ 30, on utilise la loi de Gauss (test z). Pour un test bilatéral avec α = 5 %, la valeur seuil est :",
    explanation: "Pour un test bilatéral avec α = 5 %, la valeur seuil de la loi normale centrée réduite est z = 1,96 (seuil partagé : 2,5 % de chaque côté). Pour un test unilatéral à 5 %, le seuil serait 1,645. Pour bilatéral à 1 %, le seuil serait 2,58.",
    options: [
      { text: "1,96", isCorrect: true },
      { text: "2,58", isCorrect: false },
      { text: "1,645", isCorrect: false },
      { text: "2,33", isCorrect: false },
      { text: "1,28", isCorrect: false },
    ],
  },
  {
    text: "Un échantillon de taille n = 20 a une moyenne x̄ = 25 et un écart-type s = 4. On souhaite tester si la moyenne de la population est différente de 23 (test bilatéral, α = 5 %). La valeur de la statistique t et la conclusion sont :",
    explanation: "t = (25−23) / (4/√20) = 2 / 0,894 = 2,236 ≈ 2,24. ddl = n − 1 = 19. t(19, α=5 % bilatéral) = 2,093. t observé (2,24) > t seuil (2,093) → on rejette H₀.",
    options: [
      { text: "t = (25−23) / (4/√20) = 2,24 ; ddl = 19 ; t(19, α=0,05 bilatéral) = 2,093 → on rejette H₀", isCorrect: true },
      { text: "t = (25−23) / (4/20) = 10 ; on rejette H₀", isCorrect: false },
      { text: "t = (25−23) / (4²/20) = 5 ; on rejette H₀", isCorrect: false },
      { text: "t = (25−23) / (4×√20) = 0,22 ; on accepte H₀", isCorrect: false },
      { text: "Le test n'est pas valide car n < 30", isCorrect: false },
    ],
  },
  {
    text: "Dans une ANOVA, l'équation fondamentale de décomposition de la variance s'écrit :",
    explanation: "L'équation fondamentale de l'ANOVA est : SCE_Totale = SCE_Factorielle + SCE_Résiduelle. La variance totale se décompose en variance intergroupe (expliquée par le facteur) et variance intragroupe (résiduelle).",
    options: [
      { text: "SCE_Totale = SCE_Factorielle + SCE_Résiduelle", isCorrect: true },
      { text: "SCE_Totale = SCE_Factorielle − SCE_Résiduelle", isCorrect: false },
      { text: "SCE_Totale = SCE_Factorielle × SCE_Résiduelle", isCorrect: false },
      { text: "SCE_Factorielle = SCE_Totale + SCE_Résiduelle", isCorrect: false },
      { text: "SCE_Résiduelle = SCE_Totale + SCE_Factorielle", isCorrect: false },
    ],
  },
  {
    text: "Un test du χ² d'indépendance est réalisé sur un tableau de contingence 3×4. Le degré de liberté est :",
    explanation: "ddl = (lignes − 1) × (colonnes − 1) = (3 − 1) × (4 − 1) = 2 × 3 = 6.",
    options: [
      { text: "6", isCorrect: true },
      { text: "12", isCorrect: false },
      { text: "7", isCorrect: false },
      { text: "5", isCorrect: false },
      { text: "11", isCorrect: false },
    ],
  },
];

async function main() {
  console.log("Starting to insert Biostatistique S2 questions...\n");

  let subject = await prisma.subject.findFirst({
    where: { name: { equals: SUBJECT_NAME, mode: 'insensitive' } },
  });

  if (!subject) {
    console.log(`Subject '${SUBJECT_NAME}' not found. Creating...`);
    const category = await prisma.category.findFirst();
    subject = await prisma.subject.create({
      data: {
        name: SUBJECT_NAME,
        slug: `biostatistique-s2-${Date.now()}`,
        description: 'Biostatistique - Semestre 2',
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
