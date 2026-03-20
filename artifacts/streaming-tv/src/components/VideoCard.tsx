import { Video } from "@/data/videos";

interface VideoCardProps {
  video: Video;
  focused?: boolean;
  onFocus?: () => void;
  onClick?: () => void;
  "data-tv-id"?: string;
}

function ChannelAvatar({ initials }: { initials: string }) {
  const colors = [
    "bg-red-600", "bg-blue-600", "bg-green-600", "bg-purple-600",
    "bg-orange-600", "bg-teal-600", "bg-pink-600", "bg-indigo-600",
  ];
  const color = colors[initials.charCodeAt(0) % colors.length];
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${color}`}>
      {initials.slice(0, 2)}
    </div>
  );
}

export function VideoCard({ video, focused, onFocus, onClick, "data-tv-id": tvId }: VideoCardProps) {
  return (
    <div
      data-tv-id={tvId}
      tabIndex={0}
      onFocus={onFocus}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`video-card cursor-pointer outline-none group ${focused ? "focused-item" : ""}`}
      style={{ borderRadius: "6px" }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-lg mb-2 bg-gray-800">
        <div
          className={`video-thumbnail w-full aspect-video bg-gradient-to-br ${video.thumbnail} flex items-center justify-center`}
        >
          {video.badge && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              {video.badge}
            </div>
          )}
          <svg className="w-12 h-12 text-white opacity-40 group-hover:opacity-60 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-1.5 right-1.5">
          {video.isLive ? (
            <span className="live-badge">LIVE</span>
          ) : (
            <span className="bg-black bg-opacity-90 text-white text-xs px-1 py-0.5 rounded font-medium">
              {video.duration}
            </span>
          )}
        </div>
      </div>

      {/* Video info */}
      <div className="flex gap-2.5">
        <ChannelAvatar initials={video.channelAvatar} />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white leading-snug line-clamp-2 mb-1 group-hover:text-blue-300 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-gray-400 hover:text-gray-300 transition-colors truncate">
            {video.channel}
          </p>
          {video.isLive ? (
            <p className="text-xs text-gray-400">{video.watchingCount} watching</p>
          ) : (
            <p className="text-xs text-gray-400">
              {video.views} views · {video.publishedAt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface ShortCardProps {
  video: Video;
  focused?: boolean;
  onFocus?: () => void;
  onClick?: () => void;
  "data-tv-id"?: string;
}

export function ShortCard({ video, focused, onFocus, onClick, "data-tv-id": tvId }: ShortCardProps) {
  return (
    <div
      data-tv-id={tvId}
      tabIndex={0}
      onFocus={onFocus}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`video-card cursor-pointer outline-none group ${focused ? "focused-item" : ""}`}
      style={{ borderRadius: "6px" }}
    >
      {/* Portrait thumbnail */}
      <div className="relative overflow-hidden rounded-xl mb-2 bg-gray-800">
        <div
          className={`video-thumbnail w-full bg-gradient-to-b ${video.thumbnail} flex items-center justify-center`}
          style={{ aspectRatio: "9/16" }}
        >
          <svg className="w-10 h-10 text-white opacity-40 group-hover:opacity-60 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          {/* Shorts indicator */}
          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-white text-xs font-medium line-clamp-2 leading-tight drop-shadow-lg">
              {video.title}
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-400">{video.views} views</p>
      </div>
    </div>
  );
}
