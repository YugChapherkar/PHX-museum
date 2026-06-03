import { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  Bone,
  Dna,
  Gem,
  Leaf,
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  CalendarDays,
  Gauge,
  Cpu,
  Fingerprint,
  Layers,
  Thermometer,
  Atom,
  Timer,
  Maximize2
} from "lucide-react";
import { chaptersData } from "./data/chapters";
import { SandTransitionImage } from "./components/SandTransitionImage";

// Import integrated features and data sets
import { specimensData, Specimen } from "./data/specimens";
import { SpecimenDrawer } from "./components/SpecimenDrawer";
import { TicketDrawer } from "./components/TicketDrawer";
import { CollectionExplorer } from "./components/CollectionExplorer";
import { AtmosphericSynth } from "./utils/audioSynth";
import { GEOLOGICAL_EPOCHS, SPECIMEN_DIAGNOSTIC_NODES, SpecimenNode } from "./data/epochs";

export default function App() {
  const [showVideo, setShowVideo] = useState(false);
  const [activeChapter, setActiveChapter] = useState(2); // starts at "Reptiles of the Mesozoic"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core modal & drawer states
  const [isTicketDrawerOpen, setIsTicketDrawerOpen] = useState(false);
  const [isCollectionExplorerOpen, setIsCollectionExplorerOpen] = useState(false);
  const [selectedExplorerCategory, setSelectedExplorerCategory] = useState<string>("Dinosaurs");
  const [selectedSpecimen, setSelectedSpecimen] = useState<Specimen | null>(null);
  const [isSpecimenDrawerOpen, setIsSpecimenDrawerOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Redesign: Interactive Geo Epochs States
  const [activeEpochIdx, setActiveEpochIdx] = useState(4); // Default to Mesozoic

  // Redesign: Interactive Spectrometer Workstation States
  const [activeSpecimenId, setActiveSpecimenId] = useState<string>("trex");
  const [selectedDiagNode, setSelectedDiagNode] = useState<SpecimenNode>(SPECIMEN_DIAGNOSTIC_NODES.trex[0]);
  const [c14Ratio, setC14Ratio] = useState<number>(3.5);
  const [fluorineRatio, setFluorineRatio] = useState<number>(0.65);
  const [strontiumRatio, setStrontiumRatio] = useState<number>(0.708);

  // Animated Oscilloscope state for synthesizers
  const [waveOffset, setWaveOffset] = useState<number[]>([0, 0, 0]);
  const [londonTime, setLondonTime] = useState<string>("");

  const autoCycleRef = useRef<NodeJS.Timeout | null>(null);
  const synthRef = useRef<AtmosphericSynth | null>(null);

  // Active ticking London coordinate clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
      setLondonTime(formatted);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set up background video delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Sync diagnostic node when active specimen changes
  useEffect(() => {
    const defaultNode = SPECIMEN_DIAGNOSTIC_NODES[activeSpecimenId]?.[0];
    if (defaultNode) {
      setSelectedDiagNode(defaultNode);
    }
  }, [activeSpecimenId]);

  // Set up auto cycling of chapters every 4000ms
  useEffect(() => {
    const startTimer = () => {
      autoCycleRef.current = setInterval(() => {
        setActiveChapter((prev) => (prev + 1) % 5);
      }, 4000);
    };

    startTimer();

    return () => {
      if (autoCycleRef.current) {
        clearInterval(autoCycleRef.current);
      }
    };
  }, []);

  // Seismic resonance waveform simulation mapped to genuine Web Audio Analyser peaks
  useEffect(() => {
    if (!isAudioPlaying) {
      setWaveOffset([0, 0, 0]);
      return;
    }
    let animId: number;
    const updateWave = () => {
      const analyser = synthRef.current?.getAnalyser();
      if (analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        // Map real amplitude shifts to the oscillogram paths
        const v0 = (dataArray[Math.floor(bufferLength * 0.1)] - 128) * 0.45;
        const v1 = (dataArray[Math.floor(bufferLength * 0.45)] - 128) * 0.45;
        const v2 = (dataArray[Math.floor(bufferLength * 0.8)] - 128) * 0.45;
        setWaveOffset([v0, v1, v2]);
      } else {
        const elapsed = Date.now() / 120;
        setWaveOffset([
          Math.sin(elapsed) * 14,
          Math.cos(elapsed * 1.6) * 11,
          Math.sin(elapsed * 0.8) * 18
        ]);
      }
      animId = requestAnimationFrame(updateWave);
    };
    animId = requestAnimationFrame(updateWave);
    return () => cancelAnimationFrame(animId);
  }, [isAudioPlaying]);

  // Handler for custom chapter selection (resets the interval loop)
  const handleSelectChapter = (idx: number) => {
    setActiveChapter(idx);
    if (autoCycleRef.current) {
      clearInterval(autoCycleRef.current);
    }
    autoCycleRef.current = setInterval(() => {
      setActiveChapter((prev) => (prev + 1) % 5);
    }, 4000);
  };

  // Toggle Atmospheric Procedural Synth Audio
  const toggleAtmosphericAudio = () => {
    if (!synthRef.current) {
      synthRef.current = new AtmosphericSynth();
    }

    if (isAudioPlaying) {
      synthRef.current.stop();
      setIsAudioPlaying(false);
    } else {
      synthRef.current.start();
      setIsAudioPlaying(true);
    }
  };

  // Trigger explorer selection category
  const handlePillClick = (categoryLabel: string) => {
    setSelectedExplorerCategory(categoryLabel);
    setIsCollectionExplorerOpen(true);
  };

  // Trigger details drawer on selected specimen
  const handleSpecimenSelectedInExplorer = (specimen: Specimen) => {
    setSelectedSpecimen(specimen);
    setIsSpecimenDrawerOpen(true);
  };

  // View specific specimen details directly of the primary active specimen
  const handleOpenSpecimenDetails = (id: string) => {
    const spec = specimensData.find((s) => s.id === id) || specimensData[0];
    setSelectedSpecimen(spec);
    setIsSpecimenDrawerOpen(true);
  };

  // Calculated molecular dating and radiological estimates on-the-fly
  const datingCalculations = useMemo(() => {
    const c14HalfLives = c14Ratio; // 0 to 10
    const remainingC14 = Math.pow(0.5, c14HalfLives);
    const scaleBase = activeSpecimenId === "fluorite" ? 310 : activeSpecimenId === "ammonite" ? 110 : 150;
    
    // Procedural mineral absorption age
    const rawAge = (1 - remainingC14) * scaleBase * 1.5 + (fluorineRatio * 40) + ((strontiumRatio - 0.701) * 3500);
    const finalAge = Math.max(0.1, Math.round(rawAge * 10) / 10);

    // Geological boundary classification
    let epochLabel = "Holocene Epoch / Quaternary";
    if (finalAge > 300) epochLabel = "Carboniferous Period";
    else if (finalAge > 251) epochLabel = "Permian / Paleozoic Era";
    else if (finalAge > 145) epochLabel = "Late Cretaceous / Mesozoic Era";
    else if (finalAge > 66) epochLabel = "Jurassic Period";
    else if (finalAge > 2.5) epochLabel = "Neogene Period / Cenozoic";

    // Mineral density index calculation
    const molecularDensityValue = Math.min(100, Math.max(12, Math.round(100 - (c14Ratio * 4.5) + (fluorineRatio * 25))));

    return {
      estimatedAge: finalAge,
      epochLabel,
      density: molecularDensityValue,
      preservationRatio: Math.round(remainingC14 * 100)
    };
  }, [activeSpecimenId, c14Ratio, fluorineRatio, strontiumRatio]);

  // Framer Motion shared variants
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const letterBlock = {
    initial: { y: 120, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const logoContainerVariants = {
    initial: { scale: 1.03 },
    animate: {
      scale: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const sidebarContainerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.6
      }
    }
  };

  const sidebarItemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const rightSidebarContainerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.9
      }
    }
  };

  const rightSidebarItemVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const pillsContainerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const pillVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const pillsData = [
    { icon: Bone, label: "Dinosaurs" },
    { icon: Dna, label: "Ancient Life" },
    { icon: Gem, label: "Minerals" },
    { icon: Leaf, label: "Fossils" },
    { icon: BookOpen, label: "Learn More" }
  ];

  const currentSpecimenDetail = specimensData.find((s) => s.id === activeSpecimenId) || specimensData[0];

  const c14Pct = (c14Ratio / 10) * 100;
  const fluorinePct = fluorineRatio * 100;
  const strontiumPct = ((strontiumRatio - 0.701) / (0.715 - 0.701)) * 100;

  return (
    <div className="relative w-full min-h-screen bg-[#fcfcfc] text-[#111] overflow-x-hidden font-sans selection:bg-black selection:text-white pb-10">
      
      {/* HUD HEADER TELEMETRY STRIP */}
      <div className="w-full bg-[#111] text-[#fff] text-[9px] font-mono tracking-[0.2em] uppercase px-6 md:px-16 py-2.5 flex justify-between items-center z-55 relative border-b border-white/[0.08] select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          <span className="text-gray-300 font-semibold">CORE ARCHIVE: ONLINE</span>
        </div>
        <div className="hidden md:flex gap-6 text-gray-400">
          <span>COORDINATES: <span className="text-white font-semibold">51.4967° N, 0.1764° W</span></span>
          <span>LONDON TIME: <span className="text-white font-semibold">{londonTime || "11:59:00"}</span></span>
          <span>RESONANCE: <span className="text-white font-semibold">{isAudioPlaying ? "55HZ SYST ACTIVE" : "STANDBY"}</span></span>
        </div>
        <div className="font-semibold text-white">
          <span>PHX_ARCHIVES_V2.6</span>
        </div>
      </div>

      {/* SECTION 1: HERO */}
      <section className="relative w-full min-h-screen flex flex-col overflow-hidden justify-between border-b border-gray-150 bg-[#fcfcfc] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
        
        {/* Background Video */}
        <AnimatePresence>
          {showVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.12 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                src="https://res.cloudinary.com/dsdxaxkiz/video/upload/v1779624998/magnific_use-img-2-as-the-exact-ba_Piu3X0W42C_wnrc8f.mp4"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER & SUB-NAV BAR */}
        <div className="relative w-full z-20">
          <motion.header
            initial="initial"
            animate="animate"
            className="pt-6 px-6 md:px-16"
          >
            {/* SVG Logo */}
            <motion.h1 variants={logoContainerVariants} className="w-full">
              <svg viewBox="0 0 840 100" className="w-full h-auto fill-[#111]" aria-label="PHX Museum">
                {/* Letter P */}
                <g transform="translate(0, 0)">
                  <motion.polygon points="0,0 14,0 14,100 0,100" variants={letterBlock} />
                  <motion.polygon points="14,0 214,0 214,14 14,14" variants={letterBlock} />
                  <motion.polygon points="200,0 214,0 214,57 200,57" variants={letterBlock} />
                  <motion.polygon points="14,43 214,43 214,57 14,57" variants={letterBlock} />
                </g>
                {/* Letter H */}
                <g transform="translate(280, 0)">
                  <motion.polygon points="0,0 14,0 14,100 0,100" variants={letterBlock} />
                  <motion.polygon points="200,0 214,0 214,100 200,100" variants={letterBlock} />
                  <motion.polygon points="14,43 200,43 200,57 14,57" variants={letterBlock} />
                </g>
                {/* Letter X */}
                <g transform="translate(560, 0)">
                  <motion.polygon points="0,0 33,0 214,100 181,100" variants={letterBlock} />
                  <motion.polygon points="181,0 214,0 33,100 0,100" variants={letterBlock} />
                </g>
              </svg>
            </motion.h1>

            {/* SUB-NAV BAR */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex justify-between items-start mt-8 text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase"
            >
              <div className="w-[40%] md:w-[15%] flex flex-col font-mono text-gray-800 leading-normal">
                <div>PHX</div>
                <div>Museum</div>
              </div>

              <div className="hidden md:flex w-[5%] justify-center pt-1 text-gray-400">
                <ArrowRight size={14} strokeWidth={1} />
              </div>

              <div className="flex-1 md:flex-initial md:w-[30%] text-gray-800 leading-relaxed font-mono">
                Exploring the story of life <br className="block md:hidden" />
                on earth through <br className="hidden md:block" />
                science, discovery <br className="block md:hidden" />
                and wonder.
              </div>

              <div className="hidden md:flex w-[5%] justify-center pt-1 text-gray-400">
                <ArrowRight size={14} strokeWidth={1} />
              </div>

              <div className="hidden md:flex flex-col w-[15%] space-y-1.5 text-gray-850">
                <button
                  onClick={() => setIsTicketDrawerOpen(true)}
                  className="hover:text-black hover:underline transition-colors lowercase font-mono text-left cursor-pointer flex items-center gap-1.5 font-bold text-gray-950"
                >
                  <CalendarDays size={11} /> book tickets
                </button>
                <button
                  onClick={() => handlePillClick("Dinosaurs")}
                  className="hover:text-black hover:underline transition-colors lowercase font-mono text-left cursor-pointer"
                >
                  view archives
                </button>
                <a href="#deep-time" className="hover:text-black hover:underline transition-colors lowercase font-mono">deep-time</a>
                <a href="#spectrometer" className="hover:text-black hover:underline transition-colors lowercase font-mono">spectrometer</a>
                <a href="#stories" className="hover:text-black hover:underline transition-colors lowercase font-mono">stories</a>
              </div>

              {/* Hamburger menu */}
              <div className="flex justify-end z-60 relative pl-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex flex-col justify-center items-end gap-[6px] h-10 w-10 focus:outline-none group cursor-pointer"
                  aria-label="Toggle Menu"
                >
                  <div
                    className={`h-[1.5px] bg-black transition-all duration-300 ${
                      isMobileMenuOpen 
                        ? "w-8 rotate-45 translate-y-[3.75px]" 
                        : "w-8 group-hover:w-6"
                    }`}
                  />
                  <div
                    className={`h-[1.5px] bg-black transition-all duration-300 ${
                      isMobileMenuOpen 
                        ? "w-8 -rotate-45 -translate-y-[3.75px]" 
                        : "w-8 group-hover:w-10"
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          </motion.header>

          {/* MOBILE MENU OVERLAY */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-28 left-0 w-full bg-[#fcfcfc] border-b border-gray-200 shadow-xl z-50 md:hidden py-10 px-8 flex flex-col space-y-6 text-sm font-mono tracking-[0.15em] uppercase"
              >
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsTicketDrawerOpen(true);
                  }}
                  className="text-gray-950 font-bold hover:text-black border-b border-gray-100 pb-2 text-left cursor-pointer flex items-center justify-between"
                >
                  <span>Book Passes Online</span>
                  <Sparkles size={14} />
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handlePillClick("Dinosaurs");
                  }}
                  className="text-gray-800 hover:text-black border-b border-gray-100 pb-2 text-left cursor-pointer"
                >
                  Explore Archives
                </button>
                <a href="#deep-time" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 hover:text-black border-b border-gray-100 pb-2">Geological Eras</a>
                <a href="#spectrometer" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 hover:text-black border-b border-gray-100 pb-2">Diagnostic Scan</a>
                <a href="#stories" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 hover:text-black">Prehistoric Chapters</a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* HERO TITLE BLOCK */}
        <div className="w-full flex-grow flex items-center relative py-12">
          
          <motion.div
            variants={sidebarContainerVariants}
            initial="initial"
            animate="animate"
            className="px-6 md:px-16 mt-4 w-full max-w-[480px] z-10 flex flex-col items-start"
          >
            <motion.div variants={sidebarItemVariants} className="flex items-center gap-4 text-xs font-mono text-gray-500">
              <span className="font-bold">SECTION 1.0</span>
              <span className="w-16 h-[1.5px] bg-black/20" />
            </motion.div>

            <motion.h2 
              variants={sidebarItemVariants} 
              className="text-[3.8rem] md:text-[5.4rem] font-normal tracking-tight leading-[1] mt-6 text-[#111]"
            >
              TIMELESS<br />WONDERS
            </motion.h2>

            <motion.p variants={sidebarItemVariants} className="text-[13px] md:text-[14px] text-gray-700 w-[260px] leading-[1.60] mt-6 font-sans">
              Enter the cavernous archives and <br />
              unearth the carbon-carved blueprints <br />
              of ancient Earth history.
            </motion.p>

            <motion.div variants={sidebarItemVariants} className="w-full max-w-[260px] mt-8 flex flex-col gap-3">
              <button
                onClick={() => handlePillClick("Dinosaurs")}
                className="bg-[#111] px-6 py-4 border border-[#111] rounded-md shadow-sm relative overflow-hidden group cursor-pointer flex items-center justify-between w-full hover:-translate-y-[0.5px] hover:shadow-[4px_4px_0px_rgba(17,17,17,0.3)] active:translate-y-0 active:shadow-sm transition-all duration-300"
              >
                <div className="absolute inset-0 bg-[#fcfcfc] -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
                
                <span className="text-[13px] font-mono tracking-widest uppercase font-semibold text-white group-hover:text-[#111] transition-colors duration-500 z-10 relative">
                  SYSTEM SEARCH
                </span>

                <div className="z-10 relative text-white group-hover:text-[#111] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
                  <Plus size={16} />
                </div>
              </button>
            </motion.div>
          </motion.div>

          {/* DYNAMIC PRIMARY ASSET PLATFORM (RIGHT SIDEBAR) */}
          <motion.div
            variants={rightSidebarContainerVariants}
            initial="initial"
            animate="animate"
            className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col space-y-8 z-10 w-[240px] border border-gray-250 p-6 bg-white/40 backdrop-blur-md rounded-xl"
          >
            <motion.div variants={rightSidebarItemVariants} className="space-y-2 border-b border-gray-150 pb-4">
              <span className="text-[9px] font-mono tracking-widest text-gray-400 block uppercase">[ PRIMARY CURATION ]</span>
              <h3 className="text-sm font-semibold tracking-tight text-gray-950 uppercase font-mono">
                Tyrannosaurus Rex
              </h3>
              <p className="text-[11px] text-gray-600 leading-normal font-sans">
                Preserved late Cretaceous theropod core recovered from Hell Creek.
              </p>
            </motion.div>

            <motion.div variants={rightSidebarItemVariants} className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-[8px] font-mono tracking-widest uppercase text-gray-400">EPOCH AGE:</div>
                <div className="text-[11px] font-mono font-bold text-gray-900 mt-0.5">68-66 M.Y.A.</div>
              </div>
              <div>
                <div className="text-[8px] font-mono tracking-widest uppercase text-gray-400">STRUCTURE:</div>
                <div className="text-[11px] font-mono font-bold text-gray-900 mt-0.5">Theropoda</div>
              </div>
            </motion.div>

            <motion.div variants={rightSidebarItemVariants} className="pt-2">
              <button
                onClick={() => handleOpenSpecimenDetails("trex")}
                className="w-full py-2.5 bg-gray-100 hover:bg-black hover:text-white rounded text-[10px] font-mono uppercase tracking-widest font-semibold transition-all duration-300 border border-gray-300 hover:border-black flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>OPEN LOG DOSSIER</span>
                <ArrowUpRight size={12} />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* HERO FOOTER: SEISMIC CAVE RESONANCE CONTROL PANEL */}
        <div className="relative border-t border-gray-150 px-6 md:px-16 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10 select-none bg-white/20 backdrop-blur-xs">
          
          <div className="flex items-center gap-4 cursor-pointer" onClick={toggleAtmosphericAudio}>
            <div className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 ${isAudioPlaying ? "border-black bg-black text-white" : "border-gray-300 bg-white hover:border-black"}`}>
              {isAudioPlaying ? <Volume2 size={15} /> : <VolumeX size={15} className="text-gray-450" />}
            </div>
            <div>
              <span className="text-[9px] font-mono tracking-widest uppercase text-gray-400 block font-bold">ATMOSPHERIC REVERB SYNTH</span>
              <span className="text-[11px] font-mono text-gray-800 hover:text-black transition-colors font-medium">
                {isAudioPlaying ? "Seismic drone activated (55Hz)" : "Click to initialize world drone soundscape"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">SEISMIC OSCILLOGRAM:</span>
            <div className="w-48 h-8 rounded border border-gray-200 bg-white/40 flex items-center justify-center overflow-hidden px-2 relative" title="Cave Reverberation Wave Vector">
              <svg className="w-full h-full stroke-black fill-none" viewBox="0 0 200 40">
                <path d={`M 0,20 Q 50,${20 + waveOffset[0]} 100,20 T 200,20`} strokeWidth="1" opacity={isAudioPlaying ? "0.3" : "0.1"} />
                <path d={`M 0,20 Q 40,${20 + waveOffset[1]} 120,20 T 200,20`} strokeWidth="1.5" opacity={isAudioPlaying ? "0.6" : "0.1"} />
                <path d={`M 0,20 Q 60,${20 + waveOffset[2]} 140,20 T 200,20`} strokeWidth="0.8" opacity={isAudioPlaying ? "0.8" : "0.15"} />
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* NEW UNIQUE SECTION: REDESIGNED GEOLOGICAL EPOCHS EXPANDED TIMELINE */}
      <section id="deep-time" className="relative w-full py-24 md:py-32 bg-white border-b border-gray-150">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="space-y-3">
              <div className="text-[11px] font-mono tracking-[0.2em] font-bold text-gray-500">
                [ 02 // EARTH TIMELINE ]
              </div>
              <h2 className="text-3xl md:text-5xl font-normal tracking-tight">Geological Deep-Time Scale</h2>
              <p className="text-xs text-gray-600 max-w-md font-sans leading-relaxed">
                Earth's history is structured into massive chronological segments. Click different aeons to calibrate environmental tracking telemetry of the ancestral planets.
              </p>
            </div>

            <div className="flex gap-2">
              <span className="bg-[#111] text-white text-[9px] font-mono uppercase font-bold tracking-widest px-3.5 py-1.5 rounded-sm">
                SYSTEM CALIBRATION
              </span>
            </div>
          </div>

          {/* Eras Navigation Grid Rows */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-10">
            {GEOLOGICAL_EPOCHS.map((epoch, idx) => (
              <div
                key={epoch.id}
                onClick={() => setActiveEpochIdx(idx)}
                className={`border p-4.5 rounded-lg cursor-pointer transition-all duration-300 hover:border-black flex flex-col justify-between h-32 relative overflow-hidden ${
                  activeEpochIdx === idx 
                    ? "border-black bg-black/[0.02] shadow-xs" 
                    : "border-gray-200 bg-white"
                }`}
              >
                <div>
                  <span className="text-[9px] font-mono text-gray-400 block">{epoch.span}</span>
                  <h4 className="text-xs font-bold font-mono tracking-tight text-gray-900 mt-1 uppercase leading-snug">
                    {epoch.name.replace(" Aeon", "").replace(" Era", "")}
                  </h4>
                </div>
                
                <span className="text-[10px] font-mono text-gray-500 font-bold uppercase mt-4 block">
                  CHAPTER 0{idx + 1}
                </span>

                {activeEpochIdx === idx && (
                  <div className="absolute top-0 right-0 w-6 h-6 bg-black text-white flex items-center justify-center rounded-bl-sm text-[10px]">
                    ★
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Selected Geological Epoch Live Data Board */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEpochIdx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className={`p-6 md:p-10 rounded-2xl border border-gray-300 bg-linear-to-br ${GEOLOGICAL_EPOCHS[activeEpochIdx].color} text-white shadow-lg space-y-8 relative overflow-hidden`}
            >
              {/* Abs grid elements mimicking research graphs */}
              <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-white/[0.04] to-transparent pointer-events-none hidden md:block" />

              <div className="flex flex-col lg:flex-row justify-between items-start gap-8 relative z-10">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-white/10 rounded-sm font-mono text-[9px] uppercase tracking-widest text-[#fcfcfc] border border-white/20">
                      EPOCH SYSTEM STATUS: ACTIVE
                    </span>
                    <span className="font-mono text-xs text-white/60">
                      {GEOLOGICAL_EPOCHS[activeEpochIdx].span}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-4xl font-normal tracking-tight text-[#fcfcfc]">
                    {GEOLOGICAL_EPOCHS[activeEpochIdx].name}
                  </h3>
                  
                  <p className="text-[13px] md:text-sm text-gray-300 leading-relaxed font-sans font-light">
                    {GEOLOGICAL_EPOCHS[activeEpochIdx].summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full lg:w-96 text-xs bg-white/[0.04] border border-white/10 p-5 rounded-lg backdrop-blur-xs font-mono">
                  <div className="space-y-1">
                    <span className="text-white/40 text-[9px] uppercase tracking-wider block">CO2 CONCENTRATION</span>
                    <span className="font-bold text-white text-[12px] block">{GEOLOGICAL_EPOCHS[activeEpochIdx].co2Level}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-white/40 text-[9px] uppercase tracking-wider block">SEA LEVEL CALCULATED</span>
                    <span className="font-bold text-white text-[12px] block">{GEOLOGICAL_EPOCHS[activeEpochIdx].seaLevel}</span>
                  </div>
                  <div className="space-y-1 col-span-2 border-t border-white/10 pt-3 mt-1">
                    <span className="text-white/40 text-[9px] uppercase tracking-wider block">ATMOSPHERIC DENSITY CODES</span>
                    <span className="font-semibold text-gray-200 block text-[11px] leading-normal">{GEOLOGICAL_EPOCHS[activeEpochIdx].atmosphere}</span>
                  </div>
                </div>
              </div>

              {/* Index Fossil Marker Row */}
              <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between text-xs items-start md:items-center gap-4 relative z-10">
                <div className="flex items-center gap-3 font-mono">
                  <Layers size={14} className="text-gray-400" />
                  <span>KEY GEOLOGICAL INDICATOR FOSSIL:</span>
                  <span className="font-bold text-[#fafafa] italic font-serif underline decoration-white/30 decoration-dashed">
                    {GEOLOGICAL_EPOCHS[activeEpochIdx].indexFossil}
                  </span>
                </div>
                
                <button
                  onClick={() => handlePillClick("Dinosaurs")}
                  className="px-4 py-2 bg-white hover:bg-black text-black hover:text-white border border-white hover:border-black rounded text-[10px] font-mono uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer"
                >
                  SEARCH CATEGORY ARCHIVES
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* REDESIGNED DIAGNOSTIC SPECTROMETER WORKSTATION PLUG & PLAY */}
      <section id="spectrometer" className="relative w-full py-24 md:py-32 bg-gray-50 border-b border-gray-150">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          
          <div className="max-w-3xl mb-16 space-y-3">
            <div className="text-[11px] font-mono tracking-[0.2em] font-bold text-gray-500">
              [ 03 // SPECTROSCOPIC DIAGNOSIS ]
            </div>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight">Fossil Spectrometer & Core Workstation</h2>
            <p className="text-xs text-secondary text-gray-650 font-sans leading-relaxed">
              Synthesize carbon-14 atomic decay limits and fluorine chemical migration inside physical core specimen samples. Manipulate dating meters to calculate simulated taxonomy age models in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* WORKSTATION LEFT CONTROL: TARGET AND CHANNELS (lg:col-span-4) */}
            <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between space-y-8 shadow-xs">
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-gray-400 block font-bold">01. ASSIGN WORKSPACE CORE</span>
                  <div className="grid grid-cols-3 gap-2 mt-2.5">
                    {specimensData.slice(0, 6).map((spec) => (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => setActiveSpecimenId(spec.id)}
                        className={`py-3 px-2 rounded-lg border text-center transition-all duration-300 text-[10px] font-mono uppercase font-bold cursor-pointer ${
                          activeSpecimenId === spec.id
                            ? "bg-black text-white border-black"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-black hover:bg-white"
                        }`}
                      >
                        {spec.id.substring(0, 7)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SLIDERS FOR CORE DATINGS */}
                <div className="space-y-6 border-t border-gray-150 pt-5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-gray-400 block font-bold">02. ATOMIC RADIOLOGY DIALS</span>
                  
                  {/* SLIDER 1 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                      <span>C-14 HALF-LIVES</span>
                      <span className="font-bold text-gray-950 bg-gray-100 px-1.5 py-0.5 rounded text-[9.5px] border border-gray-200">{c14Ratio.toFixed(1)} cycles</span>
                    </div>
                    <div className="relative group">
                      <input
                        type="range"
                        min="0.0"
                        max="10.0"
                        step="0.1"
                        value={c14Ratio}
                        onChange={(e) => setC14Ratio(parseFloat(e.target.value))}
                        className="w-full accent-black cursor-pointer h-1.5 rounded appearance-none transition-all"
                        style={{
                          background: `linear-gradient(to right, #111 0%, #111 ${c14Pct}%, #e5e7eb ${c14Pct}%, #e5e7eb 100%)`
                        }}
                      />
                    </div>
                    {/* Tick Notches */}
                    <div className="flex justify-between text-[6.5px] font-mono text-gray-400 select-none px-0.5">
                      <span>0.0</span>
                      <span>|</span>
                      <span>|</span>
                      <span>|</span>
                      <span>|</span>
                      <span>5.0</span>
                      <span>|</span>
                      <span>|</span>
                      <span>|</span>
                      <span>|</span>
                      <span>10.0</span>
                    </div>
                    <p className="text-[8.5px] font-mono text-gray-400 pt-0.5 leading-relaxed">Carbon isotope decay half lives limits carbon-14 detection.</p>
                  </div>

                  {/* SLIDER 2 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                      <span>FLUORINE ABSORPTION RATIO</span>
                      <span className="font-bold text-gray-950 bg-gray-100 px-1.5 py-0.5 rounded text-[9.5px] border border-gray-200">{Math.round(fluorineRatio * 100)}%</span>
                    </div>
                    <div className="relative group">
                      <input
                        type="range"
                        min="0.0"
                        max="1.0"
                        step="0.01"
                        value={fluorineRatio}
                        onChange={(e) => setFluorineRatio(parseFloat(e.target.value))}
                        className="w-full accent-black cursor-pointer h-1.5 rounded appearance-none transition-all"
                        style={{
                          background: `linear-gradient(to right, #111 0%, #111 ${fluorinePct}%, #e5e7eb ${fluorinePct}%, #e5e7eb 100%)`
                        }}
                      />
                    </div>
                    {/* Tick Notches */}
                    <div className="flex justify-between text-[6.5px] font-mono text-gray-400 select-none px-0.5">
                      <span>0.0%</span>
                      <span>|</span>
                      <span>|</span>
                      <span>|</span>
                      <span>50%</span>
                      <span>|</span>
                      <span>|</span>
                      <span>|</span>
                      <span>100%</span>
                    </div>
                    <p className="text-[8.5px] font-mono text-gray-400 pt-0.5 leading-relaxed">Mineral concentration absorption rate from neighboring sandstone layers.</p>
                  </div>

                  {/* SLIDER 3 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                      <span>STRONTIUM ISOTOPE RATIO (Sr-87)</span>
                      <span className="font-bold text-gray-950 bg-gray-100 px-1.5 py-0.5 rounded text-[9.5px] border border-gray-200">{strontiumRatio.toFixed(4)}</span>
                    </div>
                    <div className="relative group">
                      <input
                        type="range"
                        min="0.701"
                        max="0.715"
                        step="0.0001"
                        value={strontiumRatio}
                        onChange={(e) => setStrontiumRatio(parseFloat(e.target.value))}
                        className="w-full accent-black cursor-pointer h-1.5 rounded appearance-none transition-all"
                        style={{
                          background: `linear-gradient(to right, #111 0%, #111 ${strontiumPct}%, #e5e7eb ${strontiumPct}%, #e5e7eb 100%)`
                        }}
                      />
                    </div>
                    {/* Tick Notches */}
                    <div className="flex justify-between text-[6.5px] font-mono text-gray-400 select-none px-0.5">
                      <span>0.7010</span>
                      <span>|</span>
                      <span>|</span>
                      <span>0.7080</span>
                      <span>|</span>
                      <span>|</span>
                      <span>0.7150</span>
                    </div>
                    <p className="text-[8.5px] font-mono text-gray-400 pt-0.5 leading-relaxed">Basalt decay mapping constants tracking origin crust locations.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setIsTicketDrawerOpen(true)}
                  className="w-full bg-[#111] hover:bg-black text-white p-3.5 tracking-widest uppercase text-[10px] font-mono font-semibold rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-md"
                >
                  <CalendarDays size={13} />
                  <span>SECURE GATE PASS</span>
                </button>
              </div>
            </div>

            {/* INTERACTIVE VECTOR SCAN DIAGRAM VIEW: lg:col-span-5 */}
            <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs min-h-[460px] relative overflow-hidden">
              <div>
                <div className="flex justify-between items-center border-b border-gray-150 pb-3 mb-4">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-gray-450 block font-bold">03. VECTOR RADIOGRAPH BLUEPRINT</span>
                  <span className="text-[9px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 border border-amber-200 uppercase font-bold">SCIENTIFIC DISPERSAL</span>
                </div>

                <p className="text-xs text-gray-650 max-w-sm mb-6 leading-relaxed">
                  Select glowing vector target nodes mapping the critical skeletal structures, mineral matrices, and biomechanics ratios.
                </p>
              </div>

              {/* INTERACTIVE SVG GRID PLATE CANVAS */}
              <div className="relative w-full aspect-square border border-dashed border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center p-6 mb-6 overflow-hidden">
                
                {/* Background radar concentric grids */}
                <div className="absolute inset-x-0 h-[1px] bg-gray-150/80 top-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute inset-y-0 w-[1px] bg-gray-150/80 left-1/2 -translate-x-1/2 pointer-events-none" />
                <div className="absolute w-[60%] h-[60%] border border-gray-150/50 rounded-full pointer-events-none" />
                
                {/* Render the core primary specimen image under high contrast translucent frame */}
                <img
                  src={currentSpecimenDetail.image}
                  alt={currentSpecimenDetail.name}
                  className="absolute w-[65%] h-[65%] object-contain opacity-80 drop-shadow-lg mix-blend-multiply pointer-events-none transition-all duration-500"
                />

                {/* Overlaid Vector targets */}
                {SPECIMEN_DIAGNOSTIC_NODES[activeSpecimenId]?.map((node) => {
                  const isNodeSelected = selectedDiagNode?.id === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedDiagNode(node)}
                      className="absolute p-2 z-10 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      title={`Target node: ${node.name}`}
                    >
                      <span className="relative flex h-4 w-4">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${isNodeSelected ? "bg-black" : "bg-gray-400"}`} />
                        <span className={`relative inline-flex rounded-full h-4 w-4 border flex items-center justify-center text-[8px] font-mono font-bold ${
                          isNodeSelected ? "bg-black border-black text-white" : "bg-white border-gray-400 text-gray-600"
                        }`}>
                          •
                        </span>
                      </span>
                    </button>
                  );
                })}

                <span className="absolute bottom-3 left-3 text-[8.5px] font-mono text-gray-400 select-none uppercase tracking-widest leading-none">
                  RESOLVED_WIRE_HUD: {activeSpecimenId.toUpperCase()}
                </span>
              </div>

              {/* Small interactive node readout */}
              {selectedDiagNode && (
                <div className="p-4 bg-gray-100 rounded-lg space-y-1.5 border border-gray-200">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#111] font-bold flex items-center gap-1.5">
                    <Fingerprint size={12} strokeWidth={2} />
                    {selectedDiagNode.name}
                  </h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed font-sans">
                    {selectedDiagNode.description}
                  </p>
                </div>
              )}
            </div>

            {/* REAL-TIME SIMULATION DATA LEDGER BOARD: lg:col-span-3 */}
            <div className="lg:col-span-3 bg-[#111] text-[#fff] border border-[#111] rounded-2xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden select-none">
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-2 text-rose-500 font-mono text-[9px] uppercase tracking-widest font-bold">
                  <Gauge size={12} />
                  <span>SIMULATED CHRONO ANALYSIS</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-mono text-white/50 uppercase tracking-widest">CALCULATED ABSOLUTE DECAY:</h3>
                  <div className="text-4xl font-mono font-bold tracking-tight text-white">
                    {datingCalculations.estimatedAge.toLocaleString()}&nbsp;
                    <span className="text-[12px] text-white/40 block font-sans tracking-normal font-light">MILLION YEARS AGO</span>
                  </div>
                </div>

                <div className="space-y-4 border-t border-white/10 pt-4 font-mono text-[10px]">
                  <div className="space-y-1">
                    <span className="text-white/40 block">METRIC TAXONOMY BOUNDARY</span>
                    <span className="font-bold text-gray-100 uppercase text-[11px] block">{datingCalculations.epochLabel}</span>
                  </div>
                  
                  <div className="space-y-1 pt-1.5">
                    <span className="text-white/40 block font-mono">EST. MINERAL RETENTION</span>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-white h-full transition-all duration-500" style={{ width: `${datingCalculations.density}%` }} />
                    </div>
                    <div className="flex justify-between text-white/50 text-[9px] pt-1">
                      <span>Carbon Ratio: {100 - datingCalculations.preservationRatio}%</span>
                      <span>Density: {datingCalculations.density}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 mt-6 border-t border-white/10 relative z-10 font-mono text-[10.5px]">
                <div className="text-white/40 flex justify-between">
                  <span>CORE PRESERVATION:</span>
                  <span className="text-white font-semibold">{datingCalculations.preservationRatio}%</span>
                </div>
                <div className="text-white/40 flex justify-between">
                  <span>STRONTIUM CONSTANT:</span>
                  <span className="text-white font-semibold">{strontiumRatio.toFixed(4)}</span>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleOpenSpecimenDetails(activeSpecimenId)}
                  className="w-full mt-4 bg-white hover:bg-gray-200 text-black p-3.5 tracking-widest text-[9.5px] uppercase font-bold rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Maximize2 size={11} />
                  <span>Dossier Overview</span>
                </button>
              </div>

              {/* Watermark grid coordinate effect matching terminal dashboard style */}
              <div className="absolute top-1/2 left-0 h-48 w-full border-t border-dashed border-white/[0.04] pointer-events-none bg-linear-to-b from-white/[0.01] to-transparent" />
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: PREHISTORIC CHAPTERS (SLIDING SECTION) */}
      <section id="stories" className="relative w-full bg-[#0a0a0a] text-white flex flex-col z-30 font-sans overflow-hidden">
        
        {/* Absolute floating vector illustration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-0 select-none">
          <motion.img
            src="https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779625001/ChatGPT_Image_May_23_2026_12_24_44_PM_1_lv1dne.png"
            alt="Pterodactyl specimen model graphics"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            initial={{ y: "-15%", opacity: 0, x: "-50%" }}
            whileInView={{ y: "-5%", opacity: 0.8, x: "-50%" }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="w-[160vw] md:w-[1100px] h-auto max-w-none mix-blend-screen"
          />
        </div>

        {/* Header Block with quick icons navigation */}
        <div className="px-6 md:px-16 pt-32 md:pt-48 mb-16 z-10 flex flex-col xl:flex-row justify-between xl:items-end gap-10">
          <h2 className="text-[1.8rem] md:text-[3rem] lg:text-[3.8rem] xl:text-[4rem] leading-[1.15] font-medium tracking-tight text-white max-w-[850px]">
            Curated from millions of years of wonder
            <span className="inline-flex gap-2 md:gap-3 align-middle mx-3 md:mx-4 -translate-y-[4px]">
              <span
                onClick={() => handlePillClick("Dinosaurs")}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-700 bg-black text-gray-400 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer"
              >
                <Bone className="w-[15px] h-[15px] md:w-[22px] md:h-[22px]" />
              </span>
              <span
                onClick={() => handlePillClick("Ancient Life")}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-700 bg-black text-gray-400 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer"
              >
                <Dna className="w-[15px] h-[15px] md:w-[22px] md:h-[22px]" />
              </span>
              <span
                onClick={() => handlePillClick("Fossils")}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-700 bg-black text-gray-400 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer"
              >
                <Leaf className="w-[15px] h-[15px] md:w-[22px] md:h-[22px]" />
              </span>
            </span>
            & discovery.
          </h2>

          <div className="flex flex-col xl:items-end">
            <div className="text-[9px] md:text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-6 leading-relaxed xl:text-right">
              WE DON'T JUST MOUNT SKELETONS <br />
              WE CATALOG TIME DECAYS
            </div>
            <div className="flex flex-wrap gap-2">
              {["Authentic", "Chronological", "Interactive"].map((label, idx) => (
                <span
                  key={idx}
                  onClick={() => setIsTicketDrawerOpen(true)}
                  className="px-5 py-2.5 rounded-full border border-gray-700 text-[9px] font-mono tracking-widest uppercase text-gray-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer font-semibold"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* TWO-COLUMN SLIDING DISPLAY CONTAINER */}
        <div className="border-t border-gray-800 flex flex-col lg:flex-row z-10">
          
          <div className="w-full lg:w-[35%] border-b lg:border-b-0 lg:border-r border-gray-800 p-8 md:p-12 flex flex-col justify-between min-h-[420px] md:min-h-[500px]">
            <div className="text-gray-500 text-xl tracking-[0.3em] font-light font-mono text-center">***</div>

            <div className="relative w-full h-[250px] md:h-[300px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <SandTransitionImage
                  key={activeChapter}
                  src={chaptersData[activeChapter].image}
                  alt={chaptersData[activeChapter].name}
                  className="absolute inset-0 w-[80%] h-[80%] m-auto object-contain mix-blend-lighten pointer-events-none"
                />
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-4">
              <div className="h-4 overflow-hidden relative w-5">
                <motion.div
                  animate={{ y: -activeChapter * 16 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col text-[10px] font-mono tracking-widest text-[#888] uppercase"
                  style={{ height: 16 }}
                >
                  {["01", "02", "03", "04", "05"].map((num) => (
                    <span key={num} className="h-4 flex items-center font-mono">
                      {num}
                    </span>
                  ))}
                </motion.div>
              </div>
              <span className="text-[#333] font-mono text-[10px] tracking-widest">/</span>
              <span className="text-[#444] font-mono text-[10px] tracking-widest">05</span>
            </div>
          </div>

          <div className="w-full lg:w-[65%] flex flex-col">
            <div className="border-b border-gray-800 p-8 text-[10px] font-mono text-gray-400 tracking-widest flex justify-between items-center w-full">
              <span>ACTIVE CHAPTER SYNC METRIC DISPERSAL</span>
              <span className="flex items-center font-bold">
                <span>CHAPTER&nbsp;</span>
                <div className="h-4 overflow-hidden relative w-5 inline-block">
                  <motion.div
                    animate={{ y: -activeChapter * 16 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col"
                  >
                    {["01", "02", "03", "04", "05"].map((num) => (
                      <span key={num} className="h-4 flex items-center font-bold text-white">
                        {num}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </span>
            </div>

            <div className="flex flex-col">
              {chaptersData.map((chap, idx) => {
                const isActive = activeChapter === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectChapter(idx)}
                    className={`border-b border-gray-800/80 py-8 px-8 flex items-center justify-between cursor-pointer transition-colors duration-300 ${
                      isActive ? "text-white bg-white/[0.02]" : "text-[#444] hover:text-[#999]"
                    }`}
                  >
                    <span className="text-2xl md:text-[2rem] font-medium tracking-tight">
                      {chap.name}
                    </span>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.7, x: -5, y: 5 }}
                            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                            exit={{ opacity: 0, scale: 0.7, x: -5, y: 5 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ArrowUpRight size={22} strokeWidth={1} className="text-gray-400" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER segment styled following the museum's design system */}
      <footer className="border-t border-gray-800 bg-[#070707] text-[#fff] relative overflow-hidden font-sans border-b border-white/[0.05]">
        {/* Subtle radial light effect overlay */}
        <div className="absolute inset-0 bg-radial from-white/[0.015] to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-16 pt-16 pb-12 relative z-10">
          {/* Top Row: Brand tagline & Smooth scroll-to-top */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-12 border-b border-gray-800/80">
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.25em] text-gray-400 uppercase block font-bold">
                [ PHX MUSEUM INC. DEPOT ]
              </span>
              <h3 className="text-lg md:text-xl font-normal tracking-tight text-gray-200 font-sans max-w-lg leading-relaxed">
                Exploring deep-time history, molecular fossils, and the story of oceanic life through immersive digital curation.
              </h3>
            </div>
            
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group py-3 px-5 border border-gray-800 hover:border-gray-500 hover:bg-white hover:text-black transition-all duration-300 rounded text-[10px] font-mono tracking-widest uppercase flex items-center gap-2 cursor-pointer font-bold shrink-0"
              title="Return to topmost coordinates"
            >
              <span>BACK TO SUMMIT</span>
              <span className="group-hover:-translate-y-0.5 transition-transform duration-300">↑</span>
            </button>
          </div>

          {/* Middle Row: Navigation and telemetry links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
            
            {/* Col 1: System Blueprint status */}
            <div className="space-y-4.5">
              <div className="flex items-center gap-2 font-mono text-[10.5px] font-bold tracking-[0.2em] text-white uppercase">
                <Atom className="w-3.5 h-3.5 text-gray-450 animate-spin-slow" />
                <span>THE SYSTEM DEPOT</span>
              </div>
              <p className="text-[12px] text-gray-450 leading-relaxed font-sans max-w-[240px]">
                An interactive workstation of geological epochs, mineral arrays, and atomic carbon dating metrics.
              </p>
              <div className="pt-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span>CORE CHANNELS: LIVE Sync</span>
                </div>
                <div>COORD: 51.4967° N, 0.1764° W</div>
              </div>
            </div>

            {/* Col 2: Directory URLs */}
            <div className="space-y-4.5">
              <div className="font-mono text-[10.5px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                DEEP-TIME SECTOR
              </div>
              <ul className="space-y-3 text-[11px] font-mono tracking-wider">
                <li>
                  <a href="#deep-time" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2.5">
                    <span className="text-[9px] text-gray-600">•</span> EARTH TIMELINE
                  </a>
                </li>
                <li>
                  <a href="#spectrometer" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2.5">
                    <span className="text-[9px] text-gray-600">•</span> FOSSIL SPECTROMETER
                  </a>
                </li>
                <li>
                  <a href="#stories" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2.5">
                    <span className="text-[9px] text-gray-600">•</span> PREHISTORIC CHAPTERS
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Practical Actions */}
            <div className="space-y-4.5">
              <div className="font-mono text-[10.5px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                PASSES & ARCHIVES
              </div>
              <ul className="space-y-3 text-[11px] font-mono tracking-wider">
                <li>
                  <button
                    onClick={() => setIsTicketDrawerOpen(true)}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2.5 text-left cursor-pointer"
                  >
                    <span className="text-[9px] text-gray-600">•</span> PASS REGISTRATION
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePillClick("Dinosaurs")}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2.5 text-left cursor-pointer"
                  >
                    <span className="text-[9px] text-gray-600">•</span> SYSTEM CORES EXPLORE
                  </button>
                </li>
                <li>
                  <span className="text-gray-600 cursor-not-allowed flex items-center gap-2.5">
                    <span className="text-[9px] text-gray-700">•</span> DIGITAL MAP VIEW [N/A]
                  </span>
                </li>
              </ul>
            </div>

            {/* Col 4: Physical details */}
            <div className="space-y-4.5 font-sans">
              <div className="font-mono text-[10.5px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                CURATOR PROTOCOLS
              </div>
              <div className="space-y-2 text-[12px] text-gray-450 leading-relaxed">
                <div>Cromwell Road, Kensington, London, UK</div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-500 mt-1">
                  <Timer size={12} />
                  <span>OPEN DAILY: 10:00 – 17:50</span>
                </div>
                <div className="font-mono text-[10px] text-gray-500 pt-1.5 flex flex-col space-y-1">
                  <span>TELEMETRY: +44 20 7942 5000</span>
                  <span>MAIL: DATABASE@PHX.AC.UK</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: Minimal Licensing details and copyright */}
          <div className="border-t border-gray-800/80 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-[9.5px] font-mono tracking-widest text-gray-500 uppercase select-none">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-gray-450">
              <span className="text-white">© {new Date().getFullYear()} PHX MUSEUM ARCHIVES</span>
              <span>•</span>
              <span>ALL PROTOCOLS REGISTERED</span>
              <span>•</span>
              <span className="text-gray-650 font-normal">SECURE SEC_ID: {activeSpecimenId.toUpperCase()}</span>
            </div>
            
            <div className="flex gap-4.5 text-gray-600">
              <span>LIC_CODE: C-14_RAD_998</span>
              <span>BUILD: V2.6</span>
            </div>
          </div>
        </div>
      </footer>

      {/* DRAWERS & DIALOGS OVERLAYS */}
      <AnimatePresence>
        {isTicketDrawerOpen && (
          <TicketDrawer
            isOpen={isTicketDrawerOpen}
            onClose={() => setIsTicketDrawerOpen(false)}
          />
        )}

        {isCollectionExplorerOpen && (
          <CollectionExplorer
            isOpen={isCollectionExplorerOpen}
            initialCategory={selectedExplorerCategory}
            onClose={() => setIsCollectionExplorerOpen(false)}
            onSelectSpecimen={handleSpecimenSelectedInExplorer}
          />
        )}

        {isSpecimenDrawerOpen && selectedSpecimen && (
          <SpecimenDrawer
            isOpen={isSpecimenDrawerOpen}
            specimen={selectedSpecimen}
            onClose={() => {
              setIsSpecimenDrawerOpen(false);
              setSelectedSpecimen(null);
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
