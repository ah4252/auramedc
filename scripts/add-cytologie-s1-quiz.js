const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDY_YEAR = 'السنة الاولى';
const SUBJECT_NAME = 'Cytologie S1';
const DIFFICULTY = 'MEDIUM';

const questions = [
  {
    text: "Concernant la théorie cellulaire, lequel des énoncés suivants est FAUX ?",
    explanation: "Les virus ne sont pas considérés comme des cellules ; ce sont des entités biologiques parasites acaryotes, dépourvues de métabolisme, ne pouvant se reproduire que dans une cellule hôte.",
    options: [
      { text: "Tous les êtres vivants sont composés d'au moins une cellule", isCorrect: false },
      { text: "Les cellules sont l'unité de base de la vie", isCorrect: false },
      { text: "Toutes les cellules proviennent de cellules préexistantes", isCorrect: false },
      { text: "Les virus sont considérés comme des cellules acaryotes", isCorrect: true },
      { text: "La cellule est l'unité fondamentale, structurale et fonctionnelle de l'organisme vivant", isCorrect: false },
    ],
  },
  {
    text: "La membrane plasmique observée en microscopie électronique après fixation au tétroxyde d'osmium présente une structure tri lamellaire. Quelle est l'épaisseur approximative de cette structure et quels sont ses constituants ?",
    explanation: "La membrane plasmique observée au ME après fixation au tétroxyde d'osmium (fixateur qui colore les lipides) présente une structure tri lamellaire de 75 Å (environ 7,5 nm) formée de deux feuillets sombres (denses aux électrons) séparés par un feuillet clair.",
    options: [
      { text: "75 Å, formée de trois feuillets : deux feuillets clairs séparés par un feuillet dense", isCorrect: false },
      { text: "75 nm, formée de trois feuillets : deux feuillets sombres séparés par un feuillet clair", isCorrect: false },
      { text: "75 Å, formée de deux feuillets sombres séparés par un feuillet clair", isCorrect: true },
      { text: "75 nm, formée de deux feuillets clairs séparés par un feuillet sombre", isCorrect: false },
      { text: "7,5 nm, formée d'une monocouche lipidique avec des protéines intrinsèques", isCorrect: false },
    ],
  },
  {
    text: "Le modèle de la mosaïque fluide proposé par Singer et Nicholson en 1972 décrit la membrane plasmique comme asymétrique. Quelle affirmation concernant cette asymétrie est CORRECTE ?",
    explanation: "Les phospholipides sont distribués asymétriquement ; la phosphatidylsérine est du côté cytosolique ; les glycolipides sont du côté externe. Les protéines membranaires peuvent diffuser latéralement. Le \"flip-flop\" est limité et nécessite des enzymes spécifiques.",
    options: [
      { text: "Les phospholipides sont distribués de manière symétrique entre les deux feuillets", isCorrect: false },
      { text: "Les glycolipides sont exclusivement présents sur le feuillet cytosolique", isCorrect: false },
      { text: "La phosphatidylsérine est principalement localisée sur le feuillet externe de la membrane", isCorrect: false },
      { text: "Les protéines membranaires peuvent diffuser latéralement mais ne peuvent pas effectuer de \"flip-flop\" sans l'aide d'enzymes spécifiques", isCorrect: true },
      { text: "Le cholestérol est absent de la membrane plasmique des cellules animales", isCorrect: false },
    ],
  },
  {
    text: "La technique de cryofracture suivie de cryodécapage permet d'observer des répliques de membranes. Lors de cette technique, la fracture de l'échantillon congelé :",
    explanation: "La cryofracture sépare la bicouche lipidique en ses deux hémi-membranes (feuillet externe exoplasmique et feuillet interne protoplasmique), exposant ainsi la face interne des protéines membranaires intégrées.",
    options: [
      { text: "Coupe la membrane perpendiculairement, révélant sa structure tri lamellaire", isCorrect: false },
      { text: "Sépare la bicouche lipidique en ses deux hémi-membranes, exposant la face interne des protéines membranaires", isCorrect: true },
      { text: "Décolle le glycocalyx de la surface membranaire", isCorrect: false },
      { text: "Dénature les protéines transmembranaires pour les rendre observables", isCorrect: false },
      { text: "Dissout les lipides membranaires, ne laissant que les protéines", isCorrect: false },
    ],
  },
  {
    text: "Concernant les protéines membranaires, laquelle des affirmations suivantes est FAUSSE ?",
    explanation: "L'ancre GPI (glycosyl-phosphatidylinositol) est située du côté extracellulaire, liée à l'extrémité C-terminale de la protéine, et non du côté cytoplasmique.",
    options: [
      { text: "Les protéines intrinsèques peuvent être transmembranaires monotopiques ou polytopiques", isCorrect: false },
      { text: "La glycophorine est un exemple de protéine transmembranaire monotopique", isCorrect: false },
      { text: "Les protéines périphériques sont localisées en dehors de la bicouche lipidique", isCorrect: false },
      { text: "L'ancre GPI (glycosyl-phosphatidylinositol) est une modification lipidique qui ancre les protéines à la membrane du côté cytoplasmique", isCorrect: true },
      { text: "La myristoylation consiste en l'ajout d'un acide myristique sur une glycine en position N-terminale", isCorrect: false },
    ],
  },
  {
    text: "Le réticulum endoplasmique rugueux (REG) et le réticulum endoplasmique lisse (REL) présentent des fonctions distinctes. Laquelle des fonctions suivantes est spécifiquement associée au REL ?",
    explanation: "La synthèse des phospholipides et du cholestérol est une fonction spécifique du réticulum endoplasmique lisse (REL). Les autres fonctions sont associées au REG.",
    options: [
      { text: "La synthèse des protéines sécrétées", isCorrect: false },
      { text: "La N-glycosylation des protéines", isCorrect: false },
      { text: "La synthèse des phospholipides et du cholestérol", isCorrect: true },
      { text: "La translocation des protéines dans la lumière réticulaire", isCorrect: false },
      { text: "La fixation des ribosomes sur la membrane réticulaire", isCorrect: false },
    ],
  },
  {
    text: "La translocation des protéines dans la lumière du réticulum endoplasmique rugueux fait intervenir plusieurs acteurs moléculaires. Quel est l'ordre chronologique correct des événements suivant la synthèse du peptide signal ?",
    explanation: "L'ordre correct est : synthèse du peptide signal → fixation de la PRS → blocage de la synthèse → fixation au récepteur de la PRS → dissociation de la PRS → ouverture du pore de translocation → coupure du peptide signal.",
    options: [
      { text: "Fixation de la PRS → blocage de la synthèse → fixation au récepteur de la PRS → dissociation de la PRS → ouverture du pore de translocation → coupure du peptide signal", isCorrect: true },
      { text: "Fixation au récepteur du ribosome → ouverture du pore → synthèse de la protéine → fixation de la PRS → coupure du peptide signal", isCorrect: false },
      { text: "Synthèse de la protéine → fixation de la PRS → translocation → coupure du peptide signal → libération dans le cytosol", isCorrect: false },
      { text: "Fixation de la PRS → ouverture du pore → translocation → fixation au récepteur de la PRS → coupure du peptide signal", isCorrect: false },
      { text: "Synthèse du peptide signal → translocation → fixation de la PRS → coupure du peptide signal → libération dans la lumière", isCorrect: false },
    ],
  },
  {
    text: "L'appareil de Golgi est une structure polaire comportant deux faces distinctes. La face trans est caractérisée par :",
    explanation: "La face trans de l'appareil de Golgi est caractérisée par des saccules plus dilatés et la formation de vésicules recouvertes de clathrine pour le transport vers les lysosomes, la membrane plasmique ou la sécrétion.",
    options: [
      { text: "La présence de saccules dilatés et le bourgeonnement de vésicules de transition en provenance du réticulum endoplasmique", isCorrect: false },
      { text: "La formation de vésicules recouvertes de clathrine pour le transport vers les lysosomes ou la membrane plasmique", isCorrect: true },
      { text: "La synthèse des protéines par des ribosomes associés", isCorrect: false },
      { text: "La présence de la N-glycosylation des protéines", isCorrect: false },
      { text: "Une connexion directe avec le réticulum endoplasmique rugueux", isCorrect: false },
    ],
  },
  {
    text: "L'étiquetage des hydrolases lysosomiales par le mannose-6-phosphate est une étape cruciale pour leur adressage au lysosome. Cette phosphorylation se déroule :",
    explanation: "La phosphorylation des hydrolases lysosomiales sur le mannose-6-phosphate se déroule dans les saccules cis de l'appareil de Golgi, par des phospho-transférases.",
    options: [
      { text: "Dans les saccules trans de l'appareil de Golgi", isCorrect: false },
      { text: "Dans le réticulum endoplasmique rugueux", isCorrect: false },
      { text: "Dans les saccules cis de l'appareil de Golgi", isCorrect: true },
      { text: "Dans les endosomes précoces", isCorrect: false },
      { text: "Dans le cytosol avant l'entrée dans l'appareil de Golgi", isCorrect: false },
    ],
  },
  {
    text: "Concernant la N-glycosylation et l'O-glycosylation des protéines, quelle affirmation est CORRECTE ?",
    explanation: "La N-glycosylation débute dans le REG par le transfert d'un précurseur oligosaccharidique sur une asparagine (N). L'O-glycosylation se fait sur la sérine ou la thréonine dans l'appareil de Golgi.",
    options: [
      { text: "La N-glycosylation débute dans l'appareil de Golgi et se termine dans le réticulum endoplasmique", isCorrect: false },
      { text: "La N-glycosylation se fait sur les acides aminés sérine ou thréonine", isCorrect: false },
      { text: "L'O-glycosylation se déroule exclusivement dans le réticulum endoplasmique rugueux", isCorrect: false },
      { text: "La N-glycosylation débute dans le réticulum endoplasmique par le transfert d'un précurseur oligosaccharidique sur une asparagine", isCorrect: true },
      { text: "L'O-glycosylation implique toujours un groupement N-acétyl glucosamine comme premier sucre", isCorrect: false },
    ],
  },
  {
    text: "Les microtubules sont des composants majeurs du cytosquelette. Leur structure est caractérisée par :",
    explanation: "Les microtubules sont des tubes creux de 25 nm de diamètre formés de 13 protofilaments de tubuline disposés en couronne.",
    options: [
      { text: "Un diamètre de 7 nm formé de deux chaînes d'actine entrelacées", isCorrect: false },
      { text: "Un diamètre de 25 nm formé de 13 protofilaments de tubuline disposés en couronne autour d'un cœur creux", isCorrect: true },
      { text: "Un diamètre de 10 nm formé de filaments intermédiaires de vimentine", isCorrect: false },
      { text: "Une polymérisation irréversible une fois formés", isCorrect: false },
      { text: "Une organisation en neuf triplets caractéristique des centrioles", isCorrect: false },
    ],
  },
  {
    text: "Les protéines motrices associées aux microtubules, comme la dynéine et la kinésine, jouent un rôle essentiel dans le transport intracellulaire. Quelle affirmation concernant ces protéines est FAUSSE ?",
    explanation: "La kinésine et la dynéine sont des protéines motrices associées aux microtubules, pas des filaments intermédiaires.",
    options: [
      { text: "La kinésine assure le transport vers l'extrémité \"+\" des microtubules", isCorrect: false },
      { text: "La dynéine assure le transport vers l'extrémité \"−\" des microtubules", isCorrect: false },
      { text: "Le complexe de la dynactine est impliqué dans le transport dépendant de la dynéine", isCorrect: false },
      { text: "La nature de la protéine de fixation contenue dans la membrane de la vésicule détermine sa destination", isCorrect: false },
      { text: "La kinésine et la dynéine sont des protéines du cytosquelette de type filaments intermédiaires", isCorrect: true },
    ],
  },
  {
    text: "Les filaments intermédiaires se distinguent des microfilaments et des microtubules par plusieurs caractéristiques. Laquelle des propositions suivantes est CORRECTE ?",
    explanation: "Les filaments intermédiaires sont les composants les plus stables du cytosquelette ; une fois constitués, ils sont stables et ne se dissocient pas.",
    options: [
      { text: "Ils sont composés de molécules d'actine globulaire", isCorrect: false },
      { text: "Ils sont en constant état de polymérisation et dépolymérisation", isCorrect: false },
      { text: "Une fois constitués, ils sont stables et ne se dissocient pas", isCorrect: true },
      { text: "Leur diamètre est de 25 nm, identique à celui des microtubules", isCorrect: false },
      { text: "Ils sont uniquement présents dans les cellules animales, pas dans les cellules végétales", isCorrect: false },
    ],
  },
  {
    text: "La coloration de Gram est une technique fondamentale en bactériologie. Quelle est la différence structurale qui explique la rétention du violet de gentiane par les bactéries Gram (+) ?",
    explanation: "Les bactéries Gram (+) retiennent le violet de gentiane car leur paroi est épaisse (20-80 nm) avec une large couche de muréine contenant des acides teichoïques.",
    options: [
      { text: "La présence d'une membrane externe contenant des lipopolysaccharides", isCorrect: false },
      { text: "L'épaisseur de la couche de muréine (peptidoglycane) et la présence d'acides teichoïques", isCorrect: true },
      { text: "L'absence de paroi cellulaire chez les bactéries Gram (-)", isCorrect: false },
      { text: "La présence d'une capsule polysaccharidique chez les bactéries Gram (+)", isCorrect: false },
      { text: "La présence de porines dans la membrane externe des bactéries Gram (+)", isCorrect: false },
    ],
  },
  {
    text: "Concernant les virus, quelle affirmation est EXACTE ?",
    explanation: "Les virus contiennent soit de l'ADN, soit de l'ARN comme génome, mais pas les deux simultanément. Le virion est la forme extracellulaire inerte.",
    options: [
      { text: "Les virus sont des organismes vivants unicellulaires dépourvus de métabolisme", isCorrect: false },
      { text: "Le virion est la forme intracellulaire active du virus", isCorrect: false },
      { text: "La capside est formée d'acides nucléiques et l'enveloppe est composée de protéines", isCorrect: false },
      { text: "Les virus peuvent contenir de l'ADN ou de l'ARN comme génome, mais jamais les deux simultanément", isCorrect: true },
      { text: "La taille des virus est toujours supérieure à celle des bactéries", isCorrect: false },
    ],
  },
  {
    text: "Un virus oncogène est un virus capable de transformer une cellule saine en cellule cancéreuse. Parmi les virus suivants, lequel est associé au cancer du col de l'utérus ?",
    explanation: "Le Papillomavirus humain (HPV) est un virus oncogène associé au cancer du col de l'utérus.",
    options: [
      { text: "Virus de l'hépatite B (HBV)", isCorrect: false },
      { text: "Herpès virus", isCorrect: false },
      { text: "Papillomavirus humain (HPV)", isCorrect: true },
      { text: "Virus SV40", isCorrect: false },
      { text: "Virus de l'hépatite C (HCV)", isCorrect: false },
    ],
  },
  {
    text: "La microscopie électronique à transmission nécessite des préparations ultrafines. Pour observer des organites intracellulaires, l'épaisseur des coupes doit être d'environ :",
    explanation: "En microscopie électronique à transmission, les coupes doivent être ultrafines, de 50 à 80 nm.",
    options: [
      { text: "5 à 7 μm", isCorrect: false },
      { text: "50 à 80 nm", isCorrect: true },
      { text: "0,2 μm", isCorrect: false },
      { text: "10 à 20 nm", isCorrect: false },
      { text: "100 à 200 nm", isCorrect: false },
    ],
  },
  {
    text: "Les techniques de coloration négative et d'ombrage métallique sont utilisées en microscopie électronique pour pallier le manque de contraste. Lequel des énoncés suivants décrit correctement la coloration négative ?",
    explanation: "La coloration négative consiste à déposer l'objet sur un support puis à le plonger dans une solution de sel de métal lourd. Le colorant s'accumule autour des particules, créant un effet de halo (négatif).",
    options: [
      { text: "L'objet est exposé à des vapeurs métalliques sous incidence pour créer une ombre", isCorrect: false },
      { text: "L'objet est coloré par des sels de métaux lourds qui se lient spécifiquement aux protéines", isCorrect: false },
      { text: "L'objet est déposé sur un support puis plongé dans une solution de sel de métal lourd qui s'accumule autour des particules, créant un effet de halo", isCorrect: true },
      { text: "L'objet est congelé puis fracturé pour révéler la face interne des membranes", isCorrect: false },
      { text: "L'objet est traité par un fixateur coagulant puis inclus dans de la paraffine", isCorrect: false },
    ],
  },
  {
    text: "Le cytosol présente des caractéristiques physico-chimiques importantes pour la fonction cellulaire. Concernant le cytosol, quelle affirmation est CORRECTE ?",
    explanation: "Le cytosol occupe environ 54 % du volume cellulaire, contient 85 % d'eau, avec un pH neutre.",
    options: [
      { text: "Le pH du cytosol est acide, variant entre 5,5 et 6,0, favorable aux enzymes lysosomiales", isCorrect: false },
      { text: "La viscosité du cytosol est constante et ne varie pas selon l'état physiologique de la cellule", isCorrect: false },
      { text: "Le cytosol occupe environ 54 % du volume cellulaire et contient 85 % d'eau", isCorrect: true },
      { text: "Les mouvements structurés du cytosol se font sans intervention des protéines du cytosquelette", isCorrect: false },
      { text: "Le cytosol est exclusivement un site de dégradation des protéines par les protéasomes", isCorrect: false },
    ],
  },
  {
    text: "L'endocytose des LDL (lipoprotéines de basse densité) est un processus médié par des récepteurs. Chez les patients présentant une mutation du récepteur des LDL entraînant la perte du site de liaison aux adaptines, que se produit-il ?",
    explanation: "La mutation empêche l'internalisation des LDL par endocytose, même si le ligand (LDL) se lie normalement au récepteur, car le récepteur ne peut pas être connecté à la clathrine via les adaptines.",
    options: [
      { text: "Les LDL sont internalisées normalement mais ne peuvent pas être dégradées dans les lysosomes", isCorrect: false },
      { text: "Les LDL se lient au récepteur mais ne peuvent pas être ingérées par endocytose", isCorrect: true },
      { text: "Les LDL ne se lient plus au récepteur et restent dans la circulation sanguine", isCorrect: false },
      { text: "Les récepteurs des LDL sont dégradés prématurément dans l'appareil de Golgi", isCorrect: false },
      { text: "L'endocytose des LDL est augmentée, entraînant une accumulation de cholestérol intracellulaire", isCorrect: false },
    ],
  }
];

async function main() {
  console.log("Starting to insert Cytologie S1 questions...\n");

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
        slug: `cytologie-s1-${Date.now()}`,
        description: 'Cytologie - Semestre 1',
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
