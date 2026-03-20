import { Video } from "@/data/videos";

interface VideoCardProps {
  video: Video;
  focused?: boolean;
  onFocus?: () => void;
  onClick?: () => void;
  "data-tv-id"?: string;
}

function ChannelAvatar({ initials, name }: { initials: string; name: string }) {
  const colorMap: Record<string, string> = {
    VA: "bg-amber-600",
    CF: "bg-slate-600",
    VP: "bg-orange-600",
  };
  const color = colorMap[initials] ?? "bg-red-600";
  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${color}`}
      title={name}
    >
      {initials}
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
      className={`video-card cursor-pointer outline-none group rounded-lg transition-all duration-200
        ${focused ? "ring-2 ring-red-500 scale-[1.02]" : "hover:scale-[1.02]"}
      `}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-xl mb-2 bg-gray-900">
        <div
          className={`video-thumbnail w-full aspect-video bg-gradient-to-br ${video.thumbnail} flex items-center justify-center`}
        >
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <img src="/play-button.png" alt="Play" className="w-16 h-16 object-contain drop-shadow-lg" />
          </div>
          {focused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <img src="/play-button.png" alt="Play" className="w-16 h-16 object-contain drop-shadow-lg" />
            </div>
          )}
        </div>

        {/* Duration / LIVE badge */}
        <div className="absolute bottom-1.5 right-1.5">
          {video.isLive ? (
            <span className="live-badge">● LIVE</span>
          ) : (
            <span className="bg-black/90 text-white text-xs px-1.5 py-0.5 rounded font-medium">
              {video.duration}
            </span>
          )}
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

      {/* Video info */}
      <div className="flex gap-2.5">
        <ChannelAvatar initials={video.channelAvatar} name={video.channel} />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white leading-snug line-clamp-2 mb-0.5 group-hover:text-red-400 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-gray-400 truncate">{video.channel}</p>
          {video.isLive ? (
            <p className="text-xs text-red-400 font-medium">{video.watchingCount} watching</p>
          ) : (
            <p className="text-xs text-gray-500">{video.views} views · {video.publishedAt}</p>
          )}
        </div>
      </div>
    </div>
  );
}
