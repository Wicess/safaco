import type { T } from "~/lib/i18n";

/** Answer-first FAQs, shared by each page and the /faq hub. */
export type Faq = { q: T; a: T };

export const GROUP_FAQ: Faq[] = [
  {
    q: { en: "What does SAFA & Co do?", fr: "Que fait SAFA & Co ?" },
    a: {
      en: "SAFA & Co SARL is a Yaoundé group with three divisions: SAFA Construction hires out automatic wall-plastering machines, mast lifts and scaffold platforms and fabricates construction materials; SAFA Apartments rents furnished apartments in Meyo; SAFA Designs makes menswear to measure and runs a MINEFOP-approved sewing school at Carrefour MEEC.",
      fr: "SAFA & Co SARL est un groupe basé à Yaoundé, organisé en trois divisions : SAFA Construction loue des machines à crépir automatiques, des monte-charges et des plateformes d'échafaudage, et fabrique des matériaux de construction ; SAFA Apartments loue des appartements meublés à Meyo ; SAFA Designs confectionne des tenues homme sur mesure et dirige un centre de formation en couture agréé MINEFOP au Carrefour MEEC.",
    },
  },
  {
    q: { en: "Can I book or pay on the website?", fr: "Puis-je réserver ou payer sur le site ?" },
    a: {
      en: "No. The website presents our services. To hire a machine, reserve an apartment or book a fitting, message us on WhatsApp, call, or send the enquiry form — we reply with availability and a quote.",
      fr: "Non. Le site présente nos services. Pour louer une machine, réserver un appartement ou prendre rendez-vous pour une prise de mesures, écrivez-nous sur WhatsApp, appelez-nous ou envoyez le formulaire : nous répondons avec les disponibilités et un devis.",
    },
  },
  {
    q: { en: "Are your prices published?", fr: "Vos tarifs sont-ils publiés ?" },
    a: {
      en: "Rates depend on the job — the surface and duration for machines, the length of stay for apartments, the garment and fabric for tailoring. Tell us what you need and we send a clear quote.",
      fr: "Les tarifs dépendent de chaque demande : surface et durée pour les machines, durée du séjour pour les appartements, modèle et tissu pour la couture. Dites-nous ce dont vous avez besoin et nous vous envoyons un devis clair.",
    },
  },
  {
    q: { en: "Where are you located?", fr: "Où êtes-vous situés ?" },
    a: {
      en: "All three divisions are in Yaoundé: SAFA Apartments in Meyo (Yaoundé IV) and SAFA Designs at Carrefour MEEC (Yaoundé VI). SAFA Construction delivers machines to sites across Yaoundé and its surroundings.",
      fr: "Nos trois divisions sont à Yaoundé : SAFA Apartments à Meyo (Yaoundé IV) et SAFA Designs au Carrefour MEEC (Yaoundé VI). SAFA Construction livre ses machines sur les chantiers de Yaoundé et de ses environs.",
    },
  },
];

export const CONSTRUCTION_FAQ: Faq[] = [
  {
    q: { en: "What equipment does SAFA Construction hire out?", fr: "Quel matériel SAFA Construction met-il en location ?" },
    a: {
      en: "Automatic wall-plastering machines, render spray machines, dual-mast site lifts, scaffold platforms, mast sections and mobile lift bases — delivered, assembled and collected by our own team.",
      fr: "Des machines à crépir automatiques, des machines à projeter l'enduit, des monte-charges bi-mâts, des plateformes d'échafaudage, des éléments de mât et des bases mobiles de levage — livrés, montés et repris par notre propre équipe.",
    },
  },
  {
    q: { en: "Do you deliver outside Yaoundé?", fr: "Livrez-vous en dehors de Yaoundé ?" },
    a: {
      en: "We serve construction sites in Yaoundé and its surroundings. For sites further away, send us the location and we'll confirm what's possible.",
      fr: "Nous intervenons sur les chantiers de Yaoundé et de ses environs. Pour un chantier plus éloigné, envoyez-nous la localisation et nous confirmerons ce qui est possible.",
    },
  },
  {
    q: { en: "How long can I hire a machine for?", fr: "Pour combien de temps puis-je louer une machine ?" },
    a: {
      en: "Hire periods are flexible and built around your project schedule — from a short job to the full finishing phase of a building.",
      fr: "Les durées sont flexibles et suivent le calendrier de votre projet — d'une courte intervention à toute la phase de finition d'un bâtiment.",
    },
  },
  {
    q: { en: "How much does it cost?", fr: "Combien cela coûte-t-il ?" },
    a: {
      en: "Rates depend on the machine, the surface or height, the hire period and the site location. Send us those details and we reply with a quote.",
      fr: "Le tarif dépend de la machine, de la surface ou de la hauteur, de la durée et de la localisation du chantier. Envoyez-nous ces éléments et nous vous répondons avec un devis.",
    },
  },
];

