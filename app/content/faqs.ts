import type { T } from "~/lib/i18n";

/** Answer-first FAQs, shared by each page and the /faq hub. */
export type Faq = { q: T; a: T };

export const GROUP_FAQ: Faq[] = [
  {
    q: { en: "What does SAFA & Co do?", fr: "Quelles sont les activités de SAFA & Co ?" },
    a: {
      en: "SAFA & Co SARL is a Yaoundé group with three divisions: SAFA Construction hires out automatic wall-plastering machines, mast lifts and scaffold platforms and fabricates construction materials; SAFA Apartments rents furnished apartments in Meyo; SAFA Designs makes menswear to measure and runs a MINEFOP-approved sewing school at Carrefour MEEC.",
      fr: "SAFA & Co SARL est un groupe basé à Yaoundé qui réunit trois maisons : SAFA Construction loue des machines à crépir automatiques, des monte-charges et des plateformes d’échafaudage, et fabrique des matériaux de construction ; SAFA Apartments propose des appartements meublés à Meyo ; SAFA Designs réalise la couture homme sur mesure et dirige, au Carrefour MEEC, un centre de formation en couture agréé par le MINEFOP.",
    },
  },
  {
    q: { en: "Can I book or pay on the website?", fr: "Peut-on réserver ou payer directement sur le site ?" },
    a: {
      en: "No. The website presents our services. To hire a machine, reserve an apartment or book a fitting, message us on WhatsApp, call, or send the enquiry form — we reply with availability and a quote.",
      fr: "Non, le site sert à présenter nos services. Pour louer une machine, réserver un appartement ou prendre rendez-vous pour un essayage, écrivez-nous sur WhatsApp, appelez-nous ou envoyez le formulaire de demande : nous vous répondons avec les disponibilités et un devis.",
    },
  },
  {
    q: { en: "Are your prices published?", fr: "Vos tarifs sont-ils affichés sur le site ?" },
    a: {
      en: "Rates depend on the job — the surface and duration for machines, the length of stay for apartments, the garment and fabric for tailoring. Tell us what you need and we send a clear quote.",
      fr: "Non, car nos tarifs dépendent de chaque demande : la surface et la durée pour les machines, la durée du séjour pour les appartements, le modèle et le tissu pour la couture. Dites-nous ce dont vous avez besoin et nous vous envoyons un devis clair.",
    },
  },
  {
    q: { en: "Where are you located?", fr: "Où se trouve SAFA & Co ?" },
    a: {
      en: "SAFA & Co is based in Yaoundé, Cameroon. SAFA Apartments is in Meyo (Yaoundé IV), SAFA Designs is at Carrefour MEEC (Yaoundé VI), and SAFA Construction hires out machines for building sites in Yaoundé. The atelier also makes garments for clients in Douala, across Cameroon and abroad.",
      fr: "Le groupe SAFA & Co est basé à Yaoundé, au Cameroun. SAFA Apartments se trouve à Meyo (Yaoundé IV) et SAFA Designs au Carrefour MEEC (Yaoundé VI) ; SAFA Construction loue ses machines pour les chantiers de Yaoundé. L’atelier SAFA Designs confectionne aussi des tenues pour des clients à Douala, partout au Cameroun et à l’étranger.",
    },
  },
];

export const CONSTRUCTION_FAQ: Faq[] = [
  {
    q: { en: "What equipment does SAFA Construction hire out?", fr: "Quel matériel peut-on louer chez SAFA Construction ?" },
    a: {
      en: "Automatic wall-plastering machines, render spray machines, dual-mast site lifts, scaffold platforms, mast sections and mobile lift bases — delivered, assembled and collected by our own team.",
      fr: "Des machines à crépir automatiques, des pompes à mortier, des monte-charges de chantier bi-mâts, des plateformes d’échafaudage, des éléments de mât et des bases mobiles de levage. Notre propre équipe en assure la livraison, le montage et la reprise.",
    },
  },
  {
    q: { en: "Do you deliver outside Yaoundé?", fr: "Livrez-vous vos machines en dehors de Yaoundé ?" },
    a: {
      en: "Not at the moment. SAFA Construction currently hires out its machines for building sites in Yaoundé only. If your site is elsewhere, in Douala for example, send us the location and we'll let you know.",
      fr: "Pas pour le moment : SAFA Construction loue ses machines uniquement pour les chantiers situés à Yaoundé. Si votre chantier se trouve ailleurs, à Douala par exemple, envoyez-nous sa localisation et nous vous tiendrons au courant.",
    },
  },
  {
    q: { en: "How long can I hire a machine for?", fr: "Pour combien de temps peut-on louer une machine ?" },
    a: {
      en: "Hire periods are flexible and built around your project schedule — from a short job to the full finishing phase of a building.",
      fr: "La durée de location est souple et s’adapte au calendrier de votre chantier, d’une intervention courte à toute la phase de finition d’un bâtiment.",
    },
  },
  {
    q: { en: "How much does it cost?", fr: "Combien coûte la location d’une machine ?" },
    a: {
      en: "Rates depend on the machine, the surface or height, the hire period and the site location. Send us those details and we reply with a quote.",
      fr: "Le prix dépend de la machine, de la surface ou de la hauteur à traiter, de la durée de location et de l’emplacement du chantier. Envoyez-nous ces informations et nous vous répondons avec un devis.",
    },
  },
];

