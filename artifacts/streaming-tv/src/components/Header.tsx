import { useState, useRef } from "react";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  focused?: boolean;
  onFocus?: () => void;
}

export function Header({ onSearch, searchQuery = "", focused, onFocus }: HeaderProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localQuery);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 py-2.5 bg-[#0f0f0f] border-b border-gray-800">
      {/* Logo */}
      <div className="flex items-center gap-1 mr-6 flex-shrink-0">
        <div className="w-8 h-8 flex items-center justify-center">
          <svg viewBox="0 0 90 20" className="h-5" fill="none">
            <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
            <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
          </svg>
        </div>
        <span className="text-white font-bold text-lg tracking-tight">StreamTV</span>
      </div>

      {/* Search bar */}
      <div className="flex-1 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="flex">
          <div className={`flex flex-1 border rounded-l-full overflow-hidden ${focused ? "border-blue-500 shadow-lg shadow-blue-900/30" : "border-gray-600"}`}>
            <input
              ref={inputRef}
              data-tv-id="search-input"
              type="search"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onFocus={onFocus}
              placeholder="Search"
              className="search-input flex-1 bg-[#121212] text-white px-4 py-2 text-sm focus:outline-none placeholder-gray-500"
            />
          </div>
          <button
            data-tv-id="search-btn"
            type="submit"
            className="bg-[#222222] hover:bg-[#2a2a2a] border border-l-0 border-gray-600 px-4 py-2 rounded-r-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {/* Voice search */}
          <button
            data-tv-id="voice-btn"
            type="button"
            className="ml-3 w-10 h-10 rounded-full bg-[#222222] hover:bg-[#2a2a2a] flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-4">
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500">
          <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
        <button
          data-tv-id="sign-in"
          className="flex items-center gap-2 border border-blue-500 text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-950 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
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
