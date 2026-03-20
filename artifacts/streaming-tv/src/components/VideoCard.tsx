export interface VideoCardData {
  id: string;
  title: string;
  channel: string;
  channelAvatar: string;
  thumbnail: string;
  views: string;
  duration: string;
  publishedAt: string;
  isLive?: boolean;
  section: "movies" | "series" | "all";
  watchingCount?: string;
  embedUrl?: string;
  category?: string;
}

interface VideoCardProps {
  video: VideoCardData;
  focused?: boolean;
  onFocus?: () => void;
  onClick?: () => void;
  "data-tv-id"?: string;
}

const CHANNEL_COLORS: Record<string, string> = {
  VA: "bg-amber-600",
  CF: "bg-slate-600",
  VP: "bg-orange-600",
};

function ChannelAvatar({ initials, channel }: { initials: string; channel: string }) {
  const color = CHANNEL_COLORS[initials] ?? "bg-red-700";
  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${color}`}
      title={channel}
    >
      {initials}
    </div>
  );
}

export function VideoCard({ video, focused, onFocus, onClick, "data-tv-id": tvId }: VideoCardProps) {
  const isRealImage = video.thumbnail && !video.thumbnail.startsWith("from-");

  return (
    <div
      data-tv-id={tvId}
      tabIndex={0}
      onFocus={onFocus}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); }
      }}
      className={`video-card cursor-pointer outline-none group rounded-lg transition-all duration-200
        ${focused ? "ring-2 ring-red-500 scale-[1.02]" : "hover:scale-[1.02]"}`}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-xl mb-2 bg-gray-900">
        {isRealImage ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full aspect-video object-cover video-thumbnail"
          />
        ) : (
          <div className={`video-thumbnail w-full aspect-video bg-gradient-to-br ${video.thumbnail || "from-gray-800 to-gray-900"}`} />
        )}

        {/* Play overlay */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity
          ${focused ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          <img src="/play-button.png" alt="Play" className="w-14 h-14 object-contain drop-shadow-lg" />
        </div>

        {/* Duration / LIVE */}
        <div className="absolute bottom-1.5 right-1.5">
          {video.isLive ? (
            <span className="live-badge">● LIVE</span>
          ) : video.duration ? (
            <span className="bg-black/90 text-white text-xs px-1.5 py-0.5 rounded font-medium">
              {video.duration}
            </span>
          ) : null}
        </div>

        {/* Section badge */}
        {video.section !== "all" && (
          <div className="absolute top-2 left-2">
            <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide">
              {video.section}
            </span>
          </div>
        )}
      </div>

      {/* Info — title, avatar, channel name only */}
      <div className="flex gap-2.5">
        <ChannelAvatar initials={video.channelAvatar} channel={video.channel} />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white leading-snug line-clamp-2 mb-0.5 group-hover:text-red-400 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-gray-400 truncate">{video.channel}</p>
          {video.isLive && (
            <span className="live-badge text-xs mt-0.5 inline-block">● LIVE</span>
          )}
        </div>
      </div>
    </div>
  );
}
