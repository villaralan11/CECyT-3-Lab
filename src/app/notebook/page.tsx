"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Bot, FileText, Loader2, Plus, Send, Sparkles, Trash2, UserRound, X } from "lucide-react";

type Source = { id: string; title: string; content: string };
type Message = { role: "user" | "assistant"; content: string };

const STARTER_SOURCES: Source[] = [
  { id: "starter-fisica", title: "Apunte de ejemplo · Física", content: "En un tiro parabólico, la componente horizontal de la velocidad permanece constante si se desprecia la resistencia del aire. En el punto más alto, la velocidad vertical es cero." },
];

function SourceCard({ source, onRemove }: { source: Source; onRemove: () => void }) {
  return <article className="notebook-source-card"><div className="notebook-source-icon"><FileText size={17} /></div><div className="min-w-0 flex-1"><strong>{source.title}</strong><p>{source.content}</p></div><button type="button" onClick={onRemove} aria-label={`Eliminar ${source.title}`}><X size={16} /></button></article>;
}

export default function NotebookPage() {
  const [sources, setSources] = useState<Source[]>(STARTER_SOURCES);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const canAdd = title.trim().length > 1 && content.trim().length > 15;
  const canAsk = question.trim().length > 2 && sources.length > 0 && !busy;
  const sourcePayload = useMemo(() => sources.map(({ title: sourceTitle, content: sourceContent }) => ({ title: sourceTitle, content: sourceContent })), [sources]);

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
      const response = await fetch("/api/notebook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: currentQuestion, sources: sourcePayload, messages }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo obtener una respuesta.");
      setMessages([...nextMessages, { role: "assistant", content: data.answer }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Ocurrió un error.");
      setMessages(messages);
    } finally { setBusy(false); }
  };

  return <div className="notebook-page"><section className="notebook-hero"><div className="notebook-hero-copy"><span className="notebook-eyebrow"><Sparkles size={14} /> NOTEBOOK CECYT · IA CON TUS FUENTES</span><h1>Estudia con una IA que <em>sí conoce tus apuntes.</em></h1><p>Agrega tus notas, guías o textos. Después pregunta, pide explicaciones y conecta ideas sin salir de tu laboratorio virtual.</p><div className="notebook-hero-pills"><span><BookOpen size={14} /> Basada en tus fuentes</span><span><Bot size={14} /> Tutor paso a paso</span></div></div><div className="notebook-orbit-card"><div className="notebook-orbit"><span>?</span></div><small>Tu cuaderno inteligente</small><strong>Pregunta. Comprende. Avanza.</strong></div></section>

    <main className="notebook-layout"><aside className="notebook-sources"><div className="notebook-panel-heading"><div><span className="notebook-label">01 / FUENTES</span><h2>Tu cuaderno</h2></div><span className="notebook-count">{sources.length}/8</span></div><p className="notebook-muted">Pega apuntes o fragmentos de tus clases para que la IA responda con ese contexto.</p><div className="notebook-source-list">{sources.map((source) => <SourceCard key={source.id} source={source} onRemove={() => setSources((current) => current.filter((item) => item.id !== source.id))} />)}</div><div className="notebook-add-form"><span className="notebook-label">NUEVA FUENTE</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Título, por ejemplo: MRUV" maxLength={80} /><textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Pega aquí el contenido de tu apunte..." rows={5} maxLength={12000} /><button type="button" onClick={addSource} disabled={!canAdd || sources.length >= 8}><Plus size={16} /> Agregar fuente</button></div></aside>

      <section className="notebook-chat"><div className="notebook-panel-heading"><div><span className="notebook-label">02 / CONVERSACIÓN</span><h2>Pregunta lo que quieras</h2></div><button className="notebook-clear" type="button" onClick={() => setMessages([])} disabled={!messages.length}><Trash2 size={15} /> Limpiar</button></div><div className="notebook-chat-window">{messages.length === 0 ? <div className="notebook-empty"><div className="notebook-empty-icon"><Bot size={27} /></div><h3>Tu tutor está listo.</h3><p>Empieza con algo como:</p><div className="notebook-suggestions"><button type="button" onClick={() => setQuestion("Explícame esta idea con un ejemplo sencillo")}>“Explícame esta idea con un ejemplo”</button><button type="button" onClick={() => setQuestion("¿Qué conceptos debo recordar para el examen?")}>“¿Qué debo recordar para el examen?”</button><button type="button" onClick={() => setQuestion("Hazme tres preguntas para practicar")}>“Hazme tres preguntas para practicar”</button></div></div> : messages.map((message, index) => <div key={`${message.role}-${index}`} className={`notebook-message ${message.role}`}><div className="notebook-message-avatar">{message.role === "assistant" ? <Bot size={16} /> : <UserRound size={16} />}</div><div><span>{message.role === "assistant" ? "Notebook CECyT" : "Tú"}</span><p>{message.content}</p></div></div>)}{busy && <div className="notebook-message assistant"><div className="notebook-message-avatar"><Bot size={16} /></div><div><span>Notebook CECyT</span><p className="notebook-thinking"><Loader2 size={16} /> Estoy conectando las ideas de tus fuentes...</p></div></div>}</div>{error && <p className="notebook-error">{error}</p>}<form className="notebook-composer" onSubmit={ask}><textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={sources.length ? "Pregunta sobre tus fuentes..." : "Primero agrega una fuente"} rows={2} disabled={!sources.length || busy} /><button type="submit" disabled={!canAsk} aria-label="Enviar pregunta"><Send size={18} /></button></form><p className="notebook-disclaimer">La IA responde con tus fuentes y puede equivocarse. Revisa siempre las fórmulas y procedimientos.</p></section></main><div className="notebook-back"><Link href="/">← Volver al laboratorio</Link></div></div>;
}
