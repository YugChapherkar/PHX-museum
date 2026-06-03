export interface EpochData {
  id: string;
  name: string;
  span: string;
  summary: string;
  atmosphere: string;
  co2Level: string;
  seaLevel: string;
  indexFossil: string;
  color: string;
}

export const GEOLOGICAL_EPOCHS: EpochData[] = [
  {
    id: "hadean",
    name: "Hadean Aeon",
    span: "4.6B - 4.0B Y.A.",
    summary: "The baptism of fire. Earth formed from solar dust accretion. Frequent planetary collisions liquefy the crust, culminating in the collision of proto-planet Theia & formulation of the Moon.",
    atmosphere: "Anoxic: CO2, Water vapor, Nitrogen (severe lethal volcanic gas haze)",
    co2Level: "10,000x Present",
    seaLevel: "No liquid seas initially; vaporized steam rains formulated oceans at final stages",
    indexFossil: "None (Azoic period prior to cellular biogenesis)",
    color: "from-amber-950 to-red-950"
  },
  {
    id: "archean",
    name: "Archaean Aeon",
    span: "4.0B - 2.5B Y.A.",
    summary: "The emergence of life. Thermal vents harbor the very first prokaryotic cells. Cyanobacteria slowly evolve in iron-green seas, starting ancient oxygen synthesis via early photosynthesis.",
    atmosphere: "Anoxic methane, carbon dioxide, chemical sulfur, initial raw nitrogen lines",
    co2Level: "80x Present",
    seaLevel: "Deep world-covering iron-green ocean, rare volcanic micro-continental islands",
    indexFossil: "Stromatolites (ancient cyanobacterial layer mounds)",
    color: "from-indigo-950 to-slate-900"
  },
  {
    id: "proterozoic",
    name: "Proterozoic Aeon",
    span: "2.5B - 541M Y.A.",
    summary: "The rise of complexity. The Great Oxidation Event rusts oceans, precipitating global glacial ice periods ('Snowball Earth'). Complex eukaryotic cells, algae, and initial Ediacaran fauna appear.",
    atmosphere: "Oxygen levels rise to ~10%; ozone layer begins protective blocking of cosmic rays",
    co2Level: "15x Present",
    seaLevel: "Massive ice caps covering early supercontinents (Rodinia assembly)",
    indexFossil: "Grypania spiralis (early multicellular green algae threads)",
    color: "from-blue-950 to-teal-900"
  },
  {
    id: "paleozoic",
    name: "Paleozoic Era",
    span: "541M - 252M Y.A.",
    summary: "The armored dawn. Cambrian explosion erupts marine invertebrate structures. Primitive plants crawl onto bare rocks. Massive coal carbon swamps foster giant trilobites, armor fish, and initial reptiles.",
    atmosphere: "Variable oxygen content peaking at 35% fostering biological giant gigantism",
    co2Level: "8x Present",
    seaLevel: "High ocean levels (Palaeotethys) submerging modern land areas, later extreme drop",
    indexFossil: "Paradoxides Trilobites & early Devonian armor-plated placoderm fish skeleton cores",
    color: "from-emerald-950 to-zinc-900"
  },
  {
    id: "mesozoic",
    name: "Mesozoic Era",
    span: "252M - 66M Y.A.",
    summary: "The age of giants. Tectonic forces split Pangea apart. Megafauna dinosaurs conquer terrestrial domains, giant reptiles (Ichthyosaurs, Pliosaurs) patrol deep ocean corridors, and pterosaurs rule warm skies.",
    atmosphere: "Warm, greenhouse climate lacking permanent polar glacier caps",
    co2Level: "4x Present",
    seaLevel: "Very high (+120m to +170m above current datum) drowning inner continents",
    indexFossil: "Dromaeosaur claw molds, Jurassic ammonite shell suture spirals, pterodactyl wing segments",
    color: "from-rose-950 to-stone-900"
  },
  {
    id: "cenozoic",
    name: "Cenozoic Era",
    span: "66M Y.A. - Today",
    summary: "The mammalian empire. Following the Chixculub meteor impact, avian survivors and agile mammals colonize remaining terrestrial voids. Continents reach current shapes, leading to primate evolution.",
    atmosphere: "Cooling trend with cyclic glacial ice age intervals, balancing at 21% Oxygen",
    co2Level: "420 ppm (Historical Low increasing over 18th Century industrial activity)",
    seaLevel: "Current sea-level datum stabilized with seasonal continental ice caps",
    indexFossil: "Mammoth molars, Carcharocles megalodon teeth plates, early hominid fossil tracings",
    color: "from-slate-900 to-black"
  }
];

export interface SpecimenNode {
  id: string; // node handle
  name: string; // readable tag
  description: string; // anatomical analysis report
  x: number; // percentage coordinate on vector canvas
  y: number; // percentage coordinate on vector canvas
}

