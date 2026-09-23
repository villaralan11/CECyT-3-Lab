"use client";

import { useEffect, useState, useCallback } from "react";

export type ProgressItem = {
  topicId: string;
  score: number;
  total: number;
  completed: boolean;
  attempts: number;
};

const STORAGE_KEY = "cecyt3-progress-v2";
const USER_KEY = "cecyt3-userId";

function getUserId(): string {
  if (typeof window === "undefined") return "anon";
  let id = localStorage.getItem(USER_KEY);
  if (!id) {
    id = `anon-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(USER_KEY, id);
  }
  return id;
}

function loadLocal(): Record<string, ProgressItem> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveLocal(data: Record<string, ProgressItem>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProgress() {
  const [userId, setUserId] = useState<string>("anon");
  const [progress, setProgress] = useState<Record<string, ProgressItem>>({});
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const id = getUserId();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserId(id);
    setProgress(loadLocal());
    // intenta cargar del backend si está configurado
    fetch(`/api/progress?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.progress?.length) {
          const map: Record<string, ProgressItem> = {};
          for (const p of d.progress) {
            map[p.topicId] = { topicId: p.topicId, score: p.score, total: p.total, completed: p.completed, attempts: p.attempts };
          }
          setProgress(map);
          saveLocal(map);
        }
      })
      .catch(() => {});
  }, []);

  const save = useCallback(
    async (topicId: string, score: number, total: number) => {
      const completed = score === total && total > 0;
      const prev = loadLocal();
      const prevItem = prev[topicId];
      const next: ProgressItem = {
        topicId,
        score: Math.max(prevItem?.score ?? 0, score),
        total,
        completed: completed || prevItem?.completed || false,
        attempts: (prevItem?.attempts ?? 0) + 1,
      };
      const updated = { ...prev, [topicId]: next };
      saveLocal(updated);
      setProgress(updated);
      setIsSyncing(true);
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, topicId, score: next.score, total, completed: next.completed }),
        });
      } catch {}
      setIsSyncing(false);
    },
    [userId]
  );

  const migrate = useCallback(async () => {
    const local = loadLocal();
    // migra todo lo del localStorage viejo cecyt3-lab-v3 si existe
    const legacy = (() => {
      try {
        return JSON.parse(localStorage.getItem("cecyt3-lab-v3") || "null");
      } catch {
        return null;
      }
    })();
    if (legacy && typeof legacy === "object") {
      // legacy es { acts, solved, log ...} — no mapeable directo, solo avisa
      console.log("[progress] legacy found", legacy);
    }
    for (const [topicId, item] of Object.entries(local)) {
      await save(topicId, item.score, item.total);
    }
  }, [save]);

  const exportJSON = useCallback(() => {
    const data = loadLocal();
    const blob = new Blob([JSON.stringify({ userId, progress: data, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cecyt3-progreso-${userId}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [userId]);

  return { userId, progress, save, migrate, exportJSON, isSyncing };
}