export const PLASTERING_FAQ: Faq[] = [
  {
    q: { en: "What is an automatic plastering machine?", fr: "Qu’est-ce qu’une machine à crépir automatique ?" },
    a: {
      en: "It is a rendering machine mounted on a vertical mast. Mortar is loaded into its hopper, and the machine travels up and down the mast, spreading and pressing the plaster onto the wall in one even pass — a job normally done by hand with a trowel.",
      fr: "La machine à crépir automatique est montée sur un mât vertical. On verse le mortier dans sa trémie, puis la machine monte et descend le long du mât en étalant et en serrant l’enduit sur le mur, en une seule passe régulière — un travail qui se fait normalement à la main, à la truelle.",
    },
  },
  {
    q: { en: "Is machine plastering faster than plastering by hand?", fr: "Crépir à la machine, est-ce plus rapide qu’à la main ?" },
    a: {
      en: "Yes. On a clear, straight wall a machine covers in a day what a team of masons covers in several, and the thickness stays the same from top to bottom. The exact gain depends on the wall, the render and site access — we estimate it during the site visit.",
      fr: "Oui. Sur un mur droit et dégagé, la machine fait en une journée ce qu’une équipe de maçons fait en plusieurs, avec la même épaisseur de haut en bas. Le gain réel dépend du mur, de l’enduit et de l’accès au chantier ; nous l’estimons lors de la visite de chantier.",
    },
  },
  {
    q: { en: "Is SAFA the first company in Cameroon to hire out these machines?", fr: "SAFA est-elle la première entreprise au Cameroun à louer des machines à crépir ?" },
    a: {
      en: "SAFA Construction is among the first companies in Cameroon to offer automatic wall-plastering machines for hire.",
      fr: "SAFA Construction fait partie des premières entreprises au Cameroun à proposer des machines à crépir automatiques en location.",
    },
  },
  // CLIENT_TODO: confirm operator policy (training your crew / optional SAFA operator).
  {
    q: { en: "Who operates the machine?", fr: "Qui fait fonctionner la machine sur le chantier ?" },
    a: {
      en: "Our crew delivers, assembles and checks the machine on site and shows your team how to run it safely. Ask us if you need an operator for the duration of the hire.",
      fr: "Vos ouvriers, après une prise en main assurée par notre équipe. Nous livrons, montons et vérifions la machine sur le chantier, puis nous montrons à votre équipe comment l’utiliser en toute sécurité. Si vous souhaitez un opérateur pendant toute la durée de la location, demandez-le-nous.",
    },
  },
  {
    q: { en: "What do you need to give me a quote?", fr: "Quelles informations faut-il pour obtenir un devis ?" },
    a: {
      en: "The site location, the approximate surface in m², wall height, whether it's interior or exterior work, and your dates. Photos of the site on WhatsApp help us answer faster.",
      fr: "Il nous faut la localisation du chantier, la surface approximative en m², la hauteur des murs, la nature des travaux (intérieur ou extérieur) et vos dates. Des photos du chantier envoyées sur WhatsApp nous permettent de répondre plus vite.",
    },
  },
];

