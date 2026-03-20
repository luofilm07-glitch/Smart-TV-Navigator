import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/Header";
import { CategoryTabs } from "@/components/CategoryTabs";
import { VideoCard } from "@/components/VideoCard";
import { Sidebar } from "@/components/Sidebar";
import { mainVideos, categories } from "@/data/videos";
import { EMBED_URL } from "@/data/videos";

type SidebarSection = "all" | "movies" | "series";
type FocusZone = "header" | "sidebar" | "categories" | "videos";

const COLS = 4;

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<SidebarSection>("all");
  const [focusedZone, setFocusedZone] = useState<FocusZone>("videos");
  const [focusedCatIndex, setFocusedCatIndex] = useState(0);
  const [focusedVideoRow, setFocusedVideoRow] = useState(0);
  const [focusedVideoCol, setFocusedVideoCol] = useState(0);
  const [focusedSidebarItem, setFocusedSidebarItem] = useState<string>("");
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const sidebarItems = ["sidebar-all", "sidebar-movies", "sidebar-series"];

  const filteredVideos = mainVideos.filter((v) => {
    const matchesSection = activeSection === "all" || v.section === activeSection;
    const matchesCategory = selectedCategory === "All" || v.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSection && matchesCategory && matchesSearch;
  });

  const videoRows = Math.ceil(filteredVideos.length / COLS);

  const getVideoColsInRow = useCallback(
    (row: number) => {
      const remaining = filteredVideos.length - row * COLS;
      return Math.min(COLS, Math.max(0, remaining));
    },
    [filteredVideos]
  );

  const focusEl = useCallback((id: string) => {
    const el = document.querySelector(`[data-tv-id="${id}"]`) as HTMLElement;
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", " ", "Escape", "Backspace"].includes(e.key)) return;

      // Close modal
      if ((e.key === "Escape" || e.key === "Backspace") && selectedVideoId) {
        e.preventDefault();
        setSelectedVideoId(null);
        return;
      }

      if (selectedVideoId) return;

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (focusedZone === "header") {
        if (e.key === "ArrowDown") {
          setFocusedZone("categories");
          setFocusedCatIndex(0);
          focusEl("cat-0");
        }
        return;
      }

      if (focusedZone === "categories") {
        if (e.key === "ArrowLeft") {
          if (focusedCatIndex > 0) {
            const n = focusedCatIndex - 1;
            setFocusedCatIndex(n);
            focusEl(`cat-${n}`);
          } else {
            setFocusedZone("sidebar");
            const idx = sidebarItems.indexOf(`sidebar-${activeSection}`);
            const id = sidebarItems[Math.max(0, idx)];
            setFocusedSidebarItem(id);
            focusEl(id);
          }
        } else if (e.key === "ArrowRight") {
          const n = Math.min(categories.length - 1, focusedCatIndex + 1);
          setFocusedCatIndex(n);
          focusEl(`cat-${n}`);
        } else if (e.key === "ArrowUp") {
          setFocusedZone("header");
          focusEl("search-input");
        } else if (e.key === "ArrowDown") {
          setFocusedZone("videos");
          setFocusedVideoRow(0);
          setFocusedVideoCol(0);
          focusEl("video-0");
        } else if (e.key === "Enter" || e.key === " ") {
          setSelectedCategory(categories[focusedCatIndex]);
        }
        return;
      }

      if (focusedZone === "sidebar") {
        const currentIdx = sidebarItems.indexOf(focusedSidebarItem);
        if (e.key === "ArrowDown") {
          const n = Math.min(sidebarItems.length - 1, currentIdx + 1);
          setFocusedSidebarItem(sidebarItems[n]);
          focusEl(sidebarItems[n]);
        } else if (e.key === "ArrowUp") {
          if (currentIdx > 0) {
            const n = currentIdx - 1;
            setFocusedSidebarItem(sidebarItems[n]);
            focusEl(sidebarItems[n]);
          } else {
            setFocusedZone("header");
            focusEl("search-input");
          }
        } else if (e.key === "ArrowRight") {
          setFocusedZone("categories");
          setFocusedCatIndex(0);
          focusEl("cat-0");
        } else if (e.key === "Enter" || e.key === " ") {
          const id = focusedSidebarItem.replace("sidebar-", "") as SidebarSection;
          setActiveSection(id);
        }
        return;
      }

      if (focusedZone === "videos") {
        const colsInRow = getVideoColsInRow(focusedVideoRow);

        if (e.key === "ArrowLeft") {
          if (focusedVideoCol > 0) {
            const nc = focusedVideoCol - 1;
            setFocusedVideoCol(nc);
            focusEl(`video-${focusedVideoRow * COLS + nc}`);
          } else {
            setFocusedZone("sidebar");
            const idx = sidebarItems.indexOf(`sidebar-${activeSection}`);
            const id = sidebarItems[Math.max(0, idx)];
            setFocusedSidebarItem(id);
            focusEl(id);
          }
        } else if (e.key === "ArrowRight") {
          if (focusedVideoCol < colsInRow - 1) {
            const nc = focusedVideoCol + 1;
            setFocusedVideoCol(nc);
            focusEl(`video-${focusedVideoRow * COLS + nc}`);
          }
        } else if (e.key === "ArrowUp") {
          if (focusedVideoRow > 0) {
            const nr = focusedVideoRow - 1;
            const nc = Math.min(focusedVideoCol, getVideoColsInRow(nr) - 1);
            setFocusedVideoRow(nr);
            setFocusedVideoCol(nc);
            focusEl(`video-${nr * COLS + nc}`);
          } else {
            setFocusedZone("categories");
            setFocusedCatIndex(0);
            focusEl("cat-0");
          }
        } else if (e.key === "ArrowDown") {
          if (focusedVideoRow < videoRows - 1) {
            const nr = focusedVideoRow + 1;
            const nc = Math.min(focusedVideoCol, getVideoColsInRow(nr) - 1);
            setFocusedVideoRow(nr);
            setFocusedVideoCol(nc);
            focusEl(`video-${nr * COLS + nc}`);
          }
        } else if (e.key === "Enter" || e.key === " ") {
          const video = filteredVideos[focusedVideoRow * COLS + focusedVideoCol];
          if (video) setSelectedVideoId(video.id);
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    focusedZone, focusedCatIndex, focusedVideoRow, focusedVideoCol,
    focusedSidebarItem, activeSection, filteredVideos, videoRows,
    getVideoColsInRow, focusEl, selectedVideoId,
  ]);

  // Initial focus on mount
  useEffect(() => {
    setTimeout(() => focusEl("video-0"), 100);
  }, []);

  const selectedVideo = selectedVideoId
    ? [...mainVideos].find((v) => v.id === selectedVideoId)
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header
        onSearch={(q) => { setSearchQuery(q); }}
        searchQuery={searchQuery}
        focused={focusedZone === "header"}
        onFocus={() => setFocusedZone("header")}
      />

      <Sidebar
        activeSection={activeSection}
        onChange={(s) => {
          setActiveSection(s);
          setFocusedVideoRow(0);
          setFocusedVideoCol(0);
        }}
        focusedItem={focusedZone === "sidebar" ? focusedSidebarItem : undefined}
        onFocus={(id) => {
          setFocusedZone("sidebar");
          setFocusedSidebarItem(id);
        }}
      />

      {/* Main area - offset for header + sidebar */}
      <div className="ml-[220px] pt-[57px]">
        {/* Category tabs - sticky below header */}
        <div className="sticky top-[57px] z-30 bg-[#0a0a0a] border-b border-gray-800/60">
          <CategoryTabs
            selected={selectedCategory}
            onChange={(cat) => {
              setSelectedCategory(cat);
              setFocusedVideoRow(0);
              setFocusedVideoCol(0);
            }}
            focusedIndex={focusedZone === "categories" ? focusedCatIndex : undefined}
            onFocus={(idx) => {
              setFocusedZone("categories");
              setFocusedCatIndex(idx);
            }}
          />
        </div>

        {/* Video grid */}
        <div className="p-5 pb-12">
          {filteredVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <img src="/play-button.png" alt="" className="w-20 h-20 opacity-20 mb-4" />
              <p className="text-gray-400 text-lg font-medium">No videos found</p>
              <p className="text-gray-600 text-sm mt-1">Try a different category or search term</p>
            </div>
          ) : (
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
            >
              {filteredVideos.map((video, idx) => {
                const row = Math.floor(idx / COLS);
                const col = idx % COLS;
                const isFocused =
                  focusedZone === "videos" &&
                  focusedVideoRow === row &&
                  focusedVideoCol === col;
                return (
                  <VideoCard
                    key={video.id}
                    video={video}
                    data-tv-id={`video-${idx}`}
                    focused={isFocused}
                    onFocus={() => {
                      setFocusedZone("videos");
                      setFocusedVideoRow(row);
                      setFocusedVideoCol(col);
                    }}
                    onClick={() => setSelectedVideoId(video.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Video Player Modal - fullscreen embed */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-3 bg-black/80 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center gap-3">
              <img src="/play-button.png" alt="" className="w-7 h-7 object-contain" />
              <div>
                <h2 className="text-white font-semibold text-sm line-clamp-1">{selectedVideo.title}</h2>
                <p className="text-gray-400 text-xs">{selectedVideo.channel}</p>
              </div>
            </div>
            <button
              autoFocus
              onClick={() => setSelectedVideoId(null)}
              onKeyDown={(e) => {
                if (e.key === "Escape" || e.key === "Backspace") setSelectedVideoId(null);
              }}
              className="flex items-center gap-2 text-gray-300 hover:text-white border border-gray-600 hover:border-red-500 px-3 py-1.5 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close (Esc)
            </button>
          </div>

          {/* Full embed */}
          <div className="flex-1 relative">
            <iframe
              src={selectedVideo.embedUrl || EMBED_URL}
              loading="lazy"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
