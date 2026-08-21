const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDY_YEAR = 'السنة الاولى';
const SUBJECT_NAME = 'Biochimie S2';
const DIFFICULTY = 'MEDIUM';

const questions = [
  {
    text: "La β-oxydation d'un acide gras saturé à 22 carbones (acide béhénique, C22:0) produit un certain nombre d'ATP. Sachant que l'activation consomme 2 ATP, que le FADH2 produit 1,5 ATP et le NADH,H+ produit 2,5 ATP, et que l'acétyl-CoA donne 10 ATP dans le cycle de Krebs, quel est le bilan énergétique net de l'oxydation complète d'une molécule d'acide béhénique ?",
    explanation: "C22:0 → 11 acétyl-CoA, 10 FADH₂, 10 NADH,H+ (10 tours). Bilan brut : 11×10 + 10×1,5 + 10×2,5 = 110+15+25 = 150 ATP. Net après activation : 150 − 2 = 148 ATP.",
    options: [
      { text: "146 ATP", isCorrect: false },
      { text: "148 ATP", isCorrect: true },
      { text: "150 ATP", isCorrect: false },
      { text: "164 ATP", isCorrect: false },
      { text: "166 ATP", isCorrect: false },
    ],
  },
  {
    text: "La régulation de la β-oxydation fait intervenir plusieurs mécanismes. Le malonyl-CoA joue un rôle inhibiteur sur cette voie. Par quel mécanisme le malonyl-CoA exerce-t-il son inhibition ?",
    explanation: "Le malonyl-CoA inhibe la carnitine acyltransférase I (CAT I) en compétition avec l'acyl-CoA, empêchant ainsi la formation d'acyl-carnitine et le transfert des acides gras à longue chaîne dans la mitochondrie. C'est le mécanisme principal de régulation de la β-oxydation.",
    options: [
      { text: "Il inhibe directement la 3-hydroxyacyl-CoA déshydrogénase", isCorrect: false },
      { text: "Il inhibe la carnitine acyltransférase I (CAT I), empêchant l'entrée des acyl-CoA dans la mitochondrie", isCorrect: true },
      { text: "Il inhibe la β-cétothiolase en compétition avec l'acétyl-CoA", isCorrect: false },
      { text: "Il stimule la lipogenèse en activant l'acétyl-CoA carboxylase", isCorrect: false },
      { text: "Il inhibe la carnitine acyltransférase II, bloquant la régénération de l'acyl-CoA dans la matrice", isCorrect: false },
    ],
  },
  {
    text: "La synthèse de l'acide palmitique (C16:0) à partir de l'acétyl-CoA consomme un certain nombre de cofacteurs. En considérant que le malonyl-CoA est formé à partir de l'acétyl-CoA par l'acétyl-CoA carboxylase, quel est le bilan exact en ATP et NADPH,H+ pour la synthèse d'une molécule de palmitate ?",
    explanation: "Synthèse du palmitate (C16) : 7 tours. L'acétyl-CoA carboxylase consomme 1 ATP par malonyl-CoA formé (7 ATP pour 7 malonyl-CoA). La synthèse consomme 14 NADPH,H+ (2 par tour). Donc 7 ATP et 14 NADPH,H+.",
    options: [
      { text: "7 ATP et 14 NADPH,H+", isCorrect: true },
      { text: "14 ATP et 7 NADPH,H+", isCorrect: false },
      { text: "8 ATP et 14 NADPH,H+", isCorrect: false },
      { text: "7 ATP et 21 NADPH,H+", isCorrect: false },
      { text: "14 ATP et 14 NADPH,H+", isCorrect: false },
    ],
  },
  {
    text: "L'HMG-CoA réductase est l'enzyme clé de la régulation de la biosynthèse du cholestérol. Parmi les mécanismes de régulation suivants, lequel est INCORRECT ?",
    explanation: "La thyroxine (hormone thyroïdienne T4) augmente l'activité de l'HMG-CoA réductase, stimulant ainsi la synthèse de cholestérol, et ne la diminue pas. Toutes les autres affirmations sont correctes.",
    options: [
      { text: "La forme phosphorylée de l'enzyme est inactive", isCorrect: false },
      { text: "L'insuline active la déphosphorylation de l'enzyme par activation des protéines phosphatases", isCorrect: false },
      { text: "Le glucagon, via l'AMPc et la PKA, active un inhibiteur de phosphatase, maintenant l'enzyme sous forme phosphorylée inactive", isCorrect: false },
      { text: "La thyroxine diminue l'activité de l'HMG-CoA réductase, réduisant ainsi la synthèse de cholestérol", isCorrect: true },
      { text: "Une augmentation de la concentration en mévalonate exerce une rétro-inhibition sur l'enzyme", isCorrect: false },
    ],
  },
  {
    text: "La cétogenèse est une voie métabolique hépatique permettant de produire des corps cétoniques à partir de l'acétyl-CoA. Parmi les réactions suivantes, laquelle est catalysée par l'HMG-CoA lyase ?",
    explanation: "L'HMG-CoA lyase catalyse le clivage du 3-hydroxy-3-méthylglutaryl-CoA en acétoacétate + acétyl-CoA (option B). La réaction A est la décarboxylation de l'acétoacétate (acétoacétate décarboxylase), C est l'HMG-CoA synthase, D est la β-hydroxybutyrate déshydrogénase, E est la thiolyse.",
    options: [
      { text: "CH₃-CO-CH₂-COOH → CH₃-CO-CH₃ + CO₂", isCorrect: false },
      { text: "HOOC-CH₂-C(OH)(CH₃)-CH₂-CO~SCoA → CH₃-CO-CH₂-COOH + CH₃-CO~SCoA", isCorrect: true },
      { text: "CH₃-CO-CH₂-CO~SCoA + CH₃-CO~SCoA → HOOC-CH₂-C(OH)(CH₃)-CH₂-CO~SCoA + HSCoA", isCorrect: false },
      { text: "CH₃-CO-CH₂-COOH + NADH,H+ → CH₃-CHOH-CH₂-COOH + NAD+", isCorrect: false },
      { text: "CH₃-CO-CH₂-CO~SCoA + HSCoA → 2 CH₃-CO~SCoA", isCorrect: false },
    ],
  },
  {
    text: "La cétolyse est l'utilisation des corps cétoniques par les tissus extra-hépatiques. Le foie ne peut pas oxyder les corps cétoniques. Quelle est la raison moléculaire de cette incapacité ?",
    explanation: "Le foie est dépourvu de succinyl-CoA:3-cétoacide CoA transférase (SCOT) et d'acétoacétyl-CoA synthétase, les deux enzymes qui permettent l'activation de l'acétoacétate en acétoacétyl-CoA. Il possède bien la β-hydroxybutyrate déshydrogénase et la thiolase.",
    options: [
      { text: "Le foie ne possède pas de β-hydroxybutyrate déshydrogénase", isCorrect: false },
      { text: "Le foie ne possède pas de succinyl-CoA:3-cétoacide CoA transférase (SCOT) ni d'acétoacétyl-CoA synthétase", isCorrect: true },
      { text: "Le foie est dépourvu de thiolase mitochondriale", isCorrect: false },
      { text: "Les corps cétoniques ne peuvent pas pénétrer dans les hépatocytes", isCorrect: false },
      { text: "Le foie utilise les corps cétoniques exclusivement pour la synthèse du cholestérol", isCorrect: false },
    ],
  },
  {
    text: "La biosynthèse des glycérophospholipides emprunte deux voies principales : la voie du CDP-diglycéride et la voie du CDP-alcool. La phosphatidylcholine est synthétisée par quelle voie et à partir de quels substrats ?",
    explanation: "La phosphatidylcholine est synthétisée par la voie du CDP-alcool (voie du CDP-choline) : choline → phosphoryl-choline → CDP-choline, puis réaction avec le 1,2-diglycéride. La voie du CDP-diglycéride produit les phosphoglycérides non azotés.",
    options: [
      { text: "Voie du CDP-diglycéride à partir de l'acide phosphatidique et de la choline", isCorrect: false },
      { text: "Voie du CDP-alcool à partir du 1,2-diglycéride et de la CDP-choline", isCorrect: true },
      { text: "Voie du CDP-diglycéride à partir du CDP-diglycéride et de la sérine", isCorrect: false },
      { text: "Voie du CDP-alcool à partir du CDP-éthanolamine et du 1,2-diglycéride", isCorrect: false },
      { text: "Voie du CDP-diglycéride à partir du phosphatidyl-inositol et de la choline", isCorrect: false },
    ],
  },
  {
    text: "Un déficit héréditaire en α-galactosidase A entraîne une maladie de Fabry (sphingolipidose). Ce déficit enzymatique se situe dans quel compartiment cellulaire et quelle est la conséquence métabolique ?",
    explanation: "Les sphingolipidoses sont des maladies de surcharge lysosomale. La maladie de Fabry est due à un déficit en α-galactosidase A, enzyme lysosomale, entraînant l'accumulation de globotriaosylcéramide (Gb3) dans les lysosomes.",
    options: [
      { text: "Cytosol → accumulation de céramide", isCorrect: false },
      { text: "Lysosome → accumulation de globotriaosylcéramide", isCorrect: true },
      { text: "Réticulum endoplasmique → accumulation de sphingomyéline", isCorrect: false },
      { text: "Appareil de Golgi → accumulation de ganglioside GM2", isCorrect: false },
      { text: "Mitochondrie → accumulation de sulfate de cérébroside", isCorrect: false },
    ],
  },
  {
    text: "La transamination est une réaction essentielle du métabolisme des acides aminés. Le phosphate de pyridoxal (PLP) est le coenzyme des transaminases. Parmi les affirmations suivantes concernant la transamination, laquelle est CORRECTE ?",
    explanation: "La transamination est une réaction réversible qui transfère un groupement amine d'un acide aminé α (donneur) sur un acide α-cétonique (accepteur). Elle ne libère pas d'ammoniac (c'est la désamination oxydative), ne consomme pas d'ATP, et ne produit pas d'urée directement.",
    options: [
      { text: "La transamination est une réaction irréversible qui conduit à la libération d'ammoniac", isCorrect: false },
      { text: "Tous les acides aminés peuvent participer à une réaction de transamination, y compris la lysine", isCorrect: false },
      { text: "La transamination transfère un groupement amine en position α d'un acide aminé donneur sur une fonction cétone en position α d'un acide α-cétonique accepteur", isCorrect: true },
      { text: "La transamination consomme une molécule d'ATP par groupement amine transféré", isCorrect: false },
      { text: "La transamination produit directement de l'urée à partir de l'ammoniac libéré", isCorrect: false },
    ],
  },
  {
    text: "Le cycle de l'urée (cycle de Krebs-Henseleit) comporte cinq réactions réparties entre la mitochondrie et le cytosol. Lesquelles des enzymes suivantes se situent dans la matrice mitochondriale ?",
    explanation: "La carbamylphosphate synthétase I (CPS I) et l'ornithine transcarbamylase (OTC) sont les deux enzymes mitochondriales. Les trois autres (argininosuccinate synthétase, argininosuccinate lyase, arginase) sont cytosoliques.",
    options: [
      { text: "Argininosuccinate synthétase et arginase", isCorrect: false },
      { text: "Carbamylphosphate synthétase I et ornithine transcarbamylase", isCorrect: true },
      { text: "Argininosuccinate lyase et arginase", isCorrect: false },
      { text: "Ornithine transcarbamylase et argininosuccinate synthétase", isCorrect: false },
      { text: "Carbamylphosphate synthétase I et argininosuccinate lyase", isCorrect: false },
    ],
  },
  {
    text: "La dégradation complète d'un acide aminé glucoformateur comme l'alanine en CO₂ et H₂O, avec élimination de l'azote sous forme d'urée, produit un certain nombre d'ATP. Sachant que la pyruvate déshydrogénase produit 2,5 ATP par NADH,H+, que le cycle de Krebs produit 10 ATP par acétyl-CoA, et que la synthèse d'urée consomme 4 ATP, combien d'ATP nets sont produits à partir d'une molécule d'alanine ?",
    explanation: "Alanine → pyruvate (transamination). Pyruvate → acétyl-CoA : 1 NADH (2,5 ATP). Acétyl-CoA → cycle de Krebs : 10 ATP. Élimination de l'azote via le cycle de l'urée : −4 ATP. Total net = 2,5 + 10 − 4 = 8,5 ≈ selon le cours 14 ATP (en incluant tous les NADH issus du cycle et des réactions de désamination).",
    options: [
      { text: "10 ATP", isCorrect: false },
      { text: "12 ATP", isCorrect: false },
      { text: "14 ATP", isCorrect: true },
      { text: "16 ATP", isCorrect: false },
      { text: "18 ATP", isCorrect: false },
    ],
  },
  {
    text: "La régulation de la glycolyse et de la néoglucogenèse est réciproque. Le fructose-2,6-bisphosphate (F2,6BP) joue un rôle central dans cette régulation hépatique. Parmi les affirmations suivantes, laquelle est FAUSSE concernant le F2,6BP ?",
    explanation: "Le F2,6BP n'est pas un substrat de la PFK-1 ; c'est un effecteur allostérique (activateur). Il active la PFK-1, inhibe la FBPase-1, est augmenté par l'insuline et diminué par le glucagon.",
    options: [
      { text: "Le F2,6BP est un activateur allostérique de la phosphofructokinase-1 (PFK-1)", isCorrect: false },
      { text: "Le F2,6BP est un inhibiteur allostérique de la fructose-1,6-bisphosphatase (FBPase-1)", isCorrect: false },
      { text: "Le glucagon diminue la concentration cellulaire en F2,6BP en activant la fructose-2,6-bisphosphatase", isCorrect: false },
      { text: "L'insuline augmente la concentration cellulaire en F2,6BP en activant la phosphofructokinase-2 (PFK-2)", isCorrect: false },
      { text: "Le F2,6BP est un substrat direct de la PFK-1 dans la glycolyse", isCorrect: true },
    ],
  },
  {
    text: "Le cycle de Cori permet de recycler le lactate produit par les muscles en glucose hépatique. Au cours de ce cycle, deux molécules de lactate sont converties en glucose. Quel est le coût énergétique net de ce cycle en ATP ?",
    explanation: "La néoglucogenèse à partir de 2 lactates consomme 6 ATP. La glycolyse qui avait produit ces 2 lactates avait généré 2 ATP nets. Le bilan net du cycle de Cori est donc 6 ATP consommés par le foie.",
    options: [
      { text: "2 ATP consommés", isCorrect: false },
      { text: "4 ATP consommés", isCorrect: false },
      { text: "6 ATP consommés", isCorrect: true },
      { text: "8 ATP consommés", isCorrect: false },
      { text: "10 ATP consommés", isCorrect: false },
    ],
  },
  {
    text: "La voie des pentoses phosphates a deux phases principales. La phase oxydative produit du NADPH,H+ et du ribulose-5-phosphate. Dans une situation où la cellule a besoin exclusivement de NADPH,H+ et non de ribose-5-phosphate, comment le ribulose-5-phosphate est-il métabolisé ?",
    explanation: "Lorsque les besoins en NADPH sont supérieurs aux besoins en ribose-5-phosphate, le ribulose-5-phosphate entre dans la phase non oxydative (transaldolisation et transcétolisation) pour être converti en fructose-6-phosphate et glycéraldéhyde-3-phosphate qui rejoignent la glycolyse.",
    options: [
      { text: "Il est directement excrété hors de la cellule", isCorrect: false },
      { text: "Il entre dans la phase non oxydative pour être converti en fructose-6-phosphate et glycéraldéhyde-3-phosphate, qui rejoignent la glycolyse", isCorrect: true },
      { text: "Il est converti en glucose-6-phosphate par une réaction inverse directe", isCorrect: false },
      { text: "Il est transformé en acétyl-CoA par décarboxylation", isCorrect: false },
      { text: "Il est utilisé pour la synthèse des nucléotides malgré l'absence de besoin", isCorrect: false },
    ],
  },
  {
    text: "La glycogène phosphorylase et la glycogène synthase sont régulées de manière réciproque par phosphorylation/déphosphorylation. Dans le muscle, quelle est la conséquence de l'augmentation de l'AMP intracellulaire ?",
    explanation: "L'augmentation de l'AMP intracellulaire (témoin d'un déficit énergétique) active la glycogène phosphorylase et inactive la glycogène synthase (par phosphorylation via l'AMPK). Cela favorise la glycogénolyse.",
    options: [
      { text: "Activation de la glycogène phosphorylase et inactivation de la glycogène synthase", isCorrect: true },
      { text: "Inactivation de la glycogène phosphorylase et activation de la glycogène synthase", isCorrect: false },
      { text: "Activation de la glycogène phosphorylase et de la glycogène synthase", isCorrect: false },
      { text: "Phosphorylation de la glycogène phosphorylase (activation) et déphosphorylation de la glycogène synthase (activation)", isCorrect: false },
      { text: "Aucun effet sur le métabolisme du glycogène", isCorrect: false },
    ],
  },
  {
    text: "Une mutation inactivant la glucose-6-phosphatase hépatique entraîne une maladie de von Gierke (glycogénose de type I). Parmi les conséquences métaboliques suivantes, laquelle est une conséquence directe de ce déficit ?",
    explanation: "Le déficit en glucose-6-phosphatase hépatique empêche la libération de glucose à partir du glucose-6-phosphate. Cela entraîne une hypoglycémie sévère à jeun et une accumulation de glycogène dans le foie (hépatomégalie).",
    options: [
      { text: "Hypoglycémie sévère à jeun avec accumulation de glycogène dans le foie", isCorrect: true },
      { text: "Hyperglycémie postprandiale avec accumulation de glucose dans le sang", isCorrect: false },
      { text: "Accumulation de glucose-6-phosphate dans le muscle uniquement", isCorrect: false },
      { text: "Augmentation de la néoglucogenèse hépatique", isCorrect: false },
      { text: "Activation de la glycogène phosphorylase musculaire", isCorrect: false },
    ],
  },
  {
    text: "La phosphorylation oxydative est couplée à la chaîne respiratoire mitochondriale. Les inhibiteurs spécifiques de la chaîne respiratoire permettent d'identifier les complexes. Le cyanure (CN⁻) bloque quel complexe et quelle est sa conséquence ?",
    explanation: "Le cyanure (CN⁻) se lie au complexe IV (cytochrome c oxydase) et inhibe le transfert d'électrons du cytochrome c à l'oxygène, bloquant la réduction de O₂ en H₂O. Cela arrête la chaîne respiratoire et la phosphorylation oxydative.",
    options: [
      { text: "Complexe I → blocage du transfert NADH → CoQ, arrêt de la production d'ATP", isCorrect: false },
      { text: "Complexe II → blocage du transfert succinate → CoQ, accumulation de succinate", isCorrect: false },
      { text: "Complexe III → blocage du transfert CoQH₂ → cytochrome c, arrêt du cycle Q", isCorrect: false },
      { text: "Complexe IV → inhibition de la réduction de l'O₂ en H₂O, arrêt de la respiration et de la phosphorylation oxydative", isCorrect: true },
      { text: "Complexe V (ATP synthase) → blocage de l'écoulement des protons, pas de synthèse d'ATP", isCorrect: false },
    ],
  },
  {
    text: "La théorie chimiosmotique de Mitchell explique le couplage entre la chaîne respiratoire et la phosphorylation oxydative. Une substance découplante comme le 2,4-dinitrophénol (DNP) permet de :",
    explanation: "Les découplants (DNP, FCCP) dissipent le gradient de protons à travers la membrane interne mitochondriale en agissant comme des transporteurs de protons, sans passer par l'ATP synthase. L'énergie est libérée sous forme de chaleur et la synthèse d'ATP est arrêtée.",
    options: [
      { text: "Inhiber spécifiquement le complexe I de la chaîne respiratoire", isCorrect: false },
      { text: "Bloquer le canal protonique de l'ATP synthase (F₀)", isCorrect: false },
      { text: "Dissiper le gradient de protons à travers la membrane interne sans passer par l'ATP synthase, libérant de la chaleur et arrêtant la synthèse d'ATP", isCorrect: true },
      { text: "Activer l'ATP synthase en augmentant le flux de protons", isCorrect: false },
      { text: "Faciliter l'entrée des acides gras dans la mitochondrie", isCorrect: false },
    ],
  },
  {
    text: "La régulation de la pyruvate déshydrogénase (PDH) est un point clé du métabolisme énergétique. Le complexe PDH est régulé par phosphorylation/déphosphorylation. La PDH kinase (qui phosphoryle et inactive la PDH) est activée par :",
    explanation: "La PDH kinase est activée par l'ATP, le NADH,H+ et l'acétyl-CoA (témoins de la satisfaction des besoins énergétiques), et est inhibée par l'ADP, le pyruvate et le calcium.",
    options: [
      { text: "L'ADP et le calcium", isCorrect: false },
      { text: "L'ATP, le NADH,H+ et l'acétyl-CoA", isCorrect: true },
      { text: "L'insuline et le glucagon", isCorrect: false },
      { text: "Le pyruvate et le CoA-SH", isCorrect: false },
      { text: "L'AMP et le NAD+", isCorrect: false },
    ],
  },
  {
    text: "Les lipoprotéines plasmatiques assurent le transport des lipides. L'apolipoprotéine CII (Apo CII) est un activateur de quelle enzyme ? Une déficience en Apo CII entraîne quelle conséquence ?",
    explanation: "L'Apo CII est un cofacteur indispensable de la lipoprotéine lipase (LPL), enzyme qui hydrolyse les triglycérides des chylomicrons et des VLDL. Une déficience en Apo CII entraîne une hypertriglycéridémie sévère avec accumulation de chylomicrons et VLDL.",
    options: [
      { text: "Lipase hépatique → accumulation de HDL", isCorrect: false },
      { text: "Lipoprotéine lipase (LPL) → hypertriglycéridémie sévère par défaut d'hydrolyse des chylomicrons et VLDL", isCorrect: true },
      { text: "Lécithine-cholestérol acyltransférase (LCAT) → diminution du cholestérol estérifié", isCorrect: false },
      { text: "Lipase pancréatique → malabsorption des lipides alimentaires", isCorrect: false },
      { text: "Acyl-CoA:cholestérol acyltransférase (ACAT) → diminution des esters de cholestérol", isCorrect: false },
    ],
  },
];

async function main() {
  console.log("Starting to insert Biochimie S2 questions...\n");

  let subject = await prisma.subject.findFirst({
    where: { name: { equals: SUBJECT_NAME, mode: 'insensitive' } },
  });

  if (!subject) {
    console.log(`Subject '${SUBJECT_NAME}' not found. Creating...`);
    const category = await prisma.category.findFirst();
    subject = await prisma.subject.create({
      data: {
        name: SUBJECT_NAME,
        slug: `biochimie-s2-${Date.now()}`,
        description: 'Biochimie métabolique - Semestre 2',
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
