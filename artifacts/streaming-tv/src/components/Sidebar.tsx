type SidebarSection = "all" | "movies" | "series";

interface SidebarProps {
  activeSection: SidebarSection;
  onChange: (section: SidebarSection) => void;
  focusedItem?: string;
  onFocus?: (item: string) => void;
}

const navItems: { id: SidebarSection; label: string; icon: React.ReactNode }[] = [
  {
    id: "all",
    label: "All",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
  },
  {
    id: "movies",
    label: "Movies",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
      </svg>
    ),
  },
  {
    id: "series",
    label: "Series",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
      </svg>
    ),
  },
];

export function Sidebar({ activeSection, onChange, focusedItem, onFocus }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-[57px] bottom-0 z-40 w-[220px] bg-[#0a0a0a] border-r border-gray-800/60 flex flex-col pt-4 pb-8 overflow-y-auto">
      {/* Navigation */}
      <div className="px-3">
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 px-2">Browse</p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const isFocused = focusedItem === `sidebar-${item.id}`;
            return (
              <button
                key={item.id}
                data-tv-id={`sidebar-${item.id}`}
                tabIndex={0}
                onClick={() => onChange(item.id)}
                onFocus={() => onFocus?.(`sidebar-${item.id}`)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all outline-none
                  ${isActive ? "bg-red-600 text-white" : "text-gray-300 hover:bg-[#1e1e1e] hover:text-white"}
                  ${isFocused ? "ring-2 ring-red-500" : ""}
                `}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800/60 my-4 mx-3" />

      {/* Channels */}
      <div className="px-3">
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 px-2">Channels</p>
        <div className="space-y-3">
          {[
            { name: "VJ ADAMSON", initials: "VA", color: "bg-amber-600", count: "134K" },
            { name: "CONFIDENTIAL", initials: "CF", color: "bg-slate-600", count: "2.3M" },
            { name: "VJ PILES UG", initials: "VP", color: "bg-orange-600", count: "890K" },
          ].map((ch) => (
            <button
              key={ch.name}
              className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-sm hover:bg-[#1e1e1e] transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <div className={`w-8 h-8 rounded-full ${ch.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {ch.initials}
              </div>
              <div className="text-left min-w-0">
                <p className="text-gray-200 font-medium text-xs truncate">{ch.name}</p>
                <p className="text-gray-500 text-xs">{ch.count} views</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Admin link */}
      <div className="mt-auto px-3 pt-4 border-t border-gray-800/60">
        <a
          href="/admin"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-[#1e1e1e] hover:text-gray-300 transition-all"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          Admin Panel
        </a>
        <div className="flex items-center gap-2 px-3 py-2 opacity-40">
          <img src="/play-button.png" alt="" className="w-4 h-4 object-contain" />
          <span className="text-gray-500 text-xs">NexStream © 2024</span>
        </div>
      </div>
    </aside>
  );
}
