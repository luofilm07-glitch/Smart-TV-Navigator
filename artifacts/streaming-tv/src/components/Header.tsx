import { useState, useRef } from "react";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  focused?: boolean;
  onFocus?: () => void;
}

export function Header({ onSearch, searchQuery = "", focused, onFocus }: HeaderProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localQuery);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 py-2.5 bg-[#0a0a0a] border-b border-gray-800/60">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-6 flex-shrink-0 w-[220px]">
        <img src="/play-button.png" alt="NexStream" className="w-8 h-8 object-contain" />
        <span className="text-white font-bold text-xl tracking-tight">NexStream</span>
      </div>

      {/* Search bar */}
      <div className="flex-1 max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="flex">
          <div className={`flex flex-1 border rounded-l-full overflow-hidden transition-colors ${focused ? "border-blue-500" : "border-gray-600"}`}>
            <input
              data-tv-id="search-input"
              type="search"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onFocus={onFocus}
              placeholder="Search videos..."
              className="flex-1 bg-[#121212] text-white px-4 py-2 text-sm focus:outline-none placeholder-gray-500"
            />
          </div>
          <button
            data-tv-id="search-btn"
            type="submit"
            className="bg-[#222] hover:bg-[#2a2a2a] border border-l-0 border-gray-600 px-4 py-2 rounded-r-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-4">
        <button
          data-tv-id="sign-in"
          className="flex items-center gap-2 border border-red-600 text-red-500 px-3 py-1.5 rounded-full text-sm hover:bg-red-950/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Sign in
        </button>
      </div>
    </header>
  );
}
