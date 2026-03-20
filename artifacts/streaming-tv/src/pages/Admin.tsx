import { useState } from "react";
import { useVideos, FirestoreVideo } from "@/hooks/useVideos";
import { categories } from "@/data/videos";

const CHANNELS = ["VJ ADAMSON", "CONFIDENTIAL", "VJ PILES UG"];
const CHANNEL_AVATARS: Record<string, string> = {
  "VJ ADAMSON": "VA",
  "CONFIDENTIAL": "CF",
  "VJ PILES UG": "VP",
};
const CHANNEL_COLORS: Record<string, string> = {
  "VJ ADAMSON": "bg-amber-600",
  "CONFIDENTIAL": "bg-slate-600",
  "VJ PILES UG": "bg-orange-600",
};
const SECTIONS: { value: "all" | "movies" | "series"; label: string }[] = [
  { value: "all", label: "General" },
  { value: "movies", label: "Movie" },
  { value: "series", label: "Series" },
];

const THUMB_GRADIENTS = [
  "from-amber-800 to-amber-950",
  "from-slate-700 to-slate-950",
  "from-orange-700 to-orange-950",
  "from-sky-800 to-sky-950",
  "from-green-700 to-green-950",
  "from-indigo-700 to-indigo-950",
  "from-rose-700 to-rose-950",
  "from-violet-700 to-violet-950",
  "from-cyan-700 to-cyan-950",
  "from-teal-700 to-teal-950",
  "from-pink-700 to-pink-950",
  "from-fuchsia-700 to-fuchsia-950",
  "from-red-700 to-red-950",
  "from-blue-700 to-blue-950",
  "from-purple-700 to-purple-950",
];

const EMPTY_FORM = {
  title: "",
  channel: "VJ ADAMSON",
  thumbnailUrl: "",
  embedUrl: "",
  views: "0",
  duration: "",
  publishedAt: "",
  category: "All",
  section: "all" as "all" | "movies" | "series",
  isLive: false,
  watchingCount: "",
  description: "",
  thumbnailGradient: THUMB_GRADIENTS[0],
};

function InputField({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
        {!required && <span className="text-gray-600 text-xs font-normal ml-1">(optional)</span>}
      </label>
      {children}
      {hint && <p className="text-gray-600 text-xs mt-1">{hint}</p>}
    </div>
  );
}