export const PLASTERING_FAQ: Faq[] = [
  {
    q: { en: "What is an automatic plastering machine?", fr: "Qu'est-ce qu'une machine à crépir automatique ?" },
    a: {
      en: "It is a rendering machine mounted on a vertical mast. Mortar is loaded into its hopper, and the machine travels up and down the mast, spreading and pressing the plaster onto the wall in one even pass — a job normally done by hand with a trowel.",
      fr: "C'est une machine d'enduit montée sur un mât vertical. Le mortier est versé dans sa trémie, puis la machine monte et descend le long du mât en étalant et en pressant l'enduit sur le mur en une passe régulière — un travail habituellement fait à la main, à la truelle.",
    },
  },
  {
    q: { en: "Is machine plastering faster than plastering by hand?", fr: "Le crépissage à la machine est-il plus rapide qu'à la main ?" },
    a: {
      en: "Yes. On a clear, straight wall a machine covers in a day what a team of masons covers in several, and the thickness stays the same from top to bottom. The exact gain depends on the wall, the render and site access — we estimate it during the site visit.",
      fr: "Oui. Sur un mur droit et dégagé, une machine couvre en une journée ce qu'une équipe de maçons couvre en plusieurs, avec la même épaisseur de haut en bas. Le gain exact dépend du support, de l'enduit et de l'accès ; nous l'estimons lors de la visite de chantier.",
    },
  },
  {
    q: { en: "Is SAFA the first company in Cameroon to hire out these machines?", fr: "SAFA est-elle la première entreprise au Cameroun à louer ces machines ?" },
    a: {
      en: "SAFA Construction is among the first companies in Cameroon to offer automatic wall-plastering machines for hire.",
      fr: "SAFA Construction fait partie des premières entreprises au Cameroun à proposer des machines à crépir automatiques en location.",
    },
  },
  // CLIENT_TODO: confirm operator policy (training your crew / optional SAFA operator).
  {
    q: { en: "Who operates the machine?", fr: "Qui fait fonctionner la machine ?" },
    a: {
      en: "Our crew delivers, assembles and checks the machine on site and shows your team how to run it safely. Ask us if you need an operator for the duration of the hire.",
      fr: "Notre équipe livre, monte et vérifie la machine sur place et montre à vos ouvriers comment l'utiliser en sécurité. Demandez-nous si vous souhaitez un opérateur pendant toute la location.",
    },
  },
  {
    q: { en: "What do you need to give me a quote?", fr: "De quoi avez-vous besoin pour établir un devis ?" },
    a: {
      en: "The site location, the approximate surface in m², wall height, whether it's interior or exterior work, and your dates. Photos of the site on WhatsApp help us answer faster.",
      fr: "La localisation du chantier, la surface approximative en m², la hauteur des murs, s'il s'agit d'intérieur ou d'extérieur, et vos dates. Des photos du chantier sur WhatsApp nous aident à répondre plus vite.",
    },
  },
];

export const SCAFFOLD_FAQ: Faq[] = [
  {
    q: { en: "What is a mast-climbing platform?", fr: "Qu'est-ce qu'une plateforme sur mât ?" },
    a: {
      en: "A working platform that travels up and down one or two vertical masts fixed against the building. It carries workers and materials to the exact height of the job, and can be moved along the façade as work progresses.",
      fr: "Une plateforme de travail qui monte et descend le long d'un ou deux mâts verticaux fixés contre le bâtiment. Elle amène ouvriers et matériaux à la hauteur exacte du travail et se déplace le long de la façade au fil du chantier.",
    },
  },
  {
    q: { en: "Mast lift or traditional scaffolding — which do I need?", fr: "Monte-charge ou échafaudage classique : que choisir ?" },
    a: {
      en: "A mast lift suits façade work that moves up the building — rendering, finishing, installing — and lifts materials as well as people. A scaffold platform gives a fixed working deck for longer work at one level. Tell us about the job and we'll recommend the setup.",
      fr: "Le monte-charge convient aux travaux de façade qui progressent en hauteur — crépissage, finitions, pose — et monte aussi les matériaux. La plateforme d'échafaudage offre un plancher fixe pour un travail plus long à un même niveau. Décrivez-nous le chantier et nous vous conseillons.",
    },
  },
  {
    q: { en: "Who assembles the equipment?", fr: "Qui monte le matériel ?" },
    a: {
      en: "SAFA's own crew delivers the masts and platform, assembles them to the height you need, checks the installation, and dismantles and collects everything at the end of the hire.",
      fr: "L'équipe SAFA livre les mâts et la plateforme, les monte à la hauteur voulue, contrôle l'installation, puis démonte et reprend l'ensemble en fin de location.",
    },
  },
];