export const SPECIMEN_DIAGNOSTIC_NODES: Record<string, SpecimenNode[]> = {
  trex: [
    { id: "sclera", name: "Sclerotic Ring Aperture", description: "Bony ring structures protecting the skull orbital depth. Indicates stereoscopic prey targeting systems with acute vision fields.", x: 28, y: 32 },
    { id: "maxilla", name: "Maxillary Fangs Dentary", description: "Possesses 60 serrated, bone-shattering, knife-like teeth under high replacement cycling. Sustains over 12,000 lbs puncture pressure.", x: 18, y: 48 },
    { id: "cervical", name: "S-Curve Cervical Strut", description: "Thickened, heavily muscle-anchored bone architecture designed to absorb recoil energy from heavy struggles, side-shaking prey.", x: 44, y: 30 },
    { id: "scapula", name: "Vestigial Pectoral Scapula", description: "Diminutive, non-locomotive forelimbs with twin razor-sharp claws. High density bone content indicates extreme load-bearing muscle tension.", x: 55, y: 46 }
  ],
  triceratops: [
    { id: "rostral", name: "Keratinous Rostral Beak", description: "Toothless snout cap utilized to shear tough Mesozoic ferns and cycads. Backed by hundreds of highly efficient grinding dental batteries.", x: 14, y: 56 },
    { id: "frill", name: "Frill Squamosal Fenestra", description: "Expanded plate of sheer cranium shield bone. Richly vascularized, suggesting thermal regulation, mate recognition, and core display defense.", x: 58, y: 22 },
    { id: "orbital", name: "Postorbital Cornu Strut", description: "Grows up to 1.2 meters of solid bone structure. Capable of deflecting direct predator charging strikes during Cretaceous encounters.", x: 34, y: 34 },
    { id: "cervical", name: "Fused Syncervical Vertebrae", description: "Highly adapted joined bone structures supporting the immense weight of an 8-ton head during high impact territorial skull clashes.", x: 68, y: 52 }
  ],
  pterodactyl: [
    { id: "mandible", name: "Needled Dentary Mandible", description: "Armed with ~90 needle-like teeth aligned in narrow jaw paths, engineered for catching wet marine life mid-flight over coastal waters.", x: 10, y: 42 },
    { id: "pteroid", name: "Pteroid Flight Bone", description: "Custom spike bone structure unique to pterosaurs. Controls the critical leading-edge skin membrane flap to perform hyper-precise glides.", x: 48, y: 32 },
    { id: "digit4", name: "Elongated Wing Digit IV", description: "Hyper-extended fourth finger bone holding the entire primary aerodynamic membrane structure, which folds during ground walking cycles.", x: 74, y: 18 },
    { id: "uropatagium", name: "Interfemoral Uropatagium", description: "Secondary stabilizing skin membrane structure connected back to hind spur ankles. Acts as an aerodynamic rudder control system.", x: 82, y: 64 }
  ],
  ammonite: [
    { id: "phragmocone", name: "Phragmocone Chamber Shell", description: "Coiled internal gas buoyancy core. Chambers are walled off inside fractal, suture-welded crystalline aragonite dams.", x: 52, y: 48 },
    { id: "siphuncle", name: "Siphuncle Buoyancy Tube", description: "Fine organic mineral pipe traversing every shell block. Facilitates fluid gas expulsion to sink or float like an ancient submarine.", x: 32, y: 32 },
    { id: "protoconch", name: "Protoconch Initial Seed", description: "The tiny central starting sphere formed in the embryonic stage. Preserves initial Cretaceous climate isotopes in crystal lattices.", x: 50, y: 50 },
    { id: "aperture", name: "Growth Aperture Opening", description: "The final external mouth segment housing the cephalopod body tentacles. Built with beautiful layered aragonite ridges.", x: 78, y: 72 }
  ],
  fluorite: [
    { id: "isometric", name: "Cubic Symmetry Center", description: "Possesses three-axis spatial intersection parameters. Preserves highly structured molecular lattices under isometric crystal groups.", x: 50, y: 50 },
    { id: "cleavage", name: "Octahedral Perfect Cleavage", description: "Cleaves beautifully along four symmetrical planes under load, refracting daylight into brilliant, highly structured neon angles.", x: 22, y: 25 },
    { id: "impurity", name: "Strontium-Rare Impurities", description: "Minute inclusions of rare-earth elements embedded in calcite veins causing natural daylight fluorescence and emerald color shifts.", x: 68, y: 34 },
    { id: "lattice", name: "CaF2 Crystal Unit Cells", description: "Eight-atom molecular cells. Strong electrostatic bonds maintain chemical and physical hardness of 4.5 Mohs scale.", x: 38, y: 62 }
  ],
  archaeopteryx: [
    { id: "dentary", name: "Saurian Jaw Dentary", description: "Reptilian-like mouth containing true specialized conical teeth. Lacks a modern lightweight biological beak structure.", x: 24, y: 25 },
    { id: "digits", name: "Unfused Wing Claws", description: "Three fully separated finger segments ending in sharp curved claws, utilized for high tree branches climbing and climbing scrambles.", x: 42, y: 48 },
    { id: "pygostyle", name: "Avian Tail Rachis Rows", description: "Possesses a long, reptilian bony tail shaft with opposite twin arrays of beautiful asymmetrical feather quills.", x: 78, y: 58 },
    { id: "wishbone", name: "Furcula Elastic Wishbone", description: "Strong fused pectoral bone enabling flight muscles anchor. Shows key evolutionary phase bridging dinosaurs directly to modern birds.", x: 52, y: 38 }
  ]
};
