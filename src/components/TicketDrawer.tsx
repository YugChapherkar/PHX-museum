import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, User, Ticket, Check, ShieldAlert, Sparkles, Printer, RefreshCw } from "lucide-react";

interface TicketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TicketType {
  id: string;
  name: string;
  price: number;
  perks: string[];
  desc: string;
}

const TICKET_TYPES: TicketType[] = [
  {
    id: "standard",
    name: "General Admission Pass",
    price: 25,
    desc: "Provides full daytime entry to all main exhibition galleries including the primary Dino Hall.",
    perks: ["All 15 general galleries", "Museum guidebook PDF", "Temporary public lectures access"]
  },
  {
    id: "night",
    name: "VIP Fossil Safari Night Pass",
    price: 49,
    desc: "A distinct high-atmosphere evening tour conducted under the shadow of back-lit dinosaur silhouettes.",
    perks: ["Flashlight guided tour", "Live paleontologist talk", "Glass of welcome prehistoric cider"]
  },
  {
    id: "archival",
    name: "Deep Archival Vault Pass",
    price: 110,
    desc: "An exclusive, intimate tour of the locked basement collection housing millions of unclassified specimens.",
    perks: ["Behind-the-scenes vaults access", "Exclusive fossil touching kit", "Personal private guide", "15% discount at museum shop"]
  }
];