export const FABRICATION_FAQ: Faq[] = [
  {
    q: { en: "What does mechanised fabrication mean?", fr: "Que signifie « fabrication mécanisée » ?" },
    a: {
      en: "The materials are produced with machines rather than moulded by hand, so each piece comes out with the same dimensions — which makes walls faster and straighter to build.",
      fr: "Les matériaux sont produits avec des machines plutôt que moulés à la main : chaque pièce sort avec les mêmes dimensions, ce qui rend les murs plus rapides et plus droits à monter.",
    },
  },
  {
    q: { en: "How do I order?", fr: "Comment commander ?" },
    a: {
      en: "Send us the product, the quantity, your site location and when you need it. We reply with availability and a quote.",
      fr: "Envoyez-nous le produit, la quantité, la localisation du chantier et la date souhaitée. Nous répondons avec la disponibilité et un devis.",
    },
  },
];

export const APARTMENTS_FAQ: Faq[] = [
  {
    q: { en: "Where are SAFA Apartments?", fr: "Où se trouvent les SAFA Apartments ?" },
    a: {
      en: "In Meyo, Yaoundé IV. We send the exact location and directions on WhatsApp when you book.",
      fr: "À Meyo, Yaoundé IV. Nous envoyons la localisation exacte et l'itinéraire sur WhatsApp lors de la réservation.",
    },
  },
  {
    q: { en: "How do I book an apartment?", fr: "Comment réserver un appartement ?" },
    a: {
      en: "Message us on WhatsApp or call with your dates and the number of guests. We confirm availability, the rate for your stay and how to pay. There is no online booking.",
      fr: "Écrivez-nous sur WhatsApp ou appelez avec vos dates et le nombre de personnes. Nous confirmons la disponibilité, le tarif de votre séjour et le mode de paiement. Il n'y a pas de réservation en ligne.",
    },
  },
  {
    q: { en: "Can I stay for several weeks or months?", fr: "Puis-je séjourner plusieurs semaines ou mois ?" },
    a: {
      en: "Yes — the apartments suit short stays as well as extended stays for work, a family visit or a project in Yaoundé. Ask us about longer stays.",
      fr: "Oui — les appartements conviennent aux courts séjours comme aux séjours prolongés, pour le travail, une visite familiale ou un projet à Yaoundé. Renseignez-vous pour les longs séjours.",
    },
  },
  {
    q: { en: "What are the rates?", fr: "Quels sont les tarifs ?" },
    a: {
      en: "Rates depend on the apartment, the dates and the length of stay. Send us your dates and we reply with the rate.",
      fr: "Le tarif dépend de l'appartement, des dates et de la durée du séjour. Envoyez-nous vos dates et nous vous répondons avec le tarif.",
    },
  },
];

// CLIENT_TODO: confirm "bring your own fabric" and appointment-only policy.
export const DESIGNS_FAQ: Faq[] = [
  {
    q: { en: "Where is SAFA Designs?", fr: "Où se trouve SAFA Designs ?" },
    a: {
      en: "At Carrefour MEEC, Yaoundé VI. Visits and fittings are by appointment — message us on WhatsApp to book a time.",
      fr: "Au Carrefour MEEC, Yaoundé VI. Les visites et essayages se font sur rendez-vous — écrivez-nous sur WhatsApp pour réserver un créneau.",
    },
  },
  {
    q: { en: "Can I bring my own fabric?", fr: "Puis-je apporter mon propre tissu ?" },
    a: {
      en: "Yes. Bring your fabric to the measuring appointment and we'll advise on the cut and the quantity needed.",
      fr: "Oui. Apportez votre tissu au rendez-vous de prise de mesures et nous vous conseillons sur la coupe et le métrage nécessaire.",
    },
  },
  {
    q: { en: "How long does a made-to-measure garment take?", fr: "Combien de temps faut-il pour une tenue sur mesure ?" },
    a: {
      en: "It depends on the garment and the season. We give you a delivery date when we take your measurements — tell us early if you have an event date.",
      fr: "Cela dépend de la pièce et de la période. Nous vous donnons une date de livraison à la prise de mesures — prévenez-nous tôt si vous avez une date d'événement.",
    },
  },
];

export const TRAINING_FAQ: Faq[] = [
  {
    q: { en: "Is the SAFA Designs training centre approved?", fr: "Le centre de formation SAFA Designs est-il agréé ?" },
    a: {
      en: "Yes. SAFA Designs is a training centre approved (agréé) by MINEFOP, Cameroon's Ministry of Employment and Vocational Training.",
      fr: "Oui. SAFA Designs est un centre de formation agréé par le MINEFOP, le Ministère de l'Emploi et de la Formation Professionnelle.",
    },
  },
  {
    q: { en: "Do I need experience to start?", fr: "Faut-il de l'expérience pour commencer ?" },
    a: {
      en: "No prior experience is required to start learning. Tell us your background and we'll advise on the right programme.",
      fr: "Aucune expérience n'est nécessaire pour commencer. Parlez-nous de votre parcours et nous vous orienterons vers le bon programme.",
    },
  },
  {
    q: { en: "How much is the training?", fr: "Combien coûte la formation ?" },
    a: {
      en: "Fees depend on the programme and its length. Contact us and we'll send the details for the next intake.",
      fr: "Les frais dépendent du programme et de sa durée. Contactez-nous et nous vous enverrons les détails de la prochaine rentrée.",
    },
  },
];
