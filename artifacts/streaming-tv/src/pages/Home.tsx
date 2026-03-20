import { useState, useCallback, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { CategoryTabs } from "@/components/CategoryTabs";
import { VideoCard, ShortCard } from "@/components/VideoCard";
import { mainVideos, shorts, categories } from "@/data/videos";

const COLS = 6;
const SHORTS_COLS = 9;

type FocusZone = "header" | "categories" | "videos" | "shorts";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedZone, setFocusedZone] = useState<FocusZone>("videos");
  const [focusedCatIndex, setFocusedCatIndex] = useState(0);
  const [focusedVideoRow, setFocusedVideoRow] = useState(0);
  const [focusedVideoCol, setFocusedVideoCol] = useState(0);
  const [focusedShortIndex, setFocusedShortIndex] = useState(0);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const filteredVideos = mainVideos.filter(
    (v) =>
      (selectedCategory === "All" || v.category === selectedCategory) &&
      (searchQuery === "" || v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.channel.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredShorts = shorts.filter(
    (s) =>
      searchQuery === "" || s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const videoRows = Math.ceil(filteredVideos.length / COLS);

  const getVideoAtPosition = useCallback(
    (row: number, col: number) => {
      const index = row * COLS + col;
      return filteredVideos[index];
    },
    [filteredVideos]
  );

  const getCatColsInRow = useCallback(() => categories.length, []);
  const getVideoColsInRow = useCallback((row: number) => {
    const remaining = filteredVideos.length - row * COLS;
    return Math.min(COLS, remaining);
  }, [filteredVideos]);
  const getShortColsInRow = useCallback(() => Math.min(SHORTS_COLS, filteredShorts.length), [filteredShorts]);

  // Focus a specific element by TV id
  const focusEl = useCallback((id: string) => {
    const el = document.querySelector(`[data-tv-id="${id}"]`) as HTMLElement;
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, []);

  // Arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", " "].includes(key)) {
        e.preventDefault();
      } else {
        return;
      }

      if (focusedZone === "categories") {
        if (key === "ArrowLeft") {
          const newIdx = Math.max(0, focusedCatIndex - 1);
          setFocusedCatIndex(newIdx);
          focusEl(`cat-${newIdx}`);
        } else if (key === "ArrowRight") {
          const newIdx = Math.min(categories.length - 1, focusedCatIndex + 1);
          setFocusedCatIndex(newIdx);
          focusEl(`cat-${newIdx}`);
        } else if (key === "ArrowDown") {
          setFocusedZone("videos");
          setFocusedVideoRow(0);
          setFocusedVideoCol(0);
          focusEl(`video-0`);
        } else if (key === "ArrowUp") {
          setFocusedZone("header");
          focusEl("search-input");
        } else if (key === "Enter" || key === " ") {
          setSelectedCategory(categories[focusedCatIndex]);
        }
        return;
      }

      if (focusedZone === "header") {
        if (key === "ArrowDown") {
          setFocusedZone("categories");
          setFocusedCatIndex(0);
          focusEl("cat-0");
        }
        return;
      }

      if (focusedZone === "videos") {
        const colsInRow = getVideoColsInRow(focusedVideoRow);

        if (key === "ArrowLeft") {
          if (focusedVideoCol > 0) {
            const newCol = focusedVideoCol - 1;
            setFocusedVideoCol(newCol);
            const idx = focusedVideoRow * COLS + newCol;
            focusEl(`video-${idx}`);
          }
        } else if (key === "ArrowRight") {
          if (focusedVideoCol < colsInRow - 1) {
            const newCol = focusedVideoCol + 1;
            setFocusedVideoCol(newCol);
            const idx = focusedVideoRow * COLS + newCol;
            focusEl(`video-${idx}`);
          }
        } else if (key === "ArrowUp") {
          if (focusedVideoRow > 0) {
            const newRow = focusedVideoRow - 1;
            const newCols = getVideoColsInRow(newRow);
            const newCol = Math.min(focusedVideoCol, newCols - 1);
            setFocusedVideoRow(newRow);
            setFocusedVideoCol(newCol);
            const idx = newRow * COLS + newCol;
            focusEl(`video-${idx}`);
          } else {
            setFocusedZone("categories");
            setFocusedCatIndex(0);
            focusEl("cat-0");
          }
        } else if (key === "ArrowDown") {
          if (focusedVideoRow < videoRows - 1) {
            const newRow = focusedVideoRow + 1;
            const newCols = getVideoColsInRow(newRow);
            const newCol = Math.min(focusedVideoCol, newCols - 1);
            setFocusedVideoRow(newRow);
            setFocusedVideoCol(newCol);
            const idx = newRow * COLS + newCol;
            focusEl(`video-${idx}`);
          } else if (filteredShorts.length > 0) {
            setFocusedZone("shorts");
            setFocusedShortIndex(0);
            focusEl("short-0");
          }
        } else if (key === "Enter" || key === " ") {
          const video = getVideoAtPosition(focusedVideoRow, focusedVideoCol);
          if (video) setSelectedVideoId(video.id);
        }
        return;
      }

      if (focusedZone === "shorts") {
        const shortCols = getShortColsInRow();

        if (key === "ArrowLeft") {
          if (focusedShortIndex > 0) {
            const newIdx = focusedShortIndex - 1;
            setFocusedShortIndex(newIdx);
            focusEl(`short-${newIdx}`);
          }
        } else if (key === "ArrowRight") {
          if (focusedShortIndex < shortCols - 1) {
            const newIdx = focusedShortIndex + 1;
            setFocusedShortIndex(newIdx);
            focusEl(`short-${newIdx}`);
          }
        } else if (key === "ArrowUp") {
          setFocusedZone("videos");
          const lastRow = videoRows - 1;
          setFocusedVideoRow(lastRow);
          const newCols = getVideoColsInRow(lastRow);
          const newCol = Math.min(focusedShortIndex, newCols - 1);
          setFocusedVideoCol(newCol);
          const idx = lastRow * COLS + newCol;
          focusEl(`video-${idx}`);
        } else if (key === "ArrowDown") {
          // End of page
        } else if (key === "Enter" || key === " ") {
          const short = filteredShorts[focusedShortIndex];
          if (short) setSelectedVideoId(short.id);
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedZone, focusedCatIndex, focusedVideoRow, focusedVideoCol, focusedShortIndex,
      filteredVideos, filteredShorts, videoRows, getVideoColsInRow, getShortColsInRow,
      getVideoAtPosition, focusEl]);

  // Initial focus
  useEffect(() => {
    focusEl("video-0");
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        focused={focusedZone === "header"}
        onFocus={() => setFocusedZone("header")}
      />

      {/* Category tabs - fixed below header */}
      <div className="fixed top-[57px] left-0 right-0 z-40 bg-[#0f0f0f]">
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

      {/* Main content */}
      <div className="pt-[105px] px-4 pb-8">
        {/* Video grid */}
        <div
          className="grid gap-x-4 gap-y-6"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {filteredVideos.map((video, idx) => {
            const row = Math.floor(idx / COLS);
            const col = idx % COLS;
            const isFocused = focusedZone === "videos" && focusedVideoRow === row && focusedVideoCol === col;
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

        {/* Shorts section */}
        {filteredShorts.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-red-600 rounded-full" />
              <h2 className="text-xl font-bold text-white">Shorts</h2>
              <svg className="w-5 h-5 text-red-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.23-2.53-5.06-1.56L6 6.94c-1.29.68-2.06 2.03-1.97 3.49.09 1.46.98 2.73 2.34 3.27l1.2.5L6.06 15c-1.84.96-2.56 3.21-1.62 5.06.64 1.24 1.9 1.94 3.19 1.94.63 0 1.27-.16 1.86-.47l8.5-4.5c1.29-.68 2.06-2.03 1.97-3.49-.09-1.46-.98-2.72-2.19-3.22z" />
              </svg>
            </div>
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: `repeat(${SHORTS_COLS}, minmax(0, 1fr))` }}
            >
              {filteredShorts.map((short, idx) => {
                const isFocused = focusedZone === "shorts" && focusedShortIndex === idx;
                return (
                  <ShortCard
                    key={short.id}
                    video={short}
                    data-tv-id={`short-${idx}`}
                    focused={isFocused}
                    onFocus={() => {
                      setFocusedZone("shorts");
                      setFocusedShortIndex(idx);
                    }}
                    onClick={() => setSelectedVideoId(short.id)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedVideoId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setSelectedVideoId(null)}
        >
          <div
            className="bg-[#1a1a1a] rounded-xl overflow-hidden max-w-4xl w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video area */}
            <div className="relative bg-black aspect-video flex items-center justify-center">
              {(() => {
                const v = [...mainVideos, ...shorts].find((v) => v.id === selectedVideoId);
                return (
                  <div className={`w-full h-full bg-gradient-to-br ${v?.thumbnail || "from-gray-800 to-gray-900"} flex items-center justify-center`}>
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-black bg-opacity-60 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-opacity-80 transition-colors">
                        <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <p className="text-white text-lg font-medium px-4">{v?.title}</p>
                      <p className="text-gray-400 text-sm mt-1">{v?.channel}</p>
                    </div>
                  </div>
                );
              })()}
              <button
                autoFocus
                onClick={() => setSelectedVideoId(null)}
                onKeyDown={(e) => {
                  if (e.key === "Escape" || e.key === "Backspace") {
                    setSelectedVideoId(null);
                  }
                }}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black bg-opacity-70 flex items-center justify-center text-white hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Info bar */}
            <div className="p-4">
              {(() => {
                const v = [...mainVideos, ...shorts].find((v) => v.id === selectedVideoId);
                return (
                  <div>
                    <h3 className="text-white font-semibold text-base">{v?.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{v?.channel} · {v?.views} views</p>
                    <p className="text-gray-500 text-xs mt-1">Press Esc or Back to close</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
