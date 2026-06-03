import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, BookmarkCheck, ArrowRight, Compass } from "lucide-react";
import { specimensData, Specimen } from "../data/specimens";

interface CollectionExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory: string; // "Dinosaurs" | "Ancient Life" | "Minerals" | "Fossils" | "Learn More"
  onSelectSpecimen: (specimen: Specimen) => void;
}

export function CollectionExplorer({
  isOpen,
  onClose,
  initialCategory,
  onSelectSpecimen
}: CollectionExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategory === "Learn More" ? "Dinosaurs" : initialCategory
  );

  // Keep internal state updated if props change
  useMemo(() => {
    if (isOpen) {
      setActiveCategory(initialCategory === "Learn More" ? "Dinosaurs" : initialCategory);
      setSearchQuery("");
    }
  }, [isOpen, initialCategory]);

  const categories = ["Dinosaurs", "Ancient Life", "Minerals", "Fossils"];

  // Filtered specimen collection based on queries
  const filteredSpecimens = useMemo(() => {
    return specimensData.filter((specimen) => {
      const matchCategory = specimen.category === activeCategory;
      const matchSearch =
        specimen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        specimen.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        specimen.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        specimen.period.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-90 flex justify-center items-center p-4 md:p-10">
      {/* Heavy dark blur background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
      />

      {/* Main Grid Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative w-full max-w-5xl h-[85vh] bg-[#fcfcfc] text-[#111] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 border border-gray-200"
      >
        {/* Header Search & Tab Section */}
        <div className="px-6 py-6 md:px-10 border-b border-gray-150 flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Compass size={22} className="text-black" />
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500">
                  [ COLLECTION METADATA LOGS ]
                </span>
                <h3 className="text-xl font-normal tracking-tight">Museum Specimen Database</h3>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 md:p-2.5 rounded-full border border-gray-300 hover:border-black active:bg-gray-100 transition-all duration-250 cursor-pointer"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            {/* Horizontal Tabs selection */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSearchQuery("");
                  }}
                  className={`text-[10px] font-mono tracking-wider px-4 py-2.5 rounded-full uppercase transition-all duration-300 font-bold border cursor-pointer ${
                    activeCategory === cat
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-800 border-gray-300 hover:border-black hover:text-black"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Live Query Finder Component */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder={`Search ${activeCategory}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 pl-9 text-xs text-gray-800 focus:outline-none focus:border-black placeholder-gray-400 font-sans"
              />
              <Search size={14} className="absolute left-3.5 top-3.5 text-gray-450 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-[10px] font-mono font-bold text-gray-400 hover:text-black uppercase"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Items Grid list container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50">
          <AnimatePresence mode="wait">
            {filteredSpecimens.length > 0 ? (
              <motion.div
                key={activeCategory + searchQuery}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredSpecimens.map((specimen) => (
                  <div
                    key={specimen.id}
                    className="bg-white border border-gray-150 rounded-xl p-5 hover:border-black hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                    onClick={() => onSelectSpecimen(specimen)}
                  >
                    <div>
                      {/* Top Specimen Row metadata */}
                      <div className="flex justify-between items-start text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-3">
                        <span>{specimen.period}</span>
                        <span>{specimen.age}</span>
                      </div>

                      {/* Display image preview plate */}
                      <div className="bg-gray-50/50 border border-gray-100 rounded-lg h-36 flex items-center justify-center p-3 relative overflow-hidden">
                        <img
                          src={specimen.image}
                          alt={specimen.name}
                          className="max-h-24 max-w-[85%] object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Specimen taxonomic text */}
                      <div className="mt-4 space-y-1.5">
                        <h4 className="text-base font-semibold tracking-tight text-gray-950 font-sans">
                          {specimen.name}
                        </h4>
                        <p className="text-[10px] italic text-gray-500 font-serif">
                          {specimen.scientificName}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed pt-1 select-none font-sans font-light">
                          {specimen.description}
                        </p>
                      </div>
                    </div>

                    {/* CTA footer trigger button */}
                    <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.15em] text-gray-500 group-hover:text-black transition-colors">
                      <span className="flex items-center gap-1">
                        <BookmarkCheck size={11} strokeWidth={1.5} /> VIEW METRICS
                      </span>
                      <ArrowRight size={13} className="transform translate-x-0 group-hover:translate-x-1 duration-300" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-12 text-center"
              >
                <Search size={36} strokeWidth={1} className="text-gray-400 mb-3" />
                <h4 className="text-sm font-semibold text-gray-900">No Specimens Cataloged</h4>
                <p className="text-xs text-gray-500 max-w-sm mt-1 leading-normal font-sans">
                  No artifacts match "{searchQuery}" inside the {activeCategory} archives right now. Clear search fields or try another category.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer bar indicator */}
        <div className="border-t border-gray-150 px-6 py-4 md:px-10 bg-[#fcfcfc] text-[9px] font-mono text-gray-400 tracking-widest uppercase flex justify-between">
          <span>Active Classification: {activeCategory.toUpperCase()}</span>
          <span>Showing {filteredSpecimens.length} curated specimen card(s)</span>
        </div>
      </motion.div>
    </div>
  );
}
export default CollectionExplorer;
