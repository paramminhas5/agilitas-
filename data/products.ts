// ─── TYPES ───────────────────────────────────────────────────────────────────

export type Brand = "LOTTO" | "ONE8";

export type Technology = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  detail: string;
};

export type Shoe = {
  id: string;
  order: number;
  brand: Brand;
  name: string;
  subtitle: string;
  whyWeMadeIt: string;
  purposeA: { label: string; description: string };
  purposeB: { label: string; description: string };
  purposeS: { label: string; description: string };
  value: string;
  features: string;
  whoItsFor: string;
  technologies: string[];
  accent: string;
  palette: [string, string, string];
};

export type Campaign = {
  id: string;
  name: string;
  shoe: string;
  tagline: string;
  description: string;
  film: string;
  gtm: string;
};


// ─── TECHNOLOGIES ────────────────────────────────────────────────────────────

export const technologies: Technology[] = [
  {
    id: "ground-last",
    name: "GROUND LAST",
    tagline: "The foundation, in every shoe",
    description: "Cut from real Indian foot-scan data — wider forefoot, held heel — not a generic Western block.",
    detail: "The one thing a competitor can't buy off a supplier's shelf. The last is the foot-shaped mould a shoe is built around.",
  },
  {
    id: "grip-rubber",
    name: "GRIP RUBBER",
    tagline: "Traction and durability; a family, not one compound",
    description: "A graphene-infused rubber. Two tunings from the same base — Hard for cement durability, Soft for maximum stick.",
    detail: "Independently tested as 50% stronger, 50% more elastic, 50% harder-wearing. One platform, two opposite jobs.",
  },
  {
    id: "two-ground-sole",
    name: "TWO-GROUND SOLE",
    tagline: "For wet and rocky ground at once",
    description: "One outsole, two grip zones: soft finely-cut for wet surfaces, firm deep-lugged for loose rocky ground.",
    detail: "Most shoes make you pick one. This handles both. The heart of Traktor, and re-tuned for turf grip in NightShift.",
  },
  {
    id: "dry-system",
    name: "DRY SYSTEM",
    tagline: "Beating the monsoon, honestly",
    description: "Two modes. Drain mode is a real mechanical pump. Seal mode zips in a waterproof Gore-Tex liner.",
    detail: "On the box: dry by morning (passive). At drying stations: under two hours. Two true claims, two numbers.",
  },

  {
    id: "fold-heel",
    name: "FOLD HEEL",
    tagline: "For the way we take shoes off",
    description: "A reinforced heel that folds flat when you step on it and springs back, rated for tens of thousands of cycles.",
    detail: "Turns 'crushing the back of your shoe' from damage into a feature. Printed cycle rating on the shoe.",
  },
  {
    id: "second-skin",
    name: "SECOND SKIN",
    tagline: "The sole that changes as it ages",
    description: "A second tread pattern moulded under the first. As the top wears down, the second surfaces.",
    detail: "A court sole quietly becomes a street sole by around month fourteen. You didn't buy a second shoe. You grew one.",
  },
  {
    id: "resole",
    name: "RESOLE",
    tagline: "Built to last, on the shoes that can",
    description: "A genuinely resoleable, separable sole — the real principle behind Red Wing and Blundstone.",
    detail: "Only on shoes whose uppers can last that long. Performance shoes get a trade-in program instead.",
  },
  {
    id: "foot-sensor",
    name: "FOOT SENSOR",
    tagline: "The data layer",
    description: "A small pressure sensor in the sole linked to an app. Tracks training load over time.",
    detail: "The literal mechanism behind 'learn with Lotto, get better with one8.' Uses injury-risk training-load ratio.",
  },
  {
    id: "fresh-lining",
    name: "FRESH LINING",
    tagline: "The one everyone forgets, that everyone needs",
    description: "Silver-ion antimicrobial treatment on the footbed and lining. Kills odour and bacteria.",
    detail: "In a hot, humid country where feet sweat all day, it kills odour instead of masking it.",
  },
  {
    id: "heat-stable-foam",
    name: "HEAT-STABLE FOAM",
    tagline: "Needed here more than anywhere",
    description: "Supercritical-gas-blown formula that holds rebound across a much wider temperature range.",
    detail: "Ordinary foam softens in Indian summers. This holds its bounce from dawn to peak afternoon heat.",
  },
];


// ─── SHOES ───────────────────────────────────────────────────────────────────

