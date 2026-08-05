export type EvidenceLevel = "KNOWN PRINCIPLE" | "MARKET PRECEDENT" | "DESIGN TARGET";

export type Source = {
  id: string;
  organisation: string;
  title: string;
  year: string;
  url: string;
  note: string;
};

export type Product = {
  id: string;
  order: string;
  brand: "LOTTO" | "ONE8";
  name: string;
  family: string;
  line: string;
  thesis: string;
  note: string;
  accent: string;
  surface: string;
  palette: [string, string, string];
  art: "court" | "weather" | "threshold" | "cricket" | "train" | "after";
  purposes: Array<{
    code: string;
    title: string;
    copy: string;
  }>;
  systems: Array<{
    name: string;
    level: EvidenceLevel;
    copy: string;
    sources: string[];
  }>;
};

export const sources: Source[] = [
  {
    id: "imd-2025",
    organisation: "India Meteorological Department",
    title: "Salient features of the Southwest Monsoon 2025",
    year: "2025",
    url: "https://internal.imd.gov.in/press_release/20250930_pr_4343.pdf",
    note: "India received 108% of long-period-average rainfall during the June–September 2025 southwest monsoon. This supports designing a real wet-season product; it does not validate any shoe claim.",
  },
  {
    id: "iso-vapour",
    organisation: "ISO",
    title: "ISO 17699 — Water-vapour permeability and absorption",
    year: "2003 / current listing 2024",
    url: "https://www.iso.org/standard/31470.html",
    note: "A recognised way to assess upper and lining moisture behaviour. Our product needs measured results before publishing a breathability number.",
  },
  {
    id: "iso-abrasion",
    organisation: "ISO",
    title: "ISO 20871 — Outsole abrasion resistance",
    year: "2018",
    url: "https://www.iso.org/standard/63230.html",
    note: "Relevant to cement-court and outdoor outsole durability. The concept specifies the test; no result is claimed yet.",
  },
  {
    id: "iso-flex",
    organisation: "ISO",
    title: "ISO 17707 — Outsole flex resistance",
    year: "2005",
    url: "https://www.iso.org/standard/31478.html",
    note: "Assesses cut growth under repeated flexing. Relevant to the everyday, training and returnable-sole systems.",
  },
  {
    id: "iso-slip",
    organisation: "ISO",
    title: "ISO 24267 — Coefficient of friction for footwear and sole components",
    year: "2020",
    url: "https://www.iso.org/standard/78252.html",
    note: "A laboratory test method for friction under walking-step conditions. Sport-specific grip still needs its own protocol.",
  },
  {
    id: "gore-invisible",
    organisation: "GORE‑TEX",
    title: "Invisible Fit footwear technology",
    year: "Available before 2025",
    url: "https://www.gore-tex.com/technology/gore-tex-products/invisible-fit-footwear",
    note: "A market precedent for directly bonded waterproof laminates with reduced water pickup and quicker dry-out. It is a benchmark, not a claimed partnership or component.",
  },
  {
    id: "gore-surround",
    organisation: "GORE‑TEX",
    title: "SURROUND footwear technology",
    year: "Available before 2025",
    url: "https://www.gore-tex.com/en_uk/technology/gore-tex-products/surround",
    note: "A market precedent for moving heat and moisture through channels around and beneath the foot while retaining a waterproof construction.",
  },
  {
    id: "court-floor",
    organisation: "PLOS ONE / PMC",
    title: "Influence of sports flooring and shoes on impact forces and performance during jump tasks",
    year: "2017",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5636165/",
    note: "Shows that both flooring and footwear influence impact-force variables and performance in jump tasks. It does not justify an injury-prevention promise.",
  },
  {
    id: "badminton-heel",
    organisation: "Journal of Sports Sciences / PMC",
    title: "Shoe heel design, ground reaction forces and knee moments in badminton lunges",
    year: "2017",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5363935/",
    note: "Supports treating heel geometry and cushioning as real design variables for lunge-dominant court movement.",
  },
  {
    id: "basket-stiffness",
    organisation: "Sports Medicine / PMC",
    title: "Modifying basketball-footwear midsole stiffness affects foot and ankle biomechanics",
    year: "2019",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6816293/",
    note: "Supports stiffness as an engineering variable. The correct value for this concept must be found by prototyping and player testing.",
  },
  {
    id: "flyease",
    organisation: "Nike",
    title: "Go FlyEase hands-free shoe",
    year: "2021",
    url: "https://about.nike.com/en/newsroom/releases/nike-go-flyease-hands-free-shoe",
    note: "A market precedent for a bi-stable hinge that holds a shoe open and closed. THRESHOLD uses the behaviour as a brief, not the mechanism or protected design.",
  },
  {
    id: "kizik",
    organisation: "Kizik / HandsFree Labs",
    title: "Hands-free structured-heel footwear",
    year: "Available before 2025",
    url: "https://kizik.com/pages/about-us",
    note: "A second precedent proving that repeatable hands-free entry can be a footwear category. A new mechanism still requires freedom-to-operate review.",
  },
  {
    id: "vibram-repair",
    organisation: "Vibram",
    title: "Repair If You Care / outsole repair",
    year: "Available before 2025",
    url: "https://us.vibram.com/on/demandware.store/Sites-VibramUS-Site/en/SoleFactor-Show",
    note: "Evidence that organised outsole repair and resoling can operate as a branded service. Our proposal returns the shoe to the maker rather than relying on a nostalgia-led cobbler story.",
  },
  {
    id: "wear-guidance",
    organisation: "ASICS",
    title: "How to know when to replace running shoes",
    year: "2024",
    url: "https://www.asics.com/us/en-us/blog/how-to-know-it-s-time-to-replace-my-running-shoes/",
    note: "A market example of wear guidance. It reinforces the need to make end-of-service legible; it does not establish one universal mileage for every shoe.",
  },
];

