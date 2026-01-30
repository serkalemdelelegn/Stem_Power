import { backendApi } from "../../backend-api";

// ===== Backend Interfaces =====

interface BackendHero {
  id: string;
  title: string;
  subtitle: string | null;
  hero_image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendCenter {
  id: string;
  name: string;
  location: string;
  established_date: string;
  director_name: string;
  funded_by: string | null;
  website: string | null;
  phone: string | null;
  image: string | null;
  is_featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BackendStat {
  id: string;
  // Support both legacy and current backend field names
  number?: string;
  label?: string;
  title?: string;
  value?: string;
  icon?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendLaboratory {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// ===== Frontend Interfaces =====

export interface StemCenter {
  image: string | null;
  id: string;
  host: string;
  city: string;
  region: string;
  country: string;
  cluster: string;
  contact: string;
  phone: string;
  email: string;
  website: string;
  labs: string[];
  funder: string;
  yearEstablished: string;
  featured?: boolean;
  imageQuery?: string;
}

export interface HeroContent {
  badge: string;
  title: string;
  description: string;
}

export interface ImpactStat {
  number: string;
  label: string;
  icon: any; // Icon component type
}

export interface LaboratoryProgram {
  id: string;
  name: string;
  code: string;
  icon: string;
}

// ===== Fallback Data =====

const fallbackCenters: StemCenter[] = [
  {
    id: "fallback-1",
    host: "Foka STEM Training Center",
    city: "Bishoftu",
    region: "Oromia",
    country: "Ethiopia",
    cluster: "ET-C",
    contact: "Mr. Eyob Ayechew",
    phone: "+251912066189",
    email: "eyoba@stempower.org",
    website: "https://www.stempower.org",
    labs: ["COMP", "ELEX", "MECX", "OPTX", "3DP", "CHMX", "SOLP"],
    funder: "GFCT",
    yearEstablished: "2010",
    featured: true,
    imageQuery:
      "Ethiopian students working with electronics and 3D printing equipment in modern STEM laboratory Bishoftu",
    image: null,
  },
  {
    host: "Kallamino Special High School STEM Center",
    city: "Mekelle",
    region: "Tigray",
    country: "Ethiopia",
    cluster: "ET-N",
    contact: "Mr. Daniel Tesfaye",
    phone: "+251920864574",
    email: "getwaydan@gmail.com",
    website: "https://www.muu.edu.et",
    labs: ["COMP", "ELEX", "MECX", "OPTX", "3DP"],
    funder: "GFCT",
    yearEstablished: "2011",
    imageQuery:
      "Ethiopian high school students learning electronics and mechanics in STEM lab Mekelle",
    id: "",
    image: null,
  },
  {
    host: "Gondar University STEM Center",
    city: "Gondar",
    region: "Amhara",
    country: "Ethiopia",
    cluster: "ET-N",
    contact: "Mr. Girma Workie",
    phone: "+251918729057",
    email: "workiegirma@gmail.com",
    website: "https://www.gu.edu.et",
    labs: ["COMP", "ELEX", "MECX", "OPTX", "3DP", "CHMX", "SOLP"],
    funder: "GFCT",
    yearEstablished: "2013",
    featured: true,
    imageQuery:
      "Ethiopian university students in chemistry and solar power laboratory at Gondar University",
    id: "",
    image: null,
  },
  {
    host: "Addis Ababa Science & Technology University STEM Center",
    city: "Addis Ababa",
    region: "Federal",
    country: "Ethiopia",
    cluster: "ET-C",
    contact: "Bereket Walle",
    phone: "+251910486859",
    email: "bereket.walle@aastu.edu.et",
    website: "https://www.aastu.edu.et",
    labs: ["COMP", "ELEX", "3DP", "CHMX"],
    funder: "GFCT",
    yearEstablished: "2013",
    imageQuery:
      "Ethiopian students working with computers and 3D printers in modern university STEM center Addis Ababa",
    id: "",
    image: null,
  },
  {
    host: "Bahirdar University STEM Center",
    city: "Bahirdar",
    region: "Amhara",
    country: "Ethiopia",
    cluster: "ET-N",
    contact: "Dr. Tesfa Tegegne",
    phone: "+251918762686",
    email: "tesfat@gmail.com",
    website: "https://www.bdu.edu.et",
    labs: ["COMP", "ELEX", "MECX", "OPTX", "3DP", "AERO", "HISC", "SOLP"],
    funder: "GFCT",
    yearEstablished: "2014",
    featured: true,
    imageQuery:
      "Ethiopian students in comprehensive aerospace and advanced science laboratory facility Bahirdar",
    id: "",
    image: null,
  },
  {
    host: "AASTU Science Museum",
    city: "Addis Ababa",
    region: "Federal",
    country: "Ethiopia",
    cluster: "ET-C",
    contact: "Ms. Wede / Mr. Alemseged Moreda",
    phone: "+251988109843",
    email: "wudiye21@gmail.com",
    website: "https://www.aastu.edu.et",
    labs: ["COMP", "ELEX", "MECX", "OPTX", "3DP"],
    funder: "GFCT",
    yearEstablished: "2014",
    imageQuery:
      "Ethiopian children exploring interactive science exhibits and technology displays in museum Addis Ababa",
    id: "",
    image: null,
  },
  {
    host: "Hawassa University STEM Center",
    city: "Hawassa",
    region: "Sidama",
    country: "Ethiopia",
    cluster: "ST-S",
    contact: "Dr. Misrak Getahun",
    phone: "+251912189020",
    email: "misgebe@yahoo.com",
    website: "https://www.hu.edu.et",
    labs: ["COMP", "BIO", "ELEX", "MECX", "OPTX", "3DP", "CHMX"],
    funder: "GFCT",
    yearEstablished: "2014",
    imageQuery:
      "Ethiopian students conducting biology and chemistry experiments in university laboratory Hawassa",
    id: "",
    image: null,
  },
  {
    host: "Jigjiga University STEM Center",
    city: "Jigjiga",
    region: "Ethio-Somali",
    country: "Ethiopia",
    cluster: "ET-E",
    contact: "Mr. Abdulahi Abdinur",
    phone: "+251972252573",
    email: "a_abdinurr@yahoo.com",
    website: "https://www.ju.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2014",
    imageQuery:
      "Ethiopian students learning computer programming and electronics in Jigjiga university",
    id: "",
    image: null,
  },
  {
    host: "Asosa University STEM Center",
    city: "Asossa",
    region: "Benishangul-Gumuz",
    country: "Ethiopia",
    cluster: "ET-W",
    contact: "Mr. Getachew Geleta",
    phone: "+251920230207",
    email: "getachew9267@gmail.com",
    website: "https://www.asu.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2015",
    imageQuery:
      "Ethiopian students working with computers and electronic circuits in western Ethiopia Asossa",
    id: "",
    image: null,
  },
  {
    host: "Wollega University STEM Center",
    city: "Nekemet",
    region: "Oromia",
    country: "Ethiopia",
    cluster: "ET-W",
    contact: "Mr. Amayou Belissa",
    phone: "+251922224949",
    email: "bamayou@gmail.com",
    website: "https://www.wollegauniversity.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2015",
    imageQuery:
      "Ethiopian university students in computing and electronics laboratory in Oromia region Nekemet",
    id: "",
    image: null,
  },
  {
    host: "Kotebe Science Shared Campus STEM Center",
    city: "Addis Ababa",
    region: "Federal",
    country: "Ethiopia",
    cluster: "ET-C",
    contact: "Mr. Abel",
    phone: "+251939411696",
    email: "maranathaabel@gmail.com",
    website: "https://www.stempower.org",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2015",
    imageQuery:
      "Ethiopian students collaborating on technology projects in shared campus STEM facility Addis Ababa",
    id: "",
    image: null,
  },
  {
    host: "Asaita High School STEM Center",
    city: "Asaita",
    region: "Afar",
    country: "Ethiopia",
    cluster: "ET-E",
    contact: "Mr. Mohamed Ali",
    phone: "+251921326139",
    email: "alimgt2012@yahoo.com",
    website: "https://www.stempower.org",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2015",
    imageQuery:
      "Ethiopian high school students learning technology and electronics in Afar region Asaita",
    id: "",
    image: null,
  },
  {
    host: "Adama Science & Technology University STEM Center",
    city: "Adama",
    region: "Oromia",
    country: "Ethiopia",
    cluster: "ET-E",
    contact: "Dr. Worku Jifara",
    phone: "+251973731040",
    email: "worku.jifara@gmail.com",
    website: "https://www.adamastu.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2016",
    imageQuery:
      "Ethiopian students in modern science and technology university laboratory in Adama",
    id: "",
    image: null,
  },
  {
    host: "Liqa Special School STEM Center",
    city: "Wolaita",
    region: "Southern",
    country: "Ethiopia",
    cluster: "ET-S",
    contact: "Mr. Desalegn Dawit",
    phone: "+251920412472",
    email: "desboy46@gmail.com",
    website: "https://www.stempower.org",
    labs: ["BIO", "CHEM", "PHY", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2018",
    imageQuery:
      "Ethiopian students conducting biology chemistry and physics experiments in special school Wolaita",
    id: "",
    image: null,
  },
  {
    host: "Haromaya University STEM Center",
    city: "Haromaya",
    region: "Oromia",
    country: "Ethiopia",
    cluster: "ET-E",
    contact: "Dr. Asfaw Kebede",
    phone: "+251912441024",
    email: "asfaw649@gmail.com",
    website: "https://www.haramaya.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2019",
    imageQuery:
      "Ethiopian university students working on computer and electronics projects at Haromaya",
    id: "",
    image: null,
  },
  {
    host: "Gode Polytechnic College STEM Center",
    city: "Gode",
    region: "Ethio-Somali",
    country: "Ethiopia",
    cluster: "ET-E",
    contact: "Mr. Mohamed Abdi",
    phone: "+251915747716",
    email: "nigeriagodey12@gmail.com",
    website: "https://www.stempower.org",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2019",
    imageQuery:
      "Ethiopian polytechnic students learning technical skills in computer and electronics lab Gode",
    id: "",
    image: null,
  },
  {
    host: "Harar Aboker Secondary School STEM Center",
    city: "Harari",
    region: "Harari",
    country: "Ethiopia",
    cluster: "ET-E",
    contact: "Mr. Daniel Birhanu",
    phone: "+251933269987",
    email: "danielbirane@yahoo.com",
    website: "https://www.stempower.org",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2019",
    imageQuery:
      "Ethiopian secondary school students engaged in computer programming and electronics in Harar",
    id: "",
    image: null,
  },
  {
    host: "Woldia University STEM Center",
    city: "Woldia",
    region: "Amhara",
    country: "Ethiopia",
    cluster: "ET-N",
    contact: "Mr. Melaku Adal",
    phone: "+251912964549",
    email: "adalmelaku@gmail.com",
    website: "https://www.woldia.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2019",
    imageQuery:
      "Ethiopian students working with technology and electronics at Woldia University",
    id: "",
    image: null,
  },
  {
    host: "Ethiopian Academy of Sciences STEM Center",
    city: "Addis Ababa",
    region: "Federal",
    country: "Ethiopia",
    cluster: "ET-C",
    contact: "Mr. Mesfin Engdawork",
    phone: "+251936659835",
    email: "engdamesfin@yahoo.com",
    website: "https://www.eas.org.et",
    labs: ["COMP", "ELEX", "3DP", "SOLP"],
    funder: "GFCT",
    yearEstablished: "2019",
    imageQuery:
      "Ethiopian students in advanced 3D printing and solar power laboratory at Academy of Sciences",
    id: "",
    image: null,
  },
  {
    host: "Addis Ababa Institute of Technology (AAiT) STEM Center",
    city: "Addis Ababa",
    region: "Federal",
    country: "Ethiopia",
    cluster: "ET-C",
    contact: "Dr. Bisrat Derebssa",
    phone: "+251929139442",
    email: "bisrtt@gmail.com",
    website: "https://www.aait.edu.et",
    labs: ["COMP", "ELEX", "3DP", "CHMX"],
    funder: "STEMpower",
    yearEstablished: "2019",
    imageQuery:
      "Ethiopian engineering students working with 3D printers and chemistry equipment at AAiT",
    id: "",
    image: null,
  },
  {
    host: "Wollo University STEM Center",
    city: "Dessie",
    region: "Amhara",
    country: "Ethiopia",
    cluster: "ET-N",
    contact: "Asst. Prof. Dagnachew Mullu",
    phone: "+251920359567",
    email: "dagnache.mullu@yahoo.com",
    website: "https://www.wollouni.edu.et",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "STEMpower",
    yearEstablished: "2024",
    imageQuery:
      "Ethiopian students exploring 3D printing and computer technology at Wollo University Dessie",
    id: "",
    image: null,
  },
  {
    host: "Debre Berhan University STEM Center",
    city: "Debre Berhan",
    region: "Amhara",
    country: "Ethiopia",
    cluster: "ET-N",
    contact: "Dr. Said Mohammed",
    phone: "+251913139855",
    email: "seidmuhamed@dbu.edu.et",
    website: "https://www.dbu.edu.et",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "STEMpower",
    yearEstablished: "2019",
    imageQuery:
      "Ethiopian university students working with electronics and 3D printing at Debre Berhan",
    id: "",
    image: null,
  },
  {
    host: "Debre Markos University STEM Center",
    city: "Debre Markos",
    region: "Amhara",
    country: "Ethiopia",
    cluster: "ET-N",
    contact: "Dr. Tafere Melaku",
    phone: "+25192907770",
    email: "mihretalemayehu@gmail.com",
    website: "https://www.dmu.edu.et",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "GFCT",
    yearEstablished: "2019",
    imageQuery:
      "Ethiopian students learning computer science and 3D printing technology at Debre Markos",
    id: "",
    image: null,
  },
  {
    host: "Dilla University STEM Center",
    city: "Dilla",
    region: "Southern",
    country: "Ethiopia",
    cluster: "ET-S",
    contact: "Mr. Tekalign Tadesse",
    phone: "+251912021793",
    email: "tekalign.chem@gmail.com",
    website: "https://www.dilla.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2019",
    imageQuery:
      "Ethiopian students in computer and electronics laboratory in southern Ethiopia Dilla",
    id: "",
    image: null,
  },
  {
    host: "Kebridahar University STEM Center",
    city: "Kebridahar",
    region: "Ethio-Somali",
    country: "Ethiopia",
    cluster: "ET-E",
    contact: "Abdulfeta Ahmed",
    phone: "+251911268822",
    email: "raabbiyey@gmail.com",
    website: "https://www.kdu.edu.et",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "STEMpower",
    yearEstablished: "2020",
    imageQuery:
      "Ethiopian students working with 3D printing and technology in Somali region university Kebridahar",
    id: "",
    image: null,
  },
  {
    host: "Arba Minch University STEM Center",
    city: "Arba Minch",
    region: "Southern",
    country: "Ethiopia",
    cluster: "ET-S",
    contact: "Dr. Binyam Wondale",
    phone: "+251911383337",
    email: "biniamw2005@yahoo.com",
    website: "https://www.amu.edu.et",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "STEMpower",
    yearEstablished: "2020",
    imageQuery:
      "Ethiopian university students engaged in electronics and 3D printing at Arba Minch",
    id: "",
    image: null,
  },
  {
    host: "Dire Dawa University STEM Center",
    city: "Dire Dawa",
    region: "Federal",
    country: "Ethiopia",
    cluster: "ET-E",
    contact: "Dr. Abdurahman Mohammed",
    phone: "+251911234567",
    email: "abdurahman@ddu.edu.et",
    website: "https://www.ddu.edu.et",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "GFCT",
    yearEstablished: "2020",
    imageQuery:
      "Ethiopian students in modern computing and electronics laboratory Dire Dawa University",
    id: "",
    image: null,
  },
  {
    host: "Samara University STEM Center",
    city: "Samara",
    region: "Afar",
    country: "Ethiopia",
    cluster: "ET-E",
    contact: "Mr. Ahmed Yasin",
    phone: "+251922345678",
    email: "ahmed.yasin@su.edu.et",
    website: "https://www.samara.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2020",
    imageQuery:
      "Ethiopian students learning technology in Afar region Samara University STEM lab",
    id: "",
    image: null,
  },
  {
    host: "Mekdela Amba University STEM Center",
    city: "Tulu Awuliya",
    region: "Amhara",
    country: "Ethiopia",
    cluster: "ET-N",
    contact: "Mr. Getachew Alemu",
    phone: "+251933456789",
    email: "getachew.alemu@mau.edu.et",
    website: "https://www.mau.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "STEMpower",
    yearEstablished: "2021",
    imageQuery:
      "Ethiopian students in electronics and computing lab Mekdela Amba University",
    id: "",
    image: null,
  },
  {
    host: "Injibara University STEM Center",
    city: "Injibara",
    region: "Amhara",
    country: "Ethiopia",
    cluster: "ET-N",
    contact: "Dr. Mulugeta Tesfaye",
    phone: "+251944567890",
    email: "mulugeta.t@iu.edu.et",
    website: "https://www.iu.edu.et",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "GFCT",
    yearEstablished: "2021",
    imageQuery:
      "Ethiopian students working with 3D printing technology at Injibara University",
    id: "",
    image: null,
  },
  {
    host: "Mizan Tepi University STEM Center",
    city: "Mizan Teferi",
    region: "Southern",
    country: "Ethiopia",
    cluster: "ET-S",
    contact: "Mr. Solomon Bekele",
    phone: "+251955678901",
    email: "solomon.bekele@mtu.edu.et",
    website: "https://www.mtu.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2021",
    imageQuery:
      "Ethiopian students in computer and electronics laboratory Mizan Tepi University",
    id: "",
    image: null,
  },
  {
    host: "Bule Hora University STEM Center",
    city: "Bule Hora",
    region: "Oromia",
    country: "Ethiopia",
    cluster: "ET-S",
    contact: "Dr. Tadesse Gemechu",
    phone: "+251966789012",
    email: "tadesse.gemechu@bhu.edu.et",
    website: "https://www.bhu.edu.et",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "STEMpower",
    yearEstablished: "2021",
    imageQuery:
      "Ethiopian students exploring technology and 3D printing at Bule Hora University",
    id: "",
    image: null,
  },
  {
    host: "Raya University STEM Center",
    city: "Maychew",
    region: "Tigray",
    country: "Ethiopia",
    cluster: "ET-N",
    contact: "Mr. Gebrehiwot Aregawi",
    phone: "+251977890123",
    email: "gebrehiwot.a@ru.edu.et",
    website: "https://www.ru.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2021",
    imageQuery:
      "Ethiopian students learning electronics and computing in Tigray region Raya University",
    id: "",
    image: null,
  },
  {
    host: "Adigrat University STEM Center",
    city: "Adigrat",
    region: "Tigray",
    country: "Ethiopia",
    cluster: "ET-N",
    contact: "Dr. Hailemariam Gebre",
    phone: "+251988901234",
    email: "hailemariam.g@adu.edu.et",
    website: "https://www.adu.edu.et",
    labs: ["COMP", "ELEX", "3DP", "CHMX"],
    funder: "GFCT",
    yearEstablished: "2021",
    imageQuery:
      "Ethiopian students in chemistry and 3D printing laboratory Adigrat University",
    id: "",
    image: null,
  },
  {
    host: "Aksum University STEM Center",
    city: "Aksum",
    region: "Tigray",
    country: "Ethiopia",
    cluster: "ET-N",
    contact: "Mr. Yohannes Tekle",
    phone: "+251999012345",
    email: "yohannes.tekle@aku.edu.et",
    website: "https://www.aku.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2022",
    imageQuery:
      "Ethiopian students working with computers and electronics at historic Aksum University",
    id: "",
    image: null,
  },
  {
    host: "Oda Bultum University STEM Center",
    city: "Chiro",
    region: "Oromia",
    country: "Ethiopia",
    cluster: "ET-E",
    contact: "Dr. Mohammed Hassan",
    phone: "+251910123456",
    email: "mohammed.hassan@obu.edu.et",
    website: "https://www.obu.edu.et",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "STEMpower",
    yearEstablished: "2022",
    imageQuery:
      "Ethiopian students in modern STEM laboratory with 3D printers Oda Bultum University Chiro",
    id: "",
    image: null,
  },
  {
    host: "Mettu University STEM Center",
    city: "Mettu",
    region: "Oromia",
    country: "Ethiopia",
    cluster: "ET-W",
    contact: "Mr. Dereje Tadesse",
    phone: "+251921234567",
    email: "dereje.tadesse@meu.edu.et",
    website: "https://www.meu.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2022",
    imageQuery:
      "Ethiopian students learning technology in western Oromia Mettu University",
    id: "",
    image: null,
  },
  {
    host: "Dembi Dollo University STEM Center",
    city: "Dembi Dollo",
    region: "Oromia",
    country: "Ethiopia",
    cluster: "ET-W",
    contact: "Mr. Abebe Gemechu",
    phone: "+251932345678",
    email: "abebe.gemechu@ddu.edu.et",
    website: "https://www.ddu.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2022",
    imageQuery:
      "Ethiopian students in electronics and computing lab Dembi Dollo University",
    id: "",
    image: null,
  },
  {
    host: "Madda Walabu University STEM Center",
    city: "Bale Robe",
    region: "Oromia",
    country: "Ethiopia",
    cluster: "ET-S",
    contact: "Dr. Abdi Kedir",
    phone: "+251943456789",
    email: "abdi.kedir@mwu.edu.et",
    website: "https://www.mwu.edu.et",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "STEMpower",
    yearEstablished: "2022",
    imageQuery:
      "Ethiopian students working with 3D printing and electronics Madda Walabu University",
    id: "",
    image: null,
  },
  {
    host: "Wachemo University STEM Center",
    city: "Hossana",
    region: "Southern",
    country: "Ethiopia",
    cluster: "ET-S",
    contact: "Mr. Yonas Alemayehu",
    phone: "+251954567890",
    email: "yonas.alemayehu@wcu.edu.et",
    website: "https://www.wcu.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2022",
    imageQuery:
      "Ethiopian students in computer and electronics laboratory Wachemo University Hossana",
    id: "",
    image: null,
  },
  {
    host: "Wolaita Sodo University STEM Center",
    city: "Wolaita Sodo",
    region: "Southern",
    country: "Ethiopia",
    cluster: "ET-S",
    contact: "Dr. Dawit Wolde",
    phone: "+251965678901",
    email: "dawit.wolde@wsu.edu.et",
    website: "https://www.wsu.edu.et",
    labs: ["COMP", "ELEX", "3DP", "BIO"],
    funder: "GFCT",
    yearEstablished: "2022",
    imageQuery:
      "Ethiopian students in biology and technology laboratory Wolaita Sodo University",
    id: "",
    image: null,
  },
  {
    host: "Debre Tabor University STEM Center",
    city: "Debre Tabor",
    region: "Amhara",
    country: "Ethiopia",
    cluster: "ET-N",
    contact: "Mr. Alemayehu Belay",
    phone: "+251976789012",
    email: "alemayehu.belay@dtu.edu.et",
    website: "https://www.dtu.edu.et",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "STEMpower",
    yearEstablished: "2023",
    imageQuery:
      "Ethiopian students exploring 3D printing and computing at Debre Tabor University",
    id: "",
    image: null,
  },
  {
    host: "Semera University STEM Center",
    city: "Semera",
    region: "Afar",
    country: "Ethiopia",
    cluster: "ET-E",
    contact: "Mr. Ali Mohammed",
    phone: "+251987890123",
    email: "ali.mohammed@semu.edu.et",
    website: "https://www.semu.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2023",
    imageQuery:
      "Ethiopian students learning technology in Afar region Semera University",
    id: "",
    image: null,
  },
  {
    host: "Jinka University STEM Center",
    city: "Jinka",
    region: "Southern",
    country: "Ethiopia",
    cluster: "ET-S",
    contact: "Mr. Tesfaye Abera",
    phone: "+251998901234",
    email: "tesfaye.abera@ju.edu.et",
    website: "https://www.ju.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2023",
    imageQuery:
      "Ethiopian students in computing and electronics lab Jinka University southern Ethiopia",
    id: "",
    image: null,
  },
  {
    host: "Assosa Polytechnic College STEM Center",
    city: "Assosa",
    region: "Benishangul-Gumuz",
    country: "Ethiopia",
    cluster: "ET-W",
    contact: "Mr. Bekele Negash",
    phone: "+251909012345",
    email: "bekele.negash@apc.edu.et",
    website: "https://www.apc.edu.et",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "STEMpower",
    yearEstablished: "2023",
    imageQuery:
      "Ethiopian polytechnic students learning 3D printing and electronics Assosa",
    id: "",
    image: null,
  },
  {
    host: "Gambella University STEM Center",
    city: "Gambella",
    region: "Gambella",
    country: "Ethiopia",
    cluster: "ET-W",
    contact: "Mr. Ojulu Okello",
    phone: "+251910234567",
    email: "ojulu.okello@gu.edu.et",
    website: "https://www.gu.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2023",
    imageQuery:
      "Ethiopian students working with technology in Gambella University western Ethiopia",
    id: "",
    image: null,
  },
  {
    host: "Salale University STEM Center",
    city: "Fitche",
    region: "Oromia",
    country: "Ethiopia",
    cluster: "ET-C",
    contact: "Dr. Girma Teshome",
    phone: "+251921345678",
    email: "girma.teshome@su.edu.et",
    website: "https://www.su.edu.et",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "STEMpower",
    yearEstablished: "2023",
    imageQuery:
      "Ethiopian students in 3D printing and electronics laboratory Salale University Fitche",
    id: "",
    image: null,
  },
  {
    host: "Ambo University STEM Center",
    city: "Ambo",
    region: "Oromia",
    country: "Ethiopia",
    cluster: "ET-C",
    contact: "Dr. Bekele Hundie",
    phone: "+251932456789",
    email: "bekele.hundie@ambou.edu.et",
    website: "https://www.ambou.edu.et",
    labs: ["COMP", "ELEX", "3DP", "CHMX"],
    funder: "GFCT",
    yearEstablished: "2023",
    imageQuery:
      "Ethiopian students in chemistry and technology laboratory Ambo University",
    id: "",
    image: null,
  },
  {
    host: "Jimma University STEM Center",
    city: "Jimma",
    region: "Oromia",
    country: "Ethiopia",
    cluster: "ET-W",
    contact: "Dr. Alemayehu Refera",
    phone: "+251943567890",
    email: "alemayehu.refera@ju.edu.et",
    website: "https://www.ju.edu.et",
    labs: ["COMP", "ELEX", "3DP", "BIO", "CHMX"],
    funder: "GFCT",
    yearEstablished: "2023",
    imageQuery:
      "Ethiopian students in comprehensive biology and chemistry STEM laboratory Jimma University",
    id: "",
    image: null,
  },
  {
    host: "Metu Polytechnic College STEM Center",
    city: "Metu",
    region: "Oromia",
    country: "Ethiopia",
    cluster: "ET-W",
    contact: "Mr. Tadesse Bekele",
    phone: "+251954678901",
    email: "tadesse.bekele@mpc.edu.et",
    website: "https://www.mpc.edu.et",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "STEMpower",
    yearEstablished: "2024",
    imageQuery:
      "Ethiopian polytechnic students working with 3D printers and electronics Metu",
    id: "",
    image: null,
  },
  {
    host: "Nekemte Polytechnic College STEM Center",
    city: "Nekemte",
    region: "Oromia",
    country: "Ethiopia",
    cluster: "ET-W",
    contact: "Mr. Gemechu Wakjira",
    phone: "+251965789012",
    email: "gemechu.wakjira@npc.edu.et",
    website: "https://www.npc.edu.et",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2024",
    imageQuery:
      "Ethiopian students learning electronics and computing at Nekemte Polytechnic",
    id: "",
    image: null,
  },
  {
    host: "Bonga University STEM Center",
    city: "Bonga",
    region: "Southern",
    country: "Ethiopia",
    cluster: "ET-S",
    contact: "Mr. Mekonnen Tadesse",
    phone: "+251976890123",
    email: "mekonnen.tadesse@bou.edu.et",
    website: "https://www.bou.edu.et",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "STEMpower",
    yearEstablished: "2024",
    imageQuery:
      "Ethiopian students exploring technology and 3D printing Bonga University",
    id: "",
    image: null,
  },
  {
    host: "Bench Maji Zone STEM Center",
    city: "Mizan Aman",
    region: "Southern",
    country: "Ethiopia",
    cluster: "ET-S",
    contact: "Mr. Yohannes Girma",
    phone: "+251987901234",
    email: "yohannes.girma@bmz.edu.et",
    website: "https://www.stempower.org",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2024",
    imageQuery:
      "Ethiopian students in electronics and computing lab Bench Maji Zone",
    id: "",
    image: null,
  },
  {
    host: "Gedeo Zone STEM Center",
    city: "Dilla",
    region: "Southern",
    country: "Ethiopia",
    cluster: "ET-S",
    contact: "Mr. Abebe Chala",
    phone: "+251998012345",
    email: "abebe.chala@gz.edu.et",
    website: "https://www.stempower.org",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2024",
    imageQuery:
      "Ethiopian students learning technology in Gedeo Zone STEM center",
    id: "",
    image: null,
  },
  {
    host: "Konso Special Woreda STEM Center",
    city: "Konso",
    region: "Southern",
    country: "Ethiopia",
    cluster: "ET-S",
    contact: "Mr. Kalayu Korra",
    phone: "+251909123456",
    email: "kalayu.korra@ksw.edu.et",
    website: "https://www.stempower.org",
    labs: ["COMP", "ELEX"],
    funder: "STEMpower",
    yearEstablished: "2024",
    imageQuery:
      "Ethiopian students in community STEM center learning electronics Konso",
    id: "",
    image: null,
  },
  {
    host: "Segen Area Peoples Zone STEM Center",
    city: "Arba Minch",
    region: "Southern",
    country: "Ethiopia",
    cluster: "ET-S",
    contact: "Mr. Daniel Desta",
    phone: "+251910345678",
    email: "daniel.desta@sapz.edu.et",
    website: "https://www.stempower.org",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "GFCT",
    yearEstablished: "2024",
    imageQuery:
      "Ethiopian students working with 3D printing technology Segen Area Peoples Zone",
    id: "",
    image: null,
  },
  {
    host: "Gurage Zone STEM Center",
    city: "Welkite",
    region: "Southern",
    country: "Ethiopia",
    cluster: "ET-S",
    contact: "Mr. Mulugeta Worku",
    phone: "+251921456789",
    email: "mulugeta.worku@gz.edu.et",
    website: "https://www.stempower.org",
    labs: ["COMP", "ELEX"],
    funder: "GFCT",
    yearEstablished: "2024",
    imageQuery:
      "Ethiopian students in electronics and computing laboratory Gurage Zone Welkite",
    id: "",
    image: null,
  },
  {
    host: "Hadiya Zone STEM Center",
    city: "Hossana",
    region: "Southern",
    country: "Ethiopia",
    cluster: "ET-S",
    contact: "Mr. Yosef Yohannes",
    phone: "+251932567890",
    email: "yosef.yohannes@hz.edu.et",
    website: "https://www.stempower.org",
    labs: ["COMP", "ELEX", "3DP"],
    funder: "STEMpower",
    yearEstablished: "2024",
    imageQuery:
      "Ethiopian students exploring 3D printing and technology Hadiya Zone Hossana",
    id: "",
    image: null,
  },
];

const fallbackHero: HeroContent = {
  badge: "Empowering Africa's Next Generation Since 2010",
  title: "61 STEM Centers Across Ethiopia",
  description:
    "Specialized learning hubs where education meets innovation. From our first center in Bishoftu's Foka area in 2009, we've grown into a nation-wide movement driving peace, development, and opportunity through science and technology.",
};

const fallbackStats: ImpactStat[] = [
  { number: "0", label: "STEM Centers", icon: "Building2" },
  { number: "0", label: "Regions", icon: "MapPin" },
  { number: "50k+", label: "Students Served", icon: "GraduationCap" },
  { number: "15+", label: "Years of impact", icon: "Calendar" },
];

const fallbackLaboratoryPrograms: LaboratoryProgram[] = [];

// ===== Transform Functions =====

function transformCenter(backendCenter: BackendCenter): StemCenter | null {
  try {
    // Parse location to extract city and region
    // Location format might be "City, Region" or just "City"
    const locationParts = backendCenter.location
      .split(",")
      .map((s) => s.trim());
    const city = locationParts[0] || "";
    const region = locationParts[1] || "";

    // Extract year from established_date
    const establishedDate = new Date(backendCenter.established_date);
    const yearEstablished = establishedDate.getFullYear().toString();

    // For now, we'll need to map backend data to frontend format
    // Since backend doesn't have all fields, we'll use defaults where needed
    return {
      id: backendCenter.id,
      host: backendCenter.name,
      city: city,
      region: region || "Unknown",
      country: "Ethiopia", // Default since all centers are in Ethiopia
      cluster: "ET-C", // Default cluster, could be enhanced
      contact: backendCenter.director_name,
      phone: backendCenter.phone || "",
      email: "", // Backend doesn't have email field
      website: backendCenter.website || "",
      labs: [], // Backend doesn't have labs array directly
      funder: backendCenter.funded_by || "",
      yearEstablished: yearEstablished,
      featured: backendCenter.is_featured,
      imageQuery: backendCenter.image || undefined,
      image: null,
    };
  } catch (error) {
    console.error("Error transforming center:", error);
    return null;
  }
}

function transformHero(backendHero: BackendHero): HeroContent {
  return {
    badge: "Empowering Africa's Next Generation Since 2010",
    title: backendHero.title || fallbackHero.title,
    description: backendHero.subtitle || fallbackHero.description,
  };
}

function transformStat(backendStat: BackendStat): ImpactStat {
  return {
    number: backendStat.number ?? backendStat.value ?? "",
    label: backendStat.label ?? backendStat.title ?? "",
    icon: backendStat.icon || "Building2",
  };
}

function transformLaboratory(backendLab: BackendLaboratory): LaboratoryProgram {
  // Extract code from name or use first 4 characters
  const code = backendLab.name.substring(0, 4).toUpperCase();
  return {
    id: backendLab.id,
    name: backendLab.name,
    code: code,
    icon: "🔬", // Default icon
  };
}

// ===== Fetch Functions =====

/**
 * Fetch all STEM centers from backend, with fallback to static data
 */
export async function fetchCenters(): Promise<StemCenter[]> {
  try {
    const response = await backendApi.get("/api/stem-centers/centers");
    const backendCenters: BackendCenter[] = Array.isArray(response)
      ? response
      : [];

    if (backendCenters.length === 0) {
      return fallbackCenters;
    }

    const transformedCenters = backendCenters
      .map(transformCenter)
      .filter((center): center is StemCenter => center !== null);

    // If transformation failed or returned empty, use fallback
    return transformedCenters.length > 0 ? transformedCenters : fallbackCenters;
  } catch (error) {
    console.error("Error fetching centers:", error);
    return fallbackCenters;
  }
}

/**
 * Fetch hero content from backend, with fallback to static data
 */
export async function fetchHero(): Promise<HeroContent> {
  try {
    const response = await backendApi.get("/api/stem-centers/hero");
    const backendHeroes: BackendHero[] = Array.isArray(response)
      ? response
      : [];

    if (backendHeroes.length === 0) {
      return fallbackHero;
    }

    // Get the most recent hero (first in DESC order)
    return transformHero(backendHeroes[0]);
  } catch (error) {
    console.error("Error fetching hero:", error);
    return fallbackHero;
  }
}

/**
 * Fetch statistics from backend, with fallback to static data
 */
export async function fetchStats(): Promise<ImpactStat[]> {
  try {
    const response = await backendApi.get("/api/stem-centers/center-stats");
    const backendStats: BackendStat[] = Array.isArray(response) ? response : [];

    if (backendStats.length === 0) {
      return fallbackStats;
    }

    return backendStats.map(transformStat);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return fallbackStats;
  }
}

/**
 * Fetch laboratory programs from backend, with fallback to empty array
 */
export async function fetchLaboratoryPrograms(): Promise<LaboratoryProgram[]> {
  try {
    const response = await backendApi.get("/api/stem-centers/laboratories");
    const backendLabs: BackendLaboratory[] = Array.isArray(response)
      ? response
      : [];

    if (backendLabs.length === 0) {
      return fallbackLaboratoryPrograms;
    }

    return backendLabs.map(transformLaboratory);
  } catch (error) {
    console.error("Error fetching laboratory programs:", error);
    return fallbackLaboratoryPrograms;
  }
}

// ===== CRUD Functions for Admin =====

/**
 * Create a center
 */
export async function createCenter(centerData: {
  host: string;
  city: string;
  region: string;
  country: string;
  cluster: string;
  contact: string;
  phone: string;
  email: string;
  website: string;
  labs: string[];
  funder: string;
  yearEstablished: string;
  featured?: boolean;
  imageQuery?: string;
  featuredBadge?: string;
  image?: string | File | null;
}): Promise<any> {
  // Transform frontend format to backend format
  const location = `${centerData.city}, ${centerData.region}`;
  const establishedDate = centerData.yearEstablished
    ? new Date(`${centerData.yearEstablished}-01-01`)
    : new Date();

  // If image is a File, upload using FormData
  if (centerData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", centerData.image);
    formData.append("name", centerData.host);
    formData.append("location", location);
    formData.append("established_date", establishedDate.toISOString());
    formData.append("director_name", centerData.contact);
    formData.append("funded_by", centerData.funder || "");
    formData.append("website", centerData.website || "");
    formData.append("phone", centerData.phone || "");
    formData.append("is_featured", String(centerData.featured || false));
    if (centerData.labs && centerData.labs.length > 0) {
      formData.append("labs", JSON.stringify(centerData.labs));
    }

    const response = await backendApi.postFormData(
      "/api/stem-centers/centers",
      formData
    );
    return response;
  }

  // Otherwise, send as JSON
  const backendData: any = {
    name: centerData.host,
    location: location,
    established_date: establishedDate.toISOString(),
    director_name: centerData.contact,
    funded_by: centerData.funder || null,
    website: centerData.website || null,
    phone: centerData.phone || null,
    image: centerData.imageQuery || centerData.image || null,
    is_featured: centerData.featured || false,
  };

  const response = await backendApi.post(
    "/api/stem-centers/centers",
    backendData
  );

  // Handle labs relationship if provided
  if (centerData.labs && centerData.labs.length > 0 && response.id) {
    // Labs will be handled separately via the relationship
    // For now, we'll need to update the center with labs
    // This might require additional API calls or backend support
  }

  return response;
}

/**
 * Update a center
 */
export async function updateCenter(
  id: string,
  centerData: Partial<{
    host: string;
    city: string;
    region: string;
    country: string;
    cluster: string;
    contact: string;
    phone: string;
    email: string;
    website: string;
    labs: string[];
    funder: string;
    yearEstablished: string;
    featured?: boolean;
    imageQuery?: string;
    featuredBadge?: string;
    image?: string | File | null;
  }>
): Promise<any> {
  // If image is a File, upload using FormData
  if (centerData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", centerData.image);
    if (centerData.host) formData.append("name", centerData.host);
    if (centerData.city && centerData.region) {
      formData.append("location", `${centerData.city}, ${centerData.region}`);
    }
    if (centerData.yearEstablished) {
      const establishedDate = new Date(`${centerData.yearEstablished}-01-01`);
      formData.append("established_date", establishedDate.toISOString());
    }
    if (centerData.contact)
      formData.append("director_name", centerData.contact);
    if (centerData.funder !== undefined)
      formData.append("funded_by", centerData.funder || "");
    if (centerData.website !== undefined)
      formData.append("website", centerData.website || "");
    if (centerData.phone !== undefined)
      formData.append("phone", centerData.phone || "");
    if (centerData.featured !== undefined) {
      formData.append("is_featured", String(centerData.featured));
    }
    if (centerData.labs && centerData.labs.length > 0) {
      formData.append("labs", JSON.stringify(centerData.labs));
    }

    const response = await backendApi.putFormData(
      `/api/stem-centers/centers/${id}`,
      formData
    );
    return response;
  }

  // Otherwise, send as JSON
  const updateData: any = {};
  if (centerData.host) updateData.name = centerData.host;
  if (centerData.city && centerData.region) {
    updateData.location = `${centerData.city}, ${centerData.region}`;
  }
  if (centerData.yearEstablished) {
    const establishedDate = new Date(`${centerData.yearEstablished}-01-01`);
    updateData.established_date = establishedDate.toISOString();
  }
  if (centerData.contact) updateData.director_name = centerData.contact;
  if (centerData.funder !== undefined)
    updateData.funded_by = centerData.funder || null;
  if (centerData.website !== undefined)
    updateData.website = centerData.website || null;
  if (centerData.phone !== undefined)
    updateData.phone = centerData.phone || null;
  if (centerData.imageQuery !== undefined || centerData.image !== undefined) {
    updateData.image = centerData.imageQuery || centerData.image || null;
  }
  if (centerData.featured !== undefined)
    updateData.is_featured = centerData.featured;

  const response = await backendApi.put(
    `/api/stem-centers/centers/${id}`,
    updateData
  );
  return response;
}

/**
 * Delete a center
 */
export async function deleteCenter(id: string): Promise<void> {
  await backendApi.delete(`/api/stem-centers/centers/${id}`);
}

/**
 * Create a stat
 */
export async function createStat(statData: {
  number: string;
  label: string;
  icon?: string | null;
}): Promise<any> {
  const response = await backendApi.post("/api/stem-centers/center-stats", {
    number: statData.number,
    label: statData.label,
    icon: statData.icon || null,
  });
  return response;
}

/**
 * Update a stat
 */
export async function updateStat(
  id: string,
  statData: Partial<{
    number: string;
    label: string;
    icon: string | null;
  }>
): Promise<any> {
  const updateData: any = {};
  if (statData.number !== undefined) updateData.number = statData.number;
  if (statData.label !== undefined) updateData.label = statData.label;
  if (statData.icon !== undefined) updateData.icon = statData.icon || null;

  const response = await backendApi.put(
    `/api/stem-centers/center-stats/${id}`,
    updateData
  );
  return response;
}

/**
 * Delete a stat
 */
export async function deleteStat(id: string): Promise<void> {
  await backendApi.delete(`/api/stem-centers/center-stats/${id}`);
}