export const shoes: Shoe[] = [
  {
    id: "alleys",
    order: 1,
    brand: "LOTTO",
    name: "ALLEYS",
    subtitle: "The Court Shoe",
    whyWeMadeIt: "Indian courts are cement, not sprung wood. Every court shoe here was tuned for a floor we don't have, and players' joints pay for it.",
    purposeA: { label: "BASKETBALL ON CEMENT", description: "Cushioning and outsole built for repeated jumps on abrasive outdoor cement." },
    purposeB: { label: "VOLLEYBALL + BADMINTON", description: "Same court, same shoe. Lateral stability for shuffles, plants and lunges." },
    purposeS: { label: "THE WALK HOME", description: "Quiet and low enough to wear off the court all evening. Never comes off your foot." },
    value: "One shoe for three court sports and the walk home — instead of a sports shoe you change out of.",
    features: "Grip Rubber Hard survives cement grit; low stable build; Fold Heel for easy on-off; Second Skin sole reveals street tread over a year.",
    whoItsFor: "The 6 a.m. player — books a half-court before work, plays four times a week, owns one pair.",
    technologies: ["ground-last", "grip-rubber", "fold-heel", "second-skin"],
    accent: "#FF6B35",
    palette: ["#1a1a1a", "#FF6B35", "#2d2d2d"],
  },
  {
    id: "traktor",
    order: 2,
    brand: "LOTTO",
    name: "TRAKTOR",
    subtitle: "The All-Weather Shoe",
    whyWeMadeIt: "Everyone designs for the monsoon. Nobody designs for the whole Indian year, or for the broken 200 metres between your gate and the main road.",
    purposeA: { label: "DAILY COMMUTE, ANY WEATHER", description: "Three weather modes — dry-heat venting, real pump drainage, zip-in seal for worst weeks." },
    purposeB: { label: "WEEKEND TREKS & TRAVEL", description: "Two-Ground Sole handles rock and mud. One pair replaces summer, monsoon, and weekend shoes." },
    purposeS: { label: "KILLS THE DECISION", description: "Lives by the door. Same shoe works whatever the sky does." },
    value: "One pair replaces a summer shoe, a monsoon shoe, and a weekend shoe.",
    features: "Three weather modes with Heat-Stable Foam, Dry System's real pump for rain, Two-Ground Sole that grips wet and rocky ground at once.",
    whoItsFor: "Everybody, for a different reason each season. The least niche shoe in the line.",
    technologies: ["ground-last", "dry-system", "two-ground-sole", "heat-stable-foam", "second-skin"],
    accent: "#4ECDC4",
    palette: ["#0a0f0e", "#4ECDC4", "#1a2f2c"],
  },

  {
    id: "doorway",
    order: 3,
    brand: "LOTTO",
    name: "DOORWAY",
    subtitle: "The Slip-Off Everyday Shoe",
    whyWeMadeIt: "We crush our heels down a dozen times a day. That's not misuse — it's an unwritten requirement no brand ever designed for.",
    purposeA: { label: "EVERYDAY WALK-AROUND", description: "Slip on and off at every doorway. Three seconds on, three seconds off." },
    purposeB: { label: "GYM & FUNCTIONAL TRAINING", description: "Flat, firm base is genuinely good under load." },
    purposeS: { label: "RESOLEABLE — LASTS YEARS", description: "The shoe you love actually lasts. Off in three seconds, on in three, for years." },
    value: "The everyday shoe, the gym shoe, and a shoe that doesn't get thrown away — in one.",
    features: "Fold Heel folds flat and springs back; Resole construction keeps it going; Fresh Lining stops smell worn barefoot-style all day.",
    whoItsFor: "The whole country — the entry point to the brand.",
    technologies: ["ground-last", "fold-heel", "resole", "fresh-lining"],
    accent: "#F7DC6F",
    palette: ["#1a1810", "#F7DC6F", "#2d2a1a"],
  },
  {
    id: "nightshift",
    order: 4,
    brand: "LOTTO",
    name: "NIGHTSHIFT",
    subtitle: "The Turf & Padel Shoe",
    whyWeMadeIt: "Five-a-side and padel are exploding, played late at night, and nobody makes a shoe for those surfaces.",
    purposeA: { label: "FIVE-A-SIDE FOOTBALL ON TURF", description: "Dense multi-directional nub tread grips artificial turf without catching." },
    purposeB: { label: "PADEL & FUTSAL", description: "Same surface family — one properly tuned tread serves both." },
    purposeS: { label: "NIGHT-OUT READY", description: "Light and clean enough to wear straight from the 9 p.m. game into the rest of the night." },
    value: "One turf shoe for two booming sports, plus a night-out shoe — instead of two specialist pairs.",
    features: "Two-Ground Sole turf-tuned with multi-directional nubs; low fast build; Second Skin reveals fresh tread over time.",
    whoItsFor: "The after-work city player who books the late slot.",
    technologies: ["ground-last", "two-ground-sole", "second-skin"],
    accent: "#BB86FC",
    palette: ["#0d0a1a", "#BB86FC", "#1a1530"],
  },

  {
    id: "beta",
    order: 5,
    brand: "LOTTO",
    name: "BETA",
    subtitle: "The Climbing Shoe, Rethought",
    whyWeMadeIt: "Climbing is booming in Indian cities. Existing shoes are built painfully tight. Nobody has built a genuinely comfortable gym-and-boulder shoe.",
    purposeA: { label: "GYM BOULDERING", description: "Real grip on plastic holds, no pain. Flat-to-moderate last — toes sit strong but not curled." },
    purposeB: { label: "WALK TO & FROM THE GYM", description: "A normal, comfortable shoe you can keep on." },
    purposeS: { label: "MONSOON GRIP", description: "Soft sticky sole is excellent on wet tile and stairs all monsoon — earns its place year-round." },
    value: "A climbing shoe you can actually wear to the gym and home — one shoe, not a painful pair you carry in a bag.",
    features: "Flat comfortable last; Grip Rubber Soft for stick; Fresh Lining for shared rental pairs.",
    whoItsFor: "The new and regular gym climber — the 95% the industry has ignored.",
    technologies: ["ground-last", "grip-rubber", "fresh-lining"],
    accent: "#00E676",
    palette: ["#0a1a0e", "#00E676", "#1a2d1e"],
  },
  {
    id: "session",
    order: 6,
    brand: "LOTTO",
    name: "SESSION",
    subtitle: "The Skate & Lifestyle Shoe",
    whyWeMadeIt: "Only a small fraction of people who own a skate shoe have ever skated in one. We build the real thing and let both audiences have it.",
    purposeA: { label: "GENUINE SKATING", description: "Reinforced suede exactly where a skate shoe wears through first." },
    purposeB: { label: "EVERYDAY STREET & LIFESTYLE", description: "How most people will actually wear it — Lotto's cleanest everyday shoe." },
    purposeS: { label: "WORN = INTENTIONAL", description: "Second Skin reveals a fresh pattern at the ollie zone as it wears. A beaten shoe looks intentional." },
    value: "A credible skate shoe and Lotto's cleanest everyday lifestyle shoe — one object, two lives.",
    features: "Genuine vulcanized construction; reinforced medial forefoot; Resole so a favourite pair lasts; Second Skin.",
    whoItsFor: "Skaters for credibility; everyone else for volume. Lotto's lifestyle flagship.",
    technologies: ["ground-last", "second-skin", "resole"],
    accent: "#FF4081",
    palette: ["#1a0a10", "#FF4081", "#2d1520"],
  },

  {
    id: "reverse",
    order: 7,
    brand: "ONE8",
    name: "REVERSE",
    subtitle: "The Tennis-Ball Cricket Shoe — Flagship",
    whyWeMadeIt: "The sport most of India actually plays — taped-ball cricket on cement and matting — has never had a shoe.",
    purposeA: { label: "BOWLING ON CEMENT & MATTING", description: "Studs built for those grounds, not turf spikes. Rate-Sensitive Midsole: soft to move, firm on impact." },
    purposeB: { label: "BATTING & FIELDING", description: "Same surfaces, same shoe. Multi-role design." },
    purposeS: { label: "REPLACEABLE DRAG-TOE", description: "The one square inch every bowler destroys is replaceable. The shoe outlives the wear that kills every other cricket shoe." },
    value: "One shoe for every role in the game, on the ground you actually have — that survives what normally ends a cricket shoe's life.",
    features: "Moulded dual-density studs for cement/matting; Grip Rubber Hard; Rate-Sensitive Midsole; replaceable drag-toe.",
    whoItsFor: "The 19–28 club and gully cricketer who's never owned a shoe built for his actual ground.",
    technologies: ["ground-last", "grip-rubber"],
    accent: "#E61935",
    palette: ["#1a0a0d", "#E61935", "#2d1520"],
  },
  {
    id: "train",
    order: 8,
    brand: "ONE8",
    name: "TRAIN",
    subtitle: "The Conditioning Shoe",
    whyWeMadeIt: "Cricketers train far more than they play, almost always in a running shoe built for the wrong load.",
    purposeA: { label: "LOADED LIFTING & GYM", description: "Midsole firms up under weight. A running shoe springs back — the opposite of what you want under a squat." },
    purposeB: { label: "AGILITY & CONDITIONING", description: "Stays responsive for drills and lateral movement." },
    purposeS: { label: "COACH ON YOUR FOOT", description: "Foot Sensor shows real training load in the app. Helps you not get injured." },
    value: "The gym shoe, the agility shoe, and a coach on your foot — in one.",
    features: "Rate-Sensitive Midsole; Fold Heel; Foot Sensor with injury-risk training-load tracker.",
    whoItsFor: "The same player as Reverse, six days a week, in a room nobody's filming.",
    technologies: ["ground-last", "fold-heel", "foot-sensor"],
    accent: "#FF9100",
    palette: ["#1a1208", "#FF9100", "#2d2010"],
  },

  {
    id: "recover",
    order: 9,
    brand: "ONE8",
    name: "RECOVER",
    subtitle: "The Recovery Slide",
    whyWeMadeIt: "Every cricketer owns a slide and wears it more hours than anything else — and nobody makes a good one.",
    purposeA: { label: "RECOVERY AFTER TRAINING", description: "Foam built to soak up impact — absorbs load, the opposite of a running shoe." },
    purposeB: { label: "TRAVEL & HOTEL-TO-GROUND", description: "Easiest thing to live in. Closed-toe protection." },
    purposeS: { label: "HOME ALL EVENING", description: "A performance product hiding in your doorway. What you actually wear at home." },
    value: "Recovery tool, travel shoe, and house slipper — properly engineered, finally.",
    features: "Low-rebound absorbing foam; Resole; Fresh Lining; Heat-Stable Foam for summer.",
    whoItsFor: "Everyone who just trained hard — then everyone in their house.",
    technologies: ["ground-last", "resole", "fresh-lining", "heat-stable-foam"],
    accent: "#7C4DFF",
    palette: ["#0d0a1a", "#7C4DFF", "#1a1530"],
  },
  {
    id: "everyday-mid",
    order: 10,
    brand: "LOTTO",
    name: "EVERYDAY MID",
    subtitle: "The Crossover",
    whyWeMadeIt: "A leather, resoleable crossover shoe that reads as clothing, not sportswear. The natural home for a lifestyle-figure capsule.",
    purposeA: { label: "LIFESTYLE CROSSOVER", description: "Reads as clothing, not sportswear. A musician's capsule, never an athlete's." },
    purposeB: { label: "EVERYDAY DURABILITY", description: "Leather upper and resoleable construction built to last." },
    purposeS: { label: "CULTURE VESSEL", description: "The natural home for an outside collaborator once the line's earned one." },
    value: "The shoe that bridges sport and culture — designed to be resoiled and re-interpreted.",
    features: "Leather construction; Resole system; Ground Last.",
    whoItsFor: "The person who wants one shoe that works everywhere, dressed up or down.",
    technologies: ["ground-last", "resole"],
    accent: "#8D6E63",
    palette: ["#1a1510", "#8D6E63", "#2d251a"],
  },
  {
    id: "1973-premium",
    order: 11,
    brand: "LOTTO",
    name: "1973",
    subtitle: "The Premium Study",
    whyWeMadeIt: "Same last, all texture, held for an outside collaborator once the line's earned one.",
    purposeA: { label: "PREMIUM COLLABORATION", description: "Held for a design collaborator. All texture, all craft." },
    purposeB: { label: "HERITAGE EXPRESSION", description: "The Lotto heritage (1973, the two-court mark) pointed at cement." },
    purposeS: { label: "COLLECTOR'S PIECE", description: "Limited, earned, not manufactured scarcity." },
    value: "The heritage shoe that proves the line has earned outside attention.",
    features: "Ground Last; premium materials; held for collaborator interpretation.",
    whoItsFor: "The collector and collaborator — earned, not manufactured.",
    technologies: ["ground-last"],
    accent: "#D4AF37",
    palette: ["#1a1808", "#D4AF37", "#2d2a10"],
  },
];


