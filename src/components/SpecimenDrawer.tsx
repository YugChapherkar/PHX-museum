import { motion } from "motion/react";
import { X, Globe, History, Activity, ShieldCheck } from "lucide-react";
import { Specimen } from "../data/specimens";

interface SpecimenDrawerProps {
  isOpen: boolean;
  specimen: Specimen | null;
  onClose: () => void;
}

export function SpecimenDrawer({ isOpen, specimen, onClose }: SpecimenDrawerProps) {
  if (!isOpen || !specimen) return null;

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      {/* Semi-transparent dark blur backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
      />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-lg md:max-w-xl h-full bg-[#fcfcfc] shadow-2xl overflow-y-auto flex flex-col justify-between text-[#111] z-10 border-l border-gray-200"
      >
        <div>
          {/* Header Bar */}
          <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-150">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500">
                [ SPECIMEN ID: {specimen.id.toUpperCase()} ]
              </span>
              <h2 className="text-2xl md:text-3xl font-normal tracking-tight font-sans text-gray-950">
                {specimen.name}
              </h2>
              <p className="text-xs italic text-gray-600 font-serif">
                {specimen.scientificName}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="p-2.5 rounded-full border border-gray-300 hover:border-black active:bg-gray-100 transition-all duration-200 cursor-pointer"
              aria-label="Close details"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Centered Specimen Large Preview Plate */}
          <div className="bg-gray-50 border-b border-gray-150 py-10 px-6 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 p-4 flex justify-between pointer-events-none">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <Globe size={10} /> {specimen.location}
              </span>
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <History size={10} /> {specimen.period}
              </span>
            </div>

            <img
              src={specimen.image}
              alt={specimen.name}
              className="w-[200px] h-[200px] md:w-[260px] md:h-[260px] object-contain drop-shadow-xl transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Core Specimen Metrics Grid */}
          <div className="p-6 md:p-8 border-b border-gray-150">
            <h3 className="text-[10px] font-bold font-mono tracking-[0.2em] uppercase text-gray-400 mb-6 flex items-center gap-2">
              <Activity size={12} strokeWidth={2} /> Key Physical Metrics
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              {specimen.stats.map((stat, idx) => (
                <div key={idx} className="border-l-2 border-black/80 pl-4 py-1">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
                    {stat.label}
                  </div>
                  <div className="text-lg md:text-xl font-medium text-gray-900 mt-1">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Story Narrative */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono tracking-widest uppercase text-gray-400">
                Story & Taxonomy
              </h4>
              <p className="text-[14px] text-gray-700 leading-relaxed font-sans font-light">
                {specimen.description}
              </p>
            </div>

            {/* Scientific Taxonomic Classification Tree */}
            <div className="pt-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-3">
                Taxonomic Hierarchy
              </div>
              <div className="flex flex-wrap gap-2">
                {specimen.taxonomy.map((node, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono bg-gray-100 text-gray-700 px-3 py-1.5 rounded-sm border border-gray-200 hover:border-gray-450 transition-all cursor-default"
                  >
                    {node}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar Verification Seal */}
        <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-150 flex items-center gap-4 text-gray-500">
          <ShieldCheck size={28} strokeWidth={1} className="text-black/70 flex-shrink-0" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold text-gray-800">Curation Checked & Approved</span>
            <br />
            This artifact's data is verified by the PHX Museum Archives Department under register code <span className="font-mono text-gray-700 font-semibold">PHX-{specimen.id.toUpperCase()}-2026</span>.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
export default SpecimenDrawer;
