"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Sparkles,
  GraduationCap,
  Award,
  Heart,
  Lightbulb,
  MapPin,
  Globe,
} from "lucide-react";
import { fetchMembers } from "@/lib/api-about";
import { useApp } from "@/lib/app-context";

const membersStaticText = {
  en: {
    loading: "Loading...",
    heroTitleFallback: "Title has not been added yet.",
    heroSubtitleFallback: "Subtitle has not been added yet.",
    statisticsFallback: "Statistics have not been added yet.",
    leadershipBadge: "Our Leadership",
    leadershipHeading: "Board of Directors",
    leadershipDescription:
      "Our dedicated board members bring diverse expertise and unwavering commitment to advancing STEM education.",
    boardTabEthiopia: "STEMpower Ethiopia",
    boardTabAfrica: "STEMpower Africa",
    readFullBio: "Read Full Bio",
    teamBadge: "Our Team",
    teamHeading: "STEMpower Ethiopia Staff",
    teamDescription:
      "Our experienced team of educators, administrators, and specialists working together to bring quality STEM education to every corner of Ethiopia.",
    readMore: "Read More",
    loadMore: "Load More",
    showLess: "Show Less",
    boardMemberAlt: "Board member",
    staffMemberAlt: "Staff member",
  },
  am: {
    loading: "በመጫን ላይ...",
    heroTitleFallback: "አርእስት እስካሁን አልተጨመረም።",
    heroSubtitleFallback: "ንዑስ አርእስት እስካሁን አልተጨመረም።",
    statisticsFallback: "ስታቲስቲክስ እስካሁን አልተጨመሩም።",
    leadershipBadge: "መሪነታችን",
    leadershipHeading: "የዳይሬክተሮች ቦርድ",
    leadershipDescription:
      "የስቴም ትምህርትን ለማሻሻል የተለያዩ ሙያዊ ልምዶችን በአዳምጥ ቁርጠኝነት የሚያበረታቱ የዳይሬክተሮች ቦርዳችን።",
    boardTabEthiopia: "ስቴምፓወር ኢትዮጵያ",
    boardTabAfrica: "ስቴምፓወር አፍሪካ",
    readFullBio: "ሙሉ ህይወት ታሪክ ያንብቡ",
    teamBadge: "ቡድናችን",
    teamHeading: "የስቴምፓወር ኢትዮጵያ ሰራተኞች",
    teamDescription:
      "ጥሩ የስቴም ትምህርትን ወደ የኢትዮጵያ እያንዳንዱ ክፍል ለማድረስ አብረው የሚሰሩ የተማሩ አስተማሪዎች፣ አስተዳዳሪዎች እና ባለሙያዎቻችን።",
    readMore: "ተጨማሪ ያንብቡ",
    loadMore: "ተጨማሪ ጫን",
    showLess: "ያነሰ አሳይ",
    boardMemberAlt: "የቦርድ አባል",
    staffMemberAlt: "የሰራተኛ አባል",
  },
};

type MembersLanguage = keyof typeof membersStaticText;
type MembersStaticKey = keyof typeof membersStaticText.en;

const getMembersStatic = (lang: MembersLanguage, key: MembersStaticKey) =>
  membersStaticText[lang]?.[key] ?? membersStaticText.en[key];

