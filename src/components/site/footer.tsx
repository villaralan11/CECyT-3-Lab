import Link from "next/link";
import { ArrowUpRight, Atom, FlaskConical, Languages } from "lucide-react";

const FOOTER_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Física", href: "/fisica" },
  { label: "Química", href: "/quimica" },
  { label: "Inglés", href: "/ingles" },
  { label: "Laboratorios", href: "/laboratorios" },
  { label: "Retos", href: "/retos" },
  { label: "Progreso", href: "/progreso" },
];

export function Footer() {
  return (
    <footer data-site-chrome="" className="lab-footer">
      <div className="lab-footer-topline"><span>CECyT No. 3 <i>×</i> IPN</span><span>APRENDER HACIENDO / DESDE 2026</span></div>
      <div className="lab-footer-main">
        <div className="lab-footer-brand">
          <div className="lab-footer-logo"><img src="/cecyt3-logo.png" alt="Escudo del CECyT No. 3" width={44} height={44} /></div>
          <div className="lab-footer-name"><strong>LAB.</strong><span>CECyT No. 3</span></div>
          <p>Un laboratorio virtual para explorar, experimentar y comprender.</p>
          <div className="lab-footer-subjects"><span><Atom size={14} /> Física</span><span><FlaskConical size={14} /> Química</span><span><Languages size={14} /> Inglés</span></div>
        </div>
        <div className="lab-footer-navigation"><span className="lab-footer-label">EXPLORA LA PLATAFORMA</span><div>{FOOTER_LINKS.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}</div></div>
        <div className="lab-footer-institution"><span className="lab-footer-label">INSTITUCIÓN</span><a href="https://www.cecyt3.ipn.mx" target="_blank" rel="noopener noreferrer">Sitio oficial CECyT No. 3 <ArrowUpRight size={14} /></a><a href="https://www.ipn.mx" target="_blank" rel="noopener noreferrer">Instituto Politécnico Nacional <ArrowUpRight size={14} /></a><p>CECyT No. 3 «Estanislao Ramírez Ruiz»<br />Ecatepec de Morelos, Estado de México</p></div>
      </div>
      <div className="lab-footer-bottom"><span>© 2026 · CECyT No. 3 Lab · IPN</span><span>HECHO PARA APRENDER DIFERENTE <i>●</i></span></div>
    </footer>
  );
}
