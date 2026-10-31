"use client";

import { useEffect, useState, useCallback } from "react";

type ProgressItem = {
  topicId: string;
  score: number;
  total: number;
  completed: boolean;
  attempts: number;
};

const STORAGE_KEY = "cecyt3-progress-v2";
const USER_KEY = "cecyt3-userId";
// Un tema se considera completado con ≥70% de dominio (score/total)
const COMPLETION_THRESHOLD = 0.7;

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
    // carga el progreso guardado en el servidor, si está disponible
    fetch(`/api/progress?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.progress?.length) {
          const map: Record<string, ProgressItem> = {};
          for (const p of d.progress) {
            map[p.topicId] = { topicId: p.topicId, score: p.score, total: p.total, completed: p.completed, attempts: p.attempts };
          }
          // fusiona: conserva el mejor avance entre servidor y local
          const local = loadLocal();
          const merged = { ...map };
          for (const [k, v] of Object.entries(local)) {
            const prev = merged[k];
            if (!prev || v.score > prev.score || (v.score === prev.score && v.attempts > prev.attempts)) {
              merged[k] = v;
            } else if (v.attempts > prev.attempts) {
              merged[k] = { ...prev, attempts: v.attempts };
            }
          }
          setProgress(merged);
          saveLocal(merged);
        }
      })
      .catch(() => {});
  }, []);

  const save = useCallback(
    async (topicId: string, score: number, total: number) => {
      const completed = total > 0 && score / total >= COMPLETION_THRESHOLD;
      const prev = loadLocal();
      const prevItem = prev[topicId];
      const next: ProgressItem = {
        topicId,
        // conserva el mejor puntaje de dominio sin degradar "completado"
        score: Math.max(prevItem?.score ?? 0, score),
        total: Math.max(prevItem?.total ?? 0, total),
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
          body: JSON.stringify({ userId, topicId, score: next.score, total: next.total, completed: next.completed }),
        });
      } catch {}
      setIsSyncing(false);
    },
    [userId]
  );

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

  const importJSON = useCallback((raw: string): boolean => {
    try {
      const j = JSON.parse(raw);
      const data = j?.progress && typeof j.progress === "object" ? j.progress : null;
      if (!data) return false;
      // valida la forma de cada entrada antes de sobrescribir
      for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
        if (typeof k !== "string" || !v || typeof v !== "object") return false;
      }
      const merged = { ...loadLocal(), ...(data as Record<string, ProgressItem>) };
      saveLocal(merged);
      setProgress(merged);
      return true;
    } catch {
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("cecyt3-lab-v3");
      localStorage.removeItem(USER_KEY);
    } catch {}
    setProgress({});
  }, []);

  return { userId, progress, save, exportJSON, importJSON, reset, isSyncing };
}