export default function StaffPage() {
  const { selectedLanguage } = useApp();
  const lang: MembersLanguage = selectedLanguage === "am" ? "am" : "en";
  const translateStatic = (key: MembersStaticKey) =>
    getMembersStatic(lang, key);

  const [selectedStaff, setSelectedStaff] = useState<{
    name: string;
    role: string;
    bio: string;
    image: string;
  } | null>(null);

  const [activeBoard, setActiveBoard] = useState<"ethiopia" | "africa">(
    "ethiopia"
  );
  const [selectedMember, setSelectedMember] = useState<{
    name: string;
    role: string;
    bio: string;
    image: string;
  } | null>(null);

  const [membersData, setMembersData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    heroBadge?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    statistics?: Array<{
      id?: string;
      label?: string;
      value?: string | number;
    }>;
  }>({});

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await fetchMembers();
        if (data) {
          setMembersData(data);
        }
      } catch (err) {
        console.error("Error fetching members data:", err);
        // Keep loading false even on error to show fallback content
      } finally {
        setLoading(false);
      }
    };
    loadMembers();
  }, []);

  // Dynamic translation for hero + statistics (reuse translate API)
  useEffect(() => {
    const translateText = async (text: string, targetLang: "en" | "am") => {
      if (!text || targetLang === "en") return text;
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, targetLanguage: targetLang }),
        });
        if (!res.ok) return text;
        const data = await res.json();
        return data.translatedText || text;
      } catch (e) {
        return text;
      }
    };

    const translateDynamic = async (targetLang: "en" | "am") => {
      if (targetLang === "en") {
        setTranslatedContent({});
        return;
      }
      if (!membersData || loading) return;
      setTranslating(true);
      try {
        const hero = membersData?.staffHero || {};
        const stats = Array.isArray(hero.statistics) ? hero.statistics : [];
        const translatedStats = await Promise.all(
          stats.map(async (stat: any) => ({
            ...stat,
            label: await translateText(stat.label || "", targetLang),
          }))
        );

        setTranslatedContent({
          heroBadge: hero.badge
            ? await translateText(hero.badge, targetLang)
            : undefined,
          heroTitle: hero.title
            ? await translateText(hero.title, targetLang)
            : undefined,
          heroSubtitle: hero.subtitle
            ? await translateText(hero.subtitle, targetLang)
            : undefined,
          statistics: translatedStats,
        });
      } catch (e) {
        // swallow
      } finally {
        setTranslating(false);
      }
    };

    translateDynamic(selectedLanguage as "en" | "am");
  }, [selectedLanguage, membersData, loading]);

  // Use API data only - no fallbacks
  const staffHeroData = membersData?.staffHero
    ? {
        ...membersData.staffHero,
        statistics: Array.isArray(membersData.staffHero.statistics)
          ? membersData.staffHero.statistics
          : [],
      }
    : {
        badge: "",
        title: "",
        subtitle: "",
        statistics: [],
      };

  const displayHeroBadge = translatedContent.heroBadge ?? staffHeroData.badge;
  const displayHeroTitle = translatedContent.heroTitle ?? staffHeroData.title;
  const displayHeroSubtitle =
    translatedContent.heroSubtitle ?? staffHeroData.subtitle;
  const displayStatistics =
    translatedContent.statistics ?? staffHeroData.statistics;

  const boardMembers = membersData?.boardMembers || {
    ethiopia: [
      {
        name: "Dr. Ing. Getahun Mekuria",
        role: "Board Chairperson",
        bio: "Dr.-Ing. Getahun Mekuria Kuma is the former Minister of Education, former Minister of Innovation and Technology, and former Minister of Science and Technology of the Federal Democratic Republic of Ethiopia. He was a member of the Council of Ministers for five years between October 2016 and Oct 2022. Prior to becoming Minister, Dr. Getahun served as Deputy Minister and as Director General of the Minister of Science and Technology for two years. His notable contribution as a Minister includes the launching of Ethiopia's first satellite, initiating and negotiating Ethiopia's use of nuclear technology for peaceful purposes, establishment and operations of Science and Technology Universities, and establishment of centers of excellence and research. Before joining the government high offices, he had served for a total of more than six years as Deputy Scientific Director of Addis Ababa Institute of Technology (AAiT) of Addis Ababa University (AAU), as Head of Department of the School of Electrical and Computer Engineering. He holds the position of Assistant Professor of Electrical Engineering at AAiT, AAU. He also served as chairperson/member of different national Board/Council positions including: Founding Board Chairperson of Ethiopian Communication Authority, Board Chairperson of Ethiopian Electric Utility, Member of Executive Board UNESCO, President of Ethiopian UNESCO Commission, Chairperson of Ethio-Russian Inter-Governmental Commission, and many others. Dr.-Ing. Getahun did his doctoral degree in Electrical Engineering from the University of Duisburg-Essen, Germany, and his M.Sc. and B.Sc. degrees both from AAU in Electrical Engineering. He is a seasoned team leader, policy, and decision maker, rational but risk taker, result-oriented, impartial, researcher, able, innovative, and believer in systems and technology.",
        image: "/professional-ethiopian-man-in-business-attire.jpg",
      },
      {
        name: "Prof. Yalemtsehay Mekonnen",
        role: "Board Vice Chairperson",
        bio: "Yalemtsehay Mekonnen is a Professor of Cell and Human Physiology. Currently, she is an academic staff of the Department of Biology, College of Natural and Computational Sciences of Addis Ababa University, Ethiopia. She has extensively published in different peer-reviewed scientific journals on topics of respiratory physiology, medicinal plants, and other related topics. She has advised many MSc and Ph.D. students. In leadership positions, she was involved and initiated several national and international research networks and collaborations. She has also mentored young professionals especially women over the last three decades. She was awarded research grants and fellowships nationally, regionally, and internationally from organizations including the Ethiopian Science and Technology Commission, the British Council, the International Foundation for Science, the Third World Academy of Sciences, the German Academic Exchange Service, and the Alexander von Humboldt Foundation, Germany. She received the 2015 African Union Kwame Nkrumah Scientific Awards for high achievement for women in science. She has been appointed as Ambassador Scientist by the Alexander von Humboldt Foundation of Germany as part of a worldwide network for excellence in science from 2016 to 2021. She is one of the founding fellows and the current Principal Vice President of the Ethiopian Academy of Science and also a fellow of The African and the Third World Academy of Sciences.",
        image: "/professional-ethiopian-woman-scientist.jpg",
      },
      {
        name: "Winta Yohannes",
        role: "Treasurer",
        bio: "Winta is the Managing Partner of Axiom Ventures Investment Services PLC, a boutique advisory firm established with an aim to engage and support international investors in grasping the Ethiopian investment environment and source opportunities through Leverage-buyouts, M&A, and green-field projects focused on financial services. Winta comes from a private sector background mainly in investment banking and venture capital. Throughout her career, she has been involved in vast international transactions with equity and mezzanine financing for companies engaged in different sectors. Winta's career in Ethiopia started in 2006 by spearheading the investment department of an indigenous investment banking firm. Winta's industrious vision led to investments in financial services, agro-processing, food packaging, mining, car assembly, and real estate. After serving as a VP for several years, Winta moved on to head the corporate, investment strategy, and digitalization arm for a leading beverage company with a global presence. Currently, Winta is the co-founder of a lease finance company that is under formation with international prominent investors and local financial institutions. Winta has worked closely with numerous government stakeholders, Developmental Financial Institutions (DFIs), private equity firms, family offices, and local investors to secure funding and strategic partnerships. She served on the Board and lifetime Ambassador of Enat Bank, served as a Steering Committee Member of EUBFE – European Union Business Forum, and holds membership in Africa CEO List, Institute of Interim Managers of UK (IIM), and Association of Women in Business (AWiB). Winta holds her degree in Finance and Information Systems from Old Dominion University (1999 Virginia).",
        image: "/professional-ethiopian-woman-in-business-attire.jpg",
      },
      {
        name: "Prof. Teketel Yohannes",
        role: "Board Member",
        bio: "Prof. Teketel received his PhD in Physical Chemistry in 1997 from Addis Ababa University (AAU), Addis Ababa, Ethiopia. From 1984 to 2000 he served at the Department of Chemistry, at the then Bahir Dar Teachers College of the Addis Ababa University, and since August 2000 at the Chemistry Department of the Addis Ababa University. His main research area includes studies of conducting polymer electrochemistry, spectroelectrochemistry, photovoltaics, and photoelectrochemistry. He has published over 70 scientific articles and has been collaborating with prominent scientists at universities worldwide including University of Linkoping Sweden, University of Linz Austria, University of Osaka Japan, University of Antwerp Belgium, and others. He has acquired numerous research grants from various organizations and was a Junior and Regular Associate of ICTP, Associate Fellow of TWAS, Fellow of the Ethiopian Academy of Sciences, and Reviewer and Associate Editor of various local and international journals. He is also a Board Member of the African Materials Research Society, the Founder and the mastermind behind the African Network for Solar Energy, and the first Board Member of the Joint US-Africa Materials Institute. He has organized major International Conferences in Ethiopia. The leadership quality of Prof. Teketel is demonstrated by his service as Chairman of the Department of Chemistry, Director and Coordinator of the Materials Science Program, Associate Dean for Graduate Programs, Director for Research at AAU, Acting Vice President for Research and Technology Transfer at AAU, and Vice President for Academic Affairs at Addis Ababa Science and Technology University (AASTU). Currently, he is serving as an Executive Director of the Ethiopian Academy of Sciences.",
        image: "/professional-ethiopian-woman-community-leader.jpg",
      },
      {
        name: "Dr. Berhanu Admassu",
        role: "Board Member",
        bio: "Dr. Berhanu Admassu is an expert on livestock policy reforms related to poverty reduction in a wide range of environments. He has more than 40 years of academic research, project management, and advisory experience in Ethiopia and internationally and has been leading teams and coordinating/managing programs for over 25 years with progressive increases in program scope and complexity. His extensive experience working directly with marginalized African communities, particularly in pastoralist areas, enables him to link realities at the community level to the concerns and objectives of policymakers. Dr. Admassu worked as Chief of Party on the USAID/Ethiopia Agriculture Knowledge, Learning, Documentation, and Policy (AKLDP) project in Ethiopia, implemented by the Feinstein International Center, Friedman School of Nutrition Science and Policy, Tufts University. A veterinarian and epidemiologist by profession, Dr. Admassu is known for his pioneering work on rinderpest eradication in pastoralist areas of Ethiopia, where he led the piloting of novel community-based delivery systems. Due to his leadership of the program between 1992 and 1996, he was one of the international scientists who received awards from the Global Rinderpest Eradication Campaign at FAO in 2012 for his contributions to global eradication success. Dr. Admassu was President of the Ethiopian Veterinary Association (EVA) from 2000 to 2004, and from 2008 to 2012. He has served as a Board member for Adama Science and Technology University and Wollo University. Currently, Dr. Berhanu Admassu is working as a Scientist on Infectious Disease and Global Health at Cummings School of Veterinary Medicine of Tufts University and Coordinator of the Delivering Livestock Vaccines with Public-Private Partnerships Project in Ethiopia since 2021. Dr. Admassu has published over 31 Peer-reviewed publications and one book chapter. Dr. Admassu holds a DVM degree from the University of Addis Ababa and an MSc in Tropical Veterinary Medicine from the University of Edinburgh.",
        image: "/professional-ethiopian-man-accountant.jpg",
      },
      {
        name: "Alemayehu Haile",
        role: "Board Member",
        bio: "Mr. Alemayehu Haile (Alex) is the Founder of Ethiopian National Insurance Corporation (NICE), the first privately owned insurance company in Ethiopia, and served as its Board Chairman for more than 10 years. He is currently Board Chairman for real estate company DASSET Private Ltd. Company, and ground coffee producer and chain of restaurants under Marianne Trading PLC (Yeshi Buna). Additionally, Mr. Alemayehu is Board Chairman of AAlemDess Private Limited Company, a trading and service provider company, and is the Co-Founder of C&H Groups and currently serves as its Chairman. He also serves as Board Member of St. George Sport Club, Former Board Chairman of United Nations Staff Credit Association and its Staff Union. Mr. Alemayehu has held key senior management positions in the United Nations for over 25 years and worked in various companies at various positions in the US. While he was in the UN, he has worked in the area of Project Management, Finance and Administration where he was involved in implementation of various projects in Africa and led several successful projects and programs for the Region. He has more than 30 years of project management, administrative and financing experience, in Africa and the US. Mr. Alemayehu has developed in-depth knowledge of project & program management, financing, current corporate governance trends and best practices investment mechanism, which he utilizes in his day to day interaction with clients and partners, as Chairman and in charge of International Business Relations with C&H Group. He holds a degree in Accounting (BSc) and Masters in Administration & Finance, from California, USA.",
        image: "/professional-ethiopian-man-technology-leader.jpg",
      },
      {
        name: "Biruk Zewdie",
        role: "Board Member",
        bio: "Mr. Biruk Zewdie is the General Manager of IMG Metal Manufacturing PLC which is part of the family of companies collectively known as Today Tomorrow Ventures (TTV) operates in Ethiopia. Prior to this position, Biruk led three projects: Factory expansion project at IMG metal manufacturing plc in 2018, New departments establishment at IMG metal manufacturing plc in 2019-2020, and New factory establishment at IMG metal manufacturing plc in 2021-2022. Biruk earned his Bachelor of Science (B.Sc.) Degree in Information Communication Technology (ICT) in 2013.",
        image: "/professional-ethiopian-man-in-business-attire.jpg",
      },
    ],
    stempower: [
      {
        name: "Mark Gelfand",
        role: "Founder | President",
        bio: "Mark Gelfand created STEMpower (and its predecessor the Gelfand Family Charitable Trust) because of a passion for science & engineering, as well as a desire to give forward. His mission is to see all students have access to the same kind of quality STEM education experience that he had in the United States. After witnessing deserving students achieve success at Yemin Orde Youth Village in Israel, he knew that if given the opportunity, students in developing nations could thrive and become scientists and engineers in their communities. Mark is also involved in helping build the industrial capacity of Ethiopian exports through TodayTomorrowVentures. Mark earned his B.Sc. in Physics at Carnegie-Mellon University.",
        image: "/professional-ethiopian-man-in-business-attire.jpg",
      },
      {
        name: "Shachar Zahavi",
        role: "Director | Secretary",
        bio: "A veteran humanitarian aid expert experienced in disaster response and sustainable development, Shachar has led relief missions and built sustainable long-term programs since 1994. His passion and work has impacted communities in more than 60 countries worldwide. Shachar's first exposure to humanitarian emergencies was during the Rwanda genocide of 1994, when he led the largest Israeli civilian national campaign to help the Rwandan refugees. Shachar was among the founders of Latet's (the Israeli 'To Give' not-for-profit) international arm. Shachar was also the founder of IsraAID, an international aid agency which he led as Founder, Chairperson and CEO for 16 years. Recently he founded iAID, a global tech aid agency which integrates technology to help communities globally.",
        image: "/professional-ethiopian-woman-scientist.jpg",
      },
      {
        name: "Tim Veldman",
        role: "Director",
        bio: "Tim has been a presence in the field of impact investments since 2003, primarily with Dutch ventures in Africa. During Tim's seven recent years in Ethiopia, he helped to develop and operate successful companies in the agricultural and manufacturing spaces. Tim is also involved in the education field, where he and his wife-colleague founded the successful Interlakes International School, 45 km south of Addis Ababa.",
        image: "/professional-ethiopian-man-accountant.jpg",
      },
      {
        name: "Galit Cohen",
        role: "Director",
        bio: "Galit has nineteen years of experience as a professional in the international development and humanitarian aid arena, senior management experience and a Masters in Public Health (in Emergency and Disaster Management). In 2013 she opened the Blue Crane Foundation and later Ripples for Change, NGOs supporting rural communities in South Africa. In February 2018 she co-published a book called Putting Charities to Work, How to Make Money for Good. The book is a practical guide for income generating ideas and is essential for non-profit organizations, churches, schools and sport clubs.",
        image: "/professional-ethiopian-woman-in-business-attire.jpg",
      },
      {
        name: "Daniel Lacks",
        role: "Director",
        bio: "Daniel Lacks is the Associate Dean of Academics and the C. Benson Brach Professor of Chemical Engineering at Case Western Reserve University. Lacks has a passion for collaboration with international partners on curriculum development and innovation. His collaborations with universities in Africa, Asia and the Middle East have included two-way exchanges of over 300 faculty and students and have been funded by Fulbright and National Science Foundation grants. Lacks also serves as a accreditation evaluator for the ABET engineering accreditation body. Lacks received his BS in chemical engineering from Cornell University and his PhD in chemistry from Harvard University. He is a Fellow of the American Institute of Chemical Engineers.",
        image: "/professional-ethiopian-man-technology-leader.jpg",
      },
    ],
  };

  const displayedBoardMembers = boardMembers[activeBoard] || [];

  const [showAllStaff, setShowAllStaff] = useState(false);

  const staffMembers = membersData?.staffMembers || [
    {
      name: "Dr. Simenew Keskes",
      role: "Country Director",
      bio: "Dr. Simenew served Ministry of Innovation and Technology in different posts including, Innovation Advisor to the Minister, Director General for Academic and Research Institutions Affairs, and Director, on top of his teaching and research post in Addis Ababa Science and Technology University at Associate Professor academic position since 2016. Before, he joined AASTU and MInT; he worked at Dilla University as Founding Dean of Faculty of Agriculture and Rural Development and later appointed as Academic Programs Director. He has been working as visiting professor to University of Nihon in Japan. He is involved in different projects including MERS Corona Virus project funded by American National Science Foundation in collaboration with George Mason University in the US and Charitie University in Germany. Dr. Simenew got his Doctor of Veterinary Medicine in 2005 and his M.Sc. in 2007 from Addis Ababa University. He did his PhD in Veterinary Obstetrics and Gynecology under a mobility program among Addis Ababa University, Padova University in Italy, Makerere University in Uganda and Nihon University in Japan. In his research engagements, more than 30 research articles are published in internationally peer reviewed reputable journals.",
      image: "/professional-ethiopian-man-in-business-attire.jpg",
    },
    {
      name: "Fasil Woldegebriel",
      role: "Fundraising Manager",
      bio: "Fasil is supporting STEMpower as organizational development strategy consultant. He has worked for GIZ Ethiopia for more than 10 years in an expert and management positions in the topics of university industry linkages, technology transfer, entrepreneurship and technology and business incubation services for universities in Ethiopia. Fasil did his BSc in electrical engineering at Bahir Dar University in 2002 and MSc in electrical and Computer engineering at Addis Ababa University in 2007.",
      image: "/professional-ethiopian-man-in-business-attire.jpg",
    },
    {
      name: "Anteneh Fisseha",
      role: "STEM Operations Manager",
      bio: "Anteneh is STEM Operations Manager at STEMpower. He brings a wide range of experience and accomplishments to his role with STEMpower. Before working with STEMpower he graduated from Addis Ababa University with a dual degree in Business Administration and Information Systems on top of an advanced diploma he received in Electrical Engineering.",
      image: "/professional-ethiopian-man-in-business-attire.jpg",
    },
    {
      name: "Abel Tefera",
      role: "Project Manager & BDS Supervisor, Entrepreneurship & Incubation Program",
      bio: "Abel Tefera is a well-experienced Project Manager, Public relation officer, Marketing Expert, Educator and Trainer who has an in-depth background ranging from Governmental and Private, to the not-for-profit sector. He has successfully led various volunteer initiatives at the National level as a lead coordinator, under the Ethiopian Ministry of Foreign Affairs, for the initiative aimed to return Ethiopian deportees from the Middle East; He has also worked as Senior manager, under the Ministry of Education, for the initiative to support IDP students around the country; and Lead Covid Response team coordinator under the Ethiopian Red Cross Society. He is also a host of an Ethiopian based FM radio show discussing digital marketing and modern technological developments. Abel got his B.Sc. degree in Mechanical Engineering from Addis Ababa Institute of Technology, and his master's degree in project management from St. Mary's University. He currently heads the STEMpower-VISA Entrepreneurship and Financial Education Training Project.",
      image: "/professional-ethiopian-man-technology-leader.jpg",
    },
    {
      name: "Yohannes Bogale",
      role: "ICT Manager",
      bio: "Yohannes is a Website Admin/Fab Lab Technical Officer at STEMpower Inc. Prior to that position he worked as a Computer/Electronics Engineer for more than 6 years. He worked in three different Engineering firms i.e. China Construction and Communication Company (CCCC) at Addis Ababa Bole International Airport Terminal 2 Expansion Project, SERDUR Group, a Turkish Engineering/construction company and Fortune Engineering PLC a local Telecom, Power and Systems Integrator company starting from junior to senior positions. Yohannes earned his B.Sc degree in Electrical and Electronics Engineering from Addis Ababa institute of Technology (AAiT). He also has a certificate in Computer Maintenance and Networking from SAT-COM Institute of Technology.",
      image: "/professional-ethiopian-man-technology-leader.jpg",
    },
    {
      name: "Eyob Ayechew",
      role: "Electronics Expert",
      bio: "Eyob is an Electronics Expert at Foka Science and Engineering center. Prior to that he has more than 10 years of working experience at Ethiopia Air Force in different positions like Electronics and Electricity specialist, Electrical power engineering maintenance supervisor, lecturer and section head avionics department at Air force Academy college, and electronics expert at STEM synergy. Eyob earned his B.Sc degree from Defense Engineering College in Electrical Power Engineering specializing in Electrical equipment design in 2001.",
      image: "/professional-ethiopian-man-technology-leader.jpg",
    },
    {
      name: "Merkineh Petros",
      role: "Electronics Expert",
      bio: "Merkineh is a Fab Lab Electronics Expert at STEMpower Inc.. Prior to that position, he worked as an Electronics and Robotics expert at Hawassa STEM Center. He also worked as a Chief Technical Head at Hawassa Friendship Electro-Mechanical Engineering PLC. He earned his B.Sc. degree in Electrical and Computer Engineering from Hawassa University-Institute of Technology. He also received certificate in EV3 Mind-storm Robotics instructor's certificate and solar energy power installation instructor's certificate from Germany wilpordsired.",
      image: "/professional-ethiopian-man-accountant.jpg",
    },
    {
      name: "Tigist Yonas",
      role: "Finance & Admin Manager",
      bio: "Tigist is a Finance and Admin Manager at STEMpower Inc. Prior to this role, she was a finance officer at Emmanuel Development Association. Before that, she worked as a Finance and Administration head of Alliance for poverty eradication and development association and Finance head for Hadiya Development Association. She earned her bachelor of Art degree in Accounting and Finance from Dilla University and Master of Art in Business Administration from Lead Star College of management and leadership.",
      image: "/professional-ethiopian-woman-in-business-attire.jpg",
    },
    {
      name: "Tariqua Bekele",
      role: "FabLab Attendant",
      bio: "Tarikua is a Fab Lab Attendant at STEMpower Inc. She mainly engaged in supporting the staff's day to day activities. Prior to this role, she worked in Shints Garment Factory at Bole Lemi Industrial Park as a Material Control Engineer. She also worked in Unilever Ethiopia as a Team Leader. She earned her B.Sc. degree in Textile Engineering from Bahirdar University. Apart from job activities, she is a permanent blood donor in Ethiopian Blood Bank.",
      image: "/professional-ethiopian-woman-community-leader.jpg",
    },
    {
      name: "Israel Gebru",
      role: "Electromechanical Expert",
      bio: "Israel Gebru is an Electromechanical engineer working as an Electronics Expert at STEMpower-FabLab. Prior to his role, he worked as an Electrical Engineer at Base Tech Engineering PLC, Before that, he worked in different industrial companies as a Consultant and Maintenance Engineer. In the FabLab, he design and manufacture various types of basic science teaching kits for high school students. He acquired the knowledge and experience of working on simple to complex project designing and product manufacturing process. Israel earned his Bachelor of Science degree in Electromechanical Engineering from Addis Ababa Science and Technology University.",
      image: "/professional-ethiopian-man-technology-leader.jpg",
    },
    {
      name: "Yenenesh Girma",
      role: "General Service",
      bio: "Yenenesh Girma works as a General Service in STEMpower. Prior to this role, she worked as a General Service for a total of 9 years at Foka STEM center. She studied basic computer skills in level 2 TVET.",
      image: "/professional-ethiopian-woman-community-leader.jpg",
    },
    {
      name: "Aynalem Derese",
      role: "PR Expert",
      bio: "Aynalem worked as an assistant of 3D modeling and printing in GM3D at Addis Ababa University. She trained 3D modeling and printing at Abugida Robotics and Technology Center. She also worked as intern at Infinity ATS (Advanced Technology Solution PLC) as an assistant of field Engineer on installation, maintenance, calibration and site preparation of medical devices. Aynalem earned her Bachelor of Science Degree in Biomedical Engineering from Addis Ababa University, Institute of Technology (AAU/AAiT).",
      image: "/professional-ethiopian-woman-in-business-attire.jpg",
    },
    {
      name: "Ruhama Tarekegn",
      role: "FabLab Manager",
      bio: "Ruhama worked in 2 different companies i.e., Agape Engineering PLC as a shareholder and installation engineer and Samek Engineering as an installation and maintenance engineer for security and automation systems. She earned her Bachelor of Science Degree in Electro-mechanical Engineering from Addis Ababa Science and Technology University (AASTU).",
      image: "/professional-ethiopian-woman-in-business-attire.jpg",
    },
    {
      name: "Yared Gebremeden",
      role: "Video Production Expert",
      bio: "Yared Gebremeden is a Senior Video Production Director at STEMpower Inc. He is currently living in Addis Ababa, Ethiopia. Before his current role, Yared worked as a Senior Editor at the Ethiopian Herald Newspaper, Ethiopian News Agency, and other private and government mediums from Reporter to Editor Positions. To mention a few, Yared has worked in Zami FM radio as a reporter, in the Addis Ababa Communication Office as a TV program producer, Monitoring Expert at the Ethiopian Broadcasting Authority, and Senior Translation and Literature Expert in the Ministry of Sport PR department and some years of English language teaching experience as well. Yared graduated in two Diploma programs in TV journalism and English Language Literature from the current AAU Journalism School and Kotebe Teachers Training College respectively early in his education career. And then he graduated with an English Language Teaching and Literature BA from AAU. Then he studied for his MA in Leadership and Management from EGST. Now he is attending his PhD program. Yared is highly passionate about Video Productions and Directing.",
      image: "/professional-ethiopian-man-accountant.jpg",
    },

    {
      name: "Abigiya Tegene",
      role: "PR Expert",
      bio: "Abigiya is a Public Relations and Communications Expert at STEMpower Inc., where she plays an active role in developing communication content and supporting media strategies that promote STEM education across Sub-Saharan Africa. She holds a Bachelor's degree in Global Studies and International Relations from New Generation University College. Previously, she served as an International Engagement and Public Diplomacy Officer at Safe Light Initiatives, coordinating youth-focused diplomacy programs and partnerships. She currently also work with the Ethiopian National Dialogue Commission as a Communication and Media Department Officer. She specializes in strategic communication, public and international relations across local and international platforms.",
      image: "/professional-ethiopian-woman-community-leader.jpg",
    },
  ];

  const gradientTextClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold";
  const gradientButtonClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-white hover:opacity-90 transition-all";

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#367375] mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              {translateStatic("loading")}
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] py-12 md:py-16">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-20 bg-cover bg-center" />

          {/* Geometric shapes - reduced sizes */}
          <div className="absolute top-8 left-16 w-20 h-20 border-2 border-white/20 rounded-2xl rotate-12" />
          <div className="absolute top-24 right-24 w-16 h-16 border-2 border-cyan-300/30 rounded-full" />
          <div className="absolute bottom-12 left-1/4 w-24 h-24 border-2 border-teal-300/20 rounded-xl -rotate-12" />
          <div className="absolute bottom-16 right-16 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute top-1/3 left-8 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl" />
          <div className="absolute top-12 right-8 w-48 h-48 bg-cyan-400/15 rounded-full blur-2xl" />

          <div className="relative max-w-5xl mx-auto px-4 text-center">
            {/* Badge - smaller */}
            {displayHeroBadge && (
              <div className="inline-flex items-center gap-2 bg-white/20 text-white border border-white/30 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-4 shadow-lg">
                <Sparkles className="h-4 w-4" />
                {displayHeroBadge}
              </div>
            )}

            {/* Main heading - smaller */}
            {displayHeroTitle ? (
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white text-balance leading-tight">
                {displayHeroTitle}
              </h1>
            ) : (
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white text-balance leading-tight italic opacity-75">
                {translateStatic("heroTitleFallback")}
              </h1>
            )}

            {/* Description - smaller */}
            {displayHeroSubtitle ? (
              <p className="text-base md:text-lg text-emerald-50 mb-6 max-w-2xl mx-auto text-pretty leading-relaxed">
                {displayHeroSubtitle}
              </p>
            ) : (
              <p className="text-base md:text-lg text-emerald-50 mb-6 max-w-2xl mx-auto text-pretty leading-relaxed italic opacity-75">
                {translateStatic("heroSubtitleFallback")}
              </p>
            )}
          </div>
          <br />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent" />
        </section>
        <section className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
          {displayStatistics.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {displayStatistics.map((stat: any, index: number) => {
                const iconMap: { [key: string]: any } = {
                  users: Users,
                  "graduation-cap": GraduationCap,
                  award: Award,
                  heart: Heart,
                };
                const IconComponent = iconMap[stat.icon || "users"] || Users;
                return (
                  <Card
                    key={stat.id || index}
                    className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/10 bg-white/10 backdrop-blur-md rounded-xl scale-95 hover:scale-100"
                  >
                    <CardContent className="pt-4 pb-3 px-2">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md"
                        style={{
                          background: `linear-gradient(to bottom right, #367375, #24C3BC)`,
                        }}
                      >
                        <IconComponent className="h-4 w-4 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
                      </div>
                      <div className="text-2xl font-bold text-[#367375] mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-700 font-medium">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="italic">{translateStatic("statisticsFallback")}</p>
            </div>
          )}
        </section>

        <section
          id="board-section"
          className="py-10 md:py-20 bg-linear-to-b from-slate-50 via-white to-slate-50"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Users className="h-4 w-4" />
                  {translateStatic("leadershipBadge")}
                </div>
                <h2
                  className={`text-4xl md:text-4xl mb-6 ${gradientTextClass} text-balance`}
                >
                  {translateStatic("leadershipHeading")}
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                  {translateStatic("leadershipDescription")}
                </p>
                <div className="w-24 h-1.5 mx-auto rounded-full bg-linear-to-br from-[#367375] to-[#24C3BC] mt-6" />
              </div>

              <div className="flex justify-center mb-12">
                <div className="inline-flex rounded-xl bg-slate-100 p-1.5 shadow-lg border-2 border-slate-200">
                  <Button
                    onClick={() => setActiveBoard("ethiopia")}
                    className={`px-8 py-3 rounded-lg text-base font-semibold transition-all ${
                      activeBoard === "ethiopia"
                        ? "bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-lg"
                        : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/50"
                    }`}
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    {translateStatic("boardTabEthiopia")}
                  </Button>
                  {boardMembers.africa && boardMembers.africa.length > 0 && (
                    <Button
                      onClick={() => setActiveBoard("africa")}
                      className={`px-8 py-3 rounded-lg text-base font-semibold transition-all ${
                        activeBoard === "africa"
                          ? "bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-lg"
                          : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/50"
                      }`}
                    >
                      <Globe className="w-5 h-5 mr-2" />
                      {translateStatic("boardTabAfrica")}
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedBoardMembers.map((member: any, index: number) => (
                  <Card
                    key={index}
                    className="group border-2 border-slate-200 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-muted border-2 border-emerald-200 shadow-md group-hover:border-emerald-400 transition-colors">
                          <Image
                            src={member.image || "/placeholder.svg"}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-foreground leading-tight mb-1.5">
                            {member.name}
                          </h3>
                          <p className="text-emerald-600 font-semibold text-sm">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {member.bio}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedMember(member)}
                          className="w-full mt-3 font-semibold text-transparent bg-clip-text bg-linear-to-br from-[#367375] to-[#24C3BC] 
             hover:text-[#367375] hover:bg-clip-text-none transition-all"
                        >
                          {translateStatic("readFullBio")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Staff Members Section */}
        {/* Staff Members Section */}
        <section
          id="staff-section"
          className="py-16 md:py-15 bg-linear-to-b from-white via-slate-50 to-white"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Users className="h-4 w-4" />
                  {translateStatic("teamBadge")}
                </div>
                <h2
                  className={`text-4xl md:text-4xl mb-6 ${gradientTextClass} text-balance`}
                >
                  {translateStatic("teamHeading")}
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                  {translateStatic("teamDescription")}
                </p>
                <div className="w-24 h-1.5 mx-auto rounded-full bg-linear-to-br from-[#367375] to-[#24C3BC] mt-6" />
              </div>

              {/* Staff Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffMembers
                  .slice(0, showAllStaff ? staffMembers.length : 8)
                  .map((member: any, index: number) => (
                    <Card
                      key={index}
                      className="group border-2 border-slate-200 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-muted border-2 border-emerald-200 shadow-md group-hover:border-emerald-400 transition-colors">
                            <Image
                              src={member.image || "/placeholder.svg"}
                              alt={member.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-foreground leading-tight mb-1.5">
                              {member.name}
                            </h3>
                            <p className="text-emerald-600 font-semibold text-sm">
                              {member.role}
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {member.bio}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedStaff(member)}
                            className="w-full mt-3 font-semibold text-transparent bg-clip-text bg-linear-to-br from-[#367375] to-[#24C3BC] 
             hover:text-[#367375] hover:bg-clip-text-none transition-all"
                          >
                            {translateStatic("readMore")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {/* Load More Button */}
              {staffMembers.length > 8 && (
                <div className="text-center mt-8">
                  <Button
                    size="lg"
                    onClick={() => setShowAllStaff(!showAllStaff)}
                    className="px-6 py-3 font-semibold text-white bg-linear-to-br from-[#367375] to-[#24C3BC]
             hover:from-[#2d5e62] hover:to-[#1fa6a1] shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {showAllStaff
                      ? translateStatic("showLess")
                      : translateStatic("loadMore")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <Dialog
        open={!!selectedMember}
        onOpenChange={() => setSelectedMember(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start gap-4 mb-4">
              <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-muted border-2 border-emerald-200 shadow-md">
                <Image
                  src={selectedMember?.image || "/placeholder.svg"}
                  alt={
                    selectedMember?.name || translateStatic("boardMemberAlt")
                  }
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                  {selectedMember?.name}
                </DialogTitle>
                <p className="text-emerald-600 font-semibold text-lg">
                  {selectedMember?.role}
                </p>
              </div>
            </div>
          </DialogHeader>
          <div className="px-6 pb-6">
            <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {selectedMember?.bio}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Biography Modal */}
      <Dialog
        open={!!selectedStaff}
        onOpenChange={() => setSelectedStaff(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start gap-4 mb-4">
              <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-muted border-2 border-emerald-200 shadow-md">
                <Image
                  src={selectedStaff?.image || "/placeholder.svg"}
                  alt={selectedStaff?.name || translateStatic("staffMemberAlt")}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                  {selectedStaff?.name}
                </DialogTitle>
                <p className="text-emerald-600 font-semibold text-lg">
                  {selectedStaff?.role}
                </p>
              </div>
            </div>
            <DialogDescription className="text-base text-muted-foreground leading-relaxed pt-4">
              {selectedStaff?.bio}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