export function TicketDrawer({ isOpen, onClose }: TicketDrawerProps) {
  const [selectedType, setSelectedType] = useState<string>("standard");
  const [date, setDate] = useState<string>("2026-06-15");
  const [quantity, setQuantity] = useState<number>(2);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string>("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("phx_booked_ticket");
      if (stored) {
        const parsed = JSON.parse(stored);
        setSelectedType(parsed.selectedType || "standard");
        setDate(parsed.date || "2026-06-15");
        setQuantity(parsed.quantity || 2);
        setName(parsed.name || "");
        setEmail(parsed.email || "");
        setTicketId(parsed.ticketId || "");
        setIsBooked(true);
      }
    } catch (e) {
      console.warn("Failed parsing saved ticket pass", e);
    }
  }, []);

  const currentType = TICKET_TYPES.find((t) => t.id === selectedType) || TICKET_TYPES[0];
  const totalCost = currentType.price * quantity;

  const handleBooking = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    // Generate random luxury serial number
    const randAlpha = Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join("");
    const randNum = Math.floor(100000 + Math.random() * 900000);
    const generatedId = `PHX-${selectedType.toUpperCase()}-${randAlpha}-${randNum}`;
    
    setTicketId(generatedId);
    setIsBooked(true);

    try {
      localStorage.setItem("phx_booked_ticket", JSON.stringify({
        ticketId: generatedId,
        selectedType,
        date,
        quantity,
        name,
        email
      }));
    } catch (err) {
      console.warn("Could not save ticket to localStorage", err);
    }
  };

  const handleReset = () => {
    setIsBooked(false);
    setName("");
    setEmail("");
    setQuantity(2);
    setSelectedType("standard");
    setTicketId("");
    try {
      localStorage.removeItem("phx_booked_ticket");
    } catch {}
  };

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
                [ EXPOSITION EVENT BOOKINGS ]
              </span>
              <h2 className="text-2xl md:text-3xl font-normal tracking-tight font-sans text-gray-950 flex items-center gap-2">
                <Ticket className="text-black inline" size={24} /> PHX Museum Passes
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className="p-2.5 rounded-full border border-gray-300 hover:border-black active:bg-gray-100 transition-all duration-200 cursor-pointer"
              aria-label="Close ticket portal"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {!isBooked ? (
                <motion.form
                  key="booking-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleBooking}
                  className="space-y-6"
                >
                  {/* Step 1: Select Pass Tier */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold font-mono tracking-widest uppercase text-gray-400 block">
                      01. Select Pass Tier
                    </label>

                    <div className="space-y-3">
                      {TICKET_TYPES.map((type) => (
                        <div
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`border p-4 rounded-lg cursor-pointer transition-all duration-300 relative overflow-hidden ${
                            selectedType === type.id
                              ? "border-black bg-black/[0.01] shadow-xs"
                              : "border-gray-200 bg-white hover:border-gray-450"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-semibold tracking-tight text-gray-900">
                              {type.name}
                            </span>
                            <span className="text-sm font-mono font-bold text-gray-950 bg-gray-100 px-2.5 py-1 rounded">
                              ${type.price} <span className="text-[9px] text-gray-500 font-normal">USD</span>
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-600 leading-normal font-sans pr-14">
                            {type.desc}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2 pt-1 border-t border-gray-100/50">
                            {type.perks.map((perk, pi) => (
                              <span key={pi} className="text-[9px] font-mono text-gray-500 flex items-center gap-1">
                                <Check size={10} className="text-black" /> {perk}
                              </span>
                            ))}
                          </div>

                          {selectedType === type.id && (
                            <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-black text-white rounded-bl-lg">
                              <Check size={14} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Date & Attendance Options */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold font-mono tracking-widest uppercase text-gray-400 block">
                        02. Select Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          min="2026-06-01"
                          max="2026-12-31"
                          className="w-full bg-white border border-gray-200 rounded-md p-3.5 text-xs text-gray-800 focus:outline-none focus:border-black font-mono"
                          required
                        />
                        <Calendar size={14} className="absolute right-3.5 top-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold font-mono tracking-widest uppercase text-gray-400 block">
                        03. Quantity
                      </label>
                      <div className="flex items-center border border-gray-200 rounded-md bg-white overflow-hidden h-[46px]">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-14 h-full hover:bg-gray-50 text-gray-600 font-medium border-r border-gray-150 cursor-pointer text-sm"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-mono text-xs font-semibold text-gray-900">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.min(5, quantity + 1))}
                          className="w-14 h-full hover:bg-gray-50 text-gray-600 font-medium border-l border-gray-150 cursor-pointer text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Patron Credentials */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold font-mono tracking-widest uppercase text-gray-400 block">
                      04. Patron Information
                    </label>

                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Your Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-md p-3.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black pl-10"
                          required
                        />
                        <User size={14} className="absolute left-3.5 top-4.5 text-gray-400" />
                      </div>

                      <div className="relative">
                        <input
                          type="email"
                          placeholder="Email Address (for receipt)"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-md p-3.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black pl-10"
                          required
                        />
                        <Ticket size={14} className="absolute left-3.5 top-4.5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Order Total Overview */}
                  <div className="bg-gray-50 border border-gray-200/80 rounded-lg p-5 flex justify-between items-center">
                    <div>
                      <div className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">Subtotal Summary:</div>
                      <div className="text-xs text-gray-700 mt-0.5">
                        {currentType.name} &times; {quantity}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-mono font-bold text-gray-950">${totalCost}</span>
                      <span className="text-[9px] text-gray-500 block uppercase tracking-wider font-mono">USD tax incl.</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1a1a1a] hover:bg-black text-white p-4 rounded-md tracking-widest uppercase text-xs font-mono font-semibold transition-all duration-300 shadow-sm cursor-pointer"
                  >
                    Confirm & Compile Passes
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="booking-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col items-center justify-center p-6 bg-emerald-50 border border-emerald-150 rounded-lg text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="text-sm font-semibold text-emerald-950">Exposition Passes Unlocked!</h3>
                    <p className="text-xs text-emerald-800 max-w-sm">
                      Congratulations {name}, your reservation is locked under register reference <span className="font-mono text-emerald-950 font-bold">{ticketId}</span>. Let's inspect your print-ready museum passes.
                    </p>
                  </div>

                  <div className="text-[10px] font-mono tracking-widest uppercase text-gray-400 block text-center">
                    -- CUSTOM SVG EXPOSTION PASS --
                  </div>

                  {/* PREMIUM CUSTOM SVG EXPOSTION BOARD-PASS PASS MOCKUP */}
                  <div className="relative border border-slate-350 bg-white shadow-md rounded-xl overflow-hidden font-mono text-xs select-none">
                    {/* Top Notch Ribbon */}
                    <div className="w-full bg-gray-950 h-2" />
                    
                    <div className="p-6 space-y-6">
                      {/* Ticket header row */}
                      <div className="flex justify-between items-start border-b border-gray-150 pb-4">
                        <div>
                          <div className="text-[12px] font-bold tracking-tight text-gray-950">PHX MUSEUM ARCHIVE</div>
                          <div className="text-[8px] font-mono tracking-widest text-slate-500 uppercase mt-0.5">EST. LONDON ARCHIVE 1881</div>
                        </div>
                        <div className="text-right">
                          <span className="bg-black text-white text-[8px] px-2 py-0.5 rounded uppercase tracking-wider font-mono font-bold">
                            {selectedType.toUpperCase()}_TIER
                          </span>
                        </div>
                      </div>

                      {/* Ticket info grid */}
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[10px]">
                        <div>
                          <span className="text-[8px] text-gray-400 uppercase tracking-widest block font-mono">PRIMARY HOLDER:</span>
                          <span className="font-bold text-gray-950 truncate uppercase font-sans">{name}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-400 uppercase tracking-widest block font-mono">EMAIL RECEIPT:</span>
                          <span className="font-medium text-gray-600 truncate font-mono block">{email}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-400 uppercase tracking-widest block font-mono">RESERVATION DATE:</span>
                          <span className="font-bold text-gray-950 font-mono">{date}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-400 uppercase tracking-widest block font-mono">ISSUED QUANTITY:</span>
                          <span className="font-bold text-gray-950 font-mono">{quantity} PERSON(S)</span>
                        </div>
                      </div>

                      {/* Procedural Barcode generator using random sized boxes */}
                      <div className="border-t border-dashed border-gray-200 pt-6 flex flex-col items-center justify-center space-y-2">
                        <div className="flex items-end h-11 space-x-[2px] w-full max-w-[280px]">
                          {Array.from({ length: 48 }).map((_, i) => {
                            const isTall = (i % 3 === 0) || (i % 7 === 0);
                            const widthScale = (i % 5 === 0) ? "w-[3px]" : (i % 4 === 1) ? "w-[1.5px]" : "w-[0.8px]";
                            const opacity = (i % 11 === 0) ? "opacity-30" : "opacity-90";
                            return (
                              <div
                                key={i}
                                className={`bg-black/90 ${widthScale} ${opacity} h-full`}
                                style={{ height: isTall ? "100%" : "85%" }}
                              />
                            );
                          })}
                        </div>
                        <span className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">{ticketId}</span>
                      </div>
                    </div>

                    {/* Bottom footer bar with punch notches */}
                    <div className="bg-gray-50 border-t border-gray-150 p-4 flex justify-between items-center text-[8px] text-gray-400 font-mono tracking-widest">
                      <span>VALID_ONE_DAY_ONLY</span>
                      <span>(C) PHX_ARCHIVE_2026</span>
                    </div>

                    {/* Left and Right classic physical ticket notches */}
                    <div className="absolute top-1/2 left-0 h-6 w-3 bg-[#fcfcfc] border-r border-[#cbd5e1] rounded-r-full -translate-y-1/2" />
                    <div className="absolute top-1/2 right-0 h-6 w-3 bg-[#fcfcfc] border-l border-[#cbd5e1] rounded-l-full -translate-y-1/2" />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#f3f4f6] hover:bg-gray-200 border border-gray-300 text-gray-800 p-3.5 rounded-md tracking-widest uppercase text-[10px] font-mono font-semibold transition-all duration-300 cursor-pointer"
                    >
                      <Printer size={12} /> Print PDF
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-black/90 text-white p-3.5 rounded-md tracking-widest uppercase text-[10px] font-mono font-semibold transition-all duration-300 cursor-pointer"
                    >
                      <RefreshCw size={12} /> Book Another
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Advisory security rules badge */}
        <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-150 flex items-start gap-4 text-gray-500">
          <ShieldAlert size={28} strokeWidth={1} className="text-black/70 flex-shrink-0 mt-0.5" />
          <div className="text-[10px] leading-relaxed">
            <span className="font-bold text-gray-800 uppercase tracking-wider font-mono">Admission Conditions & Advisory</span>
            <br />
            Due to environmental conservation directives, tickets cannot be refunded. Late entry to the night fossil tours is strictly prohibited after 19:30 UTC. Backpacks must be submitted at the locker hub.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
export default TicketDrawer;