export const SCAFFOLD_FAQ: Faq[] = [
  {
    q: { en: "What is a mast-climbing platform?", fr: "Qu’est-ce qu’une plateforme élévatrice sur mât ?" },
    a: {
      en: "A working platform that travels up and down one or two vertical masts fixed against the building. It carries workers and materials to the exact height of the job, and can be moved along the façade as work progresses.",
      fr: "Une plateforme sur mât est une plateforme de travail qui monte et descend le long d’un ou deux mâts verticaux fixés contre le bâtiment. Elle amène ouvriers et matériaux à la hauteur exacte du travail et se déplace le long de la façade à mesure que le chantier avance.",
    },
  },
  {
    q: { en: "Mast lift or traditional scaffolding — which do I need?", fr: "Monte-charge ou échafaudage classique : lequel choisir pour mon chantier ?" },
    a: {
      en: "A mast lift suits façade work that moves up the building — rendering, finishing, installing — and lifts materials as well as people. A scaffold platform gives a fixed working deck for longer work at one level. Tell us about the job and we'll recommend the setup.",
      fr: "Tout dépend du chantier. Le monte-charge convient aux travaux de façade qui progressent en hauteur — crépissage, finitions, pose — et monte les matériaux comme les ouvriers. La plateforme d’échafaudage offre un plancher de travail fixe pour un travail plus long à un même niveau. Décrivez-nous votre chantier et nous vous conseillerons l’installation adaptée.",
    },
  },
  {
    q: { en: "Who assembles the equipment?", fr: "Qui se charge du montage du matériel ?" },
    a: {
      en: "SAFA's own crew delivers the masts and platform, assembles them to the height you need, checks the installation, and dismantles and collects everything at the end of the hire.",
      fr: "L’équipe de SAFA s’en charge : elle livre les mâts et la plateforme, les monte à la hauteur voulue, contrôle l’installation, puis démonte et reprend l’ensemble en fin de location.",
    },
  },
];

export const FABRICATION_FAQ: Faq[] = [
  {
    q: { en: "What does mechanised fabrication mean?", fr: "Que veut dire « fabrication mécanisée » ?" },
    a: {
      en: "The materials are produced with machines rather than moulded by hand, so each piece comes out with the same dimensions — which makes walls faster and straighter to build.",
      fr: "Cela veut dire que les matériaux sont produits à la machine et non moulés à la main : chaque pièce sort avec les mêmes dimensions, ce qui permet de monter des murs plus vite et plus droits.",
    },
  },
  {
    q: { en: "How do I order?", fr: "Comment passer commande ?" },
    a: {
      en: "Send us the product, the quantity, your site location and when you need it. We reply with availability and a quote.",
      fr: "Envoyez-nous le produit, la quantité, la localisation du chantier et la date souhaitée. Nous vous répondons avec la disponibilité et un devis.",
    },
  },
];

export const APARTMENTS_FAQ: Faq[] = [
  {
    q: { en: "Where are SAFA Apartments?", fr: "Où sont situés les SAFA Apartments à Yaoundé ?" },
    a: {
      en: "In Meyo, Yaoundé IV. We send the exact location and directions on WhatsApp when you book.",
      fr: "À Meyo, dans l’arrondissement de Yaoundé IV. Nous vous envoyons la localisation exacte et l’itinéraire sur WhatsApp au moment de la réservation.",
    },
  },
  {
    q: { en: "How do I book an apartment?", fr: "Comment réserver un appartement meublé ?" },
    a: {
      en: "Message us on WhatsApp or call with your dates and the number of guests. We confirm availability, the rate for your stay and how to pay. There is no online booking.",
      fr: "Par WhatsApp ou par téléphone : donnez-nous vos dates et le nombre de personnes. Nous confirmons la disponibilité, le tarif de votre séjour et le mode de paiement. La réservation ne se fait pas en ligne.",
    },
  },
  {
    q: { en: "I'm travelling from Douala or from abroad. Can I book before I arrive?", fr: "J’arrive de Douala ou de l’étranger : puis-je réserver avant mon arrivée ?" },
    a: {
      en: "Yes. Send your arrival and departure dates and the number of guests on WhatsApp. We confirm availability and the rate for your stay, then send the exact location in Meyo, Yaoundé IV, and agree your arrival time.",
      fr: "Oui. Envoyez-nous sur WhatsApp vos dates d’arrivée et de départ et le nombre de personnes. Nous confirmons la disponibilité et le tarif du séjour, puis nous vous envoyons la localisation exacte à Meyo (Yaoundé IV) et convenons avec vous de l’heure d’arrivée.",
    },
  },
  {
    q: { en: "Can I stay for several weeks or months?", fr: "Peut-on louer pour plusieurs semaines ou plusieurs mois ?" },
    a: {
      en: "Yes — the apartments suit short stays as well as extended stays for work, a family visit or a project in Yaoundé. Ask us about longer stays.",
      fr: "Oui. Les appartements conviennent aussi bien aux courts séjours qu’aux séjours prolongés — pour le travail, une visite en famille ou un projet à Yaoundé. Renseignez-vous auprès de nous pour les longs séjours.",
    },
  },
  {
    q: { en: "What are the rates?", fr: "Quels sont les tarifs des appartements ?" },
    a: {
      en: "Rates depend on the apartment, the dates and the length of stay. Send us your dates and we reply with the rate.",
      fr: "Le tarif dépend de l’appartement, des dates et de la durée du séjour. Envoyez-nous vos dates et nous vous indiquons le tarif.",
    },
  },
];

