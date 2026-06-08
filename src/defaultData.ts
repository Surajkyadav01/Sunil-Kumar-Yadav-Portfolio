import { PortfolioData } from "./types";

export const initialPortfolioData: PortfolioData = {
  personalInfo: {
    name: "Sunil Kumar Yadav",
    title: "Frontend Developer | Tech Explorer | Online Services",
    location: "Bhadohi, India",
    expertise: "Frontend Developer",
    email: "ksurajyadav93@gmail.com",
    phone: "6393869405",
    profileImg: "https://image2url.com/r2/default/images/1772735325942-fe87fa88-c681-4c4a-8fe0-a07629e3f2ed.webp",
    aboutMe: "Hi, I’m Sunil Kumar Yadav, a BCA student and an aspiring tech professional with a strong interest in technology and digital creativity. I enjoy solving problems and learning new tools that help build useful and innovative solutions.\n\nI have knowledge of programming languages like C, C++, and basic web technologies including HTML, CSS, and JavaScript. I am also interested in Data Structures and continuously improving my coding and development skills.\n\nI am passionate about exploring new technologies, especially in the fields of design, editing, and Artificial Intelligence. I believe in continuous learning, teamwork, and building practical skills that can create real-world impact.\n\nI’m always open to learning opportunities and connecting with people who value innovation, growth, and technology."
  },
  socials: {
    github: "https://github.com/Surajkyadav01",
    globe: "https://surajkyadav01.github.io/Suraj-Tech-Hub/",
    linkedin: "https://www.linkedin.com/in/sunil-kumar-yadav-125ab6353",
    instagram: "https://www.instagram.com/its_.surajx01",
    facebook: "https://www.facebook.com/share/1KvrwSxLJE/",
    whatsapp: "916393869405"
  },
  skillCategories: [
    {
      title: "Programming Languages",
      items: [
        { name: "C", percentage: 70 },
        { name: "C++", percentage: 65 }
      ]
    },
    {
      title: "Web Technologies",
      items: [
        { name: "HTML", percentage: 90 },
        { name: "CSS", percentage: 85 },
        { name: "JavaScript", percentage: 70 },
        { name: "DSA", percentage: 60 }
      ]
    }
  ],
  tools: [
    {
      id: "git-1",
      name: "GitHub",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
    },
    {
      id: "git-2",
      name: "Git",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
    },
    {
      id: "vercel",
      name: "Vercel",
      logo: "https://cdn.simpleicons.org/vercel/000000"
    },
    {
      id: "firebase",
      name: "Firebase",
      logo: "https://i.imgur.com/gBTOVah.png"
    },
    {
      id: "canva",
      name: "Canva",
      logo: "https://i.imgur.com/yNFZx4A.png"
    }
  ],
  certificates: [
    "https://image2url.com/r2/default/images/1773668212514-4d8e51c5-e3e6-4c07-a6ab-c5723da33c9e.jpg",
    "https://image2url.com/r2/default/images/1773668240168-0d236bca-1621-42b2-be63-4a66790ea8ba.jpg",
    "https://image2url.com/r2/default/images/1773213025674-97428c2a-d54b-4288-a2ab-499673d1aaf0.jpg",
    "https://image2url.com/r2/default/images/1773213095375-dd08ce35-ecea-409c-b633-1812de5b53b9.png",
    "https://image2url.com/r2/default/images/1773213140599-42777cd8-f690-4e6a-afdd-bd61cb80cdd7.jpg",
    "https://image2url.com/r2/default/images/1773213173478-a65f18a9-6e28-41fe-89fd-052127ff3f48.jpg",
    "https://image2url.com/r2/default/images/1773572320625-a6f24c80-92cb-413b-800d-499187e76a36.jpg",
    "https://www.image2url.com/r2/default/images/1780899254296-1fbe2c6b-a1e3-47e1-a520-09fb0a3221a5.jpg",
    "https://image2url.com/r2/default/images/1775753469830-92028956-bec9-4148-bd38-cd56e4d211a9.jpg"
  ],
  projects: [
    {
      id: "proj-1",
      title: "FlipzoX Shop",
      link: "https://flipzox-shop.vercel.app",
      description: "Full e-commerce website built with modern UI and admin panel."
    },
    {
      id: "proj-2",
      title: "BeatX Music",
      link: "https://beatx-music.vercel.app",
      description: "Music player app with search and streaming features."
    },
    {
      id: "proj-3",
      title: "Man Vindhyavasini Engineering Works",
      link: "https://man-vindhyavasini-engineering-works.vercel.app",
      description: "Business website for engineering services."
    },
    {
      id: "proj-4",
      title: "Pizza Dine",
      link: "https://surajkyadav01.github.io/Pizza-Dine-/",
      description: "Restaurant website with menu and ordering UI."
    },
    {
      id: "proj-5",
      title: "Weather App",
      link: "https://surajkyadav01.github.io/Weather-App/",
      description: "Weather checking app using API and JavaScript."
    }
  ],
  hobbies: [
    "🎧 Listening to Music",
    "📸 Photography",
    "🎮 Gaming",
    "🏀 Sports & Fitness"
  ],
  resumeUrl: "https://drive.google.com/file/d/1ekBR641aH6WmBHsXE9pWqoBN_dTkZ_Oo/view?usp=drivesdk"
};
