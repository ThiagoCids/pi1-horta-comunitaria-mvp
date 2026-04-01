import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

export function DatePicker({ value, onChange, label }: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  // Parse current value or fallback to today
  const initialDate = value ? new Date(value + 'T00:00:00') : new Date();
  
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handleDaySelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    const isoString = newDate.toISOString().split('T')[0];
    onChange(isoString);
    setIsOpen(false);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Formatar para exibição no input (DD/MM/YYYY)
  const displayValue = value ? value.split('-').reverse().join('/') : "";

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {label && <label className="block text-xs font-bold text-sage-700/60 mb-2 uppercase tracking-widest">{label}</label>}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-sage-50/50 border-2 border-transparent hover:bg-sage-50 text-sage-700 font-bold focus-within:ring-4 focus-within:ring-sage-100 focus-within:bg-white rounded-2xl p-4 cursor-pointer transition-all"
      >
        <span>{displayValue || "Selecione..."}</span>
        <CalendarDays className="w-5 h-5 text-sage-400" />
      </div>

      {isOpen && (
        <div className="absolute top-1/2 left-1/2 md:top-full md:left-0 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 mt-0 md:mt-2 bg-white rounded-3xl p-5 shadow-[0_10px_40px_rgba(21,66,18,0.15)] border border-sage-100 border-2 z-[999999] w-72 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-4">
            <button type="button" onClick={prevMonth} className="p-2 hover:bg-sage-50 text-sage-600 rounded-full transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-sage-800 font-manrope">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button type="button" onClick={nextMonth} className="p-2 hover:bg-sage-50 text-sage-600 rounded-full transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(wd => (
              <div key={wd} className="text-[10px] font-bold text-sage-400 text-center uppercase tracking-wider py-1">
                {wd}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {blanks.map(b => <div key={`blank-${b}`} />)}
            {days.map(d => {
              const currentDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const isSelected = value === currentDateStr;
              const isToday = new Date().toISOString().split('T')[0] === currentDateStr;
              
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDaySelect(d)}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                    ${isSelected 
                      ? "bg-sage-600 text-white shadow-md transform scale-105" 
                      : "text-sage-700 hover:bg-sage-100"}
                    ${isToday && !isSelected ? "border border-sage-300 text-sage-800" : ""}
                  `}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