export const products: Product[] = [
  {
    id: "six-ten",
    order: "01",
    brand: "LOTTO",
    name: "6:10",
    family: "CEMENT COURT",
    line: "The court is already open.",
    thesis: "One low court shoe for the three games that share the same rectangle before the city wakes up.",
    note: "Named for the time, not the athlete. Built around an outdoor court at 6:10 a.m.",
    accent: "#ff5429",
    surface: "SUN-WARMED CEMENT",
    palette: ["#d86f52", "#f0b777", "#6f514d"],
    art: "court",
    purposes: [
      { code: "A", title: "BASKETBALL", copy: "Cushioning and outsole rubber specified for repeated jumps and abrasive outdoor cement—not an indoor-only foam package." },
      { code: "B", title: "VOLLEYBALL + BADMINTON", copy: "A broad lateral outrigger, tuned torsional bridge and heel geometry for shuffles, plants and lunges." },
      { code: "C", title: "THE WALK HOME", copy: "Low, visually quiet and flexible enough to leave the court on foot. The third use is ordinary on purpose." },
    ],
    systems: [
      { name: "CEMENT COMPOUND", level: "DESIGN TARGET", copy: "High-abrasion rubber with broad channels that release grit rather than holding it.", sources: ["iso-abrasion"] },
      { name: "LATERAL FRAME", level: "KNOWN PRINCIPLE", copy: "Midsole stiffness, heel geometry and floor construction are meaningful biomechanical variables; their final values require player trials.", sources: ["court-floor", "badminton-heel", "basket-stiffness"] },
      { name: "ORANGE WEAR LINE", level: "DESIGN TARGET", copy: "A contrasting layer appears only as designated tread zones approach their service limit.", sources: ["wear-guidance", "iso-abrasion"] },
    ],
  },
  {
    id: "june",
    order: "02",
    brand: "LOTTO",
    name: "JUNE",
    family: "WEATHER SYSTEM",
    line: "Dry. Shield. Drain.",
    thesis: "A hot-weather shoe with a dockable rain layer—because waterproof and breathable are not the same brief.",
    note: "The shell is a concept. Waterproof is not printed until the complete shoe passes a defined test.",
    accent: "#ff5429",
    surface: "MONSOON CONCRETE",
    palette: ["#121416", "#2f3030", "#bb7a31"],
    art: "weather",
    purposes: [
      { code: "A", title: "COMMUTE", copy: "A light, sealed weather shell docks under the sole rim when rain is the immediate problem." },
      { code: "B", title: "ROUGH GROUND", copy: "With the shell off, protected mesh, toe film and a shallow lug field handle broken pavement and weekend trail." },
      { code: "C", title: "DRY BY MORNING", copy: "The base shoe opens to air; footbed, shell and shoe separate. Drying time is measured and published—not described with an adjective." },
    ],
    systems: [
      { name: "DOCKABLE WEATHER SHELL", level: "DESIGN TARGET", copy: "A removable membrane bootie creates a wet mode without sentencing the dry mode to a permanent barrier.", sources: ["gore-invisible", "gore-surround"] },
      { name: "VENTED BASE", level: "KNOWN PRINCIPLE", copy: "Moisture behaviour can be measured through vapour permeability, absorption and desorption protocols.", sources: ["iso-vapour"] },
      { name: "WET-SURFACE PROTOCOL", level: "DESIGN TARGET", copy: "Compound and tread must be tested on defined wet substrates. No blanket anti-slip promise.", sources: ["iso-slip", "imd-2025"] },
    ],
  },
  {
    id: "threshold",
    order: "03",
    brand: "LOTTO",
    name: "THRESHOLD",
    family: "EVERYDAY TRAINER",
    line: "Designed for the way it comes off.",
    thesis: "A real training shoe with a returnable heel—secure in motion, hands-free at the door.",
    note: "The mechanism starts with existing category proof, then has to earn its own patent and cycle test.",
    accent: "#ff5429",
    surface: "DOORWAY / GYM / STREET",
    palette: ["#08090a", "#222529", "#3a3d40"],
    art: "threshold",
    purposes: [
      { code: "A", title: "TRAIN", copy: "A broad heel and low stack for strength sessions and ordinary functional work." },
      { code: "B", title: "WALK", copy: "Forefoot flex and a full rubber contact path for uneven pavements between sessions." },
      { code: "C", title: "STEP OUT", copy: "The heel yields on entry and returns to hold. No hand, no crushed counter, no pretending the ritual does not exist." },
    ],
    systems: [
      { name: "RETURN HEEL", level: "MARKET PRECEDENT", copy: "Hands-free hinges and structured flex heels already prove the category. This concept needs a distinct mechanism and freedom-to-operate review.", sources: ["flyease", "kizik"] },
      { name: "CYCLE-RATED COUNTER", level: "DESIGN TARGET", copy: "The counter must be tested through repeated compression, return and retention—not validated by a launch film.", sources: ["iso-flex"] },
      { name: "REPLACEABLE COLLAR", level: "DESIGN TARGET", copy: "The high-contact lining is designed as a removable service part rather than a reason to discard the whole upper.", sources: ["vibram-repair"] },
    ],
  },
  {
    id: "twenty-two",
    order: "04",
    brand: "ONE8",
    name: "22/ALL",
    family: "CLUB CRICKET",
    line: "The pitch is 22 yards. The game is everywhere.",
    thesis: "A non-spike cricket platform designed around the three jobs a club player actually performs.",
    note: "No invented ‘99%’ statistic. Surface distribution must be measured city by city through the Trial.",
    accent: "#e61935",
    surface: "MATTING / HARD GROUND / TURF",
    palette: ["#111315", "#2c3031", "#474b49"],
    art: "cricket",
    purposes: [
      { code: "A", title: "BAT", copy: "Medial forefoot flex and a replaceable toe-drag guard for repeated crease work." },
      { code: "B", title: "BOWL", copy: "Role-specific left/right inserts are proposed for landing and propulsion zones; no performance benefit is claimed before trials." },
      { code: "C", title: "FIELD", copy: "A low multi-directional lug field instead of spikes that assume prepared natural turf." },
    ],
    systems: [
      { name: "ROLE-TUNED INSERTS", level: "DESIGN TARGET", copy: "Bat, bowl and field are different load cases. Modular inserts let the Trial test them without producing three shoes.", sources: ["iso-abrasion", "iso-flex"] },
      { name: "GROUND LIBRARY", level: "DESIGN TARGET", copy: "Fifteen-city trials log substrate, wear and player movement before the outsole geometry is frozen.", sources: [] },
      { name: "MAKER REBUILD", level: "MARKET PRECEDENT", copy: "When the outsole is done, it returns to the maker for a role-matched rebuild—not an anonymous replacement.", sources: ["vibram-repair"] },
    ],
  },
  {
    id: "tenfold",
    order: "05",
    brand: "ONE8",
    name: "TENFOLD",
    family: "TRAINING",
    line: "You train more than you play.",
    thesis: "A split-platform trainer: quiet under load, free at the forefoot, contained when movement turns sideways.",
    note: "It is not a running shoe made tougher. It begins with the gym floor and works outward.",
    accent: "#e61935",
    surface: "GYM RUBBER / TRACK EDGE / ROAD",
    palette: ["#0a0a0b", "#24201e", "#b57b36"],
    art: "train",
    purposes: [
      { code: "A", title: "LIFT", copy: "A broad, minimally compressible heel gives loaded work a calmer foundation." },
      { code: "B", title: "SPRINT + AGILITY", copy: "A decoupled forefoot flexes for short efforts while a lateral frame contains change of direction." },
      { code: "C", title: "GET THERE IN IT", copy: "Full-rubber durability, dust-tolerant mesh and a serviceable collar keep it out of the special-shoe bag." },
    ],
    systems: [
      { name: "SPLIT PLATFORM", level: "DESIGN TARGET", copy: "Heel and forefoot are engineered as different zones rather than one uniform running-foam slab.", sources: ["basket-stiffness"] },
      { name: "ROPE + DUST GUARD", level: "DESIGN TARGET", copy: "A replaceable medial skin protects the frequent abrasion zone and can carry the batch code visibly.", sources: ["iso-abrasion"] },
      { name: "FLEX MAP", level: "KNOWN PRINCIPLE", copy: "Bending stiffness changes lower-limb energetics; target values must follow task testing, not fashion.", sources: ["iso-flex"] },
    ],
  },
  {
    id: "after",
    order: "06",
    brand: "ONE8",
    name: "AFTER",
    family: "OFF-FEET HOURS",
    line: "Recovery is a time. Not a medical claim.",
    thesis: "The most-worn thing in the bag deserves product design—even when the honest promise is simply comfort and repeat use.",
    note: "No faster-recovery language. No therapeutic promise. Comfort, fit and durability are validated separately.",
    accent: "#e61935",
    surface: "DRESSING ROOM / TRAIN / HOME",
    palette: ["#ded2b6", "#85432f", "#e1482d"],
    art: "after",
    purposes: [
      { code: "A", title: "POST-LOAD", copy: "A generous platform, soft upper and adjustable volume for the minutes after training." },
      { code: "B", title: "TRAVEL", copy: "Closed-toe protection, a washable footbed and enough outsole for stations, hotels and bus bays." },
      { code: "C", title: "HOME", copy: "Hands-free entry and materials chosen for repeated, high-frequency use at the doorway." },
    ],
    systems: [
      { name: "HONEST RECOVERY", level: "KNOWN PRINCIPLE", copy: "The category name describes when it is worn. We do not claim accelerated physiological recovery without clinical evidence.", sources: [] },
      { name: "WASH / REPLACE / RETURN", level: "DESIGN TARGET", copy: "Footbed washes, collar replaces, outsole rebuilds. Each service event is designed before launch.", sources: ["vibram-repair", "iso-flex"] },
      { name: "VISIBLE LIFE", level: "DESIGN TARGET", copy: "A wear line and dated maker stamp turn service history into the visual identity rather than hiding it.", sources: ["wear-guidance", "iso-abrasion"] },
    ],
  },
];