// CLIENT_TODO: confirm "bring your own fabric" and appointment-only policy.
export const DESIGNS_FAQ: Faq[] = [
  {
    q: { en: "Where is SAFA Designs?", fr: "Où se trouve l’atelier SAFA Designs ?" },
    a: {
      en: "At Carrefour MEEC, Yaoundé VI. Visits and fittings are by appointment — message us on WhatsApp to book a time.",
      fr: "Au Carrefour MEEC, à Yaoundé VI. Les visites et les essayages se font sur rendez-vous : écrivez-nous sur WhatsApp pour fixer un créneau.",
    },
  },
  {
    q: { en: "Do you make garments for clients outside Yaoundé, in Douala or abroad?", fr: "Travaillez-vous pour des clients hors de Yaoundé, à Douala ou à l’étranger ?" },
    a: {
      en: "Yes. The SAFA Designs atelier in Yaoundé sews for clients across Cameroon, including Douala, and abroad, and delivers the finished garment. Message us on WhatsApp to arrange your measurements and delivery.",
      fr: "Oui. L’atelier SAFA Designs, à Yaoundé, confectionne des tenues pour des clients partout au Cameroun, dont Douala, et à l’étranger, et livre la tenue terminée. Écrivez-nous sur WhatsApp pour organiser la prise de mesures et la livraison.",
    },
  },
  {
    q: { en: "Can I bring my own fabric?", fr: "Puis-je venir avec mon propre tissu ?" },
    a: {
      en: "Yes. Bring your fabric to the measuring appointment and we'll advise on the cut and the quantity needed.",
      fr: "Oui. Apportez votre tissu au rendez-vous de prise de mesures : nous vous conseillerons sur la coupe et le métrage nécessaire.",
    },
  },
  {
    q: { en: "How long does a made-to-measure garment take?", fr: "Quel est le délai pour une tenue sur mesure ?" },
    a: {
      en: "It depends on the garment and the season. We give you a delivery date when we take your measurements — tell us early if you have an event date.",
      fr: "Le délai dépend de la tenue et de la période de l’année. Nous vous donnons une date de livraison lors de la prise de mesures ; si vous avez un événement, prévenez-nous le plus tôt possible.",
    },
  },
];

export const TRAINING_FAQ: Faq[] = [
  {
    q: { en: "Is the SAFA Designs training centre approved?", fr: "Le centre de formation SAFA Designs est-il agréé ?" },
    a: {
      en: "Yes. SAFA Designs is a training centre approved (agréé) by MINEFOP, Cameroon's Ministry of Employment and Vocational Training.",
      fr: "Oui. SAFA Designs est un centre de formation agréé par le MINEFOP (Ministère de l’Emploi et de la Formation professionnelle).",
    },
  },
  {
    q: { en: "Do I need experience to start?", fr: "Faut-il savoir coudre pour s’inscrire ?" },
    a: {
      en: "No prior experience is required to start learning. Tell us your background and we'll advise on the right programme.",
      fr: "Non, aucune expérience n’est demandée pour commencer. Parlez-nous de votre parcours et nous vous orienterons vers la formation qui vous convient.",
    },
  },
  {
    q: { en: "How much is the training?", fr: "Combien coûte la formation en couture ?" },
    a: {
      en: "Fees depend on the programme and its length. Contact us and we'll send the details for the next intake.",
      fr: "Les frais dépendent de la formation choisie et de sa durée. Contactez-nous et nous vous enverrons les informations sur la prochaine rentrée.",
    },
  },
];
