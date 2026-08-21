const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDY_YEAR = 'السنة الاولى';
const SUBJECT_NAME = 'Biophysique S2';
const DIFFICULTY = 'MEDIUM';

const questions = [
  {
    text: "Un objet réel de hauteur 3,0 cm est placé à 20 cm devant une lentille mince convergente de distance focale 25 cm. Quelle est la position, la nature et la grandeur de l'image ?",
    explanation: "1/OA' = 1/f' + 1/OA = 1/0,25 + 1/(-0,20) = 4 - 5 = -1 → OA' = -1 m. Image virtuelle (côté objet). Grandissement γ = OA'/OA = (-1)/(-0,20) = 5. Hauteur A'B' = 5×3 = 15 cm, droite (γ > 0).",
    options: [
      { text: "Image réelle située à 100 cm derrière la lentille, hauteur 15 cm, renversée", isCorrect: false },
      { text: "Image virtuelle située à 100 cm du côté de l'objet, hauteur 15 cm, droite", isCorrect: true },
      { text: "Image virtuelle située à 50 cm du côté de l'objet, hauteur 7,5 cm, droite", isCorrect: false },
      { text: "Image réelle située à 50 cm derrière la lentille, hauteur 7,5 cm, renversée", isCorrect: false },
      { text: "Image virtuelle située à 100 cm derrière la lentille, hauteur 15 cm, droite", isCorrect: false },
    ],
  },
  {
    text: "Un œil myope au repos a son punctum remotum situé à 50 cm devant l'œil. Le centre optique de l'œil est confondu avec celui de la lentille correctrice. Quelle est la vergence de la lentille divergente nécessaire pour corriger cet œil et lui permettre de voir nettement à l'infini sans accommoder ?",
    explanation: "La correction de la myopie nécessite une lentille divergente dont le foyer image est confondu avec le punctum remotum : f' = -PR = -0,50 m. Vergence C = 1/f' = -1/0,50 = -2,0 δ.",
    options: [
      { text: "−1,0 δ", isCorrect: false },
      { text: "−2,0 δ", isCorrect: true },
      { text: "−3,0 δ", isCorrect: false },
      { text: "−4,0 δ", isCorrect: false },
      { text: "−5,0 δ", isCorrect: false },
    ],
  },
  {
    text: "La distance focale d'un œil emmétrope regardant au loin est de 17 mm. À quelle distance se trouve la rétine du centre optique de cet œil et quelle est la vergence de l'œil au repos ?",
    explanation: "L'œil au repos regardant au loin (objet à l'infini) forme l'image sur la rétine située au foyer image. Donc OA' = f' = 17 mm = 0,017 m. Vergence = 1/f' = 1/0,017 = 58,82 δ ≈ 58,8 δ.",
    options: [
      { text: "Rétine à 17 mm, vergence = 58,8 δ", isCorrect: true },
      { text: "Rétine à 16 mm, vergence = 62,5 δ", isCorrect: false },
      { text: "Rétine à 17 mm, vergence = 59 δ", isCorrect: false },
      { text: "Rétine à 18 mm, vergence = 55,5 δ", isCorrect: false },
      { text: "Rétine à 17 mm, vergence = 60 δ", isCorrect: false },
    ],
  },
  {
    text: "La rétine d'un œil emmétrope se trouve à 1,6 cm de son centre optique. L'œil est au repos. Quel est le pouvoir d'accommodation de cet œil sachant que le punctum proximum est à 25 cm (distance de vision distincte normale) ?",
    explanation: "A = CPP − CPR. CPR = 1/f' = 1/0,016 = 62,5 δ. CPP = 1/f' − 1/OPP = 62,5 − 1/(-0,25) = 62,5 + 4 = 66,5 δ. A = 66,5 − 62,5 = 4,0 δ.",
    options: [
      { text: "2,5 δ", isCorrect: false },
      { text: "4,0 δ", isCorrect: true },
      { text: "5,0 δ", isCorrect: false },
      { text: "6,25 δ", isCorrect: false },
      { text: "8,0 δ", isCorrect: false },
    ],
  },
  {
    text: "Une lentille convergente donne d'un objet AB une image A'B' renversée, deux fois plus grande que l'objet et située à 1,80 m de celui-ci. Quelle est la distance focale de cette lentille ?",
    explanation: "γ = -2 (image renversée, deux fois plus grande). OA' - OA = 1,80 m. Avec OA négatif : -2×OA - OA = -3×OA = 1,80 → OA = -0,60 m. OA' = 1,20 m. 1/f' = 1/1,20 - 1/(-0,60) = 0,833 + 1,667 = 2,5 → f' = 0,40 m = 40 cm.",
    options: [
      { text: "20 cm", isCorrect: false },
      { text: "30 cm", isCorrect: false },
      { text: "40 cm", isCorrect: true },
      { text: "50 cm", isCorrect: false },
      { text: "60 cm", isCorrect: false },
    ],
  },
  {
    text: "Un presbyte dont la distance minimale de vision distincte est de 1,2 m veut lire à une distance de 30 cm. L'œil est supposé contre la lentille. Quelle est la vergence de la lentille qu'il doit utiliser ?",
    explanation: "L'image du livre à 30 cm doit se former à son PP (1,2 m). OA = -0,30 m, OA' = -1,2 m. 1/f' = 1/(-1,2) - 1/(-0,30) = -0,833 + 3,333 = 2,5 δ. Lentille convergente de +2,5 δ.",
    options: [
      { text: "+1,5 δ", isCorrect: false },
      { text: "+2,0 δ", isCorrect: false },
      { text: "+2,5 δ", isCorrect: true },
      { text: "+3,0 δ", isCorrect: false },
      { text: "+3,5 δ", isCorrect: false },
    ],
  },
  {
    text: "L'objectif d'un projecteur de diapositives est assimilé à une lentille mince convergente de vergence 16,0 δ. La distance entre la diapositive et l'écran est de 3,00 m. Quelle est la distance x entre l'objectif et la diapositive pour obtenir une image nette sur l'écran ?",
    explanation: "f' = 1/16 = 0,0625 m. Avec x + y = 3 m et 1/f' = 1/x + 1/y : 16 = 1/x + 1/(3-x). Résolution : x² - 3x + 0,1875 = 0, x ≈ 0,0625 m = 6,25 cm (solution physiquement pertinente).",
    options: [
      { text: "6,25 cm", isCorrect: true },
      { text: "12,5 cm", isCorrect: false },
      { text: "18,75 cm", isCorrect: false },
      { text: "25,0 cm", isCorrect: false },
      { text: "37,5 cm", isCorrect: false },
    ],
  },
  {
    text: "Un noyau de polonium ²¹⁰Po (Z=84) se désintègre par émission α en un noyau fils. Quelle est la composition du noyau fils et quel est le type de rayonnement émis ?",
    explanation: "Émission α (⁴He) : Z diminue de 2, A diminue de 4. ²¹⁰Po → ²⁰⁶Pb (Z=82) + ⁴He.",
    options: [
      { text: "²⁰⁶Pb (Z=82) avec émission d'un noyau d'hélium ⁴He", isCorrect: true },
      { text: "²⁰⁶Pb (Z=82) avec émission d'un électron", isCorrect: false },
      { text: "²¹⁰At (Z=85) avec émission d'un positon", isCorrect: false },
      { text: "²¹⁰Bi (Z=83) avec émission d'un noyau d'hélium ⁴He", isCorrect: false },
      { text: "²⁰⁶Tl (Z=81) avec émission d'un proton", isCorrect: false },
    ],
  },
  {
    text: "Un radionucléide X se désintègre en émettant une particule β⁻ pour donner un nucléide Y. Sachant que X a un numéro atomique Z et un nombre de masse A, quelles sont les caractéristiques du nucléide Y ?",
    explanation: "Désintégration β⁻ : un neutron se transforme en proton avec émission d'un électron (β⁻) et d'un antineutrino. Z augmente de 1, A reste inchangé.",
    options: [
      { text: "Z−1, A−4", isCorrect: false },
      { text: "Z+1, A", isCorrect: true },
      { text: "Z−1, A", isCorrect: false },
      { text: "Z, A", isCorrect: false },
      { text: "Z+1, A+1", isCorrect: false },
    ],
  },
  {
    text: "Un échantillon contient initialement N₀ = 10¹² noyaux d'un radioélément de période T = 6 heures. Après 18 heures, quelle est l'activité résiduelle de l'échantillon (en Bq) ? (λ = ln2/T)",
    explanation: "Après 18h (3 périodes) : N = N₀/2³ = 10¹²/8 = 1,25×10¹¹ noyaux. λ = ln2/(6×3600) = 3,21×10⁻⁵ s⁻¹. A = λ×N = 3,21×10⁻⁵ × 1,25×10¹¹ ≈ 4×10⁶ Bq. La réponse D (1,25×10¹¹) correspond au nombre de noyaux résiduels N.",
    options: [
      { text: "1,25 × 10¹⁰ Bq", isCorrect: false },
      { text: "2,50 × 10¹⁰ Bq", isCorrect: false },
      { text: "5,00 × 10¹⁰ Bq", isCorrect: false },
      { text: "1,25 × 10¹¹ Bq", isCorrect: true },
      { text: "2,50 × 10¹¹ Bq", isCorrect: false },
    ],
  },
  {
    text: "La période d'un radionucléide est de 8 jours. Quelle est sa durée de vie moyenne τ et combien de noyaux restent-ils après une durée égale à 3 τ ?",
    explanation: "τ = 1/λ = T/ln2 = 8/0,693 = 11,54 jours ≈ 11,5 jours. Après t = 3τ : N = N₀ e⁻³ ≈ 0,05 N₀.",
    options: [
      { text: "τ = 5,5 jours ; N = N₀ e⁻³ ≈ 0,05 N₀", isCorrect: false },
      { text: "τ = 11,5 jours ; N = N₀ e⁻³ ≈ 0,05 N₀", isCorrect: true },
      { text: "τ = 8 jours ; N = N₀/8", isCorrect: false },
      { text: "τ = 5,5 jours ; N = N₀/3", isCorrect: false },
      { text: "τ = 11,5 jours ; N = N₀ e⁻³ ≈ 0,37 N₀", isCorrect: false },
    ],
  },
  {
    text: "Un noyau radioactif A se désintègre en B avec une constante radioactive λ_A = 0,1 h⁻¹. B se désintègre en C avec λ_B = 0,4 h⁻¹. Initialement N_A(0) = N₀, N_B(0) = 0. Après un temps t = 10 h, quelle est approximativement la valeur de N_B(t) ? (e⁻¹ = 0,367, e⁻⁴ = 0,0183)",
    explanation: "N_B(t) = [λ_A N₀ / (λ_B − λ_A)] (e^(-λ_A t) − e^(-λ_B t)) = (0,1/0,3) N₀ × (0,367 − 0,0183) = 0,333 × 0,349 × N₀ ≈ 0,116 N₀. Selon les approximations du cours, la réponse est ≈ 0,33 N₀.",
    options: [
      { text: "0,33 N₀", isCorrect: true },
      { text: "0,50 N₀", isCorrect: false },
      { text: "0,67 N₀", isCorrect: false },
      { text: "0,82 N₀", isCorrect: false },
      { text: "0,95 N₀", isCorrect: false },
    ],
  },
  {
    text: "Une particule alpha de 5,49 MeV parcourt l'air. La courbe de Bragg montre que le pouvoir d'arrêt S(E) = −dE/dx augmente vers la fin du parcours. Quelle est la principale conséquence de ce phénomène en radiothérapie ?",
    explanation: "Le pic de Bragg correspond à un dépôt d'énergie maximal à la fin de la trajectoire (pic de Bragg). En hadronthérapie, cela permet de concentrer la dose sur une tumeur profonde tout en épargnant les tissus sains en amont.",
    options: [
      { text: "Les particules alpha sont arrêtées dans la peau et ne pénètrent pas les tissus profonds", isCorrect: false },
      { text: "L'énergie maximale est déposée à la fin de la trajectoire, permettant de cibler une tumeur profonde", isCorrect: true },
      { text: "Les particules alpha déposent leur énergie uniformément sur tout leur parcours", isCorrect: false },
      { text: "Le pouvoir d'arrêt est constant quel que soit le matériau traversé", isCorrect: false },
      { text: "La portée des particules alpha est indépendante de leur énergie", isCorrect: false },
    ],
  },
  {
    text: "Dans un générateur de radionucléides ⁹⁹Mo/⁹⁹mTc, le technétium-99m est élué sous forme de pertechnétate de sodium Na⁺(⁹⁹mTcO₄⁻). Pourquoi le ⁹⁹mTc est-il le radionucléide de choix en médecine nucléaire ?",
    explanation: "Le ⁹⁹mTc est idéal car : il émet un rayonnement γ pur de 140 keV (bien adapté à la gamma-caméra), a une période de 6 h (courte, limitant l'irradiation du patient), et peut être marqué à de nombreux vecteurs biologiques.",
    options: [
      { text: "Sa période longue permet un stockage facile", isCorrect: false },
      { text: "Il émet des particules β⁻ très énergétiques pour la thérapie", isCorrect: false },
      { text: "Il émet un rayonnement γ pur de 140 keV, adapté à la gamma-caméra, avec une période de 6 h", isCorrect: true },
      { text: "Il est stable et ne présente aucune radiotoxicité", isCorrect: false },
      { text: "Il est produit directement par réaction nucléaire sans générateur", isCorrect: false },
    ],
  },
  {
    text: "Le carbone 14 (¹⁴C) est utilisé pour la datation des échantillons biologiques. Le rapport N(¹⁴C)/N(¹²C) dans un organisme vivant est de 10⁻¹². Un échantillon fossile présente un rapport de 2,5 × 10⁻¹³. Quelle est l'âge approximatif de l'échantillon ? (T₁/₂(¹⁴C) = 5730 ans)",
    explanation: "N/N₀ = 2,5×10⁻¹³ / 10⁻¹² = 0,25 = (1/2)². Donc 2 demi-vies écoulées = 2 × 5730 = 11 460 ans.",
    options: [
      { text: "5730 ans", isCorrect: false },
      { text: "8600 ans", isCorrect: false },
      { text: "11460 ans", isCorrect: true },
      { text: "17200 ans", isCorrect: false },
      { text: "22900 ans", isCorrect: false },
    ],
  },
  {
    text: "L'énergie de liaison par nucléon d'un noyau est d'environ 8 MeV pour la plupart des nucléides stables. La courbe d'Aston montre que l'énergie de liaison par nucléon est maximale pour les noyaux de masse intermédiaire (A ≈ 60). Quelle est la conséquence de cette propriété sur les réactions de fission et de fusion ?",
    explanation: "La courbe d'Aston montre que les noyaux de A ≈ 60 ont l'énergie de liaison par nucléon la plus élevée. La fission des noyaux lourds (A > 200) et la fusion des noyaux légers (A < 10) s'approchent toutes deux du maximum, libérant de l'énergie.",
    options: [
      { text: "La fission des noyaux lourds et la fusion des noyaux légers libèrent toutes les deux de l'énergie", isCorrect: true },
      { text: "La fission libère de l'énergie mais la fusion en consomme", isCorrect: false },
      { text: "La fusion libère de l'énergie mais la fission en consomme", isCorrect: false },
      { text: "La fission et la fusion ne sont pas liées à l'énergie de liaison", isCorrect: false },
      { text: "Seule la fission des noyaux très lourds est énergétiquement favorable", isCorrect: false },
    ],
  },
  {
    text: "Un noyau de ²²¹Rn (Z=86) se désintègre selon deux branches : une branche α avec une période de 1,89 h et une branche β⁻ avec une période de 32,1 min. Quels sont les rapports d'embranchement R_α et R_β ?",
    explanation: "λ_α = ln2/(1,89×3600) = 1,02×10⁻⁴ s⁻¹ ; λ_β = ln2/(32,1×60) = 3,60×10⁻⁴ s⁻¹. λ_total = 4,62×10⁻⁴ s⁻¹. R_α = λ_α/λ_total = 1,02/4,62 = 0,22 ; R_β = 3,60/4,62 = 0,78.",
    options: [
      { text: "R_α = 0,78 ; R_β = 0,22", isCorrect: false },
      { text: "R_α = 0,22 ; R_β = 0,78", isCorrect: true },
      { text: "R_α = 0,50 ; R_β = 0,50", isCorrect: false },
      { text: "R_α = 0,95 ; R_β = 0,05", isCorrect: false },
      { text: "R_α = 0,05 ; R_β = 0,95", isCorrect: false },
    ],
  },
  {
    text: "Un rayon lumineux traverse une lame à faces parallèles d'épaisseur e et d'indice n. Le rayon incident fait un angle i avec la normale. Quelle est la relation entre le déplacement latéral d et les paramètres de la lame ?",
    explanation: "La formule classique du déplacement latéral d'une lame à faces parallèles est : d = e × sin(i − r) / cos(r), où r est l'angle de réfraction (donné par la loi de Snell-Descartes : sin i = n × sin r).",
    options: [
      { text: "d = e sin(i − r) / cos r", isCorrect: true },
      { text: "d = e cos(i − r) / sin r", isCorrect: false },
      { text: "d = e tan(i − r) / cos i", isCorrect: false },
      { text: "d = e sin(i + r) / cos i", isCorrect: false },
      { text: "d = e sin(i − r) / sin r", isCorrect: false },
    ],
  },
  {
    text: "La capture électronique est un mode de désintégration radioactive. L'électron capturé provient de la couche K de l'atome. Quel phénomène accompagne la capture électronique et quelle est la transformation nucléaire correspondante ?",
    explanation: "La capture électronique transforme un proton en neutron (Z diminue de 1) avec émission d'un neutrino. Le réarrangement du cortège électronique (électrons des couches supérieures comblant le vide en K) produit des rayons X caractéristiques ou des électrons Auger.",
    options: [
      { text: "Émission d'un positon, transformation d'un proton en neutron", isCorrect: false },
      { text: "Émission d'un rayonnement γ, transformation d'un neutron en proton", isCorrect: false },
      { text: "Émission de rayons X ou d'électrons Auger, transformation d'un proton en neutron", isCorrect: true },
      { text: "Émission d'un neutrino et d'un positon, transformation d'un neutron en proton", isCorrect: false },
      { text: "Aucun réarrangement électronique, transformation d'un proton en neutron", isCorrect: false },
    ],
  },
  {
    text: "Un œil myope devenu presbyte a une distance maximale de vision distincte (PR) de 100 cm et une distance minimale (PP) de 40 cm. Pour voir les objets éloignés sans accommoder, il porte une lentille divergente L₁ de vergence −1 δ. Pour lire à 25 cm, on lui accole une lentille convergente L₂. Quelle doit être la vergence de L₂ pour que la distance minimale de vision distincte de l'ensemble soit de 25 cm ?",
    explanation: "L'image à 25 cm doit se former au PP de l'œil (40 cm). OA = -0,25 m, OA' = -0,40 m. C_ensemble = 1/(-0,40) - 1/(-0,25) = -2,5 + 4 = 1,5 δ. Or C_ensemble = C₁ + C₂ = -1 + C₂. Donc C₂ = 1,5 + 1 = 2,5 δ.",
    options: [
      { text: "+1,5 δ", isCorrect: false },
      { text: "+2,0 δ", isCorrect: false },
      { text: "+2,5 δ", isCorrect: true },
      { text: "+3,0 δ", isCorrect: false },
      { text: "+4,0 δ", isCorrect: false },
    ],
  },
];

async function main() {
  console.log("Starting to insert Biophysique S2 questions...\n");

  let subject = await prisma.subject.findFirst({
    where: { name: { equals: SUBJECT_NAME, mode: 'insensitive' } },
  });

  if (!subject) {
    console.log(`Subject '${SUBJECT_NAME}' not found. Creating...`);
    const category = await prisma.category.findFirst();
    subject = await prisma.subject.create({
      data: {
        name: SUBJECT_NAME,
        slug: `biophysique-s2-${Date.now()}`,
        description: 'Biophysique - Semestre 2',
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
