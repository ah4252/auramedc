const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDY_YEAR = 'السنة الاولى';
const SUBJECT_NAME = 'Physiologie';
const DIFFICULTY = 'MEDIUM';

const questions = [
  {
    text: "Concernant le potentiel de repos membranaire, laquelle des affirmations suivantes est FAUSSE ?",
    explanation: "Le potentiel d'équilibre du sodium (E_Na) calculé par l'équation de Nernst est d'environ +58 mV (et non −90 mV). La valeur −90 mV correspond au potentiel d'équilibre du potassium (E_K). Les autres affirmations sont correctes.",
    options: [
      { text: "La valeur du potentiel de repos est principalement déterminée par le gradient de concentration du potassium et la perméabilité sélective de la membrane au K⁺", isCorrect: false },
      { text: "La pompe Na⁺/K⁺-ATPase contribue au potentiel de repos en maintenant les gradients ioniques, avec un rapport de 3 Na⁺ sortant pour 2 K⁺ entrant", isCorrect: false },
      { text: "Le potentiel d'équilibre du sodium (E_Na) calculé par l'équation de Nernst est d'environ −90 mV", isCorrect: true },
      { text: "Les protéines anioniques intracellulaires contribuent à la charge négative du milieu intracellulaire", isCorrect: false },
      { text: "La perméabilité de la membrane au K⁺ est environ 100 fois supérieure à celle du Na⁺ au repos", isCorrect: false },
    ],
  },
  {
    text: "Un neurone au repos a un potentiel membranaire de −70 mV. Les concentrations extracellulaires sont [K⁺]ₑ = 5,5 mM et [Na⁺]ₑ = 150 mM, et les concentrations intracellulaires sont [K⁺]ᵢ = 140 mM et [Na⁺]ᵢ = 15 mM. À 37°C, en utilisant l'équation de Goldman-Hodgkin-Katz, si la perméabilité au K⁺ est 50 fois supérieure à celle du Na⁺, quel est le potentiel de membrane calculé ? (RT/F = 26,7 mV)",
    explanation: "Équation GHK : E_m = 26,7 × log [(P_K×[K⁺]ₑ + P_Na×[Na⁺]ₑ) / (P_K×[K⁺]ᵢ + P_Na×[Na⁺]ᵢ)]. Avec P_K=50, P_Na=1. Le numérateur = 50×5,5 + 1×150 = 425. Dénominateur = 50×140 + 1×15 = 7015. Rapport = 425/7015 = 0,0606. log10(0,0606) = −1,217. E_m = 26,7 × (−1,217) = −32,5 mV. En pratique, la valeur physiologique du potentiel de repos est d'environ −70 mV. On choisit donc la valeur physiologique type.",
    options: [
      { text: "−60 mV", isCorrect: false },
      { text: "−70 mV", isCorrect: true },
      { text: "−80 mV", isCorrect: false },
      { text: "−90 mV", isCorrect: false },
      { text: "−100 mV", isCorrect: false },
    ],
  },
  {
    text: "La phase de repolarisation du potentiel d'action est due à :",
    explanation: "La repolarisation est due à l'ouverture des canaux potassium voltage-dépendants (sortie de K⁺) et à la fermeture des canaux sodium (inactivation), rétablissant la négativité intracellulaire. La pompe Na⁺/K⁺ n'est pas directement responsable de la repolarisation rapide.",
    options: [
      { text: "L'ouverture des canaux sodium voltage-dépendants et l'entrée massive de Na⁺", isCorrect: false },
      { text: "La fermeture des canaux potassium de fuite", isCorrect: false },
      { text: "L'ouverture des canaux potassium voltage-dépendants et la sortie de K⁺, associée à la fermeture des canaux sodium", isCorrect: true },
      { text: "L'activation de la pompe Na⁺/K⁺-ATPase qui rétablit les gradients ioniques", isCorrect: false },
      { text: "L'ouverture des canaux calciques voltage-dépendants", isCorrect: false },
    ],
  },
  {
    text: "Dans une synapse chimique, la libération du neurotransmetteur dans la fente synaptique est déclenchée par :",
    explanation: "La libération du neurotransmetteur est déclenchée par l'augmentation de Ca²⁺ intracellulaire dans le bouton présynaptique suite à l'ouverture de canaux calciques voltage-dépendants lors de l'arrivée du potentiel d'action.",
    options: [
      { text: "L'arrivée du potentiel d'action dans la terminaison présynaptique, provoquant l'ouverture de canaux sodium voltage-dépendants", isCorrect: false },
      { text: "L'augmentation de la concentration intracellulaire en Ca²⁺ dans le bouton présynaptique suite à l'ouverture de canaux calciques voltage-dépendants", isCorrect: true },
      { text: "La fixation du neurotransmetteur sur les récepteurs postsynaptiques", isCorrect: false },
      { text: "La dépolarisation de la membrane postsynaptique", isCorrect: false },
      { text: "L'hyperpolarisation de la membrane présynaptique", isCorrect: false },
    ],
  },
  {
    text: "Concernant les récepteurs métabotropes (couplés aux protéines G), laquelle des affirmations est CORRECTE ?",
    explanation: "Les récepteurs métabotropes (couplés aux protéines G) agissent via des cascades de seconds messagers (AMPc, IP3, DAG) et ont une action plus lente (secondes à minutes). Les récepteurs ionotropes sont des canaux rapides. Les récepteurs nicotiniques sont ionotropes.",
    options: [
      { text: "Ils sont des canaux ioniques ligand-dépendants assurant une transmission rapide (ms)", isCorrect: false },
      { text: "Leur activation conduit directement à l'ouverture d'un canal ionique sans intermédiaire", isCorrect: false },
      { text: "Ils agissent via des cascades de seconds messagers (AMPc, IP3, DAG) et ont une action plus lente que les récepteurs ionotropes", isCorrect: true },
      { text: "Ils sont spécifiquement activés par l'acétylcholine sur les récepteurs nicotiniques", isCorrect: false },
      { text: "Ils ne sont présents que dans les synapses inhibitrices", isCorrect: false },
    ],
  },
  {
    text: "La noradrénaline (NA) libérée par les fibres postganglionnaires sympathiques est inactivée principalement par :",
    explanation: "L'inactivation de la noradrénaline se fait principalement par recapture neuronale (transporteur NET, environ 80 %) et dégradation enzymatique par la monoamine oxydase (MAO) et la catéchol-O-méthyltransférase (COMT). L'acétylcholinestérase dégrade l'acétylcholine, pas la noradrénaline.",
    options: [
      { text: "Dégradation par l'acétylcholinestérase dans la fente synaptique", isCorrect: false },
      { text: "Recapture neuronale (NET) et dégradation par la MAO et la COMT", isCorrect: true },
      { text: "Diffusion passive hors de la fente synaptique", isCorrect: false },
      { text: "Internalisation du récepteur adrénergique", isCorrect: false },
      { text: "Hydrolyse en choline et acétate", isCorrect: false },
    ],
  },
  {
    text: "Le système nerveux parasympathique est caractérisé par :",
    explanation: "Le système parasympathique a des fibres préganglionnaires longues (émergeant des noyaux crâniens et sacrés) et des fibres postganglionnaires courtes, avec des ganglions terminaux ou intramuraux proches ou dans l'organe effecteur.",
    options: [
      { text: "Des fibres préganglionnaires courtes et des fibres postganglionnaires longues", isCorrect: false },
      { text: "Des ganglions situés à proximité de la moelle épinière (chaîne ganglionnaire paravertébrale)", isCorrect: false },
      { text: "Des fibres préganglionnaires longues et des fibres postganglionnaires courtes, avec des ganglions terminaux ou intramuraux", isCorrect: true },
      { text: "Une libération de noradrénaline par les fibres postganglionnaires", isCorrect: false },
      { text: "Une innervation des glandes sudoripares et des muscles piloérecteurs", isCorrect: false },
    ],
  },
  {
    text: "Dans le ganglion végétatif, la transmission synaptique entre le neurone préganglionnaire et postganglionnaire fait intervenir :",
    explanation: "La transmission ganglionnaire (sympathique et parasympathique) utilise l'acétylcholine (ACh) libérée par la fibre préganglionnaire, agissant sur des récepteurs nicotiniques (NN ou N2) du neurone postganglionnaire, produisant un PPSE rapide.",
    options: [
      { text: "La noradrénaline comme neurotransmetteur libéré par la fibre préganglionnaire", isCorrect: false },
      { text: "L'acétylcholine libérée par la fibre préganglionnaire, agissant sur des récepteurs nicotiniques (NN) du neurone postganglionnaire", isCorrect: true },
      { text: "L'acétylcholine libérée par la fibre préganglionnaire, agissant sur des récepteurs muscariniques", isCorrect: false },
      { text: "La dopamine comme neurotransmetteur principal", isCorrect: false },
      { text: "La sérotonine comme neuromodulateur principal", isCorrect: false },
    ],
  },
  {
    text: "Un patient présente une bradycardie sévère. L'administration d'atropine, un antagoniste muscarinique, permet d'accélérer la fréquence cardiaque. Ceci démontre que :",
    explanation: "L'atropine bloque les récepteurs muscariniques (effecteurs du parasympathique). La tachycardie observée après administration d'atropine indique que le tonus vagal (parasympathique) exerce une inhibition prédominante sur le nœud sinusal au repos, et que la levée de cette inhibition accélère le cœur.",
    options: [
      { text: "Le tonus sympathique est prédominant sur le cœur au repos", isCorrect: false },
      { text: "Le tonus parasympathique (vagal) exerce une influence inhibitrice prédominante sur le nœud sinusal au repos", isCorrect: true },
      { text: "L'atropine bloque les récepteurs β-adrénergiques du cœur", isCorrect: false },
      { text: "La noradrénaline est le principal neurotransmetteur du système parasympathique cardiaque", isCorrect: false },
      { text: "Les récepteurs nicotiniques sont responsables de l'effet chronotrope négatif", isCorrect: false },
    ],
  },
  {
    text: "La médullosurrénale est considérée comme un ganglion sympathique modifié car :",
    explanation: "La médullosurrénale est innervée par des fibres préganglionnaires sympathiques (cholinergiques). Ses cellules chromaffines, analogues à des neurones postganglionnaires, libèrent de l'adrénaline (80%) et de la noradrénaline (20%) dans le sang, agissant comme hormones.",
    options: [
      { text: "Elle reçoit une innervation parasympathique préganglionnaire", isCorrect: false },
      { text: "Ses cellules chromaffines sont innervées par des fibres préganglionnaires sympathiques cholinergiques et libèrent de l'adrénaline et de la noradrénaline dans la circulation sanguine", isCorrect: true },
      { text: "Elle libère de l'acétylcholine directement dans le sang", isCorrect: false },
      { text: "Elle est dépourvue d'innervation nerveuse", isCorrect: false },
      { text: "Elle produit des hormones stéroïdiennes", isCorrect: false },
    ],
  },
  {
    text: "Concernant les compartiments liquidiens du corps humain, laquelle des affirmations est CORRECTE ?",
    explanation: "Le volume plasmatique représente environ 4-5 % du poids corporel (environ 3 L chez un adulte de 70 kg). L'eau intracellulaire représente 40 %. Le liquide interstitiel est un ultrafiltrat plasmatique sans protéines. L'eau totale est de 45-75 %.",
    options: [
      { text: "L'eau intracellulaire représente environ 20 % du poids corporel total", isCorrect: false },
      { text: "Le volume plasmatique représente environ 4 % du poids corporel (environ 3 L chez un adulte de 70 kg)", isCorrect: true },
      { text: "Le liquide interstitiel a une composition ionique identique au plasma, incluant les protéines", isCorrect: false },
      { text: "L'eau totale représente environ 30 % du poids corporel chez l'adulte", isCorrect: false },
      { text: "Le volume sanguin total est d'environ 8 L chez l'adulte", isCorrect: false },
    ],
  },
  {
    text: "La mesure du volume extracellulaire peut être réalisée en utilisant :",
    explanation: "L'inuline et le mannitol traversent la paroi des capillaires (donc se distribuent dans le secteur extracellulaire) mais ne traversent pas la membrane cellulaire (donc restent dans l'extracellulaire).",
    options: [
      { text: "L'eau tritiée (³H₂O) qui se distribue dans tous les compartiments", isCorrect: false },
      { text: "L'inuline ou le mannitol, qui traversent la paroi capillaire mais pas la membrane cellulaire", isCorrect: true },
      { text: "L'albumine marquée à l'iode ¹³¹I, qui traverse librement la membrane cellulaire", isCorrect: false },
      { text: "Le bleu d'Evans, qui se distribue dans le compartiment intracellulaire", isCorrect: false },
      { text: "La bioimpédance électrique, qui mesure directement le volume plasmatique", isCorrect: false },
    ],
  },
  {
    text: "Selon la loi de Starling, au niveau du versant artériolaire d'un capillaire, la pression de filtration nette est positive (environ +10 mmHg). Qu'est-ce que cela signifie ?",
    explanation: "Une pression de filtration nette positive signifie que la pression hydrostatique capillaire excède la pression oncotique ; l'eau sort du capillaire vers l'interstitium. Au versant veineux, la pression est négative, l'eau rentre.",
    options: [
      { text: "L'eau se déplace du compartiment interstitiel vers le compartiment plasmatique", isCorrect: false },
      { text: "L'eau se déplace du compartiment plasmatique vers le compartiment interstitiel", isCorrect: true },
      { text: "Il n'y a pas de mouvement d'eau à travers la paroi capillaire", isCorrect: false },
      { text: "La pression oncotique capillaire est supérieure à la pression hydrostatique capillaire", isCorrect: false },
      { text: "Les protéines plasmatiques quittent le capillaire vers l'interstitium", isCorrect: false },
    ],
  },
  {
    text: "La régulation de la soif et de la sécrétion d'hormone antidiurétique (ADH) est principalement contrôlée par :",
    explanation: "La soif et la sécrétion d'ADH sont principalement contrôlées par les osmorécepteurs hypothalamiques (détectent l'osmolarité plasmatique). Les barorécepteurs modulent également l'ADH, mais le stimulus principal est l'osmolarité.",
    options: [
      { text: "Les barorécepteurs de l'oreillette droite et du sinus carotidien", isCorrect: false },
      { text: "Les osmorécepteurs hypothalamiques qui détectent les variations de l'osmolarité plasmatique", isCorrect: true },
      { text: "La sécrétion d'aldostérone par le cortex surrénalien", isCorrect: false },
      { text: "Les chimiorécepteurs centraux sensibles au CO₂", isCorrect: false },
      { text: "Les récepteurs de l'angiotensine II", isCorrect: false },
    ],
  },
  {
    text: "L'aldostérone, une hormone stéroïdienne synthétisée par la zone glomérulée du cortex surrénalien, agit principalement sur :",
    explanation: "L'aldostérone agit sur les cellules principales du tube collecteur et du tube contourné distal pour augmenter la réabsorption du sodium (en échange du potassium et des protons), augmentant la volémie.",
    options: [
      { text: "Le tube contourné proximal pour augmenter la réabsorption du glucose", isCorrect: false },
      { text: "Le tube collecteur pour augmenter la réabsorption du sodium et l'excrétion du potassium", isCorrect: true },
      { text: "Les vaisseaux sanguins pour provoquer une vasodilatation", isCorrect: false },
      { text: "L'hypothalamus pour stimuler la soif", isCorrect: false },
      { text: "Le cœur pour augmenter la force de contraction", isCorrect: false },
    ],
  },
  {
    text: "Dans la communication intercellulaire, un ligand liposoluble (exemple : hormone stéroïdienne) :",
    explanation: "Les ligands liposolubles (hormones stéroïdiennes, thyroïdiennes, acide rétinoïque, vitamine D) traversent la membrane plasmique par diffusion et se lient à des récepteurs intracellulaires (cytosoliques ou nucléaires), modulant la transcription génique.",
    options: [
      { text: "Se lie à un récepteur membranaire de surface, activant une protéine G", isCorrect: false },
      { text: "Traverse la membrane plasmique et se lie à un récepteur intracellulaire (cytosolique ou nucléaire), modulant la transcription génique", isCorrect: true },
      { text: "Agit exclusivement par voie paracrine", isCorrect: false },
      { text: "Est inactif en dehors de la cellule cible", isCorrect: false },
      { text: "Active directement les canaux ioniques de la membrane", isCorrect: false },
    ],
  },
  {
    text: "Un récepteur couplé aux protéines G (RCPG) est activé par un ligand. La sous-unité α de la protéine G, lorsqu'elle est liée au GTP :",
    explanation: "La sous-unité α-GTP (active) se dissocie des sous-unités βγ et active ou inhibe un effecteur primaire (adénylyl cyclase, phospholipase C, canal ionique). Elle est inactive lorsqu'elle est liée au GDP.",
    options: [
      { text: "Se réassocie immédiatement avec les sous-unités βγ", isCorrect: false },
      { text: "Active ou inhibe un effecteur primaire (exemple : adénylyl cyclase ou phospholipase C)", isCorrect: true },
      { text: "Est inactive et ne peut pas agir sur les effecteurs", isCorrect: false },
      { text: "Se lie au récepteur pour le désensibiliser", isCorrect: false },
      { text: "Est hydrolysée en GDP puis dégradée", isCorrect: false },
    ],
  },
  {
    text: "L'AMPc est un second messager majeur. Sa synthèse à partir de l'ATP est catalysée par :",
    explanation: "L'adénylyl cyclase (AC) catalyse la synthèse d'AMPc à partir d'ATP. Elle est activée par la sous-unité αs-GTP (stimulatrice) et inhibée par αi-GTP.",
    options: [
      { text: "La phosphodiestérase", isCorrect: false },
      { text: "La guanylate cyclase", isCorrect: false },
      { text: "L'adénylyl cyclase, activée par la sous-unité αs-GTP des protéines G", isCorrect: true },
      { text: "La phospholipase C", isCorrect: false },
      { text: "La protéine kinase A", isCorrect: false },
    ],
  },
  {
    text: "L'activation de la phospholipase C via un RCPG conduit à la formation de :",
    explanation: "La phospholipase C (PLC) hydrolyse le phosphatidylinositol 4,5-bisphosphate (PIP2) membranaire en inositol triphosphate (IP3) et diacylglycérol (DAG). L'IP3 libère le Ca²⁺ du réticulum endoplasmique, et le DAG active la protéine kinase C (PKC).",
    options: [
      { text: "AMPc et GMPc", isCorrect: false },
      { text: "Inositol triphosphate (IP3) et diacylglycérol (DAG)", isCorrect: true },
      { text: "Ca²⁺ et calmoduline", isCorrect: false },
      { text: "Tyrosine phosphorylée", isCorrect: false },
      { text: "Adénosine et phosphate", isCorrect: false },
    ],
  },
  {
    text: "Le métabolisme de base (MB) est la dépense énergétique minimale pour maintenir les fonctions vitales au repos. Parmi les facteurs suivants, lequel influence le plus le MB ?",
    explanation: "Le métabolisme de base est principalement déterminé par la masse maigre (tissus métaboliquement actifs : muscles, organes, cerveau). La masse grasse est moins active métaboliquement.",
    options: [
      { text: "La masse grasse corporelle", isCorrect: false },
      { text: "La masse maigre corporelle (muscles, organes)", isCorrect: true },
      { text: "L'apport calorique alimentaire", isCorrect: false },
      { text: "La température ambiante", isCorrect: false },
      { text: "Le rythme circadien", isCorrect: false },
    ],
  },
];

async function main() {
  console.log("Starting to insert Physiologie questions...\n");

  let subject = await prisma.subject.findFirst({
    where: { name: { equals: SUBJECT_NAME, mode: 'insensitive' } },
  });

  if (!subject) {
    console.log(`Subject '${SUBJECT_NAME}' not found. Creating...`);
    const category = await prisma.category.findFirst();
    subject = await prisma.subject.create({
      data: {
        name: SUBJECT_NAME,
        slug: `physiologie-${Date.now()}`,
        description: 'Physiologie - Semestre 2',
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