// ─── CAMPAIGNS ───────────────────────────────────────────────────────────────

export const campaigns: Campaign[] = [
  {
    id: "the-trial",
    name: "THE TRIAL",
    shoe: "Reverse & Train",
    tagline: "Nobody's born ready.",
    description: "The one8 Combine — a free, travelling, Hyrox-style physical test in fifteen cities. Run the stations, get a 3D foot scan, walk away with your scorecard.",
    film: "No hero, no celebrity. Ordinary people running stations, breathing hard, checking their own scorecards.",
    gtm: "Free entry via app. Scorecard designed to be posted. Year-end national dataset published.",
  },
  {
    id: "midnight-galli",
    name: "MIDNIGHT GALLI",
    shoe: "Reverse",
    tagline: "The best gully cricket happens at night.",
    description: "A floodlit night tournament in the real streets and lanes of six cities. Local house rules kept exactly as they are.",
    film: "Shot like a boxing promo — tight, dark, loud. Each city's night scored live by a local rapper.",
    gtm: "Winning gully gets repainted with a proper crease — becomes that year's city-exclusive Reverse colourway.",
  },
  {
    id: "take-them-off",
    name: "TAKE THEM OFF",
    shoe: "Doorway",
    tagline: "The heel-crush. A billion people. Every single day.",
    description: "Forty seconds. Twelve doorways, twelve real homes. The same gesture, twelve times. No dialogue, no music.",
    film: "Frame eleven: an ordinary shoe destroyed. Frame twelve: Fold Heel folds flat and springs back. Four seconds.",
    gtm: "Runs in cinemas before interval — when the hall is about to stand up and do the exact gesture on screen.",
  },
  {
    id: "10pm-league",
    name: "THE 10 PM LEAGUE",
    shoe: "NightShift",
    tagline: "The odd, cheap, floodlit slots nobody's ever glamorised.",
    description: "A real late-night five-a-side league at the venues people already book.",
    film: "Phone-shot highlights, arguments, last-minute winners — never a polished brand film.",
    gtm: "Team registration through app; live ladder; proper end-of-season final under lights.",
  },

  {
    id: "beta-sessions",
    name: "BETA SESSIONS",
    shoe: "Beta",
    tagline: "The sport's own culture of generosity.",
    description: "Monthly nights at partner gyms where strong climbers openly coach beginners through a set problem.",
    film: "Intimate and quiet — chalk, breath, the moment someone finally sticks a move.",
    gtm: "Beta becomes the house rental shoe. First climbing shoe a new climber wears is ours.",
  },
  {
    id: "sunday-session",
    name: "SUNDAY SESSION",
    shoe: "Session",
    tagline: "India's skate scene was built bottom-up.",
    description: "Fund real skatepark builds and repairs. Hold a Sunday open skate — filmed only by the skaters themselves.",
    film: "We don't put our logo on the film. We built the park; that's the credit.",
    gtm: "Parks are permanent and public. Session becomes the shoe the local scene actually wears because we earned it.",
  },
  {
    id: "dry-by-morning",
    name: "DRY BY MORNING",
    shoe: "Traktor",
    tagline: "Every waterproof claim is an adjective. We publish a number.",
    description: "Print two real numbers on the box. Publicly invite every competitor to publish theirs. Nobody will.",
    film: "Every frame shot in genuine rain. No clean-shoe hero shot anywhere.",
    gtm: "Free drying station at retail through monsoon — open to any brand's shoes.",
  },
  {
    id: "rain-locked-drop",
    name: "THE RAIN-LOCKED DROP",
    shoe: "Traktor",
    tagline: "A drop nobody can game.",
    description: "A special Traktor colourway that only unlocks in the app when it's actually raining in your city.",
    film: "Real-world weather as the trigger. Makes the whole city hope for rain.",
    gtm: "Announced two hours ahead, at one store. Scarcity that can't be faked.",
  },
  {
    id: "thousand-riders",
    name: "A THOUSAND RIDERS",
    shoe: "Traktor",
    tagline: "The most-seen feet in India.",
    description: "A thousand pairs onto delivery riders in one city. No contract, no post required.",
    film: "The most brutal durability test on earth, cheaper than a billboard.",
    gtm: "Within a week the shoe is familiar to everyone at a traffic light.",
  },
  {
    id: "ball-maker-capsule",
    name: "THE BALL-MAKER CAPSULE",
    shoe: "Reverse",
    tagline: "Two Indian factories finally credited in public.",
    description: "A capsule made with a Meerut or Jalandhar ball factory — their leather, their stitch, their name on the box.",
    film: "A better story than any endorsement, at a fraction of the cost.",
    gtm: "A few hundred pairs. The factory's name next to ours.",
  },
];
