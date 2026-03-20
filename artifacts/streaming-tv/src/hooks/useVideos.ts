import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface FirestoreVideo {
  id?: string;
  title: string;
  channel: string;
  channelAvatar: string;
  thumbnailUrl: string;
  embedUrl: string;
  views: string;
  duration: string;
  publishedAt: string;
  category: string;
  section: "movies" | "series" | "all";
  isLive?: boolean;
  watchingCount?: string;
  description?: string;
  createdAt?: any;
}

export function useVideos() {
  const [videos, setVideos] = useState<FirestoreVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<FirestoreVideo, "id">),
        }));
        setVideos(docs);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const addVideo = async (video: Omit<FirestoreVideo, "id" | "createdAt">) => {
    await addDoc(collection(db, "videos"), {
      ...video,
      createdAt: serverTimestamp(),
    });
  };

  const deleteVideo = async (id: string) => {
    await deleteDoc(doc(db, "videos", id));
  };

  const updateVideo = async (id: string, data: Partial<FirestoreVideo>) => {
    await updateDoc(doc(db, "videos", id), data);
  };

  return { videos, loading, error, addVideo, deleteVideo, updateVideo };
}