export default function Admin() {
  const { videos, loading, addVideo, deleteVideo, updateVideo } = useVideos();
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"add" | "manage">("add");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState("");
  const [authed, setAuthed] = useState(false);

  // Edit state
  const [editingVideo, setEditingVideo] = useState<FirestoreVideo | null>(null);
  const [editForm, setEditForm] = useState<Partial<typeof EMPTY_FORM>>({});
  const [editSaving, setEditSaving] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  // Simple admin gate
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="bg-[#141414] rounded-2xl p-8 w-full max-w-sm border border-gray-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <img src="/play-button.png" alt="" className="w-8 h-8" />
            <h1 className="text-white text-xl font-bold">NexStream Admin</h1>
          </div>
          <p className="text-gray-400 text-sm mb-4">Enter admin password to continue</p>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && adminKey === "nexadmin123") setAuthed(true); }}
            placeholder="Admin password"
            className="w-full bg-[#1e1e1e] border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 mb-3"
          />
          <button
            onClick={() => { if (adminKey === "nexadmin123") setAuthed(true); }}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            Login
          </button>
          <p className="text-gray-600 text-xs mt-3 text-center">Default password: nexadmin123</p>
          <a href="/" className="block text-center text-blue-400 hover:text-blue-300 text-xs mt-3 transition-colors">
            ← Back to site
          </a>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.embedUrl) return;
    setSaving(true);
    try {
      await addVideo({
        title: form.title,
        channel: form.channel,
        channelAvatar: CHANNEL_AVATARS[form.channel] ?? form.channel.slice(0, 2).toUpperCase(),
        thumbnailUrl: form.thumbnailUrl || form.thumbnailGradient,
        embedUrl: form.embedUrl,
        views: form.views,
        duration: form.duration,
        publishedAt: form.publishedAt || "Just now",
        category: form.category,
        section: form.section,
        isLive: form.isLive,
        watchingCount: form.watchingCount,
        description: form.description,
      });
      setForm({ ...EMPTY_FORM });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (video: FirestoreVideo) => {
    setEditingVideo(video);
    setEditForm({
      title: video.title,
      channel: video.channel,
      thumbnailUrl: video.thumbnailUrl?.startsWith("from-") ? "" : (video.thumbnailUrl ?? ""),
      thumbnailGradient: video.thumbnailUrl?.startsWith("from-") ? video.thumbnailUrl : THUMB_GRADIENTS[0],
      embedUrl: video.embedUrl,
      views: video.views,
      duration: video.duration,
      publishedAt: video.publishedAt,
      category: video.category,
      section: video.section,
      isLive: video.isLive ?? false,
      watchingCount: video.watchingCount ?? "",
      description: video.description ?? "",
    });
  };

  const handleEditSave = async () => {
    if (!editingVideo?.id || !editForm.title || !editForm.embedUrl) return;
    setEditSaving(true);
    try {
      await updateVideo(editingVideo.id, {
        title: editForm.title,
        channel: editForm.channel ?? editingVideo.channel,
        channelAvatar: CHANNEL_AVATARS[editForm.channel ?? ""] ?? editingVideo.channelAvatar,
        thumbnailUrl: editForm.thumbnailUrl || editForm.thumbnailGradient || editingVideo.thumbnailUrl,
        embedUrl: editForm.embedUrl,
        views: editForm.views ?? editingVideo.views,
        duration: editForm.duration ?? editingVideo.duration,
        publishedAt: editForm.publishedAt ?? editingVideo.publishedAt,
        category: editForm.category ?? editingVideo.category,
        section: editForm.section ?? editingVideo.section,
        isLive: editForm.isLive ?? false,
        watchingCount: editForm.watchingCount ?? "",
        description: editForm.description ?? "",
      });
      setEditSuccess(true);
      setTimeout(() => {
        setEditSuccess(false);
        setEditingVideo(null);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setEditSaving(false);
    }
  };

  const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));
  const setEdit = (key: string, val: any) => setEditForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-[#0f0f0f] border-b border-gray-800 sticky top-0 z-10">
        <div className="flex items-center gap-2 md:gap-3">
          <img src="/play-button.png" alt="" className="w-7 h-7" />
          <span className="font-bold text-base md:text-lg text-white">NexStream</span>
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded ml-1">ADMIN</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-gray-400 text-xs md:text-sm hidden sm:inline">{videos.length} videos</span>
          <a
            href="/"
            className="flex items-center gap-1.5 border border-gray-600 hover:border-blue-500 text-gray-300 hover:text-white px-2.5 md:px-3 py-1.5 rounded-lg text-xs md:text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">View Site</span>
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Tab bar */}
        <div className="flex gap-2 mb-6 md:mb-8 border-b border-gray-800">
          {(["add", "manage"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-5 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-red-500 text-white"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab === "add" ? "Upload Video" : `Manage (${videos.length})`}
            </button>
          ))}
        </div>

        {/* ADD VIDEO FORM */}
        {activeTab === "add" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <div className="bg-[#141414] rounded-2xl border border-gray-800 p-5 md:p-6">
                <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                  Upload New Video
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <InputField label="Video Title" required>
                    <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Enter video title..." required className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-red-500 text-white rounded-lg px-4 py-2.5 text-sm outline-none transition-colors" />
                  </InputField>

                  <InputField label="Video Embed URL" required hint="Paste your video player embed URL (mediadelivery, YouTube embed, Vimeo embed, etc.)">
                    <input type="url" value={form.embedUrl} onChange={(e) => set("embedUrl", e.target.value)} placeholder="https://player.mediadelivery.net/embed/..." required className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-red-500 text-white rounded-lg px-4 py-2.5 text-sm outline-none transition-colors font-mono" />
                  </InputField>

                  <InputField label="Thumbnail Image URL" hint="Leave blank to use a colored gradient thumbnail">
                    <input type="url" value={form.thumbnailUrl} onChange={(e) => set("thumbnailUrl", e.target.value)} placeholder="https://example.com/thumbnail.jpg" className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-red-500 text-white rounded-lg px-4 py-2.5 text-sm outline-none transition-colors" />
                  </InputField>

                  {!form.thumbnailUrl && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Thumbnail Color</label>
                      <div className="flex flex-wrap gap-2">
                        {THUMB_GRADIENTS.map((g) => (
                          <button type="button" key={g} onClick={() => set("thumbnailGradient", g)} className={`w-8 h-8 rounded-lg bg-gradient-to-br ${g} transition-transform ${form.thumbnailGradient === g ? "ring-2 ring-white scale-110" : "hover:scale-105"}`} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Channel</label>
                      <select value={form.channel} onChange={(e) => set("channel", e.target.value)} className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-red-500 text-white rounded-lg px-3 py-2.5 text-sm outline-none">
                        {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
                      <select value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-red-500 text-white rounded-lg px-3 py-2.5 text-sm outline-none">
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Content Type</label>
                      <select value={form.section} onChange={(e) => set("section", e.target.value)} className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-red-500 text-white rounded-lg px-3 py-2.5 text-sm outline-none">
                        {SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Duration</label>
                      <input type="text" value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 1:45:00" className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-red-500 text-white rounded-lg px-4 py-2.5 text-sm outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Views</label>
                      <input type="text" value={form.views} onChange={(e) => set("views", e.target.value)} placeholder="e.g. 1.2M" className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-red-500 text-white rounded-lg px-4 py-2.5 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Published</label>
                      <input type="text" value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} placeholder="e.g. 2 days ago" className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-red-500 text-white rounded-lg px-4 py-2.5 text-sm outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                    <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Video description (optional)..." rows={3} className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-red-500 text-white rounded-lg px-4 py-2.5 text-sm outline-none resize-none" />
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <button type="button" onClick={() => set("isLive", !form.isLive)} className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${form.isLive ? "bg-red-600" : "bg-gray-700"}`}>
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isLive ? "translate-x-5" : ""}`} />
                    </button>
                    <label className="text-sm text-gray-300">Mark as LIVE stream</label>
                    {form.isLive && (
                      <input type="text" value={form.watchingCount} onChange={(e) => set("watchingCount", e.target.value)} placeholder="e.g. 1.2K watching" className="flex-1 min-w-0 bg-[#1e1e1e] border border-gray-700 focus:border-red-500 text-white rounded-lg px-3 py-1.5 text-sm outline-none" />
                    )}
                  </div>

                  <div className="pt-2">
                    <button type="submit" disabled={saving || !form.title || !form.embedUrl} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                      {saving ? (
                        <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
                      ) : (
                        <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>Upload Video</>
                      )}
                    </button>
                    {success && (
                      <div className="mt-3 flex items-center gap-2 bg-green-900/40 border border-green-700 text-green-400 px-4 py-2.5 rounded-xl text-sm">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Video uploaded successfully!
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Preview card */}
            <div>
              <div className="bg-[#141414] rounded-2xl border border-gray-800 p-5 sticky top-24">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Preview</h3>
                <div className="rounded-xl overflow-hidden mb-3 relative">
                  {form.thumbnailUrl ? (
                    <img src={form.thumbnailUrl} alt="Thumbnail preview" className="w-full aspect-video object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className={`w-full aspect-video bg-gradient-to-br ${form.thumbnailGradient} flex items-center justify-center`}>
                      <img src="/play-button.png" alt="Play" className="w-12 h-12 opacity-60" />
                    </div>
                  )}
                  {form.isLive ? (
                    <span className="absolute bottom-2 right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">● LIVE</span>
                  ) : form.duration ? (
                    <span className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-1.5 py-0.5 rounded">{form.duration}</span>
                  ) : null}
                  {form.section !== "all" && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded uppercase">{form.section}</span>
                  )}
                </div>
                <div className="flex gap-2.5">
                  <div className={`w-9 h-9 rounded-full ${CHANNEL_COLORS[form.channel] || "bg-gray-600"} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {CHANNEL_AVATARS[form.channel] || "??"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white leading-snug line-clamp-2">{form.title || "Video title will appear here..."}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{form.channel}</p>
                    <p className="text-xs text-gray-500">{form.views || "0"} views · {form.publishedAt || "Just now"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MANAGE TAB */}
        {activeTab === "manage" && (
          <div>
            {loading ? (
              <div className="text-center py-20 text-gray-400">
                <svg className="animate-spin w-8 h-8 mx-auto mb-3 text-red-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading videos...
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-20">
                <img src="/play-button.png" alt="" className="w-16 h-16 opacity-20 mx-auto mb-4" />
                <p className="text-gray-400 text-lg font-medium">No videos yet</p>
                <p className="text-gray-600 text-sm mt-1">Upload your first video using the Upload tab</p>
                <button onClick={() => setActiveTab("add")} className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm transition-colors">
                  Upload Video
                </button>
              </div>
            ) : (
              <>
                {/* Mobile card list */}
                <div className="md:hidden space-y-3">
                  {videos.map((video) => (
                    <div key={video.id} className="bg-[#141414] rounded-xl border border-gray-800 p-4">
                      <div className="flex gap-3 mb-3">
                        {video.thumbnailUrl && !video.thumbnailUrl.startsWith("from-") ? (
                          <img src={video.thumbnailUrl} alt="" className="w-16 aspect-video object-cover rounded-lg flex-shrink-0" />
                        ) : (
                          <div className={`w-16 aspect-video rounded-lg bg-gradient-to-br ${video.thumbnailUrl || "from-gray-700 to-gray-900"} flex items-center justify-center flex-shrink-0`}>
                            <svg className="w-4 h-4 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-medium text-sm line-clamp-2">{video.title}</p>
                          {video.isLive && <span className="text-red-400 text-xs font-bold">● LIVE</span>}
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            <span className={`inline-block text-xs font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide ${video.section === "movies" ? "bg-blue-900/50 text-blue-400" : video.section === "series" ? "bg-purple-900/50 text-purple-400" : "bg-gray-800 text-gray-400"}`}>{video.section}</span>
                            <span className="text-gray-500 text-xs">{video.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-xs">{video.views} views</span>
                        <div className="flex items-center gap-2">
                          {deleteConfirm === video.id ? (
                            <>
                              <span className="text-gray-400 text-xs">Delete?</span>
                              <button onClick={async () => { await deleteVideo(video.id!); setDeleteConfirm(null); }} className="bg-red-600 hover:bg-red-700 text-white text-xs px-2.5 py-1 rounded-lg transition-colors">Yes</button>
                              <button onClick={() => setDeleteConfirm(null)} className="text-gray-400 hover:text-white text-xs px-2.5 py-1 rounded-lg border border-gray-700 transition-colors">No</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => openEdit(video)} className="flex items-center gap-1 text-gray-400 hover:text-blue-400 text-xs px-2.5 py-1.5 rounded-lg hover:bg-blue-900/20 border border-gray-700 hover:border-blue-600 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Edit
                              </button>
                              <button onClick={() => setDeleteConfirm(video.id ?? null)} className="flex items-center gap-1 text-gray-400 hover:text-red-400 text-xs px-2.5 py-1.5 rounded-lg hover:bg-red-900/20 border border-gray-700 hover:border-red-600 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden md:block bg-[#141414] rounded-2xl border border-gray-800 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider w-14">Thumb</th>
                        <th className="text-left px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">Title</th>
                        <th className="text-left px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Channel</th>
                        <th className="text-left px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">Type</th>
                        <th className="text-left px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Category</th>
                        <th className="text-left px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Views</th>
                        <th className="text-right px-5 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videos.map((video, i) => (
                        <tr key={video.id} className={`border-b border-gray-800/60 hover:bg-white/[0.02] transition-colors ${i === videos.length - 1 ? "border-b-0" : ""}`}>
                          <td className="px-5 py-3">
                            {video.thumbnailUrl && !video.thumbnailUrl.startsWith("from-") ? (
                              <img src={video.thumbnailUrl} alt="" className="w-12 aspect-video object-cover rounded-md" />
                            ) : (
                              <div className={`w-12 aspect-video rounded-md bg-gradient-to-br ${video.thumbnailUrl || "from-gray-700 to-gray-900"} flex items-center justify-center`}>
                                <svg className="w-4 h-4 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-white font-medium line-clamp-1 max-w-xs">{video.title}</p>
                            {video.isLive && <span className="text-red-400 text-xs font-bold">● LIVE</span>}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full ${CHANNEL_COLORS[video.channel] || "bg-gray-600"} flex items-center justify-center text-white text-xs font-bold`}>{video.channelAvatar}</div>
                              <span className="text-gray-300 text-xs">{video.channel}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${video.section === "movies" ? "bg-blue-900/50 text-blue-400" : video.section === "series" ? "bg-purple-900/50 text-purple-400" : "bg-gray-800 text-gray-400"}`}>{video.section}</span>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <span className="text-gray-400 text-xs">{video.category}</span>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <span className="text-gray-400 text-xs">{video.views}</span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            {deleteConfirm === video.id ? (
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-gray-400 text-xs">Sure?</span>
                                <button onClick={async () => { await deleteVideo(video.id!); setDeleteConfirm(null); }} className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">Yes, Delete</button>
                                <button onClick={() => setDeleteConfirm(null)} className="text-gray-300 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-gray-600 hover:border-gray-400 transition-colors">Cancel</button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEdit(video)}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-white bg-blue-900/30 hover:bg-blue-600 px-3 py-1.5 rounded-lg border border-blue-700 hover:border-blue-500 transition-colors"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(video.id ?? null)}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-white bg-red-900/30 hover:bg-red-600 px-3 py-1.5 rounded-lg border border-red-800 hover:border-red-500 transition-colors"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingVideo(null)} />
          <div className="relative bg-[#141414] border border-gray-700 rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 sticky top-0 bg-[#141414] z-10">
              <h2 className="text-white font-bold text-base flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Video
              </h2>
              <button onClick={() => setEditingVideo(null)} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Video Title <span className="text-red-500">*</span></label>
                <input type="text" value={editForm.title ?? ""} onChange={(e) => setEdit("title", e.target.value)} className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 text-white rounded-lg px-4 py-2.5 text-sm outline-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Embed URL <span className="text-red-500">*</span></label>
                <input type="url" value={editForm.embedUrl ?? ""} onChange={(e) => setEdit("embedUrl", e.target.value)} className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 text-white rounded-lg px-4 py-2.5 text-sm outline-none font-mono" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Thumbnail URL</label>
                <input type="url" value={editForm.thumbnailUrl ?? ""} onChange={(e) => setEdit("thumbnailUrl", e.target.value)} placeholder="https://example.com/thumbnail.jpg" className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 text-white rounded-lg px-4 py-2.5 text-sm outline-none" />
              </div>

              {!editForm.thumbnailUrl && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Thumbnail Color</label>
                  <div className="flex flex-wrap gap-2">
                    {THUMB_GRADIENTS.map((g) => (
                      <button type="button" key={g} onClick={() => setEdit("thumbnailGradient", g)} className={`w-8 h-8 rounded-lg bg-gradient-to-br ${g} transition-transform ${editForm.thumbnailGradient === g ? "ring-2 ring-white scale-110" : "hover:scale-105"}`} />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Channel</label>
                  <select value={editForm.channel ?? ""} onChange={(e) => setEdit("channel", e.target.value)} className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 text-white rounded-lg px-3 py-2.5 text-sm outline-none">
                    {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select value={editForm.category ?? ""} onChange={(e) => setEdit("category", e.target.value)} className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 text-white rounded-lg px-3 py-2.5 text-sm outline-none">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Content Type</label>
                  <select value={editForm.section ?? "all"} onChange={(e) => setEdit("section", e.target.value)} className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 text-white rounded-lg px-3 py-2.5 text-sm outline-none">
                    {SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Duration</label>
                  <input type="text" value={editForm.duration ?? ""} onChange={(e) => setEdit("duration", e.target.value)} placeholder="e.g. 1:45:00" className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 text-white rounded-lg px-4 py-2.5 text-sm outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Views</label>
                  <input type="text" value={editForm.views ?? ""} onChange={(e) => setEdit("views", e.target.value)} className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 text-white rounded-lg px-4 py-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Published</label>
                  <input type="text" value={editForm.publishedAt ?? ""} onChange={(e) => setEdit("publishedAt", e.target.value)} className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 text-white rounded-lg px-4 py-2.5 text-sm outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={editForm.description ?? ""} onChange={(e) => setEdit("description", e.target.value)} rows={3} className="w-full bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 text-white rounded-lg px-4 py-2.5 text-sm outline-none resize-none" />
              </div>

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setEdit("isLive", !editForm.isLive)} className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${editForm.isLive ? "bg-red-600" : "bg-gray-700"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${editForm.isLive ? "translate-x-5" : ""}`} />
                </button>
                <label className="text-sm text-gray-300">Mark as LIVE</label>
                {editForm.isLive && (
                  <input type="text" value={editForm.watchingCount ?? ""} onChange={(e) => setEdit("watchingCount", e.target.value)} placeholder="e.g. 1.2K watching" className="flex-1 bg-[#1e1e1e] border border-gray-700 focus:border-blue-500 text-white rounded-lg px-3 py-1.5 text-sm outline-none" />
                )}
              </div>

              {/* Save button */}
              <div className="pt-2 flex gap-3">
                <button onClick={() => setEditingVideo(null)} className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={editSaving || !editForm.title || !editForm.embedUrl}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {editSaving ? (
                    <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
                  ) : editSuccess ? (
                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Saved!</>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
