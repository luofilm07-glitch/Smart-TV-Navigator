type SidebarSection = "all" | "movies" | "series";

interface MobileNavProps {
  activeSection: SidebarSection;
  onChange: (section: SidebarSection) => void;
}

const navItems: { id: SidebarSection; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    id: "all",
    label: "Home",
    icon: (active) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "movies",
    label: "Movies",
    icon: (active) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    id: "series",
    label: "Series",
    icon: (active) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export function MobileNav({ activeSection, onChange }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-gray-800/60">
      <div className="flex items-stretch">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
                isActive ? "text-red-500" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {item.icon(isActive)}
              <span className={`text-[10px] font-semibold tracking-wide ${isActive ? "text-red-500" : "text-gray-500"}`}>
                {item.label}
              </span>
              {isActive && <span className="absolute bottom-0 w-8 h-0.5 bg-red-500 rounded-full" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
