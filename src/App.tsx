import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { 
  FileText, 
  Settings2, 
  Lock, 
  Unlock, 
  Trash2, 
  Plus, 
  RotateCcw, 
  Download, 
  Upload, 
  X, 
  Check, 
  ExternalLink,
  MapPin, 
  Briefcase, 
  Mail, 
  Phone,
  Eye,
  Info,
  Flame,
  GlobeIcon,
  Sparkles,
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Globe,
  MessageCircle,
  Send
} from "lucide-react";
import { PortfolioData, ProjectItem, SkillItem, ToolItem } from "./types";
import { initialPortfolioData } from "./defaultData";
import { ToolsAquarium } from "./components/ToolsAquarium";

export default function App() {
  // Theme State (sunny default)
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    return localStorage.getItem("portfolio_theme") === "light";
  });

  // Main Portfolio Data State
  const [data, setData] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem("sunil_portfolio_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse portfolio data, loading default", e);
      }
    }
    return initialPortfolioData;
  });

  // Active Certificate Modal State
  const [activeCertificate, setActiveCertificate] = useState<string | null>(null);

  // Visitor Counter State (replicates 1 to 100 looping from JS)
  const [visitorCount, setVisitorCount] = useState<number>(31); // start at a nice number

  // Control Center (Admin Console) States
  const [isAdminOpened, setIsAdminOpened] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("basic");

  // Lock passcode configuration in localStorage
  const [editorPin, setEditorPin] = useState<string>(() => {
    return localStorage.getItem("sunil_portfolio_pin") || "6393";
  });

  // Toast simple state for action notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Contact Form States
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  // Apply light-mode class to body depending on state
  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
      localStorage.setItem("portfolio_theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      localStorage.setItem("portfolio_theme", "dark");
    }
  }, [isLightMode]);

  // Visitor counter loop (increments every 2 seconds, resets at 100)
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount((prev) => {
        if (prev >= 100) {
          return 1;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Utility to show simple timeout notifications
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Save data to localStorage
  const handleSaveData = (updatedData: PortfolioData) => {
    setData(updatedData);
    localStorage.setItem("sunil_portfolio_data", JSON.stringify(updatedData));
    showToast("Portfolio details updated successfully!");
  };

  // Reset to original build template data
  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset your portfolio back to the original default information? (This will overwrite current local edits)")) {
      handleSaveData(initialPortfolioData);
      showToast("Reset to default successfully!");
    }
  };

  // Pin Unlock handler
  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    if (pinInput === editorPin) {
      setIsUnlocked(true);
      setPinError("");
      setPinInput("");
      showToast("Access Unlocked! Welcome, Sunil.");
    } else {
      setPinError("Invalid Security PIN. Please try again.");
    }
  };

  // Change PIN handler
  const handleChangePin = (newPin: string) => {
    if (newPin.trim() && newPin.length >= 4) {
      setEditorPin(newPin);
      localStorage.setItem("sunil_portfolio_pin", newPin);
      showToast("Security PIN updated successfully!");
    } else {
      showToast("PIN must be at least 4 characters long.");
    }
  };

  // Download settings file
  const handleDownloadBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `sunil_portfolio_backup_${new Date().toISOString().slice(0,10)}.json`);
    dlAnchorElem.click();
    showToast("Backup JSON file downloaded!");
  };

  // Standard backup upload triggers
  const handleUploadBackup = (e: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.personalInfo && parsed.socials) {
            handleSaveData(parsed);
            showToast("Backup restored successfully!");
          } else {
            showToast("Invalid config file structure.");
          }
        } catch (error) {
          showToast("Failed to parse backup file.");
        }
      };
    }
  };

  // Submit contact message directly to Whatsapp
  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactSubject || !contactMessage) {
      alert("Please fill all contact fields.");
      return;
    }

    let textMessage = "Hello Sunil,\n\n*New Portfolio Message* 🚀\n\n";
    textMessage += "*Name:* " + contactName + "\n";
    textMessage += "*Email:* " + contactEmail + "\n";
    textMessage += "*Subject:* " + contactSubject + "\n";
    textMessage += "*Message:* " + contactMessage;

    const encodedMessage = encodeURIComponent(textMessage);
    const whatsappURL = `https://wa.me/${data.socials.whatsapp}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
  };

  // Inline data structure helpers for easy state mutation:
  const updatePersonalInfo = (field: keyof typeof data.personalInfo, value: string) => {
    const updated = {
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    };
    handleSaveData(updated);
  };

  const updateSocialLinks = (field: keyof typeof data.socials, value: string) => {
    const updated = {
      ...data,
      socials: { ...data.socials, [field]: value }
    };
    handleSaveData(updated);
  };

  // Projects mutators
  const updateProject = (id: string, updatedProj: Partial<ProjectItem>) => {
    const updatedProjs = data.projects.map((proj) => {
      if (proj.id === id) {
        return { ...proj, ...updatedProj };
      }
      return proj;
    });
    handleSaveData({ ...data, projects: updatedProjs });
  };

  const addProject = () => {
    const newProj: ProjectItem = {
      id: "proj-" + Date.now(),
      title: "New Amazing Project",
      link: "https://example.com",
      description: "Short project summary and tech stack descriptor."
    };
    handleSaveData({ ...data, projects: [...data.projects, newProj] });
  };

  const deleteProject = (id: string) => {
    const filtered = data.projects.filter(proj => proj.id !== id);
    handleSaveData({ ...data, projects: filtered });
  };

  // Skills mutators
  const updateSkill = (categoryIndex: number, skillIndex: number, updatedItem: Partial<SkillItem>) => {
    const updatedCategories = [...data.skillCategories];
    const category = updatedCategories[categoryIndex];
    category.items[skillIndex] = { ...category.items[skillIndex], ...updatedItem };
    handleSaveData({ ...data, skillCategories: updatedCategories });
  };

  const addSkill = (categoryIndex: number) => {
    const updatedCategories = [...data.skillCategories];
    updatedCategories[categoryIndex].items.push({ name: "New Skill", percentage: 80 });
    handleSaveData({ ...data, skillCategories: updatedCategories });
  };

  const deleteSkill = (categoryIndex: number, skillIndex: number) => {
    const updatedCategories = [...data.skillCategories];
    updatedCategories[categoryIndex].items.splice(skillIndex, 1);
    handleSaveData({ ...data, skillCategories: updatedCategories });
  };

  // Aquarium Tools mutators
  const updateTool = (id: string, updatedItem: Partial<ToolItem>) => {
    const updatedTools = data.tools.map(tool => {
      if (tool.id === id) {
        return { ...tool, ...updatedItem };
      }
      return tool;
    });
    handleSaveData({ ...data, tools: updatedTools });
  };

  const addTool = () => {
    const newTool: ToolItem = {
      id: "tool-" + Date.now(),
      name: "New Tool",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
    };
    handleSaveData({ ...data, tools: [...data.tools, newTool] });
  };

  const deleteTool = (id: string) => {
    const filtered = data.tools.filter(t => t.id !== id);
    handleSaveData({ ...data, tools: filtered });
  };

  // Certificates mutators
  const updateCertificate = (index: number, value: string) => {
    const updatedCerts = [...data.certificates];
    updatedCerts[index] = value;
    handleSaveData({ ...data, certificates: updatedCerts });
  };

  const addCertificate = () => {
    const placeholderUrl = "https://image2url.com/r2/default/images/1773668212514-4d8e51c5-e3e6-4c07-a6ab-c5723da33c9e.jpg";
    handleSaveData({ ...data, certificates: [...data.certificates, placeholderUrl] });
  };

  const deleteCertificate = (index: number) => {
    const filtered = data.certificates.filter((_, idx) => idx !== index);
    handleSaveData({ ...data, certificates: filtered });
  };

  // Hobbies mutators
  const updateHobby = (index: number, value: string) => {
    const updatedHobbies = [...data.hobbies];
    updatedHobbies[index] = value;
    handleSaveData({ ...data, hobbies: updatedHobbies });
  };

  const addHobby = () => {
    handleSaveData({ ...data, hobbies: [...data.hobbies, "⚡ New Tech Hobby"] });
  };

  const deleteHobby = (index: number) => {
    const filtered = data.hobbies.filter((_, idx) => idx !== index);
    handleSaveData({ ...data, hobbies: filtered });
  };

  return (
    <div className={`min-h-screen text-white font-sans selection:bg-[#00aaff] selection:text-black overflow-hidden relative ${
      isLightMode ? "bg-gradient-to-tr from-[#f0f4f8] via-[#e2e8f0] to-[#cbd5e1]" : "bg-gradient-to-tr from-[#0f2027] via-[#152e39] to-[#203a43]"
    }`}>
      
      {/* Visual notification banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border-2 border-[#00aaff] text-white py-3 px-5 rounded-xl flex items-center gap-3 z-[9999] shadow-[0_0_20px_rgba(0,170,255,0.4)] animate-bounce">
          <Sparkles className="w-5 h-5 text-[#00ffaa]" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* STICKY HEADER */}
      <nav className={`navbar sticky top-0 left-0 right-0 flex justify-between items-center px-6 py-4 md:px-12 ${
        isLightMode ? "bg-slate-100/90 shadow-md text-slate-800" : "bg-zinc-950/95"
      } backdrop-blur-md z-[500] border-b ${isLightMode ? "border-slate-200" : "border-zinc-800"}`}>
        <div className="logo font-bold text-xl md:text-2xl tracking-wide flex items-center gap-2">
          <span className="text-[#00aaff]">&lt;</span>
          {data.personalInfo.name.split(" ")[0]}
          <span className="text-[#8b5cf6]">/&gt;</span>
        </div>

        {/* Desktop Menu links matching HTML */}
        <ul className="menu hidden md:flex items-center gap-8 font-medium">
          <li>
            <a href="#home" className={`hover:text-[#00aaff] transition-colors border-b-2 border-transparent hover:border-[#00aaff] pb-1`}>
              Home
            </a>
          </li>
          <li>
            <a href="#about" className={`hover:text-[#00aaff] transition-colors border-b-2 border-transparent hover:border-[#00aaff] pb-1`}>
              About
            </a>
          </li>
          <li>
            <a href="#skills" className={`hover:text-[#00aaff] transition-colors border-b-2 border-transparent hover:border-[#00aaff] pb-1`}>
              Skills
            </a>
          </li>
          <li>
            <a href="#certificates" className={`hover:text-[#00aaff] transition-colors border-b-2 border-transparent hover:border-[#00aaff] pb-1`}>
              Certificates
            </a>
          </li>
          <li>
            <a href="#projects" className={`hover:text-[#00aaff] transition-colors border-b-2 border-transparent hover:border-[#00aaff] pb-1`}>
              Projects
            </a>
          </li>
          <li>
            <a href="#contact" className={`hover:text-[#00aaff] transition-colors border-b-2 border-transparent hover:border-[#00aaff] pb-1`}>
              Contact
            </a>
          </li>
        </ul>

        {/* Dynamic Theme and Admin Switcher buttons */}
        <div className="flex items-center gap-3">
          {/* Change Info Admin overlay toggler button */}
          <button
            onClick={() => setIsAdminOpened(true)}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isUnlocked 
                ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" 
                : isLightMode 
                  ? "bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
            }`}
            title="Open Interactive Editor Panel"
          >
            {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-yellow-500" />}
            <span className="hidden sm:inline">Visual Editor</span>
          </button>

          {/* Theme switcher */}
          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className="theme text-2xl py-1 px-2.5 rounded-lg border border-transparent hover:border-sky-400/30 transition-all cursor-pointer"
            aria-label="Toggle Theme Mode"
          >
            {isLightMode ? "🌙" : "☀️"}
          </button>
        </div>
      </nav>

      {/* CORE HERO WRAPPER */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-16 md:px-8 space-y-24">
        
        {/* HERO SECTION */}
        <section id="home" className="home text-center pt-8 space-y-6">
          <div className="inline-block relative">
            <img 
              src={data.personalInfo.profileImg} 
              alt={data.personalInfo.name} 
              className="profile-img w-[170px] h-[170px] md:w-[190px] md:h-[190px] rounded-full object-cover border-4 border-[#00aaff] mx-auto profile-img-glow cursor-pointer shadow-lg hover:scale-105 transition-transform duration-300" 
              referrerPolicy="no-referrer"
            />
            {isUnlocked && (
              <div 
                onClick={() => setIsAdminOpened(true)}
                className="absolute bottom-2 right-2 bg-[#8b5cf6] text-white p-2.5 rounded-full shadow-lg border border-white cursor-pointer hover:bg-[#7c3aed] transition-colors"
                title="Change Image URL"
              >
                <Settings2 className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="space-y-2 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Hi, I'm <span className="text-[#00aaff] font-black">{data.personalInfo.name}</span>
            </h1>
            <p className="title text-lg md:text-xl font-medium opacity-80 max-w-3xl mx-auto uppercase tracking-wide text-[#b3b3b3] dark:text-[#cccccc] light-mode:text-slate-600">
              {data.personalInfo.title}
            </p>
          </div>

          {/* Highlight features cards */}
          <div className="info flex flex-wrap justify-center gap-6 mt-8">
            <div className="card glass-card rounded-2xl flex flex-col items-center justify-center p-6 text-center w-[260px]">
              <span className="text-2xl mb-1">📍</span>
              <b className="text-[#00aaff] font-bold text-sm uppercase tracking-wider block mb-1">Location</b>
              <p className="text-sm">{data.personalInfo.location}</p>
            </div>

            <div className="card glass-card rounded-2xl flex flex-col items-center justify-center p-6 text-center w-[260px]">
              <span className="text-2xl mb-1">💼</span>
              <b className="text-[#00aaff] font-bold text-sm uppercase tracking-wider block mb-1">Expertise</b>
              <p className="text-sm">{data.personalInfo.expertise}</p>
            </div>

            <div className="card glass-card rounded-2xl flex flex-col items-center justify-center p-6 text-center w-[260px]">
              <span className="text-2xl mb-1">📞</span>
              <b className="text-[#00aaff] font-bold text-sm uppercase tracking-wider block mb-1">Contact</b>
              <p className="text-xs sm:text-sm break-all font-medium select-all hover:text-sky-300">{data.personalInfo.email}</p>
            </div>
          </div>

          {/* Social connections bar */}
          <div className="social-links-div space-y-4">
            <h3 className="text-sm font-semibold tracking-widest text-[#00aaff] uppercase">Connect With Me</h3>
            <div className="social flex justify-center items-center gap-5 md:gap-7 flex-wrap">
              <a href={data.socials.github} target="_blank" rel="noreferrer" className="transition-all text-slate-700 hover:text-black dark:text-zinc-300 dark:hover:text-white hover:scale-125 hover:rotate-6 bg-slate-100 dark:bg-zinc-900/60 p-3 h-12 w-12 rounded-full border border-slate-300 dark:border-zinc-800 flex items-center justify-center shadow-lg" title="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href={data.socials.globe} target="_blank" rel="noreferrer" className="transition-all text-slate-700 hover:text-[#00aaff] dark:text-zinc-300 dark:hover:text-[#00aaff] hover:scale-125 -hover:rotate-6 bg-slate-100 dark:bg-zinc-900/60 p-3 h-12 w-12 rounded-full border border-slate-300 dark:border-zinc-800 flex items-center justify-center shadow-lg" title="Website Hub">
                <Globe className="w-5 h-5" />
              </a>
              <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="transition-all text-slate-700 hover:text-[#0077b5] dark:text-zinc-300 dark:hover:text-[#0077b5] hover:scale-125 hover:rotate-6 bg-slate-100 dark:bg-zinc-900/60 p-3 h-12 w-12 rounded-full border border-slate-300 dark:border-zinc-800 flex items-center justify-center shadow-lg" title="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={data.socials.instagram} target="_blank" rel="noreferrer" className="transition-all text-slate-700 hover:text-[#e1306c] dark:text-zinc-300 dark:hover:text-[#e1306c] hover:scale-125 -hover:rotate-6 bg-slate-100 dark:bg-zinc-900/60 p-3 h-12 w-12 rounded-full border border-slate-300 dark:border-zinc-800 flex items-center justify-center shadow-lg" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={data.socials.facebook} target="_blank" rel="noreferrer" className="transition-all text-slate-700 hover:text-[#1877f2] dark:text-zinc-300 dark:hover:text-[#1877f2] hover:scale-125 hover:rotate-6 bg-slate-100 dark:bg-zinc-900/60 p-3 h-12 w-12 rounded-full border border-slate-300 dark:border-zinc-800 flex items-center justify-center shadow-lg" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={`https://wa.me/${data.socials.whatsapp}`} target="_blank" rel="noreferrer" className="transition-all text-slate-700 hover:text-[#25D366] dark:text-zinc-300 dark:hover:text-[#25D366] hover:scale-125 -hover:rotate-6 bg-slate-100 dark:bg-zinc-900/60 p-3 h-12 w-12 rounded-full border border-slate-300 dark:border-zinc-800 flex items-center justify-center shadow-lg" title="WhatsApp Chat">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* ABOUT ME SECTION */}
        <section id="about" className="about scroll-mt-20">
          <div className="relative border-2 border-[#00aaff] p-8 md:p-12 rounded-2xl glass-card text-left max-w-3xl mx-auto shadow-xl">
            <h2 className="text-2xl md:text-3.5xl font-extrabold mb-6 tracking-wide relative inline-block text-white dark:text-white light-mode:text-slate-800">
              About Me
              <span className="absolute bottom-[-6px] left-0 w-full h-[3px] bg-[#00aaff] rounded"></span>
            </h2>
            <div className="space-y-5 text-sm md:text-base leading-relaxed text-slate-300 light-mode:text-slate-700 whitespace-pre-wrap">
              {data.personalInfo.aboutMe}
            </div>
          </div>
        </section>

        {/* MY SKILLS SECTION */}
        <section id="skills" className="skills scroll-mt-20 text-center space-y-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide inline-block relative text-shadow-md">
              My Skills
              <span className="absolute bottom-[-6px] left-0 w-full h-[3.5px] bg-[#00aaff] rounded"></span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            {data.skillCategories.map((category, catIdx) => (
              <div 
                key={catIdx} 
                className="skills-box border border-[#00e5ff] rounded-2xl p-6 md:p-8 bg-black/20 shadow-[0_0_15px_rgba(0,229,255,0.08)] light-mode:bg-white/45 light-mode:border-[#0088cc] flex flex-col justify-between"
              >
                <h3 className="category-title text-center text-[#00e5ff] font-bold text-lg md:text-xl tracking-wide mb-6 uppercase border-b border-[#00e5ff]/20 pb-3 light-mode:text-[#0088cc]">
                  {category.title}
                </h3>
                
                <div className="skill-bars space-y-5">
                  {category.items.map((skill, skillIdx) => (
                    <div key={skillIdx} className="bar">
                      <div className="flex justify-between items-center text-xs md:text-sm font-semibold mb-1 w-full text-slate-200 light-mode:text-slate-800">
                        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wide">
                          <Flame className="w-3.5 h-3.5 text-orange-400" />
                          {skill.name}
                        </span>
                        <span className="font-mono text-[#00e5ff] light-mode:text-sky-600">
                          {skill.percentage}%
                        </span>
                      </div>
                      
                      {/* Skill progress loop */}
                      <div className="progress bg-zinc-800/80 rounded-full h-3.5 overflow-hidden w-full relative">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.6)] transition-all duration-1000 ease-out"
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {category.items.length === 0 && (
                    <p className="text-center text-zinc-500 font-mono text-sm py-4">
                      No skills listed in this category yet.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Aquarium block of tools */}
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="category-title text-center text-[#00e5ff] dark:text-[#00e5ff] light-mode:text-[#0088cc] font-bold text-lg tracking-wide uppercase">
              Featured Tools & Frameworks
            </h3>
            <p className="text-xs md:text-sm text-slate-400 light-mode:text-slate-600 block max-w-sm mx-auto">
              Interactive bouncy aquarium! Hover or touch tool bubbles to scale them up.
            </p>
            <ToolsAquarium tools={data.tools} />
          </div>
        </section>

        {/* CERTIFICATES SECTION */}
        <section id="certificates" className="certificates scroll-mt-20 text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide inline-block relative text-shadow-md">
              Certificates
              <span className="absolute bottom-[-6px] left-0 w-full h-[3.5px] bg-[#00aaff] rounded"></span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400 light-mode:text-slate-600 block py-1">
              Click any certificate thumbnail below to view the high-resolution expanded image in full view.
            </p>
          </div>

          <div className="cert-container flex flex-wrap justify-center gap-6 p-4">
            {data.certificates.map((certUrl, idx) => (
              <div 
                key={idx}
                className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-zinc-800/80 hover:border-[#00aaff] transition-all max-w-[320px] w-full shadow-lg"
                onClick={() => setActiveCertificate(certUrl)}
              >
                <img 
                  src={certUrl} 
                  alt={`Award Certificate ${idx + 1}`} 
                  className="w-full h-[210px] object-cover max-w-full rounded-lg scale-100 group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white p-4">
                  <span className="flex items-center gap-2 text-sm uppercase tracking-wide font-black bg-cyan-700/80 py-2 px-4 rounded-lg shadow-lg">
                    <Eye className="w-4 h-4" /> Expand Certificate
                  </span>
                </div>
              </div>
            ))}
            {data.certificates.length === 0 && (
              <div className="text-zinc-500 font-mono text-sm py-8 w-full block text-center">
                No certificate uploads added to display yet.
              </div>
            )}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="projects scroll-mt-20 text-center space-y-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide inline-block relative text-shadow-md">
              My Projects
              <span className="absolute bottom-[-6px] left-0 w-full h-[3.5px] bg-[#00aaff] rounded"></span>
            </h2>
          </div>

          <div className="project-box flex flex-wrap justify-center gap-6 max-w-5xl mx-auto px-4">
            {data.projects.map((proj) => (
              <div 
                key={proj.id} 
                className="project bg-zinc-950/40 p-6 md:p-8 w-full sm:w-[270px] lg:w-[310px] rounded-2xl border border-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.15)] flex flex-col justify-between hover:scale-105 hover:shadow-[0_0_25px_#3b82f6] hover:-translate-y-2 transition-all duration-300 dark:bg-[#0d1420]/80 light-mode:bg-white light-mode:border-sky-400 light-mode:shadow-md h-[250px]"
              >
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between text-[#00aaff] gap-2">
                    <h3 className="font-extrabold text-base md:text-lg line-clamp-2 hover:underline">
                      <a href={proj.link} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                        {proj.title}
                        <ExternalLink className="w-3.5 h-3.5 inline min-w-3.5" />
                      </a>
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 light-mode:text-slate-600 line-clamp-4 leading-relaxed font-light">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-4 mt-auto flex justify-end">
                  <a 
                    href={proj.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs font-bold uppercase tracking-widest text-[#00aaff] py-1.5 px-3 border border-[#00aaff]/30 rounded-lg hover:bg-[#00aaff]/10 transition-colors"
                  >
                    Launch Live Demo
                  </a>
                </div>
              </div>
            ))}
            {data.projects.length === 0 && (
              <div className="text-zinc-500 font-mono text-sm py-12 block w-full text-center">
                No active projects listed yet. Open visual editor to add a project!
              </div>
            )}
          </div>
        </section>

        {/* HOBBIES SECTION */}
        <section className="hobbies text-center space-y-8 scroll-mt-20">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide inline-block relative text-shadow-md">
              Hobbies
              <span className="absolute bottom-[-6px] left-0 w-full h-[3.5px] bg-[#00aaff] rounded"></span>
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-xl mx-auto px-4">
            {data.hobbies.map((hobby, idx) => (
              <div 
                key={idx} 
                className="hobby inline-flex items-center gap-2 py-3 px-6 bg-[#020617]/50 rounded-full border border-sky-400/20 hover:scale-105 hover:shadow-[0_0_15px_#00aaff] shadow-lg cursor-pointer transition-all text-sm font-semibold text-slate-100 light-mode:bg-white light-mode:text-slate-800 light-mode:border-slate-300 light-mode:shadow-sm"
              >
                {hobby}
              </div>
            ))}
            {data.hobbies.length === 0 && (
              <div className="text-zinc-500 font-mono text-sm py-4 text-center">
                No hobbies recorded.
              </div>
            )}
          </div>
        </section>

        {/* MY RESUME SECTION */}
        <section className="resume-section text-center py-6">
          <div className="max-w-lg mx-auto space-y-6 bg-[#1e1b4b]/20 p-8 rounded-2xl border border-sky-500/20 glass-card">
            <h2 className="resume-heading text-2xl md:text-3xl font-extrabold text-indigo-200 leading-tight">
              My <span className="highlight uppercase font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Resume</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400 block max-w-sm mx-auto">
              Read through my detailed background history, education metrics and certifications record document.
            </p>
            <a 
              href={data.resumeUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="download-btn inline-flex items-center justify-center gap-2.5 py-3.5 px-8 rounded-xl font-bold tracking-wide text-white bg-indigo-600 cursor-pointer shadow-lg hover:shadow-indigo-500/50 hover:bg-indigo-700 active:scale-95 transition-all text-base border-none duration-150"
            >
              <FileText className="w-5 h-5 text-indigo-100" /> View / Download Resume
            </a>
          </div>
        </section>

        {/* CONTACT ME SECTION */}
        <section id="contact" className="contact scroll-mt-20 text-center space-y-10">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide inline-block relative text-shadow-md">
              Contact Me
              <span className="absolute bottom-[-6px] left-0 w-full h-[3.5px] bg-[#00aaff] rounded"></span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400 dark:text-zinc-400 light-mode:text-slate-600 block py-1">
              Have an opening opportunity, project discussion, or a feedback comment? Shoot a message!
            </p>
          </div>

          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
            <div className="space-y-6 glass-card p-6 md:p-8 rounded-2xl border border-zinc-800">
              <h3 className="font-bold text-lg text-[#00aaff] border-b border-zinc-800 pb-3 uppercase tracking-wide">
                Direct Contacts
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-sky-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs uppercase text-zinc-400 font-bold tracking-widest mb-0.5">Primary Email</h4>
                    <p className="text-sm md:text-base select-all tracking-wide font-mono break-all">{data.personalInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs uppercase text-zinc-400 font-bold tracking-widest mb-0.5">Mobile Phone</h4>
                    <p className="text-sm md:text-base select-all tracking-wide font-mono">{data.personalInfo.phone}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <a 
                  className="whatsapp-btn flex items-center justify-center gap-2 text-center bg-[#25D366] text-white py-3 px-5 rounded-xl font-bold cursor-pointer hover:bg-[#20ba5a] active:scale-95 transition-all text-sm shadow-md" 
                  href={`https://wa.me/${data.socials.whatsapp}`} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  <MessageCircle className="w-5 h-5" /> Fast Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* MESSAGE SUBMISSION FORM */}
            <div className="contact-form-container glass-card w-full border border-sky-400/20 max-w-full m-0 rounded-2xl p-6 md:p-8">
              <form className="contact-form space-y-4" onSubmit={handleContactSubmit}>
                <div className="input-group block space-y-1">
                  <label className="block text-xs uppercase font-extrabold tracking-widest text-[#00aaff] hover:opacity-100 opacity-90">Name</label>
                  <input 
                    type="text" 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your Full Name" 
                    className="w-full bg-zinc-950/80 border border-zinc-800 text-white rounded-xl py-3 px-4 outline-none focus:border-[#00aaff] transition-colors text-sm"
                    required 
                  />
                </div>
                
                <div className="input-group block space-y-1">
                  <label className="block text-xs uppercase font-extrabold tracking-widest text-[#00aaff] hover:opacity-100 opacity-90">Email</label>
                  <input 
                    type="email" 
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@email.com" 
                    className="w-full bg-zinc-950/80 border border-zinc-800 text-white rounded-xl py-3 px-4 outline-none focus:border-[#00aaff] transition-colors text-sm"
                    required 
                  />
                </div>
                
                <div className="input-group block space-y-1">
                  <label className="block text-xs uppercase font-extrabold tracking-widest text-[#00aaff] hover:opacity-100 opacity-90">Subject</label>
                  <input 
                    type="text" 
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="Project Discussion / Hello" 
                    className="w-full bg-zinc-950/80 border border-zinc-800 text-white rounded-xl py-3 px-4 outline-none focus:border-[#00aaff] transition-colors text-sm"
                    required 
                  />
                </div>
                
                <div className="input-group block space-y-1">
                  <label className="block text-xs uppercase font-extrabold tracking-widest text-[#00aaff] hover:opacity-100 opacity-90">Message</label>
                  <textarea 
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={4} 
                    placeholder="Describe your request..." 
                    className="w-full bg-zinc-950/80 border border-zinc-800 text-white rounded-xl py-3 px-4 outline-none focus:border-[#00aaff] transition-colors text-sm resize-none"
                    required 
                  />
                </div>
                
                <button type="submit" className="send-btn flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-500 to-indigo-500 py-3.5 px-6 rounded-full font-bold cursor-pointer hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] active:scale-95 transition-all text-sm border-none">
                  Send to WhatsApp <Send className="w-4 h-4 ml-1" />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* VISITOR COUNTER SECTION */}
        <section className="text-center pt-8">
          <div className="visitor-counter border border-[#00aaff]/40 bg-black/90 p-5 rounded-2xl display-inline-block transition-transform hover:scale-105 duration-300">
            <h2 className="text-coral-red font-bold uppercase tracking-wider block text-3xl">
              Visitors counter
            </h2>
            <p className="text-emerald-400 font-bold block text-4xl mt-2 font-mono">
              Visitors: <span id="visitorCount">{visitorCount}</span>
            </p>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className={`mt-20 py-8 px-6 text-center border-t ${
        isLightMode 
          ? "bg-slate-200 border-slate-300 text-slate-800" 
          : "bg-zinc-950 border-zinc-900 text-zinc-400"
      }`}>
        <p className="text-xs md:text-sm font-medium">
          © 2026 Sunil Kumar Yadav | All Rights Reserved.
        </p>
      </footer>

      {/* CERTIFICATE FULL ZOOM POPUP MODAL */}
      {activeCertificate && (
        <div 
          onClick={() => setActiveCertificate(null)}
          className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md cursor-pointer animate-fade-in"
        >
          <button 
            className="absolute top-6 right-6 text-white text-4xl font-light hover:text-[#00aaff] p-2 focus:outline-none"
            onClick={() => setActiveCertificate(null)}
          >
            &times;
          </button>
          <img 
            src={activeCertificate} 
            alt="Expanded Certificate View" 
            className="modal-content zoom-anim max-h-[85vh] max-w-full object-contain rounded-lg border-2 border-sky-400/60 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* INTERACTIVE ADMIN CONTROL OVERLAY PANEL */}
      {isAdminOpened && (
        <div className="fixed inset-0 z-[6000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 text-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl zoom-anim">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-[#00aaff]" />
                <h2 className="font-extrabold text-base md:text-lg tracking-wide uppercase">
                  Sunil's Portfolio Controller
                </h2>
              </div>
              <button 
                onClick={() => setIsAdminOpened(false)}
                className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                title="Close Panel"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* UNLOCKED VIEW VS LOCKED VIEW */}
            {!isUnlocked ? (
              <div className="p-8 space-y-6 text-center max-w-md mx-auto py-12">
                <div className="bg-yellow-500/10 p-5 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-yellow-500 border border-yellow-500/20">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Unlocking Content Editor</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                    Welcome Sunil! To dynamic-edit any content directly inside the layout (Profile Pic, Projects, Skills etc.) without coding, verify security PIN.
                  </p>
                </div>

                <form onSubmit={handleUnlock} className="space-y-4">
                  <div className="space-y-1 text-left">
                    <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Security PIN</label>
                    <input 
                      type="password" 
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="••••" 
                      className="w-full text-center tracking-widest bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 font-mono text-xl focus:border-[#00aaff] outline-none"
                      required
                    />
                    {pinError && <p className="text-xs text-rose-500 font-semibold pt-1">{pinError}</p>}
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl cursor-pointer hover:shadow-indigo-500/20 active:scale-95 duration-100 text-sm"
                  >
                    Authenticate PIN Access
                  </button>
                </form>
              </div>
            ) : (
              /* PANEL EDITABLE AREA */
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[50vh]">
                
                {/* Left Tabs bar */}
                <div className="w-full md:w-[220px] bg-zinc-900 border-r border-zinc-800 p-4 md:space-y-1.5 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 gap-1 md:gap-0">
                  {[
                    { id: "basic", label: "👤 Profile Details" },
                    { id: "socials", label: "🌐 Social Links" },
                    { id: "skills", label: "⚡ Skill Values" },
                    { id: "aquarium", label: "🐠 Tool Aquarium" },
                    { id: "projects", label: "📁 Projects Grid" },
                    { id: "certs-hobb", label: "🎓 Certificates, Resume & Hobbies" },
                    { id: "backup", label: "⚙️ System Configuration" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`text-left text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap md:w-full select-none ${
                        activeTab === tab.id
                          ? "bg-[#00aaff] text-black shadow-lg shadow-[#00aaff]/15"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Right Form Fields content */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-zinc-950">
                  
                  {/* TAB 1: PROFILE DETAILS */}
                  {activeTab === "basic" && (
                    <div className="space-y-5">
                      <div className="border-b border-zinc-800 pb-2">
                        <h3 className="font-extrabold text-base uppercase text-sky-400">Profile & Biography Info</h3>
                        <p className="text-xs text-zinc-400">Update hero presentation details, location banner metrics, or expertise titles.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-400 uppercase">Profile Name</label>
                            <input 
                              type="text" 
                              value={data.personalInfo.name} 
                              onChange={(e) => updatePersonalInfo("name", e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-3.5 text-sm font-medium focus:border-cyan-400 outline-none transition-colors"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-400 uppercase">Hero Status/Title</label>
                            <input 
                              type="text" 
                              value={data.personalInfo.title} 
                              onChange={(e) => updatePersonalInfo("title", e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-3.5 text-sm font-medium focus:border-cyan-400 outline-none transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-400 uppercase">Location Address</label>
                            <input 
                              type="text" 
                              value={data.personalInfo.location} 
                              onChange={(e) => updatePersonalInfo("location", e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-3.5 text-sm font-medium focus:border-cyan-400 outline-none transition-colors"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-400 uppercase">Expertise Tag</label>
                            <input 
                              type="text" 
                              value={data.personalInfo.expertise} 
                              onChange={(e) => updatePersonalInfo("expertise", e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-3.5 text-sm font-medium focus:border-cyan-400 outline-none transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-400 uppercase">Primary Email Address</label>
                            <input 
                              type="email" 
                              value={data.personalInfo.email} 
                              onChange={(e) => updatePersonalInfo("email", e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-3.5 text-sm font-semibold tracking-wide focus:border-cyan-400 outline-none transition-colors"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-400 uppercase">Phone Number</label>
                            <input 
                              type="text" 
                              value={data.personalInfo.phone} 
                              onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-3.5 text-sm font-semibold tracking-wide focus:border-cyan-400 outline-none transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-zinc-400 uppercase flex items-center justify-between">
                            <span>Profile Avatar URL</span>
                            <span className="text-[10px] text-zinc-500 font-mono italic">Needs live web address link</span>
                          </label>
                          <input 
                            type="text" 
                            value={data.personalInfo.profileImg} 
                            onChange={(e) => updatePersonalInfo("profileImg", e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-3.5 text-sm font-mono focus:border-cyan-400 outline-none transition-colors"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-zinc-400 uppercase">About Me Narrative</label>
                          <textarea 
                            rows={8}
                            value={data.personalInfo.aboutMe} 
                            onChange={(e) => updatePersonalInfo("aboutMe", e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-3.5 text-sm focus:border-cyan-400 outline-none transition-colors resize-y font-light leading-relaxed text-zinc-200"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: SOCIAL LINKS */}
                  {activeTab === "socials" && (
                    <div className="space-y-5">
                      <div className="border-b border-zinc-800 pb-2">
                        <h3 className="font-extrabold text-base uppercase text-sky-400">Social Connections Hub</h3>
                        <p className="text-xs text-zinc-400">Adjust references of instant messaging accounts or online repository channels.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-zinc-400 uppercase">GitHub Profile URL</label>
                          <input 
                            type="text" 
                            value={data.socials.github} 
                            onChange={(e) => updateSocialLinks("github", e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm font-mono focus:border-cyan-400 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-zinc-400 uppercase">Personal Website Hub / Portfolio Hub Link</label>
                          <input 
                            type="text" 
                            value={data.socials.globe} 
                            onChange={(e) => updateSocialLinks("globe", e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm font-mono focus:border-cyan-400 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-zinc-400 uppercase">LinkedIn Profile URL</label>
                          <input 
                            type="text" 
                            value={data.socials.linkedin} 
                            onChange={(e) => updateSocialLinks("linkedin", e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm font-mono focus:border-cyan-400 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-zinc-400 uppercase">Instagram Link</label>
                          <input 
                            type="text" 
                            value={data.socials.instagram} 
                            onChange={(e) => updateSocialLinks("instagram", e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm font-mono focus:border-cyan-400 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-zinc-400 uppercase">Facebook Share Link</label>
                          <input 
                            type="text" 
                            value={data.socials.facebook} 
                            onChange={(e) => updateSocialLinks("facebook", e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm font-mono focus:border-cyan-400 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-zinc-400 uppercase">WhatsApp Mobile Target</label>
                          <input 
                            type="text" 
                            value={data.socials.whatsapp} 
                            onChange={(e) => updateSocialLinks("whatsapp", e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm font-mono focus:border-cyan-400 outline-none"
                            placeholder="e.g. 916393869405"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: SKILL VALUES */}
                  {activeTab === "skills" && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-800 pb-2">
                        <h3 className="font-extrabold text-base uppercase text-sky-400">Programming & tech skill categories</h3>
                        <p className="text-xs text-zinc-400">Modify the individual items list, metric ratings or add new expertise attributes.</p>
                      </div>

                      <div className="space-y-6 text-left">
                        {data.skillCategories.map((category, catIdx) => (
                          <div key={catIdx} className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-4">
                            <h4 className="font-semibold text-sm text-[#00aaff] tracking-wider uppercase border-b border-zinc-800 pb-2 flex items-center justify-between">
                              <span>{category.title}</span>
                            </h4>

                            <div className="space-y-3">
                              {category.items.map((skill, skillIdx) => (
                                <div key={skillIdx} className="flex flex-wrap items-center gap-3.5 bg-black/40 p-2.5 rounded-lg border border-zinc-800/60">
                                  <div className="flex-1 min-w-[150px]">
                                    <input 
                                      type="text" 
                                      value={skill.name}
                                      onChange={(e) => updateSkill(catIdx, skillIdx, { name: e.target.value })}
                                      className="bg-zinc-900 text-xs py-1.5 px-2.5 border border-zinc-800 rounded w-full font-bold uppercase tracking-wider"
                                      placeholder="Skill Name"
                                    />
                                  </div>
                                  
                                  <div className="w-[110px] flex items-center gap-2">
                                    <input 
                                      type="number" 
                                      value={skill.percentage}
                                      min={10}
                                      max={100}
                                      onChange={(e) => updateSkill(catIdx, skillIdx, { percentage: parseInt(e.target.value) || 0 })}
                                      className="bg-zinc-900 text-xs py-1.5 px-2.5 border border-zinc-800 rounded font-mono text-center w-14"
                                    />
                                    <span className="text-xs font-mono text-zinc-500">%</span>
                                  </div>

                                  <button 
                                    onClick={() => deleteSkill(catIdx, skillIdx)}
                                    className="p-1 px-2 text-rose-400 hover:text-rose-600 font-bold hover:bg-rose-500/10 cursor-pointer rounded transition-all text-xs flex items-center gap-1 border border-zinc-800 hover:border-rose-500/20"
                                    title="Delete Skill"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={() => addSkill(catIdx)}
                              className="w-full flex items-center justify-center gap-1 py-1.5 px-3 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold transition-all text-sky-400 active:scale-95 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Skill Attribute Name
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: TOOL AQUARIUM */}
                  {activeTab === "aquarium" && (
                    <div className="space-y-5">
                      <div className="border-b border-zinc-800 pb-2">
                        <h3 className="font-extrabold text-base uppercase text-sky-400">Featured moving tools list</h3>
                        <p className="text-xs text-zinc-400">Manage the devicons bouncing around the physics tank! Image icons must be secure external url logos.</p>
                      </div>

                      <div className="space-y-3.5">
                        {data.tools.map((tool) => (
                          <div key={tool.id} className="flex flex-col sm:flex-row gap-3.5 items-start sm:items-center bg-zinc-900/40 p-4 rounded-xl border border-zinc-800">
                            <div className="flex items-center gap-3 w-full sm:w-[220px]">
                              <img src={tool.logo} alt={tool.name} className="w-10 h-10 object-contain p-1 rounded-full bg-white border border-[#00e5ff] shrink-0" referrerPolicy="no-referrer" />
                              <div className="flex-1">
                                <input 
                                  type="text" 
                                  value={tool.name} 
                                  onChange={(e) => updateTool(tool.id, { name: e.target.value })}
                                  className="w-full bg-zinc-900 border border-zinc-800 text-xs font-bold py-2 px-3 rounded-lg"
                                  placeholder="Tool Name"
                                />
                              </div>
                            </div>

                            <div className="flex-1 w-full">
                              <input 
                                type="text" 
                                value={tool.logo} 
                                onChange={(e) => updateTool(tool.id, { logo: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 py-2 px-3 font-mono rounded-lg"
                                placeholder="Image Icon URL"
                              />
                            </div>

                            <button 
                              onClick={() => deleteTool(tool.id)}
                              className="text-rose-400 hover:text-rose-600 bg-zinc-950 hover:bg-rose-500/10 p-2 rounded-lg cursor-pointer border border-zinc-800 hover:border-rose-500/20 shadow-md transition-colors"
                              title="Delete Tool Logo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        <button 
                          onClick={addTool}
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-[#00aaff] bg-zinc-900 hover:bg-zinc-800 border-2 border-dashed border-sky-400/20 hover:border-sky-400/40 cursor-pointer active:scale-95 duration-100"
                        >
                          <Plus className="w-4 h-4" /> Add Aquarium Tool bubble
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: PROJECTS GRID */}
                  {activeTab === "projects" && (
                    <div className="space-y-5">
                      <div className="border-b border-zinc-800 pb-2">
                        <h3 className="font-extrabold text-base uppercase text-sky-400">Edit Portfolio Projects</h3>
                        <p className="text-xs text-zinc-400">Update live links, titles, descriptions of deployed applications.</p>
                      </div>

                      <div className="space-y-4 text-left">
                        {data.projects.map((proj) => (
                          <div key={proj.id} className="bg-zinc-900/60 p-4 md:p-6 rounded-xl border border-zinc-800 space-y-4">
                            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 inline" /> {proj.title || "Project Record"}
                              </h4>
                              <button 
                                onClick={() => deleteProject(proj.id)}
                                className="text-rose-400 hover:text-rose-600 flex items-center gap-1 py-1 px-2.5 border border-zinc-800 bg-zinc-950 hover:bg-rose-500/10 cursor-pointer rounded-lg text-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove Project
                              </button>
                            </div>

                            <div className="space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">Project Name/Title</label>
                                  <input 
                                    type="text" 
                                    value={proj.title}
                                    onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-xs md:text-sm font-semibold"
                                    placeholder="Enter Project Title"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">Deployment/Live Demo URL</label>
                                  <input 
                                    type="text" 
                                    value={proj.link}
                                    onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-xs font-mono font-semibold"
                                    placeholder="https://your-site.vercel.app"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">Description / Summary text</label>
                                <textarea 
                                  rows={3}
                                  value={proj.description}
                                  onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-xs md:text-sm font-light text-zinc-300"
                                  placeholder="Bullet points or summary details describing key technology integrations."
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <button 
                          onClick={addProject}
                          className="w-full py-3 rounded-xl border-2 border-dashed border-sky-400/20 text-[#00aaff] bg-zinc-900 hover:bg-zinc-800 text-xs font-bold tracking-wider hover:border-sky-400/40 cursor-pointer active:scale-95 duration-150 flex items-center justify-center gap-1.5 uppercase"
                        >
                          <Plus className="w-4 h-4" /> Register New Project In Grid
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 6: CERTIFICATES, RESUME & HOBBIES */}
                  {activeTab === "certs-hobb" && (
                    <div className="space-y-6">
                      
                      {/* Certificates section */}
                      <div className="space-y-4">
                        <div className="border-b border-zinc-800 pb-2">
                          <h3 className="font-extrabold text-base uppercase text-sky-400">Award Certificate Images</h3>
                          <p className="text-xs text-zinc-400">Put secure image URLs that link directly to your educational credentials or awards files.</p>
                        </div>

                        <div className="space-y-3 text-left">
                          {data.certificates.map((certUrl, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 items-start sm:items-center">
                              <div className="shrink-0 flex items-center gap-2">
                                <img src={certUrl} alt="Award credential" className="w-[85px] h-[55px] object-cover rounded shadow-md border border-zinc-700 bg-zinc-950" referrerPolicy="no-referrer" />
                                <span className="font-mono text-zinc-500 text-xs">#{index + 1}</span>
                              </div>
                              <div className="flex-1 w-full">
                                <input 
                                  type="text" 
                                  value={certUrl}
                                  onChange={(e) => updateCertificate(index, e.target.value)}
                                  className="w-full bg-zinc-950 border border-zinc-800 py-1.5 px-3 rounded-lg text-xs font-mono text-zinc-300"
                                  placeholder="Certificate picture URL Link"
                                />
                              </div>
                              <button 
                                onClick={() => deleteCertificate(index)}
                                className="text-rose-400 hover:text-rose-600 bg-zinc-950 hover:bg-zinc-500/10 p-2 rounded-lg cursor-pointer border border-zinc-800 hover:border-rose-500/20"
                                title="Remove Certificate"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}

                          <button 
                            onClick={addCertificate}
                            className="w-full py-2 px-4 rounded-lg bg-zinc-90 w-full flex items-center justify-center gap-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-[#00aaff] font-bold tracking-wider active:scale-95 duration-100 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Certificate Record
                          </button>
                        </div>
                      </div>

                      {/* Resume section */}
                      <div className="space-y-4">
                        <div className="border-b border-zinc-800 pb-2">
                          <h3 className="font-extrabold text-base uppercase text-sky-400">Google Drive Resume URL</h3>
                          <p className="text-xs text-zinc-400">Configure file address path mapping to allow users to directly access/download PDF resume files.</p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-zinc-400 uppercase">Drive Link (Shared URL)</label>
                          <input 
                            type="text" 
                            value={data.resumeUrl} 
                            onChange={(e) => handleSaveData({ ...data, resumeUrl: e.target.value })}
                            className="w-full bg-zinc-900 border border-zinc-800 text-xs font-mono py-2.5 px-4 rounded-xl focus:border-cyan-400 outline-none"
                            placeholder="https://drive.google.com/file/d/..."
                          />
                        </div>
                      </div>

                      {/* Hobbies section */}
                      <div className="space-y-4">
                        <div className="border-b border-zinc-800 pb-2">
                          <h3 className="font-extrabold text-base uppercase text-sky-400">Leisure Hobbies Badges</h3>
                          <p className="text-xs text-zinc-400">Configure custom labels or emojis for the list of featured personal hobbies.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {data.hobbies.map((hobby, index) => (
                            <div key={index} className="flex gap-2 items-center bg-zinc-900/50 py-1.5 px-3 rounded-lg border border-zinc-800">
                              <input 
                                type="text"
                                value={hobby}
                                onChange={(e) => updateHobby(index, e.target.value)}
                                className="flex-1 bg-transparent border-none text-xs font-bold text-white outline-none"
                                placeholder="Emoji + Label Name"
                              />
                              <button 
                                onClick={() => deleteHobby(index)}
                                className="text-zinc-500 hover:text-rose-500 cursor-pointer p-1"
                                title="Remove Hobby"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <button 
                          onClick={addHobby}
                          className="w-full py-1.5 px-3 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-sky-400 active:scale-95 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 inline" /> Add Custom Hobby Item
                        </button>
                      </div>

                    </div>
                  )}

                  {/* TAB 7: BACKUP & RESTORE */}
                  {activeTab === "backup" && (
                    <div className="space-y-6 text-left">
                      <div className="border-b border-zinc-800 pb-2">
                        <h3 className="font-extrabold text-base uppercase text-sky-400">Maintenance & System Logs</h3>
                        <p className="text-xs text-zinc-400">Backup your whole settings config into a raw JSON file, restore previous backups, or reset the whole app state.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Download copy box */}
                        <div className="bg-zinc-900/60 p-5 rounded-xl border border-zinc-800 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <h4 className="font-bold text-sm flex items-center gap-1 text-[#00aaff]">
                              <Download className="w-4 h-4" /> Download Config File
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed font-light">
                              Save all customized items, links, projects, and images to a local file on your device.
                            </p>
                          </div>

                          <button 
                            onClick={handleDownloadBackup}
                            className="w-full flex items-center justify-center gap-1.5 bg-[#00aaff]/10 hover:bg-[#00aaff]/25 border border-[#00aaff] text-[#00aaff] py-2.5 px-4 font-bold text-xs rounded-xl cursor-pointer duration-100"
                          >
                            Download Backup JSON
                          </button>
                        </div>

                        {/* Import data box */}
                        <div className="bg-zinc-900/60 p-5 rounded-xl border border-zinc-800 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <h4 className="font-bold text-sm flex items-center gap-1 text-[#00ffaa]">
                              <Upload className="w-4 h-4" /> Restore JSON Configuration
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed font-light">
                              Upload a previous backup copy to restore all saved fields, portfolio images, and custom details instantly.
                            </p>
                          </div>

                          <div className="relative pt-1">
                            <input 
                              type="file" 
                              accept=".json"
                              onChange={handleUploadBackup}
                              className="hidden" 
                              id="restore-file-input"
                            />
                            <label 
                              htmlFor="restore-file-input"
                              className="w-full flex items-center justify-center gap-1.5 bg-[#00ffaa]/10 hover:bg-[#00ffaa]/25 border border-[#00ffaa] text-[#00ffaa] py-2.5 px-4 font-bold text-xs rounded-xl cursor-pointer duration-100 text-center"
                            >
                              Choose Backup File (.json)
                            </label>
                          </div>
                        </div>

                      </div>

                      {/* Password PIN custom configuration */}
                      <div className="bg-zinc-900/60 p-5 rounded-xl border border-zinc-800 space-y-4">
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-sm flex items-center gap-1 text-yellow-500">
                            <Lock className="w-4 h-4" /> Custom Access Password PIN
                          </h4>
                          <p className="text-xs text-zinc-400 leading-relaxed font-light">
                            Change the authentication security passcode (currently: <span className="font-mono font-extrabold text-[#00aaff] bg-sky-950/40 px-1 py-0.5 rounded select-all">{editorPin}</span>) to secure your visual settings mode.
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <input 
                            type="password"
                            placeholder="Enter New PIN Code"
                            id="newPinField"
                            className="bg-zinc-950 font-mono tracking-widest text-sm py-2 px-4 rounded-xl border border-zinc-800 focus:border-yellow-400 outline-none w-[170px]"
                          />
                          <button
                            onClick={() => {
                              const inputEl = document.getElementById("newPinField") as HTMLInputElement;
                              if (inputEl) {
                                handleChangePin(inputEl.value);
                                inputEl.value = "";
                              }
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold text-xs tracking-wider uppercase py-2 px-4 rounded-xl cursor-pointer"
                          >
                            Update PIN
                          </button>
                        </div>
                      </div>

                      {/* Reset back to vanilla layout data */}
                      <div className="bg-rose-950/15 p-5 rounded-xl border border-rose-500/20 space-y-3.5">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-rose-400 flex items-center gap-1.5">
                            <RotateCcw className="w-4 h-4" /> Factory Reset Portfolio
                          </h4>
                          <p className="text-xs text-zinc-400 leading-relaxed font-light">
                            Restore defaults. This will permanently clear all your custom changes in LocalStorage and re-install the default info Sunil Yadav initially supplied.
                          </p>
                        </div>

                        <button 
                          onClick={handleResetToDefaults}
                          className="flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500 text-rose-400 py-2 px-3.5 text-xs font-bold rounded-lg cursor-pointer duration-100"
                        >
                          Reset to Initial Portfolio Layout
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Panel footer bar controls */}
            <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900">
              <div className="text-[11px] font-mono text-zinc-500">
                Secured Workspace Session • Rev. 2026
              </div>

              {isUnlocked && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setIsUnlocked(false);
                      showToast("Session Locked.");
                    }}
                    className="flex items-center gap-1 text-xs py-1.5 px-3 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 cursor-pointer"
                    title="Lock Control Centre session"
                  >
                    <Lock className="w-3.5 h-3.5" /> Padlock Editor
                  </button>
                  <button 
                    onClick={() => setIsAdminOpened(false)}
                    className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/10 transition-shadow text-white cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Save & Exit Panel
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
