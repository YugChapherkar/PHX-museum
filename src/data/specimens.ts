export interface Specimen {
  id: string;
  name: string;
  scientificName: string;
  period: string;
  age: string;
  location: string;
  category: "Dinosaurs" | "Ancient Life" | "Minerals" | "Fossils";
  image: string;
  description: string;
  stats: {
    label: string;
    value: string;
  }[];
  taxonomy: string[];
}

export const specimensData: Specimen[] = [
  {
    id: "trex",
    name: "Tyrannosaurus Rex",
    scientificName: "Tyrannosaurus rex",
    period: "Late Cretaceous",
    age: "68–66 Million Years Ago",
    location: "Hell Creek Formation, Montana, USA",
    category: "Dinosaurs",
    image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624251/05_kz1tyu.png",
    description: "One of the largest land predators to have ever existed. With a bite force of over 12,000 pounds, its bone-crushing jaws dominated the late Cretaceous woodlands.",
    stats: [
      { label: "Length", value: "12.3 m" },
      { label: "Height", value: "4.0 m" },
      { label: "Bite Force", value: "57,000 N" },
      { label: "Weight", value: "8,400 kg" }
    ],
    taxonomy: ["Dinosauria", "Saurischia", "Theropoda", "Tyrannosauridae"]
  },
  {
    id: "triceratops",
    name: "Triceratops Horridus",
    scientificName: "Triceratops horridus",
    period: "Late Cretaceous",
    age: "68–66 Million Years Ago",
    location: "Laramie Formation, Wyoming, USA",
    category: "Dinosaurs",
    image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624236/03_hcp3jc.png",
    description: "An iconic herbivorous ceratopsid dinosaur distinguished by its gigantic bony frill and three sharp horns, used for protection against tyranno-predators and internal courtship battles.",
    stats: [
      { label: "Length", value: "9.0 m" },
      { label: "Frill Width", value: "2.1 m" },
      { label: "Horn Length", value: "1.2 m" },
      { label: "Weight", value: "6,000 kg" }
    ],
    taxonomy: ["Dinosauria", "Ornithischia", "Ceratopsidae", "Chasmosaurinae"]
  },
  {
    id: "pterodactyl",
    name: "Pterodactylus Antiquus",
    scientificName: "Pterodactylus antiquus",
    period: "Late Jurassic",
    age: "150–148 Million Years Ago",
    location: "Solnhofen Limestone, Bavaria, Germany",
    category: "Ancient Life",
    image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779625001/ChatGPT_Image_May_23_2026_12_24_44_PM_1_lv1dne.png",
    description: "The first flying reptile ever identified by science. It soared gracefully over warm lagoons, capturing small fish and insects with its narrow, needle-lined beak.",
    stats: [
      { label: "Wingspan", value: "1.04 m" },
      { label: "Weight", value: "2.5 kg" },
      { label: "Diet", value: "Piscivore" },
      { label: "Fossil Site", value: "Germany" }
    ],
    taxonomy: ["Pterosauria", "Pterodactyloidea", "Pterodactylidae", "Pterodactylus"]
  },
  {
    id: "ammonite",
    name: "Cleoniceras Ammonite",
    scientificName: "Cleoniceras cleon",
    period: "Early Cretaceous",
    age: "110 Million Years Ago",
    location: "Mahajanga Province, Madagascar",
    category: "Fossils",
    image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624256/04_get63z.png",
    description: "Featuring a golden, iridescent mother-of-pearl shell showing fractal-like suture lines, these cephalopods are markers of deep evolutionary time inside ancestral oceans.",
    stats: [
      { label: "Diameter", value: "24 cm" },
      { label: "Shell Type", value: "Aragonite" },
      { label: "Sutures", value: "Ammonitic" },
      { label: "Class", value: "Cephalopoda" }
    ],
    taxonomy: ["Mollusca", "Cephalopoda", "Ammonoidea", "Cleoniceradae"]
  },
  {
    id: "fluorite",
    name: "Blue Fluorite Crystal",
    scientificName: "Calcium Fluoride (CaF2)",
    period: "Carboniferous Period",
    age: "310 Million Years Ago",
    location: "Rogerley Mine, Durham, England",
    category: "Minerals",
    image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624374/02_pmvxxl.png",
    description: "Highly structural cubic geometries of luminous gemstone formations. These rare fluorites exhibit severe daylight fluorescence, turning glowing emerald green under solar rays.",
    stats: [
      { label: "Hardness", value: "4.0 Mohs" },
      { label: "Luster", value: "Vitreous" },
      { label: "System", value: "Isometric" },
      { label: "Fluorescent", value: "Yes" }
    ],
    taxonomy: ["Halides", "Fluorite Group", "CaF2", "Cubic Formation"]
  },
  {
    id: "archaeopteryx",
    name: "Archaeopteryx Lithographica",
    scientificName: "Archaeopteryx lithographica",
    period: "Late Jurassic",
    age: "150 Million Years Ago",
    location: "Eichstätt, Solnhofen, Germany",
    category: "Ancient Life",
    image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624247/01_udnber.png",
    description: "The supreme transitional fossil connecting avian ancestors directly back to terrestrial feathered theropods. Featuring broad wings, reptilian claws, and a skeletal tail.",
    stats: [
      { label: "Wingspan", value: "0.5 m" },
      { label: "Height", value: "0.3 m" },
      { label: "Feathers", value: "Asymmetric" },
      { label: "Weight", value: "1.1 kg" }
    ],
    taxonomy: ["Dinosauria", "Theropoda", "Avialae", "Archaeopterygidae"]
  }
];
