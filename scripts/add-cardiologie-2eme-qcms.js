const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
});

const SUBJECT_ID = 'cmqusirh5000ujx040c8y6jut'; // Cardiologie (السنة الثانية)
const STUDY_YEAR = 'السنة الثانية';

const questions = [
  {
    text: "Concernant la crosse de l'aorte et ses rapports, laquelle des affirmations suivantes est EXACTE ?",
    difficulty: "MEDIUM",
    explanation: "Le nerf laryngé récurrent gauche monte dans l'angle trachéo-œsophagien en rapport avec la face postéro-droite de la crosse de l'aorte. La veine brachiocéphalique gauche passe au-dessus de la crosse (A). Le ligament artériel relie la face inférieure de la crosse à l'artère pulmonaire gauche (C). Le conduit thoracique monte en arrière de l'œsophage (D). Le ganglion de Wrisberg est situé sous la partie horizontale de la crosse (E).",
    keywords: "crosse aorte, nerf laryngé récurrent, ligament artériel, conduit thoracique",
    options: [
      { text: "La veine brachiocéphalique gauche passe en arrière de la crosse de l'aorte", isCorrect: false, order: 0 },
      { text: "Le nerf laryngé récurrent gauche monte dans l'angle trachéo-œsophagien en rapport avec la face postéro-droite de la crosse", isCorrect: true, order: 1 },
      { text: "Le ligament artériel relie la face inférieure de la crosse à l'artère pulmonaire droite", isCorrect: false, order: 2 },
      { text: "Le conduit thoracique chemine sur la face antéro-gauche de la crosse", isCorrect: false, order: 3 },
      { text: "Le ganglion de Wrisberg est situé sur la face supérieure de la crosse, en regard de l'origine de l'artère brachiocéphalique", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "L'artère coronaire droite, dans son trajet et ses branches, présente des rapports et des territoires spécifiques. Parmi les propositions suivantes, laquelle est FAUSSE ?",
    difficulty: "MEDIUM",
    explanation: "L'artère coronaire droite chemine dans le sillon atrio-ventriculaire droit, contourne le bord droit du cœur et suit le sillon AV postérieur. Elle ne 'croise' pas simplement la face inférieure. Les autres affirmations sont correctes.",
    keywords: "artère coronaire droite, nœud sinusal, interventriculaire postérieure",
    options: [
      { text: "L'artère coronaire droite naît de l'aorte ascendante en regard de la valvule semi-lunaire antérieure droite", isCorrect: false, order: 0 },
      { text: "L'artère du nœud sinusal naît dans le segment 1 (portion proximale) de l'artère coronaire droite", isCorrect: false, order: 1 },
      { text: "L'artère interventriculaire postérieure est une branche terminale de l'artère coronaire droite et vascularise le 1/3 postérieur du septum interventriculaire", isCorrect: false, order: 2 },
      { text: "L'artère coronaire droite chemine dans le sillon atrio-ventriculaire droit puis croise la face inférieure du cœur", isCorrect: true, order: 3 },
      { text: "L'artère coronaire droite donne des branches atriales antérieure, latérale et postérieure, ainsi que l'artère marginale droite", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant le système cardio-necteur (tissu nodal) du cœur, lequel des énoncés suivants est INCORRECT ?",
    difficulty: "MEDIUM",
    explanation: "La branche gauche du faisceau de His est plus volumineuse que la branche droite (et non moins). Elle traverse le septum interventriculaire entre la pars membranacea et la pars musculosa.",
    keywords: "nœud sinusal, nœud AV, faisceau de His, Purkinje",
    options: [
      { text: "Le nœud sino-atrial (nœud de Keith et Flack) est situé dans la paroi postérieure de l'atrium droit, près de l'ostium de la veine cave supérieure", isCorrect: false, order: 0 },
      { text: "Le nœud atrio-ventriculaire (nœud d'Aschoff et Tawara) est situé à la face inférieure de l'atrium droit, près de la partie antéro-inférieure du septum inter-atrial", isCorrect: false, order: 1 },
      { text: "Le faisceau de His prolonge le nœud atrio-ventriculaire et chemine le long du bord droit du septum atrio-ventriculaire", isCorrect: false, order: 2 },
      { text: "La branche gauche du faisceau de His est moins volumineuse que la branche droite et traverse le septum interventriculaire au niveau de sa pars membranacea", isCorrect: true, order: 3 },
      { text: "Le réseau de Purkinje droit et gauche constitue le réseau terminal sous-endocardique des fibres musculaires spécialisées", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Un patient présente un souffle cardiaque et une échocardiographie révèle une communication interventriculaire (CIV) au niveau de la pars membranacea. Cette structure correspond embryologiquement à :",
    difficulty: "HARD",
    explanation: "La pars membranacea de la cloison interventriculaire est formée par la fusion de trois bourgeons issus des bourrelets aortico-pulmonaires (droit, gauche et postérieur).",
    keywords: "CIV, pars membranacea, bourrelets aortico-pulmonaires",
    options: [
      { text: "La fusion des bourrelets aortico-pulmonaires droit et gauche avec le septum intermedium", isCorrect: false, order: 0 },
      { text: "L'association de trois bourgeons issus des bourrelets aortico-pulmonaires (droit, gauche et postérieur)", isCorrect: true, order: 1 },
      { text: "Le septum infundibulaire (outlet septum) issu du conus artériel", isCorrect: false, order: 2 },
      { text: "La fusion du septum primum et du septum secundum au niveau du foramen ovale", isCorrect: false, order: 3 },
      { text: "La persistance du canal artériel après la naissance", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant la circulation fœtale et les modifications à la naissance, laquelle des affirmations suivantes est CORRECTE ?",
    difficulty: "MEDIUM",
    explanation: "Le canal d'Arantius (canal veineux) court-circuite le foie et dérive le sang oxygéné de la veine ombilicale vers la veine cave inférieure.",
    keywords: "circulation fœtale, canal d'Arantius, foramen ovale, canal artériel",
    options: [
      { text: "La veine ombilicale transporte du sang désoxygéné du placenta vers le foie", isCorrect: false, order: 0 },
      { text: "Le canal d'Arantius (canal veineux) court-circuite le foie et dérive le sang oxygéné vers la veine cave inférieure", isCorrect: true, order: 1 },
      { text: "Le foramen ovale permet le passage du sang de l'atrium gauche vers l'atrium droit chez le fœtus", isCorrect: false, order: 2 },
      { text: "Le canal artériel relie l'aorte descendante à l'artère pulmonaire gauche", isCorrect: false, order: 3 },
      { text: "À la naissance, la fermeture du canal artériel est due à une augmentation de la pression dans l'atrium gauche et une diminution dans l'atrium droit", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant la configuration interne du ventricule droit, laquelle des affirmations suivantes est EXACTE ?",
    difficulty: "MEDIUM",
    explanation: "La valve tricuspide est formée de trois cuspides (antérieure, postérieure et septale) qui reçoivent les cordages tendineux.",
    keywords: "ventricule droit, valve tricuspide, muscles papillaires, trabécule",
    options: [
      { text: "Le ventricule droit présente trois muscles papillaires : antérieur, postérieur et septal", isCorrect: false, order: 0 },
      { text: "La trabécule septo-marginale (bandelette ansiforme) est une colonne charnue de 3ème ordre tendue de la paroi médiale à la paroi antérieure", isCorrect: false, order: 1 },
      { text: "La valve tricuspide est formée de trois cuspides : antérieure, postérieure et septale, qui reçoivent les cordages tendineux des muscles papillaires", isCorrect: true, order: 2 },
      { text: "L'ostium du tronc pulmonaire est situé en dessous et à droite de l'ostium atrio-ventriculaire droit", isCorrect: false, order: 3 },
      { text: "La chambre d'éjection du ventricule droit est située en regard de la valve tricuspide", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Le sinus coronaire est le principal collecteur veineux du cœur. Parmi les propositions suivantes concernant ses affluents, laquelle est CORRECTE ?",
    difficulty: "MEDIUM",
    explanation: "La grande veine du cœur naît près de la pointe dans le sillon interventriculaire antérieur et se termine dans le sinus coronaire.",
    keywords: "sinus coronaire, grande veine du cœur, petite veine, veine moyenne",
    options: [
      { text: "La grande veine du cœur naît près de la pointe du cœur dans le sillon interventriculaire antérieur et se termine dans le sinus coronaire", isCorrect: true, order: 0 },
      { text: "La petite veine du cœur suit le sillon interventriculaire postérieur depuis l'apex du cœur", isCorrect: false, order: 1 },
      { text: "La veine moyenne du cœur suit le sillon atrio-ventriculaire droit et se jette directement dans l'atrium droit", isCorrect: false, order: 2 },
      { text: "Le sinus coronaire reçoit la veine du bord droit (marginale) et les veines minimes du cœur", isCorrect: false, order: 3 },
      { text: "Le sinus coronaire se termine dans l'atrium gauche par un ostium bordé d'une valvule", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant les arcs aortiques embryonnaires, l'évolution du 4ème arc aortique gauche donne :",
    difficulty: "MEDIUM",
    explanation: "Le 4ème arc aortique gauche donne la crosse de l'aorte. Le 4ème arc droit donne l'artère sous-clavière droite. Le 6ème arc donne l'artère pulmonaire primitive.",
    keywords: "arcs aortiques embryonnaires, 4ème arc, crosse aorte",
    options: [
      { text: "L'artère sous-clavière gauche", isCorrect: false, order: 0 },
      { text: "La crosse de l'aorte", isCorrect: true, order: 1 },
      { text: "L'artère pulmonaire primitive", isCorrect: false, order: 2 },
      { text: "L'artère maxillaire interne", isCorrect: false, order: 3 },
      { text: "L'artère carotide commune gauche", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant l'atrium droit, laquelle des affirmations suivantes concernant ses parois est FAUSSE ?",
    difficulty: "MEDIUM",
    explanation: "La fosse ovale est située sur la paroi médiale (septale) de l'atrium droit, et non sur la paroi latérale.",
    keywords: "atrium droit, fosse ovale, valvule d'Eustachi, valvule de Thébésius",
    options: [
      { text: "La paroi supérieure de l'atrium droit présente l'ostium de la veine cave supérieure", isCorrect: false, order: 0 },
      { text: "La paroi inférieure présente l'ostium de la veine cave inférieure muni de la valvule d'Eustachi", isCorrect: false, order: 1 },
      { text: "La paroi latérale (droite) est parcourue par les muscles pectinés", isCorrect: false, order: 2 },
      { text: "La fosse ovale est située sur la paroi latérale de l'atrium droit et représente le vestige du trou de Botal", isCorrect: true, order: 3 },
      { text: "L'ostium du sinus coronaire est situé sur la paroi inférieure de l'atrium droit et est muni de la valvule de Thébésius", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Le péricarde est une enveloppe fibro-séreuse du cœur. Concernant ses structures, laquelle des affirmations suivantes est EXACTE ?",
    difficulty: "MEDIUM",
    explanation: "Les ligaments phréno-péricardiques sont au nombre de trois et assurent la fixité du péricarde sur le diaphragme.",
    keywords: "péricarde, péricarde fibreux, péricarde séreux, ligaments phréno-péricardiques",
    options: [
      { text: "Le péricarde fibreux est la couche profonde, mince, en contact direct avec le cœur", isCorrect: false, order: 0 },
      { text: "Le feuillet viscéral du péricarde séreux est appelé épicarde et tapisse la face profonde du péricarde fibreux", isCorrect: false, order: 1 },
      { text: "La cavité péricardique est une cavité réelle, toujours présente, contenant du liquide séreux", isCorrect: false, order: 2 },
      { text: "Les ligaments phréno-péricardiques sont au nombre de trois (antérieur, droit et gauche) et assurent la fixité du péricarde sur le diaphragme", isCorrect: true, order: 3 },
      { text: "Le ligament cervico-péricardique relie le péricarde au sternum", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant les espaces péri-pharyngiens et leurs limites, un patient présente une cellulite de l'espace rétro-pharyngien. Quelle est la limite POSTÉRIEURE de cet espace ?",
    difficulty: "HARD",
    explanation: "L'espace rétro-pharyngien est limité en arrière par la lame prévertébrale de l'aponévrose cervicale (fascia prévertébral).",
    keywords: "espace rétro-pharyngien, lame prévertébrale, aponévrose cervicale",
    options: [
      { text: "La lame superficielle de l'aponévrose cervicale", isCorrect: false, order: 0 },
      { text: "Le fascia péri-pharyngien", isCorrect: false, order: 1 },
      { text: "La lame prévertébrale de l'aponévrose cervicale", isCorrect: true, order: 2 },
      { text: "Le raphé pharyngien", isCorrect: false, order: 3 },
      { text: "La paroi postérieure du pharynx", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant les muscles constricteurs du pharynx, un patient présente une dysphagie. L'examen révèle une atteinte du nerf vague (X) qui innerve tous les muscles constricteurs. Parmi ces muscles, lequel possède une insertion postérieure commune sur le raphé pharyngien ?",
    difficulty: "MEDIUM",
    explanation: "Les trois muscles constricteurs (supérieur, moyen et inférieur) ont une insertion postérieure commune sur le raphé pharyngien.",
    keywords: "constricteurs pharynx, raphé pharyngien, dysphagie",
    options: [
      { text: "Le constricteur supérieur uniquement", isCorrect: false, order: 0 },
      { text: "Le constricteur moyen uniquement", isCorrect: false, order: 1 },
      { text: "Le constricteur inférieur uniquement", isCorrect: false, order: 2 },
      { text: "Les trois muscles constricteurs (supérieur, moyen et inférieur)", isCorrect: true, order: 3 },
      { text: "Le stylo-pharyngien et le palato-pharyngien uniquement", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant l'anatomie du larynx, un patient présente une paralysie de la corde vocale droite en position paramédiane. Cette paralysie est due à une atteinte du nerf laryngé récurrent droit. Quel est le trajet exact de ce nerf chez l'adulte ?",
    difficulty: "HARD",
    explanation: "Le nerf laryngé récurrent droit naît du nerf vague droit au niveau de l'artère subclavière droite, contourne cette artère et monte le long du bord droit de la trachée.",
    keywords: "nerf laryngé récurrent, corde vocale, nerf vague, trachée",
    options: [
      { text: "Il naît du nerf vague gauche au niveau de la crosse de l'aorte, contourne l'artère subclavière gauche et monte dans l'angle trachéo-œsophagien", isCorrect: false, order: 0 },
      { text: "Il naît du nerf vague droit au niveau de l'artère subclavière droite, contourne cette artère et monte le long du bord droit de la trachée", isCorrect: true, order: 1 },
      { text: "Il naît du nerf vague droit au niveau du thorax, en avant de la crosse de l'aorte, et monte directement jusqu'au larynx", isCorrect: false, order: 2 },
      { text: "Il naît du nerf vague gauche au niveau de l'arc aortique, passe en avant de l'artère subclavière gauche et monte verticalement", isCorrect: false, order: 3 },
      { text: "Il naît du nerf vague droit au niveau du ganglion inférieur, traverse la membrane thyro-hyoïdienne et se distribue à la muqueuse supra-glottique", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant les rapports du segment cervical de la trachée, un médecin réalise une trachéotomie d'urgence. Le 'losange de la trachéotomie' est délimité par quels muscles infra-hyoïdiens ?",
    difficulty: "MEDIUM",
    explanation: "Le losange de la trachéotomie est délimité par les muscles infra-hyoïdiens : sterno-hyoïdien en dehors, sterno-thyroïdien en dedans, et omo-hyoïdien en bas.",
    keywords: "trachéotomie, losange, muscles infra-hyoïdiens, sterno-hyoïdien",
    options: [
      { text: "Sterno-hyoïdien, sterno-thyroïdien et omo-hyoïdien", isCorrect: true, order: 0 },
      { text: "Sterno-hyoïdien, thyro-hyoïdien et omo-hyoïdien", isCorrect: false, order: 1 },
      { text: "Sterno-thyroïdien, thyro-hyoïdien et omo-hyoïdien", isCorrect: false, order: 2 },
      { text: "Sterno-hyoïdien, sterno-thyroïdien et digastrique", isCorrect: false, order: 3 },
      { text: "Sterno-hyoïdien, sterno-thyroïdien et stylo-hyoïdien", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant le poumon droit, un patient présente une tumeur au niveau du lobe moyen. Quelles sont les limites anatomiques de ce lobe ?",
    difficulty: "MEDIUM",
    explanation: "Le lobe moyen du poumon droit est délimité par la grande scissure en bas et la petite scissure en haut.",
    keywords: "poumon droit, lobe moyen, scissure oblique, scissure horizontale",
    options: [
      { text: "La grande scissure (scissure oblique) seule, séparant le lobe moyen du lobe inférieur", isCorrect: false, order: 0 },
      { text: "La petite scissure (scissure horizontale) seule, séparant le lobe moyen du lobe supérieur", isCorrect: false, order: 1 },
      { text: "La grande scissure (scissure oblique) et la petite scissure (scissure horizontale), délimitant le lobe moyen entre les lobes supérieur et inférieur", isCorrect: true, order: 2 },
      { text: "Le hile pulmonaire et la grande scissure (scissure oblique)", isCorrect: false, order: 3 },
      { text: "La face médiastinale et la scissure oblique", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant les plèvres et les culs-de-sac pleuraux, un patient présente un épanchement pleural gauche important. Quel cul-de-sac pleural est le PLUS DÉCLIVE en position debout et où le liquide s'accumule-t-il en premier ?",
    difficulty: "EASY",
    explanation: "Le cul-de-sac costo-diaphragmatique (inférieur) est le plus déclive des culs-de-sac pleuraux en position debout.",
    keywords: "plèvre, cul-de-sac costo-diaphragmatique, épanchement pleural",
    options: [
      { text: "Le cul-de-sac médiastino-diaphragmatique", isCorrect: false, order: 0 },
      { text: "Le cul-de-sac costo-diaphragmatique (inférieur)", isCorrect: true, order: 1 },
      { text: "Le cul-de-sac médiastino-costal antérieur (rétro-sternal)", isCorrect: false, order: 2 },
      { text: "Le cul-de-sac médiastino-costal postérieur (latéro-vertébral)", isCorrect: false, order: 3 },
      { text: "Le dôme pleural", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant le diaphragme, un patient présente une hernie hiatale. Le hiatus œsophagien est traversé par l'œsophage et par quel autre élément anatomique ?",
    difficulty: "MEDIUM",
    explanation: "Le hiatus œsophagien (niveau T10) est traversé par l'œsophage et les deux nerfs vagues (troncs antérieur et postérieur).",
    keywords: "diaphragme, hiatus œsophagien, nerfs vagues, hernie hiatale",
    options: [
      { text: "Le nerf phrénique droit", isCorrect: false, order: 0 },
      { text: "Les deux nerfs vagues (troncs antérieur et postérieur)", isCorrect: true, order: 1 },
      { text: "La veine azygos", isCorrect: false, order: 2 },
      { text: "Le conduit thoracique", isCorrect: false, order: 3 },
      { text: "L'aorte thoracique", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant la constitution de la trachée, laquelle des affirmations suivantes concernant la disposition des anneaux cartilagineux est EXACTE ?",
    difficulty: "EASY",
    explanation: "Les anneaux cartilagineux de la trachée sont incomplets, ouverts en arrière, et reliés entre eux par des ligaments interannulaires.",
    keywords: "trachée, anneaux cartilagineux, ligaments interannulaires",
    options: [
      { text: "Les anneaux cartilagineux sont complets et forment un tube rigide sur toute la circonférence", isCorrect: false, order: 0 },
      { text: "Les anneaux cartilagineux sont incomplets, ouverts en arrière, et reliés entre eux par des ligaments interannulaires", isCorrect: true, order: 1 },
      { text: "Les anneaux cartilagineux sont incomplets, ouverts en avant, et le muscle trachéal comble l'ouverture antérieure", isCorrect: false, order: 2 },
      { text: "Les anneaux cartilagineux sont disposés longitudinalement et non transversalement", isCorrect: false, order: 3 },
      { text: "Les anneaux cartilagineux sont au nombre de 5 à 7 et leur hauteur est de 10 mm chacun", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant l'innervation du larynx, un patient présente une paralysie du muscle crico-thyroïdien. Quel nerf est atteint et quelle est la conséquence sur la phonation ?",
    difficulty: "HARD",
    explanation: "Le nerf laryngé supérieur (branche exterbe, motrice) innerve le crico-thyroïdien. Sa paralysie entraîne une diminution de la tension des cordes vocales.",
    keywords: "larynx, crico-thyroïdien, nerf laryngé supérieur, phonation",
    options: [
      { text: "Le nerf laryngé récurrent, entraînant une paralysie de l'abduction des cordes vocales", isCorrect: false, order: 0 },
      { text: "Le nerf laryngé supérieur (branche externe), entraînant une diminution de la tension des cordes vocales et une voix faible et monocorde (fatigue vocale)", isCorrect: true, order: 1 },
      { text: "Le nerf laryngé supérieur (branche interne), entraînant une anesthésie de la muqueuse supra-glottique", isCorrect: false, order: 2 },
      { text: "Le nerf laryngé récurrent, entraînant une paralysie des adducteurs des cordes vocales", isCorrect: false, order: 3 },
      { text: "Le nerf vague, entraînant une paralysie complète du larynx", isCorrect: false, order: 4 },
    ],
  },
  {
    text: "Concernant les rapports de la trachée dans son segment thoracique, un patient présente un syndrome de la veine cave supérieure par compression tumorale. Quelle structure est en rapport immédiat avec la face antérieure de la trachée thoracique et peut être comprimée par une tumeur trachéale ou médiastinale antérieure ?",
    difficulty: "HARD",
    explanation: "Le tronc veineux brachiocéphalique gauche (TVBC gauche) croise la face antérieure de la trachée thoracique dans sa partie supérieure.",
    keywords: "trachée thoracique, TVBC gauche, syndrome veine cave supérieure",
    options: [
      { text: "L'œsophage", isCorrect: false, order: 0 },
      { text: "Le nerf vague droit", isCorrect: false, order: 1 },
      { text: "Le tronc veineux brachiocéphalique gauche (TVBC gauche)", isCorrect: true, order: 2 },
      { text: "La crosse de l'aorte", isCorrect: false, order: 3 },
      { text: "Le nerf phrénique gauche", isCorrect: false, order: 4 },
    ],
  },
];

async function main() {
  console.log("Starting to add Cardiologie 2ème année QCM questions...\n");

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

  if (createdQuestionIds.length > 0) {
    console.log("\nCreating QuizExam...");
    const exam = await prisma.quizExam.create({
      data: {
        title: "QCM Cardiologie - 2ème année",
        description: "Examen QCM sur la cardiologie : crosse aorte, artères coronaires, système nodal, circulation fœtale, péricarde, pharynx, larynx, trachée, poumons, plèvre et diaphragme.",
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
