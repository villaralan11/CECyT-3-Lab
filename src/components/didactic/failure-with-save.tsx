"use client";

import { useRef } from "react";
import { ProductiveFailureCard, type FailureItem } from "./productive-failure";
import { useProgress } from "@/hooks/use-progress";

/**
 * Wrapper cliente: las páginas de Química son server components (exportan
 * `metadata`) y no pueden usar el hook. Registra el intento inicial de la
 * falla productiva sin alterar el mejor puntaje (score 0, attempts +1).
 * Solo registra el primer intento por visita: «Reintentar» no infla el contador.
 */
export function FailureWithSave({
  data,
  accent = "fuchsia",
  topicId,
}: {
  data: FailureItem;
  accent?: "fuchsia" | "emerald" | "amber";
  topicId: string;
}) {
  const { save } = useProgress();
  const savedRef = useRef(false);

  const handleSolved = () => {
    if (savedRef.current) return;
    savedRef.current = true;
    save(topicId, 0, 1);
  };

  return (
    <ProductiveFailureCard
      data={data}
      accent={accent}
      onSolved={handleSolved}
    />
  );
}
