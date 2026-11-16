"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, Bot, ExternalLink, FileText, Loader2, Plus, Send, Sparkles, Trash2, Upload, UserRound, X } from "lucide-react";

type Source = { id: string; title: string; content: string };
type Message = { role: "user" | "assistant"; content: string };
type DocMeta = { id: string; name: string; mime: string; size: number; createdAt: string };

const STARTER_SOURCES: Source[] = [
  { id: "starter-fisica", title: "Apunte de ejemplo · Física", content: "En un tiro parabólico, la componente horizontal de la velocidad permanece constante si se desprecia la resistencia del aire. En el punto más alto, la velocidad vertical es cero." },
];

const DOC_ACCEPT_ATTR = ".pdf,.docx,.pptx,.txt,.md";
const DOC_MAX_PER_USER = 12;
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

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SourceCard({ source, onRemove }: { source: Source; onRemove: () => void }) {
  return <article className="notebook-source-card"><div className="notebook-source-icon"><FileText size={17} /></div><div className="min-w-0 flex-1"><strong>{source.title}</strong><p>{source.content}</p></div><button type="button" onClick={onRemove} aria-label={`Eliminar ${source.title}`}><X size={16} /></button></article>;
}

export default function NotebookPage() {
  const [userId, setUserId] = useState("");
  const [sources, setSources] = useState<Source[]>(STARTER_SOURCES);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Documentos guardados en la BD (PDF/Word/PowerPoint/TXT/MD)
  const [docs, setDocs] = useState<DocMeta[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docError, setDocError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canAdd = title.trim().length > 1 && content.trim().length > 15;
  const hasContext = selectedDocs.size > 0 || sources.length > 0;
  const canAsk = question.trim().length > 2 && hasContext && !busy;
  const sourcePayload = useMemo(() => sources.map(({ title: sourceTitle, content: sourceContent }) => ({ title: sourceTitle, content: sourceContent })), [sources]);

  const refreshDocs = useCallback(async (uid: string, selectAll: boolean) => {
    try {
      const response = await fetch(`/api/documents?userId=${encodeURIComponent(uid)}`);
      const data = await response.json();
      if (response.ok && Array.isArray(data.documents)) {
        setDocs(data.documents);
        if (selectAll) setSelectedDocs(new Set(data.documents.map((d: DocMeta) => d.id)));
      }
    } catch {}
  }, []);

  useEffect(() => {
    const uid = getUserId();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserId(uid);
    setLoadingDocs(true);
    refreshDocs(uid, true).finally(() => setLoadingDocs(false));
  }, [refreshDocs]);

  const onUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !userId) return;
    setDocError(""); setUploading(true);
    try {
      const form = new FormData();
      form.append("userId", userId);
      form.append("file", file);
      const response = await fetch("/api/documents", { method: "POST", body: form });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "No se pudo subir el documento.");
      await refreshDocs(userId, false);
      if (data?.document?.id) setSelectedDocs((current) => new Set([...current, data.document.id]));
    } catch (uploadError) {
      setDocError(uploadError instanceof Error ? uploadError.message : "No se pudo subir el documento.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onDeleteDoc = async (doc: DocMeta) => {
    if (!confirm(`¿Eliminar "${doc.name}" de tu biblioteca?`)) return;
    setDocError("");
    try {
      const response = await fetch(`/api/documents/${doc.id}?userId=${encodeURIComponent(userId)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar.");
      setDocs((current) => current.filter((d) => d.id !== doc.id));
      setSelectedDocs((current) => {
        const next = new Set(current);
        next.delete(doc.id);
        return next;
      });
    } catch (deleteError) {
      setDocError(deleteError instanceof Error ? deleteError.message : "No se pudo eliminar.");
    }
  };

  const toggleDoc = (id: string) => {
    setSelectedDocs((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const addSource = () => {
    if (!canAdd) return;
    setSources((current) => [...current, { id: crypto.randomUUID(), title: title.trim(), content: content.trim() }]);
    setTitle(""); setContent(""); setError("");
  };

  const ask = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!canAsk) return;
    const currentQuestion = question.trim();
    setQuestion(""); setError(""); setBusy(true);
    const nextMessages = [...messages, { role: "user" as const, content: currentQuestion }];
    setMessages(nextMessages);
    try {
      const response = await fetch("/api/notebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion, sources: sourcePayload, messages, documentIds: [...selectedDocs], userId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo obtener una respuesta.");
      setMessages([...nextMessages, { role: "assistant", content: data.answer }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Ocurrió un error.");
      setMessages(messages);
    } finally { setBusy(false); }
  };

  return <div className="notebook-page"><section className="notebook-hero"><div className="notebook-hero-copy"><span className="notebook-eyebrow"><Sparkles size={14} /> NOTEBOOK CECYT · IA CON TUS FUENTES</span><h1>Estudia con una IA que <em>sí conoce tus apuntes.</em></h1><p>Sube tus PDF, Word o PowerPoint y consulta tus documentos. Después pregunta, pide explicaciones y conecta ideas sin salir de tu laboratorio virtual.</p><div className="notebook-hero-pills"><span><BookOpen size={14} /> Basada en tus fuentes</span><span><Bot size={14} /> Tutor paso a paso</span></div></div><div className="notebook-orbit-card"><div className="notebook-orbit"><span>?</span></div><small>Tu cuaderno inteligente</small><strong>Pregunta. Comprende. Avanza.</strong></div></section>

    <main className="notebook-layout"><aside className="notebook-sources"><div className="notebook-panel-heading"><div><span className="notebook-label">01 / DOCUMENTOS Y FUENTES</span><h2>Tu biblioteca</h2></div><span className="notebook-count">{docs.length}/{DOC_MAX_PER_USER}</span></div>
      <p className="notebook-muted">Sube documentos (PDF, Word, PowerPoint, TXT o MD, máx. 4 MB). La IA leerá los que tengas marcados y podrás abrirlos cuando quieras.</p>
      <input ref={fileInputRef} type="file" accept={DOC_ACCEPT_ATTR} className="sr-only" onChange={(event) => onUpload(event.target.files)} />
      <div className="notebook-upload-row">
        <button type="button" className="notebook-upload-btn" onClick={() => fileInputRef.current?.click()} disabled={uploading || docs.length >= DOC_MAX_PER_USER}>{uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} {uploading ? "Subiendo..." : "Subir documento"}</button>
      </div>
      {docError && <p className="notebook-error">{docError}</p>}
      <div className="notebook-docs-list">
        {loadingDocs ? <p className="notebook-muted"><Loader2 size={14} className="inline animate-spin" /> Cargando tu biblioteca...</p> : docs.length === 0 ? <p className="notebook-muted">Aún no subes documentos. Puedes empezar con uno o usar la fuente de texto de abajo.</p> : docs.map((doc) => (
          <article key={doc.id} className="notebook-doc-card">
            <input type="checkbox" className="notebook-doc-toggle" checked={selectedDocs.has(doc.id)} onChange={() => toggleDoc(doc.id)} aria-label={`Usar ${doc.name} como contexto`} title="La IA usará este documento" />
            <div className="notebook-source-icon"><FileText size={16} /></div>
            <div className="min-w-0 flex-1">
              <strong>{doc.name}</strong>
              <span className="notebook-doc-meta">{fmtSize(doc.size)} · {new Date(doc.createdAt).toLocaleDateString("es-MX")}</span>
            </div>
            <div className="notebook-doc-actions">
              <button type="button" onClick={() => window.open(`/api/documents/${doc.id}?userId=${encodeURIComponent(userId)}`, "_blank")} aria-label={`Abrir ${doc.name}`} title="Abrir documento"><ExternalLink size={15} /></button>
              <button type="button" onClick={() => onDeleteDoc(doc)} aria-label={`Eliminar ${doc.name}`} title="Eliminar"><Trash2 size={15} /></button>
            </div>
          </article>
        ))}
      </div>
      <div className="notebook-add-form"><span className="notebook-label">FUENTE DE TEXTO (OPCIONAL)</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Título, por ejemplo: MRUV" maxLength={80} /><textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Pega aquí el contenido de tu apunte..." rows={4} maxLength={12000} /><button type="button" onClick={addSource} disabled={!canAdd || sources.length >= 8}><Plus size={16} /> Agregar fuente de texto ({sources.length}/8)</button></div></aside>

      <section className="notebook-chat"><div className="notebook-panel-heading"><div><span className="notebook-label">02 / CONVERSACIÓN</span><h2>Pregunta lo que quieras</h2></div><button className="notebook-clear" type="button" onClick={() => setMessages([])} disabled={!messages.length}><Trash2 size={15} /> Limpiar</button></div><div className="notebook-chat-window">{messages.length === 0 ? <div className="notebook-empty"><div className="notebook-empty-icon"><Bot size={27} /></div><h3>Tu tutor está listo.</h3><p>Empieza con algo como:</p><div className="notebook-suggestions"><button type="button" onClick={() => setQuestion("Resume las ideas principales de mis documentos")}>“Resume mis documentos”</button><button type="button" onClick={() => setQuestion("¿Qué conceptos debo recordar para el examen?")}>“¿Qué debo recordar para el examen?”</button><button type="button" onClick={() => setQuestion("Hazme tres preguntas para practicar")}>“Hazme tres preguntas para practicar”</button></div></div> : messages.map((message, index) => <div key={`${message.role}-${index}`} className={`notebook-message ${message.role}`}><div className="notebook-message-avatar">{message.role === "assistant" ? <Bot size={16} /> : <UserRound size={16} />}</div><div><span>{message.role === "assistant" ? "Notebook CECyT" : "Tú"}</span><p>{message.content}</p></div></div>)}{busy && <div className="notebook-message assistant"><div className="notebook-message-avatar"><Bot size={16} /></div><div><span>Notebook CECyT</span><p className="notebook-thinking"><Loader2 size={16} /> Estoy leyendo tus documentos y conectando las ideas...</p></div></div>}</div>{error && <p className="notebook-error">{error}</p>}<form className="notebook-composer" onSubmit={ask}><textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={hasContext ? "Pregunta sobre tus documentos y fuentes..." : "Primero sube un documento o agrega una fuente"} rows={2} disabled={!hasContext || busy} /><button type="submit" disabled={!canAsk} aria-label="Enviar pregunta"><Send size={16} /></button></form></section>
    </main>
  </div>;
}
